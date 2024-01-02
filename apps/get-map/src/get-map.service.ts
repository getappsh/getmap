import { DiscoveryMapDto } from '@app/common/dto/discovery';
import { CreateImportResDto } from '@app/common/dto/map';
import { MapOfferingStatus, OfferingMapResDto } from '@app/common/dto/offering';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { DiscoveryAttributes } from '../libot-dto/discoveryAttributes.dto';
import { LibotHttpClientService } from './http-client.service';
import { MapProductResDto } from '@app/common/dto/map/dto/map-product-res.dto';
import e from 'express';

@Injectable()
export class GetMapService {

  private readonly logger = new Logger(GetMapService.name);

  constructor(private readonly libot: LibotHttpClientService) { }

  async getOffering(discoverMap: DiscoveryMapDto): Promise<OfferingMapResDto> {
    const mapRes = new OfferingMapResDto
    try {
      const mapAttrs = DiscoveryAttributes.fromDiscoverMapDto(discoverMap)
      const records = await this.libot.getRecords(mapAttrs)

      this.logger.debug("Processing record to response")

      mapRes.status = MapOfferingStatus.SUCCESS
      mapRes.products = records.map(record => MapProductResDto.fromRecordsRes(record))
    } catch (error) {
      mapRes.status = MapOfferingStatus.ERROR
      mapRes.reason = error.toString()
    }

    return mapRes
  }

  importCreate(): CreateImportResDto {
    throw new Error('Method not implemented.');
  }

  importCancel() {
    throw new Error('Method not implemented.');
  }

  getImportStatus() {
    throw new Error('Method not implemented.');
  }
}
