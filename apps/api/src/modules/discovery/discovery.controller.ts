import { Body, Controller, Logger, Post } from '@nestjs/common';
import { DISCOVERY } from '../../utils/paths';
import { DiscoveryService } from './discovery.service';
import { DiscoveryMessageDto } from '@app/common/dto/discovery';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { OfferingResponseDto } from '@app/common/dto/offering';

@ApiTags("Discovery")
@Controller(DISCOVERY)
export class DiscoveryController{
  private readonly logger = new Logger(DiscoveryController.name);

  constructor(private readonly discoveryService: DiscoveryService) {}

  // todo discovery dto validate now only for get-app discovery and not for get-map discovery
  @Post()
  @ApiBearerAuth()
  @ApiCreatedResponse({type: OfferingResponseDto})
  discoveryMessage(@Body() discoveryMessage: DiscoveryMessageDto) {
    this.logger.debug(`discovery: ${discoveryMessage}`);
    
    this.discoveryService.discoveryMessage(discoveryMessage);

    return this.discoveryService.checkUpdates(discoveryMessage);

  }

}
