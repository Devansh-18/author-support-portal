import { getDatabaseConnectionState } from '../../config/database.js';

/**
 * Health service retrieving current application state.
 *
 * @returns {{ status: 'UP' | 'DOWN' | 'DEGRADED', service: string, timestamp: string }}
 */
export function getHealthStatus() {
  const dbState = getDatabaseConnectionState();
  const isHealthy = dbState === 'connected' || dbState === 'disconnected' || dbState === 'connecting';

  return {
    status: isHealthy ? 'UP' : 'DEGRADED',
    service: 'author-support-backend',
    timestamp: new Date().toISOString()
  };
}
