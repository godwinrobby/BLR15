export type LoanType = 
  | 'Home Purchase Loan'
  | 'Home Construction Loan'
  | 'Home Loan Balance Transfer'
  | 'Home Loan Top-Up'
  | 'Personal Loan'
  | 'Car Loan';

export type EmploymentType = 
  | 'Salaried'
  | 'Self Employed'
  | 'Business Owner'
  | 'Other';

export type PropertyType = 
  | 'New House'
  | 'Resale House'
  | 'Apartment'
  | 'Villa'
  | 'Plot + Construction'
  | 'Other';

export type EnquiryStatus = 
  | 'New'
  | 'Contacted'
  | 'Follow-up'
  | 'Interested'
  | 'Documents Requested'
  | 'Application Started'
  | 'Submitted to Lender'
  | 'Approved'
  | 'Rejected'
  | 'Converted'
  | 'Closed';

export type AdminRole = 'Super Admin' | 'Admin' | 'Loan Executive';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  phone: string;
  active: boolean;
}

export interface ExistingLoanDetails {
  hasExistingLoan: boolean;
  existingLoanAmount?: number;
  outstandingAmount?: number;
  currentEmi?: number;
  currentInterestRate?: number;
  bankName?: string;
}

export interface FollowUpEntry {
  id: string;
  enquiryId: string;
  date: string; // ISO string
  time?: string;
  notes: string;
  createdBy: string;
  completed: boolean;
}

export interface StatusHistoryEntry {
  status: EnquiryStatus;
  timestamp: string;
  updatedBy: string;
  note?: string;
}

export interface HomeLoanEnquiry {
  id: string; // e.g. "BLR15-0012"
  customerName: string;
  mobile: string;
  email: string;
  dob?: string;
  city: string;
  employmentType: EmploymentType;
  monthlyIncome: number;
  otherIncome?: number;
  existingEmi?: number;
  otherObligations?: number;
  
  requiredLoanAmount: number;
  propertyValue: number;
  propertyType: PropertyType;
  propertyLocation: string;
  
  loanType?: LoanType;
  existingLoan?: ExistingLoanDetails;
  
  message?: string;
  source: 'Website Form' | 'Eligibility Wizard' | 'Mobile App' | 'Direct Call';
  
  status: EnquiryStatus;
  assignedStaff?: string;
  internalRemarks?: string;
  nextFollowUpDate?: string;
  nextFollowUpTime?: string;
  
  estimatedEligibilityAmount?: number;
  estimatedEmi?: number;
  
  createdAt: string;
  updatedAt: string;
  statusHistory: StatusHistoryEntry[];
  followUps: FollowUpEntry[];
}

export interface EligibilityFormData {
  // Step 1: Personal
  fullName: string;
  mobile: string;
  email: string;
  dob: string;
  city: string;
  employmentType: EmploymentType;
  
  // Step 2: Income
  monthlyIncome: number;
  otherIncome: number;
  existingEmi: number;
  otherObligations: number;
  
  // Step 3: Loan Requirement
  requiredLoanAmount: number;
  propertyValue: number;
  propertyType: PropertyType;
  propertyLocation: string;
  
  // Step 4: Existing Loan
  hasExistingLoan: boolean;
  existingLoanAmount?: number;
  outstandingAmount?: number;
  currentEmi?: number;
  currentInterestRate?: number;
  bankName?: string;
}

export interface EligibilityResult {
  eligibleAmount: number;
  approxEmi: number;
  tenureYears: number;
  interestRate: number;
  propertyValue: number;
  maxAffordableEmi: number;
  ltvEligibleAmount: number;
  incomeEligibleAmount: number;
}
