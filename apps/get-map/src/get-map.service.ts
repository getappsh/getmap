import { DiscoveryMapDto } from '@app/common/dto/discovery';
import { CreateImportDto, CreateImportResDto } from '@app/common/dto/map';
import { MapOfferingStatus, OfferingMapResDto } from '@app/common/dto/offering';
import { Injectable, Logger } from '@nestjs/common';
import { DiscoveryAttributes } from '../libot-dto/discoveryAttributes.dto';
import { LibotHttpClientService } from './http-client.service';
import { MapProductResDto } from '@app/common/dto/map/dto/map-product-res.dto';
import { ImportAttributes } from '../libot-dto/importAttributes.dto';
import { Validators } from '../utils/validators';
import { ImportCreateService } from './import-create.service';
import { ErrorCode, ErrorDto } from '@app/common/dto/error';

@Injectable()
export class GetMapService {

  private readonly logger = new Logger(GetMapService.name);

  constructor(private readonly libot: LibotHttpClientService, private readonly create: ImportCreateService) { }

  async getOffering(discoverMap: DiscoveryMapDto): Promise<OfferingMapResDto> {
    const mapRes = new OfferingMapResDto
    try {
      const mapAttrs = new DiscoveryAttributes()
      // const mapAttrs = DiscoveryAttributes.fromDiscoverMapDto(discoverMap)

      const records = await this.libot.getRecords(mapAttrs)

      this.logger.debug("Processing records to response")

      mapRes.status = MapOfferingStatus.SUCCESS
      mapRes.products = records.map(record => MapProductResDto.fromRecordsRes(record))
    } catch (error) {
      mapRes.status = MapOfferingStatus.ERROR
      mapRes.error = this.throwErrorDto(ErrorCode.MAP_OTHER, error)
    }

    return mapRes
  }

  importCreate(importDto: CreateImportDto): CreateImportResDto {

    const importRes = new CreateImportResDto()

    const importAttrs = ImportAttributes.fromImportCreateDto(importDto)

    if (!Validators.isBBoxAreaValid(importAttrs.BBox)) {
      importRes.error = this.throwErrorDto(ErrorCode.MAP_AREA_TOO_LARGE, "אזור גדול מדי להפצה, הקטן את הבקשה ונסה שנית")
      return importRes
    }

    this.create.selectProduct(importAttrs)

    throw new Error('Method not implemented.');
  }

  importCancel() {
    throw new Error('Method not implemented.');
  }

  getImportStatus() {
    throw new Error('Method not implemented.');
  }

  throwErrorDto(code: ErrorCode, mes: string) {
    const error = new ErrorDto()
    error.errorCode = code
    error.message = mes.toString()
    return error
  }

}
