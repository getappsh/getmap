import { CreateImportDto, CreateImportResDto, ImportStatusResDto, InventoryUpdatesReqDto, InventoryUpdatesResDto } from '@app/common/dto/map';
import { MapOfferingStatus, OfferingMapResDto } from '@app/common/dto/offering';
import { DiscoveryAttributes } from '@app/common/dto/map/dto/discoveryAttributes.dto';
import { LibotHttpClientService } from './http-client/http-client.service';
import { L_HttpClientService } from './http-client/http-client.module';
import { MapProductResDto } from '@app/common/dto/map/dto/map-product-res.dto';
import { ImportAttributes } from '@app/common/dto/map/dto/importAttributes.dto';
import { ImportCreateService } from './import-create.service';
import { ErrorCode, ErrorDto } from '@app/common/dto/error';
import { MapError } from '@app/common/dto/map/utils/map-error';
import { RepoService } from './repo.service';
import { MapEntity, MapImportStatusEnum, } from '@app/common/database/entities';
import { Inject, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ImportResPayload } from '@app/common/dto/libot/dto/import-res-payload';
import { MapConfigDto } from '@app/common/dto/map/dto/map-config.dto';
import { MicroserviceClient, MicroserviceName } from '@app/common/microservice-client';
import { DeviceTopicsEmit } from '@app/common/microservice-client/topics';
import { RegisterMapDto } from '@app/common/dto/device/dto/register-map.dto';
import { InventoryDeviceUpdatesDto } from '@app/common/dto/map/dto/inventory-device-updates-dto';
import { MapUpdatesService } from './map-updates.service';
import { MapPutDto } from '@app/common/dto/map/dto/map-put.dto';

@Injectable()
export class GetMapService  {

  private readonly logger = new Logger(GetMapService.name);

  constructor(
    @Inject(L_HttpClientService) private readonly libot: LibotHttpClientService,
    private readonly create: ImportCreateService,
    private readonly repo: RepoService,
    private readonly mapUpdates: MapUpdatesService,
    @Inject(MicroserviceName.DISCOVERY_SERVICE) private readonly deviceClient: MicroserviceClient,
  ) { }

  // Import
  async getOffering(): Promise<OfferingMapResDto> {
    const mapRes = new OfferingMapResDto
    try {
      const mapAttrs = new DiscoveryAttributes()
      // const mapAttrs = DiscoveryAttributes.fromDiscoverMapDto(discoverMap)

      const records = await this.libot.getRecords(mapAttrs)

      this.logger.debug("Processing records to response")

      mapRes.status = MapOfferingStatus.SUCCESS
      mapRes.products = records
    } catch (error) {
      mapRes.status = MapOfferingStatus.ERROR
      if (error instanceof MapError) {
        mapRes.error = this.throwErrorDto(error.errorCode, error.message)
      } else {
        mapRes.error = this.throwErrorDto(ErrorCode.MAP_OTHER, error)
      }
    }
    return mapRes
  }

  async importCreate(importDto: CreateImportDto): Promise<CreateImportResDto> {

    const importRes = new CreateImportResDto()

    const importAttrs = ImportAttributes.fromImportCreateDto(importDto)

    let existsMap: MapEntity;
    try {

      await this.create.isValidBbox(importAttrs)

      const product = await this.create.selectProduct(importAttrs)
      this.create.completeAttrs(importAttrs, product)

      existsMap = await this.repo.getMapByImportAttrs(importAttrs)

      if (!existsMap || existsMap.status === MapImportStatusEnum.ERROR || existsMap.status === MapImportStatusEnum.CANCEL || existsMap.status === MapImportStatusEnum.EXPIRED) {
        const pEntity = await this.repo.getOrCreateProduct(product)
        const entityForMap = Array.isArray(pEntity) ? pEntity[0] : pEntity

        // TODO in case of error or cancel needs to find the exist map
        this.logger.debug("Save map entity")
        existsMap = await this.repo.saveMap(importAttrs, entityForMap)
        this.create.executeExport(importAttrs, existsMap)
      } else {
        this.logger.debug(`Return map ${existsMap.catalogId} from cache`)
      }

      if (!existsMap.isUpdated) {
        existsMap = await this.repo.updateMapAsUpdate(existsMap)
      }

      const registerDto = new RegisterMapDto()
      registerDto.deviceId = importDto.deviceId
      registerDto.map = existsMap
      this.deviceClient.emit(DeviceTopicsEmit.REGISTER_MAP_TO_DEVICE, registerDto)
      this.fromEntityToDto(existsMap, importRes)


    } catch (error) {
      if (error instanceof MapError) {
        importRes.error = this.throwErrorDto(error.errorCode, error.message)
      } else {
        importRes.error = this.throwErrorDto(ErrorCode.MAP_OTHER, error)
      }
    }

    return importRes;
  }

