/**
 * Tip Share Pro - Backend API Server
 *
 * Main entry point for the Express application.
 */

import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';

import { config, validateConfig } from './config/index';
import { logger } from './utils/logger';
import { prisma } from './utils/prisma';
import routes from './routes/index';
import { errorHandler, notFoundHandler } from './middleware/error-handler';

// Validate configuration
validateConfig();

// Create Express app
const app: Express = express();

// Trust reverse proxy (Replit, Nginx, etc.) so rate limiter sees real client IPs
app.set('trust proxy', 1);

// ============================================================================
// MIDDLEWARE
// ============================================================================

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: config.allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate limiting
app.use(
  rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      status: 'error',
      error: {
        code: 'RATE_LIMITED',
        message: 'Too many requests, please try again later',
      },
    },
  })
);

// Request logging
app.use(
  pinoHttp({
    logger,
    customLogLevel: (_req, res, err) => {
      if (res.statusCode >= 500 || err) return 'error';
      if (res.statusCode >= 400) return 'warn';
      return 'info';
    },
    customSuccessMessage: (req, res) => {
      return `${req.method} ${req.url} - ${res.statusCode}`;
    },
    customErrorMessage: (req, res) => {
      return `${req.method} ${req.url} - ${res.statusCode}`;
    },
    redact: ['req.headers.authorization'],
  })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ============================================================================
// ROUTES
// ============================================================================

// API routes
app.use('/api/v1', routes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// ============================================================================
// SERVER STARTUP
// ============================================================================

async function startServer(): Promise<void> {
  try {
    // Test database connection
    await prisma.$connect();
    logger.info('Database connected successfully');

    // Start HTTP server
    app.listen(config.port, () => {
      logger.info(
        {
          port: config.port,
          env: config.nodeEnv,
          pid: process.pid,
        },
        `Server started on port ${config.port}`
      );
    });
  } catch (error) {
    logger.error(error, 'Failed to start server');
    process.exit(1);
  }
}

// Handle graceful shutdown
async function shutdown(): Promise<void> {
  logger.info('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Start the server only in non-serverless environments
// Vercel sets the VERCEL env var automatically
if (!process.env.VERCEL) {
  startServer();
}

export default app;
