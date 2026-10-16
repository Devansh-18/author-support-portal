import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

const READY_STATES = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting'
};

/**
 * Initializes and establishes connection to MongoDB using Mongoose.
 *
 * @param {string} mongoUri
 * @returns {Promise<typeof mongoose>}
 */
export async function connectDatabase(mongoUri) {
  try {
    const connection = await mongoose.connect(mongoUri);
    logger.info('MongoDB connected successfully');
    return connection;
  } catch (error) {
    logger.error('MongoDB connection failed', error);
    throw error;
  }
}

/**
 * Disconnects from MongoDB.
 *
 * @returns {Promise<void>}
 */
export async function disconnectDatabase() {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected successfully');
}

/**
 * Returns readable database connection state.
 *
 * @returns {string}
 */
export function getDatabaseConnectionState() {
  const stateCode = mongoose.connection.readyState;
  return READY_STATES[stateCode] || 'unknown';
}
