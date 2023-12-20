import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { MapProductResDto } from "../../map/dto/map-product-res.dto";



export enum MapOfferingStatus {
  SUCCESS = 'Success',
  ERROR = 'Error'
}

export class OfferingMapResDto {
  @ApiProperty({required: false, type: MapProductResDto, isArray: true})
  products: MapProductResDto[];

  @ApiProperty({enum: MapOfferingStatus})
  @IsEnum(MapOfferingStatus)
  status: MapOfferingStatus

  @ApiProperty({required: false})
  reason: string 
}