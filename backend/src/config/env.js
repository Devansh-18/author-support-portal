import dotenv from 'dotenv';
import { LOG_LEVELS } from '../utils/logger.js';
import { ConfigurationError } from '../errors/index.js';

dotenv.config();

const ALLOWED_LOG_LEVELS = Object.keys(LOG_LEVELS);

/**
 * Validates environment variables with strict fail-fast rules.
 * Does NOT permit silent fallback values.
 *
 * @param {Record<string, string | undefined>} source
 * @returns {{ port: number, nodeEnv: string, clientOrigin: string, mongoUri: string, logLevel: string }}
 */
export function validateEnv(source = process.env) {
  const missing = [];

  const rawPort = source.PORT;
  if (!rawPort || rawPort.trim() === '') {
    missing.push('PORT is required. No fallback permitted.');
  }

  const rawNodeEnv = source.NODE_ENV;
  if (!rawNodeEnv || rawNodeEnv.trim() === '') {
    missing.push('NODE_ENV is required. No fallback permitted.');
  }

  const rawClientOrigin = source.CLIENT_ORIGIN;
  if (!rawClientOrigin || rawClientOrigin.trim() === '') {
    missing.push('CLIENT_ORIGIN is required. No fallback permitted.');
  }

  const rawMongoUri = source.MONGODB_URI;
  if (!rawMongoUri || rawMongoUri.trim() === '') {
    missing.push('MONGODB_URI is required. No fallback permitted.');
  }

  const rawLogLevel = source.LOG_LEVEL;
  if (!rawLogLevel || rawLogLevel.trim() === '') {
    missing.push('LOG_LEVEL is required. No fallback permitted.');
  }

  const rawJwtSecret = source.JWT_SECRET;
  if (!rawJwtSecret || rawJwtSecret.trim() === '') {
    missing.push('JWT_SECRET is required. No fallback permitted.');
  }

  const rawJwtExpiresIn = source.JWT_EXPIRES_IN;
  if (!rawJwtExpiresIn || rawJwtExpiresIn.trim() === '') {
    missing.push('JWT_EXPIRES_IN is required. No fallback permitted.');
  }

  if (missing.length > 0) {
    throw new ConfigurationError(`Environment Validation Failure:\n - ${missing.join('\n - ')}`);
  }

  const portNumber = Number(rawPort);
  if (!Number.isInteger(portNumber) || portNumber <= 0 || portNumber > 65535) {
    throw new ConfigurationError(`PORT must be a valid positive number between 1 and 65535. Received: ${rawPort}`);
  }

  const trimmedMongoUri = rawMongoUri.trim();
  if (!trimmedMongoUri.startsWith('mongodb://') && !trimmedMongoUri.startsWith('mongodb+srv://')) {
    throw new ConfigurationError(
      `MONGODB_URI must begin with "mongodb://" or "mongodb+srv://". Received: ${trimmedMongoUri}`
    );
  }

  const trimmedLogLevel = rawLogLevel.trim().toLowerCase();
  if (!ALLOWED_LOG_LEVELS.includes(trimmedLogLevel)) {
    throw new ConfigurationError(
      `LOG_LEVEL must be one of: ${ALLOWED_LOG_LEVELS.join(', ')}. Received: ${rawLogLevel}`
    );
  }

  return {
    port: portNumber,
    nodeEnv: rawNodeEnv.trim(),
    clientOrigin: rawClientOrigin.trim(),
    mongoUri: trimmedMongoUri,
    logLevel: trimmedLogLevel,
    jwtSecret: rawJwtSecret.trim(),
    jwtExpiresIn: rawJwtExpiresIn.trim()
  };
}
