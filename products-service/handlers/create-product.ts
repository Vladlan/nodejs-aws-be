import {APIGatewayProxyHandler} from 'aws-lambda';
import 'source-map-support/register';
import {validateProductData} from "../../shared/utils";
import {DB_CONFIG, DBClient} from "../../shared/database"
import {Product} from '../../shared/types';
import {getRes, getRes400, getRes500, logLambdaArgs} from '../../shared/utils'
import {Client} from 'pg';

export const createProduct: APIGatewayProxyHandler = async (event, _context) => {
  logLambdaArgs(event, _context);
  let client;
  try {
    client = new DBClient(new Client(DB_CONFIG));
    const productData: Product = JSON.parse(event.body);

    const {isValid, message} = validateProductData(productData);
    if (isValid) {
      await client.connect();
      const products = await client.createProduct(productData);
      return getRes(201, JSON.stringify(products, null, 2));
    }
    return getRes400(message);
  } catch (err) {
    console.error(err);
    return getRes500();
  } finally {
    client.disconnect();
  }
}
