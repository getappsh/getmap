import { Injectable } from "@nestjs/common/decorators";
import { ConfigService } from "@nestjs/config";
import { ClientProvider, ClientsModuleOptionsFactory, Transport } from "@nestjs/microservices";
import { getKafkaConfigClient } from "./utils";

export const KAFKA_OFFERING_CLIENT_ID="getapp-offering"
export const KAFKA_OFFERING_GROUP_ID="getapp-offering-consumer"

@Injectable()
export class KafkaOfferingConfigService implements ClientsModuleOptionsFactory{

    constructor(private configService: ConfigService) {}

    createClientOptions(): ClientProvider | Promise<ClientProvider> {
        
        return {
            transport: Transport.KAFKA,
            options: {
                client: getKafkaConfigClient(KAFKA_OFFERING_CLIENT_ID),
                consumer: {
                    groupId: KAFKA_OFFERING_GROUP_ID
                }
            }
        }
    }
    

}
