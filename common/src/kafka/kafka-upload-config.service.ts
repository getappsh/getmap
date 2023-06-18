import { Injectable } from "@nestjs/common/decorators";
import { ConfigService } from "@nestjs/config";
import { ClientProvider, ClientsModuleOptionsFactory, Transport } from "@nestjs/microservices";
import { getKafkaConfigClient } from "./utils";

export const KAFKA_UPLOAD_CLIENT_ID="getapp-upload"
export const KAFKA_UPLOAD_GROUP_ID="getapp-upload-consumer"          


@Injectable()
export class KafkaUploadConfigService implements ClientsModuleOptionsFactory{

    constructor(private configService: ConfigService) {}

    createClientOptions(): ClientProvider | Promise<ClientProvider> {
       return {
            transport: Transport.KAFKA,
            options: {
                client: getKafkaConfigClient(KAFKA_UPLOAD_CLIENT_ID),
                consumer: {
                    groupId: KAFKA_UPLOAD_GROUP_ID
                }
            }
        }
    }
    

}
