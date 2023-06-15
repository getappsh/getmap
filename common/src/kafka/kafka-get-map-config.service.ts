import { Injectable } from "@nestjs/common/decorators";
import { ConfigService } from "@nestjs/config";
import { ClientProvider, ClientsModuleOptionsFactory, Transport } from "@nestjs/microservices";

export const KAFKA_GET_MAP_CLIENT_ID="getapp-get-map"
export const KAFKA_GET_MAP_GROUP_ID="getapp-get-map-consumer"

@Injectable()
export class KafkaGetMapConfigService implements ClientsModuleOptionsFactory{

    constructor(private configService: ConfigService) {}

    createClientOptions(): ClientProvider | Promise<ClientProvider> {
       return {
            transport: Transport.KAFKA,
            options: {
                client: {
                    clientId: KAFKA_GET_MAP_CLIENT_ID,
                    brokers : [this.configService.get<string>('KAFKA_BROKER_URL')]
                },
                consumer: {
                    groupId: KAFKA_GET_MAP_GROUP_ID
                }
            }
        }
    }
    

}
