/**
 * Authentication Service
 *
 * Handles demo login, token generation, and session management.
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '../utils/prisma';
import { config } from '../config/index';
import { UnauthorizedError, ConflictError } from '../utils/errors';
import { JwtPayload } from '../types/index';
import { User, Organization } from '@prisma/client';

// Types
export interface LoginResult {
  token: string;
  expiresIn: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    companyName: string;
    locationId: string | null;
    locationName: string | null;
  };
}

export interface SessionInfo {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    companyName: string;
    locationId: string | null;
    locationName: string | null;
  };
  organization: {
    id: string;
    name: string;
    subscriptionStatus: string;
  };
}

/**
 * AuthService class handles authentication operations
 */
export class AuthService {
  /**
   * Authenticate user with email and password (demo login)
   */
  async login(email: string, password: string): Promise<LoginResult> {
    // Find user by email
    const user = await prisma.user.findFirst({
      where: { email: email.toLowerCase() },
      include: {
        organization: true,
        location: true,
      },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Update last login timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate JWT token
    const token = this.generateToken(user);

    return {
      token,
      expiresIn: config.jwt.accessExpiry,
      user: {
        id: user.id,
        email: user.email,
        name: this.extractNameFromEmail(user.email),
        role: user.role,
        companyName: user.organization.name,
        locationId: user.locationId || null,
        locationName: user.location?.name || null,
      },
    };
  }

  /**
   * Register a new user with organization and default location
   */
  async register(email: string, password: string, companyName?: string): Promise<LoginResult> {
    const normalizedEmail = email.toLowerCase();

    // Check for duplicate email (globally)
    const existing = await prisma.user.findFirst({
      where: { email: normalizedEmail },
    });

    if (existing) {
      throw new ConflictError('An account with this email already exists');
    }

    // Derive org name from companyName or email domain
    const orgName = companyName?.trim() || normalizedEmail.split('@')[1];

    const passwordHash = await this.hashPassword(password);

    // Create Organization + Location + User in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          name: orgName,
          subscriptionStatus: 'DEMO',
        },
      });

      const location = await tx.location.create({
        data: {
          organizationId: organization.id,
          name: 'Main Location',
          number: '001',
        },
      });

      return tx.user.create({
        data: {
          organizationId: organization.id,
          locationId: location.id,
          email: normalizedEmail,
          passwordHash,
          role: 'ADMIN',
          lastLoginAt: new Date(),
        },
        include: {
          organization: true,
          location: true,
        },
      });
    });

    const token = this.generateToken(user);

    return {
      token,
      expiresIn: config.jwt.accessExpiry,
      user: {
        id: user.id,
        email: user.email,
        name: this.extractNameFromEmail(user.email),
        role: user.role,
        companyName: user.organization.name,
        locationId: user.locationId || null,
        locationName: user.location?.name || null,
      },
    };
  }

  /**
   * Get session info for authenticated user
   */
  async getSession(userId: string): Promise<SessionInfo> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        organization: true,
        location: true,
      },
    });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: this.extractNameFromEmail(user.email),
        role: user.role,
        companyName: user.organization.name,
        locationId: user.locationId || null,
        locationName: user.location?.name || null,
      },
      organization: {
        id: user.organization.id,
        name: user.organization.name,
        subscriptionStatus: user.organization.subscriptionStatus,
      },
    };
  }

  /**
   * Generate JWT token for user
   */
  private generateToken(user: User & { organization: Organization }): string {
    const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
      sub: user.id,
      org: user.organizationId,
      loc: user.locationId,
      role: user.role,
      email: user.email,
    };

    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.accessExpiry,
    } as jwt.SignOptions);
  }

  /**
   * Extract display name from email
   * e.g., "demo@tipsharepro.com" -> "Demo"
   */
  private extractNameFromEmail(email: string): string {
    const localPart = email.split('@')[0];
    // Capitalize first letter
    return localPart.charAt(0).toUpperCase() + localPart.slice(1);
  }

  /**
   * Hash a password for storage
   */
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}

// Export singleton instance
export const authService = new AuthService();
