import {getAllProducts} from "./get-all-products";
import {APIGatewayProxyEvent, Context} from "aws-lambda";
import * as products from '../products/products.json';

describe('getAllProducts', () => {
    const context = {} as unknown as Context;
    const callback = () => {
    };
    const event = {pathParameters: {}} as unknown as APIGatewayProxyEvent;
    test('should return all products', async () => {
        const {body, statusCode} = await getAllProducts(event, context, callback) || {body: '[]', statusCode: null};
        expect(JSON.parse(body).length).toBe(products.length);
        expect(statusCode).toBe(200);
    });
});
