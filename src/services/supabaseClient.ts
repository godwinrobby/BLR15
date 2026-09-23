import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { HomeLoanEnquiry, AdminUser, EnquiryStatus, FollowUpEntry, StatusHistoryEntry } from '../types';
import { INITIAL_ENQUIRIES, INITIAL_STAFF } from '../data/initialData';

// User provided credentials as defaults with environment overrides
export const SUPABASE_URL = 
  import.meta.env.VITE_SUPABASE_URL || 'https://nlhwqctfdnbghzpjywfr.supabase.co';

export const SUPABASE_ANON_KEY = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Z3WJb0ulTHayY-vfUqnPUQ_RVE3jLfa';

// Initialize Supabase Client
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export interface SupabaseHealthStatus {
  connected: boolean;
  url: string;
  enquiriesTableExists: boolean;
  staffTableExists: boolean;
  enquiryCount: number;
  staffCount: number;
  errorMessage?: string;
  checkedAt: string;
}

/**
 * Checks Supabase connectivity and table presence
 */
export async function checkSupabaseHealth(): Promise<SupabaseHealthStatus> {
  const result: SupabaseHealthStatus = {
    connected: false,
    url: SUPABASE_URL,
    enquiriesTableExists: false,
    staffTableExists: false,
    enquiryCount: 0,
    staffCount: 0,
    checkedAt: new Date().toISOString(),
  };

  try {
    // Check enquiries table
    const { data: eqData, error: eqErr, count: eqCount } = await supabase
      .from('enquiries')
      .select('id', { count: 'exact' })
      .limit(1);

    if (!eqErr) {
      result.connected = true;
      result.enquiriesTableExists = true;
      result.enquiryCount = eqCount || (eqData ? eqData.length : 0);
    } else {
      result.errorMessage = eqErr.message;
    }

    // Check staff table
    const { data: stData, error: stErr, count: stCount } = await supabase
      .from('staff')
      .select('id', { count: 'exact' })
      .limit(1);

    if (!stErr) {
      result.connected = true;
      result.staffTableExists = true;
      result.staffCount = stCount || (stData ? stData.length : 0);
    }
  } catch (err: any) {
    result.errorMessage = err?.message || 'Network error connecting to Supabase';
  }

  return result;
}

/**
 * Maps a HomeLoanEnquiry object to Supabase database columns
 */
export function mapEnquiryToSupabase(item: HomeLoanEnquiry): Record<string, any> {
  return {
    id: item.id,
    customer_name: item.customerName,
    mobile: item.mobile,
    email: item.email,
    dob: item.dob || null,
    city: item.city || 'Bangalore',
    employment_type: item.employmentType,
    monthly_income: item.monthlyIncome || 0,
    other_income: item.otherIncome || 0,
    existing_emi: item.existingEmi || 0,
    other_obligations: item.otherObligations || 0,
    required_loan_amount: item.requiredLoanAmount || 0,
    property_value: item.propertyValue || 0,
    property_type: item.propertyType,
    property_location: item.propertyLocation,
    loan_type: item.loanType || null,
    existing_loan: item.existingLoan || {},
    message: item.message || null,
    source: item.source || 'Website Form',
    status: item.status || 'New',
    assigned_staff: item.assignedStaff || null,
    internal_remarks: item.internalRemarks || null,
    next_follow_up_date: item.nextFollowUpDate || null,
    next_follow_up_time: item.nextFollowUpTime || null,
    estimated_eligibility_amount: item.estimatedEligibilityAmount || null,
    estimated_emi: item.estimatedEmi || null,
    status_history: item.statusHistory || [],
    follow_ups: item.followUps || [],
    raw_data: item,
    created_at: item.createdAt || new Date().toISOString(),
    updated_at: item.updatedAt || new Date().toISOString(),
  };
}

/**
 * Maps a Supabase row back to the TypeScript HomeLoanEnquiry interface
 */
