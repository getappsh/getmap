import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceEntity, DeviceMapStateEntity, DeviceMapStateEnum, LibotExportStatusEnum, MapConfigEntity, MapEntity, MapImportStatusEnum, ProductEntity } from '@app/common/database/entities';
import { In, IsNull, Not, Repository } from 'typeorm';
import { ImportAttributes } from '@app/common/dto/libot/importAttributes.dto';
import { MapProductResDto } from '@app/common/dto/map/dto/map-product-res.dto';
import { ArtifactsLibotEnum, ImportResPayload } from '@app/common/dto/libot/import-res-payload';
import { MapConfigDto } from '@app/common/dto/map/dto/map-config.dto';

@Injectable()
export class RepoService {

  private readonly logger = new Logger(RepoService.name);

  constructor(
    @InjectRepository(MapEntity) private readonly mapRepo: Repository<MapEntity>,
    @InjectRepository(DeviceEntity) private readonly deviceRepo: Repository<DeviceEntity>,
    @InjectRepository(DeviceMapStateEntity) private readonly deviceMapRepo: Repository<DeviceMapStateEntity>,
    @InjectRepository(ProductEntity) private readonly productRepo: Repository<ProductEntity>,
    @InjectRepository(MapConfigEntity) private readonly configRepo: Repository<MapConfigEntity>
  ) { }

  // Maps
  async getMap(importAttr: ImportAttributes): Promise<MapEntity> {
    const existMap = await this.mapRepo.findOne({
      where: {
        mapProduct: { id: importAttr.productId },
        boundingBox: importAttr.Points,
        // zoomLevel: importAttr.ZoomLevel
      }
    })
    return existMap
  }

  async getMapById(reqId: string): Promise<MapEntity> {
    const existMap = await this.mapRepo.findOne({
      where: {
        catalogId: reqId
      }
    })
    return existMap
  }

  async getUnUpdatedMapsCount(): Promise<number> {
    const existMapCount = await this.mapRepo.count({
      where: {
        isUpdated: true
      },
    })
    this.logger.debug(`there are ${existMapCount} no obsolete maps `)
    return existMapCount
  }

  async getUpdatedMaps(take?: number, skip?: number): Promise<MapEntity[]> {
    const existMap = await this.mapRepo.find({
      where: { isUpdated: true },
      relations: { mapProduct: true },
      order: { createDateTime: "ASC" },
      take,
      skip
    })
    return existMap
  }

  async updateMapAsUnUpdate(map: MapEntity) {
    map.isUpdated = false
    return await this.mapRepo.save(map)
  }

  async getMapsIsUpdated(inventory: string[]) {
    const isUpdateMaps = await this.mapRepo.find(
      {
        select: ["catalogId", "isUpdated"],
        where: { catalogId: In(inventory) }
      }
    )
    return isUpdateMaps
  }

  async saveMap(importAttr: ImportAttributes, product?: ProductEntity): Promise<MapEntity> {
    const newMap = this.mapRepo.create()
    newMap.boundingBox = importAttr.Points
    newMap.zoomLevel = importAttr.zoomLevel
    newMap.mapProduct = product

    const savedMap = await this.mapRepo.save(newMap)

    return savedMap
  }

  async saveExportRes(resData: ImportResPayload, map?: MapEntity): Promise<MapEntity> {

    this.logger.debug(`find maps with job Id ${resData.id} to save the response`)

    const existMap = await this.mapRepo.find({
      where: [
        { catalogId: map?.catalogId },
        { jobId: resData.id }
      ],
      relations: { mapProduct: true }
    })

    if (!existMap || existMap.length == 0) {
      const mes = `map with job id ${resData.id} not exist`
      this.logger.error(mes)
    }

    existMap.forEach(cMap => {

      // TODO update the correct product
      if (map && cMap.mapProduct?.id != resData.catalogRecordID) {
        this.logger.warn(`The map was export from productID ${resData.catalogRecordID} and not from productId ${cMap?.mapProduct?.id} at the export req`)
      }

      cMap.jobId = resData.id
      cMap.status = this.mapStatus(resData.status)
      if (resData.progress) {
        cMap.progress = resData.progress
      }
      if (resData.estimatedSize) {
        cMap.size = resData.estimatedSize
      }
      cMap.exportStart = resData.createdAt ? new Date(resData.createdAt) : undefined
      cMap.exportEnd = resData.finishedAt || resData.expiredAt ? new Date(resData.finishedAt ?? resData.expiredAt) : undefined
      cMap.errorReason = resData.errorReason

      if (resData.status === LibotExportStatusEnum.COMPLETED) {
        resData.artifacts?.forEach(art => {
          if (art.type === ArtifactsLibotEnum.GPKG) {
            cMap.fileName = art.name
            cMap.packageUrl = art.url
          }
        })
        cMap.progress = 100
        if (!cMap.packageUrl) {
          cMap.status = MapImportStatusEnum.IN_PROGRESS
        }
      }
    })

    return (await this.mapRepo.save(existMap)).find(cMap => cMap.catalogId === map?.catalogId)

  }

