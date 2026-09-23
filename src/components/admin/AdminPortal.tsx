import React, { useState, useEffect, useMemo } from 'react';
import {
  Shield,
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  Settings as SettingsIcon,
  Search,
  Filter,
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Download,
  Plus,
  Edit,
  Trash2,
  UserCheck,
  Eye,
  ArrowUpDown,
  Building,
  ArrowRight,
  LogOut,
  Sparkles,
  RefreshCw,
  X,
  Send,
  Menu,
  Globe,
  ChevronLeft,
  Database,
  Cloud,
} from 'lucide-react';
import { BLR15Logo } from '../common/BLR15Logo';
import { SupabaseManager } from './SupabaseManager';
import {
  HomeLoanEnquiry,
  EnquiryStatus,
  AdminUser,
  AdminRole,
  EmploymentType,
} from '../../types';
import {
  getStoredEnquiries,
  getStoredStaff,
  updateEnquiryStatus,
  updateEnquiryDetails,
  addFollowUpToEnquiry,
  exportEnquiriesToCSV,
  formatINR,
  saveStaff,
} from '../../services/storageService';
import { BLR15_OFFICE_DETAILS, INITIAL_STAFF } from '../../data/initialData';

interface AdminPortalProps {
  onSwitchView: (view: 'website' | 'mobile-app' | 'admin') => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onSwitchView }) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser>({
    id: 'staff-1',
    name: 'Rajesh Kumar',
    email: 'rajesh.k@blr15.in',
    role: 'Super Admin',
    phone: '+91 98450 15150',
    active: true,
  });

  const [activeSection, setActiveSection] = useState<'dashboard' | 'enquiries' | 'followups' | 'reports' | 'database' | 'settings'>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Enquiries state
  const [enquiries, setEnquiries] = useState<HomeLoanEnquiry[]>([]);
  const [staffList, setStaffList] = useState<AdminUser[]>([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState<HomeLoanEnquiry | null>(null);

  const newEnquiriesCount = useMemo(() => enquiries.filter(e => e.status === 'New').length, [enquiries]);
  const followUpsCount = useMemo(() => enquiries.filter(e => e.status === 'Follow-up' || Boolean(e.nextFollowUpDate)).length, [enquiries]);

  // Communication modal state
  const [commModal, setCommModal] = useState<{
    isOpen: boolean;
    type: 'whatsapp' | 'email' | 'call';
    enquiry: HomeLoanEnquiry | null;
    template: string;
  }>({
    isOpen: false,
    type: 'whatsapp',
    enquiry: null,
    template: 'received',
  });

  // Filters and search for enquiries table
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterLocation, setFilterLocation] = useState<string>('All');
  const [filterEmployment, setFilterEmployment] = useState<string>('All');
  const [filterStaff, setFilterStaff] = useState<string>('All');

  // Follow up form modal in details
  const [newFollowUpDate, setNewFollowUpDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [newFollowUpTime, setNewFollowUpTime] = useState('11:00 AM');
  const [newFollowUpNotes, setNewFollowUpNotes] = useState('');

  // Settings State
  const [companySettings, setCompanySettings] = useState({
    companyName: BLR15_OFFICE_DETAILS.name,
    phone: BLR15_OFFICE_DETAILS.phone,
    email: BLR15_OFFICE_DETAILS.email,
    address: BLR15_OFFICE_DETAILS.fullAddress,
    heroTitle: 'Turn Your Dreams Into Homes',
    heroTagline: 'Your Dream Home, Our Commitment',
  });

  const loadData = () => {
    const list = getStoredEnquiries();
    setEnquiries(list);
    setStaffList(getStoredStaff());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('blr15-enquiries-updated', loadData);
    return () => window.removeEventListener('blr15-enquiries-updated', loadData);
  }, []);

  // Filtered enquiries
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter(item => {
      // Search: Name, Mobile, Enquiry ID
      const query = searchTerm.toLowerCase().trim();
      const matchSearch =
        !query ||
        item.customerName.toLowerCase().includes(query) ||
        item.mobile.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query);

      // Filters
      const matchStatus = filterStatus === 'All' || item.status === filterStatus;
      const matchLoc =
        filterLocation === 'All' ||
        (item.propertyLocation && item.propertyLocation.toLowerCase().includes(filterLocation.toLowerCase()));
      const matchEmp = filterEmployment === 'All' || item.employmentType === filterEmployment;
      const matchStaff = filterStaff === 'All' || item.assignedStaff === filterStaff;

      return matchSearch && matchStatus && matchLoc && matchEmp && matchStaff;
    });
  }, [enquiries, searchTerm, filterStatus, filterLocation, filterEmployment, filterStaff]);

  // Dashboard Metrics (Base requested: Total 125, New 28, Contacted 42, Follow-up 31, Converted 15, Closed 9 + live additions)
  const dashboardStats = useMemo(() => {
    const baseOffset = {
      total: 125,
      new: 28,
      contacted: 42,
      followUp: 31,
      converted: 15,
      closed: 9,
    };

    // Calculate actual counts from current enquiries
    const liveNew = enquiries.filter(e => e.status === 'New').length;
    const liveContacted = enquiries.filter(e => e.status === 'Contacted').length;
    const liveFollowUp = enquiries.filter(e => e.status === 'Follow-up').length;
    const liveConverted = enquiries.filter(e => e.status === 'Converted').length;
    const liveClosed = enquiries.filter(e => e.status === 'Closed').length;

    return {
      total: Math.max(baseOffset.total, enquiries.length),
      new: Math.max(baseOffset.new, liveNew),
      contacted: Math.max(baseOffset.contacted, liveContacted),
      followUp: Math.max(baseOffset.followUp, liveFollowUp),
      converted: Math.max(baseOffset.converted, liveConverted),
      closed: Math.max(baseOffset.closed, liveClosed),
    };
  }, [enquiries]);

  // All status options from prompt
  const allStatuses: EnquiryStatus[] = [
    'New',
    'Contacted',
    'Follow-up',
    'Interested',
    'Documents Requested',
    'Application Started',
    'Submitted to Lender',
    'Approved',
    'Rejected',
    'Converted',
    'Closed',
  ];

  // Handler for updating status
  const handleStatusChange = (newStatus: EnquiryStatus, note?: string) => {
    if (!selectedEnquiry) return;
    const updated = updateEnquiryStatus(
      selectedEnquiry.id,
      newStatus,
      currentAdmin.name,
      note || `Status updated to ${newStatus}`
    );
    if (updated) {
      setSelectedEnquiry(updated);
      loadData();
    }
  };

  // Handler for assigning staff
  const handleStaffAssign = (staffName: string) => {
    if (!selectedEnquiry) return;
    const updated = updateEnquiryDetails(
      selectedEnquiry.id,
      { assignedStaff: staffName },
      currentAdmin.name
    );
    if (updated) {
      setSelectedEnquiry(updated);
      loadData();
    }
  };

  // Handler for saving remarks
  const handleRemarksSave = (remarks: string) => {
    if (!selectedEnquiry) return;
    const updated = updateEnquiryDetails(
      selectedEnquiry.id,
      { internalRemarks: remarks },
      currentAdmin.name
    );
    if (updated) {
      setSelectedEnquiry(updated);
      loadData();
    }
  };

  // Handler for adding follow up
  const handleAddFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry || !newFollowUpNotes) return;

    addFollowUpToEnquiry(
      selectedEnquiry.id,
      newFollowUpDate,
      newFollowUpTime,
      newFollowUpNotes,
      currentAdmin.name
    );

    // Update status to 'Follow-up' if it was 'New'
    if (selectedEnquiry.status === 'New') {
      updateEnquiryStatus(
        selectedEnquiry.id,
        'Follow-up',
        currentAdmin.name,
        `Follow-up scheduled for ${newFollowUpDate}`
      );
    }

    setNewFollowUpNotes('');
    loadData();
    const updated = getStoredEnquiries().find(item => item.id === selectedEnquiry.id);
    if (updated) setSelectedEnquiry(updated);
  };

  // Communication message templates
  const getCommMessage = (type: string, enquiry: HomeLoanEnquiry): string => {
    switch (type) {
      case 'received':
        return `Hello ${enquiry.customerName}, Greetings from BLR15 Home Loans! We have received your home loan enquiry #${enquiry.id} for ₹${(enquiry.requiredLoanAmount / 100000).toFixed(1)} Lakhs. Our Bangalore loan specialist will connect with you to review the best lender rates.`;
      case 'reminder':
        return `Hello ${enquiry.customerName}, this is a reminder from BLR15 regarding your scheduled home loan discussion for property in ${enquiry.propertyLocation || 'Bangalore'}. Please let us know if this is a good time to talk.`;
      case 'documents':
        return `Hello ${enquiry.customerName}, to proceed with your home loan sanction for enquiry #${enquiry.id}, please keep ready: 1) Latest 3 months payslips, 2) 6 months bank statement, 3) PAN & Aadhaar copy, 4) Property cost sheet. We offer doorstep document pickup in Bangalore.`;
      case 'update':
        return `Hello ${enquiry.customerName}, update regarding your BLR15 Home Loan application #${enquiry.id}: Current status is "${enquiry.status}". For any queries, contact our office at ${BLR15_OFFICE_DETAILS.phone}.`;
      default:
        return '';
    }
  };

  // If not logged in, render Admin Login screen (Prompt section 13)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <BLR15Logo variant="light" className="justify-center scale-110" />
            <span className="text-xs uppercase font-extrabold text-amber-600 tracking-wider block">
              Admin Web Application
            </span>
            <h1 className="text-2xl font-black text-[#0B1B3D] font-['Outfit']">
              Staff Portal Login
            </h1>
            <p className="text-xs text-slate-500">
              Authorized BLR15 personnel only.
            </p>
          </div>

          <form
            onSubmit={e => {
              e.preventDefault();
              setIsAuthenticated(true);
            }}
            className="space-y-4"
          >
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Email Address</label>
              <input
                type="email"
                defaultValue="rajesh.k@blr15.in"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-slate-700 uppercase">Password</label>
                <a href="#forgot" onClick={e => { e.preventDefault(); alert('Password reset link sent to admin registered email.'); }} className="text-amber-600 hover:underline">
                  Forgot Password?
                </a>
              </div>
              <input
                type="password"
                defaultValue="password123"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#0B1B3D] hover:bg-[#122A63] text-white font-extrabold text-sm shadow-md transition-colors"
            >
              Sign In to Admin Panel
            </button>
          </form>

          {/* Quick Demo Login Switcher */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              Quick Role Switch (Demo)
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setCurrentAdmin(staffList[0] || INITIAL_STAFF[0]);
                  setIsAuthenticated(true);
                }}
                className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-[#0B1B3D] text-[11px] font-bold border border-amber-200"
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrentAdmin(staffList[1] || INITIAL_STAFF[1]);
                  setIsAuthenticated(true);
                }}
                className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 text-[11px] font-bold border border-blue-200"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrentAdmin(staffList[2] || INITIAL_STAFF[2]);
                  setIsAuthenticated(true);
                }}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold border border-slate-300"
              >
                Loan Exec
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => onSwitchView('website')}
              className="text-xs text-slate-500 hover:text-slate-800 underline"
            >
              ← Return to public website
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col md:flex-row">
      
      {/* Mobile Drawer Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Admin Left Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen z-50 md:z-30 w-72 bg-[#0B1B3D] text-white flex flex-col justify-between border-r border-slate-800/80 transition-transform duration-300 ease-in-out shrink-0 overflow-y-auto ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Top: Branding & Close button on mobile */}
        <div>
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div>
              <BLR15Logo variant="white" showTagline={false} />
              <div className="flex items-center gap-1.5 mt-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-400 text-slate-950 uppercase tracking-wider">
                  CRM Admin
                </span>
                <span className="text-[11px] text-slate-300 font-medium">
                  Bangalore (560015)
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              aria-label="Close Sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Summary Pill / Status banner */}
          <div className="px-4 py-2.5 bg-white/5 border-b border-white/5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium text-[11px]">Branch Pipeline</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live BLR-15 Sync
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="p-3 space-y-1">
            <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
              Menu Navigation
            </span>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null, alertBadge: null },
              { id: 'enquiries', label: 'All Enquiries', icon: Users, badge: enquiries.length, alertBadge: newEnquiriesCount > 0 ? `${newEnquiriesCount} new` : null },
              { id: 'followups', label: 'Follow-ups', icon: Clock, badge: followUpsCount > 0 ? followUpsCount : null, alertBadge: null },
              { id: 'reports', label: 'Reports & Export', icon: FileSpreadsheet, badge: null, alertBadge: null },
              { id: 'database', label: 'Supabase Cloud DB', icon: Database, badge: null, alertBadge: 'Live' },
              { id: 'settings', label: 'Branch Settings', icon: SettingsIcon, badge: null, alertBadge: null },
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id as any);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 stroke-[2.2] ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {item.alertBadge && !isActive && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                        {item.alertBadge}
                      </span>
                    )}
                    {item.badge !== null && (
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-white/10 text-slate-300'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Lead Pipeline Status Filter Shortcuts */}
          <div className="px-3 pt-2 pb-2">
            <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
              Lead Shortcuts
            </span>
            <div className="space-y-0.5">
              {[
                { label: 'All Enquiries', status: 'All', count: enquiries.length, color: 'text-slate-300' },
                { label: 'New Enquiries', status: 'New', count: enquiries.filter(e => e.status === 'New').length, color: 'text-amber-400' },
                { label: 'Contacted', status: 'Contacted', count: enquiries.filter(e => e.status === 'Contacted').length, color: 'text-blue-400' },
                { label: 'Follow-ups', status: 'Follow-up', count: enquiries.filter(e => e.status === 'Follow-up').length, color: 'text-purple-400' },
                { label: 'Converted', status: 'Converted', count: enquiries.filter(e => e.status === 'Converted').length, color: 'text-emerald-400' },
              ].map(shortcut => (
                <button
                  key={shortcut.status}
                  onClick={() => {
                    setActiveSection('enquiries');
                    setFilterStatus(shortcut.status);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors hover:bg-white/5 cursor-pointer ${
                    activeSection === 'enquiries' && filterStatus === shortcut.status
                      ? 'bg-white/10 font-bold text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      shortcut.status === 'New' ? 'bg-amber-400' :
                      shortcut.status === 'Contacted' ? 'bg-blue-400' :
                      shortcut.status === 'Follow-up' ? 'bg-purple-400' :
                      shortcut.status === 'Converted' ? 'bg-emerald-400' : 'bg-slate-400'
                    }`} />
                    <span className={shortcut.color}>{shortcut.label}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{shortcut.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Bottom: Current User, Switcher, and Website link */}
        <div className="p-3 border-t border-white/10 space-y-2 bg-[#08152E]">
          {/* Current User Card */}
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                  {currentAdmin.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{currentAdmin.name}</p>
                  <span className="text-[10px] text-amber-400 font-mono block">
                    {currentAdmin.role}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Role Switcher */}
          <div className="flex items-center justify-between px-1 text-[11px] text-slate-400">
            <span>Role Switcher:</span>
            <div className="flex gap-1">
              {staffList.slice(0, 3).map((st, i) => (
                <button
                  key={st.id}
                  onClick={() => setCurrentAdmin(st)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    currentAdmin.id === st.id
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                  title={st.name}
                >
                  {i === 0 ? 'Super' : i === 1 ? 'Admin' : 'Exec'}
                </button>
              ))}
            </div>
          </div>

          {/* Return to Public Website */}
          <button
            onClick={() => onSwitchView('website')}
            className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Return to Public Website</span>
          </button>
        </div>
      </aside>

      {/* Main Right Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs">
          <div className="px-4 sm:px-6 py-3.5 flex items-center justify-between">
            {/* Left: Hamburger & Page Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                aria-label="Open Sidebar Menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div>
                <h1 className="text-base sm:text-lg font-bold font-['Outfit'] text-[#0B1B3D]">
                  {activeSection === 'dashboard' && 'Dashboard & Performance KPI'}
                  {activeSection === 'enquiries' && 'Home Loan Enquiries Management'}
                  {activeSection === 'followups' && 'Follow-up Scheduler & Pipeline'}
                  {activeSection === 'reports' && 'Reports & CSV Analytics Export'}
                  {activeSection === 'database' && 'Supabase Cloud Database & Data Migration'}
                  {activeSection === 'settings' && 'Branch & Company Settings'}
                </h1>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  Bangalore Hub: Near Narasimha Swamy Temple, Jalahalli West (560015)
                </p>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveSection('database')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs text-emerald-800 font-semibold cursor-pointer transition-colors"
                title="Supabase Cloud Database"
              >
                <Cloud className="w-3.5 h-3.5 text-emerald-600" />
                <span>Supabase Live</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </button>

              <button
                onClick={() => onSwitchView('website')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-amber-600" />
                <span>Customer Website</span>
              </button>

              <div className="hidden md:flex items-center gap-2 pl-3 border-l border-slate-200 text-xs">
                <div className="text-right">
                  <span className="font-bold text-slate-800 block text-xs">{currentAdmin.name}</span>
                  <span className="text-[10px] text-amber-600 font-semibold">{currentAdmin.role}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#0B1B3D] text-amber-400 font-bold text-xs flex items-center justify-center">
                  {currentAdmin.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* ==================================================== */}
        {/* 1. DASHBOARD TAB (Prompt Section 14) */}
        {/* ==================================================== */}
        {activeSection === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in">
            
            {/* Dashboard Cards from Prompt:
                Total Enquiries: 125
                New Enquiries: 28
                Contacted: 42
                Follow-up: 31
                Converted: 15
                Closed: 9
            */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold font-['Outfit'] text-[#0B1B3D]">
                  Key Performance Indicators
                </h2>
                <span className="text-xs text-slate-500">
                  Live database sync • Bangalore Pipeline
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Total Enquiries
                  </span>
                  <div className="text-3xl font-black text-[#0B1B3D] font-['Outfit'] mt-1">
                    {dashboardStats.total}
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold">100% Leads</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs bg-amber-50/30">
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                    New Enquiries
                  </span>
                  <div className="text-3xl font-black text-amber-600 font-['Outfit'] mt-1">
                    {dashboardStats.new}
                  </div>
                  <span className="text-[10px] text-amber-700 font-bold">Pending First Call</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-xs bg-blue-50/20">
                  <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block">
                    Contacted
                  </span>
                  <div className="text-3xl font-black text-blue-700 font-['Outfit'] mt-1">
                    {dashboardStats.contacted}
                  </div>
                  <span className="text-[10px] text-blue-600 font-bold">In Discussion</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-purple-200 shadow-xs bg-purple-50/20">
                  <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider block">
                    Follow-up
                  </span>
                  <div className="text-3xl font-black text-purple-700 font-['Outfit'] mt-1">
                    {dashboardStats.followUp}
                  </div>
                  <span className="text-[10px] text-purple-600 font-bold">Callback Scheduled</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs bg-emerald-50/20">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                    Converted
                  </span>
                  <div className="text-3xl font-black text-emerald-700 font-['Outfit'] mt-1">
                    {dashboardStats.converted}
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold">Disbursed Loans</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Closed
                  </span>
                  <div className="text-3xl font-black text-slate-600 font-['Outfit'] mt-1">
                    {dashboardStats.closed}
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold">Postponed / Not Int.</span>
                </div>
              </div>
            </div>

            {/* Middle Row: Upcoming Follow-ups & Analytics breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Upcoming Today's Follow-ups Widget (Section 18) */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-500" />
                    <h3 className="font-bold text-base text-[#0B1B3D] font-['Outfit']">
                      Follow-ups & Today's Enquiries
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveSection('followups')}
                    className="text-xs font-bold text-amber-600 hover:underline"
                  >
                    View All Follow-ups →
                  </button>
                </div>

                <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                  {enquiries
                    .filter(e => e.nextFollowUpDate || e.status === 'Follow-up' || e.status === 'New')
                    .slice(0, 5)
                    .map(item => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedEnquiry(item)}
                        className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-amber-50/50 hover:border-amber-300 transition-all cursor-pointer flex items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-extrabold text-[#0B1B3D]">
                              {item.id}
                            </span>
                            <span className="text-xs font-bold text-slate-800">
                              {item.customerName}
                            </span>
                            <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-200 text-slate-700 font-semibold">
                              {item.propertyLocation || item.city}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-1">
                            {item.internalRemarks || item.message || 'Scheduled discussion for loan options'}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {item.nextFollowUpDate && (
                            <div className="text-right text-[11px]">
                              <span className="text-amber-700 font-bold block">{item.nextFollowUpDate}</span>
                              <span className="text-slate-400">{item.nextFollowUpTime || '11:00 AM'}</span>
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCommModal({
                                isOpen: true,
                                type: 'whatsapp',
                                enquiry: item,
                                template: 'reminder',
                              });
                            }}
                            className="p-2 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            title="WhatsApp Customer"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Geographic & Employment Distribution (Prompt Section 14) */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-bold text-base text-[#0B1B3D] font-['Outfit'] pb-2 border-b border-slate-100">
                  Enquiry Distribution in Bangalore
                </h3>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-600">Jalahalli West / Kammagondanahalli</span>
                      <span className="font-bold text-[#0B1B3D]">42%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full w-[42%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-600">Yelahanka & Hebbal</span>
                      <span className="font-bold text-[#0B1B3D]">24%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full w-[24%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-600">Vidyaranyapura & Sahakar Nagar</span>
                      <span className="font-bold text-[#0B1B3D]">18%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[18%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-600">Peenya & West Bangalore</span>
                      <span className="font-bold text-[#0B1B3D]">16%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full w-[16%]" />
                    </div>
                  </div>
                </div>

                {/* Employment Breakdown */}
                <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-500 block">Salaried</span>
                    <span className="text-xs font-black text-[#0B1B3D]">68%</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-500 block">Self-Employed</span>
                    <span className="text-xs font-black text-[#0B1B3D]">22%</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-500 block">Business</span>
                    <span className="text-xs font-black text-[#0B1B3D]">10%</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Recent Enquiries Preview Table */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-base text-[#0B1B3D] font-['Outfit']">
                  Recent Enquiries Overview
                </h3>
                <button
                  onClick={() => setActiveSection('enquiries')}
                  className="text-xs font-bold text-amber-600 hover:underline"
                >
                  Manage All in Enquiries Tab →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Enquiry ID</th>
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3">Loan Amount</th>
                      <th className="py-2.5 px-3">Location</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Assigned Staff</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {enquiries.slice(0, 6).map(e => (
                      <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-[#0B1B3D]">{e.id}</td>
                        <td className="py-3 px-3 font-bold text-slate-900">{e.customerName}</td>
                        <td className="py-3 px-3 font-extrabold text-[#0B1B3D]">{formatINR(e.requiredLoanAmount)}</td>
                        <td className="py-3 px-3 text-slate-600">{e.propertyLocation || e.city}</td>
                        <td className="py-3 px-3">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                            {e.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-600">{e.assignedStaff || 'Unassigned'}</td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => setSelectedEnquiry(e)}
                            className="px-3 py-1 rounded-lg bg-[#0B1B3D] text-amber-400 font-bold hover:bg-[#122A63]"
                          >
                            Open Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ==================================================== */}
        {/* 2. ENQUIRY MANAGEMENT TAB (Prompt Section 15) */}
        {/* ==================================================== */}
        {activeSection === 'enquiries' && (
          <div className="space-y-4 animate-in fade-in">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black font-['Outfit'] text-[#0B1B3D]">
                  Home Loan Enquiries
                </h2>
                <p className="text-xs text-slate-500">
                  Search, filter, assign, and update lead statuses
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => exportEnquiriesToCSV(filteredEnquiries)}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-amber-600" />
                  <span>Export CSV ({filteredEnquiries.length})</span>
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {/* Search */}
                <div className="lg:col-span-2 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by Name, Mobile, or Enquiry ID..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Status Filter */}
                <div>
                  <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option value="All">All Statuses</option>
                    {allStatuses.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                {/* Employment Filter */}
                <div>
                  <select
                    value={filterEmployment}
                    onChange={e => setFilterEmployment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option value="All">All Employment</option>
                    <option value="Salaried">Salaried</option>
                    <option value="Self Employed">Self Employed</option>
                    <option value="Business Owner">Business Owner</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Assigned Staff Filter */}
                <div>
                  <select
                    value={filterStaff}
                    onChange={e => setFilterStaff(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option value="All">All Staff</option>
                    {staffList.map(st => (
                      <option key={st.id} value={st.name}>{st.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Main Enquiries Table from Prompt Section 15:
                Columns: Enquiry ID | Customer | Mobile | Loan Amount | Income | Employment | Location | Status | Date | Action
            */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0B1B3D] text-slate-200 uppercase font-bold text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-3.5">Enquiry ID</th>
                      <th className="py-3 px-3">Customer</th>
                      <th className="py-3 px-3">Mobile</th>
                      <th className="py-3 px-3">Loan Amount</th>
                      <th className="py-3 px-3">Income</th>
                      <th className="py-3 px-3">Employment</th>
                      <th className="py-3 px-3">Location</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredEnquiries.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-12 text-center text-slate-400">
                          No enquiries matched your search filters.
                        </td>
                      </tr>
                    ) : (
                      filteredEnquiries.map(enquiry => (
                        <tr
                          key={enquiry.id}
                          className="hover:bg-amber-50/40 transition-colors group cursor-pointer"
                          onClick={() => setSelectedEnquiry(enquiry)}
                        >
                          <td className="py-3.5 px-3.5 font-mono font-bold text-[#0B1B3D]">
                            {enquiry.id}
                          </td>
                          <td className="py-3.5 px-3 font-bold text-slate-900">
                            {enquiry.customerName}
                          </td>
                          <td className="py-3.5 px-3 font-mono text-slate-600">
                            {enquiry.mobile}
                          </td>
                          <td className="py-3.5 px-3 font-extrabold text-[#0B1B3D]">
                            {formatINR(enquiry.requiredLoanAmount)}
                          </td>
                          <td className="py-3.5 px-3 text-slate-700">
                            {formatINR(enquiry.monthlyIncome)}/m
                          </td>
                          <td className="py-3.5 px-3 text-slate-600">
                            {enquiry.employmentType}
                          </td>
                          <td className="py-3.5 px-3 text-slate-600">
                            {enquiry.propertyLocation || enquiry.city}
                          </td>
                          <td className="py-3.5 px-3">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                enquiry.status === 'New'
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : enquiry.status === 'Converted' || enquiry.status === 'Approved'
                                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                  : enquiry.status === 'Contacted' || enquiry.status === 'Follow-up'
                                  ? 'bg-blue-100 text-blue-900 border border-blue-300'
                                  : 'bg-slate-100 text-slate-800'
                              }`}
                            >
                              {enquiry.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-slate-500 whitespace-nowrap">
                            {new Date(enquiry.createdAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                            })}
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEnquiry(enquiry);
                              }}
                              className="px-3 py-1 rounded-lg bg-[#0B1B3D] text-amber-400 font-bold text-[11px] hover:bg-[#122A63] transition-colors"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ==================================================== */}
        {/* 3. FOLLOW-UPS TAB (Prompt Section 18) */}
        {/* ==================================================== */}
        {activeSection === 'followups' && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-2xl font-black font-['Outfit'] text-[#0B1B3D]">
                Follow-up Management
              </h2>
              <p className="text-xs text-slate-500">
                Scheduled client callbacks and conversation records
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {enquiries
                .filter(e => e.nextFollowUpDate || e.followUps?.length > 0)
                .map(item => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 hover:border-amber-400 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                        {item.id}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {item.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-[#0B1B3D]">{item.customerName}</h4>
                      <p className="text-xs text-slate-500">{item.mobile} • {item.city}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="font-semibold">Next Follow-up:</span>
                        <span className="font-bold text-amber-800">
                          {item.nextFollowUpDate || 'Pending'} ({item.nextFollowUpTime || '11:00 AM'})
                        </span>
                      </div>
                      <p className="text-slate-600 italic text-[11px] pt-1 border-t border-slate-200/50">
                        "{item.internalRemarks || item.followUps?.[0]?.notes || 'Requested follow-up callback.'}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => setSelectedEnquiry(item)}
                        className="text-xs font-bold text-[#0B1B3D] hover:underline"
                      >
                        Open Lead →
                      </button>

                      <div className="flex gap-1.5">
                        <a
                          href={`tel:${item.mobile}`}
                          className="p-2 rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200"
                          title="Call"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() =>
                            setCommModal({
                              isOpen: true,
                              type: 'whatsapp',
                              enquiry: item,
                              template: 'reminder',
                            })
                          }
                          className="p-2 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          title="WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* 4. ADMIN REPORTS TAB (Prompt Section 20) */}
        {/* ==================================================== */}
        {activeSection === 'reports' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black font-['Outfit'] text-[#0B1B3D]">
                  Admin Reports & Analytics
                </h2>
                <p className="text-xs text-slate-500">
                  Export complete data sheets for management reviews
                </p>
              </div>

              <button
                onClick={() => exportEnquiriesToCSV(enquiries)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export Full Enquiries CSV</span>
              </button>
            </div>

            {/* 4 Cards Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase">Enquiry Report</span>
                <div className="text-2xl font-black text-[#0B1B3D] mt-1">{dashboardStats.total} Total</div>
                <div className="text-xs text-slate-600 mt-2 space-y-0.5">
                  <p>• {dashboardStats.new} New</p>
                  <p>• {dashboardStats.converted} Converted</p>
                  <p>• {dashboardStats.closed} Closed</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase">Top Bangalore Hubs</span>
                <div className="text-2xl font-black text-[#0B1B3D] mt-1">Jalahalli West</div>
                <div className="text-xs text-slate-600 mt-2 space-y-0.5">
                  <p>• Kammagondanahalli: 34 leads</p>
                  <p>• Yelahanka: 22 leads</p>
                  <p>• Hebbal & Peenya: 28 leads</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase">Loan Size Brackets</span>
                <div className="text-2xl font-black text-[#0B1B3D] mt-1">₹50L – ₹1 Cr</div>
                <div className="text-xs text-slate-600 mt-2 space-y-0.5">
                  <p>• Under ₹30 Lakhs: 18%</p>
                  <p>• ₹30L - ₹50 Lakhs: 32%</p>
                  <p>• Above ₹1 Crore: 15%</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase">Staff Performance</span>
                <div className="text-2xl font-black text-[#0B1B3D] mt-1">3 Active Execs</div>
                <div className="text-xs text-slate-600 mt-2 space-y-0.5">
                  <p>• Rajesh Kumar: 48 leads</p>
                  <p>• Priya Sharma: 44 leads</p>
                  <p>• Suresh Gowda: 33 leads</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* SUPABASE CLOUD DATABASE & MIGRATION TAB */}
        {/* ==================================================== */}
        {activeSection === 'database' && (
          <SupabaseManager />
        )}

        {/* ==================================================== */}
        {/* 5. SETTINGS TAB (Prompt Section 21) */}
        {/* ==================================================== */}
        {activeSection === 'settings' && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-2xl font-black font-['Outfit'] text-[#0B1B3D]">
                Platform & Staff Settings
              </h2>
              <p className="text-xs text-slate-500">
                Configure company details, website headers, and staff permissions
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* General Settings */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-bold text-base text-[#0B1B3D] font-['Outfit'] pb-2 border-b border-slate-100">
                  General Company Settings
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 uppercase">Company Name</label>
                    <input
                      type="text"
                      value={companySettings.companyName}
                      onChange={e => setCompanySettings({ ...companySettings, companyName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 uppercase">Office Phone</label>
                    <input
                      type="text"
                      value={companySettings.phone}
                      onChange={e => setCompanySettings({ ...companySettings, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 uppercase">Office Address (Bangalore)</label>
                    <textarea
                      rows={3}
                      value={companySettings.address}
                      onChange={e => setCompanySettings({ ...companySettings, address: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => alert('General settings updated successfully!')}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold"
                  >
                    Save Changes
                  </button>
                </div>
              </div>

              {/* Admin Users & Roles (Super Admin / Admin / Loan Executive) */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="font-bold text-base text-[#0B1B3D] font-['Outfit']">
                    Admin Staff & Roles
                  </h3>
                  <button
                    onClick={() => alert('Add Admin modal opened')}
                    className="px-3 py-1 rounded-lg bg-[#0B1B3D] text-amber-400 font-bold text-xs"
                  >
                    + Add Staff
                  </button>
                </div>

                <div className="space-y-3">
                  {staffList.map(st => (
                    <div
                      key={st.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#0B1B3D]">{st.name}</span>
                          <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            {st.role}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">{st.email} • {st.phone}</p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => alert(`Editing profile of ${st.name}`)}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

      </main>
      </div>

      {/* ==================================================== */}
      {/* ENQUIRY DETAILS MODAL (Prompt Sections 16, 17, 18, 19) */}
      {/* ==================================================== */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="bg-[#0B1B3D] text-white p-5 sm:p-6 flex items-center justify-between border-b border-white/10 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xl font-black text-amber-400">
                    {selectedEnquiry.id}
                  </span>
                  <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20">
                    Source: {selectedEnquiry.source}
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Customer: <strong className="text-white">{selectedEnquiry.customerName}</strong> • Received on {new Date(selectedEnquiry.createdAt).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-800">
              
              {/* Quick Communication Bar (Prompt Section 19) */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs">
                  <span className="font-bold text-amber-900 block">Customer Quick Connect</span>
                  <span className="text-slate-600">{selectedEnquiry.mobile} • {selectedEnquiry.email}</span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${selectedEnquiry.mobile}`}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Customer</span>
                  </a>

                  <button
                    type="button"
                    onClick={() =>
                      setCommModal({
                        isOpen: true,
                        type: 'whatsapp',
                        enquiry: selectedEnquiry,
                        template: 'received',
                      })
                    }
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  <a
                    href={`mailto:${selectedEnquiry.email}?subject=Home%20Loan%20Enquiry%20${selectedEnquiry.id}%20-%20BLR15&body=Dear%20${selectedEnquiry.customerName},`}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email</span>
                  </a>
                </div>
              </div>

              {/* 4 Information Blocks from Prompt Section 16 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Customer Information */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider">
                    1. Customer Information
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between"><span className="text-slate-500">Name:</span> <span className="font-bold text-slate-800">{selectedEnquiry.customerName}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Mobile:</span> <span className="font-bold text-slate-800">{selectedEnquiry.mobile}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Email:</span> <span className="font-semibold text-slate-800">{selectedEnquiry.email}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">DOB:</span> <span className="text-slate-700">{selectedEnquiry.dob || 'Not specified'}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">City:</span> <span className="font-semibold text-slate-800">{selectedEnquiry.city}</span></div>
                  </div>
                </div>

                {/* 2. Financial Information */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider">
                    2. Financial Information
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between"><span className="text-slate-500">Employment:</span> <span className="font-bold text-slate-800">{selectedEnquiry.employmentType}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Monthly Income:</span> <span className="font-black text-[#0B1B3D]">{formatINR(selectedEnquiry.monthlyIncome)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Other Income:</span> <span className="text-slate-700">{formatINR(selectedEnquiry.otherIncome || 0)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Current EMIs:</span> <span className="text-amber-700 font-bold">{formatINR(selectedEnquiry.existingEmi || 0)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Required Loan:</span> <span className="font-black text-amber-600 text-sm">{formatINR(selectedEnquiry.requiredLoanAmount)}</span></div>
                  </div>
                </div>

                {/* 3. Property Information */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider">
                    3. Property Information
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between"><span className="text-slate-500">Property Type:</span> <span className="font-bold text-slate-800">{selectedEnquiry.propertyType}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Property Value:</span> <span className="font-black text-slate-800">{formatINR(selectedEnquiry.propertyValue)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Location:</span> <span className="font-semibold text-slate-800">{selectedEnquiry.propertyLocation || 'Bangalore'}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Loan Type:</span> <span className="text-slate-800 font-medium">{selectedEnquiry.loanType || 'Home Purchase Loan'}</span></div>
                  </div>
                </div>

                {/* 4. Existing Loan Information */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider">
                    4. Existing Loan Details
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between"><span className="text-slate-500">Existing Loan:</span> <span className="font-bold text-slate-800">{selectedEnquiry.existingLoan?.hasExistingLoan ? 'Yes' : 'No'}</span></div>
                    {selectedEnquiry.existingLoan?.hasExistingLoan ? (
                      <>
                        <div className="flex justify-between"><span className="text-slate-500">Bank:</span> <span className="font-bold text-slate-800">{selectedEnquiry.existingLoan.bankName || 'N/A'}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Outstanding:</span> <span className="font-bold text-slate-800">{formatINR(selectedEnquiry.existingLoan.outstandingAmount)}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Current EMI:</span> <span className="text-slate-800">{formatINR(selectedEnquiry.existingLoan.currentEmi)}</span></div>
                      </>
                    ) : (
                      <p className="text-slate-400 italic">No previous active home loan indicated.</p>
                    )}
                  </div>
                </div>

              </div>

              {/* Status Update & Staff Assignment (Prompt Section 17) */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="font-bold text-sm text-[#0B1B3D] font-['Outfit'] border-b border-slate-100 pb-2">
                  Status Workflow & Assignment
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Status Dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">
                      Update Enquiry Status
                    </label>
                    <select
                      value={selectedEnquiry.status}
                      onChange={e => handleStatusChange(e.target.value as EnquiryStatus)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                    >
                      {allStatuses.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  {/* Assigned Staff */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">
                      Assigned Loan Executive
                    </label>
                    <select
                      value={selectedEnquiry.assignedStaff || ''}
                      onChange={e => handleStaffAssign(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                    >
                      <option value="">-- Assign Staff --</option>
                      {staffList.map(st => (
                        <option key={st.id} value={st.name}>{st.name} ({st.role})</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Internal Remarks */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase">
                    Internal Remarks / Executive Notes
                  </label>
                  <textarea
                    rows={2}
                    defaultValue={selectedEnquiry.internalRemarks || ''}
                    onBlur={e => handleRemarksSave(e.target.value)}
                    placeholder="Add private operational notes (never shown to customer)..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              {/* Follow-up Management Section (Prompt Section 18) */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <h4 className="font-bold text-sm text-[#0B1B3D] font-['Outfit']">
                    Schedule Next Follow-up
                  </h4>
                </div>

                <form onSubmit={handleAddFollowUp} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                  <div className="sm:col-span-4 space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 uppercase">Date</label>
                    <input
                      type="date"
                      value={newFollowUpDate}
                      onChange={e => setNewFollowUpDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                    />
                  </div>

                  <div className="sm:col-span-3 space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 uppercase">Time</label>
                    <input
                      type="text"
                      value={newFollowUpTime}
                      onChange={e => setNewFollowUpTime(e.target.value)}
                      placeholder="e.g. 03:30 PM"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                    />
                  </div>

                  <div className="sm:col-span-5 space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 uppercase">Follow-up Note</label>
                    <input
                      type="text"
                      value={newFollowUpNotes}
                      onChange={e => setNewFollowUpNotes(e.target.value)}
                      placeholder="e.g. Customer requested callback tomorrow afternoon."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                    />
                  </div>

                  <div className="sm:col-span-12">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
                    >
                      Save Follow-up
                    </button>
                  </div>
                </form>

                {/* Follow-up history list */}
                {selectedEnquiry.followUps && selectedEnquiry.followUps.length > 0 && (
                  <div className="pt-2 space-y-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Past Follow-up Logs:
                    </span>
                    {selectedEnquiry.followUps.map(fu => (
                      <div key={fu.id} className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs">
                        <div className="flex justify-between text-slate-400 text-[10px]">
                          <span>{fu.date} {fu.time}</span>
                          <span>Logged by {fu.createdBy}</span>
                        </div>
                        <p className="text-slate-800 font-medium mt-0.5">{fu.notes}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Communication Dialog / Modal (WhatsApp / SMS Templates) */}
      {commModal.isOpen && commModal.enquiry && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-[#0B1B3D]">
                  Send WhatsApp Message
                </h3>
              </div>
              <button
                onClick={() => setCommModal({ ...commModal, isOpen: false })}
                className="p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Template Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">Choose Template</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'received', label: 'Enquiry Received' },
                  { id: 'reminder', label: 'Follow-up Reminder' },
                  { id: 'documents', label: 'Document Request' },
                  { id: 'update', label: 'Status Update' },
                ].map(tmpl => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => setCommModal({ ...commModal, template: tmpl.id })}
                    className={`py-2 px-2.5 rounded-xl text-left border font-semibold ${
                      commModal.template === tmpl.id
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    {tmpl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview Message */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">Message Text</label>
              <textarea
                rows={4}
                readOnly
                value={getCommMessage(commModal.template, commModal.enquiry)}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs bg-slate-50 text-slate-800"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setCommModal({ ...commModal, isOpen: false })}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <a
                href={`https://wa.me/${commModal.enquiry.mobile.replace(/\D/g, '')}?text=${encodeURIComponent(
                  getCommMessage(commModal.template, commModal.enquiry)
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setCommModal({ ...commModal, isOpen: false })}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Open WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
