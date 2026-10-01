import { HomeLoanEnquiry, EnquiryStatus, FollowUpEntry, StatusHistoryEntry, AdminUser } from '../types';
import { sendEnquiryEmailViaSmtp } from './emailService';
import { apiJson, ApiError } from './apiClient';
import type { ApiListResponse, ApiItemResponse } from './apiClient';

const ENQUIRIES_STORAGE_KEY = 'blr15_enquiries_v1';
const STAFF_STORAGE_KEY = 'blr15_staff_v1';
const SETTINGS_STORAGE_KEY = 'blr15_settings_v1';

/**
 * Local cache of enquiries. The Laravel API is the single source of truth —
 * there is no bundled demo dataset any more, so a cold start is an empty list
 * that refreshEnquiries() repopulates from /api/v1/admin/enquiries.
 */
export const getStoredEnquiries = (): HomeLoanEnquiry[] => {
  try {
    const raw = localStorage.getItem(ENQUIRIES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ENQUIRIES_STORAGE_KEY, '[]');
      return [];
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load enquiries', e);
    return [];
  }
};

export const saveEnquiries = (enquiries: HomeLoanEnquiry[]): void => {
  try {
    localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(enquiries));
    window.dispatchEvent(new CustomEvent('blr15-enquiries-updated'));
  } catch (e) {
    console.error('Failed to save enquiries', e);
  }
};

/** Loads the live enquiry list from /admin/enquiries (JWT) into the local cache. */
export const refreshEnquiries = async (): Promise<HomeLoanEnquiry[]> => {
  try {
    const body = await apiJson<ApiListResponse<HomeLoanEnquiry>>('admin/enquiries');
    if (Array.isArray(body.data)) {
      saveEnquiries(body.data);
      return body.data;
    }
    return getStoredEnquiries();
  } catch (e) {
    console.warn('Live enquiries API unavailable, using local cache:', e);
    return getStoredEnquiries();
  }
};

/** Loads the live staff roster from /api/staff into the local cache. */
export const refreshStaff = async (): Promise<AdminUser[]> => {
  try {
    const body = await apiJson<ApiListResponse<AdminUser>>('admin/staff');
    if (Array.isArray(body.data)) {
      localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(body.data));
      return body.data;
    }
    return getStoredStaff();
  } catch (e) {
    console.warn('Live staff API unavailable, using local cache:', e);
    return getStoredStaff();
  }
};

/** Public (unauthenticated) status lookup via /enquiries/track. */
export const trackEnquiry = async (term: string): Promise<HomeLoanEnquiry | null> => {
  if (!term.trim()) return null;
  try {
    const body = await apiJson<ApiItemResponse<HomeLoanEnquiry>>(
      `enquiries/track?q=${encodeURIComponent(term.trim())}`
    );
    return body.data ?? null;
  } catch (e) {
    console.warn('Track enquiry failed:', e);
    return null;
  }
};

/** Public, PII-free enquiry total for the website "live count" badge. */
export const getPublicEnquiryCount = async (): Promise<number | null> => {
  try {
    const body = await apiJson<{ success: boolean; data: { total: number } }>('enquiries/stats');
    return body.data?.total ?? null;
  } catch {
    return null;
  }
};

/** Places a record at the top of the local cache and notifies listeners. */
const cacheEnquiry = (record: HomeLoanEnquiry): void => {
  const list = getStoredEnquiries().filter(item => item.id !== record.id);
  saveEnquiries([record, ...list]);
};

/** Fire-and-forget SMTP dispatch (parity with the original create flow). */
const dispatchEnquiryEmails = (enquiry: HomeLoanEnquiry): void => {
  sendEnquiryEmailViaSmtp(enquiry).catch(err => {
    console.warn('Asynchronous SMTP email dispatch deferred:', err);
  });
};

/**
 * Pushes a locally computed record to /api/enquiries so every admin session
 * sees the change. Falls back to the local cache when the API is unreachable.
 */
const persistEnquiry = async (record: HomeLoanEnquiry): Promise<HomeLoanEnquiry> => {
  try {
    const body = await apiJson<ApiItemResponse<HomeLoanEnquiry>>(
      `admin/enquiries/${encodeURIComponent(record.id)}`,
      { method: 'PUT', body: JSON.stringify(record) }
    );
    if (body?.data?.id) {
      // Reconcile the cache with the server's canonical copy.
      saveEnquiries(getStoredEnquiries().map(item => (item.id === body.data.id ? body.data : item)));
      return body.data;
    }
    return record;
  } catch (e) {
    console.warn('Enquiry API sync failed (change kept in local cache):', e);
    return record;
  }
};

