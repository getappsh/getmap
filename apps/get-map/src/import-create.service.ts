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
import { Feature, Polygon, MultiPolygon } from '@turf/turf';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImportCreateService {

  private MIN_INCLUSION = Number(this.env.get("MIN_INCLUSION_FOR_MAP") ?? 60)


  private readonly logger = new Logger(ImportCreateService.name);

  constructor(
    private readonly env: ConfigService,
    private readonly libot: LibotHttpClientService,
    private readonly repo: RepoService,
  ) { }


  async isValidBbox(attrs: ImportAttributes) {
    this.logger.debug("checked if area size is valid")

    const { maxMapSizeInMeter } = await this.repo.getMapConfig()

    if ((attrs.pattern === "bbox" && !Validators.isBBoxAreaValid(attrs.BBox as number[])) ||
      attrs.pattern === "polygon" && !Validators.isPolygonAreaValid(attrs.Polygon, maxMapSizeInMeter)) {
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
    selectedProduct = this.extractMostCompatibleProduct(availableProducts, importAttrs)

    if (!selectedProduct) {
      const mes = `The requested bbox ${importAttrs.Points} is not contained in any polygon`
      this.logger.error(mes)
      throw new MapError(ErrorCode.MAP_BBOX_NOT_IN_POLYGON, mes)
    }

    return selectedProduct
  }

  extractMostCompatibleProduct(products: MapProductResDto[], attrs: ImportAttributes): MapProductResDto {
    this.logger.log(`select product according inclusion size`)
    this.logger.debug(`Check footprint ${attrs.Points}`)

    let selectedProduct: MapProductResDto;
    let recentAvailProduct: MapProductResDto;
    let sumInclusion: number = 0
    let availPoly: Feature<Polygon | MultiPolygon> | null

    for (let i = 0; i < products.length; i++) {

      // if contains the full polygon return it
      if (Validators.isBBoxInFootprint(attrs.Polygon, JSON.parse(products[i].footprint))) {
        selectedProduct = products[i]
        break
      }

      // if it partial inclusion return the biggest inclusion if it more then @MIN_INCLUSION or the most recent
      if ((availPoly = Validators.isBBoxIntersectFootprint(attrs.Polygon, JSON.parse(products[i].footprint)))) {

        if (!recentAvailProduct) {
          recentAvailProduct = products[i]
        }

        const cSumInclusion = Validators.getIntersectPercentage(attrs.Polygon, availPoly)
        if (cSumInclusion >= this.MIN_INCLUSION &&
          Math.max(sumInclusion, cSumInclusion) === cSumInclusion) {
          selectedProduct = products[i]
          sumInclusion = cSumInclusion
        }
      }
    }

    if (selectedProduct) {
      if (!sumInclusion) {
        this.logger.debug(`select product ${selectedProduct.productName}, type - ${selectedProduct.productType} with full inclusion`)
      } else {
        this.logger.debug(`select product ${selectedProduct.productName}, type - ${selectedProduct.productType} with ${sumInclusion} inclusion`)
      }
    } else {
      this.logger.debug(`select most updated product ${recentAvailProduct.productName}, type - ${recentAvailProduct.productType} with any inclusion`)
    }
    return selectedProduct ? selectedProduct : recentAvailProduct
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

    importAttrs.productId = product.id
    importAttrs.targetResolution = Math.max(product.maxResolutionDeg, Number(this.env.get("MC_MAX_RESOLUTION_DEG")))
    importAttrs.minResolutionDeg = Number(this.env.get("MC_MIN_RESOLUTION_DEG"))
    this.completeResolution(importAttrs)
  }

  completeResolution(importAttrs: ImportAttributes) {
    if (importAttrs.targetResolution > 0) {
      return
    }
    importAttrs.targetResolution = ResolutionMapper.level2Resolution(importAttrs.zoomLevel)
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
