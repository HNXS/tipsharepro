/**
 * Global error handling middleware
 */

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';
import { config } from '../config/index';
import { ApiResponse, ErrorCodes } from '../types/index';

/**
 * Global error handler middleware
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response<ApiResponse>,
  _next: NextFunction
): void {
  // Log the error
  logger.error(
    {
      error: err.message,
      stack: config.isDevelopment ? err.stack : undefined,
      path: req.path,
      method: req.method,
    },
    'Request error'
  );

  // Handle known AppError types
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
    return;
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      status: 'error',
      error: {
        code: ErrorCodes.VALIDATION_ERROR,
        message: 'Validation failed',
        details: err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      },
    });
    return;
  }

  // Handle Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as { code: string; meta?: { target?: string[] } };

    if (prismaError.code === 'P2002') {
      res.status(409).json({
        status: 'error',
        error: {
          code: ErrorCodes.ALREADY_EXISTS,
          message: 'A record with this value already exists',
          details: prismaError.meta?.target?.map((field) => ({
            field,
            message: `${field} already exists`,
          })),
        },
      });
      return;
    }

    if (prismaError.code === 'P2025') {
      res.status(404).json({
        status: 'error',
        error: {
          code: ErrorCodes.NOT_FOUND,
          message: 'Record not found',
        },
      });
      return;
    }
  }

  // Default to internal error
  res.status(500).json({
    status: 'error',
    error: {
      code: ErrorCodes.INTERNAL_ERROR,
      message: config.isProduction
        ? 'An unexpected error occurred'
        : err.message,
    },
  });
}

/**
 * Not found handler for undefined routes
 */
export function notFoundHandler(
  req: Request,
  res: Response<ApiResponse>
): void {
  res.status(404).json({
    status: 'error',
    error: {
      code: ErrorCodes.NOT_FOUND,
      message: `Route ${req.method} ${req.path} not found`,
    },
  });
}
