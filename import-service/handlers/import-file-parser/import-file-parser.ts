import {S3Handler} from 'aws-lambda';
import 'source-map-support/register';
import * as AWS from 'aws-sdk';
import {logLambdaArgs} from '../../../shared/utils';
import {copyAndDeleteS3Obj, parseS3CsvObj} from "./utils";
import {EU_WEST_1_REGION} from "../../utils";

export const importFileParser: S3Handler = async (event, _context) => {
  logLambdaArgs(event, _context);
  try {
    const s3 = new AWS.S3({region: EU_WEST_1_REGION});
    const sqs = new AWS.SQS({region: EU_WEST_1_REGION});
    for (const record of event.Records) {
      const products = await parseS3CsvObj(
        record.s3.object.key,
        s3
      );
      for (const product of products) {
        console.log(`sqs.sendMessage with ${JSON.stringify(product, null, 2)}`);
        const res = await sqs.sendMessage({
          QueueUrl: process.env.SQS_URL,
          MessageBody: JSON.stringify(product, null, 2)
        }).promise();
        console.log(`sqs.sendMessage res: `, res)
      }
      await copyAndDeleteS3Obj(
        record.s3.object.key,
        record.s3.object.key.replace(
          "uploaded",
          "parsed"
        ),
        s3
      );
    }
  } catch (err) {
    console.error(err);
  }
}

