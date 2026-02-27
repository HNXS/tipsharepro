/**
 * Email Service Abstraction
 *
 * Provides an interface for sending emails. Uses a console-log stub
 * until Tom decides on a provider (SendGrid, Twilio, etc.).
 *
 * To switch providers: replace ConsoleEmailService with SendGridEmailService
 * (or similar) and update the singleton export at the bottom.
 */

import { logger } from '../utils/logger';

// ============================================================================
// Interface
// ============================================================================

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

export interface EmailService {
  sendEmail(options: SendEmailOptions): Promise<void>;
}

// ============================================================================
// Console Stub (Development)
// ============================================================================

export class ConsoleEmailService implements EmailService {
  async sendEmail(options: SendEmailOptions): Promise<void> {
    const recipients = Array.isArray(options.to) ? options.to.join(', ') : options.to;
    logger.info(
      {
        to: recipients,
        subject: options.subject,
        from: options.from || 'noreply@tipsharepro.com',
      },
      `[EMAIL STUB] Would send email to ${recipients}: "${options.subject}"`
    );
    logger.debug({ html: options.html.substring(0, 200) }, '[EMAIL STUB] Email body preview');
  }
}

// ============================================================================
// Singleton Export
// ============================================================================

// Swap this line when real provider is configured:
// export const emailService: EmailService = new SendGridEmailService();
export const emailService: EmailService = new ConsoleEmailService();
