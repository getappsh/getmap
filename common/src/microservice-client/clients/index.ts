import { ClientProvider } from "@nestjs/microservices";
import { MicroserviceModuleOptions } from "../microservice-client.interface";
import { getKafkaClientConfig } from "./kafka/kafka";
import { getSocketClientConfig } from "./socket/socket";
import { DeployEnv } from "@app/common/utils";

export function getClientConfig(options: MicroserviceModuleOptions): ClientProvider{
  if (options.deployEnv ==  DeployEnv.CTS){
    console.log("Deploy env is CTS");
    return getKafkaClientConfig(options.type)
  
  }else if (options.deployEnv == DeployEnv.TNG) {
    console.log("Deploy env is TNG");
    return getSocketClientConfig(options.type);
  
  }else if (options.deployEnv == DeployEnv.LOCAL){
    console.log("Deploy env is LOCAL");
    return getKafkaClientConfig(options.type)
    // return getSocketClientConfig(options.type);
  }
}