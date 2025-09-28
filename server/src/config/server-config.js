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
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
export const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER;
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
export const GEMINI_MODEL_NAME = process.env.GEMINI_MODEL_NAME;