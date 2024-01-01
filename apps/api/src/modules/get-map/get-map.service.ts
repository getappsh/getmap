import { Inject, Injectable, Logger } from "@nestjs/common";
import { DeviceTopicsEmit, GetMapTopics, DeviceTopics } from "@app/common/microservice-client/topics";
import { lastValueFrom } from 'rxjs';
import { MapDto, ImportStatusResDto, ImportStatusDto, CreateImportDto, CreateImportResDto } from "@app/common/dto/map";
import { MicroserviceClient, MicroserviceName } from "@app/common/microservice-client";


@Injectable()
export class GetMapService {
  private readonly logger = new Logger(GetMapService.name);

  constructor(
    @Inject(MicroserviceName.GET_MAP_SERVICE) private readonly getMapClient: MicroserviceClient,
    @Inject(MicroserviceName.DEVICE_SERVICE) private readonly deviceClient: MicroserviceClient) {
  }  

  getRecordsCount(deviceId: string ){
    return this.getMapClient.send(GetMapTopics.GET_RECORDS_COUNT, deviceId)
  }


// Import
  async getImportStatus(importRequestId: string){
    const statusRes: ImportStatusResDto = await lastValueFrom(
      this.getMapClient.sendAndValidate(
        GetMapTopics.GET_IMPORT_STATUS, 
        JSON.stringify({strValue: importRequestId}),
        ImportStatusResDto
        ));
    this.logger.verbose(`Map import status ${JSON.stringify(statusRes)}`);
    this.deviceClient.emit(DeviceTopicsEmit.SAVE_MAP_DATA, statusRes)
    return statusRes;
  }

  postImportStatus(importStatusDto: ImportStatusDto){
    return this.getMapClient.send(GetMapTopics.POST_IMPORT_STATUS, importStatusDto);
  }

  async createImport(createImportDto: CreateImportDto): Promise<CreateImportResDto> {
    const importRes: CreateImportResDto = await lastValueFrom(
      this.getMapClient.sendAndValidate(
        GetMapTopics.CREATE_IMPORT, 
        createImportDto,
        CreateImportResDto
        ));

    this.logger.verbose(`Create map import response ${JSON.stringify(importRes)}`);
    const mapData = {
      ...createImportDto,
      ...importRes,
    }
    
    this.deviceClient.emit(DeviceTopicsEmit.SAVE_MAP_DATA, mapData)

    return importRes
  }

  cancelImportCreate(importRequestId: string){
    return this.getMapClient.sendAndValidate(
      GetMapTopics.CANCEL_IMPORT_CREATE, 
      JSON.stringify({strValue: importRequestId}),
      CreateImportResDto
      )
  }

  async getMapProperties(importRequestId: string){
    return this.getMapClient.sendAndValidate(
        GetMapTopics.MPA_PROPERTIES, 
        JSON.stringify({strValue: importRequestId}),
        MapDto
        );
  }

  getAllMapProperties() {
    return this.deviceClient.send(DeviceTopics.All_MAPS, {});
  }

  getMap(catalogId: string) {
    return this.deviceClient.send(DeviceTopics.GET_MAP, catalogId);
  }
  
  getOfferedMaps() {
    return this.getMapClient.send(GetMapTopics.DISCOVERY_MAP, {});
  }

}