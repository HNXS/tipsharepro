/**
 * API Routes Index
 *
 * Aggregates all route modules and mounts them on the appropriate paths.
 */

import { Router } from 'express';
import authRoutes from './auth.routes';
import settingsRoutes from './settings.routes';
import jobCategoryRoutes from './job-category.routes';
import employeeRoutes from './employee.routes';
import payPeriodRoutes from './pay-period.routes';
import calculationRoutes from './calculation.routes';
import dailyEntryRoutes from './daily-entry.routes';
import adminRoutes from './admin.routes';

const router = Router();

// Health check endpoint
router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      service: 'tip-share-pro-api',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    },
  });
});

// ============================================================================
// Mount Route Modules
// ============================================================================

// Authentication (public - no auth required for login)
router.use('/auth', authRoutes);

// Organization settings
router.use('/settings', settingsRoutes);

// Job categories
router.use('/job-categories', jobCategoryRoutes);

// Employees
router.use('/employees', employeeRoutes);

// Pay periods (standalone endpoints)
router.use('/pay-periods', payPeriodRoutes);

// Pay period sub-resources (calculation and daily entries)
router.use('/pay-periods', calculationRoutes);    // Calculation endpoints
router.use('/pay-periods', dailyEntryRoutes);     // Daily entry endpoints

// Preview calculation (standalone)
router.use('/calculate', calculationRoutes);

// Admin routes (platform owner only)
router.use('/admin', adminRoutes);

export default router;
