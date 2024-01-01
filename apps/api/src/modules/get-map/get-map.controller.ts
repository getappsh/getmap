import { Body, Controller, Get, Logger, Param, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { GET_MAP } from "../../utils/paths";
import { GetMapService } from "./get-map.service";
import { CreateImportDto, CreateImportResDto, ImportStatusResDto, ImportStatusDto, MapDto } from "@app/common/dto/map";
import { Unprotected } from "../../utils/sso/sso.decorators";
import { OfferingMapResDto } from "@app/common/dto/offering";

@ApiTags("Get-Map")
@ApiBearerAuth()
@Controller(GET_MAP)
export class GetMapController {
  private readonly logger = new Logger(GetMapController.name);

  constructor(private readonly getMapServices: GetMapService) { }
  
  // // Discovery
  // @Get("discovery/getRecordsCount/:deviceId")
  // @ApiOperation({ description: "Get record counts by deviceId" })
  // @ApiParam({ name: 'deviceId', type: String})
  // @ApiOkResponse({type: RecordsCountResDto})
  // getRecordsCount(@Param('deviceId') deviceId: string){
  //   this.logger.debug(`Discovery Get Records Count, deviceId: ${deviceId}`)
  //   return this.getMapServices.getRecordsCount(deviceId)
  // }

  // Import
  @Get("import/status/:importRequestId")
  @ApiOperation({ description: "This service message allows the consumer to get status information and tracking of the packaging process.  " })
  @ApiOkResponse({type: ImportStatusResDto})
  @ApiParam({name: 'importRequestId', type: String})
  getImportStatus(@Param("importRequestId") importRequestId: string){
    this.logger.debug(`Is import ready, importRequestId: ${importRequestId}`);
    return this.getMapServices.getImportStatus(importRequestId);

  }

  @Post("import/status/")
  @ApiOperation({ description: "Set Import Status" })
  @ApiOkResponse()
  postImportStatus(@Body() importStatusDto: ImportStatusDto){
    this.logger.debug(`Set import status, importRequestId: ${importStatusDto.importRequestId}, status: ${importStatusDto.status} `);
    return this.getMapServices.postImportStatus(importStatusDto);

  }

  @Post('import/create')
  @ApiOperation({ description: "This service message allows the consumer to request to start export of a map stamp and tracking of the packaging process." })
  @ApiOkResponse({type: CreateImportResDto})
  createImport(@Body() createImportDto :CreateImportDto){
    this.logger.debug(`Create Import, data: ${createImportDto}`);
    return this.getMapServices.createImport(createImportDto);
  }

  @Post('import/cancel/:importRequestId')
  @ApiOperation({ description: "This service message allows the consumer to cancel import of a map stamp"})
  @ApiParam({name: 'importRequestId', type: String})
  @ApiOkResponse({type: CreateImportResDto})
  cancelImportCreate(@Param('importRequestId') importRequestId: string){
    this.logger.debug(`Cancel Create Import, data: ${importRequestId}`);
    return this.getMapServices.cancelImportCreate(importRequestId);
  }

  @Get("properties/:importRequestId")
  @ApiOperation({ description: "This service message allows the to get requested map information by is importRequestId." })
  @ApiOkResponse({type: MapDto})
  @ApiParam({name: 'importRequestId', type: String})
  getMapProperties(@Param("importRequestId") importRequestId: string){
    this.logger.debug(`Get map properties, requestId: ${importRequestId}`);
    return this.getMapServices.getMapProperties(importRequestId);
    
  }
  
  @Get("maps")
  @ApiOperation({ description: "This service message allows the to get all requested map" })
  getAllMaps(){
    this.logger.debug(`Get all maps`);
    return this.getMapServices.getAllMapProperties();
  }
  
  @Get("map/:catalogId")
  @ApiOperation({ description: "This service message allows the to get map by catalog id with its all devices" })
  @ApiParam({name: 'catalogId', type: String})
  getMap(@Param('catalogId') catalogId: string){
    this.logger.debug(`Get map with catalog id ${{catalogId}}`);
    return this.getMapServices.getMap(catalogId);
  }
  
  @Get("offering")
  @ApiOperation({ description: "This service message allows the to get all offerings of maps" })
  @ApiOkResponse({type: [OfferingMapResDto]})
  getOffering(){
    this.logger.debug(`Get all offered maps`);
    return this.getMapServices.getOfferedMaps();
  }


}
