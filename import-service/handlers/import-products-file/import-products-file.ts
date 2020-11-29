import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import * as AWS from 'aws-sdk';
import {
  getRes200,
  getRes400,
  getRes500,
  logLambdaArgs,
  messages,
} from '../../../shared/utils';
import { EU_WEST_1 } from '../../../shared/constants';
import { getS3Params } from '../../utils';

export const importProductsFile: APIGatewayProxyHandler = async (
  event,
  _context,
) => {
  logLambdaArgs(event, _context);
  try {
    const { csvFileName } = event.queryStringParameters;
    if (csvFileName) {
      const s3 = new AWS.S3({ region: EU_WEST_1 });
      const signedUrl = await s3.getSignedUrlPromise(
        'putObject',
        getS3Params(csvFileName),
      );
      return getRes200(signedUrl);
    }
    return getRes400(messages.csvFileNameHasNotBeenProvided);
  } catch (err) {
    console.error(err);
    return getRes500();
  }
};
