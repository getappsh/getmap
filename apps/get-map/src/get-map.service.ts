import { DiscoveryMapDto } from '@app/common/dto/discovery';
import { CreateImportResDto } from '@app/common/dto/map';
import { OfferingMapResDto } from '@app/common/dto/offering';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { DiscoveryAttributes } from '../libot-dto/discoveryAttributes.dto';
import { LibotHttpClientService } from './http-client.service';

@Injectable()
export class GetMapService {
  
  private readonly logger = new Logger(GetMapService.name);
  
  constructor(private readonly libot: LibotHttpClientService) {}
    
    async getOffering(discoverMap: DiscoveryMapDto): OfferingMapResDto {
      const mapAttrs = DiscoveryAttributes.fromDiscoverMapDto(discoverMap)
      const records = await this.libot.getRecords(mapAttrs)
      
      return records as unknown as OfferingMapResDto
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
