import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { DiscoveryAttributes } from "@app/common/dto/map/dto/discoveryAttributes.dto";
import { lastValueFrom } from "rxjs";
import { XMLParser } from "fast-xml-parser"
import { MCRasterRecordDto, RecordsResDto } from "@app/common/dto/libot/dto/recordsRes.dto";
import { AxiosResponse } from "axios";
import { ImportAttributes } from "@app/common/dto/map/dto/importAttributes.dto";
import { ImportPayload } from "@app/common/dto/libot/dto/import-payload";
import { ImportResPayload } from "@app/common/dto/libot/dto/import-res-payload";
import { MapError } from "@app/common/dto/map/utils/map-error";
import { ErrorCode } from "@app/common/dto/error";
import { ConfigService } from "@nestjs/config";
import { Geometry } from "@turf/turf";
import { MapProductResDto } from "@app/common/dto/map/dto/map-product-res.dto";
import { LibotExportStatusEnum } from "@app/common/database/entities";


@Injectable()
export class LibotHttpClientService {

  private readonly logger = new Logger(LibotHttpClientService.name);
  private RETRY_COUNT = Number(this.env.get("RETRY_COUNT") ?? 3)
  private WAIT_TIME = Number(this.env.get("WAIT_TIME") ?? 0.3)
  private EXPONENTIAL_TIMES = this.env.get<string>("EXPONENTIAL_TIMES")?.split(',').map(Number).filter(num => !isNaN(num)) ?? [0.3, 5, 15]
  private PRODUCTS_STALE_AFTER = Number(this.env.get<string>("PRODUCTS_STALE_AFTER") ?? 3) * 1000 * 60  // PRODUCTS_STALE_AFTER in minutes
  private USE_PRODUCTS_CACHE = this.env.get<string>("USE_PRODUCTS_CACHE") === "false" ? false : true // A flag if using cache for products
  private productsCache: MapProductResDto[];
  private productsCacheTimeSet: number;

  constructor(
    private readonly env: ConfigService,
    private readonly httpConfig: HttpService
  ) {
    httpConfig.axiosRef.defaults.headers = {
      ...this.httpConfig.axiosRef.defaults.headers,
      "X-API-KEY": this.env.get<string>("TOKEN_LIBOT"),
    } as any
  }

  // Http requests
  async getRecords(dAttrs: DiscoveryAttributes, noCache: boolean = false): Promise<MapProductResDto[]> {

    if (this.USE_PRODUCTS_CACHE && this.productsCache?.length > 0 && !this.isProductCacheStale() && !noCache) {
      this.logger.log(`Return ${this.productsCache.length} records from cache`)
      return this.productsCache
    }

    const url = this.env.get<string>("LIBOT_DISCOVERY_URL")
    let startPos = 1
    let productsRes: MapProductResDto[] = []

    while (startPos > 0) {

      this.logger.log(`Get records from libot from position ${startPos}`)

      const body = this.constructXmlBody(dAttrs, startPos)

      try {

        const res = await lastValueFrom(this.httpConfig.post(url, body, this.getHeaders("xml")))
        if (this.isResSuccess(res, "getRecords")) {

          let results: RecordsResDto = this.xmlToJson(res.data) ?? []
          const records: MCRasterRecordDto | MCRasterRecordDto[] = results["csw:GetRecordsResponse"]["csw:SearchResults"]["mc:MCRasterRecord"] ?? []

          if (Array.isArray(records)) {
            productsRes = [...productsRes, ...records.map(r => MapProductResDto.fromRecordsRes(r))]
          } else {
            productsRes.push(MapProductResDto.fromRecordsRes(records))
          }
          startPos = results["csw:GetRecordsResponse"]["csw:SearchResults"].nextRecord
        } else {
          const mes = `Error occurs in getRecord req!`
          let extMes = mes
          if (this.isThereErrorMes(res?.data)) {
            extMes = `${extMes} - mes: ${this.errorFromRes(res?.data)}`
          } else {
            extMes = `${extMes} - mes: ${JSON.stringify(res?.data)}`
          }
          this.logger.error(extMes)
          throw new MapError(ErrorCode.GET_RECORDS_FAILED, mes)
        }
      } catch (error) {
        if (error instanceof MapError) {
          throw error
        } else {
          const mes = `Get record req failed! HTTP StatusCode: ${error?.response?.status ?? error.code}, mes: ${error.toString()}`
          let extMes = mes;
          if (error.response?.data && this.isThereErrorMes(error.response.data)) {
            extMes = `${extMes} -  ${this.errorFromRes(error.response.data)}`
          } else {
            extMes = `${extMes} - ${error?.response?.data?.message}`
          }
          this.logger.error(extMes)
          throw new MapError(ErrorCode.MAP_EXPORT_FAILED, mes)
        }
      }
    }

    this.logger.debug(`received ${productsRes.length} records from libot `)

    this.productsCache = productsRes
    this.productsCacheTimeSet = Date.now()
    return this.productsCache
  }

