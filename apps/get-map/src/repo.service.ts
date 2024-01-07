import { Injectable, Logger } from '@nestjs/common';
import { LibotHttpClientService } from './http-client.service';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceEntity, DeviceMapStateEntity, DeviceMapStateEnum, LibotExportStatusEnum, MapEntity, MapImportStatusEnum, MapProductEntity } from '@app/common/database/entities';
import { Repository } from 'typeorm';
import { ImportAttributes } from '@app/common/dto/libot/importAttributes.dto';
import { MapProductResDto } from '@app/common/dto/map/dto/map-product-res.dto';
import { ArtifactsLibotEnum, ImportResPayload } from '@app/common/dto/libot/import-res-payload';

@Injectable()
export class RepoService {

  private readonly logger = new Logger(RepoService.name);

  constructor(
    @InjectRepository(MapEntity) private readonly mapRepo: Repository<MapEntity>,
    @InjectRepository(DeviceEntity) private readonly deviceRepo: Repository<DeviceEntity>,
    @InjectRepository(DeviceMapStateEntity) private readonly deviceMapRepo: Repository<DeviceMapStateEntity>,
    @InjectRepository(MapProductEntity) private readonly productRepo: Repository<MapProductEntity>
  ) { }

  async getMap(importAttr: ImportAttributes): Promise<MapEntity> {
    const existMap = await this.mapRepo.findOne({
      where: {
        mapProduct: { id: importAttr.ProductId },
        boundingBox: importAttr.BoundingBox,
        zoomLevel: importAttr.ZoomLevel
      }
    })
    return existMap
  }

  async saveMap(importAttr: ImportAttributes, product?: MapProductEntity): Promise<MapEntity> {
    const newMap = this.mapRepo.create()
    newMap.boundingBox = importAttr.BoundingBox
    newMap.zoomLevel = importAttr.ZoomLevel
    newMap.mapProduct = product

    const savedMap = await this.mapRepo.save(newMap)

    return savedMap
  }

  async saveExportRes(resData: ImportResPayload, map?: MapEntity) {
    const existsMap = await this.mapRepo.find({
      where: [
        { catalogId: map.catalogId },
        { jobId: resData.id }
      ],
      relations: { mapProduct: true }
    })

    existsMap.forEach(map => {

      // TODO update the correct product
      if (map?.mapProduct?.id != resData.catalogRecordID) {
        this.logger.warn(`The map was export from productID ${resData.catalogRecordID} and not from productId ${map?.mapProduct?.id} at the export req`)
      }

      map.jobId = resData.id
      map.status = this.mapStatus(resData.status)
      map.progress = resData.progress
      map.size = resData.estimatedSize
      map.exportStart = resData.createdAt ? new Date(resData.createdAt) : null
      map.exportEnd = resData.finishedAt || resData.expiredAt ? new Date(resData.finishedAt ?? resData.expiredAt) : null
      map.errorReason = resData.errorReason

      if (resData.status === LibotExportStatusEnum.COMPLETED) {
        resData.artifacts?.forEach(art => {
          if (art.type === ArtifactsLibotEnum.GPKG) {
            map.fileName = art.name
            map.packageUrl = art.url
          }
        })

        if (this.doUseCache()) {
          this.handleDownload(map, map.packageUrl)
        }
      }
    })


    this.mapRepo.save(existsMap)

    // if (resData.status === LibotExportStatusEnum.COMPLETED) {
    //   resData.artifacts?.forEach(art => {
    //     if (art.type === ArtifactsLibotEnum.GPKG) {
    //       map.fileName = art.name
    //       if (this.doUseCache() && map.status != MapImportStatusEnum.DONE && map.status != MapImportStatusEnum.IN_DOWNLOAD_PROCESS) {
    //         map.status = MapImportStatusEnum.IN_DOWNLOAD_PROCESS
    //         this.handleDownload(map)
    //       }
    //       else {
    //         map.status = MapImportStatusEnum.DONE
    //         map.packageUrl = art.url
    //       }
    //     }
    //   })
    // }


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

  doUseCache() {
    return Boolean(process.env.USE_CACHE)
  }

  handleDownload(map: MapEntity, url: string) {
    //TODO send to delivery micro to d
  }


  async getOrSaveProduct(product: MapProductResDto) {

    const existProduct = await this.productRepo.findOneBy({ id: product.id })

    if (existProduct) {
      return existProduct
    }
    const newProduct = this.productRepo.create(product)
    return await this.productRepo.save(newProduct)
  }

  async registerMapToDevice(existsMap: MapEntity, deviceId: string) {
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
  }
}
