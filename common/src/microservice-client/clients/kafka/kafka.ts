import { ClientProvider, Transport } from "@nestjs/microservices";
import { MicroserviceType } from "../../microservice-client.interface";
import { getKafkaConnection } from "./connection";

export function getKafkaClientConfig(type: MicroserviceType): ClientProvider {
  switch (type){
    case MicroserviceType.DELIVERY:
      return kafkaDeliveryConfig()
    case MicroserviceType.DEPLOY:
      return kafkaDeployConfig()
  }
}

export const KAFKA_DELIVERY_CLIENT_ID="getapp-delivery"
export const KAFKA_DELIVERY_GROUP_ID="getapp-delivery-consumer"

const kafkaDeliveryConfig = (): ClientProvider => {
  return {
    transport: Transport.KAFKA,
    options: {
        client: getKafkaConnection(KAFKA_DELIVERY_CLIENT_ID),
        consumer: {
            groupId: KAFKA_DELIVERY_GROUP_ID
        }
    }
  }
}


export const KAFKA_DEPLOY_CLIENT_ID="getapp-deploy"
export const KAFKA_DEPLOY_GROUP_ID="getapp-deploy-consumer"

const kafkaDeployConfig = (): ClientProvider => {
  return {
    transport: Transport.KAFKA,
    options: {
        client: getKafkaConnection(KAFKA_DEPLOY_CLIENT_ID),
        consumer: {
            groupId: KAFKA_DEPLOY_GROUP_ID
        }
    }
  }
}