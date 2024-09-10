import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class DevicesStatisticInfo {

  @ApiProperty()
  @IsNumber()
  count: number;

  @ApiProperty()
  @IsNumber()
  updated: number
 
  @ApiProperty()
  @IsNumber()
  onUpdateProcess: number
 
  @ApiProperty()
  @IsNumber()
  updateError: number

  toString() {
    return JSON.stringify(this);
  }
}