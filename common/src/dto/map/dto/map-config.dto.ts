import { MapConfigEntity } from "@app/common/database/entities";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

export class MapConfigDto {

  @ApiProperty({required: false})
  @IsOptional()
  @IsNumber()
  deliveryTimeout: number
  
  @ApiProperty({required: false})
  @IsOptional()
  @IsNumber()
  maxMapSizeInMeter: number
  
  @ApiProperty({required: false})
  @IsOptional()
  @IsNumber()
  maxParallelDownloads: number
  
  @ApiProperty({required: false})
  @IsOptional()
  @IsNumber()
  downloadRetryTime: number
  
  @ApiProperty({required: false})
  @IsOptional()
  @IsNumber()
  downloadTimeoutSec: number
  
  @ApiProperty({required: false})
  @IsOptional()
  @IsNumber()
  periodicForInventoryJob: number
  
  @ApiProperty({required: false})
  @IsOptional()
  @IsNumber()
  periodicForMapConf: number
  
  @ApiProperty({required: false})
  @IsOptional()
  @IsNumber()
  minSpaceByte: number

  static fromMapConfig(cE: MapConfigEntity){
    const config = new MapConfigDto()
    for (const key in cE) {
      if (Object.prototype.hasOwnProperty.call(cE, key)) {
        config[key] = cE[key];
      }
    }
  }
  toString(){
    return JSON.stringify(this)
  }
}