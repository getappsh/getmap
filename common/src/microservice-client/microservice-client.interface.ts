import { DeployEnv } from "../utils";

export enum MicroserviceType {
  DEPLOY,
}

export interface MicroserviceModuleOptions {
  deployEnv: DeployEnv,
  type: MicroserviceType
}