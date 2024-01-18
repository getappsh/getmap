import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { RepoService } from './repo.service';
import { LibotHttpClientService } from './http-client.service';
import { DiscoveryAttributes } from '@app/common/dto/libot/discoveryAttributes.dto';
import { MapProductResDto } from '@app/common/dto/map/dto/map-product-res.dto';
import { MapEntity } from '@app/common/database/entities';
import { ImportAttributes } from '@app/common/dto/libot/importAttributes.dto';
import { ImportCreateService } from './import-create.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MapUpdatesService {

  private readonly logger = new Logger(MapUpdatesService.name);

  constructor(
    private readonly env: ConfigService,
    private readonly repo: RepoService,
    private readonly libot: LibotHttpClientService,
    private readonly create: ImportCreateService,
  ) { }

  @Cron(process.env.UPDATE_GOB_TIME ?? '0 0 */6 * * *')
  async checkMapsUpdates() {

    this.logger.log(`Start cron gob to check if there updates for exists maps`)

    try {
      const newProd = await this.getNewProduct()
      if (newProd) {
        const mapUnUpdate = await this.handleMapsToCheck(newProd)
        await this.saveNewProducts(newProd)
        this.updateDevicesUnUpdate(mapUnUpdate)
      }
    } catch (error) {
      this.logger.error(`Job - maps are not obsolete - failed`, error)
    }

  }

  async getNewProduct(): Promise<MapProductResDto[]> {

    this.logger.log(`Checks if there a new product`)

    const recentProduct = await this.repo.getRecentProduct()
    const discoveryAttrs = new DiscoveryAttributes()
    discoveryAttrs.ingestionDate = recentProduct.ingestionDate

    const records = await this.libot.getRecords(discoveryAttrs)    
    this.logger.debug("Convert records to products")
    const products = records.map(record => MapProductResDto.fromRecordsRes(record)).filter(p => p.id != recentProduct.id)
    return products
  }


  async handleMapsToCheck(products: MapProductResDto[]) {
    const mapUnUpdate: MapEntity[] = []
    const take = Number(this.env.get("UPDATE_JOB_MAP_TAKE") ?? 25) // defined the limitation of maps on every iterator
    let skip = 0 // defined the offset map from where to state select
    while (skip < await this.repo.getUnUpdatedMapsCount()) {
      const maps = await this.repo.getUpdatedMaps(take, skip)
      await this.checkUpdatesByGivenMaps(maps, products, mapUnUpdate)
      skip = skip + take
    }
    return mapUnUpdate
  }

  async checkUpdatesByGivenMaps(maps: MapEntity[], products: MapProductResDto[], mapUnUpdate: MapEntity[]) {

    for (let i = 0; i < maps.length; i++) {

      const allProd = [...products];
      allProd.push(maps[i].mapProduct);

      try {
        const mapAttrs = ImportAttributes.fromMapEntity(maps[i]);
        const selectedProd = this.create.extractMostCompatibleProduct(allProd, mapAttrs);
        if (maps[i]?.mapProduct?.ingestionDate !== selectedProd.ingestionDate) {
          const savedMap = await this.repo.updateMapAsUnUpdate(maps[i]);
          mapUnUpdate.push(savedMap);
        }
      } catch (error) {
        this.logger.error(error);
      }
    }
  }

  async saveNewProducts(newProd: MapProductResDto[]) {
    await this.repo.saveProducts(newProd)
  }

  async updateDevicesUnUpdate(mapUnUpdate: MapEntity[]) {

  }

}
