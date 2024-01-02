import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { DiscoveryAttributes } from "../libot-dto/discoveryAttributes.dto";
import { lastValueFrom } from "rxjs";
import { toJson } from "xml2json"
import { MCRasterRecordDto, RecordsResDto } from "../libot-dto/recordsRes.dto";
import { AxiosResponse } from "axios";


@Injectable()
export class LibotHttpClientService {
  private readonly logger = new Logger(LibotHttpClientService.name);


  constructor(private readonly httpConfig: HttpService) {
    httpConfig.axiosRef.defaults.baseURL = process.env.LIBOT_BASE_URL
    httpConfig.axiosRef.defaults.headers = {
      ...this.httpConfig.axiosRef.defaults.headers,
      "X-API-KEY": process.env.TOKEN_LIBOT,
      "Content-Type": "application/xml"
    } as any
  }

  async getRecords(mapAttrs: DiscoveryAttributes): Promise<MCRasterRecordDto[]> {
    let startPos = 1
    let productsRes: MCRasterRecordDto[] = []
    while (startPos > 0) {

      this.logger.debug(`Get records from libot from position ${startPos}`)

      const body = this.constructXmlBody(mapAttrs, startPos)

      const res = await lastValueFrom(this.httpConfig.post("", body))

      if (this.isResSuccess(res, "getRecords")) {

        let results: RecordsResDto = JSON.parse(this.xmlToJson(res.data))
        const records: MCRasterRecordDto | MCRasterRecordDto[] = results["csw:GetRecordsResponse"]["csw:SearchResults"]["mc:MCRasterRecord"]

        if (Array.isArray(records)) {
          productsRes = [...productsRes, ...records]
        } else {
          productsRes.push(records)
        }
        startPos = results["csw:GetRecordsResponse"]["csw:SearchResults"].nextRecord
      } else {
        if (this.isThereErrorMes) {
          const error = this.xmlToJson(res.data)
          this.logger.error(`Error occurs in getRecord req`, error)
          throw new Error(error)
        } else {
          throw new Error(`Error occurs in getRecord req! HTTP StatusCode: ${res.status}, Message: ${res.data}`)
        }


      }
    }

    return productsRes

  }

  isResSuccess(res: AxiosResponse<any, any>, reqName?: string): boolean {
    const isSuccess = (res.status >= 200 && res.status < 300) && !this.isThereErrorMes(res)
    this.logger.debug(`${reqName} req is ${isSuccess ? "success" : "finished with error"}`)
    return isSuccess
  }

  isThereErrorMes(res: AxiosResponse): boolean {
    const data: string = res.data
    return data.includes("ExceptionReport")
  }

  xmlToJson(xml: string): string {
    return toJson(xml)
  }

  constructXmlBody(mapAttrs: DiscoveryAttributes, startPos: number) {
    if (!mapAttrs.IngestionDate) {
      return this.getRecordsExlNoFilter(startPos)
    }

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
}