import express from 'express';
import type { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Persistent runtime SMTP config file path
const SMTP_CONFIG_FILE = path.resolve(__dirname, '.smtp-config.json');

interface SmtpSettings {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  adminEmail: string;
}

// Load active SMTP configuration
function getSmtpConfig(): SmtpSettings {
  let fileConfig: Partial<SmtpSettings> = {};
  if (fs.existsSync(SMTP_CONFIG_FILE)) {
    try {
      fileConfig = JSON.parse(fs.readFileSync(SMTP_CONFIG_FILE, 'utf-8'));
    } catch (e) {
      console.error('Error reading .smtp-config.json:', e);
    }
  }

  const host = fileConfig.host || process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = fileConfig.port || Number(process.env.SMTP_PORT) || 587;
  const secure = fileConfig.secure !== undefined ? fileConfig.secure : (process.env.SMTP_SECURE === 'true' || port === 465);
  const user = fileConfig.user || process.env.SMTP_USER || '';
  const pass = fileConfig.pass || process.env.SMTP_PASS || '';
  const from = fileConfig.from || process.env.SMTP_FROM || (user ? `"BLR15 Home Loans" <${user}>` : '"BLR15 Home Loans" <contact@blr15homeloans.com>');
  const adminEmail = fileConfig.adminEmail || process.env.SMTP_ADMIN_EMAIL || 'godwinrobby1985@gmail.com';

  return { host, port, secure, user, pass, from, adminEmail };
}

// Create Nodemailer Transporter
async function createTransporter(customConfig?: Partial<SmtpSettings>) {
  const config = { ...getSmtpConfig(), ...customConfig };

  if (config.user && config.pass) {
    return {
      transporter: nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: {
          user: config.user,
          pass: config.pass,
        },
        tls: {
          rejectUnauthorized: false,
        },
      }),
      config,
      isSimulated: false,
    };
  }

  // Fast built-in jsonTransport when credentials are not yet set
  const simulatedTransporter = nodemailer.createTransport({
    jsonTransport: true,
  });

  return {
    transporter: simulatedTransporter,
    config,
    isSimulated: true,
  };
}

// Utility to format currency in Indian Rupees
function formatINR(amount?: number): string {
  if (amount === undefined || isNaN(amount)) return '₹0';
  return '₹' + amount.toLocaleString('en-IN');
}

