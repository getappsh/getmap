import { ItemTypeEnum } from "@app/common/database/entities";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";

export class PushOfferingDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  catalogId: string;

  @ApiProperty({type: String, isArray: true})
  @IsOptional()
  @ValidateNested({each:true})
  @IsArray()
  @Type(() => String)
  devices: string[];

  @ApiProperty({type: String, isArray: true})
  @IsOptional()
  @ValidateNested({each:true})
  @IsArray()
  @Type(() => String)
  groups: string[];

  @ApiProperty({ enum: ItemTypeEnum, default: ItemTypeEnum.SOFTWARE })
  @IsEnum(ItemTypeEnum)
  itemType: ItemTypeEnum;

  toString(){
    return JSON.stringify(this);
  }
}