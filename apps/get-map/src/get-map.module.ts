import { Module } from '@nestjs/common';
import { GetMapController } from './get-map.controller';
import { GetMapService } from './get-map.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ImportCreateService } from './import-create.service';
import { RepoService } from './repo.service';
import { DatabaseModule } from '@app/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceEntity, DeviceMapStateEntity, MapEntity, ProductEntity } from '@app/common/database/entities';
import { MapUpdatesService } from './map-updates.service';
import { ScheduleModule } from '@nestjs/schedule';
import { MicroserviceModule, MicroserviceName, MicroserviceType } from '@app/common/microservice-client';
import { JobsEntity } from '@app/common/database/entities/map-updatesCronJob';
import { LoggerModule } from '@app/common/logger/logger.module';
import { HttpClientModule } from './http-client/http-client.module';
import { ApmModule } from '@app/common/apm/apm.module';
import { DeviceConfigEntity } from '@app/common/database/entities/device-config.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot({ httpCls: false, jsonLogger: process.env.LOGGER_FORMAT === 'JSON', name: "Get-map" }),
    ApmModule,
    HttpModule,
    DatabaseModule,
    TypeOrmModule.forFeature([MapEntity, DeviceEntity, DeviceMapStateEntity, ProductEntity, JobsEntity, DeviceConfigEntity]),
    ScheduleModule.forRoot(),
    MicroserviceModule.register({
      name: MicroserviceName.DISCOVERY_SERVICE,
      type: MicroserviceType.DISCOVERY,
    }),
    HttpClientModule.forRoot({ isEmulator: process.env.LIBOT_EMULATOR == "true" ?? false })
  ],
  controllers: [GetMapController],
  providers: [GetMapService, ImportCreateService, RepoService, MapUpdatesService],
})
export class GetMapModule { }
