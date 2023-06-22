import { categoryEntityStub, formationEntityStub, operationsSystemEntityStub, platformEntityStub } from "../stubs";

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


export const mockOperationsSystemRepo = () => {
  return {
    find: jest.fn().mockResolvedValue([operationsSystemEntityStub(), operationsSystemEntityStub()]),
  }
};


export const mockPlatformRepo = () => {
  return {
    find: jest.fn().mockResolvedValue([platformEntityStub(), platformEntityStub()]),
  }
};

