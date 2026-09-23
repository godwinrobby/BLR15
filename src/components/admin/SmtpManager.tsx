import React, { useState, useEffect } from 'react';
import {
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Server,
  ShieldCheck,
  Lock,
  User,
  Inbox,
  Sparkles,
  Info,
} from 'lucide-react';
import {
  getSmtpConfigStatus,
  saveSmtpSettings,
  testSmtpConnection,
  SmtpConfigResponse,
} from '../../services/emailService';

export const SmtpManager: React.FC = () => {
  const [config, setConfig] = useState<SmtpConfigResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  // Form fields
  const [host, setHost] = useState('smtp.gmail.com');
  const [port, setPort] = useState(587);
  const [secure, setSecure] = useState(false);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [from, setFrom] = useState('"BLR15 Home Loans" <contact@blr15homeloans.com>');
  const [adminEmail, setAdminEmail] = useState('godwinrobby1985@gmail.com');

  // Test modal/feedback
  const [testEmail, setTestEmail] = useState('godwinrobby1985@gmail.com');
  const [testResult, setTestResult] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const loadConfig = async () => {
    setIsLoading(true);
    try {
      const data = await getSmtpConfigStatus();
      if (data) {
        setConfig(data);
        if (data.host) setHost(data.host);
        if (data.port) setPort(data.port);
        setSecure(data.secure);
        if (data.user) setUser(data.user);
        if (data.from) setFrom(data.from);
        if (data.adminEmail) {
          setAdminEmail(data.adminEmail);
          setTestEmail(data.adminEmail);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const res = await saveSmtpSettings({
        host,
        port: Number(port),
        secure,
        user,
        pass: pass || undefined,
        from,
        adminEmail,
      });

      if (res.success) {
        setSaveSuccess(true);
        await loadConfig();
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        alert(res.error || 'Failed to save SMTP settings');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = async () => {
    if (!testEmail) {
      alert('Please enter a recipient email for testing.');
      return;
    }
    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await testSmtpConnection({
        host,
        port: Number(port),
        secure,
        user,
        pass,
        from,
        toEmail: testEmail,
      });

      setTestResult({
        success: res.success,
        message: res.message || res.error,
      });
    } catch (e: any) {
      setTestResult({
        success: false,
        message: e?.message || 'SMTP test execution failed',
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider mb-2">
            <Mail className="w-3.5 h-3.5 text-blue-600" />
            <span>SMTP Automated Email System</span>
          </div>
          <h2 className="text-2xl font-black font-['Outfit'] text-[#0B1B3D]">
            SMTP Email Delivery & Lead Alerts
          </h2>
          <p className="text-xs text-slate-500">
            Automatically sends branded enquiry confirmations to customers and urgent notification emails to advisors.
          </p>
        </div>

        <button
          onClick={loadConfig}
          disabled={isLoading}
          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-600' : ''}`} />
          <span>Refresh Config</span>
        </button>
      </div>

      {/* Status Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Server className="w-4 h-4 text-blue-600" />
              Delivery Server
            </span>
            {config?.configured ? (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                ACTIVE
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black">
                SIMULATION MODE
              </span>
            )}
          </div>
          <div className="font-mono text-xs font-bold text-slate-900 bg-slate-50 p-2 rounded-lg border border-slate-200 truncate">
            {host}:{port}
          </div>
          <p className="text-[11px] text-slate-500">
            {config?.configured
              ? 'Configured with authenticated SMTP credentials.'
              : 'Using local simulated SMTP (add credentials below for live delivery).'}
          </p>
        </div>

        {/* Customer Acknowledgements */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Inbox className="w-4 h-4 text-emerald-600" />
              Customer Template
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-xs font-bold text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-200">
            Branded HTML Confirmation
          </div>
          <p className="text-[11px] text-slate-500">
            Sent automatically upon any website or mobile loan enquiry with Reference ID.
          </p>
        </div>

        {/* Admin Lead Alerts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              Admin Alert Recipient
            </span>
          </div>
          <div className="font-mono text-xs font-bold text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-200 truncate">
            {adminEmail || 'godwinrobby1985@gmail.com'}
          </div>
          <p className="text-[11px] text-slate-500">
            Receives real-time lead dossiers with loan amount and customer contact info.
          </p>
        </div>
      </div>

      {/* Main Settings Form & Live Tester */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form: 2 Cols */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-[#0B1B3D] font-['Outfit']">
                SMTP Server Credentials
              </h3>
              <p className="text-xs text-slate-500">
                Configure your mail server (Gmail, Outlook, Amazon SES, SendGrid, or custom host).
              </p>
            </div>
            {saveSuccess && (
              <span className="flex items-center gap-1 text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Saved successfully!</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Host */}
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700">SMTP Host / Server</label>
                <input
                  type="text"
                  value={host}
                  onChange={e => setHost(e.target.value)}
                  placeholder="smtp.gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:border-amber-500 focus:outline-hidden"
                  required
                />
              </div>

              {/* Port */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Port</label>
                <input
                  type="number"
                  value={port}
                  onChange={e => setPort(Number(e.target.value))}
                  placeholder="587"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:border-amber-500 focus:outline-hidden"
                  required
                />
              </div>
            </div>

            {/* Secure SSL checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="secureSSL"
                checked={secure}
                onChange={e => setSecure(e.target.checked)}
                className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-400 cursor-pointer"
              />
              <label htmlFor="secureSSL" className="text-xs font-medium text-slate-700 cursor-pointer">
                Use Secure SSL / TLS (typically Port 465)
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Username */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">SMTP Username / Email</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={user}
                    onChange={e => setUser(e.target.value)}
                    placeholder="e.g. godwinrobby1985@gmail.com"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">SMTP Password / App Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={pass}
                    onChange={e => setPass(e.target.value)}
                    placeholder={config?.configured ? '•••••••••••••••• (Leave blank to keep)' : 'Enter password or App Password'}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* From Name / Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Sender "From" Header</label>
                <input
                  type="text"
                  value={from}
                  onChange={e => setFrom(e.target.value)}
                  placeholder='"BLR15 Home Loans" <contact@blr15.in>'
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              {/* Admin Recipient Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Admin Lead Alert Recipient</label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={e => setAdminEmail(e.target.value)}
                  placeholder="godwinrobby1985@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-amber-500 focus:outline-hidden"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-3 rounded-xl bg-[#0B1B3D] hover:bg-[#152e64] text-amber-400 text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                <span>{isSaving ? 'Saving...' : 'Save SMTP Settings'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Test Tool: 1 Col */}
        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-base text-[#0B1B3D] font-['Outfit']">
              Live Test Email Tool
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Verify your SMTP connection immediately by sending a live test email to any inbox.
          </p>

          <div className="space-y-3 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Test Recipient Email</label>
              <input
                type="email"
                value={testEmail}
                onChange={e => setTestEmail(e.target.value)}
                placeholder="godwinrobby1985@gmail.com"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs focus:border-amber-500 focus:outline-hidden"
              />
            </div>

            <button
              onClick={handleTest}
              disabled={isTesting}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Send className={`w-3.5 h-3.5 ${isTesting ? 'animate-bounce' : ''}`} />
              <span>{isTesting ? 'Testing Connection...' : 'Send Test Email Now'}</span>
            </button>
          </div>

          {/* Test Feedback */}
          {testResult && (
            <div
              className={`p-4 rounded-2xl border text-xs space-y-1 ${
                testResult.success
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-red-50 border-red-300 text-red-900'
              }`}
            >
              <div className="flex items-center gap-2 font-bold">
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{testResult.success ? 'Success!' : 'Delivery Failed'}</span>
              </div>
              <p className="text-[11px] leading-relaxed break-words font-normal">
                {testResult.message}
              </p>
            </div>
          )}

          {/* Quick Guide */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs space-y-2 text-slate-600">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Info className="w-4 h-4 text-amber-500" />
              <span>Gmail SMTP Setup Tip</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              If using a Google Account (Gmail / Workspace):
            </p>
            <ol className="text-[11px] list-decimal list-inside space-y-1 text-slate-500">
              <li>Enable 2-Step Verification in Google Account.</li>
              <li>Generate an <strong>App Password</strong> (16 letters).</li>
              <li>Paste the App Password in the Password field above.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
