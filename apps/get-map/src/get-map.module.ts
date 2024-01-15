import { Module } from '@nestjs/common';
import { GetMapController } from './get-map.controller';
import { GetMapService } from './get-map.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule, HttpService } from '@nestjs/axios';
import { LibotHttpClientService } from './http-client.service';
import { ImportCreateService } from './import-create.service';
import { RepoService } from './repo.service';
import { DatabaseModule } from '@app/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceEntity, DeviceMapStateEntity, MapEntity, ProductEntity } from '@app/common/database/entities';
import { InventoryService } from './inventory.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
    DatabaseModule,
    TypeOrmModule.forFeature([MapEntity, DeviceEntity, DeviceMapStateEntity, ProductEntity]),
    ScheduleModule.forRoot()
  ],
  controllers: [GetMapController],
  providers: [GetMapService, LibotHttpClientService, ImportCreateService, RepoService, InventoryService],
})
export class GetMapModule { }
