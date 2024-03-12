import { ConsoleLogger, DynamicModule, Module, Provider } from "@nestjs/common";
import { LoggerService } from "./logger.service";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { AsyncContextMsInterceptor } from "@app/common/logger/async-context-ms.interceptor";
import { createIMports, createProviders } from "./logger.providers";
import { LoggerModuleOptions } from "./logger.interfaces";

export const GET_APP_LOGGER = 'GET_APP_LOGGER'

@Module({})
export class LoggerModule {
  static forRoot(options: LoggerModuleOptions): DynamicModule{

    return {
      module: LoggerModule,
      imports: createIMports(options),
      providers: createProviders(options),
      exports: [GET_APP_LOGGER],
    }
  }
}