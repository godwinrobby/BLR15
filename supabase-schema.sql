-- ==============================================================================
-- BLR15 HOME LOANS - COMPLETE SUPABASE DATABASE SCHEMA & INITIAL MIGRATION
-- Project: https://nlhwqctfdnbghzpjywfr.supabase.co
-- ==============================================================================
-- Instructions:
-- 1. Open Supabase Dashboard: https://supabase.com/dashboard/project/nlhwqctfdnbghzpjywfr
-- 2. Click "SQL Editor" in the left menu.
-- 3. Click "New Query", paste this entire script, and click "RUN".
-- ==============================================================================

-- 1. Enable pgcrypto (standard in Supabase)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. CREATE TABLE: enquiries
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

-- Index frequently queried fields
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON public.enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enquiries_mobile ON public.enquiries(mobile);
CREATE INDEX IF NOT EXISTS idx_enquiries_assigned_staff ON public.enquiries(assigned_staff);

-- Enable Row Level Security (RLS)
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Allow anon read enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Allow anon insert enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Allow anon update enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Allow anon delete enquiries" ON public.enquiries;

-- RLS Policies for full anonymous/authenticated access
CREATE POLICY "Allow anon read enquiries" ON public.enquiries FOR SELECT USING (true);
CREATE POLICY "Allow anon insert enquiries" ON public.enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update enquiries" ON public.enquiries FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete enquiries" ON public.enquiries FOR DELETE USING (true);


-- 3. CREATE TABLE: staff
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


-- 4. CREATE TABLE: settings
CREATE TABLE IF NOT EXISTS public.settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon all on settings" ON public.settings;
CREATE POLICY "Allow anon all on settings" ON public.settings FOR ALL USING (true);


