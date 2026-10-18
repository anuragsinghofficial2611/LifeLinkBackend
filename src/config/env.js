import dotenv from 'dotenv';

dotenv.config();

/**
 * Validates essential environment variables and exposes structured config.
 */
const requiredEnvs = ['JWT_SECRET'];

for (const envKey of requiredEnvs) {
  if (!process.env[envKey]) {
    console.warn(`[WARNING] Environment variable ${envKey} is missing. Falling back to default for development.`);
  }
}

export const env = {
  PORT: parseInt(process.env.PORT || '8000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lifelink',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  JWT_SECRET: process.env.JWT_SECRET || 'super_secret_jwt_key_lifelink_backend_2025_at_least_32_chars',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  DEFAULT_ADMIN_NAME: process.env.DEFAULT_ADMIN_NAME || 'Super Admin',
  DEFAULT_ADMIN_EMAIL: process.env.DEFAULT_ADMIN_EMAIL || 'admin@lifelink.org',
  DEFAULT_ADMIN_PASSWORD: process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@SecurePass123!',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || ''
};
