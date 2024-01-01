import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UploadArtifactDto, UpdateUploadStatusDto, UploadManifestDto } from '@app/common/dto/upload';
import { UploadService } from './upload.service';
import { UPLOAD } from './../../utils/paths';
import { Unprotected } from '../../utils/sso/sso.decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { ComponentDto } from '@app/common/dto/discovery';

@ApiTags('Upload')
@Controller(UPLOAD)
export class UploadController {

  constructor(
    private readonly uploadService: UploadService){}

  @Post('artifact')
  @Unprotected()
  uploadArtifact(@Body() uploadVersionDto: UploadArtifactDto): {}{
    return this.uploadService.uploadArtifact(uploadVersionDto)
  }

  @Post('manifest')
  @Unprotected()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File and upload token',
    type: UploadManifestDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadManifest(@UploadedFile() file: Express.Multer.File, @Body() body: UploadManifestDto) {
    return this.uploadService.uploadManifest(file, body);

  }

  @Post('updateUploadStatus')
  @Unprotected()
  @ApiCreatedResponse({description: "return 201 with no body"})
  updateUploadStatus(@Body() updateUploadStatusDto: UpdateUploadStatusDto): {}{
    return this.uploadService.updateUploadStatus(updateUploadStatusDto)
  }


  @Get('lastVersion/:projectId')
  @ApiBearerAuth()
  @ApiOkResponse({type: ComponentDto})
  @ApiParam({name: 'projectId', type: Number})
  getLastVersion(@Param() params: {projectId: number}){
    return this.uploadService.getLastVersion(params);
  }
}
