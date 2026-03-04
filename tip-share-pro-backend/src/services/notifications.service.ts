/**
 * Notifications Service
 *
 * Sends emails using HTML template files from src/templates/.
 *
 * HOW TO EDIT TEMPLATES:
 *   All email templates live in  src/templates/  as plain .html files.
 *   Open any file, change the wording or styling, save, and restart the
 *   server — that's it. Variables look like {{variableName}} and are
 *   replaced at send time.
 *
 * Template files:
 *   layout.html          — shared header/footer wrapper (all emails)
 *   welcome.html         — new account registration
 *   trial-expiring.html  — trial countdown reminder
 *   payment-receipt.html — Stripe payment confirmation
 *   password-reset.html  — password reset link
 *   account-suspended.html — payment failure / cancellation
 *   two-factor-code.html — 2FA login code
 *   user-invite.html     — admin invites a new team member
 */

import fs from 'fs';
import path from 'path';
import { emailService } from './email.service';
import { logger } from '../utils/logger';

// ============================================================================
// Template Engine
// ============================================================================

const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');

/** Cache loaded template strings so we only read disk once per process. */
const templateCache = new Map<string, string>();

/**
 * Load and cache a template file. Returns the raw HTML string.
 */
function loadTemplate(name: string): string {
  const cached = templateCache.get(name);
  if (cached) return cached;

  const filePath = path.join(TEMPLATES_DIR, `${name}.html`);
  const content = fs.readFileSync(filePath, 'utf-8');
  templateCache.set(name, content);
  return content;
}

/**
 * Replace all {{key}} placeholders with values from vars.
 * All values are HTML-escaped to prevent injection.
 */
function replaceVars(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
    if (key in vars) return escapeHtml(vars[key]);
    return `{{${key}}}`;
  });
}

/**
 * Render a named body template, then wrap it in the shared layout.
 *
 * 1. Load the body template and replace its {{vars}}
 * 2. Load the layout template and replace {{year}} (plus any future layout vars)
 * 3. Inject the rendered body into {{content}} — raw, so HTML is preserved
 */
function buildEmail(templateName: string, vars: Record<string, string>): string {
  const layout = loadTemplate('layout');
  const body = loadTemplate(templateName);

  // Step 1 — render body-level variables
  const renderedBody = replaceVars(body, vars);

  // Step 2 — render layout-level variables (year, etc.)
  const renderedLayout = replaceVars(layout, {
    year: String(new Date().getFullYear()),
  });

  // Step 3 — inject body into layout (raw replace, no escaping)
  return renderedLayout.replace('{{content}}', renderedBody);
}

// ============================================================================
// Notification Functions
// ============================================================================

export async function sendWelcomeEmail(to: string, companyName: string): Promise<void> {
  try {
    const html = buildEmail('welcome', { companyName });
    await emailService.sendEmail({
      to,
      subject: 'Welcome to TipSharePro!',
      html,
      text: `Welcome to TipSharePro! Your account for ${companyName} has been created. Visit https://app.tipsharepro.com to get started.`,
    });
  } catch (error) {
    logger.error({ error, to }, 'Failed to send welcome email');
  }
}

export async function sendTrialExpiringEmail(
  to: string,
  companyName: string,
  daysRemaining: number
): Promise<void> {
  try {
    const dayWord = daysRemaining === 1 ? 'day' : 'days';
    const html = buildEmail('trial-expiring', {
      companyName,
      daysRemaining: String(daysRemaining),
      dayWord,
    });
    await emailService.sendEmail({
      to,
      subject: `Your TipSharePro trial expires in ${daysRemaining} ${dayWord}`,
      html,
      text: `Your TipSharePro trial for ${companyName} expires in ${daysRemaining} ${dayWord}. Subscribe at https://app.tipsharepro.com to continue.`,
    });
  } catch (error) {
    logger.error({ error, to }, 'Failed to send trial expiring email');
  }
}

export async function sendPaymentReceiptEmail(
  to: string,
  companyName: string,
  amount: string,
  date: string
): Promise<void> {
  try {
    const html = buildEmail('payment-receipt', { companyName, amount, date });
    await emailService.sendEmail({
      to,
      subject: 'TipSharePro Payment Received',
      html,
      text: `Payment received for ${companyName}. Amount: ${amount}. Date: ${date}.`,
    });
  } catch (error) {
    logger.error({ error, to }, 'Failed to send payment receipt email');
  }
}

export async function sendPasswordResetEmail(to: string, resetToken: string): Promise<void> {
  try {
    const resetUrl = `https://app.tipsharepro.com?reset=${resetToken}`;
    const html = buildEmail('password-reset', { resetUrl });
    await emailService.sendEmail({
      to,
      subject: 'Reset Your TipSharePro Password',
      html,
      text: `Reset your TipSharePro password by visiting: ${resetUrl}. This link expires in 1 hour.`,
    });
  } catch (error) {
    logger.error({ error, to }, 'Failed to send password reset email');
  }
}

export async function sendAccountSuspendedEmail(to: string, companyName: string): Promise<void> {
  try {
    const html = buildEmail('account-suspended', { companyName });
    await emailService.sendEmail({
      to,
      subject: 'TipSharePro Account Suspended — Action Required',
      html,
      text: `Your TipSharePro account for ${companyName} has been suspended. Please update your payment method at https://app.tipsharepro.com.`,
    });
  } catch (error) {
    logger.error({ error, to }, 'Failed to send account suspended email');
  }
}

export async function send2FACodeEmail(to: string, code: string): Promise<void> {
  try {
    const html = buildEmail('two-factor-code', { code });
    await emailService.sendEmail({
      to,
      subject: `${code} is your TipSharePro verification code`,
      html,
      text: `Your TipSharePro verification code is: ${code}. It expires in 10 minutes.`,
    });
  } catch (error) {
    logger.error({ error, to }, 'Failed to send 2FA code email');
  }
}

export async function sendUserInviteEmail(
  to: string,
  companyName: string,
  role: string,
  inviterName: string
): Promise<void> {
  try {
    const roleLabel = role === 'ADMIN' ? 'Administrator' : role === 'MANAGER' ? 'Manager' : 'Data';
    const html = buildEmail('user-invite', { companyName, roleLabel, inviterName });
    await emailService.sendEmail({
      to,
      subject: `You've been invited to ${companyName} on TipSharePro`,
      html,
      text: `${inviterName} has invited you to join ${companyName} on TipSharePro as a ${roleLabel}. Sign in at https://app.tipsharepro.com.`,
    });
  } catch (error) {
    logger.error({ error, to }, 'Failed to send user invite email');
  }
}

// ============================================================================
// Helpers
// ============================================================================

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
