/**
 * SMS Service Abstraction
 *
 * Provides an interface for sending SMS messages. Uses a console-log stub
 * until Tom decides on a provider (Twilio, etc.).
 *
 * To switch providers: replace ConsoleSmsService with TwilioSmsService
 * (or similar) and update the singleton export at the bottom.
 */

import { logger } from '../utils/logger';

// ============================================================================
// Interface
// ============================================================================

export interface SendSmsOptions {
  to: string;
  body: string;
  from?: string;
}

export interface SmsService {
  sendSms(options: SendSmsOptions): Promise<void>;
}

// ============================================================================
// Console Stub (Development)
// ============================================================================

export class ConsoleSmsService implements SmsService {
  async sendSms(options: SendSmsOptions): Promise<void> {
    logger.info(
      {
        to: options.to,
        from: options.from || 'TipSharePro',
        bodyLength: options.body.length,
      },
      `[SMS STUB] Would send SMS to ${options.to}: "${options.body}"`
    );
  }
}

// ============================================================================
// Singleton Export
// ============================================================================

// Swap this line when real provider is configured:
// export const smsService: SmsService = new TwilioSmsService();
export const smsService: SmsService = new ConsoleSmsService();
