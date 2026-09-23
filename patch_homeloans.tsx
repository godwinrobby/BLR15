import React, { useState } from 'react';
import {
  Home, FileCheck, CheckCircle2, ChevronDown, ChevronUp,
  Percent, Clock, Building2, AlertCircle, ShieldCheck, CreditCard,
  PieChart, ArrowRight, IndianRupee, Sparkles, Zap, Calculator
} from 'lucide-react';
import { LoanType } from '../../types';

interface HomeLoansPageProps {
  onNavigate: (tab: string, state?: any) => void;
  onOpenEnquiry: (loanType?: string) => void;
  initialCategory?: 'home' | 'personal' | 'car';
}

export const HomeLoansPage: React.FC<HomeLoansPageProps> = ({
  onNavigate,
  onOpenEnquiry,
  initialCategory = 'home',
}) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<'home' | 'personal' | 'car'>(initialCategory);

  React.useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const pageTitle = selectedCategory === 'home' 
    ? 'Home Loans Made Simple' 
    : selectedCategory === 'personal' 
      ? 'Personal Loans Made Simple' 
      : 'Car Loans Made Simple';

  const bankRates = [
    { bank: 'SBI Home Loan', rate: '8.40% - 10.05%', fee: 'Up to 0.35%', emi: '₹761' },
    { bank: 'HDFC Bank', rate: '8.50% - 9.40%', fee: 'Up to 0.50%', emi: '₹769' },
    { bank: 'ICICI Bank', rate: '8.75% - 9.65%', fee: '0.50% - 2.00%', emi: '₹787' },
    { bank: 'Axis Bank', rate: '8.75% - 10.05%', fee: 'Up to 1%', emi: '₹787' },
    { bank: 'Kotak Mahindra', rate: '8.70% - 9.35%', fee: 'Nil to 0.5%', emi: '₹783' }
  ];

  const faqs = [
    {
      q: "What is the maximum loan amount I can get?",
      a: "The maximum loan amount depends on your repayment capacity, property value, and credit score. Generally, lenders provide up to 80-90% of the property value."
    },
    {
      q: "What is the typical tenure for a loan?",
      a: "Home loans can go up to 30 years, while personal loans are typically 1-5 years, and car loans 1-7 years. A longer tenure means lower EMIs but higher total interest paid."
    },
    {
      q: "Are there any tax benefits available?",
      a: "Yes, for home loans, you can claim tax deductions under Section 80C for principal repayment (up to ₹1.5 Lakhs) and Section 24(b) for interest paid (up to ₹2 Lakhs)."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* HERO SECTION */}
      <section className="bg-[#0B1B3D] pt-16 pb-32 px-4 relative overflow-hidden">
        {/* Abstract Background Vectors */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left Text */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              India's Most Trusted Finance Advisory
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-white font-['Outfit'] leading-tight">
              {pageTitle}
            </h1>
            <p className="text-slate-300 text-sm lg:text-base max-w-xl mx-auto lg:mx-0">
              Compare rates from top lenders, check your eligibility in minutes, and get instant approval with zero hidden charges.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4 max-w-sm mx-auto lg:mx-0">
              <div className="flex items-center gap-2 text-white">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-semibold">Lowest Rates</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-semibold">Instant Approval</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-semibold">Zero Paperwork</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-semibold">Top Banks</span>
              </div>
            </div>
          </div>

          {/* Right Lead Form Widget */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 lg:p-8 max-w-md mx-auto w-full relative">
            <h3 className="text-xl font-bold text-[#0B1B3D] mb-6 text-center">
              Check Your Eligibility Now
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Loan Amount Needed</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IndianRupee className="h-4 w-4 text-slate-400" />
                  </div>
                  <input type="text" placeholder="e.g. 50,00,000" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0B1B3D]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-slate-500 text-sm font-medium">+91</span>
                  </div>
                  <input type="tel" placeholder="9876543210" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0B1B3D]" />
                </div>
              </div>
              <button 
                onClick={() => onNavigate('eligibility')}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-[#0B1B3D] font-bold rounded-xl flex items-center justify-center gap-2 transition-colors mt-2"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[10px] text-slate-500 text-center mt-4">
                By proceeding, you agree to our Terms & Conditions and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE SECTION */}
      <section className="max-w-6xl mx-auto px-4 -mt-16 relative z-20 mb-16">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-slate-50/50">
            <h2 className="text-xl font-bold text-[#0B1B3D]">Compare Top Bank Interest Rates</h2>
            <p className="text-xs text-slate-500 mt-1">Rates updated as of September 2026</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
                  <th className="p-4 font-bold">Bank/Lender</th>
                  <th className="p-4 font-bold">Interest Rate (p.a.)</th>
                  <th className="p-4 font-bold">Processing Fee</th>
                  <th className="p-4 font-bold">EMI (Per Lakh)</th>
                  <th className="p-4 font-bold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {bankRates.map((bank, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-[#0B1B3D] flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[#0B1B3D]">
                        <Building2 className="w-4 h-4" />
                      </div>
                      {bank.bank}
                    </td>
                    <td className="p-4 font-bold text-amber-600">{bank.rate}</td>
                    <td className="p-4 text-slate-600">{bank.fee}</td>
                    <td className="p-4 font-semibold text-slate-700">{bank.emi}</td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => onOpenEnquiry(bank.bank)}
                        className="px-4 py-2 bg-[#0B1B3D] hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        Apply Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* EMI CALCULATOR CTA WIDGET */}
      <section className="max-w-6xl mx-auto px-4 mb-16">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500 text-white shadow-md shadow-blue-500/20 mb-2">
              <Calculator className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-[#0B1B3D]">Plan Your Repayments</h2>
            <p className="text-slate-600 text-sm max-w-md">
              Use our advanced EMI calculator to plan your finances better. Get detailed amortization schedules and break down your principal and interest components.
            </p>
            <button 
              onClick={() => onNavigate('calculator')}
              className="mt-4 px-6 py-3 bg-white border-2 border-[#0B1B3D] text-[#0B1B3D] font-bold rounded-xl hover:bg-[#0B1B3D] hover:text-white transition-colors"
            >
              Open EMI Calculator
            </button>
          </div>
          <div className="flex-1 max-w-sm flex items-center justify-center">
            {/* Dummy Pie Chart Illustration */}
            <div className="relative w-48 h-48 rounded-full border-[16px] border-amber-400 border-r-blue-600 border-b-blue-600 shadow-xl flex items-center justify-center bg-white">
              <div className="text-center">
                <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Your EMI</span>
                <span className="block text-2xl font-black text-[#0B1B3D]">₹24K</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="bg-white py-16 border-y border-slate-200 mb-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-[#0B1B3D]">Why Choose Us?</h2>
            <p className="text-sm text-slate-500 mt-2">The smartest way to get your loan approved</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-[#0B1B3D] mb-2">Instant Eligibility</h3>
              <p className="text-xs text-slate-600 leading-relaxed">Check your eligibility across 20+ lenders in under 2 minutes without impacting your credit score.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                <Percent className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-[#0B1B3D] mb-2">Lowest Interest Rates</h3>
              <p className="text-xs text-slate-600 leading-relaxed">We negotiate with banks on your behalf to guarantee the lowest possible interest rates in the market.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-[#0B1B3D] mb-2">Secure & Transparent</h3>
              <p className="text-xs text-slate-600 leading-relaxed">100% data security with end-to-end encryption. No hidden fees or unexpected charges, ever.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQS SECTION */}
      <section className="max-w-4xl mx-auto px-4 mb-16">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-2xl font-black text-[#0B1B3D] font-['Outfit']">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-colors bg-white"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-sm text-[#0B1B3D] hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-amber-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed bg-white border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SEO / CONTENT SECTION */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 prose prose-sm prose-slate max-w-none">
          <h2 className="text-[#0B1B3D] text-xl font-bold mb-4">A Comprehensive Guide to Loans in India</h2>
          <p>
            When considering financing a large expense, whether it's buying a new home, renovating an existing property, or consolidating debt, understanding your loan options is crucial. A loan is a financial tool that allows you to borrow a specific amount of money from a lender, which you agree to pay back with interest over a set period. 
          </p>
          <h3 className="text-[#0B1B3D] text-lg font-bold mt-6 mb-3">Eligibility Criteria</h3>
          <p>
            Lenders assess several factors before approving your application. The most critical include your credit score, which indicates your creditworthiness and repayment history. A higher credit score often translates to better interest rates. Additionally, lenders evaluate your debt-to-income (DTI) ratio to ensure you have sufficient income to manage new debt alongside existing obligations. Your employment history and income stability are also significant considerations, as a steady job implies reliable repayments.
          </p>
          <h3 className="text-[#0B1B3D] text-lg font-bold mt-6 mb-3">Required Documents</h3>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>Proof of Identity:</strong> Aadhaar Card, PAN Card, Passport, or Voter ID.</li>
            <li><strong>Proof of Address:</strong> Utility bills, Rental Agreement, or Aadhaar Card.</li>
            <li><strong>Income Proof:</strong> Recent salary slips (last 3-6 months), Form 16, and bank statements (last 6 months) for salaried individuals. For self-employed applicants, Income Tax Returns (ITR) for the last 2-3 years, Profit & Loss statements, and balance sheets are usually required.</li>
            <li><strong>Property Documents (if applicable):</strong> Sale deed, allotment letter, builder-buyer agreement, or title deed.</li>
          </ul>
        </div>
      </section>

    </div>
  );
};
