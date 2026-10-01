import { HomeLoanEnquiry, AdminUser } from '../types';

export const BLR15_OFFICE_DETAILS = {
  name: 'BLR15 Home Loans',
  tagline: 'Your Dream Home, Our Commitment',
  subTagline: 'Turn Your Dreams Into Homes',
  addressLine1: 'Near Narasimha Swamy Temple',
  addressLine2: '1st Floor, Kammagondanahalli Main Road',
  addressLine3: 'Kammagondanahalli, Jalahalli West',
  city: 'Bangalore',
  state: 'Karnataka',
  pincode: '560015',
  fullAddress: 'Near Narasimha Swamy Temple, 1st Floor, Kammagondanahalli Main Road, Kammagondanahalli, Jalahalli West, Bangalore – 560015',
  phone: '+91 98450 15150',
  landline: '080 2838 1515',
  whatsapp: '+919845015150',
  email: 'contact@blr15homeloans.com',
  supportEmail: 'support@blr15.in',
  workingHours: 'Mon – Sat: 9:30 AM – 7:00 PM (Sunday by appointment)',
  googleMapsUrl: 'https://maps.google.com/?q=Kammagondanahalli+Main+Road+Jalahalli+West+Bangalore+560015',
};

export const INITIAL_STAFF: AdminUser[] = [
  {
    id: 'staff-1',
    name: 'Rajesh Kumar',
    email: 'rajesh.k@blr15.in',
    role: 'Super Admin',
    phone: '+91 98450 15150',
    active: true,
  },
  {
    id: 'staff-2',
    name: 'Priya Sharma',
    email: 'priya.s@blr15.in',
    role: 'Admin',
    phone: '+91 98452 33410',
    active: true,
  },
  {
    id: 'staff-3',
    name: 'Suresh Gowda',
    email: 'suresh.g@blr15.in',
    role: 'Loan Executive',
    phone: '+91 99001 88290',
    active: true,
  },
];

/**
 * Demo enquiry rows used to ship with the SPA. Retired: the Laravel API
 * (GET /api/v1/admin/enquiries) is now the only source of enquiry data, so the
 * cache starts empty and is populated by refreshEnquiries().
 *
 * Kept as an empty, correctly-typed array so any remaining import still
 * compiles; delete once no consumers remain.
 */
export const INITIAL_ENQUIRIES: HomeLoanEnquiry[] = [];
