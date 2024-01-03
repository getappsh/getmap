import { Injectable, Logger } from '@nestjs/common';
import { DiscoveryAttributes } from '../libot-dto/discoveryAttributes.dto';
import { LibotHttpClientService } from './http-client.service';
import { ImportAttributes } from '../libot-dto/importAttributes.dto';
import { MapProductResDto } from '@app/common/dto/map/dto/map-product-res.dto';

@Injectable()
export class ImportCreateService {

  private readonly logger = new Logger(ImportCreateService.name);

  constructor(private readonly libot: LibotHttpClientService) { }

  async selectProduct(importAttrs: ImportAttributes) {
    const discoverAttrs = new DiscoveryAttributes()
    discoverAttrs.BoundingBox = importAttrs.BoundingBox
    
    const records = await this.libot.getRecords(discoverAttrs)
    const rr = records.map(record => MapProductResDto.fromRecordsRes(record))
    console.log(rr);
    

  }
}