// HTML Template: Customer Acknowledgement
function generateCustomerEmailHtml(enquiry: any): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>BLR15 Home Loans Enquiry Confirmation</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f1f5f9; color: #1e293b; }
    .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
    .header { background-color: #0B1B3D; padding: 32px 24px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
    .header .tagline { color: #f59e0b; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 6px; }
    .content { padding: 32px 24px; }
    .badge { display: inline-block; background-color: #ecfdf5; color: #065f46; font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 9999px; border: 1px solid #a7f3d0; margin-bottom: 16px; }
    .greeting { font-size: 18px; font-weight: 700; color: #0B1B3D; margin-bottom: 12px; }
    .message { font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 24px; }
    .card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
    .card-title { font-size: 14px; font-weight: 700; color: #0B1B3D; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
    .row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
    .label { color: #64748b; font-weight: 500; }
    .val { color: #0f172a; font-weight: 700; text-align: right; }
    .steps { margin: 24px 0; }
    .step-item { display: flex; margin-bottom: 14px; font-size: 13px; }
    .step-num { width: 24px; height: 24px; border-radius: 50%; background-color: #f59e0b; color: #0B1B3D; font-weight: 800; text-align: center; line-height: 24px; font-size: 12px; margin-right: 12px; flex-shrink: 0; }
    .step-text { color: #334155; line-height: 1.4; }
    .footer { background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; }
    .contact-btn { display: inline-block; background-color: #0B1B3D; color: #ffffff !important; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 13px; margin: 12px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>BLR15 HOME LOANS</h1>
      <div class="tagline">Your Dream Home, Our Commitment</div>
    </div>
    <div class="content">
      <div class="badge">Reference ID: ${enquiry.id || 'BLR15-ENQ'}</div>
      <div class="greeting">Dear ${enquiry.customerName || 'Valued Customer'},</div>
      <div class="message">
        Thank you for submitting your home loan enquiry with <strong>BLR15 Home Loans</strong>. We have received your details and your application file has been generated in our Bangalore CRM system.
      </div>

      <div class="card">
        <div class="card-title">Enquiry Summary</div>
        <div class="row">
          <span class="label">Reference ID:</span>
          <span class="val" style="color: #f59e0b;">${enquiry.id}</span>
        </div>
        <div class="row">
          <span class="label">Loan Requirement:</span>
          <span class="val">${formatINR(enquiry.requiredLoanAmount)}</span>
        </div>
        <div class="row">
          <span class="label">Loan Type:</span>
          <span class="val">${enquiry.loanType || 'Home Purchase Loan'}</span>
        </div>
        <div class="row">
          <span class="label">Property Type:</span>
          <span class="val">${enquiry.propertyType || 'Residential House / Apartment'}</span>
        </div>
        <div class="row">
          <span class="label">Property Location:</span>
          <span class="val">${enquiry.propertyLocation || enquiry.city || 'Bangalore'}</span>
        </div>
        <div class="row">
          <span class="label">Registered Mobile:</span>
          <span class="val">${enquiry.mobile}</span>
        </div>
      </div>

      <div class="steps">
        <div style="font-weight: 700; font-size: 14px; color: #0B1B3D; margin-bottom: 12px;">What Happens Next?</div>
        <div class="step-item">
          <div class="step-num">1</div>
          <div class="step-text"><strong>Dedicated Loan Advisor Assignment:</strong> An experienced BLR15 finance advisor will review your eligibility across 20+ partner banks (SBI, HDFC, ICICI, etc.).</div>
        </div>
        <div class="step-item">
          <div class="step-num">2</div>
          <div class="step-text"><strong>Free Consultation & Doorstep Pickup:</strong> We will contact you at <strong>${enquiry.mobile}</strong> within 2 business hours to schedule doorstep document collection or address queries.</div>
        </div>
        <div class="step-item">
          <div class="step-num">3</div>
          <div class="step-text"><strong>Fast-Track Bank Sanction:</strong> We compare lowest interest rates (starting 8.35% p.a.) and assist with legal and technical approvals.</div>
        </div>
      </div>

      <div style="text-align: center; margin-top: 24px;">
        <a href="tel:+919845015150" class="contact-btn">Call Advisor: +91 98450 15150</a>
      </div>
    </div>

    <div class="footer">
      <strong>BLR15 Home Loans Hub Bangalore</strong><br>
      Near Narasimha Swamy Temple, 1st Floor, Kammagondanahalli Main Road<br>
      Jalahalli West, Bangalore – 560015<br>
      Phone: +91 98450 15150 | Email: contact@blr15homeloans.com<br>
      Hours: Mon – Sat (9:30 AM – 7:00 PM)
    </div>
  </div>
</body>
</html>
  `;
}

// HTML Template: Admin & Loan Officer Alert
function generateAdminAlertEmailHtml(enquiry: any): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>New Lead Alert - BLR15 Home Loans</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; color: #0f172a; margin: 0; padding: 20px; }
    .box { max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #cbd5e1; overflow: hidden; }
    .bar { background: #0B1B3D; color: #ffffff; padding: 18px 24px; display: flex; justify-content: space-between; align-items: center; }
    .lead-badge { background: #f59e0b; color: #0B1B3D; font-weight: 800; font-size: 12px; padding: 4px 10px; border-radius: 6px; }
    .body { padding: 24px; font-size: 13px; line-height: 1.6; }
    .table { width: 100%; border-collapse: collapse; margin-top: 14px; }
    .table td { padding: 8px 12px; border-bottom: 1px solid #f1f5f9; }
    .key { color: #64748b; font-weight: 600; width: 40%; }
    .val { color: #0f172a; font-weight: 700; width: 60%; }
    .hl { color: #d97706; font-size: 15px; }
    .msg-box { background: #f1f5f9; border-left: 4px solid #0B1B3D; padding: 12px 16px; border-radius: 4px; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="box">
    <div class="bar">
      <h2 style="margin:0; font-size: 18px;">🚨 NEW HOME LOAN LEAD RECEIVED</h2>
      <span class="lead-badge">${enquiry.id}</span>
    </div>
    <div class="body">
      <p>A new home loan enquiry has been submitted on the BLR15 platform. Please initiate customer contact immediately.</p>
      
      <table class="table">
        <tr><td class="key">Reference ID:</td><td class="val hl">${enquiry.id}</td></tr>
        <tr><td class="key">Customer Name:</td><td class="val">${enquiry.customerName}</td></tr>
        <tr><td class="key">Mobile Number:</td><td class="val"><a href="tel:${enquiry.mobile}">${enquiry.mobile}</a></td></tr>
        <tr><td class="key">Email Address:</td><td class="val"><a href="mailto:${enquiry.email}">${enquiry.email}</a></td></tr>
        <tr><td class="key">Required Loan Amount:</td><td class="val hl">${formatINR(enquiry.requiredLoanAmount)}</td></tr>
        <tr><td class="key">Property Value:</td><td class="val">${formatINR(enquiry.propertyValue)}</td></tr>
        <tr><td class="key">Property Type:</td><td class="val">${enquiry.propertyType}</td></tr>
        <tr><td class="key">Property Location:</td><td class="val">${enquiry.propertyLocation || enquiry.city}</td></tr>
        <tr><td class="key">Loan Type:</td><td class="val">${enquiry.loanType || 'Home Purchase Loan'}</td></tr>
        <tr><td class="key">Employment Type:</td><td class="val">${enquiry.employmentType}</td></tr>
        <tr><td class="key">Net Monthly Income:</td><td class="val">${formatINR(enquiry.monthlyIncome)} / mo</td></tr>
        <tr><td class="key">Source:</td><td class="val">${enquiry.source || 'Website Form'}</td></tr>
        <tr><td class="key">Received At:</td><td class="val">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td></tr>
      </table>

      ${enquiry.message ? `
        <div class="msg-box">
          <strong>Customer Note / Message:</strong><br>
          ${enquiry.message}
        </div>
      ` : ''}
    </div>
  </div>
</body>
</html>
  `;
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. Send Enquiry Email (Customer + Admin)
app.post('/api/send-enquiry-email', async (req: Request, res: Response) => {
  try {
    const { enquiry } = req.body;
    if (!enquiry || !enquiry.customerName || !enquiry.email) {
      res.status(400).json({ error: 'Missing enquiry or required customer email/name' });
      return;
    }

    const { transporter, config, isSimulated } = await createTransporter();

    let customerSent = false;
    let adminSent = false;
    let previewUrl: string | undefined;

    // A. Send Customer Confirmation Email
    try {
      const customerMailOptions = {
        from: config.from,
        to: enquiry.email,
        subject: `BLR15 Home Loans Enquiry Confirmation [${enquiry.id || 'BLR15'}]`,
        html: generateCustomerEmailHtml(enquiry),
      };

      const info = await transporter.sendMail(customerMailOptions);
      customerSent = true;
      if (isSimulated) {
        previewUrl = nodemailer.getTestMessageUrl(info) || undefined;
      }
      console.log(`[SMTP] Customer confirmation email sent to ${enquiry.email}:`, info.messageId);
    } catch (err: any) {
      console.error('[SMTP] Failed to send customer email:', err);
    }

    // B. Send Admin Lead Alert Email
    if (config.adminEmail) {
      try {
        const adminMailOptions = {
          from: config.from,
          to: config.adminEmail,
          subject: `[LEAD ALERT] ${enquiry.id} - ${enquiry.customerName} (${formatINR(enquiry.requiredLoanAmount)})`,
          html: generateAdminAlertEmailHtml(enquiry),
        };

        const adminInfo = await transporter.sendMail(adminMailOptions);
        adminSent = true;
        console.log(`[SMTP] Admin alert email sent to ${config.adminEmail}:`, adminInfo.messageId);
      } catch (err: any) {
        console.error('[SMTP] Failed to send admin alert email:', err);
      }
    }

    res.json({
      success: true,
      isSimulated,
      customerEmailSent: customerSent,
      adminEmailSent: adminSent,
      customerEmail: enquiry.email,
      adminEmail: config.adminEmail,
      previewUrl,
    });
  } catch (err: any) {
    console.error('Error in /api/send-enquiry-email:', err);
    res.status(500).json({ success: false, error: err?.message || 'Failed to process email delivery' });
  }
});

// 2. Get current SMTP configuration status
app.get('/api/smtp-config', (_req: Request, res: Response) => {
  const config = getSmtpConfig();
  res.json({
    configured: Boolean(config.user && config.pass),
    host: config.host,
    port: config.port,
    secure: config.secure,
    user: config.user,
    from: config.from,
    adminEmail: config.adminEmail,
  });
});

// 3. Save SMTP settings
app.post('/api/save-smtp-config', (req: Request, res: Response) => {
  try {
    const { host, port, secure, user, pass, from, adminEmail } = req.body;
    const current = getSmtpConfig();

    const updated: SmtpSettings = {
      host: host || current.host,
      port: Number(port) || current.port,
      secure: Boolean(secure),
      user: user !== undefined ? user : current.user,
      pass: pass !== undefined && pass !== '' ? pass : current.pass,
      from: from || current.from,
      adminEmail: adminEmail || current.adminEmail,
    };

    fs.writeFileSync(SMTP_CONFIG_FILE, JSON.stringify(updated, null, 2), 'utf-8');
    console.log('[SMTP] Saved new SMTP configuration.');

    res.json({
      success: true,
      message: 'SMTP configuration saved successfully',
      config: {
        configured: Boolean(updated.user && updated.pass),
        host: updated.host,
        port: updated.port,
        secure: updated.secure,
        user: updated.user,
        from: updated.from,
        adminEmail: updated.adminEmail,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || 'Failed to save SMTP configuration' });
  }
});

// 4. Test SMTP connection & send test email
app.post('/api/test-smtp', async (req: Request, res: Response) => {
  try {
    const { host, port, secure, user, pass, from, toEmail } = req.body;
    const testRecipient = toEmail || user || getSmtpConfig().adminEmail;

    if (!testRecipient) {
      res.status(400).json({ success: false, error: 'Recipient email address is required' });
      return;
    }

    const { transporter, config } = await createTransporter({
      host,
      port: Number(port),
      secure: Boolean(secure),
      user,
      pass,
      from,
    });

    // Verify SMTP connection
    await transporter.verify();

    // Send test email
    const info = await transporter.sendMail({
      from: config.from || from || `"BLR15 Test" <${user}>`,
      to: testRecipient,
      subject: '✅ BLR15 Home Loans - SMTP Test Verification',
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 20px auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #0B1B3D; margin-top: 0;">BLR15 Home Loans SMTP Verified</h2>
          <p style="color: #10b981; font-weight: bold;">Connection Successful!</p>
          <p style="font-size: 13px; color: #475569;">
            Your SMTP email delivery service is correctly configured and ready to dispatch customer enquiry confirmations and admin lead alerts.
          </p>
          <div style="background: #f8fafc; padding: 12px; border-radius: 8px; font-size: 12px; font-family: monospace; color: #334155;">
            Host: ${config.host}<br>
            Port: ${config.port}<br>
            User: ${config.user}<br>
            Timestamp: ${new Date().toISOString()}
          </div>
        </div>
      `,
    });

    res.json({
      success: true,
      message: `SMTP test email successfully sent to ${testRecipient}!`,
      messageId: info.messageId,
    });
  } catch (err: any) {
    console.error('[SMTP Test Error]', err);
    res.status(400).json({
      success: false,
      error: err?.message || 'Failed to connect to SMTP server. Please verify your credentials and port.',
    });
  }
});

// ----------------------------------------------------
// STATIC & VITE MIDDLEWARES
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV === 'production' && fs.existsSync(path.resolve(__dirname, 'dist'))) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: Number(PORT) },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[BLR15 Server] Full-stack backend running on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start BLR15 server:', err);
});
