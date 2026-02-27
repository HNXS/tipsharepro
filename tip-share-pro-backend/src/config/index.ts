/**
 * Application configuration
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  // Server
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',

  // Database
  databaseUrl: process.env.DATABASE_URL || '',

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'change-me-in-production',
    accessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
  },

  // Redis
  redisUrl: process.env.REDIS_URL,

  // CORS - include Vercel URLs by default
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,https://tip-share-pro-app.vercel.app,https://tip-share-pro-api.vercel.app').split(',').map(s => s.trim()),

  // Rate limiting
  rateLimit: {
    windowMs: 60 * 1000, // 1 minute
    max: 100, // requests per window
  },

  // Stripe
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    priceId: process.env.STRIPE_PRICE_ID || '', // Monthly subscription price ID
  },

  // Frontend URL (for Stripe redirects)
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
} as const;

// Validate required configuration
export function validateConfig(): void {
  const required = ['DATABASE_URL'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  if (config.isProduction && config.jwt.secret === 'change-me-in-production') {
    throw new Error('JWT_SECRET must be set in production');
  }
}
