import { Controller, Post, Body, Logger, Get, Param, ParseArrayPipe } from '@nestjs/common';
import { DiscoveryService } from './discovery.service';
import { DeviceRegisterDto, DeviceContentResDto } from '@app/common/dto/device';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { DEVICE } from '../../../utils/paths';
import { DiscoveryResDto } from '@app/common/dto/discovery';
import { DiscoveryMessageDto } from '@app/common/dto/discovery';
import { DeviceDiscoverDto, DeviceDiscoverResDto } from '@app/common/dto/im';
import { DeviceDto } from '@app/common/dto/device/dto/device.dto';

@ApiTags("Device - discovery")
@ApiBearerAuth()
@Controller(DEVICE)
export class DiscoveryController {
  private readonly logger = new Logger(DiscoveryController.name);

  constructor(private readonly deviceService: DiscoveryService) {}

  @Post("discover")
  @ApiOperation({ description: "This service message allow to device post the discovery context for getting offers softwares and maps for GetApp agent. " })
  @ApiOkResponse({type: DiscoveryResDto})
  discoveryCatalog(@Body() discoveryMessageDto: DiscoveryMessageDto) {
    this.logger.debug(`Discovery: ${discoveryMessageDto}`)
    return this.deviceService.discoveryCatalog(discoveryMessageDto);
  }

  @Post("im/push/discovery")
  @ApiOperation({ description: "This service message allow to IM device push the discovery context of other agents." })
  async imPushDiscoveryDevices(@Body(new ParseArrayPipe({items: DeviceDiscoverDto})) devicesDiscovery: DeviceDiscoverDto[]){
    this.logger.debug("IM Push Discovery Devices");
    this.logger.verbose(JSON.stringify(devicesDiscovery));
    await this.deviceService.imPushDiscoveryDevices(devicesDiscovery);
    return
  }

  @Post("im/pull/discovery")
  @ApiOperation({ description: "This service message allow to IM device pull the discovery context of other agents."})
  @ApiOkResponse({type: [DeviceDiscoverResDto]})
  imPullDiscoveryDevices(@Body(new ParseArrayPipe({items: DeviceDiscoverDto})) devicesDiscovery: DeviceDiscoverDto[]){
    this.logger.debug("IM Pull Discovery Devices");
    return this.deviceService.imPullDiscoveryDevices(devicesDiscovery);
  }

}
