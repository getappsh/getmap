import { Logger } from "@nestjs/common";
import { Injectable } from "@nestjs/common/decorators";
import { ConfigService } from "@nestjs/config";
import { ClientProvider, ClientsModuleOptionsFactory, Transport } from "@nestjs/microservices";
import { getKafkaConfigClient } from "./utils";

export const KAFKA_DEPLOY_CLIENT_ID="getapp-deploy"
export const KAFKA_DEPLOY_GROUP_ID="getapp-deploy-consumer"

@Injectable()
export class KafkaDeployConfigService implements ClientsModuleOptionsFactory{
    constructor(private configService: ConfigService) {}

    createClientOptions(): ClientProvider | Promise<ClientProvider> {        
        return {
            transport: Transport.KAFKA,
            options: {
                client: getKafkaConfigClient(KAFKA_DEPLOY_CLIENT_ID),
                consumer: {
                    groupId: KAFKA_DEPLOY_GROUP_ID
                }
            }
        }
    }
    

}
