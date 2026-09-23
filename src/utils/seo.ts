export interface PageSEO {
  title: string;
  description: string;
  keywords: string;
  canonicalPath: string;
  ogType?: string;
  structuredData?: Record<string, any>;
}

export const ROUTE_SEO: Record<string, PageSEO> = {
  home: {
    title: 'BLR15 Home Loans - Turn Your Dreams Into Homes | Bangalore',
    description: 'Premier home finance advisory in Bangalore (Pin 560015). Compare home loans, calculate EMI, check instant eligibility, and get doorstep document assistance.',
    keywords: 'home loans bangalore, blr15 home loans, home loan jalahalli west, housing loan peenya, best home loan interest rates bangalore, sbi home loan bangalore, hdfc home loan bangalore',
    canonicalPath: '/',
    ogType: 'website',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'FinancialService',
      name: 'BLR15 Home Loans',
      alternateName: 'BLR 15 Home Finance Advisory',
      url: 'https://blr15homeloans.com',
      logo: 'https://blr15homeloans.com/logo.png',
      description: 'Dedicated home finance advisory in Bangalore offering home purchase loans, construction loans, balance transfers, and top-ups with doorstep service.',
      telephone: '+91-9876543210',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Near Narasimha Swamy Temple, 1st Floor, Kammagondanahalli Main Road, Jalahalli West',
        addressLocality: 'Bangalore',
        addressRegion: 'Karnataka',
        postalCode: '560015',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '13.0560',
        longitude: '77.5250',
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '09:30',
          closes: '19:00',
        },
      ],
      priceRange: '₹₹',
      areaServed: {
        '@type': 'City',
        name: 'Bangalore',
      },
      makesOffer: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Home Purchase Loan',
            description: 'Finance up to 90% property value for purchasing new or resale residential flats, villas, and apartments in Bangalore.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Home Construction Loan',
            description: 'Stage-wise milestone disbursement loan for building independent houses and villas on self-owned plots.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Home Loan Balance Transfer',
            description: 'Transfer high-interest existing housing loans to lowest benchmark rates starting from 8.35% p.a.',
          },
        },
      ],
    },
  },

  loans: {
    title: 'Home Loan Products in Bangalore – Purchase, Construction & Balance Transfer | BLR15',
    description: 'Explore home loan options with BLR15: Home Purchase, Self-Construction, Balance Transfer & Top-Up loans starting from 8.35% p.a. Check criteria and required documents.',
    keywords: 'home purchase loan bangalore, plot construction loan, balance transfer home loan, home loan top up, low interest home loan bangalore 560015',
    canonicalPath: '/loans',
    ogType: 'website',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Home Loan Advisory',
      provider: {
        '@type': 'FinancialService',
        name: 'BLR15 Home Loans',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Kammagondanahalli Main Road, Jalahalli West',
          addressLocality: 'Bangalore',
          postalCode: '560015',
          addressCountry: 'IN',
        },
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Bangalore Home Finance Solutions',
        itemListElement: [
          { '@type': 'Offer', name: 'Home Purchase Loan (8.35% - 9.15%)' },
          { '@type': 'Offer', name: 'Home Construction Loan (8.60% - 9.40%)' },
          { '@type': 'Offer', name: 'Balance Transfer Loan (8.35% - 8.75%)' },
          { '@type': 'Offer', name: 'Home Loan Top-Up (8.90% - 9.75%)' },
        ],
      },
    },
  },

  calculator: {
    title: 'Home Loan EMI Calculator – Interactive Monthly EMI & Prepayment Planner | BLR15',
    description: 'Use the BLR15 interactive EMI calculator with annual prepayment simulator, visual principal-interest ratio, and full year-by-year amortization repayment schedule.',
    keywords: 'home loan emi calculator, housing loan emi calculator bangalore, calculate monthly emi, loan prepayment calculator, amortization schedule home loan',
    canonicalPath: '/calculator',
    ogType: 'website',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'BLR15 Home Loan EMI Calculator',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'All modern web browsers',
      description: 'Online financial planning tool to compute monthly housing loan EMI, total interest, and prepayment savings with annual amortization schedules.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'INR',
      },
    },
  },

  eligibility: {
    title: 'Check Home Loan Eligibility Online – FOIR & LTV Calculator | BLR15 Bangalore',
    description: 'Find out your maximum eligible home loan amount based on monthly income, existing EMIs, and property value in 2 minutes. Instant calculation with zero credit score impact.',
    keywords: 'home loan eligibility check, housing loan foir calculator, check loan eligibility bangalore, maximum home loan calculation, salary to home loan ratio',
    canonicalPath: '/eligibility',
    ogType: 'website',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'BLR15 Home Loan Eligibility Wizard',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'All web browsers',
      description: 'Instant multi-step home loan eligibility assessment based on Indian banking FOIR and LTV underwriting rules.',
    },
  },

  enquiry: {
    title: 'Apply for Home Loan Online – Free Doorstep Consultation | BLR15 Bangalore',
    description: 'Submit your home loan enquiry to BLR15. Receive a unique Enquiry ID, compare quotes across 15+ banks, and get doorstep document pickup in Bangalore.',
    keywords: 'apply home loan online bangalore, home loan enquiry blr15, home loan doorstep service jalahalli, housing loan advisor bangalore',
    canonicalPath: '/enquiry',
    ogType: 'website',
  },

  track: {
    title: 'Track Home Loan Enquiry Status – Real-Time Application Tracker | BLR15',
    description: 'Track your BLR15 home loan application online in real-time. Enter your BLR15 Enquiry ID (e.g. BLR15-0001) to view review status, assigned loan executive, and document requirements.',
    keywords: 'track home loan application, blr15 enquiry status, check home loan progress, housing loan tracking bangalore',
    canonicalPath: '/track',
    ogType: 'website',
  },

  about: {
    title: 'About BLR15 Home Loans – Dedicated Home Finance Advisory in Bangalore 560015',
    description: 'Learn about BLR15 Home Loans, our mission, seasoned banking advisors, and commitment to delivering the lowest interest rates and zero advisory fees in Bangalore.',
    keywords: 'about blr15 home loans, home loan agents bangalore 560015, mortgage broker jalahalli west, trusted loan advisors bangalore',
    canonicalPath: '/about',
    ogType: 'website',
  },

  contact: {
    title: 'Contact BLR15 Home Loans Office – Jalahalli West, Bangalore 560015',
    description: 'Visit or call BLR15 Home Loans office near Narasimha Swamy Temple, Kammagondanahalli Main Road, Jalahalli West, Bangalore. Call +91 98765 43210 or chat on WhatsApp.',
    keywords: 'blr15 office location, home loan office jalahalli west, bangalore 560015 home loan branch, contact blr15 advisor',
    canonicalPath: '/contact',
    ogType: 'website',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'BLR15 Home Loans Office',
      telephone: '+91-9876543210',
      email: 'support@blr15homeloans.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Near Narasimha Swamy Temple, 1st Floor, Kammagondanahalli Main Road, Jalahalli West',
        addressLocality: 'Bangalore',
        addressRegion: 'Karnataka',
        postalCode: '560015',
        addressCountry: 'IN',
      },
    },
  },
};