  async setErrorStatus(map: MapEntity, errMes: string) {
    map.status = MapImportStatusEnum.ERROR
    map.errorReason = errMes

    await this.mapRepo.save(map)
  }

  mapStatus(status: LibotExportStatusEnum): MapImportStatusEnum {
    switch (status) {
      case LibotExportStatusEnum.PENDING:
        return MapImportStatusEnum.PENDING
      case LibotExportStatusEnum.IN_PROGRESS:
        return MapImportStatusEnum.IN_PROGRESS
      case LibotExportStatusEnum.COMPLETED:
        return MapImportStatusEnum.DONE
      case LibotExportStatusEnum.PAUSED:
        return MapImportStatusEnum.PAUSED
      case LibotExportStatusEnum.ABORTED:
        return MapImportStatusEnum.CANCEL
      case LibotExportStatusEnum.FAILED:
        return MapImportStatusEnum.ERROR
      case LibotExportStatusEnum.ARCHIVED:
        return MapImportStatusEnum.ARCHIVED
      case LibotExportStatusEnum.EXPIRED:
        return MapImportStatusEnum.EXPIRED
    }
  }

  // Products
  async getOrSaveProduct(product: MapProductResDto) {

    const existProduct = await this.productRepo.findOneBy({ id: product.id })

    if (existProduct) {
      return existProduct
    }
    return await this.saveProducts(product)
  }

  async saveProducts(newProd: MapProductResDto | MapProductResDto[]): Promise<ProductEntity | ProductEntity[]> {
    const newProduct = this.productRepo.create(newProd)
    return await this.productRepo.save(newProduct)
  }

  async getRecentProduct() {
    this.logger.log(`Find the must recent available product`)
    return await this.productRepo.findOne({
      where: { ingestionDate: Not(IsNull()) },
      order: { ingestionDate: "DESC" }
    })
  }

  // Config
  async getMapConfig() {
    const configs = await this.configRepo.find({ order: { lastUpdatedDate: "DESC" } })
    return configs.length > 0 ? configs[0] : null
  }

  async setMapConfig(config: MapConfigDto) {
    // eConfig === exits config
    this.logger.debug(`Find exits config and update it`)
    let eConfig = await this.getMapConfig()
    if (!eConfig) {
      eConfig = this.configRepo.create()
    }
    for (const key in config) {
      eConfig[key] = config[key]
    }
    await this.configRepo.save(eConfig)
  }

  async registerMapToDevice(existsMap: MapEntity, deviceId: string) {
    try {
      let device = await this.deviceRepo.findOne({ where: { ID: deviceId }, relations: { maps: { map: true } } })
      // let device = await this.deviceRepo.createQueryBuilder("device")
      //   // .leftJoin("device.maps", "dm").addSelect("dm.map")
      //   .leftJoinAndSelect("device.maps", "dm")
      //   .leftJoinAndSelect("dm.map", "map")
      //   .where("device.ID = :deviceId", { deviceId })
      //   .andWhere("map.catalogId = :mapId", { mapId: existsMap.boundingBox })
      //   .getOne();

      if (!device) {
        const newDevice = this.deviceRepo.create()
        newDevice.ID = deviceId
        device = await this.deviceRepo.save(newDevice)
      }

      if (!device.maps || device.maps.length == 0 || !device.maps.find(map => map.map.catalogId == existsMap.catalogId)) {

        let deviceMap = this.deviceMapRepo.create()
        deviceMap.device = device
        deviceMap.map = existsMap
        deviceMap.state = DeviceMapStateEnum.IMPORT
        this.deviceMapRepo.save(deviceMap)
      }

    } catch (error) {
      this.logger.error(error.toString())
    }
  }
}
