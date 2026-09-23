import { HomeLoanEnquiry } from '../types';

/**
 * The backend API is the PHP application in /api (PHPMailer based).
 * Paths are intentionally relative so the SPA works both at the domain root
 * and inside a sub-directory (e.g. XAMPP http://localhost/BLR15/).
 */
const API_BASE = 'api';

async function apiFetch(route: string, init?: RequestInit): Promise<Response> {
  let response = await fetch(`${API_BASE}/${route}`, init);
  if (response.status === 404) {
    // Fallback for servers without URL rewriting: hit the front controller directly.
    response = await fetch(`${API_BASE}/index.php?route=${encodeURIComponent(route)}`, init);
  }
  return response;
}

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
    const response = await apiFetch('send-enquiry-email', {
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
    const response = await apiFetch('smtp-config');
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
    const response = await apiFetch('save-smtp-config', {
      method: 'POST',
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
    const response = await apiFetch('test-smtp', {
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
