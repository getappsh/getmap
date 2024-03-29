import { MapConfigEntity } from "@app/common/database/entities";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class MapConfigDto {

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  deliveryTimeoutMins: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  MaxMapAreaSqKm: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  maxMapSizeInMB: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  maxParallelDownloads: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  downloadRetryTime: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  downloadTimeoutMins: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  periodicInventoryIntervalMins: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  periodicConfIntervalMins: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  periodicMatomoIntervalMins: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  minAvailableSpaceMB: number

  
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  mapMinInclusionInPercentages: number
  
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  matomoUrl: string
  
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  matomoDimensionId: string
  
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  matomoSiteId: string

  @ApiProperty({ required: false })
  @IsOptional()
  lastCheckingMapUpdatesDate: Date
  
  @ApiProperty({ required: false })
  @IsOptional()
  lastConfigUpdateDate: Date

  static fromMapConfig(cE: MapConfigEntity) {
    const config = new MapConfigDto()
    config.deliveryTimeoutMins = cE.deliveryTimeoutMins
    config.downloadRetryTime = cE.downloadRetryTime
    config.downloadTimeoutMins = cE.downloadTimeoutMins
    config.MaxMapAreaSqKm = cE.MaxMapAreaSqKm
    config.maxMapSizeInMB = cE.maxMapSizeInMB
    config.maxParallelDownloads = cE.maxParallelDownloads
    config.minAvailableSpaceMB = cE.minAvailableSpaceMB
    config.periodicInventoryIntervalMins = cE.periodicInventoryIntervalMins
    config.periodicConfIntervalMins = cE.periodicConfIntervalMins
    config.periodicMatomoIntervalMins = cE.periodicMatomoIntervalMins
    config.mapMinInclusionInPercentages = cE.mapMinInclusionInPercentages
    config.matomoUrl = cE.matomoUrl
    config.matomoDimensionId = cE.matomoDimensionId
    config.matomoSiteId = cE.matomoSiteId
    config.lastConfigUpdateDate = cE.lastUpdatedDate

    return config
  }

  toString() {
    return JSON.stringify(this)
  }
}