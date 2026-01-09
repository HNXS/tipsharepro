/**
 * API Routes Index
 *
 * Aggregates all route modules and mounts them on the appropriate paths.
 */

import { Router } from 'express';
import calculationRoutes from './calculation.routes';

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

// Mount route modules
router.use('/pay-periods', calculationRoutes);
router.use('/calculate', calculationRoutes);

// Placeholder for other routes (to be implemented)
// router.use('/auth', authRoutes);
// router.use('/employees', employeeRoutes);
// router.use('/daily-entries', dailyEntryRoutes);
// router.use('/settings', settingsRoutes);
// router.use('/reports', reportRoutes);

export default router;
