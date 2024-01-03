import { Controller, Logger } from '@nestjs/common';
import { GetMapService } from './get-map.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { GetMapTopics } from '@app/common/microservice-client/topics';
import { OfferingMapResDto } from '@app/common/dto/offering';
import { CreateImportDto, CreateImportResDto } from '@app/common/dto/map';
import { DiscoveryMapDto } from '@app/common/dto/discovery';

@Controller()
export class GetMapController {

  private readonly logger = new Logger(GetMapController.name);

  constructor(private readonly getMapService: GetMapService) { }

  @MessagePattern(GetMapTopics.DISCOVERY_MAP)
  async getOffering(@Payload() discoverMap: DiscoveryMapDto): Promise<OfferingMapResDto> {
    this.logger.debug("Get products offering")
    return await this.getMapService.getOffering(discoverMap)
  }
  
  @MessagePattern(GetMapTopics.CREATE_IMPORT)
  importCreate(@Payload() importDto: CreateImportDto ): CreateImportResDto {
    this.logger.debug("Import create")    
    return this.getMapService.importCreate(importDto)
  }
  
  @MessagePattern(GetMapTopics.CANCEL_IMPORT_CREATE)
  importCancel(){
    this.logger.debug("Cancel import create")
    return this.getMapService.importCancel()
  }
  
  @MessagePattern(GetMapTopics.GET_IMPORT_STATUS)
  getImportStatus(){
    this.logger.debug("Get import create status")
    return this.getMapService.getImportStatus()
  }





}
