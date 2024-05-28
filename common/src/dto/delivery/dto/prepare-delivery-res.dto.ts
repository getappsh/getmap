import { PrepareStatusEnum } from "@app/common/database/entities";
import { ApiProperty } from "@nestjs/swagger";
import { DeliveryItemDto } from "./delivery-item.dto";


export class PrepareDeliveryResDto {
  @ApiProperty()
  catalogId: string;

  @ApiProperty({ enum: PrepareStatusEnum })
  status: PrepareStatusEnum

  @ApiProperty({ required: false })
  progress: number

  @ApiProperty({ required: false })
  size: number

  // TODO it will be removed
  @ApiProperty({required: false})
  url: string;

  @ApiProperty({ required: false,  })
  private artifacts: DeliveryItemDto[];

  get Artifacts(): DeliveryItemDto[] {
    return this.artifacts;
  }

  set Artifacts(artifacts: DeliveryItemDto[]) {
    if (this.hasUniqueKeys(artifacts, 'itemKey')) {
      this.artifacts = artifacts;
    } else {
      throw new Error('Artifacts contain non-unique keys');
    }
  }

  private hasUniqueKeys(array: DeliveryItemDto[], key: keyof DeliveryItemDto): boolean {
    const keys = array.map(item => item[key]);
    const uniqueKeys = new Set(keys);
    return keys.length === uniqueKeys.size;
  }


  toString() {
    return JSON.stringify(this);
  }
}