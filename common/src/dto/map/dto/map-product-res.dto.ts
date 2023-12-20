import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class MapProductResDto {

  @ApiProperty()
  id: string

  @ApiProperty()
  productId: string;

  @ApiProperty({required: false})
  productName: string;

  @ApiProperty({required: false})
  productVersion: string;

  @ApiProperty({required: false})
  productType: string;

  @ApiProperty({required: false})
  productSubType: string;

  @ApiProperty({required: false})
  description: string;

  @ApiProperty({required: false})
  imagingTimeBeginUTC: Date;

  @ApiProperty({required: false})
  imagingTimeEndUTC: Date;

  @ApiProperty({required: false})
  maxResolutionDeg: number

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  footprint: string;

  @ApiProperty({required: false})
  transparency: string
 
  @ApiProperty({required: false})
  region: string;

  @ApiProperty({required: false})
  ingestionDate: Date;

  toString() {
    return JSON.stringify(this);
  }

}