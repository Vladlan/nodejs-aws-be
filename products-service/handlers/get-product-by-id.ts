import { APIGatewayProxyHandler } from 'aws-lambda';
import * as products from '../products/products.json';
import 'source-map-support/register';
import {corsHeaders, errorMessages} from '../utils';

export const getAllProducts: APIGatewayProxyHandler = async (event, _context) => {
    const { productId } = event.pathParameters;
    if (productId) {
        const product = products.find(({ id }) => productId === id);
        if (product) {
            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify(product, null, 2),
            };
        }
        return {
            statusCode: 404,
            headers: corsHeaders,
            body: errorMessages.notFound(productId),
        }
    }
    return {
        statusCode: 400,
        headers: corsHeaders,
        body: errorMessages.idHasNotBeenProvided,
    }
};
