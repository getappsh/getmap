import { Injectable } from "@nestjs/common/decorators";
import { ConfigService } from "@nestjs/config";
import { ClientProvider, ClientsModuleOptionsFactory, Transport } from "@nestjs/microservices";

export const KAFKA_UPLOAD_CLIENT_ID="upload"
export const KAFKA_UPLOAD_GROUP_ID="upload-consumer"          


@Injectable()
export class KafkaUploadConfigService implements ClientsModuleOptionsFactory{

    constructor(private configService: ConfigService) {}

    createClientOptions(): ClientProvider | Promise<ClientProvider> {
       return {
            transport: Transport.KAFKA,
            options: {
                client: {
                    clientId: KAFKA_UPLOAD_CLIENT_ID,
                    brokers : [this.configService.get<string>('KAFKA_BROKER_URL')]
                },
                consumer: {
                    groupId: KAFKA_UPLOAD_GROUP_ID
                }
            }
        }
    }
    

}
