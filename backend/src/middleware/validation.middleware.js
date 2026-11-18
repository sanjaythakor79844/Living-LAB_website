import { errorResponse } from '../utils/response.js';

/**
 * Zod validation middleware factory
 * @param {object} schemas - Object with optional body, query, and params Zod schemas
 */
export function validate(schemas) {
  return async (req, res, next) => {
    try {
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      if (schemas.query) {
        req.query = await schemas.query.parseAsync(req.query);
      }
      if (schemas.params) {
        req.params = await schemas.params.parseAsync(req.params);
      }
      return next();
    } catch (error) {
      if (error.errors) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        return errorResponse(res, {
          statusCode: 400,
          message: 'Validation failed',
          errors: formattedErrors,
        });
      }
      return next(error);
    }
  };
}

export default validate;
