import { DeliveryItemEntity } from "@app/common/database-tng/entities";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export enum HashAlgorithmEnum {
  SHA256Hex = "SHA256Hex",
  SHA256Base64 = "SHA256Base64",
}

export class HashDto {
  @ApiProperty()
  @IsOptional()
  algorithm: HashAlgorithmEnum;

  @ApiProperty()
  @IsOptional()
  hash: string;
}


export class DeliveryItemDto {
  @ApiProperty()
  catalogId: string;

  @ApiProperty()
  itemKey: string;

  @ApiProperty({ required: false })
  metaData: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  size: number

  @ApiProperty({ required: false })
  @IsOptional()
  hash: HashDto

  toString() {
    return JSON.stringify(this);
  }

  static fromDeliveryItemEntity(diE: DeliveryItemEntity): DeliveryItemDto {
    const dto = new DeliveryItemDto();
    dto.catalogId = diE.delivery.catalogId;
    dto.itemKey = diE.itemKey;
    dto.metaData = diE.metaData;
    dto.url = diE.path;
    dto.size = diE.size;
    return dto
  }
}