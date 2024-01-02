import { ApiProperty } from "@nestjs/swagger";
import { MapImportStatusEnum } from "@app/common/database/entities";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ErrorDto } from "../../error";

export class ImportResDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  importRequestId: string;

  @ApiProperty({enum: MapImportStatusEnum})
  @IsEnum(MapImportStatusEnum)
  status: MapImportStatusEnum;

  @ApiProperty({type: ErrorDto, required: false})
  error: ErrorDto
 
  toString() {
    return JSON.stringify(this);
  }
}