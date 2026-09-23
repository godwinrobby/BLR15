const fs = require('fs');
let content = fs.readFileSync('src/components/common/Navbar.tsx', 'utf8');

content = content.replace(
  "{ id: 'loans', label: 'Home Loan', icon: Home },",
  "{ id: 'home-loans', label: 'Home Loans', icon: Home },"
);

fs.writeFileSync('src/components/common/Navbar.tsx', content);