/** Persists a status transition via PATCH /admin/enquiries/{id}/status. */
const persistStatus = async (
  enquiryId: string,
  status: EnquiryStatus,
  note?: string
): Promise<HomeLoanEnquiry | null> => {
  try {
    const body = await apiJson<ApiItemResponse<HomeLoanEnquiry>>(
      `admin/enquiries/${encodeURIComponent(enquiryId)}/status`,
      { method: 'PATCH', body: JSON.stringify({ status, note }) }
    );
    if (body?.data?.id) {
      saveEnquiries(getStoredEnquiries().map(item => (item.id === body.data.id ? body.data : item)));
      return body.data;
    }
    return null;
  } catch (e) {
    console.warn('Enquiry status API sync failed (change kept in local cache):', e);
    return null;
  }
};

/** True when createEnquiry should continue with the offline/local path. */
const shouldFallbackLocally = (err: unknown): boolean => {
  if (err instanceof ApiError) {
    // 404 = older /api deployment without the data routes; 5xx = server fault.
    // Validation errors (other 4xx) are re-thrown to the caller.
    return err.status === 404 || err.status >= 500;
  }
  return true; // network failure / offline
};

export const generateNextEnquiryId = (): string => {
  const list = getStoredEnquiries();
  const highestNumber = list.reduce((max, item) => {
    const match = item.id.match(/BLR15-(\d+)/);
    if (match) {
      const num = parseInt(match[1], 10);
      return Math.max(max, num);
    }
    return max;
  }, 12); // starts above seed numbers
  const nextNum = highestNumber + 1;
  return `BLR15-${String(nextNum).padStart(4, '0')}`;
};

export const createEnquiry = async (
  enquiryData: Omit<HomeLoanEnquiry, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory' | 'followUps'>
): Promise<HomeLoanEnquiry> => {
  // Live path: persist through the PHP API (server assigns id/timestamps/history).
  try {
    const body = await apiJson<ApiItemResponse<HomeLoanEnquiry>>('enquiries', {
      method: 'POST',
      body: JSON.stringify(enquiryData),
    });
    const created = body.data;
    cacheEnquiry(created);
    dispatchEnquiryEmails(created);
    return created;
  } catch (err) {
    if (!shouldFallbackLocally(err)) throw err;
    console.warn('Live API unavailable, creating enquiry locally:', err);
  }

  // Offline fallback — previous localStorage-only behaviour.
  const newId = generateNextEnquiryId();
  const now = new Date().toISOString();

  const newEnquiry: HomeLoanEnquiry = {
    ...enquiryData,
    id: newId,
    createdAt: now,
    updatedAt: now,
    status: enquiryData.status || 'New',
    statusHistory: [
      {
        status: enquiryData.status || 'New',
        timestamp: now,
        updatedBy: 'Customer / Online System',
        note: `Enquiry submitted via ${enquiryData.source}`,
      },
    ],
    followUps: [],
  };

  cacheEnquiry(newEnquiry);

  // Send proper SMTP confirmation email to customer & alert to admin
  dispatchEnquiryEmails(newEnquiry);

  return newEnquiry;
};

export const updateEnquiryStatus = async (
  enquiryId: string,
  newStatus: EnquiryStatus,
  updatedBy: string,
  note?: string
): Promise<HomeLoanEnquiry | null> => {
  const list = getStoredEnquiries();
  const index = list.findIndex(e => e.id === enquiryId);
  if (index === -1) return null;

  const item = list[index];
  const now = new Date().toISOString();

  const newHistory: StatusHistoryEntry = {
    status: newStatus,
    timestamp: now,
    updatedBy,
    note,
  };

  const updatedItem: HomeLoanEnquiry = {
    ...item,
    status: newStatus,
    updatedAt: now,
    statusHistory: [newHistory, ...item.statusHistory],
  };

  list[index] = updatedItem;
  saveEnquiries(list);

  // Persist through the dedicated status endpoint (server appends history).
  const persisted = await persistStatus(enquiryId, newStatus, note);
  return persisted ?? updatedItem;
};

