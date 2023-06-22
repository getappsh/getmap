import { deviceEntityStub } from "../stubs";

export const mockDeviceRepo = () => {
  return {
    findOne: jest.fn().mockResolvedValue(deviceEntityStub()),
    create: jest.fn().mockResolvedValue(deviceEntityStub()),
    save: jest.fn().mockResolvedValue(deviceEntityStub()),
  }
};