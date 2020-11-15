import { Product } from "../types";

const createValidationResult = (isValid: boolean, message: string) => ({
    isValid,
    message
});


export const validateProductData = ({id, title, description, price, count}: Product): {isValid: boolean, message: string} => {
    if (!id) return createValidationResult(false, 'id is wrong');
    if (id && id.length && id.length !== 36) return createValidationResult(false, 'id is wrong');
    if (!title) return createValidationResult(false, 'title has not been provided');
    if (typeof title !== 'string') return createValidationResult(false, 'title is not a string');
    if (description) {
        if (typeof description !== 'string') return createValidationResult(false, 'description is not a string');
    }
    if (price && typeof price !== 'number') return createValidationResult(false, 'price is not a number');
    if (price < 0) return createValidationResult(false, 'price is less than a zero');
    if (count && typeof count !== 'number') return createValidationResult(false, 'count is not a number');
    if (count < 0) return createValidationResult(false, 'count is less than a zero');
    return createValidationResult(true, '');
}