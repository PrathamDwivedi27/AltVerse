import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT ;
export const JWT_SECRET = process.env.JWT_SECRET
export const MONGO_DB_URI = process.env.MONGO_DB_URI;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;
export const SESSION_SECRET = process.env.SESSION_SECRET