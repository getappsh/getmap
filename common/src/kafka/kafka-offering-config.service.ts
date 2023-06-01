import { Injectable } from "@nestjs/common/decorators";
import { ConfigService } from "@nestjs/config";
import { ClientProvider, ClientsModuleOptionsFactory, Transport } from "@nestjs/microservices";

export const KAFKA_OFFERING_CLIENT_ID="offering"
export const KAFKA_OFFERING_GROUP_ID="offering-consumer"

@Injectable()
export class KafkaOfferingConfigService implements ClientsModuleOptionsFactory{

    constructor(private configService: ConfigService) {}

    createClientOptions(): ClientProvider | Promise<ClientProvider> {
        
        return {
            transport: Transport.KAFKA,
            options: {
                client: {
                    clientId: KAFKA_OFFERING_CLIENT_ID,
                    brokers : [this.configService.get<string>('KAFKA_BROKER_URL')]
                },
                consumer: {
                    groupId: KAFKA_OFFERING_GROUP_ID
                }
            }
        }
    }
    

}
