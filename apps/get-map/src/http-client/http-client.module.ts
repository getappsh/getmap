import { Module } from '@nestjs/common';
import { LibotHttpClientService } from './http-client.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports:[ConfigModule, HttpModule],
  providers: [LibotHttpClientService],
  exports: [LibotHttpClientService]
})
export class HttpClientModule {}
