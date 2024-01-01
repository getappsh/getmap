import { Controller, Post, Body, Logger, Get, Param } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceRegisterDto, DeviceContentResDto, DeviceMapDto } from '@app/common/dto/device';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { DEVICE } from '../../../utils/paths';
import { DeviceDto } from '@app/common/dto/device/dto/device.dto';

@ApiTags("Device")
@ApiBearerAuth()
@Controller(DEVICE)
export class DeviceController {
  private readonly logger = new Logger(DeviceController.name);

  constructor(private readonly deviceService: DeviceService) { }

  @Post('register')
  @ApiOperation({ description: "This service message allow to device registration process for GetApp services." })
  register(@Body() deviceRegister: DeviceRegisterDto) {
    this.logger.debug(`Register, device: ${deviceRegister}`);
    return this.deviceService.register(deviceRegister);
  }

  @Get("devices")
  @ApiOperation({ description: "This service message allow received all registered devices" })
  @ApiOkResponse({ type: DeviceDto })
  getRegisteredDevices() {
    this.logger.debug(`Get all registered devices`)
    return this.deviceService.getRegisteredDevices()
  }
 
  @Get(":deviceId/maps")
  @ApiOperation({ description: "This service message allow received all registered maps on the given devices" })
  @ApiOkResponse({ type: DeviceMapDto })
  getDeviceMaps(@Param("deviceId") deviceId: string) {
    this.logger.debug(`Get all map of device ${deviceId}`)
    return this.deviceService.getDeviceMaps(deviceId)
  }

  @Get("info/installed/:deviceId")
  @ApiOperation({ description: "This service message allow receiving the information for the installations carried out on the device using GetApp services. This message is sent by the device during init phase in order to check compatibility between the existing installations on this device." })
  @ApiParam({ name: 'deviceId', type: String })
  @ApiOkResponse({ type: DeviceContentResDto })
  getDeviceContentInstalled(@Param('deviceId') deviceId: string) {
    this.logger.debug(`Device content installed, deviceId: ${deviceId}`)
    return this.deviceService.getDeviceContentInstalled(deviceId)
  }

}
