import { Injectable } from "@nestjs/common/decorators";
import { ConfigService } from "@nestjs/config";
import { ClientProvider, ClientsModuleOptionsFactory, Transport } from "@nestjs/microservices";
import { getKafkaConfigClient } from "./utils";

export const KAFKA_GET_MAP_CLIENT_ID="getapp-get-map"
export const KAFKA_GET_MAP_GROUP_ID="getapp-map-device-consumer"

@Injectable()
export class KafkaGetMapConfigService implements ClientsModuleOptionsFactory{

    constructor(private configService: ConfigService) {}

    createClientOptions(): ClientProvider | Promise<ClientProvider> {
       return {
            transport: Transport.KAFKA,
            options: {
                client: getKafkaConfigClient(KAFKA_GET_MAP_CLIENT_ID),
                consumer: {
                    groupId: KAFKA_GET_MAP_GROUP_ID
                }
            }
        }
    }
    

}
