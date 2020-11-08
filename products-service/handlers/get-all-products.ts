import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { corsHeaders, messages } from "../utils";
import { DBClient } from "../database"

export const getAllProducts: APIGatewayProxyHandler = async (_event, _context) => {
    let client;
    try {
        client = new DBClient();
        await client.connect();
        const products = await client.getAllProducts();

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(products, null, 2),
        };
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
