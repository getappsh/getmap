import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { GetMapModule } from './get-map.module';
import { MSType, MicroserviceName, MicroserviceType, getClientConfig } from '@app/common/microservice-client';
import { CustomRpcExceptionFilter } from './rpc-exception.filter';
require('dotenv').config()


async function bootstrap() {  
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    GetMapModule,
    getClientConfig(
      {
        type: MicroserviceType.GET_MAP, 
        name: MicroserviceName.GET_MAP_SERVICE
      }, 
      MSType[process.env.MICRO_SERVICE_TYPE])
  );
  app.useGlobalFilters(new CustomRpcExceptionFilter())
  app.listen()
}
bootstrap();
