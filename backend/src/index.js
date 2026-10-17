import { validateEnv } from './config/env.js';
import { logger, configureLoggerLevel } from './utils/logger.js';
import { connectDatabase } from './config/database.js';
import { createApp } from './app.js';

try {
  // Pre-runtime strict configuration validation (fails fast if missing)
  // Re-validates configuration on server reload with gemini-3.5-flash-lite
  const config = validateEnv();

  // Configure logger level based on validated environment configuration
  configureLoggerLevel(config.logLevel);

  // Initialize MongoDB connection via Mongoose
  await connectDatabase(config.mongoUri);

  const app = createApp(config);

  app.listen(config.port, () => {
    logger.info(`Backend server successfully listening on port ${config.port} (${config.nodeEnv})`, {
      port: config.port,
      environment: config.nodeEnv
    });
  });
} catch (error) {
  logger.error('Fatal initialization error', error);
  process.exit(1);
}
