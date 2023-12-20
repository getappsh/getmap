import { MapImportStatusEnum } from "@app/common/database/entities";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ErrorDto } from "../../error";
import { MapMetadatatDto } from "./map-metadata.dto";

export class ImportStatusResDto{

  @ApiProperty({required: false})
  @IsString()
  @IsNotEmpty()
  deviceId : string;
  
  @ApiProperty({required: false})
  @IsString()
  @IsNotEmpty()
  importRequestId : string;

  @ApiProperty({enum: MapImportStatusEnum, required: false})
  @IsEnum(MapImportStatusEnum)
  status: MapImportStatusEnum

  @ApiProperty({type: MapMetadatatDto, required: false})
  metaData: MapMetadatatDto

  @ApiProperty({type: ErrorDto, required: false})
  error: ErrorDto


  toString(){
    return JSON.stringify(this);
  }
}
