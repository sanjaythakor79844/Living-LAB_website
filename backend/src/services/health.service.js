import { getDatabaseStatus } from '../config/database.js';
import env from '../config/env.js';

/**
 * Health check service
 */
export function getHealthStatus() {
  const dbStatus = getDatabaseStatus();

  return {
    server: {
      status: 'healthy',
      uptimeSeconds: Math.floor(process.uptime()),
      environment: env.NODE_ENV,
      nodeVersion: process.version,
      memoryUsage: {
        rssMb: (process.memoryUsage().rss / 1024 / 1024).toFixed(2),
        heapUsedMb: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
        heapTotalMb: (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2),
      },
    },
    api: {
      status: 'active',
      version: '1.0.0',
      service: 'The Living Lab API',
    },
    database: {
      status: dbStatus.status,
      configured: dbStatus.configured,
      host: dbStatus.host,
      databaseName: dbStatus.name,
      readyState: dbStatus.readyStateText,
    },
    timestamp: new Date().toISOString(),
  };
}

export default {
  getHealthStatus,
};
