const fs = require('fs');
let content = fs.readFileSync('src/components/mobile/MobileAppView.tsx', 'utf8');

// Replace exact lines for Mobile App bottom nav
content = content.replace(
  />\s*Loans\s*<\/span>/,
  ">Home Loans</span>"
);

fs.writeFileSync('src/components/mobile/MobileAppView.tsx', content);