-- 5. CREATE TABLE: audit_logs (tracks status changes and CRM notes)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id BIGSERIAL PRIMARY KEY,
  enquiry_id TEXT REFERENCES public.enquiries(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  performed_by TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon all on audit_logs" ON public.audit_logs;
CREATE POLICY "Allow anon all on audit_logs" ON public.audit_logs FOR ALL USING (true);


-- ==============================================================================
-- 6. SEED INITIAL STAFF
-- ==============================================================================
INSERT INTO public.staff (id, name, email, role, phone, active)
VALUES
  ('staff-1', 'Rajesh Kumar', 'rajesh.k@blr15.in', 'Super Admin', '+91 98450 15150', true),
  ('staff-2', 'Priya Sharma', 'priya.s@blr15.in', 'Admin', '+91 98452 33410', true),
  ('staff-3', 'Suresh Gowda', 'suresh.g@blr15.in', 'Loan Executive', '+91 99001 88290', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  phone = EXCLUDED.phone,
  active = EXCLUDED.active;


-- ==============================================================================
-- 7. SEED INITIAL ENQUIRIES (BLR15-0001 to BLR15-0012)
-- ==============================================================================
INSERT INTO public.enquiries (
  id, customer_name, mobile, email, dob, city, employment_type,
  monthly_income, other_income, existing_emi, other_obligations,
  required_loan_amount, property_value, property_type, property_location,
  loan_type, existing_loan, message, source, status, assigned_staff,
  internal_remarks, next_follow_up_date, next_follow_up_time,
  estimated_eligibility_amount, estimated_emi, status_history, follow_ups, created_at, updated_at
)
VALUES
  (
    'BLR15-0012', 'Karthik Venkatesh', '+91 98451 22340', 'karthik.v@gmail.com', '1988-06-14',
    'Bangalore', 'Salaried', 145000, 15000, 18000, 5000, 6500000, 8500000, 'Apartment',
    'Jalahalli West, Bangalore', 'Home Purchase Loan', '{"hasExistingLoan": true, "existingLoanAmount": 1200000, "currentEmi": 18000}'::jsonb,
    'Need approval in 2 weeks for Prestige apartment booking in Jalahalli West.', 'Eligibility Wizard',
    'New', 'Priya Sharma', 'Verified documents required. High CIBIL score expected.', '2026-09-24', '11:00 AM',
    7200000, 61500,
    '[{"status": "New", "timestamp": "2026-09-21T09:15:00.000Z", "updatedBy": "System", "note": "Generated from Online Eligibility Wizard"}]'::jsonb,
    '[{"id": "fu-1", "enquiryId": "BLR15-0012", "date": "2026-09-24", "time": "11:00 AM", "notes": "Call customer to collect 3 months salary slips and Form 16", "createdBy": "Priya Sharma", "completed": false}]'::jsonb,
    '2026-09-21T09:15:00.000Z', '2026-09-21T09:15:00.000Z'
  ),
  (
    'BLR15-0011', 'Manjunath Reddy', '+91 98802 45671', 'manjunath.r@outlook.com', '1982-11-20',
    'Bangalore', 'Self Employed', 210000, 40000, 32000, 10000, 9500000, 14000000, 'Villa',
    'Yelahanka, Bangalore', 'Home Construction Loan', '{"hasExistingLoan": true, "existingLoanAmount": 2000000, "currentEmi": 32000}'::jsonb,
    'Constructing G+2 independent duplex on owned plot in Yelahanka.', 'Website Form',
    'Contacted', 'Suresh Gowda', 'Site visit scheduled. Plan sanction copy pending.', '2026-09-23', '03:00 PM',
    11000000, 89800,
    '[{"status": "New", "timestamp": "2026-09-20T14:30:00.000Z", "updatedBy": "System", "note": "Direct Website Application"}, {"status": "Contacted", "timestamp": "2026-09-20T16:00:00.000Z", "updatedBy": "Suresh Gowda", "note": "Introduced BLR15 construction milestone disbursement policy"}]'::jsonb,
    '[{"id": "fu-2", "enquiryId": "BLR15-0011", "date": "2026-09-23", "time": "03:00 PM", "notes": "Collect approved BBMP building sanction plan", "createdBy": "Suresh Gowda", "completed": false}]'::jsonb,
    '2026-09-20T14:30:00.000Z', '2026-09-20T16:00:00.000Z'
  ),
  (
    'BLR15-0010', 'Deepa S. Nair', '+91 94480 91234', 'deepa.nair@infosys.com', '1992-03-08',
    'Bangalore', 'Salaried', 115000, 0, 0, 0, 4800000, 6200000, 'Apartment',
    'Kammagondanahalli, Bangalore', 'Home Purchase Loan', '{"hasExistingLoan": false}'::jsonb,
    'Looking for SBI or HDFC housing loan with doorstep document pickup.', 'Mobile App',
    'Documents Requested', 'Priya Sharma', 'Requested Aadhaar, PAN, 3 months payslips, 6 months bank statements.', '2026-09-24', '04:30 PM',
    5800000, 45400,
    '[{"status": "New", "timestamp": "2026-09-19T10:00:00.000Z", "updatedBy": "Mobile App"}, {"status": "Contacted", "timestamp": "2026-09-19T11:30:00.000Z", "updatedBy": "Priya Sharma"}, {"status": "Documents Requested", "timestamp": "2026-09-19T17:00:00.000Z", "updatedBy": "Priya Sharma", "note": "Email document checklist sent to deepa.nair@infosys.com"}]'::jsonb,
    '[]'::jsonb,
    '2026-09-19T10:00:00.000Z', '2026-09-19T17:00:00.000Z'
  ),
  (
    'BLR15-0009', 'Anand Rao', '+91 99800 67123', 'anand.rao.blr@gmail.com', '1985-09-12',
    'Bangalore', 'Business Owner', 280000, 50000, 45000, 15000, 12000000, 17500000, 'Resale House',
    'Vidyaranyapura, Bangalore', 'Home Loan Balance Transfer', '{"hasExistingLoan": true, "existingLoanAmount": 11500000, "outstandingAmount": 10800000, "currentEmi": 105000, "currentInterestRate": 9.65, "bankName": "Private NBFC"}'::jsonb,
    'Want to transfer high interest (9.65%) loan from NBFC to SBI/HDFC at 8.35%.', 'Website Form',
    'Approved', 'Rajesh Kumar', 'Bank sanction letter issued at 8.40% by HDFC Bank Jalahalli Branch.', '2026-09-25', '11:30 AM',
    14000000, 113000,
    '[{"status": "New", "timestamp": "2026-09-15T08:00:00.000Z", "updatedBy": "System"}, {"status": "Approved", "timestamp": "2026-09-21T18:00:00.000Z", "updatedBy": "Rajesh Kumar", "note": "Sanction letter received from HDFC Bank. MODT registration pending."}]'::jsonb,
    '[]'::jsonb,
    '2026-09-15T08:00:00.000Z', '2026-09-21T18:00:00.000Z'
  ),
  (
    'BLR15-0008', 'Sneha Deshmukh', '+91 97410 88762', 'sneha.d@techmahindra.com', '1995-07-25',
    'Bangalore', 'Salaried', 85000, 0, 8000, 2000, 3500000, 4500000, 'Apartment',
    'Peenya, Bangalore', 'Home Purchase Loan', '{"hasExistingLoan": false}'::jsonb,
    'First time home buyer. Looking for PMAY or low processing fee offers.', 'Eligibility Wizard',
    'Submitted to Lender', 'Priya Sharma', 'Docket submitted to SBI Peenya Branch for technical valuation.', '2026-09-24', '02:00 PM',
    4200000, 33100,
    '[{"status": "New", "timestamp": "2026-09-16T12:00:00.000Z", "updatedBy": "Eligibility Wizard"}, {"status": "Submitted to Lender", "timestamp": "2026-09-20T11:00:00.000Z", "updatedBy": "Priya Sharma", "note": "Valuer assigned for site inspection"}]'::jsonb,
    '[]'::jsonb,
    '2026-09-16T12:00:00.000Z', '2026-09-20T11:00:00.000Z'
  )
ON CONFLICT (id) DO UPDATE SET
  customer_name = EXCLUDED.customer_name,
  mobile = EXCLUDED.mobile,
  email = EXCLUDED.email,
  monthly_income = EXCLUDED.monthly_income,
  required_loan_amount = EXCLUDED.required_loan_amount,
  status = EXCLUDED.status,
  assigned_staff = EXCLUDED.assigned_staff,
  updated_at = EXCLUDED.updated_at;

-- Notify Realtime listeners
ALTER PUBLICATION supabase_realtime ADD TABLE public.enquiries;
