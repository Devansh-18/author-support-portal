import { validateContract, assertContract } from '../common/validator.js';
import { USER_ROLES } from '../enums/index.js';

export const LoginRequestContract = {
  email: {
    type: 'string',
    required: true
  },
  password: {
    type: 'string',
    required: true
  }
};

export const AuthUserContract = {
  id: {
    type: 'string',
    required: true
  },
  name: {
    type: 'string',
    required: true
  },
  email: {
    type: 'string',
    required: true
  },
  role: {
    type: 'string',
    required: true,
    allowedValues: Object.values(USER_ROLES)
  },
  authorId: {
    type: 'string',
    required: false
  }
};

export const LoginResponseContract = {
  token: {
    type: 'string',
    required: true
  },
  user: {
    type: 'object',
    required: true
  }
};

export const MeResponseContract = {
  user: {
    type: 'object',
    required: true
  }
};

export function validateLoginRequest(payload) {
  return validateContract(payload, LoginRequestContract);
}

export function assertLoginRequest(payload) {
  assertContract(payload, LoginRequestContract, 'LoginRequestContract');
}

export function validateLoginResponse(payload) {
  const baseValidation = validateContract(payload, LoginResponseContract);
  if (!baseValidation.isValid) return baseValidation;
  return validateContract(payload.user, AuthUserContract);
}

export function assertLoginResponse(payload) {
  assertContract(payload, LoginResponseContract, 'LoginResponseContract');
  assertContract(payload.user, AuthUserContract, 'AuthUserContract');
}

export function validateMeResponse(payload) {
  const baseValidation = validateContract(payload, MeResponseContract);
  if (!baseValidation.isValid) return baseValidation;
  return validateContract(payload.user, AuthUserContract);
}

export function assertMeResponse(payload) {
  assertContract(payload, MeResponseContract, 'MeResponseContract');
  assertContract(payload.user, AuthUserContract, 'AuthUserContract');
}
