import { DeviceEntity } from "@app/common/database/entities";
import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class DevicePutDto {

  deviceId: string

  @ApiProperty({ required: false })
  @IsString()
  name: string

  toString() {
    return JSON.stringify(this);
  }

  static fromDeviceEntity(dE:DeviceEntity){
    const device = new DevicePutDto()
    device.deviceId = dE.ID
    device.name = dE.name

    return device
  }
}