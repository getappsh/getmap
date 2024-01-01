import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApiModule } from './api.module';
import { CustomRpcExceptionFilter } from './rpc-exception.filter';
import { API } from './utils/paths';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  app.enableCors();
  app.useGlobalFilters(new CustomRpcExceptionFilter());
  app.setGlobalPrefix(API);
  // app.enableVersioning({
  //   type: VersioningType.URI,
  //   defaultVersion: '1'
  // });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  

  const config = new DocumentBuilder()
    .setTitle('Get-App')
    .setDescription('The Get-App API swagger')
    .setVersion('0.5.4')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();
