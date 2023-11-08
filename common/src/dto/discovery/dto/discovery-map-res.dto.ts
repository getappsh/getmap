import { ApiProperty } from "@nestjs/swagger";

export class DiscoveryMapResDto {

  @ApiProperty({required: false})
  productId: string;

  @ApiProperty({required: false})
  productName: string;

  @ApiProperty({required: false})
  productVersion: string;

  @ApiProperty({required: false})
  footprint: string;

  @ApiProperty({required: false})
  maxResolution: number

  @ApiProperty({required: false})
  productType: string;

  @ApiProperty({required: false})
  boundingBox: string;

  @ApiProperty({required: false})
  description: string;

  @ApiProperty({required: false})
  updateDateUTC: Date;

  @ApiProperty({required: false})
  takenDate: Date;

  @ApiProperty({required: false})
  ingestionDate: Date;


  @ApiProperty({required: false})
  region: string;


  toString() {
    return JSON.stringify(this);
  }

}