import { ApiProperty } from "@nestjs/swagger";
import { DiscoveryMapResDto } from "./discovery-map-res.dto";
import { OfferingResponseDto } from "@app/common/dto/offering";

export class DiscoveryResDto{

  @ApiProperty({required: false, type: OfferingResponseDto})
  software: OfferingResponseDto;

  @ApiProperty({required: false, type: DiscoveryMapResDto, isArray: true})
  map: DiscoveryMapResDto[];
}