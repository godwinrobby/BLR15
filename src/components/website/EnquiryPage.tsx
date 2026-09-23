import React, { useState } from 'react';
import {
  Send,
  PhoneCall,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Sparkles,
  Search,
  MessageCircle,
  Mail,
} from 'lucide-react';
import { EmploymentType, PropertyType, HomeLoanEnquiry, LoanType } from '../../types';
import { createEnquiry, formatINR } from '../../services/storageService';
import { BLR15_OFFICE_DETAILS } from '../../data/initialData';

interface EnquiryPageProps {
  initialLoanType?: string;
  onNavigate: (tab: string) => void;
  onEnquirySuccess?: (enquiry: HomeLoanEnquiry) => void;
}

export const EnquiryPage: React.FC<EnquiryPageProps> = ({
  initialLoanType,
  onNavigate,
  onEnquirySuccess,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    city: 'Bangalore',
    employmentType: 'Salaried' as EmploymentType,
    loanType: (initialLoanType as LoanType) || 'Home Purchase Loan',
    monthlyIncome: 125000,
    requiredLoanAmount: initialLoanType === 'Personal Loan' ? 500000 : initialLoanType === 'Car Loan' ? 1000000 : 5000000,
    propertyValue: initialLoanType === 'Personal Loan' ? 0 : initialLoanType === 'Car Loan' ? 1200000 : 6500000,
    propertyType: 'Apartment' as PropertyType,
    loanPurpose: 'Wedding / Personal',
    vehicleType: 'New Car',
    message: '',
  });

  const [submittedEnquiry, setSubmittedEnquiry] = useState<HomeLoanEnquiry | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.name.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    if (!formData.mobile.trim() || formData.mobile.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    if (!formData.requiredLoanAmount || formData.requiredLoanAmount <= 0) {
      setErrorMessage('Please specify required loan amount');
      return;
    }

    setIsSubmitting(true);
    try {
      const newEnquiry = createEnquiry({
        customerName: formData.name,
        mobile: formData.mobile,
        email: formData.email,
        city: formData.city,
        employmentType: formData.employmentType,
        monthlyIncome: Number(formData.monthlyIncome),
        requiredLoanAmount: Number(formData.requiredLoanAmount),
        propertyValue: Number(formData.propertyValue),
        propertyType: formData.propertyType,
        propertyLocation: `${formData.city} Area`,
        loanType: formData.loanType,
        internalRemarks: formData.loanType === 'Personal Loan'
          ? `Purpose: ${formData.loanPurpose}`
          : formData.loanType === 'Car Loan'
          ? `Vehicle Type: ${formData.vehicleType}`
          : undefined,
        message: formData.message,
        source: 'Website Form',
        status: 'New',
        estimatedEligibilityAmount: Number(formData.requiredLoanAmount),
      });

      setSubmittedEnquiry(newEnquiry);
      if (onEnquirySuccess) {
        onEnquirySuccess(newEnquiry);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to submit enquiry. Please try again or call our office.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Direct Consultation
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0B1B3D] font-['Outfit']">
            Home Loan Enquiry
          </h1>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Submit your details below and a senior home loan advisor from our Bangalore office will contact you with tailored bank options.
          </p>
        </div>

        {submittedEnquiry ? (
          /* Submission Success State */
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-md text-center max-w-2xl mx-auto space-y-6 animate-in fade-in">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase font-bold text-amber-600 tracking-wider">
                Submission Confirmed
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-[#0B1B3D]">
                Thank you for your enquiry.
              </h2>
              <p className="text-slate-600 text-sm max-w-md mx-auto">
                Thank you for your enquiry. Our team will contact you shortly.
              </p>
            </div>

            {/* Unique Enquiry ID */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs text-slate-500 font-medium">Your Unique Enquiry Reference ID:</span>
              <div className="text-3xl font-mono font-black text-[#0B1B3D] tracking-wider">
                {submittedEnquiry.id}
              </div>
              <p className="text-[11px] text-slate-400">
                Please save this reference number to check status or when speaking with our team.
              </p>
            </div>

            {/* Email Dispatch Notice */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-left flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500 text-slate-950 shrink-0 mt-0.5">
                <Mail className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 text-xs text-slate-700">
                <p className="font-bold text-[#0B1B3D]">
                  Official Confirmation Dispatched
                </p>
                <p className="text-[11px] text-slate-600">
                  A detailed loan enquiry summary has been sent to <strong className="text-[#0B1B3D]">{submittedEnquiry.email}</strong>. Our dedicated loan officer will review your requirements shortly.
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('track')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0B1B3D] hover:bg-[#112754] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4 text-amber-400" />
                <span>Track Enquiry Status</span>
              </button>

              <a
                href={`https://wa.me/${BLR15_OFFICE_DETAILS.whatsapp}?text=Hi%20BLR15,%20I%20just%20submitted%20enquiry%20${submittedEnquiry.id}.%20Please%20connect%20with%20me.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat with Advisor on WhatsApp</span>
              </a>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => setSubmittedEnquiry(null)}
                className="text-xs text-slate-400 hover:text-slate-700 underline"
              >
                Submit another enquiry
              </button>
            </div>
          </div>
        ) : (
          /* Main Enquiry Form */
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm">
            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Loan Category & Type */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Select Loan Category & Type *
                  </label>
                  <select
                    value={formData.loanType}
                    onChange={e => {
                      const newType = e.target.value as LoanType;
                      let newAmount = formData.requiredLoanAmount;
                      let newPropVal = formData.propertyValue;
                      if (newType === 'Personal Loan') {
                        newAmount = 500000;
                        newPropVal = 0;
                      } else if (newType === 'Car Loan') {
                        newAmount = 1000000;
                        newPropVal = 1300000;
                      } else if (formData.loanType === 'Personal Loan' || formData.loanType === 'Car Loan') {
                        newAmount = 5000000;
                        newPropVal = 6500000;
                      }
                      setFormData({
                        ...formData,
                        loanType: newType,
                        requiredLoanAmount: newAmount,
                        propertyValue: newPropVal,
                      });
                    }}
                    className="w-full px-4 py-3 rounded-xl border-2 border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-bold text-[#0B1B3D] bg-amber-50/40"
                  >
                    <optgroup label="🏠 Home Loans">
                      <option value="Home Purchase Loan">Home Purchase Loan (New / Resale)</option>
                      <option value="Home Construction Loan">Home Construction Loan</option>
                      <option value="Home Loan Balance Transfer">Home Loan Balance Transfer</option>
                      <option value="Home Loan Top-Up">Home Loan Top-Up</option>
                    </optgroup>
                    <optgroup label="⚡ Personal & Auto Financing">
                      <option value="Personal Loan">Personal Loan (Instant, Paperless - Up to ₹40L)</option>
                      <option value="Car Loan">Car Loan (New Car, Used Car & EV - Up to 100% On-Road)</option>
                    </optgroup>
                  </select>
                </div>

                {/* Name */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vinay Gowda"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
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
                    required
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
                    required
                    placeholder="e.g. vinay.gowda@gmail.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                </div>

                {/* City */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bangalore"
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                </div>

                {/* Employment Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Employment Type *
                  </label>
                  <select
                    value={formData.employmentType}
                    onChange={e => setFormData({ ...formData, employmentType: e.target.value as EmploymentType })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm bg-white"
                  >
                    <option value="Salaried">Salaried</option>
                    <option value="Self Employed">Self Employed</option>
                    <option value="Business Owner">Business Owner</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Monthly Income */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Monthly Income *
                    </label>
                    <span className="text-xs font-extrabold text-[#0B1B3D]">
                      {formatINR(formData.monthlyIncome)}
                    </span>
                  </div>
                  <input
                    type="number"
                    min={15000}
                    step={5000}
                    required
                    value={formData.monthlyIncome}
                    onChange={e => setFormData({ ...formData, monthlyIncome: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                </div>

                {/* Required Loan Amount */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Required Loan Amount *
                    </label>
                    <span className="text-xs font-extrabold text-[#0B1B3D]">
                      {formatINR(formData.requiredLoanAmount)}
                    </span>
                  </div>
                  <input
                    type="number"
                    min={formData.loanType === 'Personal Loan' ? 50000 : formData.loanType === 'Car Loan' ? 100000 : 500000}
                    max={formData.loanType === 'Personal Loan' ? 4000000 : formData.loanType === 'Car Loan' ? 10000000 : 100000000}
                    step={formData.loanType === 'Personal Loan' ? 25000 : formData.loanType === 'Car Loan' ? 50000 : 100000}
                    required
                    value={formData.requiredLoanAmount}
                    onChange={e => setFormData({ ...formData, requiredLoanAmount: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-semibold"
                  />
                  {formData.loanType === 'Personal Loan' && (
                    <span className="text-[11px] text-slate-400">Max unsecured limit: ₹40,00,000</span>
                  )}
                  {formData.loanType === 'Car Loan' && (
                    <span className="text-[11px] text-slate-400">Up to 100% on-road funding</span>
                  )}
                </div>

                {/* Contextual Second & Third Inputs */}
                {formData.loanType === 'Personal Loan' ? (
                  <>
                    {/* Loan Purpose */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Loan Purpose *
                      </label>
                      <select
                        value={formData.loanPurpose}
                        onChange={e => setFormData({ ...formData, loanPurpose: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm bg-white font-medium"
                      >
                        <option value="Wedding / Family Function">Wedding / Family Function</option>
                        <option value="Medical Emergency / Hospitalization">Medical Emergency</option>
                        <option value="Home Renovation / Interior Design">Home Renovation & Interiors</option>
                        <option value="Higher Education / Training">Higher Education</option>
                        <option value="Vacation & Travel">Holiday & Travel</option>
                        <option value="Debt Consolidation / Credit Cards">Debt Consolidation</option>
                        <option value="Business / Urgent Working Capital">Business Working Capital</option>
                        <option value="Other Personal Needs">Other Personal Needs</option>
                      </select>
                    </div>

                    {/* Preferred Tenure */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Preferred Tenure *
                      </label>
                      <select
                        onChange={e => setFormData({ ...formData, message: `Preferred Tenure: ${e.target.value}. ${formData.message}` })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm bg-white"
                      >
                        <option value="1 Year (12 Months)">1 Year (12 Months) - Fast Clearance</option>
                        <option value="2 Years (24 Months)">2 Years (24 Months)</option>
                        <option value="3 Years (36 Months)" selected>3 Years (36 Months) - Most Popular</option>
                        <option value="4 Years (48 Months)">4 Years (48 Months)</option>
                        <option value="5 Years (60 Months)">5 Years (60 Months) - Lowest EMI</option>
                      </select>
                    </div>
                  </>
                ) : formData.loanType === 'Car Loan' ? (
                  <>
                    {/* Vehicle On-Road Price */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Vehicle On-Road Price *
                        </label>
                        <span className="text-xs font-extrabold text-slate-600">
                          {formatINR(formData.propertyValue)}
                        </span>
                      </div>
                      <input
                        type="number"
                        min={300000}
                        step={50000}
                        required
                        value={formData.propertyValue}
                        onChange={e => setFormData({ ...formData, propertyValue: Number(e.target.value) })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-semibold"
                      />
                    </div>

                    {/* Vehicle Category */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Vehicle Category *
                      </label>
                      <select
                        value={formData.vehicleType}
                        onChange={e => setFormData({ ...formData, vehicleType: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm bg-white font-medium"
                      >
                        <option value="New Car / SUV">New Car / SUV (Showroom Delivery)</option>
                        <option value="Electric Vehicle (EV)">Electric Vehicle (EV) - Special Subsidized Rates</option>
                        <option value="Certified Pre-Owned Car">Certified Pre-Owned / Used Car</option>
                        <option value="Luxury Car">Luxury Sedan / Premium SUV</option>
                        <option value="Commercial Vehicle">Commercial Passenger / Fleet Vehicle</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Property Value */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Property Value *
                        </label>
                        <span className="text-xs font-extrabold text-slate-600">
                          {formatINR(formData.propertyValue)}
                        </span>
                      </div>
                      <input
                        type="number"
                        min={500000}
                        step={100000}
                        required
                        value={formData.propertyValue}
                        onChange={e => setFormData({ ...formData, propertyValue: Number(e.target.value) })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-semibold"
                      />
                    </div>

                    {/* Property Type */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Property Type *
                      </label>
                      <select
                        value={formData.propertyType}
                        onChange={e => setFormData({ ...formData, propertyType: e.target.value as PropertyType })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm bg-white"
                      >
                        <option value="New House">New House</option>
                        <option value="Resale House">Resale House</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Villa">Villa</option>
                        <option value="Plot + Construction">Plot + Construction</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Message */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Message / Special Requirement (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about the property location, builder name, or whether you want balance transfer options..."
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl font-extrabold text-sm bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-md shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4 stroke-[2.5]" />
                  <span>{isSubmitting ? 'Submitting Enquiry...' : 'Submit Enquiry'}</span>
                </button>

                <p className="text-[11px] text-center text-slate-400">
                  By submitting, you authorize BLR15 to contact you regarding your home loan requirement. We respect your privacy and do not spam.
                </p>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
