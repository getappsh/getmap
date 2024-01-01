import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class MapMetadatatDto{

  @ApiProperty({required: false})
  @IsOptional()
  @IsString()
  jobId: String

  @ApiProperty({required: false})
  @IsOptional()
  @IsString()
  mapId: String

  @ApiProperty({required: false})
  @IsOptional()
  @IsDateString()
  exportStart : Date

  @ApiProperty({required: false})
  @IsOptional()
  @IsDateString()
  exportEnd : Date

  @ApiProperty({type: 'integer', default: 0})
  @IsNumber()
  progress: number

  @ApiProperty({type: 'integer', default: 1})
  zoomLevel: number

  @ApiProperty({required: false})
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  packageUrl : string;

  @ApiProperty({required: false})
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  fileName : string;


}