export const updateEnquiryDetails = async (
  enquiryId: string,
  updates: Partial<HomeLoanEnquiry>,
  updatedBy: string
): Promise<HomeLoanEnquiry | null> => {
  const list = getStoredEnquiries();
  const index = list.findIndex(e => e.id === enquiryId);
  if (index === -1) return null;

  const item = list[index];
  const now = new Date().toISOString();

  const updatedItem: HomeLoanEnquiry = {
    ...item,
    ...updates,
    updatedAt: now,
  };

  list[index] = updatedItem;
  saveEnquiries(list);

  // Persist through the live API so every admin session sees the change
  return persistEnquiry(updatedItem);
};

export const addFollowUpToEnquiry = async (
  enquiryId: string,
  date: string,
  time: string,
  notes: string,
  createdBy: string
): Promise<FollowUpEntry | null> => {
  const list = getStoredEnquiries();
  const index = list.findIndex(e => e.id === enquiryId);
  if (index === -1) return null;

  const newFollowUp: FollowUpEntry = {
    id: `fu-${Date.now()}`,
    enquiryId,
    date,
    time,
    notes,
    createdBy,
    completed: false,
  };

  const item = list[index];
  item.followUps = [newFollowUp, ...(item.followUps || [])];
  item.nextFollowUpDate = date;
  item.nextFollowUpTime = time;
  item.updatedAt = new Date().toISOString();

  list[index] = item;
  saveEnquiries(list);

  // Persist through the dedicated follow-up endpoint.
  try {
    const body = await apiJson<ApiItemResponse<FollowUpEntry>>(
      `admin/enquiries/${encodeURIComponent(enquiryId)}/follow-ups`,
      { method: 'POST', body: JSON.stringify({ date, time, notes }) }
    );
    if (body?.data) return body.data;
  } catch (e) {
    console.warn('Follow-up API sync failed (kept in local cache):', e);
  }
  return newFollowUp;
};

export const deleteEnquiry = async (enquiryId: string): Promise<boolean> => {
  const list = getStoredEnquiries();
  const filtered = list.filter(e => e.id !== enquiryId);
  if (filtered.length === list.length) return false;

  saveEnquiries(filtered);

  try {
    await apiJson(`admin/enquiries/${encodeURIComponent(enquiryId)}`, { method: 'DELETE' });
  } catch (e) {
    console.warn('Enquiry API delete failed (removed from local cache only):', e);
  }
  return true;
};

/** Local cache of the staff roster, populated from /api/v1/admin/staff. */
export const getStoredStaff = (): AdminUser[] => {
  try {
    const raw = localStorage.getItem(STAFF_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STAFF_STORAGE_KEY, '[]');
      return [];
    }
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
};

export const saveStaff = async (staff: AdminUser[]): Promise<void> => {
  try {
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(staff));
  } catch (e) {
    console.error('Failed to save staff', e);
  }

  try {
    await apiJson<ApiListResponse<AdminUser>>('admin/staff/sync', {
      method: 'PUT',
      body: JSON.stringify(staff),
    });
  } catch (e) {
    console.warn('Staff API sync failed (kept in local cache):', e);
  }
};

/**
 * Boot-time warm-up of the Laravel API cache.
 *
 * Replaces the former Supabase realtime subscription: enquiries and staff are
 * pulled from /api/v1 and merged into the local cache. The server is the
 * source of truth, so a successful fetch replaces the cache outright; on
 * failure the local cache is left intact so the SPA still renders offline.
 */
export const initApiSync = async (): Promise<{ connected: boolean; count: number }> => {
  try {
    const list = await refreshEnquiries();
    await refreshStaff();
    console.log(`[API] Synced ${list.length} enquiries from the Laravel API.`);
    return { connected: true, count: list.length };
  } catch (err) {
    console.warn('[API] Sync init error:', err);
    return { connected: false, count: getStoredEnquiries().length };
  }
};

/**
 * Force-refreshes enquiries + staff from the API on demand.
 * Returns success=false when the API is unreachable (local cache retained).
 */
export const syncNowWithApi = async (): Promise<{ success: boolean; count: number }> => {
  try {
    const list = await refreshEnquiries();
    await refreshStaff();
    return { success: true, count: list.length };
  } catch (e) {
    console.warn('Manual API sync failed:', e);
    return { success: false, count: getStoredEnquiries().length };
  }
};

export const formatINR = (amount: number | undefined): string => {
  if (amount === undefined || isNaN(amount)) return '₹0';
  return '₹' + amount.toLocaleString('en-IN');
};

