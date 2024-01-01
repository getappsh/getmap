import { Controller, Get, Logger, Param } from '@nestjs/common';
import { OfferingService } from './offering.service';
import { OFFERING } from './../../utils/paths';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ComponentDto } from '@app/common/dto/discovery';

@ApiTags("Offering")
@Controller(OFFERING)
export class OfferingController{
  private readonly logger = new Logger(OfferingController.name);

  constructor(private readonly offeringService: OfferingService) {}

  @Get("component/:catalogId")
  @ApiBearerAuth()
  @ApiOkResponse({type: ComponentDto})
  getOfferingOfComp(@Param("catalogId") catalogId: string) {
    this.logger.debug(`get offering of ${catalogId}`);
    return this.offeringService.getOfferingOfComp(catalogId);
  }
  
 
  
}
