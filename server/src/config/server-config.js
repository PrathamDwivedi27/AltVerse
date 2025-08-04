import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT ;
export const MONGO_DB_URI = process.env.MONGO_DB_URI;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;
export const SESSION_SECRET = process.env.SESSION_SECRET
export const INVITE_SECRET = process.env.INVITE_SECRET;
export const INVITE_EXPIRES_IN = process.env.INVITE_EXPIRES_IN;
export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';