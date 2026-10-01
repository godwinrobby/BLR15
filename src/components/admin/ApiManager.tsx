import React, { useState, useEffect, useCallback } from 'react';
import {
  Cloud,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Server,
  Database,
  ArrowRight,
} from 'lucide-react';
import { API_V1 } from '../../services/apiClient';
import { syncNowWithApi, getStoredEnquiries, getStoredStaff, formatINR } from '../../services/storageService';

interface HealthData {
  status: string;
  service: string;
  framework?: string;
  environment?: string;
  time?: string;
}

/**
 * Status panel for the Laravel API that backs the whole application.
 * Replaces the former SupabaseManager — connectivity is verified by calling
 * GET /api/v1/health on the same origin the SPA is served from.
 */
export const ApiManager: React.FC = () => {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const runHealthCheck = useCallback(async () => {
    setIsChecking(true);
    setError(null);
    try {
      const res = await fetch(`${API_V1}/health`, { headers: { Accept: 'application/json' } });
      const body = await res.json();
      if (!res.ok || !body?.success) {
        throw new Error(body?.error || `HTTP ${res.status}`);
      }
      setHealth(body.data);
    } catch (e: any) {
      setHealth(null);
      setError(e?.message || 'Connection failed');
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    runHealthCheck();
  }, [runHealthCheck]);

  const handleSyncNow = async () => {
    setIsSyncing(true);
    setMessage(null);
    try {
      const res = await syncNowWithApi();
      setMessage(
        res.success
          ? `Synchronized. Local cache now holds ${res.count} enquiries.`
          : 'Sync failed — the API is unreachable. Local cache retained.'
      );
      await runHealthCheck();
    } finally {
      setIsSyncing(false);
    }
  };

  const localEnquiries = getStoredEnquiries();
  const localStaff = getStoredStaff();

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2">
            <Cloud className="w-3.5 h-3.5 text-emerald-600" />
            <span>Laravel API Integration</span>
          </div>
          <h2 className="text-2xl font-black font-['Outfit'] text-[#0B1B3D]">
            API Server &amp; Data Sync
          </h2>
          <p className="text-xs text-slate-500">
            REST backend powering BLR15 customer enquiries, eligibility records, and staff management.
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

          <button
            onClick={handleSyncNow}
            disabled={isSyncing}
            className="px-3.5 py-2 rounded-xl bg-[#0B1B3D] hover:bg-[#132c5e] text-amber-400 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60 shadow-xs"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="text-xs font-semibold px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Server className="w-4 h-4 text-emerald-600" />
              Server
            </span>
            <span className={`w-2 h-2 rounded-full ${health ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
          </div>
          <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
            {health ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
            <span>{health ? 'Online' : 'Unreachable'}</span>
          </div>
          <p className="text-[11px] text-slate-500 break-all">{API_V1}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Server className="w-4 h-4 text-amber-600" />
            Stack
          </div>
          <div className="font-mono text-xs font-bold text-slate-900 break-all">
            {health?.framework || '—'}
          </div>
          <p className="text-[11px] text-slate-500">
            Environment: <strong className="text-slate-800">{health?.environment || 'unknown'}</strong>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Database className="w-4 h-4 text-emerald-600" />
            Cached Records
          </div>
          <div className="font-mono text-xs font-bold text-slate-900">
            {localEnquiries.length} enquiries · {localStaff.length} staff
          </div>
          <p className="text-[11px] text-slate-500 truncate">
            Latest:{' '}
            {localEnquiries[0]
              ? `${localEnquiries[0].id} · ${formatINR(localEnquiries[0].requiredLoanAmount)}`
              : 'none yet'}
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 text-xs font-semibold px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-red-800">
          <AlertCircle className="w-4 h-4 shrink-0 mt-px" />
          <span>
            Could not reach {API_V1}/health — {error}. The app is still usable; writes are kept in the
            local cache and will be replaced once the API responds.
          </span>
        </div>
      )}
    </div>
  );
};
