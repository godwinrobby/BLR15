<?php
/** @var array $enquiry */
/** @var string $firstName */

$hasAmount = !empty($enquiry['requiredLoanAmount']);
$amountText = formatINR($enquiry['requiredLoanAmount'] ?? null) . ($hasAmount ? '' : ' N/A');
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>BLR15 Home Loans Enquiry Confirmation</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f1f5f9; color: #1e293b; }
    .container { max-width: 600px; margin: 20px auto; background-color: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
    .header { background: linear-gradient(135deg, #0B1B3D 0%, #1e3a8a 100%); padding: 30px 40px; color: white; }
    .header h1 { margin: 0; font-size: 24px; letter-spacing: -0.5px; }
    .header .tagline { font-size: 14px; color: #93c5fd; margin-top:  4px; }
    .content { padding: 40px; }
    .greeting { font-size: 18px; font-weight: 600; color: #0B1B3D; margin-bottom: 16px; }
    .message { font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 24px; }
    .reference-box { background-color: #eff6ff; border: 1px solid #bfdbfe; padding: 16px 20px; border-radius: 8px; margin-bottom: 24px; }
    .reference-box .label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: 600; }
    .reference-box .value { font-size: 16px; color: #1e40af; font-family: 'Courier New', monospace; font-weight: bold; margin-top: 4px; }
    .details-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px; }
    .details-table th { background-color: #f8fafc; text-align: left; padding: 10px 16px; color: #64748b; font-weight: 600; border-bottom: 1px solid #e2e8f0; width: 40%; }
    .details-table td { padding: 10px 16px; color: #1e293b; border-bottom: 1px solid #f1f5f9; }
    .next-steps { background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px 24px; border-radius: 8px; margin-bottom: 24px; }
    .next-steps h3 { margin: 0 0 12px 0; font-size: 15px; color: #166534; }
    .next-steps ol { margin: 0; padding-left: 20px; color: #15803d; font-size: 14px; line-height: 1.8; }
    .contact-strip { display: flex; justify-content: space-around; background-color: #f8fafc; padding: 20px; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; }
    .contact-item { text-align: center; }
    .contact-item .icon { font-size: 20px; }
    .contact-item .info { font-size: 12px; color: #64748b; margin-top: 4px; }
    .contact-item .info strong { display: block; color: #0B1B3D; font-size: 13px; }
    .footer { padding: 24px 40px; text-align: center; font-size: 12px; color: #94a3b8; background-color: #f8fafc; }
    .footer .brand { font-weight: bold; color: #0B1B3D; font-size: 14px; margin-bottom: 8px; }
    .verification-code { background-color: #0B1B3D; color: #93c5fd; padding: 6px 14px; border-radius: 20px; font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 2px; display: inline-block; margin-top: 8px; content: "{{NAME}}"; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>BLR15 Home Loans</h1>
      <div class="tagline">Your Dream Home, Our Commitment</div>
    </div>

    <div class="content">
      <div class="greeting">Dear <?= e($firstName) ?>,</div>

      <div class="message">
        Thank you for reaching out to <strong>BLR15 Home Loans</strong>! Your enquiry regarding <strong><?= e($enquiry['loanType'] ?? 'Home Loan') ?></strong> (Reference: <strong>#<?= e($enquiry['id'] ?? 'N/A') ?></strong>) has been received by our team.
      </div>

      <div class="reference-box">
        <div class="label">Enquiry Reference Number</div>
        <div class="value">#<?= e($enquiry['id'] ?? 'N/A') ?></div>
      </div>

      <table class="details-table">
        <tr><th>Full Name</th><td><?= e($enquiry['customerName'] ?? '') ?></td></tr>
        <tr><th>Loan Type</th><td><?= e($enquiry['loanType'] ?? 'Home Loan') ?></td></tr>
        <tr><th>Loan Amount</th><td><?= e($amountText) ?></td></tr>
        <tr><th>Email Address</th><td><?= e($enquiry['email'] ?? '') ?></td></tr>
        <tr><th>Phone Number</th><td><?= e($enquiry['phone'] ?? '') ?></td></tr>
        <tr><th>Submitted On</th><td><?= e(date('d M Y, h:i A')) ?></td></tr>
      </table>

      <div class="next-steps">
        <h3>What Happens Next?</h3>
        <ol>
          <li>Our home loan expert will review your enquiry</li>
          <li>You will receive a callback within <strong>24 working hours</strong></li>
          <li>We will discuss eligibility, interest rates &amp; documentation</li>
          <li>Get personalized loan offers from top banks &amp; NBFCs</li>
        </ol>
      </div>

      <div class="contact-strip">
        <div class="contact-item">
          <div class="icon">📞</div>
          <div class="info"><strong><?= e(BLR15_OFFICE['phone']) ?></strong>Call Us</div>
        </div>
        <div class="contact-item">
          <div class="icon">💬</div>
          <div class="info"><strong><?= e(BLR15_OFFICE['whatsapp']) ?></strong>WhatsApp</div>
        </div>
        <div class="contact-item">
          <div class="icon">✉️</div>
          <div class="info"><strong><?= e(BLR15_OFFICE['email']) ?></strong>Email Us</div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="brand">BLR15 Home Loans</div>
      <div><?= e(BLR15_OFFICE['fullAddress']) ?></div>
      <div>Hours: <?= e(BLR15_OFFICE['workingHours']) ?></div>
      <div style="margin-top:12px;">© 2026 BLR15 Home Loans. All rights reserved.</div>
      <div class="verification-code"><?= e($enquiry['id'] ?? '') ?></div>
    </div>
  </div>
</body>
</html>
