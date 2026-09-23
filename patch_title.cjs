const fs = require('fs');
let content = fs.readFileSync('src/components/website/HomeLoansPage.tsx', 'utf8');

content = content.replace(
  "Home Loans Made Simple",
  "{selectedCategory === 'home' ? 'Home Loans Made Simple' : selectedCategory === 'personal' ? 'Personal Loans Made Simple' : 'Car Loans Made Simple'}"
);
content = content.replace(
  "Explore our range of home financing options tailored for Bangalore",
  "{selectedCategory === 'home' ? 'Explore our range of home financing options tailored for Bangalore' : selectedCategory === 'personal' ? 'Explore instant personal financing options with quick approvals' : 'Explore new and EV car loan options with low interest rates'}"
);

fs.writeFileSync('src/components/website/HomeLoansPage.tsx', content);
