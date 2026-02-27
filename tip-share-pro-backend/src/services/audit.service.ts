/**
 * Audit Log Service
 *
 * Records audit trail entries for key mutations: employee changes,
 * settings updates, role changes, user management, etc.
 */

import { Request } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';

// ============================================================================
// Types
// ============================================================================

export interface LogAuditOptions {
  orgId: string;
  userId?: string;
  action: string;
  entityType: string;
  entityId: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  req?: Request;
}

export interface AuditLogEntry {
  id: string;
  organizationId: string;
  userId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  beforeValues: unknown;
  afterValues: unknown;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  user?: {
    id: string;
    email: string;
    role: string;
  } | null;
}

export interface AuditLogListOptions {
  orgId: string;
  entityType?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// ============================================================================
// Service
// ============================================================================

/**
 * Write an audit log entry to the database.
 */
export async function logAudit(options: LogAuditOptions): Promise<void> {
  try {
    const ipAddress = options.req
      ? (options.req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
        options.req.socket?.remoteAddress ||
        null
      : null;
    const userAgent = options.req
      ? (options.req.headers['user-agent'] as string) || null
      : null;

    await prisma.auditLog.create({
      data: {
        organizationId: options.orgId,
        userId: options.userId || null,
        action: options.action,
        entityType: options.entityType,
        entityId: options.entityId,
        beforeValues: (options.before as Prisma.InputJsonValue) ?? Prisma.JsonNull,
        afterValues: (options.after as Prisma.InputJsonValue) ?? Prisma.JsonNull,
        ipAddress,
        userAgent,
      },
    });

    logger.debug(
      { action: options.action, entityType: options.entityType, entityId: options.entityId },
      'Audit log entry created'
    );
  } catch (error) {
    // Audit logging should never break the main operation
    logger.error(error, 'Failed to write audit log entry');
  }
}

/**
 * Get paginated audit logs for an organization.
 */
export async function getAuditLogs(options: AuditLogListOptions): Promise<{
  logs: AuditLogEntry[];
  total: number;
  page: number;
  limit: number;
}> {
  const page = options.page || 1;
  const limit = Math.min(options.limit || 50, 100);
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {
    organizationId: options.orgId,
  };

  if (options.entityType) {
    where.entityType = options.entityType;
  }
  if (options.action) {
    where.action = options.action;
  }
  if (options.startDate || options.endDate) {
    const createdAt: Record<string, Date> = {};
    if (options.startDate) createdAt.gte = new Date(options.startDate);
    if (options.endDate) createdAt.lte = new Date(options.endDate);
    where.createdAt = createdAt;
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: { id: true, email: true, role: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return {
    logs: logs.map((log) => ({
      id: log.id,
      organizationId: log.organizationId,
      userId: log.userId,
      action: log.action,
      entityType: log.entityType,
      entityId: log.entityId,
      beforeValues: log.beforeValues,
      afterValues: log.afterValues,
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      createdAt: log.createdAt.toISOString(),
      user: log.user
        ? { id: log.user.id, email: log.user.email, role: log.user.role }
        : null,
    })),
    total,
    page,
    limit,
  };
}

/**
 * Get a single audit log entry.
 */
export async function getAuditLog(
  orgId: string,
  logId: string
): Promise<AuditLogEntry | null> {
  const log = await prisma.auditLog.findFirst({
    where: { id: logId, organizationId: orgId },
    include: {
      user: {
        select: { id: true, email: true, role: true },
      },
    },
  });

  if (!log) return null;

  return {
    id: log.id,
    organizationId: log.organizationId,
    userId: log.userId,
    action: log.action,
    entityType: log.entityType,
    entityId: log.entityId,
    beforeValues: log.beforeValues,
    afterValues: log.afterValues,
    ipAddress: log.ipAddress,
    userAgent: log.userAgent,
    createdAt: log.createdAt.toISOString(),
    user: log.user
      ? { id: log.user.id, email: log.user.email, role: log.user.role }
      : null,
  };
}
