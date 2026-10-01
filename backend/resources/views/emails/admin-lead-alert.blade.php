<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>New BLR15 Home Loan Lead</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;margin:0;padding:0;background-color:#f1f5f9;color:#1e293b;">
  <div style="max-width:650px;margin:20px auto;background-color:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);border:1px solid #e2e8f0;">
    <div style="background:linear-gradient(135deg,#dc2626 0%,#b91c1c 100%);padding:24px 40px;color:white;">
      <h1 style="margin:0;font-size:22px;">🚨 New Home Loan Lead</h1>
      <div style="background-color:rgba(255,255,255,0.2);padding:4px 14px;border-radius:20px;font-size:13px;font-weight:600;display:inline-block;margin-top:8px;">{{ $enquiry['status'] ?? 'New Lead' }}</div>
    </div>

    <div style="background-color:#fef2f2;padding:12px 40px;font-size:13px;color:#991b1b;border-bottom:1px solid #fecaca;">
      <span>Ref: <strong>#{{ $enquiry['id'] ?? 'N/A' }}</strong></span> &nbsp;|&nbsp;
      <span>{{ $timestamp }}</span>
    </div>

    <div style="padding:32px 40px;">
      <div style="font-size:20px;font-weight:700;color:#0B1B3D;margin-bottom:4px;">{{ $enquiry['customerName'] ?? 'New Customer' }}</div>
      <div style="font-size:14px;color:#64748b;margin-bottom:24px;">New {{ $enquiry['loanType'] ?? 'Home Loan' }} enquiry via {{ $enquiry['createdVia'] ?? 'Website Enquiry Form' }}</div>

      <table style="width:100%;border-collapse:separate;border-spacing:12px;margin-bottom:12px;font-size:14px;">
        <tr>
          <td style="background-color:#f8fafc;border:1px solid #e2e8f0;padding:16px;border-radius:8px;">
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#64748b;font-weight:600;margin-bottom:6px;">Customer Name</div>
            <div style="font-size:16px;color:#0B1B3D;font-weight:600;">{{ $enquiry['customerName'] ?? 'N/A' }}</div>
          </td>
          <td style="background-color:#f8fafc;border:1px solid #e2e8f0;padding:16px;border-radius:8px;">
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#64748b;font-weight:600;margin-bottom:6px;">Loan Type</div>
            <div style="font-size:16px;color:#0B1B3D;font-weight:600;">{{ $enquiry['loanType'] ?? 'Home Loan' }}</div>
          </td>
        </tr>
        <tr>
          <td style="background-color:#f8fafc;border:1px solid #e2e8f0;padding:16px;border-radius:8px;">
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#64748b;font-weight:600;margin-bottom:6px;">📧 Email</div>
            <div style="font-size:16px;color:#2563eb;font-weight:600;word-break:break-word;">{{ $enquiry['email'] ?? 'N/A' }}</div>
          </td>
          <td style="background-color:#f8fafc;border:1px solid #e2e8f0;padding:16px;border-radius:8px;">
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#64748b;font-weight:600;margin-bottom:6px;">📱 Phone</div>
            <div style="font-size:16px;color:#2563eb;font-weight:600;">{{ $enquiry['phone'] ?? 'N/A' }}</div>
          </td>
        </tr>
        <tr>
          <td style="background-color:#f8fafc;border:1px solid #e2e8f0;padding:16px;border-radius:8px;">
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#64748b;font-weight:600;margin-bottom:6px;">💰 Requested Amount</div>
            <div style="font-size:20px;color:#059669;font-weight:600;">{{ $amountText }}</div>
          </td>
          <td style="background-color:#f8fafc;border:1px solid #e2e8f0;padding:16px;border-radius:8px;">
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#64748b;font-weight:600;margin-bottom:6px;">📍 Property Location</div>
            <div style="font-size:16px;color:#0B1B3D;font-weight:600;">{{ $enquiry['propertyLocation'] ?? 'Not specified' }}</div>
          </td>
        </tr>
        <tr>
          <td colspan="2" style="background-color:#f8fafc;border:1px solid #e2e8f0;padding:16px;border-radius:8px;">
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#64748b;font-weight:600;margin-bottom:6px;">🆔 Enquiry ID</div>
            <div style="font-size:16px;color:#0B1B3D;font-weight:600;">{{ $enquiry['id'] ?? 'N/A' }}</div>
          </td>
        </tr>
      </table>

      @if (!empty($enquiry['message']))
      <div style="background-color:#fffbeb;border:1px solid #fde68a;padding:16px 20px;border-radius:8px;margin-bottom:24px;">
        <div style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#92400e;font-weight:600;margin-bottom:8px;">💬 Customer Notes</div>
        <div style="font-size:14px;color:#78350f;line-height:1.6;font-style:italic;">"{{ $enquiry['message'] }}"</div>
      </div>
      @endif

      <div style="text-align:center;background-color:#f0fdf4;border-top:1px solid #bbf7d0;border-bottom:1px solid #bbf7d0;padding:12px;font-size:13px;color:#166534;font-weight:600;">✅ SLA: Call back within 24 working hours — Lead priority: HIGH</div>
    </div>

    <div style="padding:20px 40px;text-align:center;font-size:12px;color:#94a3b8;background-color:#f8fafc;">
      <div style="font-weight:bold;color:#0B1B3D;font-size:14px;margin-bottom:6px;">BLR15 Home Loans — Lead Notification System</div>
      <div>{{ $office['fullAddress'] }}</div>
      <div>Office Hours: {{ $office['workingHours'] }}</div>
      <div style="margin-top:8px;">Generated automatically — do not reply to this email.</div>
    </div>
  </div>
</body>
</html>
