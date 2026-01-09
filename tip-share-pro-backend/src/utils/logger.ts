/**
 * Application logger using Pino
 */

import pino from 'pino';
import { config } from '../config/index';

export const logger = pino({
  level: config.logLevel,
  transport: config.isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
  formatters: {
    level: (label) => ({ level: label }),
  },
  redact: {
    paths: [
      'req.headers.authorization',
      'password',
      'passwordHash',
      'token',
      'refreshToken',
      'accessToken',
      '*.password',
      '*.token',
    ],
    remove: true,
  },
});

export default logger;
