import { DeliveryItemEntity } from "@app/common/database-tng/entities";
import { ApiProperty } from "@nestjs/swagger";


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