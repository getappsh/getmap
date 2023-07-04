import { DeployStatusEntity, DeployStatusEnum } from "@app/common/database/entities";
import { uploadVersionEntityStub } from "./upload-version.stub";
import { deviceEntityStub } from "./device.stub";


export const deployStatusEntityStub = (): DeployStatusEntity => {
  return {
    device: deviceEntityStub(),
    component: uploadVersionEntityStub(),
    deployStatus: DeployStatusEnum.START,
    deployStart: null,
    deployStop: null,
    deployDone: null,
    deployEstimateTime: 3600,
    currentTime: null,
  } as DeployStatusEntity
};






