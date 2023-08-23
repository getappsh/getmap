import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientKafka, ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { MicroserviceModuleOptions } from "./microservice-client.interface";
import { getClientConfig } from "./clients";
import { ConfigService } from "@nestjs/config";
import { DeployEnv } from "../utils";


@Injectable()
export class MicroserviceClient {
  private readonly logger = new Logger(MicroserviceClient.name);
  private client: ClientProxy | ClientKafka

  constructor(
    private readonly options: MicroserviceModuleOptions,
    private configService: ConfigService
    ){

      this.logger.verbose("MicroserviceClient Init")
      const dplEnv = DeployEnv[configService.get<string>('DEPLOY_ENV')]
      const clientConfig = getClientConfig(options, dplEnv)

      this.client = ClientProxyFactory.create(clientConfig)
    }

  
  emit<TResult = any, TInput = any>(pattern: any, data: TInput): Observable<TResult>{
    return this.emit(pattern, data);
  }

  send<TResult = any, TInput = any>(pattern: any, data: TInput): Observable<TResult>{
    return this.client.send(pattern, data);
  }

  subscribeToResponseOf(topics: string[]): void{
    if (this.client instanceof ClientKafka) {
      topics.forEach((value) => {
        (this.client as ClientKafka).subscribeToResponseOf(value);
      });
    }
    
  }
  connect():Promise<any>{
    return this.client.connect()
  }
}