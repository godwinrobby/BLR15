import { HomeLoanEnquiry, EnquiryStatus, FollowUpEntry, StatusHistoryEntry, AdminUser } from '../types';
import { INITIAL_ENQUIRIES, INITIAL_STAFF } from '../data/initialData';
import {
  supabase,
  fetchEnquiriesFromSupabase,
  upsertEnquiryToSupabase,
  deleteEnquiryFromSupabase,
  fetchStaffFromSupabase,
  upsertStaffToSupabase,
  checkSupabaseHealth,
  migrateAllDataToSupabase,
  mapSupabaseToEnquiry,
} from './supabaseClient';

const ENQUIRIES_STORAGE_KEY = 'blr15_enquiries_v1';
const STAFF_STORAGE_KEY = 'blr15_staff_v1';
const SETTINGS_STORAGE_KEY = 'blr15_settings_v1';

let isSyncInitialized = false;

export const getStoredEnquiries = (): HomeLoanEnquiry[] => {
  try {
    const raw = localStorage.getItem(ENQUIRIES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(INITIAL_ENQUIRIES));
      return INITIAL_ENQUIRIES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load enquiries', e);
    return INITIAL_ENQUIRIES;
  }
};

export const saveEnquiries = (enquiries: HomeLoanEnquiry[], syncToCloud: boolean = false): void => {
  try {
    localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(enquiries));
    window.dispatchEvent(new CustomEvent('blr15-enquiries-updated'));

    // Optional background cloud push
    if (syncToCloud) {
      enquiries.forEach(item => {
        upsertEnquiryToSupabase(item).catch(() => {});
      });
    }
  } catch (e) {
    console.error('Failed to save enquiries', e);
  }
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

export const createEnquiry = (enquiryData: Omit<HomeLoanEnquiry, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory' | 'followUps'>): HomeLoanEnquiry => {
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

  const currentList = getStoredEnquiries();
  const updatedList = [newEnquiry, ...currentList];
  saveEnquiries(updatedList);

  // Push to Supabase asynchronously
  upsertEnquiryToSupabase(newEnquiry).catch(err => {
    console.warn('Asynchronous Supabase push deferred:', err);
  });

  return newEnquiry;
};

export const updateEnquiryStatus = (
  enquiryId: string,
  newStatus: EnquiryStatus,
  updatedBy: string,
  note?: string
): HomeLoanEnquiry | null => {
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

  // Sync update to Supabase
  upsertEnquiryToSupabase(updatedItem).catch(err => {
    console.warn('Supabase update failed:', err);
  });

  return updatedItem;
};

export const updateEnquiryDetails = (
  enquiryId: string,
  updates: Partial<HomeLoanEnquiry>,
  updatedBy: string
): HomeLoanEnquiry | null => {
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

  // Sync update to Supabase
  upsertEnquiryToSupabase(updatedItem).catch(err => {
    console.warn('Supabase update failed:', err);
  });

  return updatedItem;
};

export const addFollowUpToEnquiry = (
  enquiryId: string,
  date: string,
  time: string,
  notes: string,
  createdBy: string
): FollowUpEntry | null => {
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

  // Sync update to Supabase
  upsertEnquiryToSupabase(item).catch(err => {
    console.warn('Supabase update failed:', err);
  });

  return newFollowUp;
};

export const deleteEnquiry = (enquiryId: string): boolean => {
  const list = getStoredEnquiries();
  const filtered = list.filter(e => e.id !== enquiryId);
  if (filtered.length === list.length) return false;

  saveEnquiries(filtered);
  deleteEnquiryFromSupabase(enquiryId).catch(err => {
    console.warn('Supabase delete failed:', err);
  });
  return true;
};

export const getStoredStaff = (): AdminUser[] => {
  try {
    const raw = localStorage.getItem(STAFF_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(INITIAL_STAFF));
      return INITIAL_STAFF;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_STAFF;
  }
};

export const saveStaff = (staff: AdminUser[]): void => {
  try {
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(staff));
    staff.forEach(s => {
      upsertStaffToSupabase(s).catch(() => {});
    });
  } catch (e) {
    console.error('Failed to save staff', e);
  }
};

/**
 * Initializes Supabase cloud sync & realtime listener
 */
export const initSupabaseSync = async (): Promise<{ connected: boolean; count: number }> => {
  if (isSyncInitialized) {
    const list = getStoredEnquiries();
    return { connected: true, count: list.length };
  }
  isSyncInitialized = true;

  try {
    // 1. Initial fetch from Supabase
    const cloudEnquiries = await fetchEnquiriesFromSupabase();
    if (cloudEnquiries && cloudEnquiries.length > 0) {
      const localList = getStoredEnquiries();
      
      // Merge strategy: index by ID, cloud takes priority unless local is newer
      const map = new Map<string, HomeLoanEnquiry>();
      localList.forEach(item => map.set(item.id, item));
      cloudEnquiries.forEach(item => map.set(item.id, item));

      const merged = Array.from(map.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      saveEnquiries(merged);
      console.log(`[Supabase] Synced ${cloudEnquiries.length} enquiries from cloud database.`);
    }

    // 2. Initial fetch for staff
    const cloudStaff = await fetchStaffFromSupabase();
    if (cloudStaff && cloudStaff.length > 0) {
      localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(cloudStaff));
    }

    // 3. Realtime subscription to public:enquiries
    try {
      supabase
        .channel('public-enquiries-realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'enquiries' },
          payload => {
            console.log('[Supabase Realtime Event]', payload.eventType);
            if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
              const updatedItem = mapSupabaseToEnquiry(payload.new);
              const list = getStoredEnquiries();
              const existingIdx = list.findIndex(e => e.id === updatedItem.id);
              let newList: HomeLoanEnquiry[];
              if (existingIdx >= 0) {
                newList = [...list];
                newList[existingIdx] = updatedItem;
              } else {
                newList = [updatedItem, ...list];
              }
              saveEnquiries(newList);
            } else if (payload.eventType === 'DELETE') {
              const deletedId = (payload.old as any)?.id;
              if (deletedId) {
                const list = getStoredEnquiries();
                const filtered = list.filter(e => e.id !== deletedId);
                saveEnquiries(filtered);
              }
            }
          }
        )
        .subscribe();
    } catch (realtimeErr) {
      console.warn('Realtime subscription skipped or not supported:', realtimeErr);
    }

    return {
      connected: true,
      count: getStoredEnquiries().length,
    };
  } catch (err) {
    console.warn('[Supabase] Sync init error:', err);
    return {
      connected: false,
      count: getStoredEnquiries().length,
    };
  }
};

export const syncNowWithSupabase = async () => {
  const cloudEnquiries = await fetchEnquiriesFromSupabase();
  if (cloudEnquiries && cloudEnquiries.length > 0) {
    const localList = getStoredEnquiries();
    const map = new Map<string, HomeLoanEnquiry>();
    localList.forEach(item => map.set(item.id, item));
    cloudEnquiries.forEach(item => map.set(item.id, item));

    const merged = Array.from(map.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    saveEnquiries(merged);
    return { success: true, count: merged.length };
  }
  return { success: false, count: getStoredEnquiries().length };
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
