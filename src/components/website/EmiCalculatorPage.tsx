import React, { useState, useMemo } from 'react';
import {
  Calculator,
  FileCheck,
  Percent,
  Calendar,
  IndianRupee,
  PieChart as PieIcon,
  Sparkles,
  ArrowRight,
  TrendingDown,
  ChevronDown,
  ChevronUp,
  Download,
  Share2,
  CheckCircle2,
  Info,
  Building,
  RotateCcw,
  Zap,
  ArrowUpRight,
  Layers,
  FileText,
  Car,
  Wallet,
  Home,
} from 'lucide-react';
import { calculateHomeLoanEmi, formatINR } from '../../services/storageService';
import { BLR15_OFFICE_DETAILS } from '../../data/initialData';

interface EmiCalculatorPageProps {
  onNavigate: (tab: string, state?: any) => void;
}

interface YearSchedule {
  year: number;
  openingBalance: number;
  principalPaid: number;
  interestPaid: number;
  totalPaid: number;
  closingBalance: number;
}

export const EmiCalculatorPage: React.FC<EmiCalculatorPageProps> = ({ onNavigate }) => {
  // Loan Category
  const [calculatorType, setCalculatorType] = useState<'home' | 'personal' | 'car'>('home');

  // Main loan inputs
  const [loanAmount, setLoanAmount] = useState<number>(5000000); // 50 Lakhs default
  const [interestRate, setInterestRate] = useState<number>(8.5); // 8.5% default
  const [tenureYears, setTenureYears] = useState<number>(20); // 20 years default

  // Prepayment / Extra EMI simulation state
  const [extraPrepaymentPerYear, setExtraPrepaymentPerYear] = useState<number>(0);
  const [monthlyExtraEmi, setMonthlyExtraEmi] = useState<number>(0);

  // Amortization schedule view toggles
  const [showFullSchedule, setShowFullSchedule] = useState<boolean>(false);
  const [scheduleView, setScheduleView] = useState<'yearly' | 'monthly'>('yearly');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Quick Loan Presets per Category
  const presets = useMemo(() => {
    if (calculatorType === 'personal') {
      return [
        { label: 'Starter (₹1L)', amount: 100000, rate: 11.5, tenure: 2 },
        { label: 'Popular (₹3L)', amount: 300000, rate: 11.0, tenure: 3 },
        { label: 'Wedding / Med (₹5L)', amount: 500000, rate: 10.75, tenure: 4 },
        { label: 'Executive (₹10L)', amount: 1000000, rate: 10.49, tenure: 5 },
      ];
    }
    if (calculatorType === 'car') {
      return [
        { label: 'Hatchback (₹6L)', amount: 600000, rate: 8.85, tenure: 5 },
        { label: 'Sedan / SUV (₹12L)', amount: 1200000, rate: 8.75, tenure: 6 },
        { label: 'EV Special (₹18L)', amount: 1800000, rate: 8.45, tenure: 7 },
        { label: 'Luxury (₹30L)', amount: 3000000, rate: 8.65, tenure: 7 },
      ];
    }
    return [
      { label: 'Starter (₹30L)', amount: 3000000, rate: 8.5, tenure: 20 },
      { label: 'Popular (₹50L)', amount: 5000000, rate: 8.5, tenure: 20 },
      { label: 'Premium (₹75L)', amount: 7500000, rate: 8.4, tenure: 25 },
      { label: 'Luxury (₹1.2Cr)', amount: 12000000, rate: 8.35, tenure: 25 },
    ];
  }, [calculatorType]);

  // Calculate Base EMI
  const baseCalc = useMemo(() => {
    return calculateHomeLoanEmi(loanAmount, interestRate, tenureYears);
  }, [loanAmount, interestRate, tenureYears]);

  // Prepayment savings calculation
  const savingsCalc = useMemo(() => {
    const monthlyRate = interestRate / 12 / 100;
    const totalMonths = tenureYears * 12;
    const baseMonthlyEmi = baseCalc.emi;
    const effectiveMonthlyPayment = baseMonthlyEmi + monthlyExtraEmi;

    let balance = loanAmount;
    let monthsElapsed = 0;
    let totalInterestPaidWithSavings = 0;

    while (balance > 1 && monthsElapsed < totalMonths) {
      monthsElapsed++;
      const interestForMonth = balance * monthlyRate;
      let principalForMonth = effectiveMonthlyPayment - interestForMonth;

      // Add yearly lump-sum prepayment at every 12th month
      if (extraPrepaymentPerYear > 0 && monthsElapsed % 12 === 0) {
        principalForMonth += extraPrepaymentPerYear;
      }

      if (principalForMonth >= balance) {
        totalInterestPaidWithSavings += interestForMonth;
        balance = 0;
        break;
      } else {
        totalInterestPaidWithSavings += interestForMonth;
        balance -= principalForMonth;
      }
    }

    const savedMonths = Math.max(0, totalMonths - monthsElapsed);
    const savedYears = +(savedMonths / 12).toFixed(1);
    const savedInterest = Math.max(0, Math.round(baseCalc.totalInterest - totalInterestPaidWithSavings));

    return {
      effectiveMonths: monthsElapsed,
      savedMonths,
      savedYears,
      savedInterest,
      newTotalInterest: Math.round(totalInterestPaidWithSavings),
    };
  }, [loanAmount, interestRate, tenureYears, baseCalc, extraPrepaymentPerYear, monthlyExtraEmi]);

  // Generate Year-by-Year Amortization Schedule
  const amortizationSchedule: YearSchedule[] = useMemo(() => {
    const schedule: YearSchedule[] = [];
    const monthlyRate = interestRate / 12 / 100;
    const monthlyEmi = baseCalc.emi;
    let balance = loanAmount;

    for (let yr = 1; yr <= tenureYears && balance > 1; yr++) {
      let yrPrincipal = 0;
      let yrInterest = 0;
      const opening = balance;

      for (let m = 1; m <= 12 && balance > 1; m++) {
        const intPayment = balance * monthlyRate;
        let princPayment = monthlyEmi - intPayment;

        if (princPayment > balance) {
          princPayment = balance;
        }

        yrInterest += intPayment;
        yrPrincipal += princPayment;
        balance -= princPayment;
      }

      schedule.push({
        year: yr,
        openingBalance: Math.round(opening),
        principalPaid: Math.round(yrPrincipal),
        interestPaid: Math.round(yrInterest),
        totalPaid: Math.round(yrPrincipal + yrInterest),
        closingBalance: Math.max(0, Math.round(balance)),
      });
    }

    return schedule;
  }, [loanAmount, interestRate, tenureYears, baseCalc.emi]);

  const principalPercent = Math.round((loanAmount / baseCalc.totalPayable) * 100) || 50;
  const interestPercent = 100 - principalPercent;

  // Pre-fill quick preset
  const handleSelectPreset = (p: typeof presets[0]) => {
    setLoanAmount(p.amount);
    setInterestRate(p.rate);
    setTenureYears(p.tenure);
  };

  // Switch loan category
  const handleSwitchCategory = (type: 'home' | 'personal' | 'car') => {
    setCalculatorType(type);
    if (type === 'personal') {
      setLoanAmount(500000);
      setInterestRate(11.0);
      setTenureYears(3);
    } else if (type === 'car') {
      setLoanAmount(1000000);
      setInterestRate(8.75);
      setTenureYears(5);
    } else {
      setLoanAmount(5000000);
      setInterestRate(8.5);
      setTenureYears(20);
    }
    setExtraPrepaymentPerYear(0);
    setMonthlyExtraEmi(0);
  };

  // Reset inputs
  const handleReset = () => {
    if (calculatorType === 'personal') {
      setLoanAmount(500000);
      setInterestRate(11.0);
      setTenureYears(3);
    } else if (calculatorType === 'car') {
      setLoanAmount(1000000);
      setInterestRate(8.75);
      setTenureYears(5);
    } else {
      setLoanAmount(5000000);
      setInterestRate(8.5);
      setTenureYears(20);
    }
    setExtraPrepaymentPerYear(0);
    setMonthlyExtraEmi(0);
  };

  // Share calculation
  const handleShare = () => {
    const loanName = calculatorType === 'personal' ? 'Personal Loan' : calculatorType === 'car' ? 'Car Loan' : 'Home Loan';
    const text = `BLR15 ${loanName} Estimate: Loan ₹${loanAmount / 100000} Lakhs @ ${interestRate}% for ${tenureYears} Yrs = EMI ₹${baseCalc.emi.toLocaleString('en-IN')}/mo. Check your eligibility at BLR15!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Loan Category Selector Tabs */}
        <div className="flex items-center justify-center">
          <div className="inline-flex p-1.5 rounded-2xl bg-white border border-slate-200 shadow-xs gap-1">
            <button
              onClick={() => handleSwitchCategory('home')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                calculatorType === 'home'
                  ? 'bg-[#0B1B3D] text-amber-400 shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home Loan EMI</span>
            </button>
            <button
              onClick={() => handleSwitchCategory('personal')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                calculatorType === 'personal'
                  ? 'bg-[#0B1B3D] text-amber-400 shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>Personal Loan EMI</span>
            </button>
            <button
              onClick={() => handleSwitchCategory('car')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                calculatorType === 'car'
                  ? 'bg-[#0B1B3D] text-amber-400 shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>Car Loan EMI</span>
            </button>
          </div>
        </div>

        {/* Header Section with Badges */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-950 text-xs font-bold uppercase tracking-wider shadow-xs">
            <Calculator className="w-3.5 h-3.5 text-amber-600" />
            <span>
              {calculatorType === 'personal'
                ? 'Instant Paperless Personal Loan Calculator'
                : calculatorType === 'car'
                ? 'Auto & EV Financing Calculator'
                : 'Interactive Home Loan Financial Planner'}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0B1B3D] font-['Outfit'] tracking-tight">
            {calculatorType === 'personal'
              ? 'Personal Loan EMI Calculator'
              : calculatorType === 'car'
              ? 'Car Loan EMI Calculator'
              : 'Home Loan EMI Calculator'}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            {calculatorType === 'personal'
              ? 'Estimate your monthly installments for collateral-free personal loans across leading banks & NBFCs in Bangalore. Zero processing hassles.'
              : calculatorType === 'car'
              ? 'Calculate your monthly payments for new cars, certified pre-owned vehicles, or electric vehicles with up to 100% on-road funding.'
              : 'Accurately calculate your monthly EMI, visualize total interest liability, simulate pre-payment interest savings, and inspect your full amortization schedule.'}
          </p>

          {/* Quick Presets Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
              Popular Presets:
            </span>
            {presets.map(p => (
              <button
                key={p.label}
                onClick={() => handleSelectPreset(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  loanAmount === p.amount && tenureYears === p.tenure && interestRate === p.rate
                    ? 'bg-[#0B1B3D] text-amber-400 shadow-sm'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {p.label}
              </button>
            ))}
            <button
              onClick={handleReset}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors cursor-pointer"
              title="Reset to default"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Main Calculator Grid */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/90 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Column: Interactive Sliders & Precise Inputs */}
            <div className="lg:col-span-7 space-y-7">
              
              {/* Slider 1: Loan Amount */}
              <div className="space-y-3 bg-slate-50/70 p-5 rounded-2xl border border-slate-100">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <IndianRupee className="w-4 h-4 text-amber-500" />
                    Loan Amount Required
                  </span>
                  
                  {/* Direct Number Input */}
                  <div className="flex items-center gap-2">
                    <div className="px-3.5 py-1 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-1">
                      <span className="text-slate-400 font-bold text-sm">₹</span>
                      <input
                        type="number"
                        min={calculatorType === 'personal' ? 50000 : calculatorType === 'car' ? 200000 : 500000}
                        max={calculatorType === 'personal' ? 4000000 : calculatorType === 'car' ? 10000000 : 50000000}
                        step={calculatorType === 'personal' ? 25000 : calculatorType === 'car' ? 50000 : 100000}
                        value={loanAmount}
                        onChange={e => setLoanAmount(Math.max(10000, Number(e.target.value)))}
                        className="w-28 text-right font-extrabold text-[#0B1B3D] text-base font-['Outfit'] focus:outline-hidden"
                      />
                    </div>
                    <span className="text-xs font-black text-amber-600 px-2 py-1 rounded bg-amber-50 border border-amber-200">
                      {formatINR(loanAmount)}
                    </span>
                  </div>
                </div>

                <input
                  type="range"
                  min={calculatorType === 'personal' ? 50000 : calculatorType === 'car' ? 200000 : 500000}
                  max={calculatorType === 'personal' ? 4000000 : calculatorType === 'car' ? 10000000 : 30000000}
                  step={calculatorType === 'personal' ? 25000 : calculatorType === 'car' ? 50000 : 100000}
                  value={loanAmount}
                  onChange={e => setLoanAmount(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />

                <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                  <span>{calculatorType === 'personal' ? '₹50 Thousand' : calculatorType === 'car' ? '₹2 Lakhs' : '₹5 Lakhs'}</span>
                  <span>{calculatorType === 'personal' ? '₹20 Lakhs' : calculatorType === 'car' ? '₹50 Lakhs' : '₹1.5 Crores'}</span>
                  <span>{calculatorType === 'personal' ? '₹40 Lakhs' : calculatorType === 'car' ? '₹1 Crore' : '₹3 Crores'}</span>
                </div>

                {/* Quick amount chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(calculatorType === 'personal'
                    ? [100000, 250000, 500000, 1000000, 2000000]
                    : calculatorType === 'car'
                    ? [500000, 800000, 1200000, 1800000, 2500000]
                    : [2500000, 4000000, 6000000, 8000000, 10000000]
                  ).map(amt => (
                    <button
                      key={amt}
                      onClick={() => setLoanAmount(amt)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition-all cursor-pointer ${
                        loanAmount === amt
                          ? 'bg-amber-400 text-slate-950 border-amber-400'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-amber-400'
                      }`}
                    >
                      {formatINR(amt)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider 2: Interest Rate */}
              <div className="space-y-3 bg-slate-50/70 p-5 rounded-2xl border border-slate-100">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Percent className="w-4 h-4 text-amber-500" />
                    Interest Rate (p.a.)
                  </span>
                  <div className="px-4 py-1 rounded-xl bg-white border border-slate-200 font-extrabold text-amber-600 text-base font-['Outfit'] shadow-xs">
                    {interestRate}%
                  </div>
                </div>

                <input
                  type="range"
                  min={calculatorType === 'personal' ? 10.0 : calculatorType === 'car' ? 8.0 : 7.5}
                  max={calculatorType === 'personal' ? 22.0 : calculatorType === 'car' ? 16.0 : 15.0}
                  step={0.05}
                  value={interestRate}
                  onChange={e => setInterestRate(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />

                <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                  <span>{calculatorType === 'personal' ? '10.0% (Prime)' : calculatorType === 'car' ? '8.0% (EV Special)' : '7.5% (Prime Tier-1)'}</span>
                  <span>{calculatorType === 'personal' ? '14.0% (Average)' : calculatorType === 'car' ? '10.5% (Standard)' : '8.5% (Average)'}</span>
                  <span>{calculatorType === 'personal' ? '22.0%' : calculatorType === 'car' ? '16.0%' : '15.0%'}</span>
                </div>

                {/* Rate shortcut benchmark chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(calculatorType === 'personal'
                    ? [
                        { label: '10.49% (Top Tier)', rate: 10.49 },
                        { label: '11.00% (Standard)', rate: 11.0 },
                        { label: '12.50% (Instant)', rate: 12.5 },
                        { label: '14.00% (NBFC)', rate: 14.0 },
                      ]
                    : calculatorType === 'car'
                    ? [
                        { label: '8.45% (EV Green)', rate: 8.45 },
                        { label: '8.75% (New Car)', rate: 8.75 },
                        { label: '9.25% (Pre-Owned)', rate: 9.25 },
                        { label: '10.50% (Commercial)', rate: 10.5 },
                      ]
                    : [
                        { label: '8.35% (SBI/HDFC)', rate: 8.35 },
                        { label: '8.50% (Standard)', rate: 8.5 },
                        { label: '8.75% (Co-op/NBFC)', rate: 8.75 },
                        { label: '9.25% (Top-Up)', rate: 9.25 },
                      ]
                  ).map(r => (
                    <button
                      key={r.label}
                      onClick={() => setInterestRate(r.rate)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition-all cursor-pointer ${
                        interestRate === r.rate
                          ? 'bg-amber-400 text-slate-950 border-amber-400'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-amber-400'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider 3: Loan Tenure */}
              <div className="space-y-3 bg-slate-50/70 p-5 rounded-2xl border border-slate-100">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-amber-500" />
                    Loan Tenure
                  </span>
                  <div className="px-4 py-1 rounded-xl bg-white border border-slate-200 font-extrabold text-[#0B1B3D] text-base font-['Outfit'] shadow-xs">
                    {tenureYears} Years <span className="text-xs text-slate-400 font-normal">({tenureYears * 12} Mos)</span>
                  </div>
                </div>

                <input
                  type="range"
                  min={1}
                  max={calculatorType === 'personal' ? 5 : calculatorType === 'car' ? 8 : 30}
                  step={1}
                  value={tenureYears}
                  onChange={e => setTenureYears(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />

                <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                  <span>1 Year</span>
                  <span>{calculatorType === 'personal' ? '3 Years' : calculatorType === 'car' ? '4 Years' : '15 Years'}</span>
                  <span>{calculatorType === 'personal' ? '5 Years (Max)' : calculatorType === 'car' ? '8 Years (Max)' : '30 Years (Max)'}</span>
                </div>

                {/* Quick Tenure Buttons */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(calculatorType === 'personal'
                    ? [1, 2, 3, 4, 5]
                    : calculatorType === 'car'
                    ? [2, 3, 4, 5, 6, 7, 8]
                    : [5, 10, 15, 20, 25, 30]
                  ).map(yr => (
                    <button
                      key={yr}
                      onClick={() => setTenureYears(yr)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition-all cursor-pointer ${
                        tenureYears === yr
                          ? 'bg-amber-400 text-slate-950 border-amber-400'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-amber-400'
                      }`}
                    >
                      {yr} Yrs
                    </button>
                  ))}
                </div>
              </div>

              {/* Advance Prepayment Simulator Dropdown */}
              <div className="border border-amber-200 bg-amber-50/50 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                      Prepayment & Savings Simulator
                    </span>
                  </div>
                  <span className="text-[11px] text-amber-800 font-medium bg-amber-100 px-2 py-0.5 rounded-full">
                    Optional Smart Tool
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Extra Monthly EMI (₹):
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={1000}
                      value={monthlyExtraEmi || ''}
                      onChange={e => setMonthlyExtraEmi(Math.max(0, Number(e.target.value)))}
                      placeholder="e.g. 5,000"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-amber-200 text-xs font-bold text-slate-900 focus:outline-hidden focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Annual Lump-Sum Prepayment (₹):
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={10000}
                      value={extraPrepaymentPerYear || ''}
                      onChange={e => setExtraPrepaymentPerYear(Math.max(0, Number(e.target.value)))}
                      placeholder="e.g. 50,000 / year"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-amber-200 text-xs font-bold text-slate-900 focus:outline-hidden focus:border-amber-500"
                    />
                  </div>
                </div>

                {(monthlyExtraEmi > 0 || extraPrepaymentPerYear > 0) && (
                  <div className="p-3 bg-white rounded-xl border border-amber-300 text-xs space-y-1.5 shadow-xs">
                    <p className="font-bold text-emerald-700 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Total Interest You Will Save: {formatINR(savingsCalc.savedInterest)}
                    </p>
                    <p className="text-slate-600 text-[11px]">
                      Your loan finishes <strong className="text-slate-900">{savingsCalc.savedYears} years earlier</strong> (in {Math.ceil(savingsCalc.effectiveMonths / 12)} years instead of {tenureYears} years).
                    </p>
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Calculated Outputs Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#0B1B3D] via-[#102450] to-[#0A1835] text-white rounded-3xl p-7 sm:p-8 space-y-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
              
              <div className="space-y-6">
                {/* Repayment Header */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
                      Calculated Monthly EMI
                    </span>
                    <button
                      onClick={handleShare}
                      className="text-slate-300 hover:text-white p-1 rounded transition-colors text-xs flex items-center gap-1"
                      title="Copy calculation summary"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span className="text-[10px]">{copiedLink ? 'Copied!' : 'Share'}</span>
                    </button>
                  </div>

                  <div className="text-4xl sm:text-5xl font-black text-amber-400 font-['Outfit'] tracking-tight">
                    {formatINR(baseCalc.emi)}
                    <span className="text-sm font-normal text-slate-300"> / month</span>
                  </div>
                </div>

                {/* Financial Summary Table */}
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300">Principal Loan Amount</span>
                    <span className="font-bold text-white text-sm">{formatINR(loanAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300">Total Interest Payable</span>
                    <span className="font-bold text-amber-400 text-sm">{formatINR(baseCalc.totalInterest)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300">Annual Applicable Rate</span>
                    <span className="font-bold text-slate-200 text-sm">{interestRate}% p.a.</span>
                  </div>
                  <div className="flex justify-between items-center text-xs pt-2 border-t border-white/10">
                    <span className="font-bold text-slate-200">Total Amount Payable</span>
                    <span className="font-black text-white text-base font-['Outfit']">
                      {formatINR(baseCalc.totalPayable)}
                    </span>
                  </div>
                </div>

                {/* Visual Ratio Breakdown Bar */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-[11px] text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                      Principal ({principalPercent}%)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      Interest ({interestPercent}%)
                    </span>
                  </div>

                  <div className="w-full h-3.5 bg-white/10 rounded-full overflow-hidden flex shadow-inner">
                    <div
                      className="bg-blue-400 h-full transition-all duration-300"
                      style={{ width: `${principalPercent}%` }}
                      title={`Principal: ${formatINR(loanAmount)}`}
                    />
                    <div
                      className="bg-amber-400 h-full transition-all duration-300"
                      style={{ width: `${interestPercent}%` }}
                      title={`Interest: ${formatINR(baseCalc.totalInterest)}`}
                    />
                  </div>
                </div>

                {/* Bangalore Local Office Perks info */}
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 space-y-1">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                    <Building className="w-3.5 h-3.5" />
                    <span>BLR15 Advantage:</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Zero advisory fees, doorstep document pickup across Bangalore (Jalahalli, Peenya, Vidyaranyapura, Hebbal, Yelahanka), and access to 15+ partner banks.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 space-y-2.5">
                <button
                  onClick={() =>
                    onNavigate('eligibility', {
                      loanAmount,
                      loanType:
                        calculatorType === 'personal'
                          ? 'Personal Loan'
                          : calculatorType === 'car'
                          ? 'Car Loan'
                          : 'Home Purchase Loan',
                    })
                  }
                  className="w-full py-3.5 px-4 rounded-xl font-black text-sm bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-lg shadow-amber-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileCheck className="w-4 h-4 stroke-[2.5]" />
                  <span>Check Eligibility for {formatINR(loanAmount)}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() =>
                    onNavigate('enquiry', {
                      loanAmount,
                      loanType:
                        calculatorType === 'personal'
                          ? 'Personal Loan'
                          : calculatorType === 'car'
                          ? 'Car Loan'
                          : 'Home Purchase Loan',
                    })
                  }
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Apply Directly / Get Advisor Callback</span>
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* Amortization Schedule Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] text-[#0B1B3D] flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-500" />
                Loan Amortization & Repayment Schedule
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Yearly breakdown showing how each EMI reduces your loan principal over {tenureYears} years.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFullSchedule(!showFullSchedule)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>{showFullSchedule ? 'Collapse Table' : 'Expand All Years'}</span>
                {showFullSchedule ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-900 uppercase font-bold text-[10px] tracking-wider border-y border-slate-200">
                <tr>
                  <th className="py-3 px-3">Year</th>
                  <th className="py-3 px-3">Opening Balance</th>
                  <th className="py-3 px-3 text-emerald-700">Principal Paid</th>
                  <th className="py-3 px-3 text-amber-700">Interest Paid</th>
                  <th className="py-3 px-3">Total Payment</th>
                  <th className="py-3 px-3">Closing Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {(showFullSchedule ? amortizationSchedule : amortizationSchedule.slice(0, 5)).map(row => (
                  <tr key={row.year} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-bold text-[#0B1B3D]">Year {row.year}</td>
                    <td className="py-3 px-3 font-mono">{formatINR(row.openingBalance)}</td>
                    <td className="py-3 px-3 font-mono font-semibold text-emerald-700">
                      {formatINR(row.principalPaid)}
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-amber-700">
                      {formatINR(row.interestPaid)}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      {formatINR(row.totalPaid)}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">
                      {formatINR(row.closingBalance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!showFullSchedule && amortizationSchedule.length > 5 && (
            <div className="text-center pt-2">
              <button
                onClick={() => setShowFullSchedule(true)}
                className="text-xs font-bold text-amber-600 hover:text-amber-700 transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                <span>View remaining {amortizationSchedule.length - 5} years in the schedule</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Home Loan Formulas & Educational FAQs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Formula Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-600" />
              <h3 className="text-base font-bold font-['Outfit'] text-[#0B1B3D]">
                How is Home Loan EMI Calculated?
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Standard lenders across India use the mathematical reducing balance formula:
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-bold text-slate-800 text-center">
              EMI = [P x R x (1+R)^N] / [(1+R)^N - 1]
            </div>
            <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
              <li><strong>P</strong> = Principal Loan Amount</li>
              <li><strong>R</strong> = Monthly Interest Rate (Annual Rate ÷ 12 ÷ 100)</li>
              <li><strong>N</strong> = Number of monthly installments (Tenure in Years x 12)</li>
            </ul>
          </div>

          {/* Bangalore Branch Contact Banner */}
          <div className="bg-gradient-to-br from-[#0B1B3D] to-[#122A63] text-white rounded-3xl p-6 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 uppercase">
                Doorstep Consultation
              </span>
              <h3 className="text-lg font-bold font-['Outfit'] text-white">
                Need Help Finding the Lowest Rates?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Bank interest rates fluctuate daily. Our Bangalore advisors negotiate directly with HDFC, SBI, ICICI, Axis, and leading housing finance companies for exclusive branch concessions.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-2">
              <button
                onClick={() => onNavigate('contact')}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
              >
                Visit Bangalore Office
              </button>
              <button
                onClick={() => onNavigate('eligibility')}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-colors cursor-pointer"
              >
                Check FOIR Eligibility
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
