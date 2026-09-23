import React, { useState } from 'react';
import {
  Home, FileCheck, CheckCircle2, ChevronDown, ChevronUp,
  Percent, Clock, Building2, AlertCircle, ShieldCheck, CreditCard,
  PieChart, ArrowRight, IndianRupee, Sparkles, Zap, Calculator,
  Store, Briefcase, Scale, Coffee, Hammer, BadgeCheck, FileText, Check
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
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<'home' | 'personal' | 'car'>(initialCategory);

  React.useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const renderHomeLoanView = () => {
    return (
      <div className="min-h-screen bg-slate-50 font-sans pb-20">
        {/* HERO SECTION - REDESIGNED */}
        <section className="bg-white pt-12 pb-16 px-4 relative overflow-hidden border-b border-slate-200">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-block">
                <h3 className="text-amber-600 font-bold text-xl md:text-2xl italic tracking-wide font-serif mb-2">
                  Your Dream — Our Support
                </h3>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0B1B3D] leading-tight font-['Outfit'] uppercase">
                  Home Loan <br />
                  <span className="text-3xl md:text-4xl">Made Easy With</span><br/>
                  <span className="bg-amber-500 text-white px-4 py-1 mt-2 inline-block rounded-lg shadow-md">BLR15</span>
                </h1>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
                <div className="flex flex-col items-center text-center gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Zap className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-xs text-[#0B1B3D] uppercase">Quick<br/>Approval</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                    <Percent className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-xs text-[#0B1B3D] uppercase">Attractive<br/>Interest Rates</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-xs text-[#0B1B3D] uppercase">Minimum<br/>Documentation</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                    <Home className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-xs text-[#0B1B3D] uppercase">Loans Up To<br/>25 Lakhs*</span>
                </div>
              </div>
            </div>

            {/* Right Form Component */}
            <div className="lg:col-span-4 bg-[#0B1B3D] rounded-3xl shadow-2xl p-6 lg:p-8 w-full relative overflow-hidden border-4 border-amber-500">
              <h3 className="text-xl font-bold text-white mb-6 text-center font-['Outfit']">
                Apply For Home Loan
              </h3>
              <div className="space-y-4 relative z-10">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Loan Amount Needed</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IndianRupee className="h-4 w-4 text-slate-400" />
                    </div>
                    <input type="text" placeholder="e.g. 15,00,000" className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm font-medium text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Mobile Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-slate-400 text-sm font-medium">+91</span>
                    </div>
                    <input type="tel" placeholder="9876543210" className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm font-medium text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                  </div>
                </div>
                <button 
                  onClick={() => onNavigate('eligibility')}
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-[#0B1B3D] font-black uppercase tracking-wide rounded-xl flex items-center justify-center gap-2 transition-colors mt-4 shadow-lg shadow-amber-500/30"
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CONTENT SECTIONS */}
        <section className="max-w-7xl mx-auto px-4 py-12 space-y-12">
          
          {/* Row 1: Salaried/Self Employed & Challenge Profiles */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Salaried & Self Employed */}
            <div className="bg-white rounded-3xl border-2 border-[#0B1B3D] overflow-hidden shadow-xl relative">
              <div className="bg-[#0B1B3D] text-white p-4 text-center font-bold text-lg tracking-wide">
                WE DO SALARIED & SELF EMPLOYED LOANS FOR
              </div>
              <div className="p-6 md:p-8">
                <ul className="space-y-3 text-sm md:text-base text-slate-800 font-semibold list-none">
                  {['Sheet House Purchase', 'Site Purchase and Construction Loan', 'Flat Purchase Loan', 'Building Purchase Loan', 'Construction Loan', 'House Renovation Loan', 'House Extension Loan', 'BT Loan from any NBFC & Bank'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></div>
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Info Blocks */}
                <div className="mt-8 space-y-4">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                    <Building2 className="w-6 h-6 shrink-0 text-[#0B1B3D]" />
                    <span className="text-sm font-bold text-[#0B1B3D]">Vendor BT from any Bank, NBFC, Co Operative Bank</span>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-start gap-3">
                    <FileCheck className="w-6 h-6 shrink-0 text-amber-600" />
                    <span className="text-sm font-bold text-[#0B1B3D]">A, B, 9 & 11A, 9 & 11 A, 11B, CMC Khatha</span>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-start gap-3">
                    <IndianRupee className="w-6 h-6 shrink-0 text-emerald-600" />
                    <span className="text-sm font-bold text-[#0B1B3D]">Loan Amount: 10L to 15Cr</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Challenges Profiles */}
            <div className="bg-white rounded-3xl border-2 border-[#0B1B3D] overflow-hidden shadow-xl relative flex flex-col">
              <div className="bg-[#0B1B3D] text-white p-4 text-center font-bold text-lg tracking-wide">
                CHALLENGES PROFILES WE FUNDS
              </div>
              
              {/* Graphic Center Box Overlay - CSS trick to place it beautifully */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-48 text-center hidden md:block">
                <div className="bg-amber-500 text-[#0B1B3D] font-black p-4 rounded-t-3xl rounded-b-md shadow-2xl border-4 border-white transform rotate-3">
                  <Home className="w-8 h-8 mx-auto mb-2 text-white" />
                  Your Dream Home is Closer Than You Think!
                </div>
              </div>

              <div className="p-6 md:p-8 flex-1 grid grid-cols-2 gap-x-8 gap-y-4 md:gap-y-8 relative">
                {/* Left Side */}
                <div className="space-y-4 md:space-y-6">
                  {[
                    { icon: ShieldCheck, label: 'Police' },
                    { icon: Home, label: 'Real Estate' },
                    { icon: Hammer, label: 'Civil Contracts' },
                    { icon: FileCheck, label: 'RTO Agents' },
                    { icon: Briefcase, label: 'Commission Agents Agency' },
                    { icon: Scale, label: 'Advocate' },
                  ].map((Profile, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-[#0B1B3D] flex items-center justify-center shrink-0 shadow-sm">
                        <Profile.icon className="w-5 h-5" />
                      </div>
                      <span className="text-sm md:text-base font-bold text-slate-700">{Profile.label}</span>
                    </div>
                  ))}
                </div>
                
                {/* Right Side */}
                <div className="space-y-4 md:space-y-6">
                  {[
                    { icon: Building2, label: 'Builders' },
                    { icon: CreditCard, label: 'Small Business Profile' },
                    { icon: Store, label: 'Bar & Restaurant' },
                    { icon: Store, label: 'Panipuri Shop' },
                    { icon: Store, label: 'Beeda Stall' },
                    { icon: Coffee, label: 'Tea Shops' },
                  ].map((Profile, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-[#0B1B3D] flex items-center justify-center shrink-0 shadow-sm">
                        <Profile.icon className="w-5 h-5" />
                      </div>
                      <span className="text-sm md:text-base font-bold text-slate-700">{Profile.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
          </div>

          {/* WHY BLR15: OUR USP'S */}
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 md:p-10 shadow-lg">
            <div className="text-center mb-10">
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 font-bold text-sm tracking-widest mb-3">
                WHY BLR15
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-[#0B1B3D] uppercase">
                FOR OUR USP's
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              
              {/* USP: SENP */}
              <div className="bg-slate-50 border border-amber-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-amber-500 text-[#0B1B3D] p-4 text-center font-bold text-sm md:text-base">
                  WHY BLR15: FOR SENP CUSTOMER
                </div>
                <div className="p-5 md:p-6">
                  <ul className="space-y-3 text-xs md:text-sm text-slate-700 font-semibold list-decimal pl-4">
                    <li>No ITR for loans up to 25 lakhs</li>
                    <li>Home Loans up to 1.5 Cr for customer with only single year ITR</li>
                    <li>Home Loan up to 25 years for SENP for Plot loans and Home loan</li>
                    <li>Home loans for Advocates, Police personal, Jewellers, & Builders</li>
                    <li>Home Loans up to 10 lakhs for people who do not have a permanent office set up. (Fruit vendors, auto driver, small flower shop)</li>
                    <li>LTV as per RBI norms even in affordable segment.</li>
                    <li>OCR not required if loan amount is registration value subject LTV support</li>
                    <li>Pure cash rental income and 100% of the rental income will be considered.</li>
                  </ul>
                </div>
              </div>

              {/* USP: SALARIED */}
              <div className="bg-slate-50 border border-[#0B1B3D]/30 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-[#0B1B3D] text-white p-4 text-center font-bold text-sm md:text-base">
                  WHY BLR15: FOR SALARIED CUSTOMER
                </div>
                <div className="p-5 md:p-6">
                  <ul className="space-y-3 text-xs md:text-sm text-slate-700 font-semibold list-decimal pl-4">
                    <li>Advantage Loans: Loans combining father and son income according to their retirement age and income will be considered up to 4 income earning members.</li>
                    <li>Home Loan tenure up to 25 years (Age of retirement 65 years - IMGC)</li>
                    <li>Loans for employees working in Proprietor / Partnership concern</li>
                    <li>Loans up to 15 lakhs for cash salary customers</li>
                    <li>Loans for salaried customer with consolidated pay</li>
                    <li>Plot Loans for salaried customers up to 25 years</li>
                    <li>Home loans for Salaried customers with consolidated pay (no deductions) - Salary certificate is sufficient.</li>
                    <li>LTV as per RBI norms even in affordable segment.</li>
                  </ul>
                </div>
              </div>

              {/* USP: READY HOUSE */}
              <div className="bg-slate-50 border border-orange-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-4 text-center font-bold text-sm md:text-base">
                  WHY BLR15: READY HOUSE PURCHASE
                </div>
                <div className="p-5 md:p-6">
                  <ul className="space-y-3 text-xs md:text-sm text-slate-700 font-semibold list-decimal pl-4">
                    <li>Passage property with a width of 3 ft</li>
                    <li>Plot loan tenure up to 20 years</li>
                    <li>Resale - Without Plan approval - 5 Yrs Property tax Required</li>
                    <li>Resale Flat - Without Plan approval - 10 Yrs Property tax Required</li>
                    <li>Properties with 10 Multi-tenant units</li>
                    <li>Unapproved Plot purchase - Within Corporation & Municipal limits</li>
                    <li>Properties with Non RCC roof considered as HL purchase and HL LTV.</li>
                    <li>No subdivision approval is required for subdivided plots for approved layout.</li>
                  </ul>
                </div>
              </div>

            </div>

            {/* Bottom 2 USPs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-6 md:mt-8">
              {/* LEGAL USP */}
              <div className="bg-slate-50 border border-blue-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-blue-600 text-white p-4 text-center font-bold text-sm md:text-base">
                  WHY BLR15: LEGAL USP
                </div>
                <div className="p-5 md:p-6">
                  <ul className="space-y-3 text-xs md:text-sm text-slate-700 font-semibold list-decimal pl-4">
                    <li>Property title tracing only for 13 years</li>
                    <li>Loans up to 25 lakhs - Title tracing can be done from revenue documents and title docs can be even 6-month-old.</li>
                    <li>Katha is required only in the name of previous owner</li>
                    <li>Grama Thana properties can be funded for Ready House Purchase and Self-construction loan</li>
                    <li>Self Construction Cases without Plan Approval</li>
                  </ul>
                </div>
              </div>

              {/* MARKET VALUE */}
              <div className="bg-slate-50 border border-emerald-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-emerald-600 text-white p-4 text-center font-bold text-sm md:text-base">
                  MARKET VALUE FUNDING
                </div>
                <div className="p-5 md:p-6 flex flex-col justify-center h-full">
                  <ul className="space-y-4 text-sm md:text-base text-slate-800 font-bold list-decimal pl-4">
                    <li>Loan up to 100% of registered value subject to LTV on Market Value</li>
                    <li>Property can be registered only for Guideline value - LTV on Market Value</li>
                    <li>Without OCR proof if loan amount equal to registration value.</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>

          {/* SERVING REGIONS BANNERS */}
          <div className="bg-[#0B1B3D] p-6 md:p-8 rounded-3xl shadow-lg text-center flex flex-col items-center justify-center gap-2">
            <span className="text-amber-500 font-black text-xl md:text-2xl tracking-wider">SERVING REGIONS</span>
            <p className="text-white text-sm md:text-base max-w-4xl mx-auto font-medium leading-relaxed">
              Bangalore, Bangalore Rural, Chikkaballapura, Ramanagara, Kolar, Mandya, Mysore, Tumkur, and other districts also.
            </p>
          </div>

        </section>
      </div>
    );
  };

  const renderOtherCategoryView = () => {
    // We'll keep a simplified aggregator view for personal / car loans
    const pageTitle = selectedCategory === 'personal' ? 'Personal Loans Made Simple' : 'Car Loans Made Simple';
    
    const bankRates = [
      { bank: 'SBI', rate: '10.55% - 12.05%', fee: 'Up to 1%', emi: '₹2,149' },
      { bank: 'HDFC Bank', rate: '10.50% - 21.00%', fee: 'Up to 2.50%', emi: '₹2,149' },
      { bank: 'ICICI Bank', rate: '10.75% - 19.00%', fee: 'Up to 2.50%', emi: '₹2,162' }
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
              className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-[#0B1B3D] font-bold rounded-xl transition-colors inline-flex items-center gap-2"
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
                          className="px-4 py-2 bg-[#0B1B3D] hover:bg-slate-800 text-white text-xs font-bold rounded-lg"
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
