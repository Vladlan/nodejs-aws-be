import {SQSHandler} from "aws-lambda";
import {logLambdaArgs, validateProductsBatch} from "../../../shared/utils";
import {EU_WEST_1_REGION} from "../../utils";
import * as AWS from 'aws-sdk';
import {DB_CONFIG, DBClient} from "../../../shared/database";
import {Client} from 'pg';
import {Product} from "../../../shared/types";

export const createSNSParams = (
  Subject: string,
  Message: string,
) => ({
  Subject,
  Message,
  MessageStructure: "string",
  TopicArn: process.env.SNS_ARN
});


export const catalogBatchProcess: SQSHandler =
  async (event, _context) => {
    logLambdaArgs(event, _context);
    let client;
    try {
      const {Records: records} = event;
      const products = records.map(el => {
        const prod: Product = JSON.parse(el.body);
        return {
          title: prod.title,
          description: prod.description,
          count: Number(prod.count),
          price: Number(prod.price)
        }
      });
      const {isValid, message} = validateProductsBatch(products);

      const sns = new AWS.SNS({region: EU_WEST_1_REGION});
      if (isValid) {
        client = new DBClient(new Client(DB_CONFIG));
        await client.connect();
        const createdProds = await client.createProducts(products);
        console.log(`sns.publish: `, JSON.stringify(createdProds.rows));
        const res = await sns.publish(
          createSNSParams(
            'New products has been created',
            JSON.stringify(createdProds.rows),
          )
        ).promise();
        console.log(`sns.publish res: `, res)
      } else {
        const res = await sns.publish(
          createSNSParams(
            'Failed to create new products',
            message,
          )
        ).promise();
        console.log(`sns.publish res: `, res)
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (client) {
        client.disconnect();
      }
    }
  }
