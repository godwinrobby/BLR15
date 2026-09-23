import React, { useState } from 'react';
import {
  Home,
  FileCheck,
  PhoneCall,
  User,
  Calculator,
  Search,
  Sparkles,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Percent,
  Zap,
  ShieldCheck,
  MessageCircle,
  Building,
  Clock,
  ArrowUpRight,
  ArrowRight,
  Smartphone,
  Monitor,
} from 'lucide-react';
import { BLR15Logo } from '../common/BLR15Logo';
import {
  calculateEligibility,
  calculateHomeLoanEmi,
  createEnquiry,
  formatINR,
  getStoredEnquiries,
  refreshEnquiries,
} from '../../services/storageService';
import { EmploymentType, PropertyType, HomeLoanEnquiry } from '../../types';
import { BLR15_OFFICE_DETAILS } from '../../data/initialData';

interface MobileAppViewProps {
  onSwitchView: (view: 'website' | 'mobile-app' | 'admin') => void;
}

export const MobileAppView: React.FC<MobileAppViewProps> = ({ onSwitchView }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'home-loans' | 'eligibility' | 'enquiry' | 'profile'>('home');
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);

  // Mobile Eligibility 5-screen flow states
  const [mobStep, setMobStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [mobData, setMobData] = useState({
    name: '',
    mobile: '',
    employment: 'Salaried' as EmploymentType,
    income: 120000,
    existingEmi: 15000,
    requiredLoan: 5000000,
    propertyValue: 6500000,
    propertyType: 'Apartment' as PropertyType,
    propertyLocation: 'Jalahalli West, Bangalore',
  });
  const [mobResult, setMobResult] = useState<{ eligibleAmount: number; approxEmi: number } | null>(null);
  const [mobSubmittedEnquiry, setMobSubmittedEnquiry] = useState<HomeLoanEnquiry | null>(null);

  // Mobile Quick Calculator
  const [mCalcAmount, setMCalcAmount] = useState(5000000);
  const [mCalcRate, setMCalcRate] = useState(8.5);
  const [mCalcTenure, setMCalcTenure] = useState(20);
  const mCalcOutput = calculateHomeLoanEmi(mCalcAmount, mCalcRate, mCalcTenure);

  // Quick enquiry in mobile Enquiry tab
  const [enqForm, setEnqForm] = useState({
    name: '',
    mobile: '',
    amount: 5000000,
    type: 'Home Purchase Loan',
    message: '',
  });
  const [enqSubmitted, setEnqSubmitted] = useState<HomeLoanEnquiry | null>(null);

  // Status tracker lookup state in Profile tab
  const [searchId, setSearchId] = useState('BLR15-0012');
  const [trackedEnquiry, setTrackedEnquiry] = useState<HomeLoanEnquiry | null>(() => {
    const list = getStoredEnquiries();
    return list.find(e => e.id === 'BLR15-0012') || null;
  });

  const handleTrackSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const list = await refreshEnquiries();
    const cleanTerm = searchId.trim().toLowerCase();
    const found = list.find(item => item.id.toLowerCase() === cleanTerm || item.mobile.includes(cleanTerm));
    setTrackedEnquiry(found || null);
  };

  const handleMobSubmitEnquiry = async () => {
    const newEnq = await createEnquiry({
      customerName: mobData.name || 'Mobile Applicant',
      mobile: mobData.mobile || '9845012345',
      email: `${(mobData.name || 'applicant').toLowerCase().replace(/\s+/g, '')}@blr15.in`,
      city: 'Bangalore',
      employmentType: mobData.employment,
      monthlyIncome: mobData.income,
      requiredLoanAmount: mobData.requiredLoan,
      propertyValue: mobData.propertyValue,
      propertyType: mobData.propertyType,
      propertyLocation: mobData.propertyLocation,
      loanType: 'Home Purchase Loan',
      source: 'Mobile App',
      status: 'New',
      estimatedEligibilityAmount: mobResult?.eligibleAmount,
      estimatedEmi: mobResult?.approxEmi,
      message: `Mobile Eligibility Flow completed. Indicative eligibility: ${formatINR(mobResult?.eligibleAmount)}`,
    });
    setMobSubmittedEnquiry(newEnq);
  };

  const handleQuickEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enqForm.name || !enqForm.mobile) return;
    const newEnq = await createEnquiry({
      customerName: enqForm.name,
      mobile: enqForm.mobile,
      email: `${enqForm.name.toLowerCase().replace(/\s+/g, '')}@blr15.in`,
      city: 'Bangalore',
      employmentType: 'Salaried',
      monthlyIncome: 100000,
      requiredLoanAmount: enqForm.amount,
      propertyValue: Math.round(enqForm.amount * 1.3),
      propertyType: 'Apartment',
      propertyLocation: 'Bangalore',
      loanType: enqForm.type as any,
      source: 'Mobile App',
      status: 'New',
      message: enqForm.message || 'Mobile quick enquiry',
    });
    setEnqSubmitted(newEnq);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center py-6 px-3">
      
      {/* View Switcher Top Bar */}
      <div className="w-full max-w-md flex items-center justify-between mb-4 px-2">
        <button
          onClick={() => onSwitchView('website')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Website</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs flex items-center gap-1"
            title="Toggle Smartphone Bezel"
          >
            {isPhoneFrame ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
            <span className="text-[11px]">{isPhoneFrame ? 'Full Width' : 'Phone Frame'}</span>
          </button>

          <button
            onClick={() => onSwitchView('admin')}
            className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold"
          >
            Admin
          </button>
        </div>
      </div>

      {/* Simulated Phone Frame or Full Container */}
      <div
        className={`w-full ${
          isPhoneFrame
            ? 'max-w-[390px] border-8 border-slate-800 rounded-[44px] shadow-2xl overflow-hidden ring-1 ring-slate-700/50'
            : 'max-w-md rounded-2xl shadow-xl'
        } bg-slate-950 flex flex-col h-[780px] relative`}
      >
        {/* Phone Status Bar */}
        <div className="bg-[#0B1B3D] text-white pt-2.5 pb-2 px-6 flex items-center justify-between text-[11px] font-semibold border-b border-white/5 shrink-0 select-none">
          <span>9:41</span>
          {/* Dynamic Island / Speaker Pill */}
          <div className="w-20 h-4 bg-slate-900 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-slate-800" />
          </div>
          <div className="flex items-center gap-1.5">
            <span>5G</span>
            <div className="w-4 h-2.5 border border-white rounded-xs p-0.5 flex items-center">
              <div className="w-full h-full bg-emerald-400 rounded-2xs" />
            </div>
          </div>
        </div>

        {/* Mobile App Header */}
        <div className="bg-[#0B1B3D] px-4 py-3 flex items-center justify-between border-b border-white/10 shrink-0">
          <BLR15Logo variant="white" showTagline={false} className="scale-90 origin-left" />
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('profile');
                setSearchId('BLR15-0012');
              }}
              className="p-1.5 rounded-lg bg-white/10 text-amber-400 hover:bg-white/20"
              title="Track Status"
            >
              <Search className="w-4 h-4" />
            </button>
            <a
              href={`tel:${BLR15_OFFICE_DETAILS.phone}`}
              className="p-1.5 rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400"
              title="Call Office"
            >
              <PhoneCall className="w-4 h-4 stroke-[2.5]" />
            </a>
          </div>
        </div>

        {/* Scrollable Mobile App Body */}
        <div className="flex-1 overflow-y-auto bg-slate-50 text-slate-900 pb-20">
          
          {/* TAB 1: HOME */}
          {activeTab === 'home' && (
            <div className="space-y-4">
              
              {/* Hero Banner from Prompt */}
              <div className="bg-gradient-to-br from-[#0B1B3D] via-[#102554] to-[#0A1734] text-white p-5 rounded-b-3xl space-y-3 relative overflow-hidden shadow-md">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold border border-amber-400/30">
                  <Sparkles className="w-3 h-3" />
                  <span>BLR15 Mobile Experience</span>
                </div>

                <h1 className="text-2xl font-black font-['Outfit'] leading-tight">
                  Turn Your Dreams <br />
                  <span className="text-amber-400">Into Homes</span>
                </h1>
                
                <p className="text-xs text-slate-300">
                  Your Dream Home, Our Commitment. Quick home loan eligibility & doorstep assistance in Bangalore.
                </p>

                <div className="pt-1">
                  <button
                    onClick={() => {
                      setActiveTab('eligibility');
                      setMobStep(1);
                    }}
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FileCheck className="w-4 h-4 stroke-[2.5]" />
                    <span>Check Eligibility</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Quick Actions Grid */}
              <div className="px-4 grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => setActiveTab('home-loans')}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col items-start gap-1.5 hover:border-amber-400 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                    <Building className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 font-['Outfit']">Home Loans</span>
                  <span className="text-[10px] text-slate-500">Multiple Loan Types</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('home');
                    const el = document.getElementById('mob-emi-calc');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col items-start gap-1.5 hover:border-amber-400 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 font-['Outfit']">EMI Calculator</span>
                  <span className="text-[10px] text-slate-500">Calculate Monthly Cost</span>
                </button>

                <button
                  onClick={() => setActiveTab('enquiry')}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col items-start gap-1.5 hover:border-amber-400 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 font-['Outfit']">Quick Enquiry</span>
                  <span className="text-[10px] text-slate-500">Direct Advisor Call</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('profile');
                    setSearchId('BLR15-0012');
                  }}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col items-start gap-1.5 hover:border-amber-400 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                    <Search className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 font-['Outfit']">Enquiry Status</span>
                  <span className="text-[10px] text-slate-500">Track Progress</span>
                </button>
              </div>

              {/* Mobile EMI Calculator Section */}
              <div id="mob-emi-calc" className="px-4">
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-[#0B1B3D] uppercase tracking-wider font-['Outfit']">
                      Quick EMI Estimator
                    </h3>
                    <span className="text-xs font-black text-amber-600">
                      {formatINR(mCalcOutput.emi)}/mo
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                      <span>Amount: {formatINR(mCalcAmount)}</span>
                    </div>
                    <input
                      type="range"
                      min={1000000}
                      max={15000000}
                      step={500000}
                      value={mCalcAmount}
                      onChange={e => setMCalcAmount(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center text-xs pt-1">
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block">Rate</span>
                      <span className="font-bold text-[#0B1B3D]">{mCalcRate}% p.a.</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block">Tenure</span>
                      <span className="font-bold text-[#0B1B3D]">{mCalcTenure} Years</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setMobData(prev => ({ ...prev, requiredLoan: mCalcAmount }));
                      setActiveTab('eligibility');
                      setMobStep(1);
                    }}
                    className="w-full py-2 rounded-xl bg-slate-900 text-amber-400 font-bold text-xs hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Check Eligibility for this amount</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Why Choose Us */}
              <div className="px-4 space-y-2">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-['Outfit']">
                  Why Choose BLR15
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200">
                    <Percent className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="font-medium text-slate-800">Competitive rates starting from 8.35% p.a.</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200">
                    <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="font-medium text-slate-800">Fast processing with in-principle clearance</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200">
                    <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="font-medium text-slate-800">No hidden fees, 100% transparent advisory</span>
                  </div>
                </div>
              </div>

              {/* Contact Us Micro Bar */}
              <div className="px-4 pb-4">
                <div className="p-3.5 rounded-2xl bg-[#0B1B3D] text-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-amber-400 font-bold uppercase block">BLR15 Office</span>
                    <span className="text-xs font-medium text-slate-200">Jalahalli West, Bangalore</span>
                  </div>
                  <a
                    href={`https://wa.me/${BLR15_OFFICE_DETAILS.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: HOME LOANS */}
          {activeTab === 'home-loans' && (
            <div className="p-4 space-y-3">
              <div className="mb-2">
                <h2 className="text-lg font-black text-[#0B1B3D] font-['Outfit']">
                  Home Loan Solutions
                </h2>
                <p className="text-xs text-slate-500">
                  Select a product suited to your requirement.
                </p>
              </div>

              {[
                {
                  title: 'Home Purchase Loan',
                  sub: 'For purchasing new or resale residential property.',
                  rate: 'From 8.35%*',
                  tag: 'Popular',
                },
                {
                  title: 'Home Construction Loan',
                  sub: 'For constructing your house on an owned plot.',
                  rate: 'From 8.45%*',
                  tag: 'Self Build',
                },
                {
                  title: 'Home Loan Balance Transfer',
                  sub: 'Transfer existing home loan for lower interest rates.',
                  rate: 'From 8.35%*',
                  tag: 'Save EMI',
                },
                {
                  title: 'Home Loan Top-Up',
                  sub: 'Additional funding for renovations or personal needs.',
                  rate: 'From 8.65%*',
                  tag: 'Surplus',
                },
              ].map((loan, idx) => (
                <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      {loan.tag}
                    </span>
                    <span className="text-xs font-bold text-amber-600">{loan.rate}</span>
                  </div>

                  <h3 className="text-sm font-bold text-[#0B1B3D] font-['Outfit']">
                    {loan.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {loan.sub}
                  </p>

                  <div className="pt-1 flex gap-2">
                    <button
                      onClick={() => {
                        setActiveTab('eligibility');
                        setMobStep(1);
                      }}
                      className="flex-1 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400"
                    >
                      Check Eligibility
                    </button>
                    <button
                      onClick={() => {
                        setEnqForm(prev => ({ ...prev, type: loan.title }));
                        setActiveTab('enquiry');
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200"
                    >
                      Enquire
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: MOBILE ELIGIBILITY FLOW (5 Screens from Prompt) */}
          {activeTab === 'eligibility' && (
            <div className="p-4 space-y-4">
              
              {/* Progress Indicator */}
              <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-200">
                <span className="font-bold text-[#0B1B3D]">
                  {mobStep <= 4 ? `Step ${mobStep} of 4` : 'Eligibility Result'}
                </span>
                <span className="text-[11px] text-amber-600 font-semibold">
                  {mobStep === 1 && 'Personal Info'}
                  {mobStep === 2 && 'Income Details'}
                  {mobStep === 3 && 'Obligations & Loan'}
                  {mobStep === 4 && 'Property Details'}
                  {mobStep === 5 && 'Sanction Estimate'}
                </span>
              </div>

              {/* SCREEN 1 from Prompt:
                  Let's check your eligibility
                  Name
                  Mobile Number
                  Continue
              */}
              {mobStep === 1 && (
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-base font-black text-[#0B1B3D] font-['Outfit']">
                      Let's check your eligibility
                    </h2>
                    <p className="text-xs text-slate-500">
                      Enter your name and mobile to start
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase">
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Kumar"
                      value={mobData.name}
                      onChange={e => setMobData({ ...mobData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 98450 12345"
                      value={mobData.mobile}
                      onChange={e => setMobData({ ...mobData, mobile: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (!mobData.name.trim() || !mobData.mobile.trim()) {
                        alert('Please enter your name and mobile number');
                        return;
                      }
                      setMobStep(2);
                    }}
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* SCREEN 2 from Prompt:
                  Employment Type: Salaried / Self Employed / Business
                  Monthly Income
                  Continue
              */}
              {mobStep === 2 && (
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-base font-black text-[#0B1B3D] font-['Outfit']">
                      Income & Employment
                    </h2>
                    <p className="text-xs text-slate-500">
                      Step 2: Tell us how you earn
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase">
                      Employment Type
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Salaried', 'Self Employed', 'Business Owner'] as EmploymentType[]).map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setMobData({ ...mobData, employment: type })}
                          className={`py-2 px-1 text-center rounded-xl text-[11px] font-bold border ${
                            mobData.employment === type
                              ? 'bg-[#0B1B3D] text-amber-400 border-[#0B1B3D]'
                              : 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          {type === 'Business Owner' ? 'Business' : type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[11px] font-bold">
                      <span className="text-slate-700 uppercase">Monthly Income</span>
                      <span className="text-[#0B1B3D]">{formatINR(mobData.income)}</span>
                    </div>
                    <input
                      type="number"
                      step={5000}
                      value={mobData.income}
                      onChange={e => setMobData({ ...mobData, income: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setMobStep(1)}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setMobStep(3)}
                      className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* SCREEN 3 from Prompt:
                  Existing EMI
                  Required Loan Amount
                  Property Value
                  Continue
              */}
              {mobStep === 3 && (
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-base font-black text-[#0B1B3D] font-['Outfit']">
                      Loan & Liabilities
                    </h2>
                    <p className="text-xs text-slate-500">
                      Step 3: Existing commitments and loan needed
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[11px] font-bold">
                      <span className="text-slate-700 uppercase">Existing EMI</span>
                      <span className="text-amber-700">{formatINR(mobData.existingEmi)}</span>
                    </div>
                    <input
                      type="number"
                      step={1000}
                      value={mobData.existingEmi}
                      onChange={e => setMobData({ ...mobData, existingEmi: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[11px] font-bold">
                      <span className="text-slate-700 uppercase">Required Loan Amount</span>
                      <span className="text-[#0B1B3D]">{formatINR(mobData.requiredLoan)}</span>
                    </div>
                    <input
                      type="number"
                      step={100000}
                      value={mobData.requiredLoan}
                      onChange={e => setMobData({ ...mobData, requiredLoan: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[11px] font-bold">
                      <span className="text-slate-700 uppercase">Property Value</span>
                      <span className="text-slate-600">{formatINR(mobData.propertyValue)}</span>
                    </div>
                    <input
                      type="number"
                      step={100000}
                      value={mobData.propertyValue}
                      onChange={e => setMobData({ ...mobData, propertyValue: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setMobStep(2)}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setMobStep(4)}
                      className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* SCREEN 4 from Prompt:
                  Property Details
                  Property Type
                  Property Location
                  Check Eligibility
              */}
              {mobStep === 4 && (
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-base font-black text-[#0B1B3D] font-['Outfit']">
                      Property Details
                    </h2>
                    <p className="text-xs text-slate-500">
                      Step 4: Location & Property category
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase">
                      Property Type
                    </label>
                    <select
                      value={mobData.propertyType}
                      onChange={e => setMobData({ ...mobData, propertyType: e.target.value as PropertyType })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                    >
                      <option value="Apartment">Apartment</option>
                      <option value="New House">New House</option>
                      <option value="Resale House">Resale House</option>
                      <option value="Villa">Villa</option>
                      <option value="Plot + Construction">Plot + Construction</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase">
                      Property Location in Bangalore
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Jalahalli West, Kammagondanahalli"
                      value={mobData.propertyLocation}
                      onChange={e => setMobData({ ...mobData, propertyLocation: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setMobStep(3)}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => {
                        const calculated = calculateEligibility(
                          mobData.income,
                          0,
                          mobData.existingEmi,
                          0,
                          mobData.propertyValue
                        );
                        setMobResult({
                          eligibleAmount: calculated.eligibleAmount,
                          approxEmi: calculated.approxEmi,
                        });
                        setMobStep(5);
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md flex items-center justify-center gap-1.5"
                    >
                      <span>Check Eligibility</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* SCREEN 5 from Prompt:
                  Show indicative eligibility
                  Estimated Loan Eligibility: ₹ XX,XX,XXX
                  Buttons:
                  Submit Enquiry
                  Talk to Expert
              */}
              {mobStep === 5 && mobResult && (
                <div className="space-y-4">
                  <div className="bg-[#0B1B3D] text-white p-6 rounded-3xl text-center space-y-3 shadow-lg">
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                      Estimated Loan Eligibility
                    </span>
                    <div className="text-3xl sm:text-4xl font-black text-amber-400 font-['Outfit']">
                      {formatINR(mobResult.eligibleAmount)}
                    </div>
                    <p className="text-xs text-slate-300">
                      Approx. EMI: <strong className="text-white">{formatINR(mobResult.approxEmi)}/month</strong> (at 8.5% for 20 yrs)
                    </p>
                    <span className="inline-block text-[10px] text-slate-400 italic">
                      *Indicative estimate subject to bank credit assessment.
                    </span>
                  </div>

                  {mobSubmittedEnquiry ? (
                    <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-950 text-center space-y-2">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                      <h4 className="font-bold text-sm">Enquiry Submitted!</h4>
                      <p className="text-xs">
                        Reference: <strong className="font-mono">{mobSubmittedEnquiry.id}</strong>
                      </p>
                      <button
                        onClick={() => {
                          setSearchId(mobSubmittedEnquiry.id);
                          setActiveTab('profile');
                        }}
                        className="px-4 py-2 rounded-xl bg-emerald-800 text-white font-bold text-xs"
                      >
                        Track Status
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <button
                        onClick={handleMobSubmitEnquiry}
                        className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <FileCheck className="w-4 h-4 stroke-[2.5]" />
                        <span>Submit Enquiry</span>
                      </button>

                      <a
                        href={`https://wa.me/${BLR15_OFFICE_DETAILS.whatsapp}?text=Hi%20BLR15,%20I%20checked%20my%20eligibility%20for%20${formatINR(mobResult.eligibleAmount)}%20and%20want%20expert%20advice.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3.5 rounded-xl bg-[#0B1B3D] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4 text-emerald-400" />
                        <span>Talk to Expert</span>
                      </a>

                      <button
                        onClick={() => setMobStep(1)}
                        className="w-full py-2 text-center text-xs text-slate-500 underline"
                      >
                        Start over
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

          {/* TAB 4: QUICK ENQUIRY */}
          {activeTab === 'enquiry' && (
            <div className="p-4 space-y-4">
              <div className="space-y-1">
                <h2 className="text-base font-black text-[#0B1B3D] font-['Outfit']">
                  Quick Home Loan Enquiry
                </h2>
                <p className="text-xs text-slate-500">
                  Connect directly with a Bangalore loan officer.
                </p>
              </div>

              {enqSubmitted ? (
                <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h3 className="text-sm font-bold text-[#0B1B3D]">Thank you for your enquiry</h3>
                  <p className="text-xs text-slate-500">
                    Our team will contact you shortly. Reference ID:
                  </p>
                  <div className="text-xl font-mono font-black text-amber-600">
                    {enqSubmitted.id}
                  </div>
                  <button
                    onClick={() => {
                      setSearchId(enqSubmitted.id);
                      setActiveTab('profile');
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#0B1B3D] text-white font-bold text-xs"
                  >
                    Track Status
                  </button>
                </div>
              ) : (
                <form onSubmit={handleQuickEnquirySubmit} className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anand Murthy"
                      value={enqForm.name}
                      onChange={e => setEnqForm({ ...enqForm, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 98450 12345"
                      value={enqForm.mobile}
                      onChange={e => setEnqForm({ ...enqForm, mobile: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase">Loan Amount Required</label>
                    <input
                      type="number"
                      step={100000}
                      value={enqForm.amount}
                      onChange={e => setEnqForm({ ...enqForm, amount: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase">Note</label>
                    <input
                      type="text"
                      placeholder="e.g. Looking for property in Jalahalli"
                      value={enqForm.message}
                      onChange={e => setEnqForm({ ...enqForm, message: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
                  >
                    Submit Enquiry
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 5: PROFILE & ENQUIRY STATUS TRACKER (Section 12 of prompt) */}
          {activeTab === 'profile' && (
            <div className="p-4 space-y-4">
              <div className="space-y-1">
                <h2 className="text-base font-black text-[#0B1B3D] font-['Outfit']">
                  Mobile Enquiry Status
                </h2>
                <p className="text-xs text-slate-500">
                  Track your application stage in real-time
                </p>
              </div>

              {/* Lookup Form */}
              <form onSubmit={handleTrackSearch} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enquiry ID (e.g. BLR15-0012)"
                  value={searchId}
                  onChange={e => setSearchId(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white uppercase font-mono"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-[#0B1B3D] text-amber-400 font-bold text-xs"
                >
                  Track
                </button>
              </form>

              {/* Status Box from Prompt Section 12:
                  Enquiry #BLR150012
                  Status: 🟡 New Enquiry
                  Timeline:
                  Enquiry Submitted -> Under Review -> Expert Contacted -> Documents Requested -> Application Process
              */}
              {trackedEnquiry ? (
                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">REFERENCE</span>
                      <span className="text-sm font-mono font-black text-[#0B1B3D]">
                        Enquiry #{trackedEnquiry.id}
                      </span>
                    </div>
                    <div>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        🟡 {trackedEnquiry.status}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600">
                    Applicant: <strong>{trackedEnquiry.customerName}</strong> • {formatINR(trackedEnquiry.requiredLoanAmount)}
                  </div>

                  {/* 5-step clean timeline */}
                  <div className="pt-2 space-y-2 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Application Stage
                    </span>

                    {[
                      { title: 'Enquiry Submitted', done: true },
                      { title: 'Under Review', done: trackedEnquiry.status !== 'New' },
                      { title: 'Expert Contacted', done: ['Contacted', 'Interested', 'Documents Requested', 'Application Started', 'Submitted to Lender', 'Approved', 'Converted'].includes(trackedEnquiry.status) },
                      { title: 'Documents Requested', done: ['Documents Requested', 'Application Started', 'Submitted to Lender', 'Approved', 'Converted'].includes(trackedEnquiry.status) },
                      { title: 'Application Process', done: ['Application Started', 'Submitted to Lender', 'Approved', 'Converted'].includes(trackedEnquiry.status) },
                    ].map((step, idx) => (
                      <div key={idx} className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                            step.done ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {step.done ? '✓' : idx + 1}
                        </div>
                        <span className={step.done ? 'font-bold text-slate-800' : 'text-slate-400'}>
                          {step.title}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <a
                      href={`https://wa.me/${BLR15_OFFICE_DETAILS.whatsapp}?text=Hi%20BLR15,%20inquiring%20about%20my%20enquiry%20${trackedEnquiry.id}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Contact Loan Desk</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                  No enquiry found for "{searchId}". Try sample ID <button onClick={() => setSearchId('BLR15-0012')} className="underline font-mono text-amber-700">BLR15-0012</button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* BOTTOM NAVIGATION from Prompt:
            Home | Loans | Eligibility | Enquiry | Profile
        */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200/90 px-2 py-2 flex items-center justify-around z-20 shadow-lg">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
              activeTab === 'home' ? 'text-[#0B1B3D]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Home className="w-5 h-5" strokeWidth={activeTab === 'home' ? 2.5 : 2} />
            <span className={`text-[10px] ${activeTab === 'home' ? 'font-bold text-amber-600' : 'font-medium'}`}>
              Home
            </span>
          </button>

          <button
            onClick={() => setActiveTab('home-loans')}
            className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
              activeTab === 'home-loans' ? 'text-[#0B1B3D]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Building className="w-5 h-5" strokeWidth={activeTab === 'home-loans' ? 2.5 : 2} />
            <span className={`text-[10px] ${activeTab === 'home-loans' ? 'font-bold text-amber-600' : 'font-medium'}`}>Home Loans</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('eligibility');
              setMobStep(1);
            }}
            className="flex flex-col items-center -mt-4"
          >
            <div className="w-11 h-11 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <FileCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-extrabold text-[#0B1B3D] mt-0.5">
              Eligibility
            </span>
          </button>

          <button
            onClick={() => setActiveTab('enquiry')}
            className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
              activeTab === 'enquiry' ? 'text-[#0B1B3D]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <PhoneCall className="w-5 h-5" strokeWidth={activeTab === 'enquiry' ? 2.5 : 2} />
            <span className={`text-[10px] ${activeTab === 'enquiry' ? 'font-bold text-amber-600' : 'font-medium'}`}>
              Enquiry
            </span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
              activeTab === 'profile' ? 'text-[#0B1B3D]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <User className="w-5 h-5" strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
            <span className={`text-[10px] ${activeTab === 'profile' ? 'font-bold text-amber-600' : 'font-medium'}`}>
              Status
            </span>
          </button>
        </div>

      </div>

    </div>
  );
};
