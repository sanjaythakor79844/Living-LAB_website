import { errorResponse } from '../utils/response.js';

/**
 * 404 Not Found handler middleware
 */
export function notFoundHandler(req, res) {
  return errorResponse(res, {
    statusCode: 404,
    message: `Cannot ${req.method} ${req.originalUrl} - Route not found`,
  });
}

export default notFoundHandler;
