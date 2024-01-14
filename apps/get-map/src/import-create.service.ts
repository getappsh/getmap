import { DiscoveryAttributes } from '@app/common/dto/libot/discoveryAttributes.dto';
import { LibotHttpClientService } from './http-client.service';
import { ImportAttributes } from '@app/common/dto/libot/importAttributes.dto';
import { MapProductResDto } from '@app/common/dto/map/dto/map-product-res.dto';
import { MapError } from '@app/common/dto/libot/utils/map-error';
import { ErrorCode } from '@app/common/dto/error';
import { Validators } from '@app/common/dto/libot/utils/validators';
import { ResolutionMapper } from '@app/common/dto/libot/utils/resolutionMapper';
import { RepoService } from './repo.service';
import { Injectable, Logger } from '@nestjs/common';
import { MapEntity } from '@app/common/database/entities';
import { ImportResPayload } from '@app/common/dto/libot/import-res-payload';
import { MCRasterRecordDto } from '@app/common/dto/libot/recordsRes.dto';

@Injectable()
export class ImportCreateService {


  private readonly logger = new Logger(ImportCreateService.name);

  constructor(
    private readonly libot: LibotHttpClientService,
    private readonly repo: RepoService,
  ) { }


  isValidBbox(attrs: ImportAttributes) {
    this.logger.debug("checked if area size is valid")

    if ((attrs.pattern === "bbox" && !Validators.isBBoxAreaValid(attrs.BBox as number[])) ||
      attrs.pattern === "polygon" && !Validators.isPolygonAreaValid(attrs.Polygon)) {
      // const mes = "אזור גדול מדי להפצה, הקטן את הבקשה ונסה שנית"
      const mes = "Area too large to distribute, reduce request and try again"
      this.logger.error(mes)
      throw new MapError(ErrorCode.MAP_AREA_TOO_LARGE, mes)
    }
  }

  async selectProduct(importAttrs: ImportAttributes): Promise<MapProductResDto> {

    this.logger.debug("selecting product for given bbox")

    const discoverAttrs = new DiscoveryAttributes()

    discoverAttrs.BoundingBox = importAttrs.BBox

    const records = await this.libot.reqAndRetry<MCRasterRecordDto[]>(async () => await this.libot.getRecords(discoverAttrs), "Get records")
    const availableProducts = records.map(record => MapProductResDto.fromRecordsRes(record))

    let selectedProduct: MapProductResDto;

    if (!availableProducts || availableProducts.length == 0) {
      const mes = `Libot catalog returned no results, BBOX: '${discoverAttrs.BoundingBoxToSting}' is probably invalid!`
      this.logger.error(mes)
      throw new MapError(ErrorCode.MAP_BBOX_INVALID, mes)
    }

    availableProducts.forEach(product => {
      if (!Validators.isBBoxInFootprint(importAttrs.Points, product.footprint)) {
        this.logger.warn(`SelectProduct - BBOX ${importAttrs.Points} is not contained in ${product.productName} footprint ${product.footprint}`)
        return
      }
      selectedProduct = product
    })

    if (!selectedProduct) {
      const mes = `The requested bbox ${importAttrs.Points} is not contained in any polygon`
      this.logger.error(mes)
      throw new MapError(ErrorCode.MAP_BBOX_NOT_IN_POLYGON, mes)
    }

    return selectedProduct
  }

  async executeExport(importAttrs: ImportAttributes, map: MapEntity) {
    try {
      const resData = await this.libot.reqAndRetry<ImportResPayload>(async () => await this.libot.exportStampMap(importAttrs), "Export map")

      try {
        await this.repo.saveExportRes(resData, map)
      } catch (error) {
        this.logger.error(error.toString())
      }

      setTimeout(async () => {
        try {
          await this.handleGetMapStatus(resData.id, map)
        } catch (error) {
          this.logger.error(error.toString())
        }
      }, 5000)
      
    } catch (error) {
      this.logger.error(error.toString())
      this.repo.setErrorStatus(map, error.toString())
    }
  }

  completeAttrs(importAttrs: ImportAttributes, product: MapProductResDto) {

    this.logger.debug("completing attributes for import create req")

    importAttrs.ProductId = product.id
    importAttrs.TargetResolution = Math.max(product.maxResolutionDeg, Number(process.env.MC_MAX_RESOLUTION_DEG))
    importAttrs.MinResolutionDeg = Number(process.env.MC_MIN_RESOLUTION_DEG)
    this.completeResolution(importAttrs)
  }

  completeResolution(importAttrs: ImportAttributes) {
    if (importAttrs.TargetResolution > 0) {
      return
    }
    importAttrs.TargetResolution = ResolutionMapper.level2Resolution(importAttrs.ZoomLevel)
  }


  async handleGetMapStatus(jobId: number, map: MapEntity): Promise<MapEntity> {
    const res = await this.libot.getMapStatus(jobId)
    const updatedMap = await this.handleSaveExportRes(res, map)
    return updatedMap
  }

  async handleSaveExportRes(res: ImportResPayload, map?: MapEntity): Promise<MapEntity> {
    this.logger.debug(`save res data for jobId ${res.id}`)
    try {
      return await this.repo.saveExportRes(res, map)
    } catch (error) {
      this.logger.error(error.toString())
    }
  }

}
