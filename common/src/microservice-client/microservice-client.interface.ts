export enum MicroserviceType {
  DELIVERY,
  DEPLOY,
}

export const MicroserviceName = {
  DELIVERY_SERVICE: "DELIVERY_SERVICE",
  DEPLOY_SERVICE: "DEPLOY_SERVICE",


}

export interface MicroserviceModuleOptions {
  name: string,
  type: MicroserviceType
}