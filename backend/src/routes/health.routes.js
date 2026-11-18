import { Router } from 'express';
import { getHealth } from '../controllers/health.controller.js';
import { validate } from '../middleware/validation.middleware.js';
import { healthQuerySchema } from '../validators/health.validator.js';

const router = Router();

/**
 * @route   GET /api/health
 * @desc    Get system, API, and database health status
 * @access  Public
 */
router.get('/', validate({ query: healthQuerySchema }), getHealth);

export default router;
