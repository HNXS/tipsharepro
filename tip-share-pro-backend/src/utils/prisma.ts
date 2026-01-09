/**
 * Prisma Client singleton
 */

import { PrismaClient } from '@prisma/client';
import { config } from '../config/index';
import { logger } from './logger';

// Prevent multiple instances in development with hot reloading
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: config.isDevelopment
      ? [
          { emit: 'event', level: 'query' },
          { emit: 'stdout', level: 'error' },
          { emit: 'stdout', level: 'warn' },
        ]
      : ['error'],
  });

// Log queries in development
if (config.isDevelopment) {
  prisma.$on('query' as never, (e: { query: string; duration: number }) => {
    logger.debug({ query: e.query, duration: `${e.duration}ms` }, 'Database query');
  });
}

if (!config.isProduction) {
  globalForPrisma.prisma = prisma;
}

export default prisma;
