import { validateProductData } from "./validators";

describe('validateProductData', () => {
    let productData;
    beforeEach(() => {
        productData = {
            "count": 4,
            "description": "Short Product Description1",
            "id": "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
            "price": 2.4,
            "title": "Product 1"
        };
    })
    test('should return true', () => {
        const res = validateProductData(productData);
        expect(res.isValid).toBeTruthy();
    });
    test('should return false if title is null', () => {
        productData.title = null;
        const res = validateProductData(productData);
        expect(res.isValid).toBeFalsy();
    });
    test('should return false if description is not a string', () => {
        productData.description = 111;
        const res = validateProductData(productData);
        expect(res.isValid).toBeFalsy();
    });
    test('should return false if price is not a number', () => {
        productData.price = '111';
        const res = validateProductData(productData);
        expect(res.isValid).toBeFalsy();
    });
    test('should return false if price < 0', () => {
        productData.price = -3;
        const res = validateProductData(productData);
        expect(res.isValid).toBeFalsy();
    });
    test('should return false if count is not a number', () => {
        productData.count = '111';
        const res = validateProductData(productData);
        expect(res.isValid).toBeFalsy();
    });
    test('should return false if count < 0', () => {
        productData.count = -3;
        const res = validateProductData(productData);
        expect(res.isValid).toBeFalsy();
    });
});
