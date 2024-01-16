import { Controller, Logger } from '@nestjs/common';
import { GetMapService } from './get-map.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { GetMapTopics } from '@app/common/microservice-client/topics';
import { OfferingMapResDto } from '@app/common/dto/offering';
import { CreateImportDto, CreateImportResDto, InventoryUpdatesReqDto } from '@app/common/dto/map';
import { DiscoveryMapDto } from '@app/common/dto/discovery';
import { ImportResPayload } from '@app/common/dto/libot/import-res-payload';

@Controller()
export class GetMapController {

  private readonly logger = new Logger(GetMapController.name);

  constructor(private readonly getMapService: GetMapService) { }

  // Import
  @MessagePattern(GetMapTopics.DISCOVERY_MAP)
  async getOffering() {
    this.logger.log("Get products offering")
    return this.getMapService.getOffering()
  }

  @MessagePattern(GetMapTopics.CREATE_IMPORT)
  async importCreate(@Payload() importDto: CreateImportDto): Promise<CreateImportResDto> {    
    this.logger.log("Start import create")
    return this.getMapService.importCreate(importDto)
  }
  
  
  @MessagePattern(GetMapTopics.GET_IMPORT_STATUS)
  getImportStatus(@Payload() reqId: string) {
    this.logger.log("Get import create status")
    return this.getMapService.getImportStatus(reqId)
  }
  
  @EventPattern(GetMapTopics.EXPORT_NOTIFICATION)
  exportNotify(@Payload() payload: ImportResPayload) {    
    this.logger.log(`got notification from libot for job id ${payload.id} with status ${payload.status}`)
    return this.getMapService.handleNotification(payload)
  }

  // Inventory
  @MessagePattern(GetMapTopics.GET_INVENTORY_UPDATES)
  getInventoryUpdates(@Payload() inventoryDto: InventoryUpdatesReqDto) {
    this.logger.log("Get inventory updates")
    return this.getMapService.getInventoryUpdates(inventoryDto)
  }

  // Config
  @MessagePattern(GetMapTopics.GET_MAP_CONFIG)
  getMapConfig(){
    return this.getMapService.getMapConfig()
  }
  

}
