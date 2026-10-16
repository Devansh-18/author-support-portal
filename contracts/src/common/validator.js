/**
 * Validates a payload against a strict schema contract.
 * Enforces that:
 * 1. All required fields are present (no less payload).
 * 2. No unexpected/undeclared fields are present (no extra payload).
 * 3. Field types match the declared contract schema.
 *
 * @param {Record<string, any>} payload
 * @param {Record<string, { type: string, required?: boolean, allowedValues?: any[] }>} schema
 * @returns {{ isValid: boolean, errors: string[] }}
 */
export function validateContract(payload, schema) {
  const errors = [];

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return {
      isValid: false,
      errors: ['Payload must be a non-null object']
    };
  }

  const payloadKeys = Object.keys(payload);
  const schemaKeys = Object.keys(schema);

  // 1. Check for missing required fields (less payload)
  for (const key of schemaKeys) {
    const rules = schema[key];
    const value = payload[key];

    if (rules.required && (value === undefined || value === null)) {
      errors.push(`Missing required field: ${key}`);
      continue;
    }

    if (value !== undefined && value !== null) {
      // Type checking
      const actualType = Array.isArray(value) ? 'array' : typeof value;
      if (rules.type && actualType !== rules.type) {
        errors.push(`Invalid type for field "${key}". Expected ${rules.type}, received ${actualType}`);
      }

      // Allowed values enum check
      if (Array.isArray(rules.allowedValues) && !rules.allowedValues.includes(value)) {
        errors.push(`Invalid value for field "${key}". Expected one of: ${rules.allowedValues.join(', ')}`);
      }
    }
  }

  // 2. Check for unexpected fields (extra payload)
  for (const key of payloadKeys) {
    if (!schemaKeys.includes(key)) {
      errors.push(`Unexpected extra field: ${key}. Extra payloads are strictly prohibited.`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Asserts contract validity and throws an error if invalid.
 *
 * @param {Record<string, any>} payload
 * @param {Record<string, { type: string, required?: boolean, allowedValues?: any[] }>} schema
 * @param {string} [contractName='PayloadContract']
 */
export function assertContract(payload, schema, contractName = 'PayloadContract') {
  const result = validateContract(payload, schema);
  if (!result.isValid) {
    const error = new Error(`Contract Validation Error in [${contractName}]:\n - ${result.errors.join('\n - ')}`);
    error.name = 'ContractValidationError';
    error.details = result.errors;
    throw error;
  }
}
