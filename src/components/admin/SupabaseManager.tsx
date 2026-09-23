import React, { useState, useEffect } from 'react';
import {
  Database,
  Cloud,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  UploadCloud,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  Terminal,
  FileCode,
  Sparkles,
} from 'lucide-react';
import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  checkSupabaseHealth,
  SupabaseHealthStatus,
  migrateAllDataToSupabase,
  fetchEnquiriesFromSupabase,
} from '../../services/supabaseClient';
import { getStoredEnquiries, getStoredStaff, syncNowWithSupabase, formatINR } from '../../services/storageService';
import { HomeLoanEnquiry, AdminUser } from '../../types';

export const SupabaseManager: React.FC = () => {
  const [health, setHealth] = useState<SupabaseHealthStatus | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'schema' | 'cloud-data'>('overview');
  const [cloudEnquiries, setCloudEnquiries] = useState<HomeLoanEnquiry[]>([]);

  // Load health check on mount
  const runHealthCheck = async () => {
    setIsChecking(true);
    try {
      const res = await checkSupabaseHealth();
      setHealth(res);
    } catch (e: any) {
      setHealth({
        connected: false,
        url: SUPABASE_URL,
        enquiriesTableExists: false,
        staffTableExists: false,
        enquiryCount: 0,
        staffCount: 0,
        errorMessage: e?.message || 'Connection failed',
        checkedAt: new Date().toISOString(),
      });
    } finally {
      setIsChecking(false);
    }
  };

  const loadCloudData = async () => {
    setIsPulling(true);
    try {
      const data = await fetchEnquiriesFromSupabase();
      if (data) {
        setCloudEnquiries(data);
      }
    } finally {
      setIsPulling(false);
    }
  };

  useEffect(() => {
    runHealthCheck();
  }, []);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(SUPABASE_ANON_KEY);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 3000);
  };

  const sqlSchemaCode = `-- BLR15 HOME LOANS - COMPLETE SUPABASE SCHEMA & SEED MIGRATION
-- Project: https://nlhwqctfdnbghzpjywfr.supabase.co

-- 1. Create enquiries table
CREATE TABLE IF NOT EXISTS public.enquiries (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT NOT NULL,
  dob TEXT,
  city TEXT DEFAULT 'Bangalore',
  employment_type TEXT NOT NULL,
  monthly_income NUMERIC NOT NULL,
  other_income NUMERIC DEFAULT 0,
  existing_emi NUMERIC DEFAULT 0,
  other_obligations NUMERIC DEFAULT 0,
  required_loan_amount NUMERIC NOT NULL,
  property_value NUMERIC NOT NULL,
  property_type TEXT NOT NULL,
  property_location TEXT NOT NULL,
  loan_type TEXT,
  existing_loan JSONB DEFAULT '{}'::jsonb,
  message TEXT,
  source TEXT NOT NULL DEFAULT 'Website Form',
  status TEXT NOT NULL DEFAULT 'New',
  assigned_staff TEXT,
  internal_remarks TEXT,
  next_follow_up_date TEXT,
  next_follow_up_time TEXT,
  estimated_eligibility_amount NUMERIC,
  estimated_emi NUMERIC,
  status_history JSONB DEFAULT '[]'::jsonb,
  follow_ups JSONB DEFAULT '[]'::jsonb,
  raw_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Indexes
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON public.enquiries(created_at DESC);

-- 3. Row Level Security
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon all on enquiries" ON public.enquiries;
CREATE POLICY "Allow anon all on enquiries" ON public.enquiries FOR ALL USING (true);

-- 4. Create staff table
CREATE TABLE IF NOT EXISTS public.staff (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  phone TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon all on staff" ON public.staff;
CREATE POLICY "Allow anon all on staff" ON public.staff FOR ALL USING (true);

-- 5. Create settings table
CREATE TABLE IF NOT EXISTS public.settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon all on settings" ON public.settings;
CREATE POLICY "Allow anon all on settings" ON public.settings FOR ALL USING (true);

-- 6. Seed Staff
INSERT INTO public.staff (id, name, email, role, phone, active)
VALUES
  ('staff-1', 'Rajesh Kumar', 'rajesh.k@blr15.in', 'Super Admin', '+91 98450 15150', true),
  ('staff-2', 'Priya Sharma', 'priya.s@blr15.in', 'Admin', '+91 98452 33410', true),
  ('staff-3', 'Suresh Gowda', 'suresh.g@blr15.in', 'Loan Executive', '+91 99001 88290', true)
ON CONFLICT (id) DO NOTHING;

-- 7. Realtime Enablement
ALTER PUBLICATION supabase_realtime ADD TABLE public.enquiries;`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchemaCode);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handleMigrateAll = async () => {
    setIsMigrating(true);
    setMigrationStatus(null);
    try {
      const localEnquiries = getStoredEnquiries();
      const localStaff = getStoredStaff();
      
      const res = await migrateAllDataToSupabase(localEnquiries, localStaff);
      if (res.success) {
        setMigrationStatus({
          success: true,
          message: `Successfully migrated ${res.enquiriesMigrated} enquiries and ${res.staffMigrated} staff members to Supabase!`,
        });
        await runHealthCheck();
      } else {
        setMigrationStatus({
          success: false,
          message: res.error || 'Migration failed. Ensure the SQL schema has been created in Supabase.',
        });
      }
    } catch (e: any) {
      setMigrationStatus({
        success: false,
        message: e?.message || 'Migration encountered an error.',
      });
    } finally {
      setIsMigrating(false);
    }
  };

  const handleSyncNow = async () => {
    setIsPulling(true);
    try {
      const res = await syncNowWithSupabase();
      await runHealthCheck();
      alert(`Synchronized! Local cache now contains ${res.count} enquiries aligned with cloud database.`);
    } finally {
      setIsPulling(false);
    }
  };

  const localEnquiriesCount = getStoredEnquiries().length;
  const localStaffCount = getStoredStaff().length;

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2">
            <Cloud className="w-3.5 h-3.5 text-emerald-600" />
            <span>Supabase Cloud Integration Active</span>
          </div>
          <h2 className="text-2xl font-black font-['Outfit'] text-[#0B1B3D]">
            Supabase Cloud Database & Data Migration
          </h2>
          <p className="text-xs text-slate-500">
            Real-time PostgreSQL backend powering BLR15 customer enquiries, eligibility records, and staff management.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={runHealthCheck}
            disabled={isChecking}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin text-amber-600' : ''}`} />
            <span>{isChecking ? 'Checking...' : 'Check Connection'}</span>
          </button>

          <a
            href="https://supabase.com/dashboard/project/nlhwqctfdnbghzpjywfr/sql/new"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-[#0B1B3D] hover:bg-[#132c5e] text-amber-400 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Supabase SQL Editor</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Connection & Configuration Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Project Endpoint */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Database className="w-4 h-4 text-emerald-600" />
              Project Endpoint
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="font-mono font-bold text-xs text-slate-900 truncate bg-slate-50 p-2 rounded-lg border border-slate-200">
            {SUPABASE_URL}
          </div>
          <p className="text-[11px] text-slate-500">
            Connected to project <strong className="text-slate-800">nlhwqctfdnbghzpjywfr</strong>.
          </p>
        </div>

        {/* Card 2: Publishable API Key */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              Publishable Anon Key
            </span>
            <button
              onClick={handleCopyKey}
              className="text-amber-600 hover:text-amber-700 flex items-center gap-1 text-[11px] font-bold cursor-pointer"
            >
              {copiedKey ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copiedKey ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="font-mono text-xs text-slate-600 truncate bg-slate-50 p-2 rounded-lg border border-slate-200">
            {SUPABASE_ANON_KEY.substring(0, 18)}••••••••••••••••
          </div>
          <p className="text-[11px] text-slate-500">
            Client-side RLS authenticated key for secure web & mobile access.
          </p>
        </div>

        {/* Card 3: Cloud Database Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-purple-600" />
              Table Schema Status
            </span>
            {health?.enquiriesTableExists ? (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                READY
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black">
                SETUP NEEDED
              </span>
            )}
          </div>
          <div className="text-xs space-y-1 bg-slate-50 p-2 rounded-lg border border-slate-200">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Enquiries Table:</span>
              <span className={`font-bold ${health?.enquiriesTableExists ? 'text-emerald-700' : 'text-amber-600'}`}>
                {health?.enquiriesTableExists ? `Online (${health.enquiryCount} rows)` : 'Pending Creation'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Staff Table:</span>
              <span className={`font-bold ${health?.staffTableExists ? 'text-emerald-700' : 'text-amber-600'}`}>
                {health?.staffTableExists ? `Online (${health.staffCount} rows)` : 'Pending Creation'}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500">
            Realtime WebSocket listener enabled on table: <code className="text-slate-800">public.enquiries</code>.
          </p>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-gradient-to-r from-[#0B1B3D] via-[#112756] to-[#0A1835] text-white p-6 rounded-3xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              One-Click Full Migration
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black font-['Outfit'] text-white">
            Migrate All Details & Sync Live with Supabase
          </h3>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Uploads all {localEnquiriesCount} enquiries (including customer personal details, income, property info, follow-up logs, and status history) plus {localStaffCount} staff accounts straight to your Supabase cloud PostgreSQL database.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            onClick={handleMigrateAll}
            disabled={isMigrating}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <UploadCloud className={`w-4 h-4 ${isMigrating ? 'animate-bounce' : ''}`} />
            <span>{isMigrating ? 'Migrating Data...' : 'Migrate All Data to Supabase'}</span>
          </button>

          <button
            onClick={handleSyncNow}
            disabled={isPulling}
            className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isPulling ? 'animate-spin' : ''}`} />
            <span>Sync from Cloud</span>
          </button>
        </div>
      </div>

      {/* Migration Feedback Banner */}
      {migrationStatus && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-start gap-3 ${
            migrationStatus.success
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-amber-50 border-amber-300 text-amber-900'
          }`}
        >
          {migrationStatus.success ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <p className="font-bold">{migrationStatus.message}</p>
            {!migrationStatus.success && (
              <p className="text-[11px] text-amber-800 font-normal">
                Tip: Copy the SQL Schema below, paste it into the Supabase SQL Editor, and click RUN. Then click "Migrate All Data to Supabase" again.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-4">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 text-xs font-bold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'border-amber-500 text-[#0B1B3D]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Setup Instructions & Architecture</span>
        </button>

        <button
          onClick={() => setActiveTab('schema')}
          className={`pb-3 text-xs font-bold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
            activeTab === 'schema'
              ? 'border-amber-500 text-[#0B1B3D]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>SQL Schema & RLS Policies</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('cloud-data');
            loadCloudData();
          }}
          className={`pb-3 text-xs font-bold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
            activeTab === 'cloud-data'
              ? 'border-amber-500 text-[#0B1B3D]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Live Cloud Data Inspector</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & INSTRUCTIONS */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 font-black text-sm flex items-center justify-center">
              1
            </div>
            <h4 className="font-bold text-base text-[#0B1B3D] font-['Outfit']">
              Create PostgreSQL Tables
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Open the <strong>SQL Schema</strong> tab or click the button below to copy the complete DDL script. It configures the <code className="text-amber-700 bg-amber-50 px-1 py-0.5 rounded">enquiries</code> and <code className="text-amber-700 bg-amber-50 px-1 py-0.5 rounded">staff</code> tables with indexes and RLS policies.
            </p>
            <button
              onClick={handleCopySql}
              className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? 'Schema Copied to Clipboard!' : 'Copy SQL Schema (1-Click)'}</span>
            </button>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-900 font-black text-sm flex items-center justify-center">
              2
            </div>
            <h4 className="font-bold text-base text-[#0B1B3D] font-['Outfit']">
              Run Script in Supabase
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Go to your Supabase project dashboard, open <strong>SQL Editor</strong>, paste the script into a new query, and click <strong>RUN</strong>. The tables, RLS policies, and initial seeds will be created instantly.
            </p>
            <a
              href="https://supabase.com/dashboard/project/nlhwqctfdnbghzpjywfr/sql/new"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-blue-200"
            >
              <span>Open Supabase SQL Editor</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-900 font-black text-sm flex items-center justify-center">
              3
            </div>
            <h4 className="font-bold text-base text-[#0B1B3D] font-['Outfit']">
              Automatic Realtime Sync
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Once tables are created, every customer application submitted on the website or mobile app writes directly to Supabase and broadcasts updates via Realtime WebSockets to all advisors!
            </p>
            <button
              onClick={handleMigrateAll}
              disabled={isMigrating}
              className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>{isMigrating ? 'Migrating...' : 'Run Migration Now'}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: SQL SCHEMA & RLS POLICIES */}
      {activeTab === 'schema' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-mono font-bold text-white">supabase-schema.sql</span>
            </div>
            <button
              onClick={handleCopySql}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? 'Copied!' : 'Copy SQL'}</span>
            </button>
          </div>
          <div className="p-6 bg-slate-950 overflow-x-auto">
            <pre className="text-xs font-mono text-slate-300 leading-relaxed">
              {sqlSchemaCode}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 3: CLOUD DATA INSPECTOR */}
      {activeTab === 'cloud-data' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-[#0B1B3D] font-['Outfit']">
                Cloud Table Records (Supabase)
              </h3>
              <p className="text-xs text-slate-500">
                Direct view of rows currently stored in your PostgreSQL cloud database.
              </p>
            </div>
            <button
              onClick={loadCloudData}
              disabled={isPulling}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPulling ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {cloudEnquiries.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
              <Database className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-700">No records fetched yet from Supabase</p>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                If you have already executed the SQL schema in Supabase, click <strong>"Migrate All Data to Supabase"</strong> above to upload your enquiries.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-900 uppercase font-bold text-[10px] tracking-wider border-y border-slate-200">
                  <tr>
                    <th className="py-3 px-3">Enquiry ID</th>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Mobile</th>
                    <th className="py-3 px-3">Loan Amount</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Assigned Staff</th>
                    <th className="py-3 px-3">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {cloudEnquiries.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-[#0B1B3D]">{item.id}</td>
                      <td className="py-3 px-3 font-semibold text-slate-900">{item.customerName}</td>
                      <td className="py-3 px-3">{item.mobile}</td>
                      <td className="py-3 px-3 font-bold text-amber-600">{formatINR(item.requiredLoanAmount)}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-3">{item.assignedStaff || 'Unassigned'}</td>
                      <td className="py-3 px-3 text-slate-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
