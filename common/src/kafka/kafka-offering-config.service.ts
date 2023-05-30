import { Injectable } from "@nestjs/common/decorators";
import { ConfigService } from "@nestjs/config";
import { ClientProvider, ClientsModuleOptionsFactory, Transport } from "@nestjs/microservices";

@Injectable()
export class KafkaOfferingConfigService implements ClientsModuleOptionsFactory{

    constructor(private configService: ConfigService) {}

    createClientOptions(): ClientProvider | Promise<ClientProvider> {
        
        return {
            transport: Transport.KAFKA,
            options: {
                client: {
                    clientId: this.configService.get<string>('KAFKA_OFFERING_CLIENT_ID'),
                    brokers : [this.configService.get<string>('KAFKA_BROKER_URL')]
                },
                consumer: {
                    groupId: this.configService.get<string>('KAFKA_OFFERING_GROUP_ID')
                }
            }
        }
    }
    

}
