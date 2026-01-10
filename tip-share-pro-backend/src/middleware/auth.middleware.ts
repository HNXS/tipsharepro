/**
 * Authentication middleware
 *
 * Validates JWT tokens and attaches user info to requests.
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';
import { AuthenticatedRequest, AuthenticatedUser, JwtPayload } from '../types/index';
import { UserRole } from '@prisma/client';

/**
 * Verify JWT token and attach user to request
 */
export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.replace('Bearer ', '');

    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

    // Attach user info to request
    const user: AuthenticatedUser = {
      id: decoded.sub,
      organizationId: decoded.org,
      locationId: decoded.loc,
      role: decoded.role,
      email: decoded.email,
    };

    (req as AuthenticatedRequest).user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(new UnauthorizedError('Token expired'));
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('Invalid token'));
    } else {
      next(error);
    }
  }
}

/**
 * Role-based authorization middleware
 * Must be used after authenticate middleware
 */
export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const user = (req as AuthenticatedRequest).user;

    if (!user) {
      next(new UnauthorizedError('Authentication required'));
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      next(new ForbiddenError(`Role ${user.role} is not authorized for this action`));
      return;
    }

    next();
  };
}

/**
 * Optional authentication - doesn't fail if no token, just sets user to undefined
 */
export function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token, but that's okay
      next();
      return;
    }

    const token = authHeader.replace('Bearer ', '');

    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

    const user: AuthenticatedUser = {
      id: decoded.sub,
      organizationId: decoded.org,
      locationId: decoded.loc,
      role: decoded.role,
      email: decoded.email,
    };

    (req as AuthenticatedRequest).user = user;
    next();
  } catch {
    // Token is invalid, but we don't fail - just continue without user
    next();
  }
}
