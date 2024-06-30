import { IsStringOrStringArr } from "@app/common/validators/is-str-or-str-arr.validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDate, IsNumber, IsOptional, Validate } from "class-validator";

export class DeleteFromCacheDto {

  @ApiProperty({required:false})
  @IsOptional()
  @IsNumber()
  size: number

  @ApiProperty({required:false})
  @IsOptional()
  @IsDate()
  date: Date

  @ApiProperty({required:false})
  @IsOptional()
  @Validate(IsStringOrStringArr)
  catalogId: string | string []
  

  static toString() {
    return JSON.stringify(this)
  }
}