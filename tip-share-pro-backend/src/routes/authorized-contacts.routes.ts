import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate, validateParams } from '../middleware/validate';
import { prisma } from '../utils/prisma';
import { ApiResponse, AuthenticatedRequest } from '../types/index';
import { UserRole } from '@prisma/client';
import { emailService } from '../services/email.service';

const router = Router();

const createContactSchema = z.object({
  name: z.string().min(1),
  company: z.string().optional(),
  email: z.string().email(),
});

const updateContactSchema = z.object({
  name: z.string().min(1).optional(),
  company: z.string().optional().nullable(),
  email: z.string().email().optional(),
});

const contactIdParamsSchema = z.object({
  id: z.string().uuid(),
});

router.get(
  '/',
  authenticate,
  authorize(UserRole.ADMIN),
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const contacts = await prisma.authorizedContact.findMany({
        where: { organizationId: authReq.user.organizationId },
        orderBy: { name: 'asc' },
      });
      res.json({ status: 'success', data: { contacts } });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(createContactSchema),
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const { name, company, email } = req.body;
      const contact = await prisma.authorizedContact.create({
        data: {
          organizationId: authReq.user.organizationId,
          name,
          company: company || null,
          email,
        },
      });
      res.status(201).json({ status: 'success', data: contact });
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  validateParams(contactIdParamsSchema),
  validate(updateContactSchema),
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const existing = await prisma.authorizedContact.findFirst({
        where: { id: req.params.id, organizationId: authReq.user.organizationId },
      });
      if (!existing) {
        return res.status(404).json({ status: 'error', message: 'Contact not found' });
      }
      const contact = await prisma.authorizedContact.update({
        where: { id: req.params.id },
        data: req.body,
      });
      res.json({ status: 'success', data: contact });
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  validateParams(contactIdParamsSchema),
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const existing = await prisma.authorizedContact.findFirst({
        where: { id: req.params.id, organizationId: authReq.user.organizationId },
      });
      if (!existing) {
        return res.status(404).json({ status: 'error', message: 'Contact not found' });
      }
      await prisma.authorizedContact.delete({ where: { id: req.params.id } });
      res.json({ status: 'success', data: { message: 'Contact deleted' } });
    } catch (err) {
      next(err);
    }
  }
);

const sendReportSchema = z.object({
  contactIds: z.array(z.string().uuid()).min(1),
  reportType: z.string().min(1),
  subject: z.string().min(1),
  pdfBase64: z.string().min(1),
  pdfFilename: z.string().min(1),
});

router.post(
  '/send-report',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(sendReportSchema),
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const { contactIds, subject, pdfBase64, pdfFilename } = req.body;

      const contacts = await prisma.authorizedContact.findMany({
        where: { id: { in: contactIds }, organizationId: authReq.user.organizationId },
      });

      if (contacts.length === 0) {
        return res.status(400).json({ status: 'error', message: 'No valid contacts found' });
      }

      const emails = contacts.map(c => c.email);
      const pdfBuffer = Buffer.from(pdfBase64, 'base64');

      await emailService.sendEmail({
        to: emails,
        subject,
        html: [
          '<div style="font-family: Arial, sans-serif;">',
          '<h2 style="color: #fb923c;">TipSharePro</h2>',
          '<p>Please find the attached distribution report.</p>',
          '<p style="font-size: 0.8rem; color: #888;">This report was sent from TipSharePro. Only authorized recipients receive this information.</p>',
          '</div>',
        ].join('\n'),
        attachments: [{
          filename: pdfFilename,
          content: pdfBuffer,
          contentType: 'application/pdf',
        }],
      });

      res.json({ status: 'success', data: { sent: contacts.length, recipients: contacts.map(c => c.name) } });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
