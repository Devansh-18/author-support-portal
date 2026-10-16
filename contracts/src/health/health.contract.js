import { validateContract, assertContract } from '../common/validator.js';

/**
 * Health response contract schema.
 */
export const HealthResponseContract = {
  status: {
    type: 'string',
    required: true,
    allowedValues: ['UP', 'DOWN', 'DEGRADED']
  },
  service: {
    type: 'string',
    required: true
  },
  timestamp: {
    type: 'string',
    required: true
  }
};

/**
 * Validates a health response payload.
 *
 * @param {Record<string, any>} payload
 * @returns {{ isValid: boolean, errors: string[] }}
 */
export function validateHealthResponse(payload) {
  return validateContract(payload, HealthResponseContract);
}

/**
 * Asserts that the health response matches the contract.
 *
 * @param {Record<string, any>} payload
 */
export function assertHealthResponse(payload) {
  assertContract(payload, HealthResponseContract, 'HealthResponseContract');
}
