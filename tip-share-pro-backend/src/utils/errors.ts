/**
 * Custom error classes for Tip Share Pro
 */

import { ErrorCode, ErrorCodes } from '../types/index';

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: Array<{ field: string; message: string }>;

  constructor(
    message: string,
    code: ErrorCode,
    statusCode: number = 500,
    details?: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;

    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    details?: Array<{ field: string; message: string }>
  ) {
    super(message, ErrorCodes.VALIDATION_ERROR, 400, details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    const message = id
      ? `${resource} with ID ${id} not found`
      : `${resource} not found`;
    super(message, ErrorCodes.NOT_FOUND, 404);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, ErrorCodes.UNAUTHORIZED, 401);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, ErrorCodes.FORBIDDEN, 403);
    this.name = 'ForbiddenError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, ErrorCodes.CONFLICT, 409);
    this.name = 'ConflictError';
  }
}

export class CalculationError extends AppError {
  constructor(message: string) {
    super(message, ErrorCodes.CALCULATION_ERROR, 400);
    this.name = 'CalculationError';
  }
}
