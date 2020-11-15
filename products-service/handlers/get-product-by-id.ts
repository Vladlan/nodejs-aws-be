import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { DBClient } from "../database"
import { corsHeaders, messages, logLambdaArgs } from '../../shared/utils'

export const getProductById: APIGatewayProxyHandler = async (event, _context) => {
    logLambdaArgs(event, _context);
    let client;
    try {
        const { productId } = event.pathParameters;
        if (productId && productId.length === 36) {
            client = new DBClient();
            await client.connect();
            const product = await client.getProductById(productId);
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
            body: messages.idIsWrong,
        }
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: messages.internalServerError,
        };
    } finally {
        await client.disconnect();
    }
};
