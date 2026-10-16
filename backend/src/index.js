import { validateEnv } from './config/env.js';
import { createApp } from './app.js';

try {
  // Pre-runtime strict configuration validation (fails fast if missing)
  const config = validateEnv();
  const app = createApp(config);

  app.listen(config.port, () => {
    console.log(`Backend server successfully listening on port ${config.port} (${config.nodeEnv})`);
  });
} catch (error) {
  console.error('Fatal initialization error:', error.message);
  process.exit(1);
}
