<?php
/** @var array $cfg */
/** @var string $timestamp */
?>
<div style="font-family: sans-serif; max-width: 500px; margin: 20px auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
  <h2 style="color: #0B1B3D; margin-top: 0;">BLR15 Home Loans SMTP Verified</h2>
  <p style="color: #10b981; font-weight: bold;">Connection Successful!</p>
  <p style="font-size: 13px; color: #475569;">
    Your SMTP email delivery service is correctly configured and ready to dispatch customer enquiry confirmations and admin lead alerts.
  </p>
  <div style="background: #f8fafc; padding: 12px; border-radius: 8px; font-size: 12px; font-family: monospace; color: #334155;">
    Host: <?= e($cfg['host']) ?><br>
    Port: <?= e($cfg['port']) ?><br>
    User: <?= e($cfg['user']) ?><br>
    Timestamp: <?= e($timestamp) ?>
  </div>
</div>
