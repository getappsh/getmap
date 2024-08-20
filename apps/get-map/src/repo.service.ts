import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LibotExportStatusEnum, MapEntity, MapImportStatusEnum, ProductEntity } from '@app/common/database/entities';
import { In, IsNull, Not, Repository } from 'typeorm';
import { ImportAttributes } from '@app/common/dto/map/dto/importAttributes.dto';
import { MapProductResDto } from '@app/common/dto/map/dto/map-product-res.dto';
import { ArtifactsLibotEnum, ImportResPayload } from '@app/common/dto/libot/dto/import-res-payload';
import { MapConfigDto } from '@app/common/dto/map/dto/map-config.dto';
import { JobsEntity } from '@app/common/database/entities/map-updatesCronJob';
import { LibotHttpClientService } from './http-client/http-client.service';
import { ConfigService } from '@nestjs/config';
import { MapPutDto } from '@app/common/dto/map/dto/map-put.dto';
import { area } from '@turf/turf';
import { L_HttpClientService } from './http-client/http-client.module';
import { DeviceConfigEntity } from '@app/common/database/entities/device-config.entity';

@Injectable()
export class RepoService {

  private readonly logger = new Logger(RepoService.name);

  constructor(
    @InjectRepository(MapEntity) private readonly mapRepo: Repository<MapEntity>,
    @InjectRepository(ProductEntity) private readonly productRepo: Repository<ProductEntity>,
    @InjectRepository(JobsEntity) private readonly mapUpdatesRepo: Repository<JobsEntity>,
    @InjectRepository(DeviceConfigEntity) private readonly deviceConfigRepo: Repository<DeviceConfigEntity>,
    @Inject(L_HttpClientService) private readonly libotClient: LibotHttpClientService,
    private readonly env: ConfigService,
  ) { }

  // Maps
  async getMapByImportAttrs(importAttr: ImportAttributes): Promise<MapEntity> {
    const existMap = await this.mapRepo.findOne({
      where: {
        mapProduct: {
          id: importAttr.product.id,
          productType: importAttr.product.productType,
          ingestionDate: importAttr.product.ingestionDate
        },
        boundingBox: importAttr.Points,
      },
      relations: {mapProduct: true}
    })
    if (existMap?.status != MapImportStatusEnum.IN_PROGRESS && existMap?.expiredDate <= new Date(new Date().getTime())) {
      existMap.status = MapImportStatusEnum.EXPIRED
    }
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
      where: { footprint: Not(IsNull()) }
    })
    this.logger.debug(`there are ${existMapCount} completed maps `)
    return existMapCount
  }

  async getMapsASC(take?: number, skip?: number): Promise<MapEntity[]> {
    const existMap = await this.mapRepo.find({
      where: { footprint: Not(IsNull()) },
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
    newMap.name = this.generateMapName(importAttr)
    newMap.area = importAttr.Area

    const savedMap = await this.mapRepo.save(newMap)

    return savedMap
  }

  generateMapName(importAttr: ImportAttributes): string {
    const date = Date.now().toString()
    const name = `${importAttr.product.productName}_${date.substring(date.length - 4)}`
    return name
  }

  async setMapProps(p: MapPutDto) {

    const map = await this.mapRepo.findOne({ where: { catalogId: p.catalogId } })

    if (!map) {
      const mes = `Map with '${p.catalogId}' not exist`
      this.logger.error(mes)
      throw new BadRequestException(mes)
    }
    this.logger.log(`Save props for map ${map.catalogId}`)
    map.name = p.name
    const savedDevice = await this.mapRepo.save(map)
    return MapPutDto.fromMapEntity(savedDevice)
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

    for (let i = 0; i < existMap.length; i++) {

      // TODO update the correct product
      if (map && existMap[i].mapProduct?.id != resData.catalogRecordID) {
        this.logger.warn(`The map was export from productID ${resData.catalogRecordID} and not from productId ${existMap[i]?.mapProduct?.id} at the export req`)
      }

      existMap[i].jobId = resData.id
      existMap[i].status = this.mapStatus(resData.status)
      if (resData.progress) {
        existMap[i].progress = resData.progress
      }
      if (resData.estimatedSize) {
        existMap[i].size = resData.estimatedSize
      }
      existMap[i].exportStart = resData.createdAt ? new Date(resData.createdAt) : undefined
      existMap[i].exportEnd = resData.finishedAt ? new Date(resData.finishedAt) : undefined
      existMap[i].expiredDate = resData.expiredAt ? new Date(resData.expiredAt) : undefined
      existMap[i].errorReason = resData.errorReason

      if (resData.status === LibotExportStatusEnum.COMPLETED && resData.artifacts) {
        for (let j = 0; j < resData?.artifacts.length; j++) {
          if (resData.artifacts[j].type === ArtifactsLibotEnum.GPKG) {
            existMap[i].fileName = resData.artifacts[j].name
            existMap[i].packageUrl = this.getCorrectPackageUrl(resData.artifacts[j].url)
            existMap[i].size = resData.artifacts[j].size
          }
          if (resData.artifacts[j].type === ArtifactsLibotEnum.METADATA) {
            try {
              const actualFootprint = await this.libotClient.reqAndRetry(
                async () => await this.libotClient.getActualFootPrint(this.getCorrectPackageUrl(resData.artifacts[j].url)),
                "download map json file"
              )
              // existMap[i].footprint = actualFootprint.coordinates.join(',')
              existMap[i].footprint = actualFootprint.coordinates[0][0].join(',')
              existMap[i].area = parseInt(area(actualFootprint).toFixed())
            } catch (error) {
              const mes = `download map json file failed - ${error.toString()}`
              this.logger.error(mes)
              existMap[i].status = MapImportStatusEnum.ERROR
              existMap[i].errorReason = mes
            }
          }
        }
        existMap[i].progress = 100
      }

      if ((!existMap[i].packageUrl || !existMap[i].footprint) && existMap[i].status === MapImportStatusEnum.DONE) {
        existMap[i].status = MapImportStatusEnum.IN_PROGRESS
      }
    }

    return (await this.mapRepo.save(existMap)).find(cMap => cMap.catalogId === map?.catalogId)

  }

  getCorrectPackageUrl(originalUrl: string) {
    const correctBaseUrl = this.env.get("PROXY_DOWNLOAD_BASE_URL")

    if (correctBaseUrl) {
      const regex = /^(https?:\/\/[^\/]+)\//;
      const match = originalUrl.match(regex);

      if (match && match[1]) {
        // Replace the base URL with the new base URL
        return originalUrl.replace(match[1], correctBaseUrl);
      } else {
        // If the base URL couldn't be extracted, return the original URL
        return originalUrl;
      }
    }
    return originalUrl
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

    const existProduct = await this.productRepo.findOneBy({
      id: product.id,
      productType: product.productType,
      ingestionDate: product.ingestionDate
    })

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

  async getConfigData() : Promise<Record<string, string | number>>{
    let config = await this.deviceConfigRepo.findOneBy({group: 'android'})
    return config?.data as Record<string, string | number>
  }
}
