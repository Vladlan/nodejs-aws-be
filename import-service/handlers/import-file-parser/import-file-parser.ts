import {S3Handler} from 'aws-lambda';
import 'source-map-support/register';
import * as AWS from 'aws-sdk';
import {logLambdaArgs} from '../../../shared/utils';
import {copyAndDeleteS3Obj, parseS3CsvObj} from "./utils";

export const importFileParser: S3Handler = async (event, _context) => {
  logLambdaArgs(event, _context);
  try {
    const s3 = new AWS.S3({ region: "eu-west-1" });
    for (const record of event.Records) {
      const products = await parseS3CsvObj(
        record.s3.object.key,
        s3
      );
      products.forEach((product) =>
        console.log(JSON.stringify(product, null, 2))
      );
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

