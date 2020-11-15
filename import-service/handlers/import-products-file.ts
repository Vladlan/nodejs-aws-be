import {APIGatewayProxyHandler} from 'aws-lambda';
import 'source-map-support/register';
import * as AWS from 'aws-sdk';
import {corsHeaders, logLambdaArgs, messages} from '../../shared/utils'

export const getS3Params = (csvFileName) => ({
  Bucket: 'bucket-for-task-5',
  Key: `uploaded/${csvFileName}`,
  Expires: 50,
  ContentType: 'text/csv'
});

export const importProductsFile: APIGatewayProxyHandler = async (event, _context) => {
  logLambdaArgs(event, _context);
  try {
    const s3 = new AWS.S3({region: "eu-west-1"});
    const {csvFileName} = event.queryStringParameters;
    if (csvFileName) {
      console.log(csvFileName);
      const signedUrl = await s3.getSignedUrlPromise('putObject', getS3Params(csvFileName));
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(signedUrl, null, 2)
      };
    }
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: messages.csvFileNameHasNotBeenProvided,
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: messages.internalServerError,
    };
  }
}

