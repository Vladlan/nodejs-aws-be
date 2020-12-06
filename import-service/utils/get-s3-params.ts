import { S3_BUCKET_NAME } from './constants';

export const getS3Params = (csvFileName: string) => ({
  Bucket: S3_BUCKET_NAME,
  Key: `uploaded/${csvFileName}`,
  Expires: 50,
  ContentType: 'text/csv',
});
