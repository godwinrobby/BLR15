import React, { useState } from 'react';
import {
  Home, FileCheck, CheckCircle2, ChevronDown, ChevronUp,
  Percent, Building2, ShieldCheck, CreditCard,
  ArrowRight, IndianRupee, Zap, MapPin,
  Store, Briefcase, Scale, Coffee, Hammer, FileText, Phone
} from 'lucide-react';

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

  /* ───────────────── HOME LOAN VIEW ───────────────── */
  const renderHomeLoanView = () => (
    <div className="min-h-screen bg-white font-sans">

      {/* ━━━ HERO ━━━ */}
      <section className="relative bg-[#0B1B3D] overflow-hidden">
        {/* decorative blobs */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-blue-500/8 blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-20 lg:pt-20 lg:pb-28 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
          {/* left */}
          <div className="space-y-5 text-center lg:text-left">
            <p className="text-amber-400 text-lg md:text-xl font-semibold italic tracking-wide">
              Your Dream — Our Support
            </p>
            <h1 className="text-white font-['Outfit'] font-black text-4xl md:text-5xl lg:text-[56px] leading-[1.1] uppercase">
              Home Loan<br />
              <span className="text-2xl md:text-3xl font-bold normal-case">Made Easy With</span><br />
              <span className="inline-block mt-2 bg-amber-500 text-[#0B1B3D] px-5 py-1.5 rounded-lg text-3xl md:text-4xl shadow-lg shadow-amber-500/30">
                BLR15
              </span>
            </h1>

            {/* 4 badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              {[
                { icon: Zap, label: 'Quick Approval', color: 'bg-blue-500/20 text-blue-300' },
                { icon: Percent, label: 'Attractive Interest Rates', color: 'bg-amber-500/20 text-amber-300' },
                { icon: FileText, label: 'Minimum Documentation', color: 'bg-emerald-500/20 text-emerald-300' },
                { icon: Home, label: 'Loans Up To 25 Lakhs*', color: 'bg-purple-500/20 text-purple-300' },
              ].map((b, i) => (
                <div key={i} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/5 backdrop-blur border border-white/10">
                  <div className={`w-10 h-10 rounded-full ${b.color} flex items-center justify-center`}>
                    <b.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-white/90 text-center leading-tight uppercase tracking-wide">
                    {b.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* right — lead form */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md mx-auto lg:mx-0 w-full">
            <h3 className="text-lg font-bold text-[#0B1B3D] mb-5 text-center font-['Outfit']">
              Apply For Home Loan
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Loan Amount Needed</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input type="text" placeholder="e.g. 15,00,000" className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">+91</span>
                  <input type="tel" placeholder="9876543210" className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50" />
                </div>
              </div>
              <button
                onClick={() => onNavigate('eligibility')}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-[#0B1B3D] font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md shadow-amber-500/20 cursor-pointer"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[10px] text-slate-400 text-center">
                By proceeding you agree to our Terms & Conditions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ LOAN TYPES + CHALLENGE PROFILES ━━━ */}
      <section className="bg-slate-50 py-14 sm:py-16 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ── Left: Loan Types ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="bg-[#0B1B3D] px-6 py-4">
              <h2 className="text-white font-bold text-base md:text-lg text-center tracking-wide">
                WE DO SALARIED & SELF EMPLOYED LOANS FOR
              </h2>
            </div>
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <ul className="space-y-3">
                {[
                  'Sheet House Purchase',
                  'Site Purchase and Construction Loan',
                  'Flat Purchase Loan',
                  'Building Purchase Loan',
                  'Construction Loan',
                  'House Renovation Loan',
                  'House Extension Loan',
                  'BT Loan from any NBFC & Bank',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              {/* motivational banner */}
              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                <Home className="w-6 h-6 text-amber-600 mx-auto mb-1" />
                <p className="text-sm font-bold text-[#0B1B3D]">Your Dream Home is Closer Than You Think!</p>
              </div>

              {/* info pills */}
              <div className="mt-5 space-y-3">
                {[
                  { icon: Building2, text: 'Vendor BT from any Bank, NBFC, Co Operative Bank', bg: 'bg-blue-50 border-blue-100', iconColor: 'text-blue-600' },
                  { icon: FileCheck, text: 'A, B, 9 & 11A, 9 & 11 A, 11B, CMC Khatha', bg: 'bg-amber-50 border-amber-100', iconColor: 'text-amber-600' },
                  { icon: IndianRupee, text: 'Loan Amount: 10L to 15Cr', bg: 'bg-emerald-50 border-emerald-100', iconColor: 'text-emerald-600' },
                ].map((info, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${info.bg}`}>
                    <info.icon className={`w-5 h-5 shrink-0 ${info.iconColor}`} />
                    <span className="text-sm font-semibold text-[#0B1B3D]">{info.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Challenge Profiles ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="bg-[#0B1B3D] px-6 py-4">
              <h2 className="text-white font-bold text-base md:text-lg text-center tracking-wide">
                CHALLENGES PROFILES WE FUND
              </h2>
            </div>
            <div className="p-6 sm:p-8 flex-1">
              <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                {[
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
                ].map((p, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <p.icon className="w-[18px] h-[18px]" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{p.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Serving Regions pill */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
            <MapPin className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-sm text-slate-700">
              <span className="font-bold text-[#0B1B3D]">SERVING: </span>
              Bangalore, Bangalore Rural, Chikkaballapura, Ramanagara, Kolar, Mandya, Mysore, Tumkur, and other districts also.
            </p>
          </div>
        </div>
      </section>

      {/* ━━━ USP'S ━━━ */}
      <section className="py-14 sm:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold tracking-widest mb-2">
              WHY BLR15
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-[#0B1B3D] font-['Outfit']">
              FOR OUR USP's
            </h2>
          </div>

          {/* 3 column cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* SENP */}
            <div className="rounded-2xl overflow-hidden border border-amber-200 bg-white shadow-sm">
              <div className="bg-amber-500 text-[#0B1B3D] py-3 px-4 text-center font-bold text-sm">
                WHY BLR15: FOR SENP CUSTOMER
              </div>
              <ol className="p-5 space-y-2.5 text-[13px] text-slate-700 list-decimal pl-8 leading-relaxed">
                <li>No ITR for loans up to 25 lakhs</li>
                <li>Home Loans up to 1.5 Cr for customer with only single year ITR</li>
                <li>Home Loan up to 25 years for SENP for Plot loans and Home loan</li>
                <li>Home loans for Advocates, Police personal, Jewellers, & Builders</li>
                <li>Home Loans up to 10 lakhs for people who do not have a permanent office set up. (Fruit vendors, auto driver, small flower shop)</li>
                <li>LTV as per RBI norms even in affordable segment.</li>
                <li>OCR not required if loan amount is registration value subject LTV support</li>
                <li>Pure cash rental income and 100% of the rental income will be considered.</li>
              </ol>
            </div>

            {/* SALARIED */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
              <div className="bg-[#0B1B3D] text-white py-3 px-4 text-center font-bold text-sm">
                WHY BLR15: FOR SALARIED CUSTOMER
              </div>
              <ol className="p-5 space-y-2.5 text-[13px] text-slate-700 list-decimal pl-8 leading-relaxed">
                <li>Advantage Loans: Loans combining father and son income according to their retirement age and income will be considered up to 4 income earning members.</li>
                <li>Home Loan tenure up to 25 years (Age of retirement 65 years - IMGC)</li>
                <li>Loans for employees working in Proprietor / Partnership concern</li>
                <li>Loans up to 15 lakhs for cash salary customers</li>
                <li>Loans for salaried customer with consolidated pay</li>
                <li>Plot Loans for salaried customers up to 25 years</li>
                <li>Home loans for Salaried customers with consolidated pay (no deductions) - Salary certificate is sufficient.</li>
                <li>LTV as per RBI norms even in affordable segment.</li>
              </ol>
            </div>

            {/* READY HOUSE PURCHASE */}
            <div className="rounded-2xl overflow-hidden border border-orange-200 bg-white shadow-sm">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 px-4 text-center font-bold text-sm">
                WHY BLR15: READY HOUSE PURCHASE
              </div>
              <ol className="p-5 space-y-2.5 text-[13px] text-slate-700 list-decimal pl-8 leading-relaxed">
                <li>Passage property with a width of 3 ft</li>
                <li>Plot loan tenure up to 20 years</li>
                <li>Resale - Without Plan approval - 5 Yrs Property tax Required</li>
                <li>Resale Flat - Without Plan approval - 10 Yrs Property tax Required</li>
                <li>Properties with 10 Multi-tenant units</li>
                <li>Unapproved Plot purchase - Within Corporation & Municipal limits</li>
                <li>Properties with Non RCC roof considered as HL purchase and HL LTV.</li>
                <li>No subdivision approval is required for subdivided plots for approved layout.</li>
              </ol>
            </div>
          </div>

          {/* 2 column cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* LEGAL USP */}
            <div className="rounded-2xl overflow-hidden border border-blue-200 bg-white shadow-sm">
              <div className="bg-blue-600 text-white py-3 px-4 text-center font-bold text-sm">
                WHY BLR15: LEGAL USP
              </div>
              <ol className="p-5 space-y-2.5 text-[13px] text-slate-700 list-decimal pl-8 leading-relaxed">
                <li>Property title tracing only for 13 years</li>
                <li>Loans up to 25 lakhs - Title tracing can be done from revenue documents and title docs can be even 6-month-old.</li>
                <li>Katha is required only in the name of previous owner</li>
                <li>Grama Thana properties can be funded for Ready House Purchase and Self-construction loan</li>
                <li>Self Construction Cases without Plan Approval</li>
              </ol>
            </div>

            {/* MARKET VALUE FUNDING */}
            <div className="rounded-2xl overflow-hidden border border-emerald-200 bg-white shadow-sm">
              <div className="bg-emerald-600 text-white py-3 px-4 text-center font-bold text-sm">
                MARKET VALUE FUNDING
              </div>
              <ol className="p-5 space-y-3 text-sm text-slate-800 font-semibold list-decimal pl-8 leading-relaxed">
                <li>Loan up to 100% of registered value subject to LTV on Market Value</li>
                <li>Property can be registered only for Guideline value - LTV on Market Value</li>
                <li>Without OCR proof if loan amount equal to registration value.</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ BOTTOM CTA ━━━ */}
      <section className="bg-[#0B1B3D]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h3 className="text-white text-xl md:text-2xl font-bold font-['Outfit']">
              Ready to Get Your Home Loan?
            </h3>
            <p className="text-slate-400 text-sm mt-1">Contact your BLR15 home loan expert today.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('eligibility')}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-[#0B1B3D] font-bold rounded-xl transition-colors shadow-md shadow-amber-500/20 cursor-pointer"
            >
              Check Eligibility
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl border border-white/20 transition-colors cursor-pointer flex items-center gap-2"
            >
              <Phone className="w-4 h-4" /> Contact Us
            </button>
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
