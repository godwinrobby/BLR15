import React, { useState } from 'react';
import { BLR15Logo } from './BLR15Logo';
import {
  Menu,
  X,
  Phone,
  FileCheck,
  Search,
  ArrowRight,
  Home,
  Wallet,
  Car,
  Calculator,
  PhoneCall,
  Sparkles,
} from 'lucide-react';
import { BLR15_OFFICE_DETAILS } from '../../data/initialData';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'home-loans', label: 'Home Loans', icon: Home },
    { id: 'personal-loan', label: 'Personal Loan', icon: Wallet },
    { id: 'car-loan', label: 'Car loans', icon: Car },
    { id: 'calculator', label: 'EMI Calculator', icon: Calculator },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top micro bar with contact info and mode switcher */}
      <div className="bg-[#0B1B3D] text-slate-300 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-amber-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Bangalore's Trusted Home Loan Advisors (Pin 560015)
            </span>
            <a
              href={`tel:${BLR15_OFFICE_DETAILS.phone}`}
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{BLR15_OFFICE_DETAILS.phone}</span>
            </a>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Track Enquiry */}
            <button
              onClick={() => onNavigate('track')}
              className="inline-flex items-center gap-1 text-slate-300 hover:text-amber-400 font-medium transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Track Enquiry</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div
            onClick={() => onNavigate('home')}
            className="cursor-pointer group py-2"
          >
            <BLR15Logo variant="light" />
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
            {navLinks.map(link => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`text-sm font-semibold transition-all relative py-2 flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'text-[#0B1B3D] font-bold'
                      : 'text-slate-600 hover:text-[#0B1B3D]'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Header CTA Button */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => onNavigate('eligibility')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-md shadow-amber-500/25 hover:from-amber-400 hover:to-amber-300 hover:shadow-lg hover:shadow-amber-500/35 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              <span>Check Eligibility</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
            </button>
          </div>

          {/* Mobile menu hamburger button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => onNavigate('eligibility')}
              className="sm:hidden px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 shadow-xs"
            >
              Eligibility
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-slate-800" />
              ) : (
                <Menu className="w-6 h-6 text-slate-800" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="grid gap-1 pt-2">
            {navLinks.map(link => {
              const Icon = (link as any).icon;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    onNavigate(link.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                    currentTab === link.id
                      ? 'bg-amber-50 text-[#0B1B3D] border-l-4 border-amber-500 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    {Icon && <Icon className="w-4 h-4 text-amber-600" />}
                    <span>{link.label}</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
              );
            })}

            <button
              onClick={() => {
                onNavigate('track');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-amber-600" />
                <span>Track Enquiry Status</span>
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <button
              onClick={() => {
                onNavigate('eligibility');
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-3 rounded-xl font-bold text-center bg-amber-500 text-slate-950 shadow-md flex items-center justify-center gap-2"
            >
              <FileCheck className="w-5 h-5 stroke-[2.5]" />
              Check Eligibility (Instant)
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