export const calculateHomeLoanEmi = (
  principal: number,
  annualInterestRate: number,
  tenureYears: number
): { emi: number; totalInterest: number; totalPayable: number } => {
  const monthlyRate = annualInterestRate / 12 / 100;
  const totalMonths = tenureYears * 12;

  if (monthlyRate === 0 || totalMonths === 0) {
    return { emi: Math.round(principal / Math.max(1, totalMonths)), totalInterest: 0, totalPayable: principal };
  }

  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  const roundedEmi = Math.round(emi);
  const totalPayable = roundedEmi * totalMonths;
  const totalInterest = totalPayable - principal;

  return {
    emi: roundedEmi,
    totalInterest: Math.max(0, totalInterest),
    totalPayable,
  };
};

export const calculateEligibility = (
  monthlyIncome: number,
  otherIncome: number = 0,
  existingEmi: number = 0,
  otherObligations: number = 0,
  propertyValue: number = 0,
  interestRate: number = 8.5,
  tenureYears: number = 20
) => {
  const totalIncome = monthlyIncome + otherIncome;
  // Maximum allowed EMI by Indian lenders is typically 50% to 60% of net monthly income (FOIR)
  const maxFoirMultiplier = totalIncome > 100000 ? 0.60 : totalIncome > 50000 ? 0.50 : 0.45;
  const totalMaxObligation = totalIncome * maxFoirMultiplier;
  const netAffordableEmi = Math.max(0, totalMaxObligation - existingEmi - otherObligations);

  // Calculate loan amount based on affordable EMI
  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = tenureYears * 12;

  let loanFromIncome = 0;
  if (monthlyRate > 0 && totalMonths > 0) {
    loanFromIncome = (netAffordableEmi * (Math.pow(1 + monthlyRate, totalMonths) - 1)) / 
                     (monthlyRate * Math.pow(1 + monthlyRate, totalMonths));
  }

  // LTV (Loan To Value) cap: Lenders give max 75-80% of property value (up to 90% for < ₹30L)
  const ltvCap = propertyValue > 0 ? (propertyValue <= 3000000 ? 0.90 : 0.80) * propertyValue : Infinity;

  // Final eligible amount is min of income capacity and property LTV
  const eligibleAmount = Math.round(Math.min(loanFromIncome, ltvCap));
  const roundedEligible = Math.max(0, Math.floor(eligibleAmount / 10000) * 10000);

  const emiData = calculateHomeLoanEmi(roundedEligible, interestRate, tenureYears);

  return {
    eligibleAmount: roundedEligible,
    approxEmi: emiData.emi,
    tenureYears,
    interestRate,
    propertyValue,
    maxAffordableEmi: Math.round(netAffordableEmi),
    ltvEligibleAmount: Math.round(ltvCap === Infinity ? 0 : ltvCap),
    incomeEligibleAmount: Math.round(loanFromIncome),
  };
};

export const exportEnquiriesToCSV = (enquiries: HomeLoanEnquiry[]): void => {
  const headers = [
    'Enquiry ID',
    'Customer Name',
    'Mobile',
    'Email',
    'City',
    'Employment Type',
    'Monthly Income',
    'Required Loan Amount',
    'Property Value',
    'Property Type',
    'Location',
    'Status',
    'Assigned Staff',
    'Next Follow-Up',
    'Created Date',
    'Lead Source',
    'Assessed Eligibility',
    'Estimated EMI',
    'Loan-to-Value %',
    'Other Obligations',
    'Existing Bank',
    'Assessment Note',
  ];

  const rows = enquiries.map(e => [
    `"${e.id}"`,
    `"${e.customerName.replace(/"/g, '""')}"`,
    `"${e.mobile}"`,
    `"${e.email}"`,
    `"${e.city}"`,
    `"${e.employmentType}"`,
    e.monthlyIncome,
    e.requiredLoanAmount,
    e.propertyValue,
    `"${e.propertyType}"`,
    `"${(e.propertyLocation || '').replace(/"/g, '""')}"`,
    `"${e.status}"`,
    `"${e.assignedStaff || 'Unassigned'}"`,
    `"${e.nextFollowUpDate || ''} ${e.nextFollowUpTime || ''}"`,
    `"${new Date(e.createdAt).toLocaleDateString()}"`,
    `"${(e.source || '').replace(/"/g, '""')}"`,
    e.estimatedEligibilityAmount ?? '',
    e.estimatedEmi ?? '',
    e.propertyValue
      ? Math.round((e.requiredLoanAmount / e.propertyValue) * 100)
      : '',
    e.otherObligations ?? '',
    `"${(e.existingLoan?.bankName || '').replace(/"/g, '""')}"`,
    `"${(e.message || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `BLR15_Home_Loans_Enquiries_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
