import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";
import { ComponentDto } from "../../discovery";

export class DeviceComponentsOfferingDto {
  @ApiProperty({required: false, type: [ComponentDto]})
  @IsArray()
  @ValidateNested({each:true})
  @Type(() => ComponentDto)
  offer: ComponentDto[]


  @ApiProperty({required: false, type: [ComponentDto]})
  @IsArray()
  @ValidateNested({each:true})
  @Type(() => ComponentDto)
  push: ComponentDto[]


  toString(){
    return JSON.stringify(this)
  }
}