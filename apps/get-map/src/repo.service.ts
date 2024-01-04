import { Injectable, Logger } from '@nestjs/common';
import { LibotHttpClientService } from './http-client.service';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceEntity, DeviceMapStateEntity, DeviceMapStateEnum, MapEntity, MapProductEntity } from '@app/common/database/entities';
import { Repository } from 'typeorm';
import { ImportAttributes } from '../libot-dto/importAttributes.dto';
import { MapProductResDto } from '@app/common/dto/map/dto/map-product-res.dto';

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
        // mapProduct: { id: importAttr.ProductId },
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

  async getOrSaveProduct(product: MapProductResDto) {

    const existProduct = await this.productRepo.findOneBy({ id: product.id })
    console.log({ existProduct });

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
