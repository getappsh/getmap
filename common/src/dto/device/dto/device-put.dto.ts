import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class DevicePutDto {

  deviceId: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name: string

  toString() {
    return JSON.stringify(this);
  }
}