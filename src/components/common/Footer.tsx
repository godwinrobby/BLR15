import React from 'react';
import { BLR15Logo } from './BLR15Logo';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Shield,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { BLR15_OFFICE_DETAILS } from '../../data/initialData';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onSwitchView: (view: 'website' | 'mobile-app' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSwitchView }) => {
  return (
    <footer className="bg-[#0A162D] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <BLR15Logo variant="white" />
            <p className="text-slate-400 text-sm leading-relaxed">
              BLR15 Home Loans is Bangalore's dedicated home finance advisory. We connect homebuyers to premier banking and NBFC partners with transparent guidance, competitive interest rates, and dedicated doorstep service.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${BLR15_OFFICE_DETAILS.whatsapp}?text=Hello%20BLR15%20Team,%20I%20am%20interested%20in%20a%20Home%20Loan.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-white/20" />
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-base tracking-wide uppercase font-['Outfit'] border-b border-amber-400/30 pb-2 inline-block">
              Quick Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-amber-400 transition-colors text-slate-300 flex items-center gap-1.5"
                >
                  <span className="text-amber-400">›</span> Home Page
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('home-loans')}
                  className="hover:text-amber-400 transition-colors text-slate-300 flex items-center gap-1.5"
                >
                  <span className="text-amber-400">›</span> Home Loan Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('eligibility')}
                  className="text-amber-400 font-bold hover:underline flex items-center gap-1.5"
                >
                  <span className="text-amber-400">›</span> Check Loan Eligibility
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('calculator')}
                  className="hover:text-amber-400 transition-colors text-slate-300 flex items-center gap-1.5"
                >
                  <span className="text-amber-400">›</span> Interactive EMI Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('track')}
                  className="hover:text-amber-400 transition-colors text-slate-300 flex items-center gap-1.5"
                >
                  <span className="text-amber-400">›</span> Track Enquiry Status
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-amber-400 transition-colors text-slate-300 flex items-center gap-1.5"
                >
                  <span className="text-amber-400">›</span> About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-amber-400 transition-colors text-slate-300 flex items-center gap-1.5"
                >
                  <span className="text-amber-400">›</span> Contact BLR15 Office
                </button>
              </li>
            </ul>
          </div>

          {/* Home Loan Products */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-base tracking-wide uppercase font-['Outfit'] border-b border-amber-400/30 pb-2 inline-block">
              Loan Solutions
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Home Purchase Loan (New / Resale)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Home Construction Loan (Self Build)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Home Loan Balance Transfer
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Home Loan Top-Up & Renovation
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Plot Purchase + Construction Loan
              </li>
            </ul>
            <div className="pt-2">
              <button
                onClick={() => onSwitchView('admin')}
                className="text-xs text-amber-300/80 hover:text-amber-300 flex items-center gap-1 underline underline-offset-4"
              >
                <Shield className="w-3.5 h-3.5" />
                Staff / Admin Management Portal
              </button>
            </div>
          </div>

          {/* Office Address & Working Hours */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-base tracking-wide uppercase font-['Outfit'] border-b border-amber-400/30 pb-2 inline-block">
              Office Location
            </h3>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                <p className="leading-snug text-slate-300">
                  <strong className="text-white">BLR15 Home Loans</strong><br />
                  {BLR15_OFFICE_DETAILS.addressLine1}<br />
                  {BLR15_OFFICE_DETAILS.addressLine2}<br />
                  {BLR15_OFFICE_DETAILS.addressLine3}<br />
                  Bangalore – 560015
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${BLR15_OFFICE_DETAILS.phone}`} className="hover:text-amber-400 transition-colors">
                  {BLR15_OFFICE_DETAILS.phone} / {BLR15_OFFICE_DETAILS.landline}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`mailto:${BLR15_OFFICE_DETAILS.email}`} className="hover:text-amber-400 transition-colors">
                  {BLR15_OFFICE_DETAILS.email}
                </a>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-xs">{BLR15_OFFICE_DETAILS.workingHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Regulatory & Trust Disclaimer */}
        <div className="border-t border-slate-800/80 pt-6 text-xs text-slate-400 leading-relaxed space-y-2">
          <p>
            <strong>Regulatory & Transparency Disclaimer:</strong> BLR15 is an independent professional home loan lead-generation and financial consultancy platform based in Bangalore. Loan sanction, tenure, interest rate, processing fee, and disbursement are strictly subject to individual creditworthiness, CIBIL assessment, property legal/technical evaluation, and underwriting norms of the partner banks and registered Housing Finance Companies (HFCs). We do not charge upfront file fees or make unsupported promises such as guaranteed loan sanctions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/60 text-slate-400 text-xs">
            <p>© {new Date().getFullYear()} BLR15 Home Loans. All rights reserved. Bangalore, Karnataka - 560015.</p>
            <div className="flex items-center gap-4">
              <span className="hover:text-slate-300 cursor-pointer" onClick={() => onNavigate('contact')}>Contact</span>
              <span>•</span>
              <span className="hover:text-slate-300 cursor-pointer" onClick={() => onNavigate('eligibility')}>Eligibility Tool</span>
              <span>•</span>
              <button
                onClick={() => onSwitchView('mobile-app')}
                className="text-amber-400 hover:text-amber-300"
              >
                Mobile View
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
