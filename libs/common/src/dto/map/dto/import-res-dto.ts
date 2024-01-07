import { ApiProperty } from "@nestjs/swagger";
import { MapImportStatusEnum } from "@app/common/database/entities";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ErrorDto } from "../../error";
import { MapProperties } from "./create-import-dto";

export class ImportResDto {

  @ApiProperty()
 
  importRequestId: string;

  @ApiProperty({enum: MapImportStatusEnum})
  status: MapImportStatusEnum;
  
  @ApiProperty()
  properties: MapProperties;

  @ApiProperty({type: ErrorDto, required: false})
  error: ErrorDto
 
  toString() {
    return JSON.stringify(this);
  }
}