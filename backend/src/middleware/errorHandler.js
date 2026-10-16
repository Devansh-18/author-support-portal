import { AppError } from '../errors/index.js';
import { logger } from '../utils/logger.js';

/**
 * Centralized functional error handling middleware.
 * Formats known operational AppErrors and logs unexpected server errors using shared logger.
 *
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json(err.toJSON());
  }

  logger.error('Unhandled Server Error', err);
  return res.status(500).json({
    error: 'InternalServerError',
    message: 'An unexpected internal error occurred'
  });
}
