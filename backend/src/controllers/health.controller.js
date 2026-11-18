import { getHealthStatus } from '../services/health.service.js';
import { successResponse } from '../utils/response.js';

/**
 * Health check controller
 * GET /api/health
 */
export function getHealth(req, res) {
  const healthData = getHealthStatus();

  return successResponse(res, {
    statusCode: 200,
    message: 'System operational',
    data: healthData,
  });
}

export default {
  getHealth,
};
