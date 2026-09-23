import React, { useState } from 'react';
import {
  Home,
  FileCheck,
  CheckCircle2,
  ChevronRight,
  Percent,
  Zap,
  UserCheck,
  ShieldCheck,
  Calculator,
  Sparkles,
  MapPin,
  Clock,
  ArrowUpRight,
  PhoneCall,
  Hammer,
  ArrowRight,
  ArrowRightLeft,
  Building2,
  CreditCard,
  Store,
  Briefcase,
  Scale,
  Coffee,
  Layers,
} from 'lucide-react';
import { calculateHomeLoanEmi, formatINR } from '../../services/storageService';
import { BLR15_OFFICE_DETAILS } from '../../data/initialData';

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
  const [selectedCategory] = useState<'home' | 'personal' | 'car'>(initialCategory);

  // Quick mini calculator in hero (same design as Home Page)
  const [quickAmount, setQuickAmount] = useState<number>(5000000); // 50 Lakhs
  const [quickTenure, setQuickTenure] = useState<number>(20);
  const [quickRate, setQuickRate] = useState<number>(8.5);

  const quickEmi = calculateHomeLoanEmi(quickAmount, quickRate, quickTenure);

  const heroHighlights = [
    'Salaried & Self-Employed Loans',
    'Quick Processing',
    'Minimum Documentation',
    'Attractive Interest Rates',
    'Balance Transfer & Top-Up Support',
  ];

  const servingDistricts = [
    'Bangalore',
    'Bangalore Rural',
    'Chikkaballapura',
    'Ramanagara',
    'Kolar',
    'Mandya',
    'Mysore',
    'Tumkur',
  ];

  const loanTypes = [
    {
      icon: Home,
      title: 'Sheet House Purchase',
      desc: 'Funding to purchase independent sheet-roofed houses with flexible documentation support.',
      type: 'Sheet House Purchase Loan',
    },
    {
      icon: Layers,
      title: 'Site Purchase & Construction Loan',
      desc: 'Combine plot or site purchase with construction funding under a single sanction.',
      type: 'Site Purchase and Construction Loan',
    },
    {
      icon: Building2,
      title: 'Flat Purchase Loan',
      desc: 'Ready or under-construction flats with approved projects from leading builders.',
      type: 'Flat Purchase Loan',
    },
    {
      icon: Store,
      title: 'Building Purchase Loan',
      desc: 'Purchase of an existing residential building or multi-unit property within city limits.',
      type: 'Building Purchase Loan',
    },
    {
      icon: Hammer,
      title: 'Construction Loan',
      desc: 'Stage-wise disbursement for self-construction on your own residential plot.',
      type: 'Construction Loan',
    },
    {
      icon: Sparkles,
      title: 'House Renovation Loan',
      desc: 'Upgrade, remodel and modernise your existing home with easy long-tenure funding.',
      type: 'House Renovation Loan',
    },
    {
      icon: Zap,
      title: 'House Extension Loan',
      desc: 'Add floors or extend the built-up area of your house at attractive interest rates.',
      type: 'House Extension Loan',
    },
    {
      icon: ArrowRightLeft,
      title: 'BT Loan From Any Bank / NBFC',
      desc: 'Balance transfer from any bank, NBFC or co-operative bank at a lower interest rate.',
      type: 'Home Loan Balance Transfer',
    },
  ];

  const challengeProfiles = [
    { icon: ShieldCheck, label: 'Police' },
    { icon: Building2, label: 'Builders' },
    { icon: Home, label: 'Real Estate' },
    { icon: CreditCard, label: 'Small Business Profile' },
    { icon: Hammer, label: 'Civil Contracts' },
    { icon: Store, label: 'Bar & Restaurant' },
    { icon: FileCheck, label: 'RTO Agents' },
    { icon: Store, label: 'Panipuri Shop' },
    { icon: Briefcase, label: 'Commission Agents Agency' },
    { icon: Store, label: 'Beeda Stall' },
    { icon: Scale, label: 'Advocate' },
    { icon: Coffee, label: 'Tea Shops' },
  ];

  const benefits = [
    {
      icon: Percent,
      title: 'Competitive Rates',
      desc: 'Explore home loan options from top nationalized banks & leading HFCs starting from 8.35% p.a.',
    },
    {
      icon: Zap,
      title: 'Simple Process',
      desc: 'Share your basic details through our simple 4-step eligibility check with zero confusion.',
    },
    {
      icon: UserCheck,
      title: 'Personalized Assistance',
      desc: 'A dedicated home loan advisor in Bangalore tailors solutions for your salary or business profile.',
    },
    {
      icon: ArrowRightLeft,
      title: 'Flexible Options',
      desc: 'Customized repayment choices, part-payment facilities and tenures extending up to 25 years.',
    },
    {
      icon: ShieldCheck,
      title: 'Transparent Process',
      desc: 'No hidden charges, honest eligibility calculations and continuous status tracking till sanction.',
    },
  ];

  const usps = [
    {
      title: 'WHY BLR15: FOR SENP CUSTOMER',
      headerClass: 'bg-amber-500 text-[#0B1B3D]',
      borderClass: 'border-amber-200',
      items: [
        'No ITR for loans up to 25 lakhs',
        'Home Loans up to 1.5 Cr for customer with only single year ITR',
        'Home Loan up to 25 years for SENP for Plot loans and Home loan',
        'Home loans for Advocates, Police personal, Jewellers, & Builders',
        'Home Loans up to 10 lakhs for people who do not have a permanent office set up (Fruit vendors, auto driver, small flower shop)',
        'LTV as per RBI norms even in affordable segment',
        'OCR not required if loan amount is registration value subject LTV support',
        'Pure cash rental income and 100% of the rental income will be considered',
      ],
    },
    {
      title: 'WHY BLR15: FOR SALARIED CUSTOMER',
      headerClass: 'bg-[#0B1B3D] text-white',
      borderClass: 'border-slate-200',
      items: [
        'Advantage Loans: Loans combining father and son income according to their retirement age and income will be considered up to 4 income earning members',
        'Home Loan tenure up to 25 years (Age of retirement 65 years - IMGC)',
        'Loans for employees working in Proprietor / Partnership concern',
        'Loans up to 15 lakhs for cash salary customers',
        'Loans for salaried customer with consolidated pay',
        'Plot Loans for salaried customers up to 25 years',
        'Home loans for Salaried customers with consolidated pay (no deductions) - Salary certificate is sufficient',
        'LTV as per RBI norms even in affordable segment',
      ],
    },
    {
      title: 'WHY BLR15: READY HOUSE PURCHASE',
      headerClass: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white',
      borderClass: 'border-orange-200',
      items: [
        'Passage property with a width of 3 ft',
        'Plot loan tenure up to 20 years',
        'Resale - Without Plan approval - 5 Yrs Property tax Required',
        'Resale Flat - Without Plan approval - 10 Yrs Property tax Required',
        'Properties with 10 Multi-tenant units',
        'Unapproved Plot purchase - Within Corporation & Municipal limits',
        'Properties with Non RCC roof considered as HL purchase and HL LTV',
        'No subdivision approval is required for subdivided plots for approved layout',
      ],
    },
    {
      title: 'WHY BLR15: LEGAL USP',
      headerClass: 'bg-blue-600 text-white',
      borderClass: 'border-blue-200',
      items: [
        'Property title tracing only for 13 years',
        'Loans up to 25 lakhs - Title tracing can be done from revenue documents and title docs can be even 6-month-old',
        'Katha is required only in the name of previous owner',
        'Grama Thana properties can be funded for Ready House Purchase and Self-construction loan',
        'Self Construction Cases without Plan Approval',
      ],
    },
    {
      title: 'MARKET VALUE FUNDING',
      headerClass: 'bg-emerald-600 text-white',
      borderClass: 'border-emerald-200',
      highlight: true,
      items: [
        'Loan up to 100% of registered value subject to LTV on Market Value',
        'Property can be registered only for Guideline value - LTV on Market Value',
        'Without OCR proof if loan amount equal to registration value',
      ],
    },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Check Eligibility',
      desc: 'Fill basic income & property details in 2 minutes to get your indicative eligible loan amount.',
    },
    {
      step: '02',
      title: 'Expert Consultation',
      desc: 'Our Bangalore loan officer contacts you to evaluate options from top nationalized & private banks.',
    },
    {
      step: '03',
      title: 'Document Pickup',
      desc: 'Hassle-free doorstep documentation & builder project approvals verification.',
    },
    {
      step: '04',
      title: 'Sanction & Disbursal',
      desc: 'Receive your formal loan sanction letter and smooth disbursal at your builder or seller registration.',
    },
  ];

  /* ───────────────── HOME LOAN VIEW ───────────────── */
  const renderHomeLoanView = () => (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#0B1B3D] via-[#0E224E] to-[#122A63] text-white pt-12 pb-20 overflow-hidden">
        {/* Decorative Grid & Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>BLR15 Home Loans • Salaried &amp; Self-Employed (Bangalore, Pin 560015)</span>
              </div>

              {/* Headings */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-['Outfit'] tracking-tight leading-[1.1]">
                  Your Dream Home, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200">
                    Our Commitment
                  </span>
                </h1>
                <p className="text-xl sm:text-2xl font-bold text-amber-400 font-['Outfit']">
                  Home Loans Made Easy With BLR15
                </p>
              </div>

              {/* Supporting Text */}
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
                From sheet house and flat purchase to site purchase, construction, renovation and
                balance transfer — we arrange home loans from leading banks &amp; NBFCs with minimum
                documentation and honest guidance.
              </p>

              {/* Trust Benefit Points */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {heroHighlights.map((point, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2 text-xs font-semibold text-slate-200 bg-white/5 border border-white/10 rounded-lg p-2.5 ${
                      i === heroHighlights.length - 1 ? 'col-span-2 sm:col-span-2' : ''
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                <button
                  onClick={() => onNavigate('eligibility')}
                  className="px-8 py-4 rounded-xl font-extrabold text-base bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-slate-950 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <FileCheck className="w-5 h-5 stroke-[2.5]" />
                  <span>Check Your Eligibility</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onOpenEnquiry('Home Loan')}
                  className="px-7 py-4 rounded-xl font-bold text-base bg-white/10 hover:bg-white/15 text-white border border-white/20 backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 text-amber-400" />
                  <span>Enquire Now</span>
                </button>
              </div>

              {/* Location pin note */}
              <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Office: {BLR15_OFFICE_DETAILS.fullAddress}</span>
              </div>
            </div>


            {/* Right Card: Quick Interactive Loan Estimator */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-2xl border border-slate-100 text-slate-800 relative">
                {/* Ribbon */}
                <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-md">
                  Instant Estimate
                </div>

                <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
                  <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold font-['Outfit'] text-[#0B1B3D]">
                      Quick EMI Calculator
                    </h2>
                    <p className="text-xs text-slate-500">
                      Calculate your approximate monthly outflow
                    </p>
                  </div>
                </div>

                {/* Sliders */}
                <div className="space-y-4">
                  {/* Amount Slider */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                      <span className="text-slate-600">Loan Amount:</span>
                      <span className="text-base font-extrabold text-[#0B1B3D] font-['Outfit']">
                        {formatINR(quickAmount)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1000000}
                      max={20000000}
                      step={500000}
                      value={quickAmount}
                      onChange={e => setQuickAmount(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>₹10 Lakhs</span>
                      <span>₹1 Crore</span>
                      <span>₹2 Crores</span>
                    </div>
                  </div>

                  {/* Tenure Slider */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                      <span className="text-slate-600">Tenure:</span>
                      <span className="text-sm font-bold text-[#0B1B3D]">
                        {quickTenure} Years ({quickTenure * 12} Months)
                      </span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={30}
                      step={1}
                      value={quickTenure}
                      onChange={e => setQuickTenure(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>5 Years</span>
                      <span>15 Years</span>
                      <span>30 Years</span>
                    </div>
                  </div>

                  {/* Interest Rate */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                      <span className="text-slate-600">Interest Rate (p.a.):</span>
                      <span className="text-sm font-bold text-amber-600">{quickRate}%</span>
                    </div>
                    <input
                      type="range"
                      min={7.5}
                      max={12}
                      step={0.1}
                      value={quickRate}
                      onChange={e => setQuickRate(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>
                </div>


                {/* Result Box */}
                <div className="mt-5 p-4 rounded-xl bg-gradient-to-br from-slate-900 to-[#0B1B3D] text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-amber-400/90 font-medium">Estimated Monthly EMI</span>
                      <div className="text-2xl sm:text-3xl font-black font-['Outfit'] text-amber-400">
                        {formatINR(quickEmi.emi)}
                        <span className="text-xs text-slate-300 font-normal">/mo</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400">Total Interest</span>
                      <div className="text-sm font-bold text-slate-200">
                        {formatINR(quickEmi.totalInterest)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="mt-5 space-y-2">
                  <button
                    onClick={() => onNavigate('eligibility', { loanAmount: quickAmount })}
                    className="w-full py-3 rounded-xl font-extrabold text-sm bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Check Your Exact Eligibility</span>
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                  <button
                    onClick={() => onNavigate('calculator')}
                    className="w-full py-2.5 rounded-xl font-bold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Calculator className="w-3.5 h-3.5 text-amber-600" />
                    <span>Open Full EMI Calculator</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <p className="text-[11px] text-center text-slate-500">
                    *Indicative calculation. Final sanction based on bank assessment.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust & Coverage Bar */}
      <section className="bg-white border-y border-slate-200 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-amber-600 block">
                Serving Districts Across Karnataka
              </span>
              <p className="text-sm font-semibold text-slate-700">
                Doorstep document collection &amp; builder project coordination
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {servingDistricts.map(district => (
                <span
                  key={district}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-900 transition-colors"
                >
                  {district}
                </span>
              ))}
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500 text-slate-950">
                + Other districts also
              </span>
            </div>
          </div>
        </div>
      </section>


      {/* Loan Types Section */}
      <section className="py-20 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold tracking-wide uppercase">
              Loan Types We Fund
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-['Outfit'] text-[#0B1B3D]">
              We Do Salaried &amp; Self-Employed Loans For
            </h2>
            <p className="text-slate-600 text-base">
              A complete range of home loan solutions — from purchase and construction to renovation
              and balance transfer, tailored to your profile.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loanTypes.map((loan, i) => {
              const Icon = loan.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#0B1B3D]/5 group-hover:bg-amber-500/10 text-[#0B1B3D] group-hover:text-amber-600 flex items-center justify-center transition-colors">
                        <Icon className="w-6 h-6 stroke-[2]" />
                      </div>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 group-hover:bg-amber-100 group-hover:text-amber-800 transition-colors">
                        Home Loan
                      </span>
                    </div>

                    <h3 className="text-lg font-extrabold text-[#0B1B3D] font-['Outfit'] mb-2 leading-snug">
                      {loan.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      {loan.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={() => onNavigate('eligibility', { loanType: loan.type })}
                      className="w-full py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FileCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                      Check Eligibility
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Flyer Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              {
                icon: Building2,
                title: 'Vendor BT Accepted',
                desc: 'Balance transfer from any Bank, NBFC or Co-Operative Bank with top-up at the same rate.',
              },
              {
                icon: FileCheck,
                title: 'Multiple Khatha Types',
                desc: 'A, B, 9 & 11A, 9 & 11 A, 11B and CMC Khatha properties are considered for funding.',
              },
              {
                icon: Percent,
                title: 'Loan Amount 10L to 15Cr',
                desc: 'Funding band from ₹10 Lakhs up to ₹15 Crores for eligible salaried & self-employed profiles.',
              },
            ].map((info, idx) => {
              const Icon = info.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-amber-400 hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center mb-5 shadow-md shadow-amber-500/20">
                    <Icon className="w-7 h-7 stroke-[2.2]" />
                  </div>
                  <h3 className="text-base font-extrabold text-[#0B1B3D] font-['Outfit'] mb-2">
                    {info.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {info.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* Challenge Profiles Section */}
      <section className="py-20 px-4 sm:px-6 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold tracking-wide uppercase">
              Profiles We Understand
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-['Outfit'] text-[#0B1B3D]">
              Challenges Profiles We Fund
            </h2>
            <p className="text-slate-600 text-base">
              Non-standard income profiles are our speciality — we structure the file correctly for
              the right bank or NBFC so approvals stay simple.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {challengeProfiles.map((profile, idx) => {
              const Icon = profile.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all duration-300 text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/20">
                    <Icon className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <span className="text-xs font-bold text-[#0B1B3D] leading-snug">
                    {profile.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => onOpenEnquiry('Home Loan')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-300 font-bold text-sm text-[#0B1B3D] hover:bg-slate-50 hover:border-slate-400 shadow-xs transition-colors cursor-pointer"
            >
              <span>Discuss My Profile With An Advisor</span>
              <ChevronRight className="w-4 h-4 text-amber-500" />
            </button>
          </div>
        </div>
      </section>

      {/* Home Loan Benefits Section */}
      <section className="py-20 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-white text-slate-800 text-xs font-bold tracking-wide uppercase border border-slate-200">
              Why BLR15 Home Loans
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-['Outfit'] text-[#0B1B3D]">
              Clear Benefits, Honest Advice
            </h2>
            <p className="text-slate-600 text-base">
              We make the home financing experience transparent and seamless from enquiry to property
              possession.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {benefits.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-amber-400 hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center mb-5 shadow-md shadow-amber-500/20">
                    <Icon className="w-7 h-7 stroke-[2.2]" />
                  </div>
                  <h3 className="text-base font-extrabold text-[#0B1B3D] font-['Outfit'] mb-2">
                    {b.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* USP Section */}
      <section className="py-20 px-4 sm:px-6 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold tracking-wide uppercase">
              Our Strengths
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-['Outfit'] text-[#0B1B3D]">
              For Our USP's
            </h2>
            <p className="text-slate-600 text-base">
              Real policy advantages we negotiate for our customers — salaried, self-employed and
              ready house purchase cases.
            </p>
          </div>

          {/* Top 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {usps.slice(0, 3).map((usp, idx) => (
              <div
                key={idx}
                className={`rounded-2xl overflow-hidden border ${usp.borderClass} bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col`}
              >
                <div className={`${usp.headerClass} py-3 px-4 text-center font-bold text-sm`}>
                  {usp.title}
                </div>
                <ol className="p-6 space-y-2.5 text-[13px] text-slate-700 list-decimal pl-9 leading-relaxed flex-1">
                  {usp.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>

          {/* Bottom 2 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {usps.slice(3).map((usp, idx) => (
              <div
                key={idx}
                className={`rounded-2xl overflow-hidden border ${usp.borderClass} bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col`}
              >
                <div className={`${usp.headerClass} py-3 px-4 text-center font-bold text-sm`}>
                  {usp.title}
                </div>
                <ol
                  className={`p-6 space-y-3 text-slate-700 list-decimal pl-9 leading-relaxed flex-1 ${
                    usp.highlight ? 'text-sm font-semibold text-slate-800' : 'text-[13px]'
                  }`}
                >
                  {usp.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => onNavigate('eligibility')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 font-extrabold text-sm text-slate-950 shadow-md shadow-amber-500/20 transition-colors cursor-pointer"
            >
              <FileCheck className="w-4 h-4 stroke-[2.5]" />
              <span>See How Much You Qualify For</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>


      {/* Workflow: Simple 4-Step Journey */}
      <section className="py-20 px-4 sm:px-6 bg-[#0B1B3D] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold tracking-wide uppercase border border-amber-400/30">
              Simple Step-by-Step Flow
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-['Outfit']">
              How BLR15 Works For You
            </h2>
            <p className="text-slate-300 text-base">
              From online eligibility assessment to doorstep document pickup and sanction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {workflowSteps.map((step, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xs relative"
              >
                <div className="text-4xl font-black text-amber-400 font-['Outfit'] mb-3 opacity-90">
                  {step.step}
                </div>
                <h3 className="text-lg font-bold text-white font-['Outfit'] mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => onNavigate('eligibility')}
              className="px-8 py-3.5 rounded-xl font-extrabold text-sm bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/30 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <FileCheck className="w-4 h-4 stroke-[2.5]" />
              <span>Start Your Eligibility Check Now</span>
            </button>
          </div>
        </div>
      </section>

      {/* Office & Direct Contact Section */}
      <section className="py-16 px-4 sm:px-6 bg-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider">
                  Visit or Call Our Office
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#0B1B3D] font-['Outfit']">
                  Ready to Get Your Home Loan?
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Contact your BLR15 home loan expert today, or walk into our office in Jalahalli West
                  / Kammagondanahalli for a one-on-one consultation with our senior loan advisors.
                </p>

                <div className="space-y-2 text-sm text-slate-700 pt-2">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <span className="font-medium text-slate-800">
                      {BLR15_OFFICE_DETAILS.fullAddress}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{BLR15_OFFICE_DETAILS.workingHours}</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-3">
                <button
                  onClick={() => onNavigate('eligibility')}
                  className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm text-center flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition-colors cursor-pointer"
                >
                  <FileCheck className="w-4 h-4 stroke-[2.5]" />
                  <span>Check Eligibility</span>
                </button>

                <a
                  href={`tel:${BLR15_OFFICE_DETAILS.phone}`}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#0B1B3D] hover:bg-[#122A63] text-white font-bold text-sm text-center flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <PhoneCall className="w-4 h-4 text-amber-400" />
                  <span>Call {BLR15_OFFICE_DETAILS.phone}</span>
                </a>

                <a
                  href={`https://wa.me/${BLR15_OFFICE_DETAILS.whatsapp}?text=Hello%20BLR15%20Team,%20I%20would%20like%20to%20discuss%20a%20home%20loan.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm text-center flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <span>Chat on WhatsApp</span>
                </a>

                <button
                  onClick={() => onNavigate('contact')}
                  className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs text-center transition-colors cursor-pointer"
                >
                  View Map &amp; Contact Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  /* ───────────────── OTHER CATEGORY VIEW (Personal / Car) ───────────────── */
  const renderOtherCategoryView = () => {
    const pageTitle = selectedCategory === 'personal' ? 'Personal Loans Made Simple' : 'Car Loans Made Simple';

    const bankRates = [
      { bank: 'SBI', rate: '10.55% - 12.05%', fee: 'Up to 1%', emi: '₹2,149' },
      { bank: 'HDFC Bank', rate: '10.50% - 21.00%', fee: 'Up to 2.50%', emi: '₹2,149' },
      { bank: 'ICICI Bank', rate: '10.75% - 19.00%', fee: 'Up to 2.50%', emi: '₹2,162' },
    ];

    return (
      <div className="min-h-screen bg-slate-50 font-sans pb-20">
        <section className="bg-[#0B1B3D] pt-16 pb-32 px-4 relative overflow-hidden">
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <h1 className="text-4xl lg:text-5xl font-black text-white font-['Outfit'] leading-tight mb-6">
              {pageTitle}
            </h1>
            <button
              onClick={() => onNavigate('eligibility')}
              className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-[#0B1B3D] font-bold rounded-xl transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              Check Eligibility <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>
        <section className="max-w-4xl mx-auto px-4 -mt-16 relative z-20 mb-16">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 bg-slate-50">
              <h2 className="text-xl font-bold text-[#0B1B3D]">Compare Top Bank Rates</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 text-xs uppercase border-b border-slate-200">
                    <th className="p-4 font-bold">Bank</th>
                    <th className="p-4 font-bold">Interest Rate</th>
                    <th className="p-4 font-bold">Processing Fee</th>
                    <th className="p-4 font-bold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {bankRates.map((bank, idx) => (
                    <tr key={idx}>
                      <td className="p-4 font-bold text-[#0B1B3D]">{bank.bank}</td>
                      <td className="p-4 font-bold text-amber-600">{bank.rate}</td>
                      <td className="p-4 text-slate-600">{bank.fee}</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => onOpenEnquiry(bank.bank)}
                          className="px-4 py-2 bg-[#0B1B3D] hover:bg-slate-800 text-white text-xs font-bold rounded-lg cursor-pointer"
                        >
                          Apply
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    );
  };

  return selectedCategory === 'home' ? renderHomeLoanView() : renderOtherCategoryView();
};


