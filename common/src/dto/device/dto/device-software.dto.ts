import { IsDate, IsNotEmpty, IsOptional } from "class-validator";
import { DeviceDto } from "./device.dto";
import { ApiProperty } from "@nestjs/swagger";
import { ComponentDto } from "../../discovery";
import { DeviceComponentEntity, DeviceComponentStateEnum, DeviceEntity, DiscoveryMessageEntity } from "@app/common/database/entities";
import { Type } from "class-transformer";


export class SoftwareStateDto {
  
  @ApiProperty({ type: ComponentDto})
  software: ComponentDto;

  @ApiProperty({ required: false, enum: DeviceComponentStateEnum })
  state: DeviceComponentStateEnum;


  @ApiProperty()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  downloadDate: Date;


  @ApiProperty()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  deployDate: Date;

  @ApiProperty({ isArray: true, type: SoftwareStateDto })
  offering: SoftwareStateDto[];

  static fromDeviceComponentEntity(componentState: DeviceComponentEntity) {

    let softwareState = new SoftwareStateDto();
    softwareState.software = ComponentDto.fromUploadVersionEntity(componentState.component);
    softwareState.state = componentState.state;

    return softwareState;
  }

  toString() {
    return JSON.stringify(this);
  }
  
}
export class DeviceSoftwareDto extends DeviceDto {

  @ApiProperty({ isArray: true, type: SoftwareStateDto })
  @IsNotEmpty()
  softwares: SoftwareStateDto[];


  static fromDeviceComponentsEntity(deviceComponents: DeviceComponentEntity[], device: DeviceDto): DeviceSoftwareDto {
    let deviceSoftware  = device as DeviceSoftwareDto;
    deviceSoftware.softwares = deviceComponents.map(c => SoftwareStateDto.fromDeviceComponentEntity(c));

    return deviceSoftware
  }

  toString() {
    return JSON.stringify(this);
  }
}

