import {Context, SQSEvent} from "aws-lambda";

let mockDBClient = {
  connect: () => {},
  disconnect: () => {},
  createProducts: (products) => products,
};
jest.mock("../../../shared/database", () => ({
  DB_CONFIG: {},
  DBClient: class DBClient {
    constructor() {
      return mockDBClient
    }
  }
}));
let mockSNSService = {publish: () => {}};
jest.mock("aws-sdk", () => ({
  SNS: class SNS {
    constructor() {
      return mockSNSService;
    }
  },
}));

import {catalogBatchProcess} from "..";

describe("catalogBatchProcess", () => {
  const context = {} as unknown as Context;
  const callback = () => {
  };
  beforeEach(() => {
    mockDBClient.connect = jest.fn(() => Promise.resolve());
    mockDBClient.disconnect = jest.fn(() => Promise.resolve());
    mockDBClient.createProducts = jest.fn((prods) => Promise.resolve({rows: prods}));
    mockSNSService.publish = jest.fn(() => ({
      promise: jest.fn(() => Promise.resolve())
    }));
  })
  it('should run createProducts and sns.publish if products are valid', async () => {
    const event = {
      Records: [
        {body: JSON.stringify({title: 't1', description: 'desc1', count: 1, price: 1})},
      ]
    } as unknown as SQSEvent;
    await catalogBatchProcess(event, context, callback);
    expect(mockDBClient.connect).toHaveBeenCalled();
    expect(mockDBClient.createProducts).toHaveBeenCalled();
    expect(mockSNSService.publish).toHaveBeenCalled();
  });
  it('should run only sns.publish if products are not valid', async () => {
    const event = {
      Records: [
        {body: JSON.stringify({description: 'desc2', count: 2, price: 2})},
      ]
    } as unknown as SQSEvent;
    await catalogBatchProcess(event, context, callback);
    expect(mockDBClient.connect).not.toHaveBeenCalled();
    expect(mockDBClient.createProducts).not.toHaveBeenCalled();
    expect(mockSNSService.publish).toHaveBeenCalled();
  });
});
