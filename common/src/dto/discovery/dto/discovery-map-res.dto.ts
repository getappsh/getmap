import { ApiProperty } from "@nestjs/swagger";

export class DiscoveryMapResDto {

  @ApiProperty({required: false})
  productId: string;

  @ApiProperty({required: false})
  productName: string;

  @ApiProperty({required: false})
  productVersion: string;

  @ApiProperty({required: false})
  productType: string;

  @ApiProperty({required: false})
  boundingBox: string;

  @ApiProperty({required: false})
  description: string;

  @ApiProperty({required: false})
  updateDateUTC: Date;


  toString() {
    return JSON.stringify(this);
  }

}