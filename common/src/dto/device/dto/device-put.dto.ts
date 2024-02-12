import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class DevicePutDto {

  deviceId: string

  @ApiProperty({ required: false })
  @IsString()
  deviceName: string

  toString() {
    return JSON.stringify(this);
  }
}