import { Injectable } from "@nestjs/common/decorators";
import { ConfigService } from "@nestjs/config";
import { ClientProvider, ClientsModuleOptionsFactory, Transport } from "@nestjs/microservices";
import { getKafkaConfigClient } from "./utils";

export const KAFKA_DEVICE_CLIENT_ID="getapp-device"
export const KAFKA_DEVICE_GROUP_ID="getapp-device-consumer"          


@Injectable()
export class KafkaDeviceConfigService implements ClientsModuleOptionsFactory{

    constructor(private configService: ConfigService) {}

    createClientOptions(): ClientProvider | Promise<ClientProvider> {
       return {
            transport: Transport.KAFKA,
            options: {
                client: getKafkaConfigClient(KAFKA_DEVICE_CLIENT_ID),
                consumer: {
                    groupId: KAFKA_DEVICE_GROUP_ID
                }
            }
        }
    }
    

}
