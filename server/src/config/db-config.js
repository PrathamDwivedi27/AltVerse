import mongoose from 'mongoose';
import { MONGO_DB_URI } from './server-config.js';
import logger from '../utils/logger.js';

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_DB_URI);
    logger.info('DB connected successfully');

  } catch (error) {
    logger.error('Something went wrong in connecting to DB', error);
  }
};