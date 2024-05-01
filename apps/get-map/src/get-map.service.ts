import { CreateImportDto, CreateImportResDto, ImportStatusResDto, InventoryUpdatesReqDto, InventoryUpdatesResDto } from '@app/common/dto/map';
import { MapOfferingStatus, OfferingMapResDto } from '@app/common/dto/offering';
import { DiscoveryAttributes } from '@app/common/dto/libot/discoveryAttributes.dto';
import { LibotHttpClientService } from './http-client.service';
import { MapProductResDto } from '@app/common/dto/map/dto/map-product-res.dto';
import { ImportAttributes } from '@app/common/dto/libot/importAttributes.dto';
import { ImportCreateService } from './import-create.service';
import { ErrorCode, ErrorDto } from '@app/common/dto/error';
import { MapError } from '@app/common/dto/libot/utils/map-error';
import { RepoService } from './repo.service';
import { MapEntity, MapImportStatusEnum, TargetStoragePolicy } from '@app/common/database/entities';
import { Inject, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ImportResPayload } from '@app/common/dto/libot/import-res-payload';
import { MapConfigDto } from '@app/common/dto/map/dto/map-config.dto';
import { MicroserviceClient, MicroserviceName } from '@app/common/microservice-client';
import { DeviceTopicsEmit } from '@app/common/microservice-client/topics';
import { RegisterMapDto } from '@app/common/dto/device/dto/register-map.dto';
import { InventoryDeviceUpdatesDto } from '@app/common/dto/map/dto/inventory-device-updates-dto';
import { MapUpdatesService } from './map-updates.service';

@Injectable()
export class GetMapService implements OnApplicationBootstrap {

  private readonly logger = new Logger(GetMapService.name);

  constructor(
    private readonly libot: LibotHttpClientService,
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
      mapRes.products = records.map(record => MapProductResDto.fromRecordsRes(record))
    } catch (error) {
      mapRes.status = MapOfferingStatus.ERROR
      mapRes.error = this.throwErrorDto(ErrorCode.MAP_OTHER, error)
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

      if (map.status === MapImportStatusEnum.START ||
        map.status === MapImportStatusEnum.PENDING ||
        map.status === MapImportStatusEnum.IN_PROGRESS) {

        map = await this.create.handleGetMapStatus(map.jobId, map)
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

  // Config
  async getMapConfig() {
    const configs = await this.repo.getMapConfig()
    if (!configs) {
      this.logger.warn(`There is not exist maps configuration`)
    }
    const configRes = MapConfigDto.fromMapConfig(configs)
    configRes.lastCheckingMapUpdatesDate = await this.repo.getLastMapUpdatesChecking()
    return configRes
  }

  async setMapConfig(config: MapConfigDto) {
    try {
      return await this.repo.setMapConfig(config)
    } catch (error) {
      this.logger.error(error)
      return error
    }
  }

  async setDefaultConfig() {
    const eCong = await this.repo.getMapConfig()

    const defaults = new MapConfigDto()
    defaults.deliveryTimeoutMins = 30
    defaults.downloadRetryTime = 3
    defaults.downloadTimeoutMins = 30
    defaults.MaxMapAreaSqKm = 100
    defaults.maxMapSizeInMB = 500
    defaults.maxParallelDownloads = 1
    defaults.minAvailableSpaceMB = 1000
    defaults.periodicInventoryIntervalMins = 1440
    defaults.periodicConfIntervalMins = 1440
    defaults.periodicMatomoIntervalMins = 1440
    defaults.mapMinInclusionInPercentages = 60
    defaults.targetStoragePolicy = TargetStoragePolicy.SD_ONLY
    defaults.sdStoragePath = "com.asio.gis/gis/maps/raster/מיפוי ענן"
    defaults.flashStoragePath = "com.asio.gis/gis/maps/raster/מיפוי ענן"

    const defaultsToSave = Object.assign({}, defaults, eCong)

    for (const prop in defaults) {
      if (defaults.hasOwnProperty(prop) && !defaultsToSave[prop]) {
        defaultsToSave[prop] = defaults[prop];
      }
    }

    try {
      this.logger.log(`sets defaults configuration for maps`)
      await this.repo.setMapConfig(defaultsToSave)
    } catch (error) {
      this.logger.error(error)
    }
  }

  startMapUpdatedCronJob() {
    this.mapUpdates.checkMapsUpdates()
  }

  // Utils
  fromEntityToDto(entity: MapEntity, dto: CreateImportResDto) {
    dto.importRequestId = entity.catalogId
    // dto.product = entity.mapProduct
    dto.status = entity.status
  }

  throwErrorDto(code: ErrorCode, mes: string) {
    const error = new ErrorDto()
    error.errorCode = code
    error.message = mes.toString()
    return error
  }

  onApplicationBootstrap() {
    this.setDefaultConfig()
  }



}