export function mapSupabaseToEnquiry(row: any): HomeLoanEnquiry {
  // If raw_data was stored and has properties, merge it as baseline
  const base = row.raw_data && typeof row.raw_data === 'object' ? row.raw_data : {};

  return {
    ...base,
    id: row.id,
    customerName: row.customer_name || row.customerName || base.customerName || 'Customer',
    mobile: row.mobile || base.mobile || '',
    email: row.email || base.email || '',
    dob: row.dob || base.dob,
    city: row.city || base.city || 'Bangalore',
    employmentType: row.employment_type || row.employmentType || base.employmentType || 'Salaried',
    monthlyIncome: Number(row.monthly_income ?? row.monthlyIncome ?? base.monthlyIncome ?? 0),
    otherIncome: Number(row.other_income ?? row.otherIncome ?? base.otherIncome ?? 0),
    existingEmi: Number(row.existing_emi ?? row.existingEmi ?? base.existingEmi ?? 0),
    otherObligations: Number(row.other_obligations ?? row.otherObligations ?? base.otherObligations ?? 0),
    requiredLoanAmount: Number(row.required_loan_amount ?? row.requiredLoanAmount ?? base.requiredLoanAmount ?? 0),
    propertyValue: Number(row.property_value ?? row.propertyValue ?? base.propertyValue ?? 0),
    propertyType: row.property_type || row.propertyType || base.propertyType || 'Apartment',
    propertyLocation: row.property_location || row.propertyLocation || base.propertyLocation || 'Bangalore',
    loanType: row.loan_type || row.loanType || base.loanType,
    existingLoan: row.existing_loan || row.existingLoan || base.existingLoan || {},
    message: row.message || base.message,
    source: row.source || base.source || 'Website Form',
    status: (row.status || base.status || 'New') as EnquiryStatus,
    assignedStaff: row.assigned_staff || row.assignedStaff || base.assignedStaff,
    internalRemarks: row.internal_remarks || row.internalRemarks || base.internalRemarks,
    nextFollowUpDate: row.next_follow_up_date || row.nextFollowUpDate || base.nextFollowUpDate,
    nextFollowUpTime: row.next_follow_up_time || row.nextFollowUpTime || base.nextFollowUpTime,
    estimatedEligibilityAmount: row.estimated_eligibility_amount ?? base.estimatedEligibilityAmount,
    estimatedEmi: row.estimated_emi ?? base.estimatedEmi,
    createdAt: row.created_at || base.createdAt || new Date().toISOString(),
    updatedAt: row.updated_at || base.updatedAt || new Date().toISOString(),
    statusHistory: Array.isArray(row.status_history) ? row.status_history : (base.statusHistory || []),
    followUps: Array.isArray(row.follow_ups) ? row.follow_ups : (base.followUps || []),
  };
}

/**
 * Fetch all enquiries from Supabase
 */
export async function fetchEnquiriesFromSupabase(): Promise<HomeLoanEnquiry[] | null> {
  try {
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetchEnquiries error:', error.message);
      return null;
    }

    if (!data) return [];
    return data.map(mapSupabaseToEnquiry);
  } catch (e) {
    console.warn('Supabase fetchEnquiries exception:', e);
    return null;
  }
}

/**
 * Insert or update an enquiry in Supabase
 */
export async function upsertEnquiryToSupabase(enquiry: HomeLoanEnquiry): Promise<boolean> {
  try {
    const payload = mapEnquiryToSupabase(enquiry);
    const { error } = await supabase
      .from('enquiries')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase upsertEnquiry error:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('Supabase upsertEnquiry exception:', e);
    return false;
  }
}

/**
 * Delete an enquiry from Supabase
 */
export async function deleteEnquiryFromSupabase(enquiryId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('enquiries')
      .delete()
      .eq('id', enquiryId);

    if (error) {
      console.warn('Supabase deleteEnquiry error:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('Supabase deleteEnquiry exception:', e);
    return false;
  }
}

/**
 * Fetch all staff from Supabase
 */
export async function fetchStaffFromSupabase(): Promise<AdminUser[] | null> {
  try {
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .order('name');

    if (error) {
      console.warn('Supabase fetchStaff error:', error.message);
      return null;
    }

    if (!data || data.length === 0) return null;
    return data.map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
      phone: row.phone,
      active: row.active ?? true,
    }));
  } catch (e) {
    console.warn('Supabase fetchStaff exception:', e);
    return null;
  }
}

/**
 * Upsert staff member in Supabase
 */
export async function upsertStaffToSupabase(staff: AdminUser): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('staff')
      .upsert({
        id: staff.id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        phone: staff.phone,
        active: staff.active,
      }, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase upsertStaff error:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('Supabase upsertStaff exception:', e);
    return false;
  }
}

/**
 * Performs complete migration of all local enquiries and staff into Supabase
 */
export async function migrateAllDataToSupabase(
  enquiriesToMigrate: HomeLoanEnquiry[],
  staffToMigrate: AdminUser[]
): Promise<{ success: boolean; enquiriesMigrated: number; staffMigrated: number; error?: string }> {
  try {
    let enquiriesMigrated = 0;
    let staffMigrated = 0;

    // 1. Migrate Staff
    if (staffToMigrate.length > 0) {
      const staffPayload = staffToMigrate.map(s => ({
        id: s.id,
        name: s.name,
        email: s.email,
        role: s.role,
        phone: s.phone,
        active: s.active,
      }));

      const { error: staffErr } = await supabase
        .from('staff')
        .upsert(staffPayload, { onConflict: 'id' });

      if (staffErr) {
        throw new Error(`Failed to migrate staff: ${staffErr.message}`);
      }
      staffMigrated = staffToMigrate.length;
    }

    // 2. Migrate Enquiries
    if (enquiriesToMigrate.length > 0) {
      const enquiryPayload = enquiriesToMigrate.map(mapEnquiryToSupabase);
      const { error: enquiryErr } = await supabase
        .from('enquiries')
        .upsert(enquiryPayload, { onConflict: 'id' });

      if (enquiryErr) {
        throw new Error(`Failed to migrate enquiries: ${enquiryErr.message}`);
      }
      enquiriesMigrated = enquiriesToMigrate.length;
    }

    return {
      success: true,
      enquiriesMigrated,
      staffMigrated,
    };
  } catch (err: any) {
    return {
      success: false,
      enquiriesMigrated: 0,
      staffMigrated: 0,
      error: err?.message || 'Migration failed',
    };
  }
}
