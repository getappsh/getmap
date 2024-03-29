export enum MicroserviceType {
  DELIVERY,
  DEPLOY,
  DISCOVERY,
  OFFERING,
  PROJECT_MANAGEMENT,
  UPLOAD,
  GET_MAP,
  DEVICE,
  MICRO_DISCOVERY,
}

export const MicroserviceName = {
  DELIVERY_SERVICE: "DELIVERY_SERVICE",
  DEPLOY_SERVICE: "DEPLOY_SERVICE",
  DISCOVERY_SERVICE: "DISCOVERY_SERVICE",
  OFFERING_SERVICE: "OFFERING_SERVICE",
  PROJECT_MANAGEMENT_SERVICE: "PROJECT_MANAGEMENT_SERVICE",
  UPLOAD_SERVICE: "UPLOAD_SERVICE",
  GET_MAP_SERVICE: "GET_MAP_SERVICE",
  DEVICE_SERVICE: "DEVICE_SERVICE",
  MICRO_DISCOVERY_SERVICE: "MICRO_DISCOVERY_SERVICE",
}

export interface MicroserviceModuleOptions {
  name: string,
  type: MicroserviceType
}