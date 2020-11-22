import {SQSHandler} from "aws-lambda";
import {logLambdaArgs} from "../../../shared/utils";
import {EU_WEST_1_REGION} from "../../utils";
import * as AWS from 'aws-sdk';
import {DB_CONFIG, DBClient} from "../../../shared/database";
import {Client} from 'pg';
import {validateProductsBatch} from "../../../shared/utils";
import {Product} from "../../../shared/types";

export const catalogBatchProcess: SQSHandler =
  async (event, _context) => {
    logLambdaArgs(event, _context);
    let client;
    try {
      client = new DBClient(new Client(DB_CONFIG));

      const sns = new AWS.SNS({region: EU_WEST_1_REGION});
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
      console.log(`sns.publish: `, JSON.stringify(products));
      const {isValid, message} = validateProductsBatch(products);
      if (isValid) {
        await client.connect();
        const createdProds = await client.createProducts(products);
        const res = await sns.publish({
          Subject: 'New products has been created',
          Message: JSON.stringify(createdProds.rows),
          MessageStructure: "string",
          TopicArn: process.env.SNS_ARN
        }).promise();
        console.log(`sns.publish res: `, res)
      } else {
        const res = await sns.publish({
          Subject: 'Failed to create new products',
          Message: message,
          MessageStructure: "string",
          TopicArn: process.env.SNS_ARN
        }).promise();
        console.log(`sns.publish res: `, res)
      }
    } catch (err) {
      console.error(err);
    } finally {
      client.disconnect();
    }
  }
