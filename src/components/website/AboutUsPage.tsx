import React from 'react';
import {
  ShieldCheck,
  Target,
  Award,
  Users,
  MapPin,
  CheckCircle2,
  Building,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { BLR15_OFFICE_DETAILS } from '../../data/initialData';

interface AboutUsPageProps {
  onNavigate: (tab: string) => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            About BLR15
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-[#0B1B3D] font-['Outfit']">
            Your Dream Home, Our Commitment
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            BLR15 Home Loans was established with a singular focus: to simplify the complex journey of financing a home in Bangalore through transparent advisory, personalized attention, and competitive interest rates.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0B1B3D] text-amber-400 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-['Outfit'] text-[#0B1B3D]">
              Our Mission
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              To empower every aspiring homeowner in Bangalore with accurate eligibility insights, fast turnarounds, and access to the best home loan rates from leading financial institutions.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-['Outfit'] text-[#0B1B3D]">
              Zero-Hype Transparency
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              We never make false promises or unsupported guarantees like "100% instant approvals". We conduct genuine credit and legal checks to ensure smooth, predictable disbursals without hidden surprises.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0B1B3D] text-amber-400 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-['Outfit'] text-[#0B1B3D]">
              Local Bangalore Footprint
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Headquartered on Kammagondanahalli Main Road, Jalahalli West (560015), our field officers understand local layout approvals (BBMP, BDA, BMRDA, A-Khata, B-Khata) thoroughly.
            </p>
          </div>
        </div>

        {/* Why Homebuyers Choose BLR15 */}
        <div className="bg-gradient-to-br from-[#0B1B3D] via-[#102450] to-[#0A1835] text-white rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
                The BLR15 Advantage
              </span>
              <h2 className="text-3xl font-black font-['Outfit']">
                Why Bangalore Families Trust Us
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  'Single window for comparing 12+ Banks & HFCs',
                  'Doorstep pickup of KYC & property documents',
                  'Dedicated senior loan officer from file prep to registration',
                  'Transparent calculation of FOIR & affordable EMIs',
                  'Plot purchase + construction composite loan specialists',
                  'Balance transfer savings calculation with zero bias',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 text-center lg:text-right space-y-4">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs text-center space-y-2">
                <span className="text-xs text-amber-300 font-bold uppercase">Ready to check your options?</span>
                <div className="text-2xl font-black text-white font-['Outfit']">
                  2-Minute Eligibility
                </div>
                <button
                  onClick={() => onNavigate('eligibility')}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Check Eligibility</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
