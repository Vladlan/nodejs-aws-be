import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import * as products from '../products/products.json';
import { corsHeaders, errorMessages } from "../utils";

export const getAllProducts: APIGatewayProxyHandler = async (_event, _context) => {
    try {
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(products, null, 2),
        };
    } catch (err) {
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: errorMessages.internalServerError,
        };
    }
}
