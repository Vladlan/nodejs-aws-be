import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { validateProductData } from "../utils";
import { DBClient } from "../database"
import { Product } from '../types';
import { corsHeaders, logLambdaArgs, messages } from '../../shared/utils'

export const createProduct: APIGatewayProxyHandler = async (event, _context) => {
    logLambdaArgs(event, _context);
    let client;
    try {
        client = new DBClient();
        const productData: Product = JSON.parse(event.body);

        const { isValid, message } = validateProductData(productData);
        if (isValid) {
            await client.connect();
            const products = await client.createProduct(productData);

            return {
                statusCode: 201,
                headers: corsHeaders,
                body: JSON.stringify(products, null, 2),
            };
        }
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: message,
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
}
