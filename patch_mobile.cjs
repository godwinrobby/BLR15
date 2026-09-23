const fs = require('fs');
let content = fs.readFileSync('src/components/mobile/MobileAppView.tsx', 'utf8');

content = content.replace(
  "const [activeTab, setActiveTab] = useState<'home' | 'loans' | 'eligibility' | 'enquiry' | 'profile'>('home');",
  "const [activeTab, setActiveTab] = useState<'home' | 'home-loans' | 'eligibility' | 'enquiry' | 'profile'>('home');"
);

// Replace all other instances of 'loans' in setActiveTab or activeTab comparisons
content = content.replace(/'loans'/g, "'home-loans'");

// Double check just in case we hit something else like label
content = content.replace(/>Loans</g, ">Home Loans<");

fs.writeFileSync('src/components/mobile/MobileAppView.tsx', content);