  async exportStampMap(imAttrs: ImportAttributes) {

    this.logger.log("Execute export map to libot")

    const url = this.env.get<string>("LIBOT_EXPORT_URL")

    const payload = ImportPayload.fromImportAttrs(imAttrs)

    try {
      const res = await lastValueFrom(this.httpConfig.post(url, payload, this.getHeaders("json")))

      const resPayload = ImportResPayload.fromImportRes(res.data)
      this.logger.debug(`export map with bbox ${imAttrs.Points} sent successfully, job id - ${resPayload.id}`)
      return resPayload
    } catch (error) {
      const mes = `Export map failed! HTTP StatusCode: ${error?.response?.status ?? error.code}, mes: ${error.toString()}`
      const extMes = `${mes} - ${error?.response.data?.message ?? error?.response.data?.message}`
      this.logger.error(extMes)
      throw new MapError(ErrorCode.MAP_EXPORT_FAILED, mes)
    }

  }

  async getMapStatus(reqId: number) {
    this.logger.log(`Get import status for job id ${reqId} from libot`)

    const url = this.env.get<string>("LIBOT_EXPORT_URL") + "/" + reqId

    try {

      const res = await lastValueFrom(this.httpConfig.get(url, this.getHeaders("json")));

      const resPayload = ImportResPayload.fromImportRes(res.data)
      this.logger.debug(`Status for map with job id ${reqId} is - ${resPayload.status} ${resPayload.status == LibotExportStatusEnum.IN_PROGRESS ? ", progress: " + resPayload.progress : ""}`)
      return resPayload
    } catch (error) {
      const mes = `"Get map status" req failed! HTTP StatusCode: ${error?.response?.status ?? error.code}, mes: ${error.toString()}`
      const extMes = `${mes} - ${error?.response.data?.message ?? error?.response.data?.message}`
      this.logger.error(extMes)
      throw new MapError(ErrorCode.MAP_EXPORT_FAILED, mes)
    }
  }

  async getActualFootPrint(url: string): Promise<Geometry> {
    this.logger.log(`Extract the actual footprint from map json file`)
    const res = await (await lastValueFrom(this.httpConfig.get(url))).data
    return res.footprint
  }

  // Http requests helpers
  isProductCacheStale(): boolean {
    const dateNow = Date.now()
    return dateNow - this.productsCacheTimeSet > this.PRODUCTS_STALE_AFTER
  }

  getHeaders(cType: "json" | "xml") {
    const headers = {
      "Content-Type": `application/${cType}`
    }
    return { headers }
  }

  isResSuccess(res: AxiosResponse<any, any>, reqName?: string): boolean {
    const isSuccess = (res.status >= 200 && res.status < 300) && !this.isThereErrorMes(res.data)
    this.logger.log(`"${reqName}" req is ${isSuccess ? "success" : "finished with error"}`)
    return isSuccess
  }

  isThereErrorMes(data: any): boolean {
    return data.includes("ExceptionReport")
  }

  xmlToJson(xml: string) {
    const data = new XMLParser({
      ignoreAttributes: false,
      allowBooleanAttributes: true,
      attributeNamePrefix: ""
    }).parse(xml)

    return data
  }

  errorFromRes(xml: string): string {
    const json = this.xmlToJson(xml)
    const error = json?.["ows:ExceptionReport"]?.["ows:Exception"] ?? json?.["ows20:ExceptionReport"]?.["ows20:Exception"]
    // const error = json?.["ows:ExceptionReport"]?.["ows:Exception"]?.["ows:ExceptionText"]

    if (error) {
      return JSON.stringify(error)
    }
    return json
  }

  constructXmlBody(mapAttrs: DiscoveryAttributes, startPos: number) {
    if (!mapAttrs.ingestionDate) {
      return this.getRecordsExlNoFilter(startPos)
    }

    // offering for import create flow
    if (mapAttrs.BBox) {
      return this.getRecordsExlWithBBoxFilter(mapAttrs, startPos)
    }

    // offering for discovery flow
    return this.getRecordsExlWithFilter(mapAttrs, startPos)
  }

  getRecordsExlNoFilter(startPos: number) {
    return `<csw:GetRecords xmlns="http://www.opengis.net/cat/csw/2.0.2"
    xmlns:csw="http://www.opengis.net/cat/csw/2.0.2"
    xmlns:ogc="http://www.opengis.net/ogc"
    xmlns:gml="http://www.opengis.net/gml"
    xmlns:ows="http://www.opengis.net/ows"
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:dct="http://purl.org/dc/terms/"
    xmlns:mc="http://schema.mapcolonies.com"
    xmlns:gmd="http://www.isotc211.org/2005/gmd"
    xmlns:gco="http://www.isotc211.org/2005/gco" 
    service="CSW" version="2.0.2" resultType="results" outputSchema="http://schema.mapcolonies.com/raster" startPosition="${startPos}">
    <csw:Query typeNames="csw:Record">
        <csw:ElementSetName>full</csw:ElementSetName>
    </csw:Query>
    </csw:GetRecords>`
  }

