import { ClientProvider, Transport } from "@nestjs/microservices";
import { MicroserviceType } from "../../microservice-client.interface";

export function getSocketClientConfig(type: MicroserviceType): ClientProvider {
  switch (type){
    case MicroserviceType.DEPLOY:
      return socketDeployConfig()
  }
}

const socketDeployConfig = (): ClientProvider => {
  return {
    transport: Transport.TCP , 
    options: {port: 3001}
  }
}