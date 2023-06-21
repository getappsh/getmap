import { uploadVersionEntityStub } from "../stubs";

export const mockUploadVersionRepo = () => {
  return {
    findOne: jest.fn().mockResolvedValue(uploadVersionEntityStub()),
    findOneBy: jest.fn().mockResolvedValue(uploadVersionEntityStub()),
    find: jest.fn().mockResolvedValue([uploadVersionEntityStub(), uploadVersionEntityStub()])

  }
};