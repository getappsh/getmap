import { LoggerModule } from "nestjs-pino";
import { LoggerModuleOptions } from "./logger.interfaces";
import { ConsoleLogger, DynamicModule, Provider } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { AsyncContextMsInterceptor } from "@app/common/logger/async-context-ms.interceptor";
import { GET_APP_LOGGER } from "./logger.module";
import { LoggerService } from "./logger.service";
import { ClsModule } from "nestjs-cls";
import { nanoid } from "nanoid";
import pino from 'pino';




export function createIMports(options: LoggerModuleOptions): DynamicModule[]{
  let imports: DynamicModule[] = []

  if (options.jsonLogger){
    imports.push(createPinoLogger(options.name))
  }

  if (options.httpCls){
    imports.push(
      ClsModule.forRoot({
        global: true,
        middleware: { 
          mount: true,
          generateId: true,
          idGenerator: (req: Request) =>
              req.headers['x-request-id'] ?? nanoid()
         },
      }),
    )

  }else{
    imports.push(
      ClsModule.forRoot({
        global: true,
        guard: { 
          mount: true,
          // generateId: true,
          // idGenerator: (context: ExecutionContext) => {
          //   const input = context.switchToRpc().getData();
          //   return input.headers.traceId
          // }
        }, 
      })
    )
    
  }
  return imports
}

export function createProviders(options: LoggerModuleOptions): Provider[]{
  let providers: Provider[] = []
  
  if(!options.httpCls){
    providers.push(
      {
        provide: APP_INTERCEPTOR,
        useClass: AsyncContextMsInterceptor,
      }
    )
  }

  if(options.jsonLogger){
    providers.push(
      {
      provide: GET_APP_LOGGER,
      useClass: LoggerService
      }
    )
  }else{
    providers.push(
      {
        provide: GET_APP_LOGGER,
        useClass: ConsoleLogger
      }
    )
  }

  return providers
}


function createPinoLogger(name: string): DynamicModule{
  return LoggerModule.forRoot({
    pinoHttp: {
      name: name,
      base: {name: undefined},
      timestamp: pino.stdTimeFunctions.isoTime,
      // transport: {
      //   target: 'pino-pretty',
      //   options: {
      //     singleLine: true,
      //   }
      // }
    }
  })
}