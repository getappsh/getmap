import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { DeviceMapDto } from "../../device/dto/device-map.dto";
import { Type } from "class-transformer";
import { OrgGroupEntity } from "@app/common/database/entities";

export class ChildGroupDto {

  @ApiProperty({ required: true })
  @IsNumber()
  id: number

  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description: string

  @ApiProperty({ required: false, })
  @IsArray()
  @IsString({ each: true })
  devices: string[];

  @ApiProperty({ required: false })
  @IsArray()
  @IsNumber({ allowNaN: false }, { each: true })
  groups: number[];


  static fromDevicesGroupEntity(dge: OrgGroupEntity): ChildGroupDto {
    let devicesGroupDto = new ChildGroupDto();
    devicesGroupDto.id = dge.id;
    devicesGroupDto.name = dge.name;
    devicesGroupDto.description = dge?.description;
    devicesGroupDto.devices = dge?.orgUID?.map(ids => ids.device?.ID)
    devicesGroupDto.groups = dge?.children?.map(childe => childe.id)

    return devicesGroupDto
  }

  static fromChildGroupRawDto(cgr: ChildGroupRawDto): ChildGroupDto  {
    let devicesGroupDto = new ChildGroupDto();
    devicesGroupDto.id = cgr.group_id;
    devicesGroupDto.name = cgr.group_name;
    devicesGroupDto.description = cgr?.group_description;
    devicesGroupDto.devices = cgr.deviceIds
    devicesGroupDto.groups = cgr.childrenIds
    return devicesGroupDto
  }

  toString() {
    return JSON.stringify(this);
  }

}

export class ChildGroupRawDto {

  group_id: number
  group_createdDate: string
  group_lastUpdatedDate: string
  group_name: string
  group_description: string | null
  group_parent_id: number | null
  childrenIds: number[]
  deviceIds: string[]

  toString() {
    return JSON.stringify(this);
  }

}