import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  AppError,
  NotFoundError,
  ValidationError,
  ConfigurationError
} from '../../src/errors/index.js';

describe('Error Hierarchy Class Tests', () => {
  it('AppError base class sets status code, message, and operational flag (Positive Case)', () => {
    const err = new AppError('Custom system error', 500, { detail: 'info' });

    assert.equal(err.message, 'Custom system error');
    assert.equal(err.statusCode, 500);
    assert.equal(err.isOperational, true);
    assert.deepEqual(err.details, { detail: 'info' });
    assert(err instanceof Error);
    assert(err instanceof AppError);

    const json = err.toJSON();
    assert.equal(json.error, 'AppError');
    assert.equal(json.message, 'Custom system error');
    assert.deepEqual(json.details, { detail: 'info' });
  });

  it('NotFoundError sets 404 status code and inherits from AppError (Positive Case)', () => {
    const notFound = new NotFoundError('User not found');

    assert.equal(notFound.statusCode, 404);
    assert.equal(notFound.name, 'NotFoundError');
    assert(notFound instanceof AppError);
    assert(notFound instanceof Error);
    assert.equal(notFound.toJSON().error, 'NotFoundError');
  });

  it('ValidationError sets 400 status code with validation issues (Positive Case)', () => {
    const issues = [{ field: 'email', reason: 'Email format invalid' }];
    const validationErr = new ValidationError('Invalid request payload', issues);

    assert.equal(validationErr.statusCode, 400);
    assert.equal(validationErr.name, 'ValidationError');
    assert.deepEqual(validationErr.details, issues);
    assert(validationErr instanceof AppError);
  });

  it('ConfigurationError sets 500 status code with configuration diagnostics (Positive Case)', () => {
    const configErr = new ConfigurationError('Missing PORT in env');

    assert.equal(configErr.statusCode, 500);
    assert.equal(configErr.name, 'ConfigurationError');
    assert(configErr instanceof AppError);
  });
});
