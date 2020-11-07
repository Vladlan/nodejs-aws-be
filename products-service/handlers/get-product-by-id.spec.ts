import {getProductById} from "./get-product-by-id";
import {APIGatewayProxyEvent, Context} from "aws-lambda";
import * as products from '../products/products.json';

describe('getProductById', () => {
    const context = {} as unknown as Context;
    const callback = () => {};
    test('should return product by provided id', async () => {
        const id1 = products[0].id;
        const event = {pathParameters: {productId: id1}} as unknown as APIGatewayProxyEvent;
        const { body, statusCode } = await getProductById(event, context, callback) || { body: '', statusCode: null };
        const { id } = JSON.parse(body) || { id: ''};
        expect(id).toBe(id1);
        expect(statusCode).toBe(200);
    });
    test('should return 404 if product with provided id does not exists', async () => {
        const event = {pathParameters: {productId: '123123'}} as unknown as APIGatewayProxyEvent;
        const { statusCode } = await getProductById(event, context, callback) || { statusCode: null };
        expect(statusCode).toBe(404);
    });
    test('should return 400 event is without productId', async () => {
        const event = {pathParameters: {}} as unknown as APIGatewayProxyEvent;
        const { statusCode } = await getProductById(event, context, callback) || { statusCode: null };
        expect(statusCode).toBe(400);
    });
});
