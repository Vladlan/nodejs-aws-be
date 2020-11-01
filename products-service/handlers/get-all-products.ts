import {APIGatewayProxyHandler} from 'aws-lambda';
import 'source-map-support/register';
import * as products from '../products/products.json';
import {corsHeaders} from "../utils";

export const getAllProducts: APIGatewayProxyHandler = async (_event, _context) => {
    return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(products, null, 2),
    };
}
