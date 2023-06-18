import { Logger } from "@nestjs/common";
import { Injectable } from "@nestjs/common/decorators";
import { ConfigService } from "@nestjs/config";
import { ClientProvider, ClientsModuleOptionsFactory, Transport } from "@nestjs/microservices";
import { getKafkaConfigClient } from "./utils";

export const KAFKA_DELIVERY_CLIENT_ID="getapp-delivery"
export const KAFKA_DELIVERY_GROUP_ID="getapp-delivery-consumer"

@Injectable()
export class KafkaDeliveryConfigService implements ClientsModuleOptionsFactory{

    private readonly logger = new Logger(KafkaDeliveryConfigService.name);


    constructor(private configService: ConfigService) {}

    createClientOptions(): ClientProvider | Promise<ClientProvider> {
        this.logger.debug("broker url: ", this.configService.get<string>('KAFKA_BROKER_URL'));
        
        return {
            transport: Transport.KAFKA,
            options: {
                client: getKafkaConfigClient(KAFKA_DELIVERY_CLIENT_ID),
                consumer: {
                    groupId: KAFKA_DELIVERY_GROUP_ID
                }
            }
        }
    }
    

}
