import React, { useState, useEffect } from 'react';
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
import { TestimonialSection } from '../common/TestimonialSection';

interface HomeLoansPageProps {
  onNavigate: (tab: string, state?: any) => void;
  onOpenEnquiry: (loanType?: string) => void;
  initialCategory?: 'home' | 'personal' | 'car';
}

// Hero quick-calculator defaults per loan category (aligned with the enquiry / EMI presets)
const QUICK_CALC_DEFAULTS: Record<'home' | 'personal' | 'car', { amount: number; tenure: number; rate: number }> = {
  home: { amount: 5000000, tenure: 20, rate: 8.5 },
  personal: { amount: 500000, tenure: 3, rate: 10.49 },
  car: { amount: 1200000, tenure: 7, rate: 8.75 },
};

export const HomeLoansPage: React.FC<HomeLoansPageProps> = ({
  onNavigate,
  onOpenEnquiry,
  initialCategory = 'home',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'home' | 'personal' | 'car'>(initialCategory);

  // Quick mini calculator in hero (same design as Home Page)
  const [quickAmount, setQuickAmount] = useState<number>(QUICK_CALC_DEFAULTS[initialCategory].amount);
  const [quickTenure, setQuickTenure] = useState<number>(QUICK_CALC_DEFAULTS[initialCategory].tenure);
  const [quickRate, setQuickRate] = useState<number>(QUICK_CALC_DEFAULTS[initialCategory].rate);

  // Keep the visible category and calculator defaults in sync when the routed category changes
  useEffect(() => {
    const defaults = QUICK_CALC_DEFAULTS[initialCategory];
    setSelectedCategory(initialCategory);
    setQuickAmount(defaults.amount);
    setQuickTenure(defaults.tenure);
    setQuickRate(defaults.rate);
  }, [initialCategory]);

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

  const ourServices = [
    'ROI starts from 8%',
    'Fast Approval Process',
    'CIBIL Min 650',
    'Minimum Documentation',
    'We Do NRI Files',
    'We Do Minimum 200 sqft',
    'We Do Commercial Property Purchase',
    'We Do Rajkaluve Property',
    'We Do Without ITR',
    'No Income Proof Required',
    'We Do Cash Salary',
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

      {/* Our Services Section */}
      <section className="py-16 px-4 sm:px-6 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold tracking-wide uppercase">
              Our Services
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-['Outfit'] text-[#0B1B3D]">
              What We Arrange For You
            </h2>
            <p className="text-slate-600 text-base">
              Home loans arranged from leading banks &amp; NBFCs with flexible eligibility, minimum
              paperwork and support for non-standard income and property profiles.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-6 sm:p-8 lg:p-10">
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-4">
              {ourServices.map((service, i) => (
                <li
                  key={i}
                  className={`flex items-start gap-3 ${
                    i === ourServices.length - 1 ? 'sm:col-span-2 lg:col-span-2' : ''
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 stroke-[2.5]" />
                  <span className="text-sm font-semibold text-slate-700 leading-snug">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => onNavigate('eligibility')}
              className="px-8 py-3.5 rounded-xl font-extrabold text-sm bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/30 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <FileCheck className="w-4 h-4 stroke-[2.5]" />
              <span>Check Eligibility For These Services</span>
              <ChevronRight className="w-4 h-4" />
            </button>
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

          {/* Bullet list of loan types */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8 lg:p-10">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
              {loanTypes.map((loan, i) => {
                const Icon = loan.icon;
                return (
                  <li key={i}>
                    <button
                      onClick={() => onNavigate('eligibility', { loanType: loan.type })}
                      className="w-full text-left flex items-start gap-3.5 p-2.5 -m-2.5 rounded-xl hover:bg-amber-50/70 transition-colors group cursor-pointer"
                    >
                      <span className="mt-0.5 w-9 h-9 rounded-full bg-amber-500/10 text-amber-600 group-hover:bg-amber-500 group-hover:text-slate-950 flex items-center justify-center shrink-0 transition-colors">
                        <Icon className="w-[18px] h-[18px] stroke-[2.2]" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-extrabold text-[#0B1B3D] font-['Outfit'] leading-snug">
                          {loan.title}
                        </span>
                        <span className="block text-xs text-slate-500 leading-relaxed mt-1">
                          {loan.desc}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Flyer bullet highlights */}
            <ul className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
              {[
                {
                  title: 'Vendor BT Accepted',
                  desc: 'Balance transfer from any Bank, NBFC or Co-Operative Bank with top-up at the same rate.',
                },
                {
                  title: 'Multiple Khatha Types',
                  desc: 'A, B, 9 & 11A, 9 & 11 A, 11B and CMC Khatha properties are considered for funding.',
                },
                {
                  title: 'Loan Amount 10L to 15Cr',
                  desc: 'Funding band from ₹10 Lakhs up to ₹15 Crores for eligible salaried & self-employed profiles.',
                },
              ].map((info, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 stroke-[2.5]" />
                  <span>
                    <span className="block text-sm font-extrabold text-[#0B1B3D] font-['Outfit']">
                      {info.title}
                    </span>
                    <span className="block text-xs text-slate-500 leading-relaxed mt-1">
                      {info.desc}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            {/* Card footer CTA */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-500 text-center sm:text-left">
                Salaried, self-employed and non-standard income profiles are all welcome.
              </p>
              <button
                onClick={() => onNavigate('eligibility', { loanType: 'Home Purchase Loan' })}
                className="px-6 py-3 rounded-xl font-extrabold text-sm bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 transition-colors inline-flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <FileCheck className="w-4 h-4 stroke-[2.5]" />
                <span>Check Eligibility</span>
              </button>
            </div>
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

          {/* Bullet list of challenge profiles */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-6 sm:p-8 lg:p-10">
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-4">
              {challengeProfiles.map((profile, idx) => {
                const Icon = profile.icon;
                return (
                  <li key={idx} className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 stroke-[2.2]" />
                    </span>
                    <span className="text-sm font-semibold text-slate-700 leading-snug">
                      {profile.label}
                    </span>
                  </li>
                );
              })}
            </ul>
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

      <TestimonialSection category="home" />

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
    const isPersonal = selectedCategory === 'personal';

    const content = isPersonal
      ? {
          badge: 'BLR15 Personal Loans • Instant & Unsecured (Bangalore)',
          headingTop: 'Personal Loans,',
          headingHighlight: 'Made Simple',
          subHeading: 'Zero Collateral. Fast Disbursal.',
          description:
            'Cover wedding expenses, medical emergencies, travel, education or any personal requirement with 100% paperless processing, no collateral security and a flexible repayment tenure.',
          highlights: [
            'No Collateral Required',
            'Instant Approval Process',
            '100% Paperless Processing',
            'Attractive Interest Rates',
            'Flexible Repayment Tenure',
          ],
          enquiryType: 'Personal Loan',
          calculatorTitle: 'Quick Personal Loan EMI',
          amountSlider: {
            min: 50000,
            max: 4000000,
            step: 25000,
            labels: ['₹50 Thousand', '₹20 Lakhs', '₹40 Lakhs'],
          },
          tenureSlider: { min: 1, max: 7, labels: ['1 Year', '4 Years', '7 Years'] },
          rateSlider: { min: 10.25, max: 20, step: 0.05 },
        }
      : {
          badge: 'BLR15 Car Loans • New, Used & EV (Bangalore)',
          headingTop: 'Car Loans,',
          headingHighlight: 'Drive Home Today',
          subHeading: 'Up to 100% On-Road Funding',
          description:
            'Finance your new car, used car or electric vehicle with quick sanctions, special EV rates, pre-approved dealer tie-ups and repayment tenures up to 8 years.',
          highlights: [
            'Up to 100% On-Road Funding',
            'Special Rates for EVs',
            'Quick Sanction Process',
            'Pre-Approved Dealer Tie-Ups',
            'Tenure up to 8 Years',
          ],
          enquiryType: 'Car Loan',
          calculatorTitle: 'Quick Car Loan EMI',
          amountSlider: {
            min: 100000,
            max: 10000000,
            step: 50000,
            labels: ['₹1 Lakh', '₹50 Lakhs', '₹1 Crore'],
          },
          tenureSlider: { min: 1, max: 8, labels: ['1 Year', '5 Years', '8 Years'] },
          rateSlider: { min: 8.25, max: 14, step: 0.05 },
        };

    const bankRates = [
      { bank: 'SBI', rate: '10.55% - 12.05%', fee: 'Up to 1%' },
      { bank: 'HDFC Bank', rate: '10.50% - 21.00%', fee: 'Up to 2.50%' },
      { bank: 'ICICI Bank', rate: '10.75% - 19.00%', fee: 'Up to 2.50%' },
    ];

    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        {/* Hero Section (same design as Home Page) */}
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
                  <span>{content.badge}</span>
                </div>

                {/* Headings */}
                <div className="space-y-3">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-['Outfit'] tracking-tight leading-[1.1]">
                    {content.headingTop} <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200">
                      {content.headingHighlight}
                    </span>
                  </h1>
                  <p className="text-xl sm:text-2xl font-bold text-amber-400 font-['Outfit']">
                    {content.subHeading}
                  </p>
                </div>

                {/* Supporting Text */}
                <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
                  {content.description}
                </p>

                {/* Trust Benefit Points */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  {content.highlights.map((point, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2 text-xs font-semibold text-slate-200 bg-white/5 border border-white/10 rounded-lg p-2.5 ${
                        i === content.highlights.length - 1 ? 'col-span-2 sm:col-span-2' : ''
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
                    onClick={() => onNavigate('eligibility', { loanType: content.enquiryType })}
                    className="px-8 py-4 rounded-xl font-extrabold text-base bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-slate-950 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    <FileCheck className="w-5 h-5 stroke-[2.5]" />
                    <span>Check Your Eligibility</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onOpenEnquiry(content.enquiryType)}
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
                        {content.calculatorTitle}
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
                        min={content.amountSlider.min}
                        max={content.amountSlider.max}
                        step={content.amountSlider.step}
                        value={quickAmount}
                        onChange={e => setQuickAmount(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                        <span>{content.amountSlider.labels[0]}</span>
                        <span>{content.amountSlider.labels[1]}</span>
                        <span>{content.amountSlider.labels[2]}</span>
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
                        min={content.tenureSlider.min}
                        max={content.tenureSlider.max}
                        step={1}
                        value={quickTenure}
                        onChange={e => setQuickTenure(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                        <span>{content.tenureSlider.labels[0]}</span>
                        <span>{content.tenureSlider.labels[1]}</span>
                        <span>{content.tenureSlider.labels[2]}</span>
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
                        min={content.rateSlider.min}
                        max={content.rateSlider.max}
                        step={content.rateSlider.step}
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
                      onClick={() => onNavigate('eligibility', { loanAmount: quickAmount, loanType: content.enquiryType })}
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
                      *Indicative calculation. Final offer based on bank assessment.
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
                  Doorstep document collection &amp; dedicated advisor support
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

        {/* Compare Bank Rates Section */}
        <section className="py-20 px-4 sm:px-6 bg-slate-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
              <span className="px-3.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold tracking-wide uppercase">
                Compare Before You Apply
              </span>
              <h2 className="text-3xl sm:text-4xl font-black font-['Outfit'] text-[#0B1B3D]">
                Compare Top Bank Rates
              </h2>
              <p className="text-slate-600 text-base">
                Indicative interest rates and processing fees from leading banks. The final offer
                depends on your income profile, employer category and credit score.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
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
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-bold text-[#0B1B3D]">{bank.bank}</td>
                        <td className="p-4 font-bold text-amber-600">{bank.rate}</td>
                        <td className="p-4 text-slate-600">{bank.fee}</td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => onOpenEnquiry(content.enquiryType)}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors cursor-pointer"
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

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onNavigate('eligibility', { loanType: content.enquiryType, loanAmount: quickAmount })}
                className="px-8 py-3.5 rounded-xl font-extrabold text-sm bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/30 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <FileCheck className="w-4 h-4 stroke-[2.5]" />
                <span>Check Your Eligibility</span>
              </button>
              <button
                onClick={() => onNavigate('calculator')}
                className="px-7 py-3.5 rounded-xl font-bold text-sm bg-white border border-slate-300 text-[#0B1B3D] hover:bg-slate-50 hover:border-slate-400 transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <Calculator className="w-4 h-4 text-amber-600" />
                <span>Calculate Full EMI Schedule</span>
                <ChevronRight className="w-4 h-4 text-amber-500" />
              </button>
            </div>
          </div>
        </section>

        <TestimonialSection category={selectedCategory} />

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
                    Talk To A {isPersonal ? 'Personal' : 'Car'} Loan Advisor
                  </h2>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Call or WhatsApp us to know the best available {isPersonal ? 'personal' : 'car'} loan
                    offer for your profile, or visit our Jalahalli West office for a one-on-one consultation.
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
                  <a
                    href={`tel:${BLR15_OFFICE_DETAILS.phone}`}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#0B1B3D] hover:bg-[#122A63] text-white font-bold text-sm text-center flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <PhoneCall className="w-4 h-4 text-amber-400" />
                    <span>Call {BLR15_OFFICE_DETAILS.phone}</span>
                  </a>

                  <a
                    href={`https://wa.me/${BLR15_OFFICE_DETAILS.whatsapp}?text=Hello%20BLR15%20Team,%20I%20would%20like%20to%20discuss%20a%20${isPersonal ? 'personal' : 'car'}%20loan.`}
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
  };

  return selectedCategory === 'home' ? renderHomeLoanView() : renderOtherCategoryView();
};


