import * as AWSMock from "aws-sdk-mock";
import {importProductsFile} from "./import-products-file";
import {APIGatewayProxyEvent, Context} from "aws-lambda";

describe("importProductsFile", () => {
  beforeAll(async (done) => {
    AWSMock.mock('S3', 'getSignedUrlPromise', (_action, _params) => {});
    done();
  });
  const context = {} as unknown as Context;
  const callback = () => {};
  const event = {queryStringParameters: {csvFileName: 'csvFileName.csv'}} as unknown as APIGatewayProxyEvent;
  it('should return status 200', async () => {
    const res = await importProductsFile(event, context, callback) || {body: '', statusCode: null};
    expect(res.statusCode).toBe(200);
  });
  it('should return status 400 if csvFileName has not been provided', async () => {
    event.queryStringParameters.csvFileName = '';
    const res = await importProductsFile(event, context, callback) || {body: '', statusCode: null};
    expect(res.statusCode).toBe(400);
  });
  afterAll(() => {
    AWSMock.restore('S3');
  })
});
