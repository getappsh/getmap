import { Injectable } from "@nestjs/common/decorators";
import { ConfigService } from "@nestjs/config";
import { ClientProvider, ClientsModuleOptionsFactory, Transport } from "@nestjs/microservices";

export const KAFKA_PROJECT_MANAGEMENT_CLIENT_ID="getapp-project-management"
export const KAFKA_PROJECT_MANAGEMENT_GROUP_ID="getapp-project-management-consumer"

@Injectable()
export class KafkaProjectManagementConfigService implements ClientsModuleOptionsFactory{

    constructor(private configService: ConfigService) {}

    createClientOptions(): ClientProvider | Promise<ClientProvider> {
       return {
            transport: Transport.KAFKA,
            options: {
                client: {
                    clientId: KAFKA_PROJECT_MANAGEMENT_CLIENT_ID,
                    brokers : [this.configService.get<string>('KAFKA_BROKER_URL')]
                },
                consumer: {
                    groupId: KAFKA_PROJECT_MANAGEMENT_GROUP_ID
                }
            }
        }
    }
    

}
