import env from '../config/env.js';
import logger from '../utils/logger.js';
import { errorResponse } from '../utils/response.js';

/**
 * Centralized error handling middleware
 */
export function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  logger.error('Unhandled request error:', {
    message: err.message,
    method: req.method,
    url: req.originalUrl,
    stack: env.NODE_ENV !== 'production' ? err.stack : undefined,
  });

  // Handle malformed JSON request body
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return errorResponse(res, {
      statusCode: 400,
      message: 'Malformed JSON payload in request body',
    });
  }

  // Handle custom status codes if present
  const statusCode = typeof err.statusCode === 'number' && err.statusCode >= 400 ? err.statusCode : 500;
  const message = statusCode === 500 && env.NODE_ENV === 'production'
    ? 'Internal Server Error'
    : err.message || 'An unexpected error occurred';

  return errorResponse(res, {
    statusCode,
    message,
    errors: env.NODE_ENV !== 'production' && err.stack ? { stack: err.stack } : null,
  });
}

export default errorHandler;
