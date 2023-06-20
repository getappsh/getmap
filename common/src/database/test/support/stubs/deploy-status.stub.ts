import { DeployStatusEntity, DeployStatusEnum } from "@app/common/database/entities";
import { uploadVersionEntityStub } from "./upload-version.stub";


export const deployStatusEntityStub = (): DeployStatusEntity => {
  return {
    deviceId: 'device123',
    component: uploadVersionEntityStub(),
    deployStatus: DeployStatusEnum.START,
    deployStart: null,
    deployStop: null,
    deployDone: null,
    deployEstimateTime: 3600,
    currentTime: null,
  } as DeployStatusEntity

};






