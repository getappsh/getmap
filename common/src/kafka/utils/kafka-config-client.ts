import { KafkaConfig } from "@nestjs/microservices/external/kafka.interface";
import { readFileSync } from 'fs'


export function getKafkaConfigClient(clientId?: string): KafkaConfig{
  switch (process.env.DEPLOY_ENV){
    case "CTS" : {
      return getConfigCTS(clientId);
    }
    default: {
      return getConfigDefault(clientId)
    }
  }
}


function getConfigCTS(clientId?: string): KafkaConfig{
  return {
    clientId: clientId,
    brokers : [process.env.KAFKA_BROKER_URL],
    ssl: {
      rejectUnauthorized: false,
      ca: [readFileSync('/kafka-keys/cacerts.pem', 'utf-8')],
      key: [readFileSync('/kafka-keys/getapp-playground-kclient-0.key', 'utf-8')],
      cert: [readFileSync('/kafka-keys//kafka-keys/getapp-playground-kclient-0.key', 'utf-8')]
    }

  }
}

function getConfigDefault(clientId: string): KafkaConfig{
  return {
    clientId: clientId,
    brokers : [process.env.KAFKA_BROKER_URL]
  }
}
