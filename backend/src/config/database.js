import mongoose from 'mongoose';
import env from './env.js';
import logger from '../utils/logger.js';

let connectionStatus = 'unconfigured';

/**
 * Maps Mongoose readyState number to human-readable string
 */
function getReadyStateString(state) {
  switch (state) {
    case 0:
      return 'disconnected';
    case 1:
      return 'connected';
    case 2:
      return 'connecting';
    case 3:
      return 'disconnecting';
    default:
      return 'unknown';
  }
}

/**
 * Connect to MongoDB Atlas or local MongoDB instance
 */
export async function connectDatabase() {
  if (!env.MONGODB_URI) {
    connectionStatus = 'unconfigured';
    logger.warn('MONGODB_URI is not set. Database features are disabled, server running in standalone mode.');
    return;
  }

  connectionStatus = 'connecting';
  logger.info('Attempting MongoDB connection...');

  try {
    // Setup mongoose connection listeners
    mongoose.connection.on('connected', () => {
      connectionStatus = 'connected';
      logger.info('MongoDB connected successfully');
    });

    mongoose.connection.on('error', (err) => {
      connectionStatus = 'disconnected';
      logger.error('MongoDB connection error:', { error: err.message });
    });

    mongoose.connection.on('disconnected', () => {
      connectionStatus = 'disconnected';
      logger.warn('MongoDB connection disconnected');
    });

    await mongoose.connect(env.MONGODB_URI, {
      dbName: env.MONGODB_DB_NAME,
      serverSelectionTimeoutMS: 5000,
      autoIndex: env.NODE_ENV !== 'production',
    });

    connectionStatus = 'connected';
  } catch (error) {
    connectionStatus = 'disconnected';
    logger.error('Failed to connect to MongoDB:', { error: error.message });
    // Note: We do not process.exit(1) here so the server can still respond to health checks
  }
}

/**
 * Returns the current database status honestly
 */
export function getDatabaseStatus() {
  const isConfigured = Boolean(env.MONGODB_URI);
  const readyState = mongoose.connection.readyState;

  let status = connectionStatus;
  if (!isConfigured) {
    status = 'unconfigured';
  } else if (readyState === 1) {
    status = 'connected';
  } else if (readyState === 2) {
    status = 'connecting';
  } else {
    status = 'disconnected';
  }

  return {
    status,
    configured: isConfigured,
    readyState,
    readyStateText: getReadyStateString(readyState),
    host: readyState === 1 ? mongoose.connection.host : null,
    name: readyState === 1 ? mongoose.connection.name : null,
  };
}

/**
 * Gracefully close database connection
 */
export async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) {
    try {
      await mongoose.disconnect();
      connectionStatus = 'disconnected';
      logger.info('MongoDB connection closed gracefully');
    } catch (error) {
      logger.error('Error during MongoDB disconnect:', { error: error.message });
    }
  }
}

export default {
  connectDatabase,
  getDatabaseStatus,
  disconnectDatabase,
};
