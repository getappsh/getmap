import { deviceEntityStub } from "../stubs";

export const mockDeviceRepo = () => {
  return {
    findOne: jest.fn().mockResolvedValue(deviceEntityStub()),
  }
};