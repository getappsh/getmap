import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceEntity, DeviceMapStateEntity, DeviceMapStateEnum, LibotExportStatusEnum, MapConfigEntity, MapEntity, MapImportStatusEnum, ProductEntity } from '@app/common/database/entities';
import { In, IsNull, Not, Repository } from 'typeorm';
import { ImportAttributes } from '@app/common/dto/libot/importAttributes.dto';
import { MapProductResDto } from '@app/common/dto/map/dto/map-product-res.dto';
import { ArtifactsLibotEnum, ImportResPayload } from '@app/common/dto/libot/import-res-payload';
import { MapConfigDto } from '@app/common/dto/map/dto/map-config.dto';
import { JobsEntity } from '@app/common/database/entities/map-updatesCronJob';

@Injectable()
export class RepoService {


  private readonly logger = new Logger(RepoService.name);

  constructor(
    @InjectRepository(MapEntity) private readonly mapRepo: Repository<MapEntity>,
    @InjectRepository(DeviceEntity) private readonly deviceRepo: Repository<DeviceEntity>,
    @InjectRepository(DeviceMapStateEntity) private readonly deviceMapRepo: Repository<DeviceMapStateEntity>,
    @InjectRepository(ProductEntity) private readonly productRepo: Repository<ProductEntity>,
    @InjectRepository(MapConfigEntity) private readonly configRepo: Repository<MapConfigEntity>,
    @InjectRepository(JobsEntity) private readonly mapUpdatesRepo: Repository<JobsEntity>
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
    const existMapCount = await this.mapRepo.count()
    this.logger.debug(`there are ${existMapCount} maps `)
    return existMapCount
  }

  async getMapsASC(take?: number, skip?: number): Promise<MapEntity[]> {
    const existMap = await this.mapRepo.find({
      relations: { mapProduct: true },
      order: { createDateTime: "ASC" },
      take,
      skip
    })
    return existMap
  }

  async updateLastCheckForMaps(maps: MapEntity[]) {
    this.logger.log(`Save the is obsolete check time for maps `)
    try {
      maps.forEach(m => {
        m.lastCheckIsObsolete = new Date(Date.now())
      })
      await this.mapRepo.save(maps)
    } catch (error) {
      this.logger.error(error)
    }
  }

  async updateMapAsUnUpdate(map: MapEntity) {
    this.logger.debug(`Save map ${map.catalogId} as obsolete`)
    map.isUpdated = false
    return await this.mapRepo.save(map)
  }

  async updateMapAsUpdate(map: MapEntity) {
    this.logger.debug(`Save map ${map.catalogId} as updated`)
    map.isUpdated = true
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
  async getOrCreateProduct(product: MapProductResDto) {

    const existProduct = await this.productRepo.findOneBy({ id: product.id })

    if (existProduct) {
      return existProduct
    }
    return await this.createAndSaveProducts(product)
  }

  // TODO interface for options parameter
  async createAndSaveProducts(newProd: MapProductResDto | MapProductResDto[], options?: any): Promise<ProductEntity | ProductEntity[]> {
    let products = Array.isArray(newProd) ? newProd : [newProd]
    const newProduct = this.productRepo.create(products)
    if (options?.isCheckedAgainstMaps) {
      newProduct.forEach(p => {
        p.isCheckedAgainstMaps = new Date(Date.now())
      });
    }
    return await this.productRepo.save(newProduct)
  }

  // TODO interface for options parameter
  async updateProducts(prod: MapProductResDto | MapProductResDto[], options?: any): Promise<ProductEntity[]> {
    let products = Array.isArray(prod) ? prod : [prod]
    const newProduct = await this.productRepo.find({ where: { id: In(products.map(p => p.id)) } })
    if (options?.isCheckedAgainstMaps) {
      newProduct.forEach(p => {
        p.isCheckedAgainstMaps = new Date(Date.now())
      });
    }
    return await this.productRepo.save(newProduct)
  }

  async getRecentProduct() {
    this.logger.log(`Find the must recent available product`)
    let recentProduct = await this.productRepo.findOne({
      where: { ingestionDate: Not(IsNull()), isCheckedAgainstMaps: Not(IsNull()) },
      order: { ingestionDate: "DESC" }
    })
    if (!recentProduct) {
      recentProduct = await this.productRepo.findOne({
        where: { ingestionDate: Not(IsNull()) },
        order: { ingestionDate: "ASC" }
      })
    }
    return recentProduct
  }

  // Config
  async getMapConfig() {
    const configs = await this.configRepo.find({ order: { lastUpdatedDate: "DESC" } })
    return configs.length > 0 ? configs[0] : null
  }

  async setMapConfig(config: MapConfigDto) {
    // eConfig === exits config
    this.logger.debug(`Find exits config and update it or create it`)
    let eConfig = await this.getMapConfig()
    if (!eConfig) {
      eConfig = this.configRepo.create()
    }
    for (const key in config) {
      eConfig[key] = config[key]
    }
    await this.configRepo.save(eConfig)
  }

  async getLastMapUpdatesChecking(): Promise<Date> {
    const jobTime = await this.mapUpdatesRepo.findOne({ where: { name: "mapUpdates", endTime: Not(IsNull()) }, order: { startTime: "DESC" } })
    return jobTime ? new Date(jobTime.endTime) : null
  }
}
