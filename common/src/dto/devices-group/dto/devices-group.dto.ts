import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { DeviceMapDto } from "../../device/dto/device-map.dto";
import { Type } from "class-transformer";

export class DevicesGroupDto {

  @ApiProperty({required: true})
  @IsNumber()
  id: number

  @ApiProperty({required: false})
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({required: false})
  @IsString()
  @IsOptional()
  description: string
  
  @ApiProperty({required: false, type: DeviceMapDto, isArray: true})
  @IsArray()
  @ValidateNested({each: true})
  @Type(() => DeviceMapDto)
  devices: DeviceMapDto[];

  @ApiProperty({required: false, type: DevicesGroupDto, isArray: true})
  @IsArray()
  @ValidateNested({each: true})
  @Type(() => DevicesGroupDto)
  groups: DevicesGroupDto[];

  toString(){
    return JSON.stringify(this);
  }

}