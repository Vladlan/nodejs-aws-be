import {APIGatewayProxyHandler} from 'aws-lambda';
import 'source-map-support/register';
import {DB_CONFIG, DBClient} from "../../shared/database"
import {messages, logLambdaArgs, getRes200, getRes, getRes400, getRes500} from '../../shared/utils'
import {Client} from 'pg';

export const getProductById: APIGatewayProxyHandler = async (event, _context) => {
  logLambdaArgs(event, _context);
  let client;
  try {
    const {productId} = event.pathParameters;
    if (productId && productId.length === 36) {
      client = new DBClient(new Client(DB_CONFIG));
      await client.connect();
      const product = await client.getProductById(productId);
      if (product) {
        return getRes200(JSON.stringify(product, null, 2));
      }
      return getRes(404, messages.notFound(productId))
    }
    getRes400(messages.idIsWrong);
  } catch (err) {
    console.error(err);
    return getRes500();
  } finally {
    client.disconnect();
  }
};