  async getImportStatus(reqId: string): Promise<ImportStatusResDto> {
    this.logger.debug(`Find map entity if catalog id ${reqId}`)
    let importRes = new ImportStatusResDto()

    try {
      let map = await this.repo.getMapById(reqId)

      if (!map) {
        const mes = `map with catalogId ${reqId} not exist`
        this.logger.error(mes)
        throw new MapError(ErrorCode.MAP_NOT_FOUND, mes)
      }

      if ((map.status === MapImportStatusEnum.START
        || map.status === MapImportStatusEnum.PENDING
        || map.status === MapImportStatusEnum.IN_PROGRESS)
        && !await this.create.isMapInUpdatingProcess(map)) {
          map = await this.create.handleGetMapStatus(map.jobId, map)
          this.create.getMapStatusUntilDone(map.jobId, map)
      }

      if (map) {
        importRes = ImportStatusResDto.fromMapEntity(map)
        this.logger.log(`Status for catalogId ${reqId} is - ${importRes.status}, progress is at ${importRes.metaData.progress} %`)
      } else {
        throw new MapError(ErrorCode.MAP_OTHER, "unknown error occurs with export the map")
      }

    } catch (error) {
      if (error instanceof MapError) {
        importRes.error = this.throwErrorDto(error.errorCode, error.message)
      } else {
        importRes.error = this.throwErrorDto(ErrorCode.MAP_OTHER, error)
      }
    }

    return importRes
  }

  handleNotification(payload: ImportResPayload) {
    this.create.handleSaveExportRes(payload)
  }

  // Inventory
  async getInventoryUpdates(inventoryDto: InventoryUpdatesReqDto) {
    const res = new InventoryUpdatesResDto()
    const inventoryIds = Object.keys(inventoryDto.inventory)
    const maps = await this.repo.getMapsIsUpdated(inventoryIds)
    res.updates = {}
    maps.forEach(m => {
      res.updates[m.catalogId] = m.isUpdated
    })
    inventoryIds.forEach(m => {
      if (!res.updates[m]) {
        res.updates[m] = false
      }
    })
    this.repo.updateLastCheckForMaps(maps)

    const deviceUpdates = InventoryDeviceUpdatesDto.fromInventoryUpdatesReq(inventoryDto, maps)
    this.deviceClient.emit(DeviceTopicsEmit.REGISTER_MAP_INVENTORY, deviceUpdates)
    return res
  }

  startMapUpdatedCronJob() {
    this.mapUpdates.checkMapsUpdates()
  }

  async putMapProperties(p: MapPutDto): Promise<MapPutDto> {
    this.logger.log(`Put props for map ${p.catalogId}`);
    return await this.repo.setMapProps(p)

  }

  // Utils
  fromEntityToDto(entity: MapEntity, dto: CreateImportResDto) {
    dto.importRequestId = entity.catalogId
    dto.product = MapProductResDto.fromProductEntity(entity.mapProduct)
    dto.status = entity.status
  }

  throwErrorDto(code: ErrorCode, mes: string): ErrorDto {
    const error = new ErrorDto()
    error.errorCode = code
    error.message = mes.toString()
    return error
  }
}
