import { Controller, Logger } from '@nestjs/common';
import { GetMapService } from './get-map.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { GetMapTopics, GetMapTopicsEmit } from '@app/common/microservice-client/topics';
import { CreateImportDto, CreateImportResDto, InventoryUpdatesReqDto } from '@app/common/dto/map';
import { ImportResPayload } from '@app/common/dto/libot/import-res-payload';
import { MapConfigDto } from '@app/common/dto/map/dto/map-config.dto';

let counter = 0;

@Controller()
export class GetMapController {

  private readonly logger = new Logger(GetMapController.name);

  constructor(private readonly getMapService: GetMapService) { }

  // Import
  @MessagePattern(GetMapTopics.DISCOVERY_MAP)
  async getOffering() {
    counter += 1 
    this.logger.log(`currently process ${counter} messages`)
    this.logger.log("Get products offering")
    let res = await this.getMapService.getOffering()
    counter -= 1
    return res
  }

  @MessagePattern(GetMapTopics.CREATE_IMPORT)
  async importCreate(@Payload() importDto: CreateImportDto): Promise<CreateImportResDto> {
    this.logger.log("Start import create")
    return this.getMapService.importCreate(importDto)
  }


  @MessagePattern(GetMapTopics.GET_IMPORT_STATUS)
  getImportStatus(@Payload("stringValue") reqId: string) {
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
  getMapConfig() {
    this.logger.log(`Get maps config`)
    return this.getMapService.getMapConfig()
  }

  @MessagePattern(GetMapTopics.SET_MAP_CONFIG)
  async setMapConfig(@Payload() config: MapConfigDto) {
    this.logger.log(`Set maps config`)
    return await this.getMapService.setMapConfig(config)
  }
  
  @EventPattern(GetMapTopicsEmit.MAP_UPDATES_JOB_START)
  async startMapUpdatedCronJob() {
    this.logger.log(`Start 'map updates' job from api call`)
    this.getMapService.startMapUpdatedCronJob()
  }

  // Utils
  @MessagePattern(GetMapTopics.CHECK_HEALTH)
  healthCheckSuccess(){
    return "Get map service is success"
  }


}
