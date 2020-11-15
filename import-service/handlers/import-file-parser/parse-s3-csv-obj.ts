import * as AWS from "aws-sdk";
import {S3_BUCKET_NAME} from "../../utils";
import * as CSV_PARSER from "csv-parser";

export const parseS3CsvObj = (objectKey, s3: AWS.S3): Promise<any[]> => new Promise((res, rej) => {
  const params = {
    Bucket: S3_BUCKET_NAME,
    Key: objectKey,
  };

  const results = [];
  s3.getObject(params)
    .createReadStream()
    .on("error", rej)
    .pipe(CSV_PARSER())
    .on("error", rej)
    .on("data", (data) => results.push(data))
    .on("end", () => res(results));
});
