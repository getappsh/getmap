import { DiscoveryMapDto } from '@app/common/dto/discovery';
import { CreateImportDto, CreateImportResDto, ImportStatusResDto } from '@app/common/dto/map';
import { MapOfferingStatus, OfferingMapResDto } from '@app/common/dto/offering';
import { DiscoveryAttributes } from '@app/common/dto/libot/discoveryAttributes.dto';
import { LibotHttpClientService } from './http-client.service';
import { MapProductResDto } from '@app/common/dto/map/dto/map-product-res.dto';
import { ImportAttributes } from '@app/common/dto/libot/importAttributes.dto';
import { ImportCreateService } from './import-create.service';
import { ErrorCode, ErrorDto } from '@app/common/dto/error';
import { MapError } from '@app/common/dto/libot/utils/map-error';
import { RepoService } from './repo.service';
import { MapEntity, MapImportStatusEnum } from '@app/common/database/entities';
import { Injectable, Logger } from '@nestjs/common';
import { ImportResPayload } from '@app/common/dto/libot/import-res-payload';

@Injectable()
export class GetMapService {


  private readonly logger = new Logger(GetMapService.name);

  constructor(
    private readonly libot: LibotHttpClientService,
    private readonly create: ImportCreateService,
    private readonly repo: RepoService
  ) { }

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

      this.create.isValidBbox(importAttrs.BBox)

      const product = await this.create.selectProduct(importAttrs)
      this.create.completeAttrs(importAttrs, product)

      this.logger.debug("save or update map entity")
      existsMap = await this.repo.getMap(importAttrs)

      if (!existsMap || existsMap.status === MapImportStatusEnum.ERROR || existsMap.status === MapImportStatusEnum.CANCEL) {
        const pEntity = await this.repo.getOrSaveProduct(product)
        existsMap = await this.repo.saveMap(importAttrs, pEntity)
        this.create.executeExport(importAttrs, existsMap)
      }

      // TODO pass this function to device service and emit it in a topic
      this.repo.registerMapToDevice(existsMap, importDto.deviceId)
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

  importCancel() {
    throw new Error('not implemented.');
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
      importRes = ImportStatusResDto.fromMapEntity(map)

    } catch (error) {
      if (error instanceof MapError) {
        importRes.error = this.throwErrorDto(error.errorCode, error.message)
      } else {
        importRes.error = this.throwErrorDto(ErrorCode.MAP_OTHER, error)
      }
    }
    this.logger.log(`Status for catalogId ${reqId} is - ${importRes.status}, progress is at ${importRes.metaData.progress} %`)

    return importRes
  }

  handleNotification(payload: ImportResPayload) {
    this.create.handleSaveExportRes(payload)
  }

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

}
