/**
 * Admin Routes (Expert Command Center)
 *
 * Protected routes for platform owner to manage tenants, users, and subscriptions.
 */

import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import bcrypt from 'bcryptjs';
import { config } from '../config/index';

const router = Router();

// Simple admin key authentication for now
// In production, this should be a proper admin authentication system
const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  const adminKey = req.headers['x-admin-key'];

  // Use environment variable or fallback for development
  const validKey = process.env.ADMIN_SECRET_KEY || 'tipsharepro-admin-2026';

  if (adminKey !== validKey) {
    return res.status(401).json({
      status: 'error',
      error: { code: 'UNAUTHORIZED', message: 'Invalid admin credentials' }
    });
  }

  next();
};

// Apply admin auth to all routes
router.use(adminAuth);

// ============================================================================
// ORGANIZATIONS
// ============================================================================

/**
 * GET /admin/organizations - List all organizations
 */
router.get('/organizations', async (req: Request, res: Response) => {
  try {
    const organizations = await prisma.organization.findMany({
      include: {
        _count: {
          select: {
            users: true,
            locations: true,
            employees: true,
          }
        },
        users: {
          select: {
            id: true,
            email: true,
            role: true,
            lastLoginAt: true,
          }
        },
        locations: {
          select: {
            id: true,
            name: true,
            status: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      status: 'success',
      data: organizations
    });
  } catch (error) {
    console.error('Error fetching organizations:', error);
    res.status(500).json({
      status: 'error',
      error: { code: 'SERVER_ERROR', message: 'Failed to fetch organizations' }
    });
  }
});

/**
 * POST /admin/organizations - Create new organization
 */
router.post('/organizations', async (req: Request, res: Response) => {
  try {
    const { name, subscriptionStatus = 'DEMO' } = req.body;

    if (!name) {
      return res.status(400).json({
        status: 'error',
        error: { code: 'VALIDATION_ERROR', message: 'Organization name is required' }
      });
    }

    const organization = await prisma.organization.create({
      data: {
        name,
        subscriptionStatus,
        settings: {},
      }
    });

    res.status(201).json({
      status: 'success',
      data: organization
    });
  } catch (error) {
    console.error('Error creating organization:', error);
    res.status(500).json({
      status: 'error',
      error: { code: 'SERVER_ERROR', message: 'Failed to create organization' }
    });
  }
});

/**
 * PATCH /admin/organizations/:id - Update organization
 */
router.patch('/organizations/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, subscriptionStatus, trialEndsAt } = req.body;

    const updateData: Record<string, unknown> = {};
    if (name) updateData.name = name;
    if (subscriptionStatus) updateData.subscriptionStatus = subscriptionStatus;
    if (trialEndsAt) updateData.trialEndsAt = new Date(trialEndsAt);

    const organization = await prisma.organization.update({
      where: { id },
      data: updateData,
    });

    res.json({
      status: 'success',
      data: organization
    });
  } catch (error) {
    console.error('Error updating organization:', error);
    res.status(500).json({
      status: 'error',
      error: { code: 'SERVER_ERROR', message: 'Failed to update organization' }
    });
  }
});

/**
 * DELETE /admin/organizations/:id - Delete organization (and all related data)
 */
router.delete('/organizations/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Prisma cascade delete will handle related records
    await prisma.organization.delete({
      where: { id }
    });

    res.json({
      status: 'success',
      data: { message: 'Organization deleted successfully' }
    });
  } catch (error) {
    console.error('Error deleting organization:', error);
    res.status(500).json({
      status: 'error',
      error: { code: 'SERVER_ERROR', message: 'Failed to delete organization' }
    });
  }
});

// ============================================================================
// LOCATIONS
// ============================================================================

/**
 * POST /admin/organizations/:orgId/locations - Create location for organization
 */
router.post('/organizations/:orgId/locations', async (req: Request, res: Response) => {
  try {
    const { orgId } = req.params;
    const { name, number } = req.body;

    if (!name) {
      return res.status(400).json({
        status: 'error',
        error: { code: 'VALIDATION_ERROR', message: 'Location name is required' }
      });
    }

    const location = await prisma.location.create({
      data: {
        organizationId: orgId,
        name,
        number: number || '001',
        status: 'ACTIVE',
      }
    });

    res.status(201).json({
      status: 'success',
      data: location
    });
  } catch (error) {
    console.error('Error creating location:', error);
    res.status(500).json({
      status: 'error',
      error: { code: 'SERVER_ERROR', message: 'Failed to create location' }
    });
  }
});

