import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import env from './config/env.js';
import apiRouter from './routes/index.js';
import apiRateLimiter from './middleware/rateLimiter.middleware.js';
import notFoundHandler from './middleware/notFound.middleware.js';
import errorHandler from './middleware/error.middleware.js';
import { successResponse } from './utils/response.js';

const app = express();

// 1. Security Headers via Helmet
app.use(helmet());

// 2. CORS Configuration
const allowedOrigins = env.CORS_ORIGIN.split(',').map((origin) => origin.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes('*')) {
        if (env.NODE_ENV === 'production') {
          return callback(new Error('Wildcard CORS is prohibited in production environment'));
        }
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS policy`));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
  })
);

// 3. Request Logging
if (env.NODE_ENV !== 'test') {
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// 4. Body Parsers with safe payload limits
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 5. Root Welcome Route
app.get('/', (req, res) => {
  return successResponse(res, {
    message: 'Welcome to The Living Lab API Service',
    data: {
      name: 'The Living Lab API',
      version: '1.0.0',
      status: 'operational',
      healthCheck: '/api/health',
      docs: 'See backend/README.md for API documentation and deployment instructions',
    },
  });
});

// 6. Mount API Routes with Rate Limiting
app.use('/api', apiRateLimiter, apiRouter);

// 7. 404 Catch-All Middleware
app.use(notFoundHandler);

// 8. Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
