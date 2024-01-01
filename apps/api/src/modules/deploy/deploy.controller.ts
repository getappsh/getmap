import { Body, Controller, Logger, Post } from '@nestjs/common';
import { DeployService } from './deploy.service';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeployStatusDto } from '@app/common/dto/deploy';
import { DEPLOY } from '../../utils/paths';

@ApiTags("Deploy")
@Controller(DEPLOY)
@ApiBearerAuth()
export class DeployController {
  private readonly logger = new Logger(DeployController.name);

  constructor(private readonly deployService: DeployService) {}

  @Post('updateDeployStatus')
  @ApiOperation({description: "This service message allows the consumer to report of the deploy status. When deploy done the device content relevant service will notify. Another option on this service are update delete content on the device."})
  @ApiOkResponse()
  updateDeployStatus(@Body() deployStatusDto: DeployStatusDto){
    this.logger.log(`Update deploy status from device: "${deployStatusDto.deviceId}" for component: "${deployStatusDto.catalogId}"`)
    this.deployService.updateDeployStatus(deployStatusDto);
  }
}