// ============================================================================
// USERS
// ============================================================================

/**
 * GET /admin/users - List all users (optionally filter by organization)
 */
router.get('/users', async (req: Request, res: Response) => {
  try {
    const { organizationId } = req.query;

    const where = organizationId ? { organizationId: organizationId as string } : {};

    const users = await prisma.user.findMany({
      where,
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            subscriptionStatus: true,
          }
        },
        location: {
          select: {
            id: true,
            name: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Don't expose password hashes
    const sanitizedUsers = users.map(({ passwordHash, ...user }) => user);

    res.json({
      status: 'success',
      data: sanitizedUsers
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      status: 'error',
      error: { code: 'SERVER_ERROR', message: 'Failed to fetch users' }
    });
  }
});

/**
 * POST /admin/users - Create new user
 */
router.post('/users', async (req: Request, res: Response) => {
  try {
    const { organizationId, locationId, email, password, role = 'ADMIN' } = req.body;

    if (!organizationId || !email || !password) {
      return res.status(400).json({
        status: 'error',
        error: {
          code: 'VALIDATION_ERROR',
          message: 'organizationId, email, and password are required'
        }
      });
    }

    // Check if user already exists in this organization
    const existingUser = await prisma.user.findFirst({
      where: {
        organizationId,
        email: email.toLowerCase(),
      }
    });

    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        error: { code: 'USER_EXISTS', message: 'User with this email already exists in this organization' }
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // If no locationId provided, get the first location for this org
    let finalLocationId = locationId;
    if (!finalLocationId) {
      const firstLocation = await prisma.location.findFirst({
        where: { organizationId }
      });
      finalLocationId = firstLocation?.id;
    }

    const user = await prisma.user.create({
      data: {
        organizationId,
        locationId: finalLocationId,
        email: email.toLowerCase(),
        passwordHash,
        role,
      },
      include: {
        organization: {
          select: { name: true }
        },
        location: {
          select: { name: true }
        }
      }
    });

    // Don't return password hash
    const { passwordHash: _, ...sanitizedUser } = user;

    res.status(201).json({
      status: 'success',
      data: sanitizedUser
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      status: 'error',
      error: { code: 'SERVER_ERROR', message: 'Failed to create user' }
    });
  }
});

/**
 * PATCH /admin/users/:id - Update user
 */
router.patch('/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email, password, role, locationId } = req.body;

    const updateData: Record<string, unknown> = {};
    if (email) updateData.email = email.toLowerCase();
    if (role) updateData.role = role;
    if (locationId) updateData.locationId = locationId;
    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        organization: {
          select: { name: true }
        },
        location: {
          select: { name: true }
        }
      }
    });

    const { passwordHash: _, ...sanitizedUser } = user;

    res.json({
      status: 'success',
      data: sanitizedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      status: 'error',
      error: { code: 'SERVER_ERROR', message: 'Failed to update user' }
    });
  }
});

/**
 * DELETE /admin/users/:id - Delete user
 */
router.delete('/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id }
    });

    res.json({
      status: 'success',
      data: { message: 'User deleted successfully' }
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      status: 'error',
      error: { code: 'SERVER_ERROR', message: 'Failed to delete user' }
    });
  }
});

// ============================================================================
// DASHBOARD STATS
// ============================================================================

/**
 * GET /admin/stats - Get dashboard statistics
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const [
      totalOrgs,
      orgsByStatus,
      totalUsers,
      totalLocations,
      recentLogins
    ] = await Promise.all([
      prisma.organization.count(),
      prisma.organization.groupBy({
        by: ['subscriptionStatus'],
        _count: true,
      }),
      prisma.user.count(),
      prisma.location.count(),
      prisma.user.findMany({
        where: {
          lastLoginAt: { not: null }
        },
        orderBy: { lastLoginAt: 'desc' },
        take: 10,
        select: {
          email: true,
          lastLoginAt: true,
          organization: {
            select: { name: true }
          }
        }
      })
    ]);

    res.json({
      status: 'success',
      data: {
        totalOrganizations: totalOrgs,
        organizationsByStatus: orgsByStatus.reduce((acc, curr) => {
          acc[curr.subscriptionStatus] = curr._count;
          return acc;
        }, {} as Record<string, number>),
        totalUsers,
        totalLocations,
        recentLogins,
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      status: 'error',
      error: { code: 'SERVER_ERROR', message: 'Failed to fetch statistics' }
    });
  }
});

// ============================================================================
// ACCOUNT MANAGEMENT (one-step provisioning & lifecycle)
// ============================================================================

/**
 * POST /admin/accounts - Create a full account (org + location + user) in one transaction
 */
