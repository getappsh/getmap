import { ProjectEntity } from "@app/common/database/entities";
import { uploadVersionEntityStub } from "./upload-version.stub";

export const projectEntityStub = (): ProjectEntity => {
  return {
    id: 34,
    name: uploadVersionEntityStub().component,
    description: "description",
    tokens: ['token-1', 'token-2']
  } as ProjectEntity
};

