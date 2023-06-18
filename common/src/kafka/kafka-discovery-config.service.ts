import { Injectable } from "@nestjs/common/decorators";
import { ConfigService } from "@nestjs/config";
import { ClientProvider, ClientsModuleOptionsFactory, Transport } from "@nestjs/microservices";
import { getKafkaConfigClient } from "./utils";

export const KAFKA_DISCOVERY_CLIENT_ID="getapp-discovery"
export const KAFKA_DISCOVERY_GROUP_ID="getapp-discovery-consumer"

@Injectable()
export class KafkaDiscoveryConfigService implements ClientsModuleOptionsFactory{

    constructor(private configService: ConfigService) {}

    createClientOptions(): ClientProvider | Promise<ClientProvider> {
        
        return {
            transport: Transport.KAFKA,
            options: {
                client: getKafkaConfigClient(KAFKA_DISCOVERY_CLIENT_ID),
                consumer: {
                    groupId: KAFKA_DISCOVERY_GROUP_ID
                }
            }
        }
    }
    

}