router.post('/accounts', async (req: Request, res: Response) => {
  try {
    const { email, password, companyName, subscriptionStatus = 'DEMO', durationDays } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        error: { code: 'VALIDATION_ERROR', message: 'email and password are required' },
      });
    }

    const normalizedEmail = email.toLowerCase();
    const orgName = companyName?.trim() || normalizedEmail.split('@')[1];
    const passwordHash = await bcrypt.hash(password, 10);

    const defaultDays = subscriptionStatus === 'TRIAL' ? 45 : 14;
    const days = durationDays || defaultDays;
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + days);

    const user = await prisma.$transaction(async (tx: any) => {
      const organization = await tx.organization.create({
        data: {
          name: orgName,
          subscriptionStatus,
          trialEndsAt: subscriptionStatus === 'ACTIVE' ? null : trialEndsAt,
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
        },
        include: { organization: true, location: true },
      });
    });

    const { passwordHash: _, ...sanitized } = user;

    res.status(201).json({ status: 'success', data: sanitized });
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).json({
      status: 'error',
      error: { code: 'SERVER_ERROR', message: 'Failed to create account' },
    });
  }
});

/**
 * PUT /admin/accounts/:orgId/status - Change subscription status
 */
router.put('/accounts/:orgId/status', async (req: Request, res: Response) => {
  try {
    const { orgId } = req.params;
    const { status, durationDays } = req.body;

    const validStatuses = ['DEMO', 'TRIAL', 'ACTIVE', 'SUSPENDED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: 'error',
        error: { code: 'VALIDATION_ERROR', message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
      });
    }

    const updateData: Record<string, unknown> = { subscriptionStatus: status };

    if (status === 'ACTIVE' || status === 'CANCELLED') {
      updateData.trialEndsAt = null;
    } else if (status === 'TRIAL' || status === 'DEMO') {
      const defaultDays = status === 'TRIAL' ? 45 : 14;
      const days = durationDays || defaultDays;
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + days);
      updateData.trialEndsAt = trialEndsAt;
    }

    const org = await prisma.organization.update({
      where: { id: orgId },
      data: updateData,
    });

    const { invalidateOrgCache } = await import('../middleware/subscription.middleware');
    invalidateOrgCache(orgId);

    res.json({ status: 'success', data: org });
  } catch (error) {
    console.error('Error updating account status:', error);
    res.status(500).json({
      status: 'error',
      error: { code: 'SERVER_ERROR', message: 'Failed to update account status' },
    });
  }
});

/**
 * PUT /admin/accounts/:orgId/extend - Extend trial by N days
 */
router.put('/accounts/:orgId/extend', async (req: Request, res: Response) => {
  try {
    const { orgId } = req.params;
    const { days } = req.body;

    if (!days || days < 1) {
      return res.status(400).json({
        status: 'error',
        error: { code: 'VALIDATION_ERROR', message: 'days must be a positive number' },
      });
    }

    const org = await prisma.organization.findUnique({ where: { id: orgId } });
    if (!org) {
      return res.status(404).json({
        status: 'error',
        error: { code: 'NOT_FOUND', message: 'Organization not found' },
      });
    }

    const baseDate = org.trialEndsAt && org.trialEndsAt > new Date() ? org.trialEndsAt : new Date();
    const newEndDate = new Date(baseDate);
    newEndDate.setDate(newEndDate.getDate() + days);

    const newStatus = org.subscriptionStatus === 'SUSPENDED'
      ? (org.trialEndsAt ? 'TRIAL' : 'DEMO')
      : org.subscriptionStatus;

    const updated = await prisma.organization.update({
      where: { id: orgId },
      data: { trialEndsAt: newEndDate, subscriptionStatus: newStatus },
    });

    const { invalidateOrgCache } = await import('../middleware/subscription.middleware');
    invalidateOrgCache(orgId);

    res.json({ status: 'success', data: updated });
  } catch (error) {
    console.error('Error extending trial:', error);
    res.status(500).json({
      status: 'error',
      error: { code: 'SERVER_ERROR', message: 'Failed to extend trial' },
    });
  }
});

export default router;
