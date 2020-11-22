import {SQSHandler} from "aws-lambda";
import {logLambdaArgs} from "../../../shared/utils";
import {EU_WEST_1_REGION} from "../../utils";
import * as AWS from 'aws-sdk';

export const catalogBatchProcess: SQSHandler =
  async (event, _context) => {
    logLambdaArgs(event, _context);
    try {
      const sns = new AWS.SNS({region: EU_WEST_1_REGION});
      const {Records: records} = event;
      const products = records.map(el => el.body);
      console.log(`sns.publish: `, JSON.stringify(products));
      const res = await sns.publish({
        Subject: 'New products',
        Message: JSON.stringify(products),
        MessageStructure: "string",
        TopicArn: process.env.SNS_ARN
      }).promise();
      console.log(`sns.publish res: `, res)
    } catch (err) {
      console.error(err);
    }
  }
