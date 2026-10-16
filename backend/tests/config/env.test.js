import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateEnv } from '../../src/config/env.js';
import { ConfigurationError } from '../../src/errors/index.js';

describe('Environment Configuration Validation (Determinism & No Fallbacks)', () => {
  it('should successfully validate and return config when all required variables are explicitly provided (Positive Case)', () => {
    const validSource = {
      PORT: '5000',
      NODE_ENV: 'test',
      CLIENT_ORIGIN: 'http://localhost:5173'
    };

    const config = validateEnv(validSource);

    assert.equal(config.port, 5000);
    assert.equal(config.nodeEnv, 'test');
    assert.equal(config.clientOrigin, 'http://localhost:5173');
  });

  it('should throw an explicit ConfigurationError when PORT is missing (Negative Case - No Fallback Allowed)', () => {
    const invalidSource = {
      NODE_ENV: 'test',
      CLIENT_ORIGIN: 'http://localhost:5173'
    };

    assert.throws(
      () => validateEnv(invalidSource),
      (err) => {
        assert(err instanceof ConfigurationError);
        assert(err.message.includes('PORT is required'));
        return true;
      }
    );
  });

  it('should throw an explicit ConfigurationError when PORT is not a valid positive integer (Negative Case)', () => {
    const invalidSource = {
      PORT: 'invalid-port',
      NODE_ENV: 'test',
      CLIENT_ORIGIN: 'http://localhost:5173'
    };

    assert.throws(
      () => validateEnv(invalidSource),
      (err) => {
        assert(err instanceof ConfigurationError);
        assert(err.message.includes('PORT must be a valid positive number'));
        return true;
      }
    );
  });

  it('should throw an explicit ConfigurationError when CLIENT_ORIGIN is missing (Negative Case - No Fallback Allowed)', () => {
    const invalidSource = {
      PORT: '5000',
      NODE_ENV: 'test'
    };

    assert.throws(
      () => validateEnv(invalidSource),
      (err) => {
        assert(err instanceof ConfigurationError);
        assert(err.message.includes('CLIENT_ORIGIN is required'));
        return true;
      }
    );
  });
});
