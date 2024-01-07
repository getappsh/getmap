import { DiscoveryAttributes } from '../libot-dto/discoveryAttributes.dto';
import { LibotHttpClientService } from './http-client.service';
import { ImportAttributes } from '../libot-dto/importAttributes.dto';
import { MapProductResDto } from '@app/common/dto/map/dto/map-product-res.dto';
import { MapError } from '../utils/map-error';
import { ErrorCode } from '@app/common/dto/error';
import { Validators } from '../utils/validators';
import { MCRasterRecordDto } from '../libot-dto/recordsRes.dto';
import { ResolutionMapper } from '../libot-dto/resolutionMapper';
import { RepoService } from './repo.service';
import { Injectable, Logger } from '@nestjs/common';
import { ImportResPayload } from '@app/common/dto/libot/import-res-payload';
import { MapEntity } from '@app/common/database/entities';

@Injectable()
export class ImportCreateService {

  private readonly logger = new Logger(ImportCreateService.name);

  constructor(
    private readonly libot: LibotHttpClientService,
    private readonly repo: RepoService,
  ) { }


  isValidBbox(BBox: number[]) {
    this.logger.debug("checked is bbox area valid")

    if (!Validators.isBBoxAreaValid(BBox)) {
      // const mes = "אזור גדול מדי להפצה, הקטן את הבקשה ונסה שנית"
      const mes = "Area too large to distribute, reduce request and try again"
      this.logger.error(mes)
      throw new MapError(ErrorCode.MAP_AREA_TOO_LARGE, mes)
    }
  }

  async selectProduct(importAttrs: ImportAttributes): Promise<MapProductResDto> {

    this.logger.debug("selecting product for given bbox")

    const discoverAttrs = new DiscoveryAttributes()
    discoverAttrs.BoundingBox = importAttrs.BoundingBox

    const records = await this.libot.getRecords(discoverAttrs)
    const availableProducts = records.map(record => MapProductResDto.fromRecordsRes(record))
    let selectedProduct: MapProductResDto;

    if (!availableProducts || availableProducts.length == 0) {
      const mes = `Libot catalog returned no results, BBOX: '${discoverAttrs.BoundingBox}' is probably invalid!`
      this.logger.error(mes)
      throw new MapError(ErrorCode.MAP_BBOX_INVALID, mes)
    }

    availableProducts.forEach(product => {
      if (!Validators.isBBoxInFootprint(importAttrs.BoundingBox, product.footprint)) {
        this.logger.warn(`SelectProduct - BBOX ${importAttrs.BoundingBox} is not contained in ${product.productName} footprint ${product.footprint}`)
        return
      }
      selectedProduct = product
    })

    if (!selectedProduct) {
      const mes = `The requested bbox ${importAttrs.BoundingBox} is not contained in any polygon`
      this.logger.error(mes)
      throw new MapError(ErrorCode.MAP_BBOX_NOT_IN_POLYGON, mes)
    }

    return selectedProduct
  }

  async executeExport(importAttrs: ImportAttributes, map: MapEntity) {
    const resData = await this.libot.exportStampMap(importAttrs)    
    this.repo.saveExportRes(resData, map)
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

}
