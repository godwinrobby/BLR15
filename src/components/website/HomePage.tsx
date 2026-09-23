import React, { useState } from 'react';
import {
  FileCheck,
  PhoneCall,
  CheckCircle2,
  Percent,
  Zap,
  ArrowRightLeft,
  UserCheck,
  Home,
  Hammer,
  BadgePlus,
  ShieldCheck,
  ChevronRight,
  Calculator,
  Building,
  Sparkles,
  MapPin,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { calculateHomeLoanEmi, formatINR } from '../../services/storageService';
import { BLR15_OFFICE_DETAILS } from '../../data/initialData';

interface HomePageProps {
  onNavigate: (tab: string, state?: any) => void;
  onOpenEnquiry: (loanType?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenEnquiry }) => {
  // Quick mini calculator in hero
  const [quickAmount, setQuickAmount] = useState<number>(5000000); // 50 Lakhs
  const [quickTenure, setQuickTenure] = useState<number>(20);
  const [quickRate, setQuickRate] = useState<number>(8.5);

  const quickEmi = calculateHomeLoanEmi(quickAmount, quickRate, quickTenure);

  const loanServices = [
    {
      id: 'purchase',
      title: 'Home Purchase Loan',
      type: 'Home Purchase Loan',
      icon: Home,
      tag: 'Most Popular',
      desc: 'For purchasing a new apartment, ready villa, or resale residential property across Bangalore.',
      rate: '8.35%*',
      tenure: 'Up to 30 Years',
      features: ['Up to 80% - 90% property funding', 'Easy paperwork & doorstep pickup', 'Approved projects assistance'],
    },
    {
      id: 'construction',
      title: 'Home Construction Loan',
      type: 'Home Construction Loan',
      icon: Hammer,
      tag: 'Plot & Build',
      desc: 'For constructing your dream individual house or villa on your own residential plot.',
      rate: '8.45%*',
      tenure: 'Up to 25 Years',
      features: ['Stage-wise disbursement matching construction', 'Includes plot purchase + build funding', 'Technical assessment support'],
    },
    {
      id: 'transfer',
      title: 'Balance Transfer',
      type: 'Home Loan Balance Transfer',
      icon: ArrowRightLeft,
      tag: 'Save Money',
      desc: 'Transfer your existing high-interest home loan from any bank to lower interest rates.',
      rate: '8.35%*',
      tenure: 'Retain or extend tenure',
      features: ['Substantial reduction in monthly EMI', 'Nil or low transfer charges', 'Top-up sanction at same rate'],
    },
    {
      id: 'topup',
      title: 'Home Loan Top-Up',
      type: 'Home Loan Top-Up',
      icon: BadgePlus,
      tag: 'Extra Liquidity',
      desc: 'Additional funds for home renovation, interior design, extension, or personal needs.',
      rate: '8.65%*',
      tenure: 'Same as home loan',
      features: ['Minimal documentation for existing borrowers', 'Lowest rates compared to personal loans', 'Immediate disbursal upon approval'],
    },
  ];

  const benefits = [
    {
      icon: Percent,
      title: 'Competitive Rates',
      desc: 'Explore available home loan options from top nationalized banks & leading HFCs starting from 8.35% p.a.',
    },
    {
      icon: Zap,
      title: 'Simple Process',
      desc: 'Submit your basic information through our simple 4-step eligibility check with zero confusion.',
    },
    {
      icon: UserCheck,
      title: 'Personalized Assistance',
      desc: 'Dedicated home loan advisor in Bangalore assigns tailored solutions for your salary or business profile.',
    },
    {
      icon: ArrowRightLeft,
      title: 'Flexible Options',
      desc: 'Customized repayment choices, part-payment facilities, and tenure extending up to 30 years.',
    },
    {
      icon: ShieldCheck,
      title: 'Transparent Process',
      desc: 'No hidden charges, honest eligibility calculations, and continuous status tracking from enquiry to sanction.',
    },
  ];

  const bangaloreLocations = [
    'Jalahalli West',
    'Kammagondanahalli',
    'Peenya',
    'Vidyaranyapura',
    'Yelahanka',
    'Hebbal',
    'Yeshwanthpur',
    'Sahakar Nagar',
    'Electronic City',
    'Whitefield',
  ];

  return (
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
                <span>BLR15 Home Loans • Bangalore (Pin 560015)</span>
              </div>

              {/* Headings from Prompt */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-['Outfit'] tracking-tight leading-[1.1]">
                  Turn Your Dreams <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200">
                    Into Homes
                  </span>
                </h1>
                <p className="text-xl sm:text-2xl font-bold text-amber-400 font-['Outfit']">
                  Your Dream Home, Our Commitment
                </p>
              </div>

              {/* Supporting Text from Prompt */}
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
                Get personalized assistance for your home loan requirements with a simple and hassle-free eligibility process. We partner with top banks to bring you competitive rates and quick approvals.
              </p>

              {/* Trust Benefit Points */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 bg-white/5 border border-white/10 rounded-lg p-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Competitive Rates</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 bg-white/5 border border-white/10 rounded-lg p-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Quick Processing</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 bg-white/5 border border-white/10 rounded-lg p-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Top-Up & Transfer</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 bg-white/5 border border-white/10 rounded-lg p-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Personalized Service</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 bg-white/5 border border-white/10 rounded-lg p-2.5 col-span-2 sm:col-span-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Funding for Your Dream Home</span>
                </div>
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
                  onClick={() => onOpenEnquiry()}
                  className="px-7 py-4 rounded-xl font-bold text-base bg-white/10 hover:bg-white/15 text-white border border-white/20 backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 text-amber-400" />
                  <span>Enquire Now</span>
                </button>
              </div>

              {/* Location pin note */}
              <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Office: Kammagondanahalli Main Road, Jalahalli West, Bangalore – 560015</span>
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
                      <span className="text-sm font-bold text-amber-600">
                        {quickRate}%
                      </span>
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

                {/* CTA to Full Eligibility Check */}
                <div className="mt-5 space-y-2">
                  <button
                    onClick={() => onNavigate('eligibility', { loanAmount: quickAmount })}
                    className="w-full py-3 rounded-xl font-extrabold text-sm bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Check Your Exact Eligibility</span>
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
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
                Local Expertise in Bangalore
              </span>
              <p className="text-sm font-semibold text-slate-700">
                Serving key residential zones with doorstep document collection
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {bangaloreLocations.map(loc => (
                <span
                  key={loc}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-900 transition-colors"
                >
                  {loc}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold tracking-wide uppercase">
              Our Loan Offerings
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-['Outfit'] text-[#0B1B3D]">
              Home Loans Made Simple
            </h2>
            <p className="text-slate-600 text-base">
              Find a home loan solution suited to your financial requirements with transparent terms and dedicated guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loanServices.map(service => {
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#0B1B3D]/5 group-hover:bg-amber-500/10 text-[#0B1B3D] group-hover:text-amber-600 flex items-center justify-center transition-colors">
                        <Icon className="w-6 h-6 stroke-[2]" />
                      </div>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 group-hover:bg-amber-100 group-hover:text-amber-800 transition-colors">
                        {service.tag}
                      </span>
                    </div>

                    <h3 className="text-xl font-extrabold text-[#0B1B3D] font-['Outfit'] mb-2">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      {service.desc}
                    </p>

                    <div className="bg-slate-50 rounded-xl p-3 mb-4 space-y-1.5 border border-slate-100">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">Starting Rate:</span>
                        <span className="font-bold text-amber-600">{service.rate}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">Max Tenure:</span>
                        <span className="font-semibold text-slate-700">{service.tenure}</span>
                      </div>
                    </div>

                    <ul className="space-y-1.5 text-xs text-slate-600 mb-6">
                      {service.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <button
                      onClick={() => onNavigate('eligibility', { loanType: service.type })}
                      className="w-full py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FileCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                      Check Eligibility
                    </button>
                    <button
                      onClick={() => onOpenEnquiry(service.type)}
                      className="w-full py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#0B1B3D] hover:bg-slate-100 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Enquire Now</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => onNavigate('loans')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-300 font-bold text-sm text-[#0B1B3D] hover:bg-slate-50 hover:border-slate-400 shadow-xs transition-colors"
            >
              <span>View Detailed Loan Types & Criteria</span>
              <ChevronRight className="w-4 h-4 text-amber-500" />
            </button>
          </div>
        </div>
      </section>

      {/* Home Loan Benefits Section */}
      <section className="py-20 px-4 sm:px-6 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold tracking-wide uppercase">
              Why BLR15 Home Loans
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-['Outfit'] text-[#0B1B3D]">
              Clear Benefits, Honest Advice
            </h2>
            <p className="text-slate-600 text-base">
              We make the home financing experience transparent and seamless from enquiry to property possession.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {benefits.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-2xl p-6 border border-slate-200/70 hover:border-amber-400 hover:bg-amber-50/20 transition-all flex flex-col items-center text-center"
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
            {[
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
                desc: 'Receive formal loan sanction letter and smooth disbursal at your builder or seller registration.',
              },
            ].map((step, i) => (
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
        <div className="max-w-7xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider">
                Visit or Call Our Office
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0B1B3D] font-['Outfit']">
                BLR15 Home Loans Bangalore Office
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Prefer to meet in person? Walk into our office in Jalahalli West / Kammagondanahalli for coffee and a one-on-one consultation with our senior loan advisors.
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
                href={`https://wa.me/${BLR15_OFFICE_DETAILS.whatsapp}?text=Hello%20BLR15%20Team,%20I%20would%20like%20to%20discuss%20a%20home%20loan.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm text-center flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <span>Chat on WhatsApp</span>
              </a>

              <button
                onClick={() => onNavigate('contact')}
                className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs text-center transition-colors"
              >
                View Map & Contact Details
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
