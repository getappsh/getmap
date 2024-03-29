import { DiscoveryAttributes } from '@app/common/dto/map/dto/discoveryAttributes.dto';
import { LibotHttpClientService } from './http-client.service';
import { ImportAttributes } from '@app/common/dto/map/dto/importAttributes.dto';
import { MapProductResDto } from '@app/common/dto/map/dto/map-product-res.dto';
import { MapError } from '@app/common/dto/map/utils/map-error';
import { ErrorCode } from '@app/common/dto/error';
import { Validators } from '@app/common/dto/map/utils/validators';
import { ResolutionMapper } from '@app/common/dto/map/utils/resolutionMapper';
import { RepoService } from './repo.service';
import { Injectable, Logger } from '@nestjs/common';
import { MapEntity } from '@app/common/database/entities';
import { ImportResPayload } from '@app/common/dto/libot/dto/import-res-payload';
import { MCRasterRecordDto } from '@app/common/dto/libot/dto/recordsRes.dto';
import { Feature, Polygon, MultiPolygon } from '@turf/turf';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImportCreateService {

  private readonly logger = new Logger(ImportCreateService.name);

  constructor(
    private readonly env: ConfigService,
    private readonly libot: LibotHttpClientService,
    private readonly repo: RepoService,
  ) { }


  async isValidBbox(attrs: ImportAttributes) {
    this.logger.debug("checked if area size is valid")

    const { MaxMapAreaSqKm } = await this.repo.getMapConfig()

    if (!Validators.isPolygonAreaValid(attrs.Polygon, MaxMapAreaSqKm)) {
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
    this.logger.verbose(`Received products - ${JSON.stringify(availableProducts)}`)

    let selectedProduct: MapProductResDto;

    if (!availableProducts || availableProducts.length == 0) {
      const mes = `Libot catalog returned no results, BBOX: '${discoverAttrs.BoundingBoxToSting}' is probably invalid!`
      this.logger.error(mes)
      throw new MapError(ErrorCode.MAP_BBOX_INVALID, mes)
    }
    selectedProduct = await this.extractMostCompatibleProduct(availableProducts, importAttrs)

    if (!selectedProduct) {
      const mes = `The requested bbox ${importAttrs.Points} is not contained in any polygon`
      this.logger.error(mes)
      throw new MapError(ErrorCode.MAP_BBOX_NOT_IN_POLYGON, mes)
    }

    return selectedProduct
  }

  async extractMostCompatibleProduct(products: MapProductResDto[], attrs: ImportAttributes): Promise<MapProductResDto> {
    this.logger.log(`select product according inclusion size`)
    this.logger.verbose(`Check footprint ${attrs.Points}`)

    const { mapMinInclusionInPercentages } = await this.repo.getMapConfig()
    let selectedProduct: MapProductResDto;
    let recentAvailProduct: MapProductResDto;
    let sumInclusion: number = 0
    let availPoly: Feature<Polygon | MultiPolygon> | null

    for (let i = 0; i < products.length; i++) {
      // // if contains the full polygon return it
      // if (Validators.isBBoxInFootprint(attrs.Polygon, JSON.parse(products[i].footprint))) {
      //   selectedProduct = products[i]
      //   break
      // }

      // if it partial inclusion return the biggest inclusion if it more then @MIN_INCLUSION or the most recent
      if ((availPoly = Validators.isBBoxIntersectFootprint(attrs.Polygon, JSON.parse(products[i].footprint)))) {

        if (!recentAvailProduct) {
          recentAvailProduct = products[i]
        }

        const cSumInclusion = Validators.getIntersectPercentage(attrs.Polygon, availPoly)
        this.logger.verbose(`Checking map against product info - ${JSON.stringify({cSumInclusion, product: products[i]})}`)
        
        if (cSumInclusion >= mapMinInclusionInPercentages) {
          selectedProduct = products[i]
          sumInclusion = cSumInclusion
          break
        }
      }
    }

    if (selectedProduct) {
      if (!sumInclusion) {
        this.logger.debug(`select product ${selectedProduct.productName}, type - ${selectedProduct.productType}, ingestion Date - ${selectedProduct.ingestionDate} with full inclusion`)
      } else {
        this.logger.debug(`select product ${selectedProduct.productName}, type - ${selectedProduct.productType}, ingestion Date - ${selectedProduct.ingestionDate} with ${sumInclusion} inclusion`)
      }
    } else if (recentAvailProduct) {
      this.logger.debug(`select most updated product ${recentAvailProduct.productName}, type - ${recentAvailProduct.productType}, ingestion Date - ${recentAvailProduct.ingestionDate} with any inclusion`)
    } else {
      this.logger.warn(`map there is no intersect with any product`)
    }

    return selectedProduct ? selectedProduct : recentAvailProduct
  }

  async executeExport(importAttrs: ImportAttributes, map: MapEntity) {
    try {
      const resData = await this.libot.reqAndRetry<ImportResPayload>(async () => await this.libot.exportStampMap(importAttrs), "Export map", true)

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

    importAttrs.product = product
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
