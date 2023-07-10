import { Injectable } from "@nestjs/common/decorators";
import { ConfigService } from "@nestjs/config";
import { ClientProvider, ClientsModuleOptionsFactory, Transport } from "@nestjs/microservices";
import { getKafkaConfigClient } from "./utils";

export const KAFKA_MAP_DEVICE_CLIENT_ID="getapp-map-device"
export const KAFKA_MAP_DEVICE_GROUP_ID="getapp-map-device-consumer"          


@Injectable()
export class KafkaDeviceMapConfigService implements ClientsModuleOptionsFactory{

    constructor(private configService: ConfigService) {}

    createClientOptions(): ClientProvider | Promise<ClientProvider> {
       return {
            transport: Transport.KAFKA,
            options: {
                client: getKafkaConfigClient(KAFKA_MAP_DEVICE_CLIENT_ID),
                consumer: {
                    groupId: KAFKA_MAP_DEVICE_GROUP_ID
                }
            }
        }
    }
    

}
