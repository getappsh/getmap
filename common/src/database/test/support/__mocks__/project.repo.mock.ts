import { projectEntityStub } from "../stubs";

export const mockProjectRepo = () => {
  return {
    findOne: jest.fn().mockResolvedValue(projectEntityStub()),
  }
};

