import { DeliveryStatusEntity, DeliveryStatusEnum } from "@app/common/database/entities";
import { uploadVersionEntityStub } from "./upload-version.stub";
import { deviceEntityStub } from "./device.stub";

export const deliveryStatusEntityStub = (): DeliveryStatusEntity => {
  return {
    device: deviceEntityStub(),
    component: uploadVersionEntityStub(),
    deliveryStatus: DeliveryStatusEnum.DOWNLOAD,
    downloadStart: null,
    downloadDone: null,
    downloadStop: null,
    bitNumber: 103100,
    downloadSpeed: 3.212,
    downloadData: 56.901,
    downloadEstimateTime: 343,
    currentTime: null,
  } as DeliveryStatusEntity

};
