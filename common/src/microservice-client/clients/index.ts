import { ClientProvider } from "@nestjs/microservices";
import { MicroserviceModuleOptions } from "../microservice-client.interface";
import { getKafkaClientConfig } from "./kafka/kafka";
import { getSocketClientConfig } from "./socket/socket";
import { DeployEnv } from "@app/common/utils";

export function getClientConfig(options: MicroserviceModuleOptions, deployEnv: DeployEnv): ClientProvider{
  if (deployEnv ==  DeployEnv.CTS){
    return getKafkaClientConfig(options.type)
  
  }else if (deployEnv == DeployEnv.TNG) {
    return getSocketClientConfig(options.type);
  
  }else if (deployEnv == DeployEnv.LOCAL){
    // return getKafkaClientConfig(options.type)
    return getSocketClientConfig(options.type);
  }
}