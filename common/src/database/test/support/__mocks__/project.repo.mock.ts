import { projectEntityStub } from "../stubs";

export const mockProjectRepo = () => {
  return {
    findOne: jest.fn().mockResolvedValue(projectEntityStub()),
    save: jest.fn().mockResolvedValue(projectEntityStub()),
    create: jest.fn().mockResolvedValue(projectEntityStub()),
    remove: jest.fn().mockResolvedValue(projectEntityStub()),
  }
};
