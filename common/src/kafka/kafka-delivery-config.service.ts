import { Logger } from "@nestjs/common";
import { Injectable } from "@nestjs/common/decorators";
import { ConfigService } from "@nestjs/config";
import { ClientProvider, ClientsModuleOptionsFactory, Transport } from "@nestjs/microservices";

export const KAFKA_DELIVERY_CLIENT_ID="delivery"
export const KAFKA_DELIVERY_GROUP_ID="delivery-consumer"

@Injectable()
export class KafkaDeliveryConfigService implements ClientsModuleOptionsFactory{

    private readonly logger = new Logger(KafkaDeliveryConfigService.name);


    constructor(private configService: ConfigService) {}

    createClientOptions(): ClientProvider | Promise<ClientProvider> {
        this.logger.debug("broker url: ", this.configService.get<string>('KAFKA_BROKER_URL'));
        
        return {
            transport: Transport.KAFKA,
            options: {
                client: {
                    clientId: KAFKA_DELIVERY_CLIENT_ID,
                    brokers : [this.configService.get<string>('KAFKA_BROKER_URL')]
                },
                consumer: {
                    groupId: KAFKA_DELIVERY_GROUP_ID
                }
            }
        }
    }
    

}
