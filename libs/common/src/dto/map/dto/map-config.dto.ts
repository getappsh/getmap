import { MapConfigEntity } from "@app/common/database/entities";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

export class MapConfigDto {

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  deliveryTimeout: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  maxMapSizeInMeter: number

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
  downloadTimeoutSec: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  periodicForInventoryJob: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  periodicForMapConf: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  minSpaceByte: number

  static fromMapConfig(cE: MapConfigEntity) {
    const config = new MapConfigDto()
    config.deliveryTimeout = cE.deliveryTimeout
    config.downloadRetryTime = cE.downloadRetryTime
    config.downloadTimeoutSec = cE.downloadTimeoutSec
    config.maxMapSizeInMeter = cE.maxMapSizeInMeter
    config.maxParallelDownloads = cE.maxParallelDownloads
    config.minSpaceByte = cE.minSpaceByte
    config.periodicForInventoryJob = cE.periodicForInventoryJob
    config.periodicForMapConf = cE.periodicForMapConf

    return config
  }
  
  toString() {
    return JSON.stringify(this)
  }
}