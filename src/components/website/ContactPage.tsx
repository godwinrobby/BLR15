import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  CheckCircle2,
  ExternalLink,
  Navigation,
  Building2,
  Sparkles,
} from 'lucide-react';
import { BLR15_OFFICE_DETAILS } from '../../data/initialData';
import { createEnquiry } from '../../services/storageService';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    createEnquiry({
      customerName: formData.name,
      mobile: formData.phone,
      email: formData.email || 'not-provided@blr15.in',
      city: 'Bangalore',
      employmentType: 'Salaried',
      monthlyIncome: 100000,
      requiredLoanAmount: 4000000,
      propertyValue: 5500000,
      propertyType: 'Apartment',
      propertyLocation: 'Bangalore Area',
      message: `Contact Form Message: ${formData.message}`,
      source: 'Website Form',
      status: 'New',
    });

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Bangalore Branch
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#0B1B3D] font-['Outfit']">
            Contact BLR15 Home Loans
          </h1>
          <p className="text-amber-600 font-bold text-base sm:text-lg font-['Outfit']">
            Your Dream Home, Our Commitment
          </p>
          <p className="text-slate-600 text-sm max-w-lg mx-auto">
            Reach out to our dedicated Bangalore team for inquiries, rate comparisons, or to schedule a meeting at our office.
          </p>
        </div>

        {/* 2-Column Layout: Details + Map vs Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Office Details + Interactive Map preview */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Office Cards */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
              <h2 className="text-xl font-bold font-['Outfit'] text-[#0B1B3D] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-500" />
                Office Headquarters
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Address */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
                    <MapPin className="w-4 h-4 text-amber-500" />
                    <span>Office Address</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                    BLR15 Home Loans<br />
                    {BLR15_OFFICE_DETAILS.addressLine1}<br />
                    {BLR15_OFFICE_DETAILS.addressLine2}<br />
                    {BLR15_OFFICE_DETAILS.addressLine3}<br />
                    {BLR15_OFFICE_DETAILS.city} – {BLR15_OFFICE_DETAILS.pincode}
                  </p>
                  <a
                    href={BLR15_OFFICE_DETAILS.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 pt-1"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Open in Google Maps</span>
                  </a>
                </div>

                {/* Direct Contact */}
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
                      <Phone className="w-4 h-4 text-amber-500" />
                      <span>Phone Numbers</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800">
                      <a href={`tel:${BLR15_OFFICE_DETAILS.phone}`} className="hover:text-amber-600">
                        {BLR15_OFFICE_DETAILS.phone}
                      </a>
                    </p>
                    <p className="text-xs text-slate-500">
                      Landline: {BLR15_OFFICE_DETAILS.landline}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
                      <Mail className="w-4 h-4 text-amber-500" />
                      <span>Email Enquiries</span>
                    </div>
                    <p className="text-xs font-medium text-slate-700">
                      <a href={`mailto:${BLR15_OFFICE_DETAILS.email}`} className="hover:text-amber-600">
                        {BLR15_OFFICE_DETAILS.email}
                      </a>
                    </p>
                    <p className="text-xs text-slate-500">
                      {BLR15_OFFICE_DETAILS.supportEmail}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span>Working Hours</span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium">
                      {BLR15_OFFICE_DETAILS.workingHours}
                    </p>
                  </div>
                </div>

              </div>

              {/* Fast WhatsApp Connect Button */}
              <div className="pt-4 border-t border-slate-100">
                <a
                  href={`https://wa.me/${BLR15_OFFICE_DETAILS.whatsapp}?text=Hello%20BLR15%20Team,%20I%20would%20like%20to%20inquire%20about%20a%20home%20loan.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm text-center flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <MessageCircle className="w-5 h-5 fill-white/20" />
                  <span>Chat Directly on WhatsApp (+91 98450 15150)</span>
                </a>
              </div>
            </div>

            {/* Bangalore Map View Container */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  <span>Location Map • Jalahalli West / Kammagondanahalli</span>
                </div>
                <a
                  href={BLR15_OFFICE_DETAILS.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-amber-600 font-bold hover:underline flex items-center gap-1"
                >
                  <span>Get Directions</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Styled Map Container */}
              <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200">
                <iframe
                  title="BLR15 Office Location Map"
                  src="https://maps.google.com/maps?q=Kammagondanahalli+Main+Road+Jalahalli+West+Bangalore+560015&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                />
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 shadow-md text-[11px] font-bold text-[#0B1B3D] flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Near Narasimha Swamy Temple, 1st Floor
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm h-full flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold font-['Outfit'] text-[#0B1B3D] mb-1">
                  Send a Quick Message
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  Have an enquiry or want a callback? Drop your contact details below.
                </p>

                {submitted ? (
                  <div className="py-12 text-center space-y-4 animate-in fade-in">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                    </div>
                    <h4 className="text-lg font-bold text-[#0B1B3D] font-['Outfit']">
                      Message Received!
                    </h4>
                    <p className="text-xs text-slate-600 max-w-xs mx-auto">
                      Thank you for contacting BLR15. Our Bangalore loan officer will call you shortly.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: '', phone: '', email: '', message: '' });
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors"
                    >
                      Send Another Note
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Suresh Gowda"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 98450 12345"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. suresh@example.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        How Can We Help? *
                      </label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Tell us what type of home loan or property you are planning in Bangalore..."
                        value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl font-extrabold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4 stroke-[2.5]" />
                      <span>Submit Request</span>
                    </button>
                  </form>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center">
                Need immediate response? Call our direct helpline at <strong className="text-slate-700">{BLR15_OFFICE_DETAILS.phone}</strong>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
