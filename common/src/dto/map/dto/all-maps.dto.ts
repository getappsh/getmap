import { DeviceEntity, MapEntity } from "@app/common/database/entities";
import { ApiProperty } from "@nestjs/swagger";
import { MapDto } from "./map.dto";

export class MapDevicesDto extends MapDto {

  @ApiProperty({required: false})
  devices: DeviceEntity[]

  static fromMapEntity(mapEntity: MapEntity): MapDevicesDto{
    let map :MapDto = super.fromMapEntity(mapEntity);
    let allMaps: MapDevicesDto = {...map, devices: mapEntity.devices}
    return allMaps;
  }

  toString(){
    return JSON.stringify(this);
  }
}