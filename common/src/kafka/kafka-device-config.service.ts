import { Injectable } from "@nestjs/common/decorators";
import { ConfigService } from "@nestjs/config";
import { ClientProvider, ClientsModuleOptionsFactory, Transport } from "@nestjs/microservices";

export const KAFKA_DEVICE_CLIENT_ID="device"
export const KAFKA_DEVICE_GROUP_ID="device-consumer"          


@Injectable()
export class KafkaDeviceConfigService implements ClientsModuleOptionsFactory{

    constructor(private configService: ConfigService) {}

    createClientOptions(): ClientProvider | Promise<ClientProvider> {
       return {
            transport: Transport.KAFKA,
            options: {
                client: {
                    clientId: KAFKA_DEVICE_CLIENT_ID,
                    brokers : [this.configService.get<string>('KAFKA_BROKER_URL')]
                },
                consumer: {
                    groupId: KAFKA_DEVICE_GROUP_ID
                }
            }
        }
    }
    

}
