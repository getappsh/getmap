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
import { Feature, Geometry, MultiPolygon } from "@turf/turf";


@Injectable()
export class LibotEmuHttpClientService {

  private readonly logger = new Logger(LibotEmuHttpClientService.name);
  private RETRY_COUNT = Number(this.env.get("RETRY_COUNT") ?? 3)
  private WAIT_TIME = Number(this.env.get("WAIT_TIME") ?? 0.3)
  private EXPONENTIAL_TIMES = this.env.get<string>("EXPONENTIAL_TIMES")?.split(',').map(Number).filter(num => !isNaN(num)) ?? [0.3, 5, 15]

  constructor(
    private readonly env: ConfigService,
    private readonly httpConfig: HttpService
  ) { }

  // Http requests
  async getRecords(dAttrs: DiscoveryAttributes): Promise<MCRasterRecordDto[]> {

    const url = this.env.get<string>("LIBOT_DISCOVERY_URL")
    let productsRes: MCRasterRecordDto[] = []


    this.logger.log(`Get records from libot Emulator`)

    const body = this.constructBody(dAttrs)

    try {

      const res = await lastValueFrom(this.httpConfig.post(url, body))

      const records: MCRasterRecordDto | MCRasterRecordDto[] = res.data ?? []

      if (Array.isArray(records)) {
        productsRes = [...productsRes, ...records]
      } else {
        productsRes.push(records)
      }

    } catch (error) {
      const mas = `Error occurs in getRecord req! HTTP StatusCode: ${error.code}, Message: ${error.message}`
      this.logger.error(`Export map failed! Got status code: ${error.code}, mes: ${error.message}`)
      throw new MapError(ErrorCode.MAP_EXPORT_FAILED, mas)
    }


    this.logger.debug(`received ${productsRes.length} records from libot emulator`)
    return productsRes
  }

  async exportStampMap(imAttrs: ImportAttributes) {

    this.logger.log("Execute export map to libot emulator")

    const url = this.env.get<string>("LIBOT_EXPORT_URL")

    const payload = ImportPayload.fromImportAttrs(imAttrs)
    try {
      const res = await lastValueFrom(this.httpConfig.post(url, payload, this.getHeaders("json")))
      const resPayload = ImportResPayload.fromImportRes(res.data)
      this.logger.debug(`export map with bbox ${imAttrs.Points} sent successfully, job id - ${resPayload.id}`)
      return resPayload
    } catch (error) {
      const mas = error.toString()
      this.logger.error(`Export map failed! Got status code: ${error.status}, mes: ${mas}`)
      throw new MapError(ErrorCode.MAP_EXPORT_FAILED, mas)
    }

  }

  async getMapStatus(reqId: number) {
    this.logger.log(`Get import status for job id ${reqId} from libot emulator`)

    const url = this.env.get<string>("LIBOT_EXPORT_URL") + "/" + reqId

    try {
      const res = await lastValueFrom(this.httpConfig.get(url, this.getHeaders("json")))
      const resPayload = ImportResPayload.fromImportRes(res.data)
      this.logger.debug(`Status for map with job id ${reqId} is - ${resPayload.status}`)
      return resPayload
    } catch (error) {
      const mas = error.toString()
      this.logger.error(`"Get map status" req failed! Got status code: ${error.status}, mes: ${mas}`)
      throw new MapError(ErrorCode.MAP_EXPORT_FAILED, mas)
    }
  }

  async getActualFootPrint(url: string): Promise<Geometry> {
    this.logger.log(`Extract the actual footprint from map json file`)
    const res = await (await lastValueFrom(this.httpConfig.get(url))).data
    return res.footprint
  }

  // Http requests helpers

  getHeaders(cType: "json" | "xml") {
    const headers = {
      "Content-Type": `application/${cType}`
    }
    return { headers }
  }

  constructBody(mapAttrs: DiscoveryAttributes) {
    // offering for import create flow
    if (mapAttrs.BBox) {
      const bbox = mapAttrs.BBox.join(",")
      const importAttrs = new ImportAttributes()
      importAttrs.Points = bbox
      return importAttrs.Polygon
    }
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