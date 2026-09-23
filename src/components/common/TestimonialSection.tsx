import React from 'react';
import { Quote, Star, BadgeCheck } from 'lucide-react';

type TestimonialCategory = 'home' | 'personal' | 'car' | 'all';

interface Testimonial {
  name: string;
  location: string;
  role: string;
  category: 'home' | 'personal' | 'car';
  loanTag: string;
  metric: string;
  quote: string;
}

// Verified customer stories — names & cities from across South India
const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Suresh Babu Naidu',
    location: 'Whitefield, Bengaluru',
    role: 'Senior Engineer, IT Sector',
    category: 'home',
    loanTag: 'Home Loan Balance Transfer',
    metric: '₹14,500 saved / month',
    quote:
      'We moved our home loan to a lower rate through BLR15 and our EMI dropped by ₹14,500 a month. The team handled every document — we just signed at our doorstep.',
  },
  {
    name: 'Anitha Rajan',
    location: 'Adyar, Chennai',
    role: 'Architect',
    category: 'home',
    loanTag: 'Home Purchase Loan',
    metric: '₹48L sanctioned in 11 days',
    quote:
      'As first-time buyers we knew nothing about stamp duty or legal checks. BLR15 guided us through every step and our ₹48 lakh loan was sanctioned in just 11 days.',
  },
  {
    name: 'Vijay Kumar Reddy',
    location: 'Kukatpally, Hyderabad',
    role: 'Business Owner',
    category: 'home',
    loanTag: 'Home Construction Loan',
    metric: '8.35% interest rate',
    quote:
      'I compared five banks myself and got confused. BLR15 simplified everything and arranged 8.35% for my construction loan with a zero hidden-fee breakup.',
  },
  {
    name: 'Deepika Shetty',
    location: 'Hampankatta, Mangaluru',
    role: 'Senior Nurse',
    category: 'personal',
    loanTag: 'Instant Personal Loan',
    metric: '₹5L in 24 hours',
    quote:
      "My father's surgery needed funds overnight. BLR15's instant personal loan got ₹5 lakhs into my account within 24 hours — truly paperless and stress-free.",
  },
  {
    name: 'Aravind Krishnan',
    location: 'R.S. Puram, Coimbatore',
    role: 'Chartered Accountant',
    category: 'personal',
    loanTag: 'Personal Loan – Wedding',
    metric: '₹8L · 100% paperless',
    quote:
      'Wedding expenses were spiralling out of control. BLR15 got me an ₹8 lakh personal loan at a fair rate with an EMI I could actually manage.',
  },
  {
    name: 'Priya Menon',
    location: 'Kakkanad, Kochi',
    role: 'Software Developer',
    category: 'personal',
    loanTag: 'Personal Loan – Renovation',
    metric: 'Disbursed in 3 days',
    quote:
      'Everything was online — KYC, documents, approval. My personal loan for the home renovation was disbursed without a single branch visit.',
  },
  {
    name: 'Karthik Iyer',
    location: 'Vijayanagar, Mysuru',
    role: 'Sales Manager',
    category: 'car',
    loanTag: 'New Car Loan',
    metric: '100% on-road funding',
    quote:
      'BLR15 got my new car loan sanctioned for the full on-road price. Dealer coordination and the repayment tenure were all handled for me.',
  },
  {
    name: 'Srinivas Rao',
    location: 'Gajuwaka, Visakhapatnam',
    role: 'Government Employee',
    category: 'car',
    loanTag: 'Used Car Loan',
    metric: '₹6.5L @ 9.1%',
    quote:
      'Banks were refusing my used-car loan. BLR15 found an NBFC partner and arranged ₹6.5 lakhs at 9.1% within four days.',
  },
  {
    name: 'Meenakshi Sundaram',
    location: 'Anna Nagar, Madurai',
    role: 'Doctor',
    category: 'car',
    loanTag: 'EV Car Loan',
    metric: 'EV rate · 3-day sanction',
    quote:
      'Special EV rate, quick sanction, and the paperwork came to my office. My electric car loan was approved in just 3 days.',
  },
];

const HEADERS: Record<TestimonialCategory, { eyebrow: string; title: string; subtitle: string }> = {
  all: {
    eyebrow: 'Verified Customer Stories',
    title: 'Trusted by Families Across South India',
    subtitle:
      'Real feedback from our home, personal and car loan customers in Bengaluru, Chennai, Hyderabad, Kochi, Coimbatore and beyond.',
  },
  home: {
    eyebrow: 'Home Loan Experiences',
    title: 'What Our Home Loan Borrowers Say',
    subtitle:
      'Handpicked stories from families we have helped become homeowners across Bangalore, Chennai, Hyderabad and Coimbatore.',
  },
  personal: {
    eyebrow: 'Personal Loan Experiences',
    title: 'What Our Personal Loan Customers Say',
    subtitle:
      'Instant, paperless personal loans — hear how borrowers from Mangaluru, Coimbatore and Kochi experienced BLR15.',
  },
  car: {
    eyebrow: 'Car Loan Experiences',
    title: 'What Our Car Loan Customers Say',
    subtitle:
      'From new cars to EVs — real experiences from our customers in Mysuru, Visakhapatnam and Madurai.',
  },
};

const getInitials = (name: string) =>
  name
    .split(' ')
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase();

interface TestimonialSectionProps {
  category?: TestimonialCategory;
}

export const TestimonialSection: React.FC<TestimonialSectionProps> = ({ category = 'all' }) => {
  const header = HEADERS[category];
  const visible =
    category === 'all'
      ? (['home', 'personal', 'car'] as const)
          .map(c => TESTIMONIALS.find(t => t.category === c)!)
          .filter(Boolean)
      : TESTIMONIALS.filter(t => t.category === category);

  return (
    <section className="py-20 px-4 sm:px-6 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold tracking-wide uppercase">
            {header.eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-['Outfit'] text-[#0B1B3D]">{header.title}</h2>
          <p className="text-slate-600 text-base">{header.subtitle}</p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visible.map(t => (
            <div
              key={t.name}
              className="group relative bg-white rounded-3xl border border-slate-200 p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col"
            >
              <Quote className="w-9 h-9 text-amber-400/70 fill-amber-100 mb-4" />
              <div className="flex items-center gap-0.5 mb-3" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed flex-1">“{t.quote}”</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200">
                  {t.metric}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold border border-slate-200">
                  {t.loanTag}
                </span>
              </div>
              <div className="mt-5 pt-5 border-t border-slate-100 flex items-center gap-3">
                <div className="w-11 h-11 shrink-0 rounded-full bg-gradient-to-br from-[#0B1B3D] to-[#122A63] text-amber-400 font-black font-['Outfit'] flex items-center justify-center text-sm">
                  {getInitials(t.name)}
                </div>
                <div className="min-w-0">
                  <p className="flex items-center gap-1 text-sm font-extrabold text-[#0B1B3D] font-['Outfit'] truncate">
                    <span className="truncate">{t.name}</span>
                    <BadgeCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {t.location} · {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Strip */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-600 font-semibold">
          <span className="inline-flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            4.9 / 5 average customer rating
          </span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span>2,500+ South Indian families served</span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span>20+ banking &amp; NBFC partners</span>
        </div>
      </div>
    </section>
  );
};