  getRecordsExlWithFilter(mapAttrs: DiscoveryAttributes, startPos: number) {
    return `<csw:GetRecords 
    xmlns:csw="http://www.opengis.net/cat/csw/2.0.2" 
    xmlns:ogc="http://www.opengis.net/ogc" 
    xmlns:mc="http://schema.mapcolonies.com/raster"
    service="CSW" version="2.0.2"
    maxRecords="25"  startPosition="${startPos}" 
    outputSchema="http://schema.mapcolonies.com/raster" >
    <csw:Query typeNames="mc:MCRasterRecord">
    <csw:ElementSetName>full</csw:ElementSetName>
        <csw:Constraint version="1.1.0">
        <Filter xmlns="http://www.opengis.net/ogc">
        <And>
            <PropertyIsEqualTo>
                <PropertyName>mc:productType</PropertyName>
                <Literal>Orthophoto</Literal>
            </PropertyIsEqualTo>
            <PropertyIsEqualTo>
                <PropertyName>mc:transparency</PropertyName>
                <Literal>OPAQUE</Literal>
            </PropertyIsEqualTo>
            <PropertyIsGreaterThan>
                <PropertyName>mc:ingestionDate</PropertyName>
                <Literal>${mapAttrs.IngestionDate}</Literal>
            </PropertyIsGreaterThan>
            <PropertyIsLessThanOrEqualTo>
                <PropertyName>mc:maxResolutionDeg</PropertyName>
                <Literal>${mapAttrs.ResolutionDeg}</Literal>
            </PropertyIsLessThanOrEqualTo>
        </And>
    </Filter>
    </csw:Constraint>
    <ogc:SortBy>
        <ogc:SortProperty>
            <ogc:PropertyName>mc:ingestionDate</ogc:PropertyName>
            <ogc:SortOrder>DESC</ogc:SortOrder>
        </ogc:SortProperty>
    </ogc:SortBy>
    </csw:Query>
    </csw:GetRecords>`
  }

  getRecordsExlWithBBoxFilter(mapAttrs: DiscoveryAttributes, startPos: number) {
    return `<csw:GetRecords 
    xmlns:csw="http://www.opengis.net/cat/csw/2.0.2" 
    xmlns:ogc="http://www.opengis.net/ogc" 
    xmlns:gml="http://www.opengis.net/gml"
    xmlns:ows="http://www.opengis.net/ows"
    xmlns:mc="http://schema.mapcolonies.com/raster"
    service="CSW" version="2.0.2"
    maxRecords="25"  startPosition="${startPos}" 
    outputSchema="http://schema.mapcolonies.com/raster" >
    <csw:Query typeNames="mc:MCRasterRecord">
    <csw:ElementSetName>full</csw:ElementSetName>
        <csw:Constraint version="1.1.0">
        <Filter xmlns="http://www.opengis.net/ogc">
        <And>
            <PropertyIsEqualTo>
                <PropertyName>mc:productType</PropertyName>
                <Literal>Orthophoto</Literal>
            </PropertyIsEqualTo>
            <PropertyIsEqualTo>
                <PropertyName>mc:transparency</PropertyName>
                <Literal>OPAQUE</Literal>
            </PropertyIsEqualTo>
            <PropertyIsGreaterThan>
                <PropertyName>mc:ingestionDate</PropertyName>
                <Literal>${mapAttrs.IngestionDate}</Literal>
            </PropertyIsGreaterThan>
            <PropertyIsLessThanOrEqualTo>
                <PropertyName>mc:maxResolutionDeg</PropertyName>
                <Literal>${mapAttrs.ResolutionDeg}</Literal>
            </PropertyIsLessThanOrEqualTo>
            <ogc:BBOX>
                <ogc:PropertyName>ows:BoundingBox</ogc:PropertyName>
                <gml:Envelope srsName="${mapAttrs.CRS}">
                    <gml:lowerCorner>${mapAttrs.BBox[1]} ${mapAttrs.BBox[0]}</gml:lowerCorner>
                    <gml:upperCorner>${mapAttrs.BBox[3]} ${mapAttrs.BBox[2]}</gml:upperCorner>
                </gml:Envelope>
            </ogc:BBOX>
        </And>
    </Filter>
    </csw:Constraint>
    <ogc:SortBy>
        <ogc:SortProperty>
            <ogc:PropertyName>mc:ingestionDate</ogc:PropertyName>
            <ogc:SortOrder>DESC</ogc:SortOrder>
        </ogc:SortProperty>
    </ogc:SortBy>
    </csw:Query>
    </csw:GetRecords>`
  }

  async reqAndRetry<T>(fn: () => Promise<T>, name?: string, exponential: boolean = false) {
    let err: any;
    for (let i = 0; i < this.RETRY_COUNT; i++) {
      try {
        this.logger.log(`start ${name} req`)
        return await fn()
      } catch (error) {
        err = error
        const waitTime = exponential ? this.EXPONENTIAL_TIMES[i] : this.WAIT_TIME
        this.logger.error(`${name} req failed ! retrying ... in ${waitTime} sec`)
        await this.sleep(waitTime * 1000)
      }
    }
    throw err
  }

  async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}