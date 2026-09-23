import React, { useState } from 'react';
import {
  Home,
  Hammer,
  ArrowRightLeft,
  BadgePlus,
  FileCheck,
  PhoneCall,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Percent,
  Clock,
  FileText,
  Building2,
  AlertCircle,
  Car,
  Wallet,
  Sparkles,
} from 'lucide-react';
import { LoanType } from '../../types';

interface HomeLoansPageProps {
  onNavigate: (tab: string, state?: any) => void;
  onOpenEnquiry: (loanType?: string) => void;
  initialCategory?: 'all' | 'home' | 'personal' | 'car';
}

export const HomeLoansPage: React.FC<HomeLoansPageProps> = ({
  onNavigate,
  onOpenEnquiry,
  initialCategory = 'all',
}) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'home' | 'personal' | 'car'>(initialCategory);

  React.useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const loanProducts: {
    type: LoanType;
    category: 'home' | 'personal' | 'car';
    icon: any;
    tag: string;
    subtitle: string;
    description: string;
    rate: string;
    maxTenure: string;
    maxLtv: string;
    idealFor: string;
    highlights: string[];
    docs: string[];
  }[] = [
    {
      type: 'Home Purchase Loan',
      category: 'home',
      icon: Home,
      tag: 'New & Resale',
      subtitle: 'For purchasing a new or resale residential property',
      description:
        'Ideal for purchasing ready-to-move apartments, under-construction builder flats, or resale villas in Bangalore. Access high loan-to-value funding with minimal processing turnaround.',
      rate: 'From 8.35% p.a.',
      maxTenure: 'Up to 30 Years',
      maxLtv: 'Up to 80% - 90%',
      idealFor: 'Salaried and self-employed buyers purchasing apartments or houses.',
      highlights: [
        'Pre-approved project verification for fast clearance',
        'Transparent interest calculation on daily reducing balance',
        'Zero prepayment penalties on floating rate loans',
        'Option for joint applicants (spouse, parents) to increase eligibility',
      ],
      docs: [
        'Sale Agreement / Cost Sheet',
        'Latest 3 months salary slips or 3 years ITR',
        '6 months bank statement showing salary/business credits',
        'KYC documents (Aadhaar & PAN)',
      ],
    },
    {
      type: 'Home Construction Loan',
      category: 'home',
      icon: Hammer,
      tag: 'Self Build',
      subtitle: 'For constructing your own house',
      description:
        'Customized funding to construct your dream standalone home or duplex on your owned residential plot. Disbursals are linked stage-by-stage to civil construction milestones.',
      rate: 'From 8.45% p.a.',
      maxTenure: 'Up to 25 Years',
      maxLtv: 'Up to 75% - 80% of estimate',
      idealFor: 'Plot owners in Bangalore planning to construct an independent house.',
      highlights: [
        'Can combine plot purchase + construction in a single composite loan',
        'Tranche disbursement directly as your foundation, lintel, and roof finish',
        'Technical valuation & estimate verification by certified civil engineers',
        'Moratorium period up to 18 months during construction phase',
      ],
      docs: [
        'Title deeds & Khata certificate (A-Khata / BBMP / BDA)',
        'Approved building plan & blueprint from local authority',
        'Detailed construction cost estimate certified by architect/engineer',
        'Income proof & 6 months bank statement',
      ],
    },
    {
      type: 'Home Loan Balance Transfer',
      category: 'home',
      icon: ArrowRightLeft,
      tag: 'Lower Your EMI',
      subtitle: 'For transferring an existing home loan',
      description:
        'Switch your current expensive home loan from any commercial bank, NBFC, or housing finance company to our partner lenders offering lower interest rates and better terms.',
      rate: 'From 8.35% p.a.',
      maxTenure: 'Retain or extend tenure',
      maxLtv: 'Up to 80% of current value',
      idealFor: 'Borrowers currently paying > 9.00% p.a. interest.',
      highlights: [
        'Save lakhs of rupees in total interest over your remaining loan tenure',
        'Reduce your monthly EMI burden or shorten the loan duration',
        'Avail an attractive Top-Up loan simultaneously for personal or renovation needs',
        'End-to-end paperwork & document takeover from your existing lender',
      ],
      docs: [
        'List of property documents deposited with existing bank (LOD)',
        'Foreclosure statement & loan account statement for last 12 months',
        'Latest 3 months salary slips / 2 years ITR',
        'Property title copies & sanction letter',
      ],
    },
    {
      type: 'Home Loan Top-Up',
      category: 'home',
      icon: BadgePlus,
      tag: 'Extra Funding',
      subtitle: 'Additional funding for eligible existing borrowers',
      description:
        'Unlock surplus equity from your mortgaged property. Get quick, hassle-free additional funds at home loan interest rates—far cheaper than personal loans or credit cards.',
      rate: 'From 8.65% p.a.',
      maxTenure: 'Up to 15 - 20 Years',
      maxLtv: 'Up to 75% total exposure',
      idealFor: 'Home interior design, modular kitchen, house expansion, or education.',
      highlights: [
        'Rates significantly lower than unsecured personal loans (8.65% vs 14%+)',
        'Minimal additional documentation required for existing borrowers with clean repayment',
        'Flexible end-use (interiors, renovations, emergency, medical, wedding)',
        'Longer repayment tenure keeps monthly EMIs low and manageable',
      ],
      docs: [
        'Track record of regular EMI payments for at least 6-12 months',
        'Latest salary slips / updated income statement',
        'Application form & KYC confirmation',
      ],
    },
    {
      type: 'Personal Loan',
      category: 'personal',
      icon: Wallet,
      tag: 'Instant & Unsecured',
      subtitle: 'Zero collateral required for any personal or emergency need',
      description:
        'Multi-purpose unsecured personal loan with rapid approval and quick disbursal. Ideal for weddings, medical emergencies, higher education, dream vacations, or high-interest debt consolidation without pledging any property or asset.',
      rate: 'From 10.49% p.a.',
      maxTenure: 'Up to 5 Years (60 Months)',
      maxLtv: 'Up to ₹40 Lakhs',
      idealFor: 'Salaried employees, IT professionals & self-employed individuals needing instant liquidity.',
      highlights: [
        '100% paperless processing with same-day sanction and fast disbursal',
        'No collateral, guarantor, or property mortgage required',
        'Flexible repayment tenure from 12 to 60 months with predictable EMIs',
        'Direct partnerships with HDFC, ICICI, Axis, Tata Capital, and Bajaj Finserv',
      ],
      docs: [
        'Aadhaar Card & PAN Card for digital e-KYC',
        'Latest 3 months salary slips or Form 16',
        'Last 6 months bank statement showing regular salary credits',
        'Official company employee ID or business proof',
      ],
    },
    {
      type: 'Car Loan',
      category: 'car',
      icon: Car,
      tag: 'New, Used & EV',
      subtitle: 'Drive home your dream car or electric vehicle today',
      description:
        'Customized auto financing solutions for new sedans, luxury SUVs, family hatchbacks, green Electric Vehicles (EVs), or certified pre-owned cars in Bangalore. Avail high on-road funding with special dealer discount tie-ups.',
      rate: 'From 8.75% p.a.',
      maxTenure: 'Up to 7 - 8 Years',
      maxLtv: 'Up to 100% On-Road Funding',
      idealFor: 'Anyone looking to purchase a new or verified pre-owned car or EV in Bangalore.',
      highlights: [
        'Up to 100% on-road funding covering showroom price, road tax, and comprehensive insurance',
        'Special subsidized interest rates for Electric Vehicles (EVs)',
        'Pre-approved dealer tie-ups across Maruti, Hyundai, Tata, Mahindra, Toyota, Kia, Honda',
        'Quick document pickup with doorstep test drive coordination',
      ],
      docs: [
        'Vehicle proforma invoice or official dealer quotation',
        'Latest 3 months salary slips / 2 years ITR with computation',
        '6 months primary bank statement',
        'KYC proof (Aadhaar, PAN, Driving License)',
      ],
    },
  ];

  const faqs = [
    {
      q: 'How is my home loan eligibility calculated?',
      a: 'Eligibility depends on your monthly net income, existing EMIs or credit card dues, age, credit score (CIBIL), and the market value of the property. Lenders generally permit up to 50% - 60% of your net monthly income towards all loan obligations (FOIR).',
    },
    {
      q: 'What is the minimum CIBIL score required for a home loan in Bangalore?',
      a: 'A CIBIL score of 750 and above is considered ideal and qualifies you for the lowest interest rates starting from 8.35% p.a. However, loan options may still be available for scores between 650 and 750 through select banking partners.',
    },
    {
      q: 'What percentage of the property value can I borrow?',
      a: 'As per RBI guidelines, lenders can fund up to 90% for home loans up to ₹30 Lakhs, up to 80% for loans between ₹30 Lakhs and ₹75 Lakhs, and up to 75% for loans above ₹75 Lakhs.',
    },
    {
      q: 'How long does the loan approval process take with BLR15?',
      a: 'With BLR15, initial eligibility assessment is immediate. Once documents are collected, in-principle sanction is usually received within 3 to 5 business days, followed by legal and technical property verification.',
    },
    {
      q: 'Can I add a co-applicant to increase my loan eligibility?',
      a: 'Yes! Adding an earning co-applicant (such as your spouse, father, mother, or son) combines both incomes, substantially increasing the eligible loan amount.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#0B1B3D] via-[#0E224E] to-[#122A63] text-white py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <span className="px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider">
            Comprehensive Financing Options
          </span>
          <h1 className="text-4xl sm:text-5xl font-black font-['Outfit'] tracking-tight">
            Home Loans Made Simple
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
            Find a home loan solution suited to your financial requirements. We navigate banking procedures so you can focus on building your home.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('eligibility')}
              className="px-8 py-3.5 rounded-xl font-extrabold text-sm bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileCheck className="w-4 h-4 stroke-[2.5]" />
              <span>Check Eligibility</span>
            </button>
            <button
              onClick={() => onOpenEnquiry()}
              className="px-7 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span>Talk to Loan Expert</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Services List */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Category Filter Tabs */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {[
              { id: 'all', label: 'All Financing Options' },
              { id: 'home', label: 'Home Loans (4)' },
              { id: 'personal', label: 'Personal Loan (Instant)' },
              { id: 'car', label: 'Car Loan (New & EV)' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id as any)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-[#0B1B3D] text-amber-400 shadow-md shadow-[#0B1B3D]/20 scale-105'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-12">
            {loanProducts
              .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
              .map((prod, idx) => {
                const Icon = prod.icon;
                const isEven = idx % 2 === 0;

            return (
              <div
                key={prod.type}
                className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Details */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#0B1B3D] text-amber-400 flex items-center justify-center shadow-md">
                        <Icon className="w-6 h-6 stroke-[2]" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                          {prod.tag}
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black text-[#0B1B3D] font-['Outfit']">
                          {prod.type}
                        </h2>
                      </div>
                    </div>

                    <p className="text-sm font-semibold text-slate-700">
                      {prod.subtitle}
                    </p>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      {prod.description}
                    </p>

                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-[11px] text-slate-500 block">Interest Rate</span>
                        <span className="text-sm font-bold text-amber-600">{prod.rate}</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-[11px] text-slate-500 block">Tenure</span>
                        <span className="text-sm font-bold text-slate-800">{prod.maxTenure}</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-[11px] text-slate-500 block">Funding Ratio</span>
                        <span className="text-sm font-bold text-slate-800">{prod.maxLtv}</span>
                      </div>
                    </div>

                    {/* Feature bullet list */}
                    <div className="pt-2">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                        Product Features & Advantages:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {prod.highlights.map((feat, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Documentation & Action Card */}
                  <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-between h-full space-y-6">
                    <div>
                      <div className="flex items-center gap-2 mb-3 text-[#0B1B3D]">
                        <FileText className="w-4 h-4 text-amber-600" />
                        <h4 className="font-bold text-sm font-['Outfit']">
                          Key Documents Checklist:
                        </h4>
                      </div>
                      <ul className="space-y-2 text-xs text-slate-600">
                        {prod.docs.map((doc, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                            <span>{doc}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-4 p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 text-[11px] text-amber-900 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span>Doorstep document collection available across Bangalore (560015 & neighboring pincodes).</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-4 border-t border-slate-200">
                      <button
                        onClick={() => onNavigate('eligibility', { loanType: prod.type })}
                        className="w-full py-3 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <FileCheck className="w-4 h-4 stroke-[2.5]" />
                        <span>Check Eligibility for {prod.type}</span>
                      </button>

                      <button
                        onClick={() => onOpenEnquiry(prod.type)}
                        className="w-full py-2.5 rounded-xl font-semibold text-xs bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Enquire About This Loan</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-16 px-4 sm:px-6 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 space-y-2">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              Common Questions
            </span>
            <h2 className="text-3xl font-black text-[#0B1B3D] font-['Outfit']">
              Home Loan FAQs
            </h2>
            <p className="text-slate-600 text-sm">
              Clear answers to help you navigate your home financing journey in Bangalore.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-sm text-[#0B1B3D] bg-slate-50/50 hover:bg-slate-50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-amber-600 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="p-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/50 border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 p-8 rounded-2xl bg-[#0B1B3D] text-white text-center space-y-4">
            <h3 className="text-xl font-bold font-['Outfit']">
              Have specific questions about your property or builder?
            </h3>
            <p className="text-slate-300 text-xs max-w-lg mx-auto">
              Our Bangalore branch advisors will evaluate your papers with zero obligation.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('eligibility')}
                className="px-6 py-2.5 rounded-xl font-bold text-xs bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors"
              >
                Check Loan Eligibility
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-2.5 rounded-xl font-semibold text-xs bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-colors"
              >
                Contact BLR15 Office
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
