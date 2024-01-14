import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsArray, IsNotEmpty, IsString } from "class-validator"

export class InventoryUpdatesReqDto{

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  deviceId: string


  @ApiProperty({type: [String]})
  @IsArray()
  @IsString({each: true})
  @Type(() => String)
  inventory: string[]

  toString(): string{
    return JSON.stringify(this)
  }
}