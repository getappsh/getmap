
import { DeviceConfigEntity } from "@app/common/database/entities/device-config.entity";
import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { plainToClass } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, validate } from "class-validator";


export enum TargetStoragePolicy {
  SD_ONLY = "SDOnly",
  FLASH_THEN_SD = "FlashThenSD",
  SD_THEN_FLASH = "SDThenFlash",
  FLASH_ONLY = "FlashOnly"
}

export class BaseConfigDto{
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  group: string


  @ApiProperty({ required: false })
  @IsOptional()
  lastConfigUpdateDate: Date

}


export class WindowsConfigDto extends BaseConfigDto{

  constructor(){
    super();
    this.group = 'windows'
  }

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
  lastCheckingMapUpdatesDate: Date


  static fromConfigEntity(eConfig: DeviceConfigEntity): WindowsConfigDto{
    let config = new WindowsConfigDto();
    config.group = eConfig.group;
    for (const key in eConfig.data) {
      config[key] = eConfig.data[key]
    }
    return config
  }


}

export class AndroidConfigDto extends BaseConfigDto{

  constructor(){
    super();
    this.group = 'android'
  }

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
  @IsString()
  sdStoragePath: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  flashStoragePath: string
  
  @ApiProperty({enum: TargetStoragePolicy, required: false, default: TargetStoragePolicy.SD_ONLY})
  @IsOptional()
  @IsEnum(TargetStoragePolicy)
  targetStoragePolicy: TargetStoragePolicy


  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  sdInventoryMaxSizeMB: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  flashInventoryMaxSizeMB: number

  @ApiProperty({ required: false })
  @IsOptional()
  lastCheckingMapUpdatesDate: Date
  
  @ApiProperty({ required: false })
  @IsOptional()
  lastConfigUpdateDate: Date

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  ortophotoMapPath: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  controlMapPath: string

  static fromConfigEntity(cE: DeviceConfigEntity) {
    const config = new AndroidConfigDto()
    config.group = cE.group;
    for (const key in cE.data) {
      config[key] = cE.data[key]
    }
    return config
  }

  toString() {
    return JSON.stringify(this)
  }
}



export function fromConfigEntity(eConfig: DeviceConfigEntity): AndroidConfigDto | WindowsConfigDto{
  let config: AndroidConfigDto | WindowsConfigDto;
  if (eConfig.group === 'android'){
      config = new AndroidConfigDto();
  }else {
    config = new WindowsConfigDto();
  }  
  config.lastConfigUpdateDate = eConfig.lastUpdatedDate;
  for (const key in eConfig.data) {
    config[key] = eConfig.data[key];
  }
  return config;
}


@Injectable()
export class DeviceConfigValidator implements PipeTransform {
  async transform(value: any) {
    console.log("in")
    const base = plainToClass(BaseConfigDto, value);
    const baseErrors = await validate(base);
    if (baseErrors.length !== 0) {
      throw new BadRequestException('Validation failed');
    }


    if (base.group === 'windows'){
      const windows = plainToClass(WindowsConfigDto, value, { excludeExtraneousValues: true });
      const errors = await validate(windows);
      if (errors.length !== 0) {
        throw new BadRequestException('Validation failed');
      }
      return windows
    }else {
      const android = plainToClass(AndroidConfigDto, value, { excludeExtraneousValues: true });

      const errors = await validate(android);
      if (errors.length !== 0) {
        throw new BadRequestException('Validation failed');
      }
      return android
    }
  }
}
