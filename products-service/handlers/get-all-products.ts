import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import * as products from '../products/products.json';

export const getAllProducts: APIGatewayProxyHandler = async (event, _context) => {
  return {
    statusCode: 200,
    body: JSON.stringify(products, null, 2),
  };
}