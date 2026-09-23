import React, { useState } from 'react';
import {
  FileCheck,
  User,
  IndianRupee,
  Home,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  AlertCircle,
  Clock,
  ShieldCheck,
  Send,
  MessageCircle,
} from 'lucide-react';
import {
  EmploymentType,
  PropertyType,
  EligibilityFormData,
  EligibilityResult,
  HomeLoanEnquiry,
} from '../../types';
import {
  calculateEligibility,
  createEnquiry,
  formatINR,
} from '../../services/storageService';
import { BLR15_OFFICE_DETAILS } from '../../data/initialData';
import { getLoanTypeLabel, getEligibilityPageTitle } from '../../utils/seo';

interface EligibilityWizardProps {
  initialLoanType?: string;
  initialAmount?: number;
  onNavigate: (tab: string) => void;
  onEnquirySuccess?: (enquiry: HomeLoanEnquiry) => void;
}

export const EligibilityWizard: React.FC<EligibilityWizardProps> = ({
  initialLoanType,
  initialAmount = 5000000,
  onNavigate,
  onEnquirySuccess,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [submittedEnquiry, setSubmittedEnquiry] = useState<HomeLoanEnquiry | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState<EligibilityFormData>({
    fullName: '',
    mobile: '',
    email: '',
    dob: '1990-01-15',
    city: 'Bangalore',
    employmentType: 'Salaried',

    monthlyIncome: 120000,
    otherIncome: 0,
    existingEmi: 15000,
    otherObligations: 0,

    requiredLoanAmount: initialAmount,
    propertyValue: Math.round(initialAmount * 1.3),
    propertyType: 'Apartment',
    propertyLocation: 'Jalahalli / North Bangalore',

    hasExistingLoan: false,
    existingLoanAmount: 0,
    outstandingAmount: 0,
    currentEmi: 0,
    currentInterestRate: 9.25,
    bankName: '',
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  // Result state
  const [result, setResult] = useState<EligibilityResult | null>(null);

  // Validation
  const validateStep = (step: number): boolean => {
    setValidationError(null);

    if (step === 1) {
      if (!formData.fullName.trim()) {
        setValidationError('Please enter your full name');
        return false;
      }
      if (!formData.mobile.trim() || formData.mobile.replace(/\D/g, '').length < 10) {
        setValidationError('Please enter a valid 10-digit mobile number');
        return false;
      }
      if (!formData.email.trim() || !formData.email.includes('@')) {
        setValidationError('Please enter a valid email address');
        return false;
      }
      if (!formData.city.trim()) {
        setValidationError('Please specify your current city');
        return false;
      }
    }

    if (step === 2) {
      if (!formData.monthlyIncome || formData.monthlyIncome < 15000) {
        setValidationError('Monthly income must be at least ₹15,000');
        return false;
      }
    }

    if (step === 3) {
      if (!formData.requiredLoanAmount || formData.requiredLoanAmount <= 0) {
        setValidationError('Please enter your required loan amount');
        return false;
      }
      if (!formData.propertyValue || formData.propertyValue <= 0) {
        setValidationError('Please enter the estimated property value');
        return false;
      }
      if (formData.requiredLoanAmount > formData.propertyValue) {
        setValidationError('Required loan amount cannot exceed total property value');
        return false;
      }
    }

    if (step === 4) {
      if (formData.hasExistingLoan && !formData.bankName?.trim()) {
        setValidationError('Please provide your current lender / bank name');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;

    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } else {
      // Calculate results and go to Step 5
      const calculated = calculateEligibility(
        formData.monthlyIncome,
        formData.otherIncome,
        formData.existingEmi,
        formData.otherObligations,
        formData.propertyValue,
        8.5, // standard competitive rate
        20  // standard 20 years tenure
      );
      setResult(calculated);
      setCurrentStep(5);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setValidationError(null);
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  // Convert Eligibility to Lead Enquiry
  const handleSubmitLead = async () => {
    setIsSubmitting(true);
    try {
      const newEnquiry = await createEnquiry({
        customerName: formData.fullName,
        mobile: formData.mobile,
        email: formData.email,
        dob: formData.dob,
        city: formData.city,
        employmentType: formData.employmentType,
        monthlyIncome: formData.monthlyIncome,
        otherIncome: formData.otherIncome,
        existingEmi: formData.existingEmi,
        otherObligations: formData.otherObligations,
        requiredLoanAmount: formData.requiredLoanAmount,
        propertyValue: formData.propertyValue,
        propertyType: formData.propertyType,
        propertyLocation: formData.propertyLocation,
        loanType: (initialLoanType as any) || 'Home Purchase Loan',
        existingLoan: {
          hasExistingLoan: formData.hasExistingLoan,
          existingLoanAmount: formData.existingLoanAmount,
          outstandingAmount: formData.outstandingAmount,
          currentEmi: formData.currentEmi,
          currentInterestRate: formData.currentInterestRate,
          bankName: formData.bankName,
        },
        source: 'Eligibility Wizard',
        status: 'New',
        estimatedEligibilityAmount: result?.eligibleAmount || formData.requiredLoanAmount,
        estimatedEmi: result?.approxEmi,
        message: `Eligibility Assessment: Calculated eligibility of ${formatINR(result?.eligibleAmount)} with approx EMI of ${formatINR(result?.approxEmi)}/mo.`,
      });

      setSubmittedEnquiry(newEnquiry);
      if (onEnquirySuccess) {
        onEnquirySuccess(newEnquiry);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepTitles = [
    { num: 1, title: 'Personal Info', icon: User },
    { num: 2, title: 'Income Details', icon: IndianRupee },
    { num: 3, title: 'Loan Requirement', icon: Home },
    { num: 4, title: 'Existing Loan', icon: CreditCard },
  ];

  // Page heading mirrors the loan type passed via URL / navigation state
  // e.g. #/eligibility?amount=500000&type=Personal+Loan
  const loanTypeLabel = getLoanTypeLabel(initialLoanType);
  const eligibilityTitle = getEligibilityPageTitle(initialLoanType);
  const eligibilitySubtitle =
    loanTypeLabel === 'Personal Loan'
      ? 'Answer a few quick questions to estimate how much personal loan you can borrow with indicative monthly EMIs.'
      : loanTypeLabel === 'Car Loan'
      ? 'Answer a few quick questions to estimate how much car loan you can borrow with indicative monthly EMIs.'
      : 'Answer a few quick questions to estimate how much home loan you can borrow with indicative monthly EMIs.';

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Header Title */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Fast &amp; Indicative Check{loanTypeLabel ? ` • ${loanTypeLabel}` : ''}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0B1B3D] font-['Outfit']">
            {eligibilityTitle}
          </h1>
          <p className="text-slate-600 text-sm max-w-lg mx-auto">
            {eligibilitySubtitle}
          </p>
        </div>

        {/* Multi-step Progress Bar (Steps 1 - 4) */}
        {currentStep <= 4 && (
          <div className="mb-8 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="grid grid-cols-4 gap-2">
              {stepTitles.map(step => {
                const Icon = step.icon;
                const isCurrent = currentStep === step.num;
                const isDone = currentStep > step.num;

                return (
                  <div
                    key={step.num}
                    className={`flex flex-col items-center text-center transition-all ${
                      isCurrent
                        ? 'text-[#0B1B3D]'
                        : isDone
                        ? 'text-emerald-700'
                        : 'text-slate-400'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black mb-1.5 transition-all ${
                        isCurrent
                          ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25 ring-2 ring-amber-400/40'
                          : isDone
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <span className="text-[11px] font-bold hidden sm:block">
                      {step.title}
                    </span>
                    <span className="text-[10px] text-slate-400 sm:hidden">
                      Step {step.num}
                    </span>
                  </div>
                );
              })}
            </div>
            {/* Progress bar line */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
              <div
                className="bg-amber-500 h-full transition-all duration-300"
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Validation error notification */}
        {validationError && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Form Container Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm relative">
          
          {/* STEP 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold font-['Outfit'] text-[#0B1B3D]">
                  Step 1 – Personal Information
                </h2>
                <p className="text-xs text-slate-500">
                  Please provide your contact info for personalized eligibility calculations.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                </div>

                {/* Mobile */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 98450 12345"
                    value={formData.mobile}
                    onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. ramesh@example.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                </div>

                {/* Date of Birth */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={e => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                </div>

                {/* City */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    City / Location *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bangalore"
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                </div>

                {/* Employment Type */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Employment Type *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {(['Salaried', 'Self Employed', 'Business Owner', 'Other'] as EmploymentType[]).map(type => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => setFormData({ ...formData, employmentType: type })}
                        className={`py-3 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                          formData.employmentType === type
                            ? 'bg-[#0B1B3D] text-amber-400 border-[#0B1B3D] shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Income Details */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold font-['Outfit'] text-[#0B1B3D]">
                  Step 2 – Income Details
                </h2>
                <p className="text-xs text-slate-500">
                  Your net monthly take-home salary or net business profit.
                </p>
              </div>

              <div className="space-y-5">
                {/* Monthly Income */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Net Monthly Income (Take-home) *
                    </label>
                    <span className="text-base font-extrabold text-[#0B1B3D]">
                      {formatINR(formData.monthlyIncome)}
                    </span>
                  </div>
                  <input
                    type="number"
                    min={15000}
                    step={5000}
                    value={formData.monthlyIncome || ''}
                    onChange={e => setFormData({ ...formData, monthlyIncome: Number(e.target.value) })}
                    placeholder="120000"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-semibold"
                  />
                  <span className="text-[11px] text-slate-400">
                    Gross salary minus taxes and PF deductions.
                  </span>
                </div>

                {/* Other Monthly Income */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Other Monthly Income (Rental / Bonus / Spouse)
                    </label>
                    <span className="text-sm font-bold text-slate-600">
                      {formatINR(formData.otherIncome)}
                    </span>
                  </div>
                  <input
                    type="number"
                    min={0}
                    step={5000}
                    value={formData.otherIncome || ''}
                    onChange={e => setFormData({ ...formData, otherIncome: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                </div>

                {/* Existing EMI */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Current Monthly EMIs Paid
                    </label>
                    <span className="text-sm font-bold text-amber-700">
                      {formatINR(formData.existingEmi)}
                    </span>
                  </div>
                  <input
                    type="number"
                    min={0}
                    step={2000}
                    value={formData.existingEmi || ''}
                    onChange={e => setFormData({ ...formData, existingEmi: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                  <span className="text-[11px] text-slate-400">
                    Include car loans, personal loans, or consumer durable EMIs.
                  </span>
                </div>

                {/* Other Monthly Obligations */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Other Monthly Obligations / Credit Card minimums
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    value={formData.otherObligations || ''}
                    onChange={e => setFormData({ ...formData, otherObligations: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Loan Requirement */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold font-['Outfit'] text-[#0B1B3D]">
                  Step 3 – Loan Requirement & Property
                </h2>
                <p className="text-xs text-slate-500">
                  Tell us about the property and the financing amount you are seeking.
                </p>
              </div>

              <div className="space-y-5">
                {/* Required Loan Amount */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Required Loan Amount *
                    </label>
                    <span className="text-base font-extrabold text-[#0B1B3D]">
                      {formatINR(formData.requiredLoanAmount)}
                    </span>
                  </div>
                  <input
                    type="number"
                    min={500000}
                    step={100000}
                    value={formData.requiredLoanAmount || ''}
                    onChange={e => setFormData({ ...formData, requiredLoanAmount: Number(e.target.value) })}
                    placeholder="5000000"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-semibold"
                  />
                </div>

                {/* Property Value */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Estimated Property Value / Agreement Cost *
                    </label>
                    <span className="text-sm font-bold text-slate-600">
                      {formatINR(formData.propertyValue)}
                    </span>
                  </div>
                  <input
                    type="number"
                    min={500000}
                    step={100000}
                    value={formData.propertyValue || ''}
                    onChange={e => setFormData({ ...formData, propertyValue: Number(e.target.value) })}
                    placeholder="6500000"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-semibold"
                  />
                </div>

                {/* Property Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Property Type *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {([
                      'New House',
                      'Resale House',
                      'Apartment',
                      'Villa',
                      'Plot + Construction',
                      'Other',
                    ] as PropertyType[]).map(ptype => (
                      <button
                        type="button"
                        key={ptype}
                        onClick={() => setFormData({ ...formData, propertyType: ptype })}
                        className={`py-3 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                          formData.propertyType === ptype
                            ? 'bg-[#0B1B3D] text-amber-400 border-[#0B1B3D] shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {ptype}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Property Location */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Property Location (Area / Neighborhood in Bangalore) *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Jalahalli West, Kammagondanahalli, Yelahanka, etc."
                    value={formData.propertyLocation}
                    onChange={e => setFormData({ ...formData, propertyLocation: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Existing Loan */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold font-['Outfit'] text-[#0B1B3D]">
                  Step 4 – Existing Loan
                </h2>
                <p className="text-xs text-slate-500">
                  Do you currently have an ongoing home loan with another lender?
                </p>
              </div>

              {/* Yes / No selection */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-800">
                  Do you currently have a home loan?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, hasExistingLoan: true })}
                    className={`py-4 rounded-xl text-sm font-extrabold border flex items-center justify-center gap-2 transition-all ${
                      formData.hasExistingLoan
                        ? 'bg-[#0B1B3D] text-amber-400 border-[#0B1B3D] shadow-md'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>Yes, I have an existing home loan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, hasExistingLoan: false })}
                    className={`py-4 rounded-xl text-sm font-extrabold border flex items-center justify-center gap-2 transition-all ${
                      !formData.hasExistingLoan
                        ? 'bg-[#0B1B3D] text-amber-400 border-[#0B1B3D] shadow-md'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>No, this is my first home loan</span>
                  </button>
                </div>
              </div>

              {/* Conditional Existing Loan Fields */}
              {formData.hasExistingLoan && (
                <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-4 animate-in fade-in">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                    <CreditCard className="w-4 h-4 text-amber-600" />
                    <span>Existing Home Loan Details</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        Existing Bank / Institution *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. SBI, HDFC, ICICI, Axis Bank"
                        value={formData.bankName || ''}
                        onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        Current Outstanding Amount
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 4500000"
                        value={formData.outstandingAmount || ''}
                        onChange={e => setFormData({ ...formData, outstandingAmount: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        Current Monthly EMI
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 42000"
                        value={formData.currentEmi || ''}
                        onChange={e => setFormData({ ...formData, currentEmi: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        Current Interest Rate (%)
                      </label>
                      <input
                        type="number"
                        step="0.05"
                        placeholder="e.g. 9.50"
                        value={formData.currentInterestRate || ''}
                        onChange={e => setFormData({ ...formData, currentInterestRate: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs bg-white"
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-amber-800">
                    💡 Tip: Balance transfer to a lower interest rate with BLR15 could save you ₹3 Lakhs to ₹8 Lakhs over your tenure.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: RESULTS SCREEN */}
          {currentStep === 5 && result && (
            <div className="space-y-6 animate-in fade-in">
              <div className="text-center space-y-2 pb-2">
                <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/25">
                  <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-[#0B1B3D]">
                  Your Home Loan Eligibility
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  Based on your monthly net income of {formatINR(formData.monthlyIncome)} and property parameters.
                </p>
              </div>

              {/* Big Eligibility Display Card */}
              <div className="bg-gradient-to-br from-[#0B1B3D] via-[#112754] to-[#0A162F] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden text-center space-y-4">
                <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
                  Estimated Eligible Amount
                </span>

                <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-amber-400 font-['Outfit'] tracking-tight">
                  {formatINR(result.eligibleAmount)}
                </div>

                <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-slate-200 text-xs font-semibold backdrop-blur-xs">
                  Subject to lender underwriting and documentation
                </div>

                {/* Grid of Results */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 text-left">
                  <div className="bg-white/5 p-3 rounded-xl">
                    <span className="text-[11px] text-slate-400 block">Approximate EMI</span>
                    <span className="text-sm font-extrabold text-white">
                      {formatINR(result.approxEmi)}/mo
                    </span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl">
                    <span className="text-[11px] text-slate-400 block">Loan Tenure</span>
                    <span className="text-sm font-extrabold text-white">
                      {result.tenureYears} Years
                    </span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl">
                    <span className="text-[11px] text-slate-400 block">Estimated Interest</span>
                    <span className="text-sm font-extrabold text-amber-400">
                      8.50% p.a.
                    </span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl">
                    <span className="text-[11px] text-slate-400 block">Property Considered</span>
                    <span className="text-sm font-extrabold text-white">
                      {formatINR(formData.propertyValue)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Indicative Disclaimer Notice from Prompt */}
              <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p leading-relaxed>
                  <strong>Disclaimer:</strong> The loan eligibility and EMI amounts displayed above are <strong>indicative estimates</strong> based on standard FOIR and LTV ratios. Actual sanction terms, eligible amount, and interest rates are determined exclusively by our partner banks following formal credit assessment, income verification, and legal property valuation.
                </p>
              </div>

              {/* Post-submission confirmation banner if already submitted */}
              {submittedEnquiry ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-3 text-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-extrabold text-lg">
                    Enquiry Submitted Successfully!
                  </h4>
                  <p className="text-xs text-emerald-800">
                    Your unique Enquiry ID is:
                  </p>
                  <div className="inline-block px-4 py-2 rounded-xl bg-emerald-100 border border-emerald-300 font-mono font-black text-emerald-900 text-lg">
                    {submittedEnquiry.id}
                  </div>
                  <p className="text-xs text-emerald-700">
                    Our senior loan advisor will contact you within 2 business hours.
                  </p>
                  <div className="pt-2 flex flex-wrap justify-center gap-3">
                    <button
                      onClick={() => onNavigate('track')}
                      className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors"
                    >
                      Track Enquiry Status
                    </button>
                    <a
                      href={`https://wa.me/${BLR15_OFFICE_DETAILS.whatsapp}?text=Hi%20BLR15,%20my%20enquiry%20is%20${submittedEnquiry.id}.%20Please%20assist.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg bg-white border border-emerald-300 text-emerald-800 text-xs font-bold hover:bg-emerald-50 transition-colors"
                    >
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>
              ) : (
                /* Primary Actions from Prompt: Talk to Expert & Submit Enquiry */
                <div className="pt-2 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={handleSubmitLead}
                      disabled={isSubmitting}
                      className="py-4 px-5 rounded-xl font-extrabold text-sm bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4 stroke-[2.5]" />
                      <span>{isSubmitting ? 'Submitting Enquiry...' : 'Submit Enquiry'}</span>
                    </button>

                    <a
                      href={`https://wa.me/${BLR15_OFFICE_DETAILS.whatsapp}?text=Hello%20BLR15%20Team,%20I%20checked%20my%20home%20loan%20eligibility%20and%20need%20expert%20assistance%20for%20amount%20${formatINR(result.eligibleAmount)}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-4 px-5 rounded-xl font-extrabold text-sm bg-[#0B1B3D] hover:bg-[#122A63] text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
                      <span>Talk to Our Home Loan Expert</span>
                    </a>
                  </div>

                  <div className="text-center pt-2">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline underline-offset-4"
                    >
                      Recalculate with different income / property values
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons for Step 1 - 4 */}
          {currentStep <= 4 && (
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={handleNext}
                className="px-7 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{currentStep === 4 ? 'Calculate Eligibility' : 'Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
