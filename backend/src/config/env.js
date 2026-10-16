import dotenv from 'dotenv';
import { ConfigurationError } from '../errors/index.js';

dotenv.config();

/**
 * Validates environment variables with strict fail-fast rules.
 * Does NOT permit silent fallback values.
 *
 * @param {Record<string, string | undefined>} source
 * @returns {{ port: number, nodeEnv: string, clientOrigin: string }}
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

  if (missing.length > 0) {
    throw new ConfigurationError(`Environment Validation Failure:\n - ${missing.join('\n - ')}`);
  }

  const portNumber = Number(rawPort);
  if (!Number.isInteger(portNumber) || portNumber <= 0 || portNumber > 65535) {
    throw new ConfigurationError(`PORT must be a valid positive number between 1 and 65535. Received: ${rawPort}`);
  }

  return {
    port: portNumber,
    nodeEnv: rawNodeEnv.trim(),
    clientOrigin: rawClientOrigin.trim()
  };
}
