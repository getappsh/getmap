import { ClientProvider, Transport } from "@nestjs/microservices";
import { MicroserviceType } from "../../microservice-client.interface";
import { getKafkaConnection } from "./connection";

const KAFKA_UPLOAD_CLIENT_ID="getapp-upload"
const KAFKA_UPLOAD_GROUP_ID="getapp-upload-consumer" 

export function getKafkaClientConfig(type: MicroserviceType): ClientProvider {
  switch (type){
    case MicroserviceType.DEPLOY:
      return kafkaDeployConfig()
  }
}

const kafkaDeployConfig = (): ClientProvider => {
  return {
    transport: Transport.KAFKA,
    options: {
        client: getKafkaConnection(KAFKA_UPLOAD_CLIENT_ID),
        consumer: {
            groupId: KAFKA_UPLOAD_GROUP_ID
        }
    }
  }
}