import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HomePage } from './components/website/HomePage';
import { HomeLoansPage } from './components/website/HomeLoansPage';
import { EmiCalculatorPage } from './components/website/EmiCalculatorPage';
import { EligibilityWizard } from './components/website/EligibilityWizard';
import { EnquiryPage } from './components/website/EnquiryPage';
import { TrackEnquiryPage } from './components/website/TrackEnquiryPage';
import { AboutUsPage } from './components/website/AboutUsPage';
import { ContactPage } from './components/website/ContactPage';
import { MobileAppView } from './components/mobile/MobileAppView';
import { AdminPortal } from './components/admin/AdminPortal';
import { HomeLoanEnquiry } from './types';
import { updateDocumentSEO } from './utils/seo';
import { initSupabaseSync } from './services/storageService';

// Route parser helper
function getRouteFromLocation(): { viewMode: 'website' | 'mobile-app' | 'admin'; tab: string; queryParams: Record<string, string> } {
  // Check hash or pathname
  const hash = window.location.hash.replace(/^#\/?/, '');
  const pathname = window.location.pathname.replace(/^\//, '');

  let path = hash || pathname || 'home';

  // Handle root slash
  if (path === '' || path === '/') {
    path = 'home';
  }

  // Parse query params from search or hash
  const searchStr = window.location.search || (hash.includes('?') ? '?' + hash.split('?')[1] : '');
  const urlParams = new URLSearchParams(searchStr);
  const queryParams: Record<string, string> = {};
  urlParams.forEach((val, key) => {
    queryParams[key] = val;
  });

  // Extract clean path (strip query params if in path)
  const cleanPath = path.split('?')[0].toLowerCase();

  // Check top-level modes
  if (cleanPath === 'admin' || cleanPath.startsWith('admin/')) {
    return { viewMode: 'admin', tab: 'dashboard', queryParams };
  }
  if (cleanPath === 'mobile' || cleanPath === 'mobile-app' || cleanPath === 'app') {
    return { viewMode: 'mobile-app', tab: 'home', queryParams };
  }

  // Map route slug to internal tab
  const validTabs: Record<string, string> = {
    '': 'home',
    'home': 'home',
    'loans': 'home-loans',
    'home-loans': 'home-loans',
    'personal-loan': 'personal-loan',
    'personal-loans': 'personal-loan',
    'car-loan': 'car-loan',
    'car-loans': 'car-loan',
    'calculator': 'calculator',
    'emi-calculator': 'calculator',
    'emi-calc': 'calculator',
    'eligibility': 'eligibility',
    'check-eligibility': 'eligibility',
    'enquiry': 'enquiry',
    'apply': 'enquiry',
    'track': 'track',
    'track-enquiry': 'track',
    'about': 'about',
    'about-us': 'about',
    'contact': 'contact',
    'contact-us': 'contact',
  };

  const matchedTab = validTabs[cleanPath] || 'home';
  return { viewMode: 'website', tab: matchedTab, queryParams };
}

export function App() {
  // Initialize from current URL
  const initialRoute = getRouteFromLocation();

  // App view mode: 'website' | 'mobile-app' | 'admin'
  const [viewMode, setViewMode] = useState<'website' | 'mobile-app' | 'admin'>(initialRoute.viewMode);

  // Website active tab: 'home' | 'loans' | 'calculator' | 'eligibility' | 'enquiry' | 'track' | 'about' | 'contact'
  const [activeTab, setActiveTab] = useState<string>(initialRoute.tab);

  // State passed during cross-page navigation
  const [navState, setNavState] = useState<{
    loanType?: string;
    loanAmount?: number;
    enquiryId?: string;
  }>({
    loanType: initialRoute.queryParams['loanType'] || initialRoute.queryParams['type'],
    loanAmount: initialRoute.queryParams['amount'] ? Number(initialRoute.queryParams['amount']) : undefined,
    enquiryId: initialRoute.queryParams['id'] || initialRoute.queryParams['enquiryId'],
  });

  // Keep URL in sync with tab and viewMode
  const syncUrl = useCallback((tab: string, mode: 'website' | 'mobile-app' | 'admin', state?: any) => {
    let newPath = '';
    if (mode === 'admin') {
      newPath = '#/admin';
    } else if (mode === 'mobile-app') {
      newPath = '#/mobile-app';
    } else {
      const slugMap: Record<string, string> = {
        home: '',
        loans: 'home-loans',
        calculator: 'calculator',
        eligibility: 'eligibility',
        enquiry: 'enquiry',
        track: 'track',
        about: 'about',
        contact: 'contact',
      };
      const slug = slugMap[tab] || tab;
      const params = new URLSearchParams();
      if (state?.loanAmount) params.set('amount', String(state.loanAmount));
      if (state?.loanType) params.set('type', state.loanType);
      if (state?.enquiryId) params.set('id', state.enquiryId);

      const qs = params.toString();
      newPath = `#/${slug}${qs ? '?' + qs : ''}`;
    }

    if (window.location.hash !== newPath) {
      window.history.pushState(null, '', newPath);
    }
  }, []);

  // Listen to browser Back/Forward navigation (popstate) & hashchange
  useEffect(() => {
    const handleUrlChange = () => {
      const { viewMode: newMode, tab: newTab, queryParams } = getRouteFromLocation();
      setViewMode(newMode);
      setActiveTab(newTab);
      if (queryParams['amount'] || queryParams['type'] || queryParams['id']) {
        setNavState({
          loanAmount: queryParams['amount'] ? Number(queryParams['amount']) : undefined,
          loanType: queryParams['type'] || queryParams['loanType'],
          enquiryId: queryParams['id'] || queryParams['enquiryId'],
        });
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    
    // Initialize Supabase Cloud Sync
    initSupabaseSync().catch(err => console.warn('Supabase sync init failed:', err));

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Update dynamic SEO tags whenever activeTab or viewMode changes
  useEffect(() => {
    if (viewMode === 'website') {
      updateDocumentSEO(activeTab);
    } else if (viewMode === 'admin') {
      document.title = 'CRM Lead Management Portal | BLR15 Home Loans Admin';
    } else if (viewMode === 'mobile-app') {
      document.title = 'BLR15 Home Loans Mobile App Simulation | Bangalore 560015';
    }
  }, [activeTab, viewMode]);

  // Scroll to top on navigation change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab, viewMode]);

  // Main unified navigation handler
  const handleNavigate = (tab: string, state?: any) => {
    if (state) {
      setNavState(prev => ({ ...prev, ...state }));
    }
    if (viewMode !== 'website') {
      setViewMode('website');
    }
    setActiveTab(tab);
    syncUrl(tab, 'website', state);
  };

  // Switch between Website, Mobile Simulation, and Admin CRM
  const handleSwitchView = (mode: 'website' | 'mobile-app' | 'admin') => {
    setViewMode(mode);
    syncUrl(activeTab, mode);
  };

  const handleOpenEnquiry = (loanType?: string) => {
    handleNavigate('enquiry', { loanType });
  };

  // If in Native Mobile App mode
  if (viewMode === 'mobile-app') {
    return <MobileAppView onSwitchView={handleSwitchView} />;
  }

  // If in Admin CRM mode
  if (viewMode === 'admin') {
    return <AdminPortal onSwitchView={handleSwitchView} />;
  }

  // Website Mode (Page Router)
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navigation */}
      <Navbar
        currentTab={activeTab}
        onNavigate={handleNavigate}
        activeView={viewMode}
        onSwitchView={handleSwitchView}
      />

      {/* Main Routed Page Content */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenEnquiry={handleOpenEnquiry}
          />
        )}

        {(activeTab === 'home-loans' || activeTab === 'personal-loan' || activeTab === 'car-loan') && (
          <HomeLoansPage
            onNavigate={handleNavigate}
            onOpenEnquiry={handleOpenEnquiry}
            initialCategory={
              activeTab === 'personal-loan' ? 'personal' :
              activeTab === 'car-loan' ? 'car' :
              'home'
            }
          />
        )}

        {activeTab === 'calculator' && (
          <EmiCalculatorPage onNavigate={handleNavigate} />
        )}

        {activeTab === 'eligibility' && (
          <EligibilityWizard
            initialAmount={navState.loanAmount}
            initialLoanType={navState.loanType}
            onNavigate={handleNavigate}
            onEnquirySuccess={(enquiry: HomeLoanEnquiry) => {
              handleNavigate('track', { enquiryId: enquiry.id });
            }}
          />
        )}

        {activeTab === 'enquiry' && (
          <EnquiryPage
            initialLoanType={navState.loanType}
            onNavigate={handleNavigate}
            onEnquirySuccess={enquiry => {
              setNavState({ enquiryId: enquiry.id });
            }}
          />
        )}

        {activeTab === 'track' && (
          <TrackEnquiryPage onNavigate={handleNavigate} />
        )}

        {activeTab === 'about' && (
          <AboutUsPage onNavigate={handleNavigate} />
        )}

        {activeTab === 'contact' && (
          <ContactPage />
        )}
      </main>

      {/* Global Footer */}
      <Footer
        onNavigate={handleNavigate}
        onSwitchView={handleSwitchView}
      />
    </div>
  );
}

export default App;
