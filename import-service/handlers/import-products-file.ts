import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import * as AWS from 'aws-sdk';
import { corsHeaders } from '../../common/utils'

export const importProductsFile: APIGatewayProxyHandler = async (event, _context) => {
  console.log(`[importProductsFile] event: `, event);
  const s3 = new AWS.S3({ region: "eu-west-1" });
  const { csvFileName } = event.queryStringParameters;
  console.log(csvFileName);
  const params = {
    Bucket: 'bucket-for-task-5',
    Key: `uploaded/${csvFileName}`,
    Expires: 50,
    ContentType: 'text/csv'
  };
  const urlResponse = s3.getSignedUrl('putObject', params);

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify(urlResponse, null, 2)
  };
}

