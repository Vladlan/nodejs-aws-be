import { APIGatewayProxyHandler } from 'aws-lambda';
import * as products from '../products/products.json';
import 'source-map-support/register';
import { corsHeaders, messages } from '../utils';

export const getProductById: APIGatewayProxyHandler = async (event, _context) => {
    try {
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
                body: messages.notFound(productId),
            }
        }
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: messages.idHasNotBeenProvided,
        }
    } catch (err) {
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: messages.internalServerError,
        };
    }
};
