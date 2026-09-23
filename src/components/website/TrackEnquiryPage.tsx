import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  FileText,
  UserCheck,
  Building,
  ShieldCheck,
  AlertCircle,
  Phone,
  MessageCircle,
} from 'lucide-react';
import { HomeLoanEnquiry, EnquiryStatus } from '../../types';
import { getStoredEnquiries, refreshEnquiries, formatINR } from '../../services/storageService';
import { BLR15_OFFICE_DETAILS } from '../../data/initialData';

interface TrackEnquiryPageProps {
  onNavigate: (tab: string) => void;
}

export const TrackEnquiryPage: React.FC<TrackEnquiryPageProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('BLR15-0012');
  const [searchedEnquiry, setSearchedEnquiry] = useState<HomeLoanEnquiry | null>(() => {
    const list = getStoredEnquiries();
    return list.find(e => e.id === 'BLR15-0012') || null;
  });
  const [hasSearched, setHasSearched] = useState(true);

  // Keep the demo record in sync with the live /api store on mount.
  useEffect(() => {
    refreshEnquiries().then(list => {
      setSearchedEnquiry(list.find(e => e.id === 'BLR15-0012') || null);
    });
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);

    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setSearchedEnquiry(null);
      return;
    }

    const list = await refreshEnquiries();
    const cleanDigits = term.replace(/\D/g, '');

    const found = list.find(item => {
      const matchId = item.id.toLowerCase() === term;
      const matchPhone = cleanDigits.length >= 7 && item.mobile.replace(/\D/g, '').includes(cleanDigits);
      return matchId || matchPhone;
    });

    setSearchedEnquiry(found || null);
  };

  // 5 Public Status Stages from Prompt
  // Timeline: Enquiry Submitted -> Under Review -> Expert Contacted -> Documents Requested -> Application Process
  const timelineStages = [
    { key: 'submitted', label: 'Enquiry Submitted', desc: 'Enquiry received & queued for assessment' },
    { key: 'review', label: 'Under Review', desc: 'Eligibility analysis & bank matching' },
    { key: 'contacted', label: 'Expert Contacted', desc: 'BLR15 advisor called or connected' },
    { key: 'docs', label: 'Documents Requested', desc: 'Collecting KYC & income documents' },
    { key: 'application', label: 'Application Process', desc: 'File submitted to bank for sanction' },
  ];

  const getStageIndex = (status: EnquiryStatus): number => {
    switch (status) {
      case 'New':
        return 0; // Enquiry Submitted
      case 'Contacted':
        return 2; // Expert Contacted
      case 'Follow-up':
      case 'Interested':
        return 1; // Under Review / Discussion
      case 'Documents Requested':
        return 3; // Documents Requested
      case 'Application Started':
      case 'Submitted to Lender':
      case 'Approved':
      case 'Converted':
        return 4; // Application Process
      case 'Closed':
      case 'Rejected':
        return 1;
      default:
        return 0;
    }
  };

  const getStatusBadge = (status: EnquiryStatus) => {
    switch (status) {
      case 'New':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300">
            🟡 New Enquiry
          </span>
        );
      case 'Contacted':
      case 'Follow-up':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold border border-blue-300">
            🔵 In Discussion
          </span>
        );
      case 'Documents Requested':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold border border-purple-300">
            🟣 Documents Collection
          </span>
        );
      case 'Application Started':
      case 'Submitted to Lender':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold border border-cyan-300">
            🔷 Under Bank Review
          </span>
        );
      case 'Approved':
      case 'Converted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
            🟢 Sanctioned / Complete
          </span>
        );
      case 'Closed':
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-300">
            ⚪ Closed
          </span>
        );
      default:
        return null;
    }
  };

  const currentStageIndex = searchedEnquiry ? getStageIndex(searchedEnquiry.status) : 0;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-xs uppercase font-bold text-amber-600 tracking-wider">
            Real-Time Tracking
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0B1B3D] font-['Outfit']">
            Track Your Home Loan Enquiry
          </h1>
          <p className="text-slate-600 text-sm max-w-md mx-auto">
            Enter your Enquiry Reference ID (e.g. BLR15-0012) or registered 10-digit mobile number.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Enter Enquiry ID (BLR15-0012) or Mobile Number"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Track Status</span>
            </button>
          </form>

          <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
            <span>Try sample Enquiry IDs:</span>
            <button
              type="button"
              onClick={() => setSearchTerm('BLR15-0012')}
              className="text-amber-700 underline font-mono hover:text-amber-900"
            >
              BLR15-0012
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setSearchTerm('BLR15-0010')}
              className="text-amber-700 underline font-mono hover:text-amber-900"
            >
              BLR15-0010
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setSearchTerm('BLR15-0007')}
              className="text-amber-700 underline font-mono hover:text-amber-900"
            >
              BLR15-0007
            </button>
          </div>
        </div>

        {/* Results Screen */}
        {hasSearched && (
          searchedEnquiry ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
              
              {/* Top Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Enquiry Reference
                  </span>
                  <div className="text-2xl font-black text-[#0B1B3D] font-mono tracking-tight">
                    {searchedEnquiry.id}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Customer: <strong className="text-slate-800">{searchedEnquiry.customerName}</strong> • {searchedEnquiry.city}
                  </div>
                </div>

                <div className="flex flex-col sm:items-end">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Current Status
                  </span>
                  {getStatusBadge(searchedEnquiry.status)}
                </div>
              </div>

              {/* Loan Overview Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[11px] text-slate-500 block">Requested Amount</span>
                  <span className="text-sm font-black text-[#0B1B3D] font-['Outfit']">
                    {formatINR(searchedEnquiry.requiredLoanAmount)}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Property Type</span>
                  <span className="text-xs font-bold text-slate-800">
                    {searchedEnquiry.propertyType}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Enquiry Date</span>
                  <span className="text-xs font-semibold text-slate-600">
                    {new Date(searchedEnquiry.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              {/* Safe Public Timeline (No internal admin notes) */}
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Application Progress Timeline
                </h3>

                <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                  {timelineStages.map((stage, idx) => {
                    const isCompleted = idx < currentStageIndex;
                    const isCurrent = idx === currentStageIndex;

                    return (
                      <div key={stage.key} className="relative group">
                        {/* Dot indicator */}
                        <div
                          className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs transition-all ${
                            isCompleted
                              ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                              : isCurrent
                              ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-100 animate-pulse'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                          ) : (
                            <span className="text-[10px] font-bold">{idx + 1}</span>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4
                              className={`text-sm font-bold ${
                                isCurrent
                                  ? 'text-[#0B1B3D]'
                                  : isCompleted
                                  ? 'text-emerald-800'
                                  : 'text-slate-400'
                              }`}
                            >
                              {stage.label}
                            </h4>
                            {isCurrent && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase">
                                Current Step
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {stage.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Need Assistance card */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-500 text-center sm:text-left">
                  Questions regarding your application? Call our Bangalore office:
                  <div className="font-bold text-[#0B1B3D] text-sm mt-0.5">
                    {BLR15_OFFICE_DETAILS.phone} (9:30 AM – 7:00 PM)
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${BLR15_OFFICE_DETAILS.whatsapp}?text=Hello%20BLR15,%20checking%20status%20of%20enquiry%20${searchedEnquiry.id}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp BLR15</span>
                  </a>

                  <a
                    href={`tel:${BLR15_OFFICE_DETAILS.phone}`}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-600" />
                    <span>Call Us</span>
                  </a>
                </div>
              </div>

            </div>
          ) : (
            /* Not Found State */
            <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0B1B3D] font-['Outfit']">
                No Enquiry Found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We couldn't find an enquiry matching "{searchTerm}". Please verify your Enquiry ID (e.g. BLR15-0012) or try searching with your mobile number.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('enquiry')}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xs"
                >
                  Submit a New Enquiry
                </button>
              </div>
            </div>
          )
        )}

      </div>
    </div>
  );
};
