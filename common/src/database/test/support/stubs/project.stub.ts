import { ProjectEntity } from "@app/common/database/entities";
import { uploadVersionEntityStub } from "./upload-version.stub";
import { categoryEntityStub, formationEntityStub, operationsSystemEntityStub, platformEntityStub } from "./project-types.stubs";

export const projectEntityStub = (): ProjectEntity => {
  return {
    componentName: uploadVersionEntityStub().component,
    OS: operationsSystemEntityStub(),
    platformType: platformEntityStub(),
    formation: formationEntityStub(),
    category: categoryEntityStub(),
    artifactType: 'artifactType',
    description: "description",
    tokens: ['token-1', 'token-2']
  } as ProjectEntity
};