/**
 * Updates page title, meta description, open graph tags, canonical tag, and structured JSON-LD
 */
export function updateDocumentSEO(routeKey: string, customTitle?: string) {
  const meta = ROUTE_SEO[routeKey] || ROUTE_SEO['home'];
  const title = customTitle || meta.title;

  // 1. Title
  document.title = title;

  // Helper to upsert meta tag
  const setMetaTag = (selector: string, attrName: string, attrVal: string, content: string) => {
    let el = document.querySelector(selector);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attrName, attrVal);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // 2. Meta description & keywords
  setMetaTag('meta[name="description"]', 'name', 'description', meta.description);
  setMetaTag('meta[name="keywords"]', 'name', 'keywords', meta.keywords);

  // 3. OpenGraph tags
  setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
  setMetaTag('meta[property="og:description"]', 'property', 'og:description', meta.description);
  setMetaTag('meta[property="og:type"]', 'property', 'og:type', meta.ogType || 'website');
  setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'BLR15 Home Loans');

  const origin = window.location.origin;
  const canonicalUrl = `${origin}${window.location.pathname}${window.location.hash}`;
  setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);

  // 4. Twitter tags
  setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
  setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', meta.description);
  setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');

  // 5. Canonical Link
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', canonicalUrl);

  // 6. JSON-LD Structured Data
  const existingJsonLd = document.getElementById('blr15-schema-jsonld');
  if (existingJsonLd) {
    existingJsonLd.remove();
  }

  if (meta.structuredData) {
    const script = document.createElement('script');
    script.id = 'blr15-schema-jsonld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(meta.structuredData);
    document.head.appendChild(script);
  }
}
