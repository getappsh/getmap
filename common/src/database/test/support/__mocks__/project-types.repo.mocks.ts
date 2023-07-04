import { categoryEntityStub, formationEntityStub, operationSystemEntityStub, platformEntityStub } from "../stubs";

export const mockCategoryRepo = () => {
  return {
    find: jest.fn().mockResolvedValue([categoryEntityStub(), categoryEntityStub()]),
  }
};

export const mockFormationRepo = () => {
  return {
    find: jest.fn().mockResolvedValue([formationEntityStub(), formationEntityStub()]),
  }
};


export const mockOperationSystemRepo = () => {
  return {
    find: jest.fn().mockResolvedValue([operationSystemEntityStub(), operationSystemEntityStub()]),
  }
};


export const mockPlatformRepo = () => {
  return {
    find: jest.fn().mockResolvedValue([platformEntityStub(), platformEntityStub()]),
  }
};

