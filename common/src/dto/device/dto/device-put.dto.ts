import { DeviceEntity } from "@app/common/database/entities";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class DevicePutDto {

  deviceId: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name: string
  
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  orgUID: number

  toString() {
    return JSON.stringify(this);
  }

  static fromDeviceEntity(dE:DeviceEntity){
    const device = new DevicePutDto()
    device.deviceId = dE.ID
    device.name = dE.name

    if(dE.orgUID && dE.orgUID.UID){
      device.orgUID = dE.orgUID.UID
    }

    return device
  }
}