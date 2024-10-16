import { Controller, Logger } from '@nestjs/common';
import { GetMapService } from './get-map.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { GetMapTopics, GetMapTopicsEmit } from '@app/common/microservice-client/topics';
import { CreateImportDto, CreateImportResDto, InventoryUpdatesReqDto } from '@app/common/dto/map';
import { ImportResPayload } from '@app/common/dto/libot/dto/import-res-payload';
import { MapPutDto } from '@app/common/dto/map/dto/map-put.dto';
import { RpcPayload } from '@app/common/microservice-client';
import * as fs from 'fs';


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
  async importCreate(@RpcPayload() importDto: CreateImportDto): Promise<CreateImportResDto> {
    this.logger.log("Start import create")
    return this.getMapService.importCreate(importDto)
  }


  @MessagePattern(GetMapTopics.GET_IMPORT_STATUS)
  getImportStatus(@RpcPayload('stringValue') reqId: string) {
    this.logger.log("Get import create status")
    return this.getMapService.getImportStatus(reqId)
  }

  @EventPattern(GetMapTopics.EXPORT_NOTIFICATION)
  exportNotify(@RpcPayload() payloadRaw: any) {
    const payload = ImportResPayload.fromImportRes(payloadRaw)
    this.logger.log(`got notification from libot for job id ${payload.id} with status ${payload.status}`)
    return this.getMapService.handleNotification(payload)
  }

  // Inventory
  @MessagePattern(GetMapTopics.GET_INVENTORY_UPDATES)
  getInventoryUpdates(@RpcPayload() inventoryDto: InventoryUpdatesReqDto) {
    this.logger.log("Get inventory updates")
    return this.getMapService.getInventoryUpdates(inventoryDto)
  }

  @EventPattern(GetMapTopicsEmit.MAP_UPDATES_JOB_START)
  async startMapUpdatedCronJob() {
    this.logger.log(`Start 'map updates' job from api call`)
    this.getMapService.startMapUpdatedCronJob()
  }

  @MessagePattern(GetMapTopics.MAP_PUT)
  putDeviceProperties(@RpcPayload() p: MapPutDto): Promise<MapPutDto> {
    return this.getMapService.putMapProperties(p)
  }

  // Utils
  @MessagePattern(GetMapTopics.CHECK_HEALTH)
  healthCheckSuccess() {
    const version = this.readImageVersion()
    this.logger.log(`Get-Map service - Health checking, Version: ${version}`)
    return "Get-Map  service is running successfully. Version: " + version
  }

  private readImageVersion(){
    let version = 'unknown'
    try{
      version = fs.readFileSync('NEW_TAG.txt','utf8');
    }catch(error){
      this.logger.error(`Unable to read image version - error: ${error}`)
    }
    return version
  }

}
