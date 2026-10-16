/**
 * Controller function for application health and status monitoring.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export function getHealth(req, res) {
  return res.status(200).json({
    status: 'UP',
    service: 'author-support-backend',
    timestamp: new Date().toISOString()
  });
}
