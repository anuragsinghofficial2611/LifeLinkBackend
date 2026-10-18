import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

let isConnected = false;

export const connectDB = async (uri = env.MONGODB_URI) => {
  if (isConnected) {
    return;
  }

  try {
    const connection = await mongoose.connect(uri, {
      autoIndex: true
    });

    isConnected = true;
    logger.info(`MongoDB connected successfully: ${connection.connection.host}/${connection.connection.name}`);
  } catch (error) {
    logger.error('MongoDB connection failed:', error);
    throw error;
  }
};

export const disconnectDB = async () => {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
  logger.info('MongoDB disconnected');
};
