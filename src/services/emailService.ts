import { HomeLoanEnquiry } from '../types';
import { apiFetch } from './apiClient';

/**
 * SMTP + email endpoints are served by the BLR15 Laravel API (/api/v1):
 *   POST emails/enquiry        — dispatch confirmation + admin alert
 *   GET  settings/smtp         — read SMTP config (JWT)
 *   PUT  settings/smtp         — save SMTP config (JWT)
 *   POST settings/smtp/test    — verify credentials (JWT)
 *
 * The JWT is attached automatically by apiFetch. The SMTP + email responses keep
 * the SAME top-level shape the previous PHP backend returned.
 */

export interface EmailDispatchResult {
  success: boolean;
  isSimulated?: boolean;
  customerEmailSent?: boolean;
  adminEmailSent?: boolean;
  customerEmail?: string;
  adminEmail?: string;
  previewUrl?: string;
  error?: string;
}

export interface SmtpConfigResponse {
  configured: boolean;
  host: string;
  port: number;
  secure: boolean;
  user: string;
  from: string;
  adminEmail: string;
}

/**
 * Sends customer acknowledgement and admin alert email via SMTP
 */
export async function sendEnquiryEmailViaSmtp(enquiry: HomeLoanEnquiry): Promise<EmailDispatchResult> {
  try {
    const response = await apiFetch('emails/enquiry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ enquiry }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errData.error || `HTTP ${response.status} email sending failed`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      isSimulated: data.isSimulated,
      customerEmailSent: data.customerEmailSent,
      adminEmailSent: data.adminEmailSent,
      customerEmail: data.customerEmail,
      adminEmail: data.adminEmail,
      previewUrl: data.previewUrl,
    };
  } catch (err: any) {
    console.warn('[EmailService] SMTP endpoint error:', err);
    return {
      success: false,
      error: err?.message || 'Network error communicating with SMTP service',
    };
  }
}

/**
 * Fetch current SMTP configuration status
 */
export async function getSmtpConfigStatus(): Promise<SmtpConfigResponse | null> {
  try {
    const response = await apiFetch('settings/smtp');
    if (!response.ok) return null;
    return await response.json();
  } catch (e) {
    return null;
  }
}

/**
 * Save SMTP settings
 */
export async function saveSmtpSettings(config: {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass?: string;
  from: string;
  adminEmail: string;
}): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const response = await apiFetch('settings/smtp', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    return await response.json();
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to save configuration' };
  }
}

/**
 * Test SMTP connection and send a test email
 */
export async function testSmtpConnection(payload: {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from?: string;
  toEmail: string;
}): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const response = await apiFetch('settings/smtp/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    return await response.json();
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Failed to execute SMTP test',
    };
  }
}
