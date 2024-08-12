import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import { RepoService } from './repo.service';
import { LibotHttpClientService } from './http-client/http-client.service';
import { DiscoveryAttributes } from '@app/common/dto/map/dto/discoveryAttributes.dto';
import { MapProductResDto } from '@app/common/dto/map/dto/map-product-res.dto';
import { MapEntity } from '@app/common/database/entities';
import { ImportAttributes } from '@app/common/dto/map/dto/importAttributes.dto';
import { ImportCreateService } from './import-create.service';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobsEntity } from '@app/common/database/entities/map-updatesCronJob';
import { L_HttpClientService } from './http-client/http-client.module';

@Injectable()
export class MapUpdatesService {

  private readonly logger = new Logger(MapUpdatesService.name);
  JOB_NAME = "mapUpdates"

  constructor(
    private readonly env: ConfigService,
    private readonly repo: RepoService,
    @Inject(L_HttpClientService) private readonly libot: LibotHttpClientService,
    private readonly create: ImportCreateService,
    @InjectRepository(JobsEntity) private readonly mapUpdatesRepo: Repository<JobsEntity>
  ) { }

  @Cron(process.env.UPDATE_GOB_TIME ?? CronExpression.EVERY_6_HOURS, {
    name: "mapUpdates"
  })
  async checkMapsUpdates() {

    this.logger.log(`Start cron gob to check if there updates for exists maps`)

    let jE: JobsEntity
    try {
      jE = await this.tryToSaveJobStartTime()
      if (jE) {
        const newProd = await this.getProducts()
        // const newProd = await this.getNewProduct()
        if (newProd && newProd.length > 0) {
          await this.handleMapsToCheck(newProd)
          // await this.saveNewProducts(newProd)
        } else if (newProd) {
          this.logger.log(`there aren't new products`)
        }
      }
    } catch (error) {
      this.logger.error(`Job - maps are not obsolete - failed`, error)
    } finally {
      await this.saveJobEndTime(jE)
    }

  }

  async tryToSaveJobStartTime() {
    const isImMiddleAJob = await this.checkIsAJobInMiddle()

    if (!isImMiddleAJob) {
      this.logger.log(`try to save cron job start time`)
      const jE = this.mapUpdatesRepo.create()
      jE.name = this.JOB_NAME
      jE.startTime = new Date(Date.now())
      try {
        return await this.mapUpdatesRepo.save(jE)
      } catch (error) {
        if (error.code === '23505') {
          this.logger.log("Maps is obsolete cron job failed, because it started by another service")
        } else {
          throw error
        }
      }
    }
  }

  async checkIsAJobInMiddle() {
    this.logger.log(`Checks if a 'map updates' job is still working`)
    const lastJob = await this.mapUpdatesRepo.findOne({ where: { name: this.JOB_NAME }, order: { startTime: "DESC" } })
    if (!lastJob) {
      return false
    }
    if (lastJob && (lastJob.endTime || Date.now() - new Date(lastJob.startTime).getTime() > (5 * 60 * 1000))) {
      return false
    } else {
      this.logger.log(`The 'map updates' job is still working, cannot be restarted`)
      return true
    }
  }

  async saveJobEndTime(jobE: JobsEntity) {
    if (jobE) {
      this.logger.log(`save cron job end time`)
      try {
        jobE.endTime = new Date(Date.now())
        await this.mapUpdatesRepo.save(jobE)
      } catch (error) {
        this.logger.error(error)
      }
    }
  }

  async getNewProduct(): Promise<MapProductResDto[]> {

    this.logger.log(`Checks if there a new product`)

    const recentProduct = await this.repo.getRecentProduct()
    if (recentProduct) {
      const discoveryAttrs = new DiscoveryAttributes()
      discoveryAttrs.ingestionDate = recentProduct.ingestionDate
      const records = await this.libot.getRecords(discoveryAttrs, true)

      let products = []
      if (records && records.length > 0) {
        products = records.filter(p => p.id != recentProduct.id)
      }
      return products
    } else {
      this.logger.warn(`"Maps is obsolete" did not work, because there are no existing maps`)
    }
  }

  async getProducts(): Promise<MapProductResDto[]> {

    this.logger.log(`Get From libot all offered products`)

    const discoveryAttrs = new DiscoveryAttributes()
    const records = await this.libot.reqAndRetry(async () => await this.libot.getRecords(discoveryAttrs, true), "Get records", true)

    let products = []
    if (records && records.length > 0) {
      products = records
    }
    return products

  }

  async handleMapsToCheck(products: MapProductResDto[]) {
    const take = Number(this.env.get("UPDATE_JOB_MAP_TAKE") ?? 25) // defined the limitation of maps on every iterator
    let skip = 0 // defined the offset map from where to state select
    const mapCount = await this.repo.getUnUpdatedMapsCount()
    while (skip < mapCount) {
      const mapObsoleted: MapEntity[] = []
      const mapsUpdated: MapEntity[] = []
      const maps = await this.repo.getMapsASC(take, skip)
      await this.checkUpdatesByGivenMaps(maps, products, mapObsoleted, mapsUpdated)
      this.updateDevicesUnUpdate(mapObsoleted)
      skip = skip + take
    }
  }

  async checkUpdatesByGivenMaps(maps: MapEntity[], products: MapProductResDto[], mapObsoleted: MapEntity[], mapsUpdated: MapEntity[]) {

    for (let i = 0; i < maps.length; i++) {

      // const allProd = [...products];
      // allProd.push(maps[i].mapProduct);

      try {
        const mapAttrs = ImportAttributes.fromFootprint(maps[i]);
        const selectedProd = await this.create.extractMostCompatibleProduct(products, mapAttrs);

        if (!selectedProd) {
          this.logger.warn(`Map ${maps[i].catalogId} is not valid for any product`)
        }

        if (maps[i]?.mapProduct?.ingestionDate.toISOString() !== selectedProd?.ingestionDate.toISOString()) {
          this.logger.debug(`map with catalogID ${maps[i].catalogId} is obsolete`)
          if (maps[i].isUpdated) {
            const savedMap = await this.repo.updateMapAsUnUpdate(maps[i]);
            mapObsoleted.push(savedMap);
          }
        }
        else {
          this.logger.debug(`map with catalogID ${maps[i].catalogId} is updated`)
          if (!maps[i].isUpdated) {
            const savedMap = await this.repo.updateMapAsUpdate(maps[i]);
            mapsUpdated.push(savedMap);
          }
        }
      } catch (error) {
        this.logger.error(error);
      }
    }
  }

  async saveNewProducts(newProd: MapProductResDto[]) {
    // this.logger.log(`Update or create the checked products`)
    // const updatedP = await this.repo.updateProducts(newProd, { isCheckedAgainstMaps: true })
    // const pToCreate = newProd.filter(nP => !updatedP.find(uP => uP.id === nP.id))
    // await this.repo.createAndSaveProducts(pToCreate, { isCheckedAgainstMaps: true })
    
    await this.repo.createAndSaveProducts(newProd, { isCheckedAgainstMaps: true })
  }

  async updateDevicesUnUpdate(mapUnUpdate: MapEntity[]) {

  }

}
