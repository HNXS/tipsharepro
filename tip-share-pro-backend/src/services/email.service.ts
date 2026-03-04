import { Resend } from 'resend';
import { logger } from '../utils/logger';

export interface EmailAttachment {
  filename: string;
  content: Buffer;
  contentType?: string;
}

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  attachments?: EmailAttachment[];
}

export interface EmailService {
  sendEmail(options: SendEmailOptions): Promise<void>;
}

const DEFAULT_FROM = 'TipSharePro <contact@tipsharepro.com>';

export class ResendEmailService implements EmailService {
  private resend: Resend;

  constructor(apiKey: string) {
    this.resend = new Resend(apiKey);
  }

  async sendEmail(options: SendEmailOptions): Promise<void> {
    const from = options.from || DEFAULT_FROM;
    const to = Array.isArray(options.to) ? options.to : [options.to];

    try {
      const sendPayload: any = {
        from,
        to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        replyTo: options.replyTo,
      };

      if (options.attachments && options.attachments.length > 0) {
        sendPayload.attachments = options.attachments.map(a => ({
          filename: a.filename,
          content: a.content,
          contentType: a.contentType || 'application/pdf',
        }));
      }

      const { data, error } = await this.resend.emails.send(sendPayload);

      if (error) {
        logger.error({ error, to, subject: options.subject }, 'Resend email failed');
        throw new Error(`Email send failed: ${error.message}`);
      }

      logger.info({ id: data?.id, to, subject: options.subject }, 'Email sent via Resend');
    } catch (err) {
      logger.error({ err, to, subject: options.subject }, 'Email service error');
      throw err;
    }
  }
}

export class ConsoleEmailService implements EmailService {
  async sendEmail(options: SendEmailOptions): Promise<void> {
    const recipients = Array.isArray(options.to) ? options.to.join(', ') : options.to;
    logger.info(
      { to: recipients, subject: options.subject, from: options.from || DEFAULT_FROM },
      `[EMAIL STUB] Would send email to ${recipients}: "${options.subject}"`
    );
    logger.debug({ html: options.html.substring(0, 200) }, '[EMAIL STUB] Email body preview');
  }
}

const apiKey = process.env.RESEND_API_KEY;
export const emailService: EmailService = apiKey
  ? new ResendEmailService(apiKey)
  : new ConsoleEmailService();
