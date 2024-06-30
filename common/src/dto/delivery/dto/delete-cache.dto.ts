import { IsValidStringFor } from "@app/common/validators";
import { IsStringOrStringArr } from "@app/common/validators/is-str-or-str-arr.validator";
import { Pattern } from "@app/common/validators/regex.validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDate, IsDateString, IsNumber, IsOptional, IsString, Validate } from "class-validator";

export class DeleteFromCacheDto {

  @ApiProperty({required:false})
  @IsOptional()
  @IsNumber()
  size: number

  @ApiProperty({required:false})
  @IsOptional()
  @IsValidStringFor(Pattern.Date)
  date: string

  @ApiProperty({required:false})
  @IsOptional()
  @Validate(IsStringOrStringArr)
  catalogId: string | string []
  

  static toString() {
    return JSON.stringify(this)
  }
}