import {APIGatewayProxyHandler} from 'aws-lambda';
import 'source-map-support/register';
import {DBClient} from "../database"
import {getRes200, getRes500, logLambdaArgs} from '../../shared/utils'


export const getAllProducts: APIGatewayProxyHandler = async (_event, _context) => {
  logLambdaArgs(_event, _context);
  let client;
  try {
    client = new DBClient();
    await client.connect();
    const products = await client.getAllProducts();

    return getRes200(JSON.stringify(products, null, 2));
  } catch (err) {
    console.error(err);
    return getRes500();
  } finally {
    await client.disconnect();
  }
}
