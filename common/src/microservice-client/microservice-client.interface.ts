export enum MicroserviceType {
  DEPLOY,
}


export interface MicroserviceModuleOptions {
  name: string,
  type: MicroserviceType
}