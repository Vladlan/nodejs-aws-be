import { APIGatewayProxyHandler } from 'aws-lambda';
import * as products from '../products/products.json';
import 'source-map-support/register';
import { errorMessages } from '../utils';

export const getProductById: APIGatewayProxyHandler = async (event, _context) => {
    const { productId } = event.pathParameters;
    if (productId) {
        const product = products.find(({ id }) => productId === id);
        if (product) {
            return {
                statusCode: 200,
                body: JSON.stringify(product, null, 2),
            };
        }
        return {
            statusCode: 404,
            body: errorMessages.notFound(productId),
        }

    }
    return {
        statusCode: 404,
        body: errorMessages.idHasNotBeenProvided,
    }
};