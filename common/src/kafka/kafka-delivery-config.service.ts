import { Logger } from "@nestjs/common";
import { Injectable } from "@nestjs/common/decorators";
import { ConfigService } from "@nestjs/config";
import { ClientProvider, ClientsModuleOptionsFactory, Transport } from "@nestjs/microservices";

@Injectable()
export class KafkaDeliveryConfigService implements ClientsModuleOptionsFactory{

    private readonly logger = new Logger(KafkaDeliveryConfigService.name);


    constructor(private configService: ConfigService) {}

    createClientOptions(): ClientProvider | Promise<ClientProvider> {
        this.logger.debug("delivery group id env value: ", this.configService.get<string>('KAFKA_DELIVERY_GROUP_ID'));
        
        return {
            transport: Transport.KAFKA,
            options: {
                client: {
                    clientId: this.configService.get<string>('KAFKA_DELIVERY_CLIENT_ID'),
                    brokers : [this.configService.get<string>('KAFKA_BROKER_URL')]
                },
                consumer: {
                    groupId: this.configService.get<string>('KAFKA_DELIVERY_GROUP_ID')
                }
            }
        }
    }
    

}
