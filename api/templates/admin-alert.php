<?php
/** @var array $enquiry */
/** @var array $office */

$hasAmount = !empty($enquiry['requiredLoanAmount']);
$amountText = formatINR($enquiry['requiredLoanAmount'] ?? null) . ($hasAmount ? '' : ' N/A');
$timestamp = gmdate('Y-m-d\TH:i:s.v\Z');
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>New BLR15 Home Loan Lead</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f1f5f9; color: #1e293b; }
    .container { max-width: 650px; margin: 20px auto; background-color: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 24px 40px; color: white; display: flex; justify-content: space-between; align-items: center; }
    .header h1 { margin: 0; font-size: 22px; }
    .badge { background-color: rgba(255, 255, 255, 0.2); padding: 4px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; }
    .meta-bar { background-color: #fef2f2; padding: 12px 40px; font-size: 13px; color: #991b1b; border-bottom: 1px solid #fecaca; display: flex; justify-content: space-between; }
    .content { padding: 32px 40px; }
    .lead-title { font-size: 20px; font-weight: 700; color: #0B1B3D; margin-bottom: 4px; }
    .lead-subtitle { font-size: 14px; color: #64748b; margin-bottom: 24px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
    .info-card { background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; }
    .info-card.full-width { grid-column: span 2; }
    .info-card .label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: 600; margin-bottom: 6px; }
    .info-card .value { font-size: 16px; color: #0B1B3D; font-weight: 600; word-break: break-word; }
    .info-card .value.amount { color: #059669; font-size: 20px; }
    .info-card .value a { color: #2563eb; text-decoration: none; }
    .notes { background-color: #fffbeb; border: 1px solid #fde68a; padding: 16px 20px; border-radius: 8px; margin-bottom: 24px; }
    .notes .label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #92400e; font-weight: 600; margin-bottom: 8px; }
    .notes .text { font-size: 14px; color: #78350f; line-height: 1.6; font-style: italic; }
    .action-bar { display: flex; gap: 12px; margin-bottom: 8px; }
    .btn { display: inline-block; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; text-align: center; }
    .btn-call { background-color: #0B1B3D; color: #fff; }
    .btn-email { background-color: #2563eb; color: #fff; }
    .priority-flag { text-align: center; background-color: #f0fdf4; border-top: 1px solid #bbf7d0; border-bottom: 1px solid #bbf7d0; padding: 12px; font-size: 13px; color: #166534; font-weight: 600; }
    .footer { padding: 20px 40px; text-align: center; font-size: 12px; color: #94a3b8; background-color: #f8fafc; }
    .footer .brand { font-weight: bold; color: #0B1B3D; font-size: 14px; margin-bottom: 6px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚨 New Home Loan Lead</h1>
      <div class="badge"><?= e($enquiry['status'] ?? 'New Lead') ?></div>
    </div>

    <div class="meta-bar">
      <span>Ref: <strong>#<?= e($enquiry['id'] ?? 'N/A') ?></strong></span>
      <span><?= e($timestamp) ?></span>
    </div>

    <div class="content">
      <div class="lead-title"><?= e($enquiry['customerName'] ?? 'New Customer') ?></div>
      <div class="lead-subtitle">New <?= e($enquiry['loanType'] ?? 'Home Loan') ?> enquiry via <?= e($enquiry['createdVia'] ?? 'Website Enquiry Form') ?></div>

      <div class="info-grid">
        <div class="info-card">
          <div class="label">Customer Name</div>
          <div class="value"><?= e($enquiry['customerName'] ?? 'N/A') ?></div>
        </div>
        <div class="info-card">
          <div class="label">Loan Type</div>
          <div class="value"><?= e($enquiry['loanType'] ?? 'Home Loan') ?></div>
        </div>
        <div class="info-card">
          <div class="label">📧 Email</div>
          <div class="value"><a href="mailto:<?= e($enquiry['email'] ?? '') ?>"><?= e($enquiry['email'] ?? 'N/A') ?></a></div>
        </div>
        <div class="info-card">
          <div class="label">📱 Phone</div>
          <div class="value"><a href="tel:<?= e($enquiry['phone'] ?? '') ?>"><?= e($enquiry['phone'] ?? 'N/A') ?></a></div>
        </div>
        <div class="info-card">
          <div class="label">💰 Requested Amount</div>
          <div class="value amount"><?= e($amountText) ?></div>
        </div>
        <div class="info-card">
          <div class="label">📍 Property Location</div>
          <div class="value"><?= e($enquiry['propertyLocation'] ?? 'Not specified') ?></div>
        </div>
        <div class="info-card full-width">
          <div class="label">🆔 Enquiry ID</div>
          <div class="value"><?= e($enquiry['id'] ?? 'N/A') ?></div>
        </div>
      </div>

      <?php if (!empty($enquiry['message'])): ?>
      <div class="notes">
        <div class="label">💬 Customer Notes</div>
        <div class="text">"<?= e($enquiry['message']) ?>"</div>
      </div>
      <?php endif; ?>

      <div class="action-bar">
        <a class="btn btn-call" href="tel:<?= e($enquiry['phone'] ?? '') ?>">📞 Call Customer</a>
        <a class="btn btn-email" href="mailto:<?= e($enquiry['email'] ?? '') ?>">✉️ Send Email</a>
      </div>
    </div>

    <div class="priority-flag">✅ SLA: Call back within 24 working hours — Lead priority: HIGH</div>

    <div class="footer">
      <div class="brand">BLR15 Home Loans — Lead Notification System</div>
      <div><?= e($office['fullAddress']) ?></div>
      <div>Office Hours: <?= e($office['workingHours']) ?></div>
      <div style="margin-top:8px;">Generated automatically — do not reply to this email.</div>
    </div>
  </div>
</body>
</html>
