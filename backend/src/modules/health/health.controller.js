import { assertHealthResponse } from '@author-support/contracts';
import { getHealthStatus } from './health.service.js';

/**
 * Controller handling health check requests.
 * Validates outgoing response against the shared contract before dispatching.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export function getHealth(req, res) {
  const healthData = getHealthStatus();

  // Enforce contract: verify neither extra nor less payload is emitted
  assertHealthResponse(healthData);

  return res.status(200).json(healthData);
}
