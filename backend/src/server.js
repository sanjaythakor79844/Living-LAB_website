import app from './app.js';
import env from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import logger from './utils/logger.js';

let server;

async function startServer() {
  // 1. Attempt database connection (does not crash if unconfigured)
  await connectDatabase();

  // 2. Start Express server binding to 0.0.0.0 for Render compatibility
  server = app.listen(env.PORT, env.HOST, () => {
    logger.info(`===============================================`);
    logger.info(` The Living Lab API Server Started Successfully`);
    logger.info(` Environment : ${env.NODE_ENV}`);
    logger.info(` Listening on: http://${env.HOST}:${env.PORT}`);
    logger.info(` Health check: http://${env.HOST}:${env.PORT}/api/health`);
    logger.info(`===============================================`);
  });

  // Handle process shutdown signals gracefully
  const shutdown = async (signal) => {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);

    if (server) {
      server.close(async () => {
        logger.info('HTTP server closed');
        await disconnectDatabase();
        logger.info('Graceful shutdown complete');
        process.exit(0);
      });

      // Force shutdown after 10s if hanging
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000).unref();
    } else {
      process.exit(0);
    }
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Promise Rejection:', {
      reason: reason instanceof Error ? reason.message : reason,
      stack: reason instanceof Error ? reason.stack : undefined,
    });
  });

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', {
      error: error.message,
      stack: error.stack,
    });
    // In production, an uncaught exception warrants restart
    process.exit(1);
  });
}

startServer();

export { server };
