import { ValidationError } from '../errors/index.js';

/**
 * Middleware factory to validate req.body against a contract validator.
 *
 * @param {(payload: any) => { isValid: boolean, errors: string[] }} validatorFn
 * @returns {import('express').RequestHandler}
 */
export function validateBody(validatorFn) {
  return (req, res, next) => {
    const result = validatorFn(req.body);
    if (!result.isValid) {
      return next(new ValidationError('Request body validation failed.', result.errors));
    }
    next();
  };
}

/**
 * Middleware factory to validate req.query against a contract validator.
 *
 * @param {(payload: any) => { isValid: boolean, errors: string[] }} validatorFn
 * @returns {import('express').RequestHandler}
 */
export function validateQuery(validatorFn) {
  return (req, res, next) => {
    const result = validatorFn(req.query);
    if (!result.isValid) {
      return next(new ValidationError('Query parameter validation failed.', result.errors));
    }
    next();
  };
}
