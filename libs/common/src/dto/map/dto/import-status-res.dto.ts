import { ApiProperty } from "@nestjs/swagger";
import { MapMetadatatDto } from "./map-metadata.dto";
import { ImportResDto } from "./import-res-dto";

export class ImportStatusResDto extends ImportResDto{

  @ApiProperty({type: MapMetadatatDto, required: false})
  metaData: MapMetadatatDto

  toString(){
    return JSON.stringify(this);
  }
}
