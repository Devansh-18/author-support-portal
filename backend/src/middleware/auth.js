import jwt from 'jsonwebtoken';
import { UnauthorizedError, ForbiddenError } from '../errors/index.js';
import { validateEnv } from '../config/env.js';

/**
 * Middleware to authenticate requests via JWT Bearer token.
 * Attaches decoded user payload to req.user.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Authentication token is required.'));
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return next(new UnauthorizedError('Malformed authorization header.'));
  }

  try {
    const appConfig = req.app?.get('appConfig');
    const secret = appConfig?.jwtSecret || validateEnv().jwtSecret;
    const decoded = jwt.verify(token, secret);
    req.user = {
      _id: decoded.id,
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
      authorId: decoded.authorId || null
    };
    next();
  } catch (err) {
    return next(new UnauthorizedError('Invalid or expired authentication token.'));
  }
}

/**
 * Middleware factory to enforce Role-Based Access Control (RBAC).
 *
 * @param {...string} allowedRoles
 * @returns {import('express').RequestHandler}
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required.'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError(`Access denied. Requires one of roles: ${allowedRoles.join(', ')}`));
    }

    next();
  };
}
