import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { GetMapModule } from './get-map.module';
import { MSType, MicroserviceName, MicroserviceType, getClientConfig } from '@app/common/microservice-client';
import { CustomRpcExceptionFilter } from './rpc-exception.filter';
import { GET_APP_LOGGER } from '@app/common/logger/logger.module';
import { ValidationPipe } from '@nestjs/common';
require('dotenv').config()


async function bootstrap() {  
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    GetMapModule,
    {...getClientConfig(
      {
        type: MicroserviceType.GET_MAP, 
        name: MicroserviceName.GET_MAP_SERVICE
      }, 
      MSType[process.env.MICRO_SERVICE_TYPE]),
      bufferLogs: true
    }
  );
  app.useLogger(app.get(GET_APP_LOGGER));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new CustomRpcExceptionFilter())
  app.listen()
}
bootstrap();
