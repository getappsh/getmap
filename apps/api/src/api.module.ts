import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { KeyCloakModole } from './config/keycloak/keycloak-config.module';
import { Login } from './modules/login/login.module';
import { UploadModule } from './modules/upload/upload.module';
import { DeliveryModule } from './modules/delivery/delivery.module';
import { OfferingModule } from './modules/offering/offering.module';
import { DiscoveryModule } from './modules/discovery/discovery.module';
import { ProjectManagementModule } from './modules/project-management/project-management.module';
import { GetMapModule } from './modules/get-map/get-map.module';
import { DeployModule } from './modules/deploy/deploy.module';
import { DeviceModule } from './modules/device/device.module';
import { MicroserviceModule, MicroserviceName, MicroserviceType } from '@app/common/microservice-client';
import { LogRequestBodyMiddleware } from './utils/middleware/log-request-body.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    KeyCloakModole,
    MicroserviceModule.register({
      name: MicroserviceName.GET_MAP_SERVICE,
      type: MicroserviceType.GET_MAP,
    }),
    MicroserviceModule.register({
      name: MicroserviceName.DEVICE_SERVICE,
      type: MicroserviceType.DEVICE,
    }),
    Login,
    UploadModule,
    DeliveryModule,
    OfferingModule,
    // DiscoveryModule,
    ProjectManagementModule,
    GetMapModule,
    DeployModule,
    DeviceModule,
  ],
  controllers: [ApiController],
  providers: [
    ApiService,
  ],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogRequestBodyMiddleware).forRoutes('*');
  }
 }
