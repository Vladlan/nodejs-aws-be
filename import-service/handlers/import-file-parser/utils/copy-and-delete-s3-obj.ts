import 'source-map-support/register';
import * as AWS from 'aws-sdk';
import * as path from 'path';
import { S3_BUCKET_NAME } from '../../../utils';

export const copyAndDeleteS3Obj = async (
  sourceKey: string,
  destKey: string,
  s3: AWS.S3,
) => {
  await s3
    .copyObject({
      Bucket: S3_BUCKET_NAME,
      CopySource: path.join(S3_BUCKET_NAME, sourceKey),
      Key: destKey,
    })
    .promise();

  await s3
    .deleteObject({
      Bucket: S3_BUCKET_NAME,
      Key: sourceKey,
    })
    .promise();

  console.log(`File ${sourceKey} moved to ${destKey}`);
};
