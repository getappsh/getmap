import { Module } from '@nestjs/common';
import { GetMapController } from './get-map.controller';
import { GetMapService } from './get-map.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule, HttpService } from '@nestjs/axios';
import { LibotHttpClientService } from './http-client.service';
import { ImportCreateService } from './import-create.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
    // DatabaseModule,
    // TypeOrmModule.forFeature([UploadVersionEntity, VersionPackagesEntity, ProjectEntity, MemberProjectEntity, MemberEntity]) 
  ],
  controllers: [GetMapController],
  providers: [GetMapService, LibotHttpClientService, ImportCreateService],
})
export class GetMapModule { }
