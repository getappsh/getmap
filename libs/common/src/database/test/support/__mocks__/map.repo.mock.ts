import { mapEntityStub } from "../stubs/map.stub";

export const mockMapRepo = () => {
  return {
    findOneBy: jest.fn().mockResolvedValue(mapEntityStub()),
    save: jest.fn().mockImplementation(map => map)
  }
};
