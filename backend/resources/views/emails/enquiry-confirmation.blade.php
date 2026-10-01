<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>BLR15 Home Loans Enquiry Confirmation</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;margin:0;padding:0;background-color:#f1f5f9;color:#1e293b;">
  <div style="max-width:600px;margin:20px auto;background-color:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
    <div style="background:linear-gradient(135deg,#0B1B3D 0%,#1e3a8a 100%);padding:30px 40px;color:white;">
      <h1 style="margin:0;font-size:24px;letter-spacing:-0.5px;">BLR15 Home Loans</h1>
      <div style="font-size:14px;color:#93c5fd;margin-top:4px;">Your Dream Home, Our Commitment</div>
    </div>

    <div style="padding:40px;">
      <div style="font-size:18px;font-weight:600;color:#0B1B3D;margin-bottom:16px;">Dear {{ $firstName }},</div>

      <div style="font-size:15px;line-height:1.6;color:#475569;margin-bottom:24px;">
        Thank you for reaching out to <strong>BLR15 Home Loans</strong>! Your enquiry regarding
        <strong>{{ $enquiry['loanType'] ?? 'Home Loan' }}</strong>
        (Reference: <strong>#{{ $enquiry['id'] ?? 'N/A' }}</strong>) has been received by our team.
      </div>

      <div style="background-color:#eff6ff;border:1px solid #bfdbfe;padding:16px 20px;border-radius:8px;margin-bottom:24px;">
        <div style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#64748b;font-weight:600;">Enquiry Reference Number</div>
        <div style="font-size:16px;color:#1e40af;font-family:'Courier New',monospace;font-weight:bold;margin-top:4px;">#{{ $enquiry['id'] ?? 'N/A' }}</div>
      </div>

      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:14px;">
        <tr><th style="background-color:#f8fafc;text-align:left;padding:10px 16px;color:#64748b;font-weight:600;border-bottom:1px solid #e2e8f0;width:40%;">Full Name</th><td style="padding:10px 16px;color:#1e293b;border-bottom:1px solid #f1f5f9;">{{ $enquiry['customerName'] ?? '' }}</td></tr>
        <tr><th style="background-color:#f8fafc;text-align:left;padding:10px 16px;color:#64748b;font-weight:600;border-bottom:1px solid #e2e8f0;">Loan Type</th><td style="padding:10px 16px;color:#1e293b;border-bottom:1px solid #f1f5f9;">{{ $enquiry['loanType'] ?? 'Home Loan' }}</td></tr>
        <tr><th style="background-color:#f8fafc;text-align:left;padding:10px 16px;color:#64748b;font-weight:600;border-bottom:1px solid #e2e8f0;">Loan Amount</th><td style="padding:10px 16px;color:#1e293b;border-bottom:1px solid #f1f5f9;">{{ $amountText }}</td></tr>
        <tr><th style="background-color:#f8fafc;text-align:left;padding:10px 16px;color:#64748b;font-weight:600;border-bottom:1px solid #e2e8f0;">Email Address</th><td style="padding:10px 16px;color:#1e293b;border-bottom:1px solid #f1f5f9;">{{ $enquiry['email'] ?? '' }}</td></tr>
        <tr><th style="background-color:#f8fafc;text-align:left;padding:10px 16px;color:#64748b;font-weight:600;border-bottom:1px solid #e2e8f0;">Phone Number</th><td style="padding:10px 16px;color:#1e293b;border-bottom:1px solid #f1f5f9;">{{ $enquiry['phone'] ?? '' }}</td></tr>
        <tr><th style="background-color:#f8fafc;text-align:left;padding:10px 16px;color:#64748b;font-weight:600;border-bottom:1px solid #e2e8f0;">Submitted On</th><td style="padding:10px 16px;color:#1e293b;border-bottom:1px solid #f1f5f9;">{{ now()->format('d M Y, h:i A') }}</td></tr>
      </table>

      <div style="background-color:#f0fdf4;border:1px solid #bbf7d0;padding:20px 24px;border-radius:8px;margin-bottom:24px;">
        <h3 style="margin:0 0 12px 0;font-size:15px;color:#166534;">What Happens Next?</h3>
        <ol style="margin:0;padding-left:20px;color:#15803d;font-size:14px;line-height:1.8;">
          <li>Our home loan expert will review your enquiry</li>
          <li>You will receive a callback within <strong>24 working hours</strong></li>
          <li>We will discuss eligibility, interest rates &amp; documentation</li>
          <li>Get personalized loan offers from top banks &amp; NBFCs</li>
        </ol>
      </div>

      <div style="background-color:#f8fafc;padding:20px;border-top:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0;">
        <div style="text-align:center;">
          <div>📞 <strong>{{ $office['phone'] }}</strong> — Call Us</div>
          <div>💬 <strong>{{ $office['whatsapp'] }}</strong> — WhatsApp</div>
          <div>✉️ <strong>{{ $office['email'] }}</strong> — Email Us</div>
        </div>
      </div>
    </div>

    <div style="padding:24px 40px;text-align:center;font-size:12px;color:#94a3b8;background-color:#f8fafc;">
      <div style="font-weight:bold;color:#0B1B3D;font-size:14px;margin-bottom:8px;">BLR15 Home Loans</div>
      <div>{{ $office['fullAddress'] }}</div>
      <div>Hours: {{ $office['workingHours'] }}</div>
      <div style="margin-top:12px;">© {{ date('Y') }} BLR15 Home Loans. All rights reserved.</div>
      <div style="background-color:#0B1B3D;color:#93c5fd;padding:6px 14px;border-radius:20px;font-family:'Courier New',monospace;font-size:11px;letter-spacing:2px;display:inline-block;margin-top:8px;">{{ $enquiry['id'] ?? '' }}</div>
    </div>
  </div>
</body>
</html>
