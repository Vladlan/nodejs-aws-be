import {APIGatewayProxyHandler} from 'aws-lambda';
import 'source-map-support/register';
import {DB_CONFIG, DBClient} from "../../shared/database"
import {getRes200, getRes500, logLambdaArgs} from '../../shared/utils'
import {Client} from 'pg';


export const getAllProducts: APIGatewayProxyHandler = async (_event, _context) => {
  logLambdaArgs(_event, _context);
  let client;
  try {
    client = new DBClient(new Client(DB_CONFIG));
    await client.connect();
    const products = await client.getAllProducts();

    return getRes200(JSON.stringify(products, null, 2));
  } catch (err) {
    console.error(err);
    return getRes500();
  } finally {
    client.disconnect();
  }
}
