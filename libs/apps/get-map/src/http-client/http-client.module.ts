import { DynamicModule, Module } from '@nestjs/common';
import { LibotHttpClientService } from './http-client.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { LibotEmuHttpClientService } from './http-client-emu.service';

export const L_HttpClientService = 'L_HttpCLientService';

export class HttpClientModule {
  static forRoot(options: { isEmulator: boolean }): DynamicModule {
    const L_HttpCLientServiceProvider = {
      provide: L_HttpClientService,
      useClass: options.isEmulator ? LibotEmuHttpClientService : LibotHttpClientService,
    };
    return {
      module: HttpClientModule,
      imports: [ConfigModule, HttpModule],
      providers: [L_HttpCLientServiceProvider],
      exports: [L_HttpCLientServiceProvider],
    };
  }
}
