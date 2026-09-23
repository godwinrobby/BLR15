const fs = require('fs');
let content = fs.readFileSync('src/components/common/Footer.tsx', 'utf8');

content = content.replace(
  "onClick={() => onNavigate('loans')}",
  "onClick={() => onNavigate('home-loans')}"
);
content = content.replace(
  ">Home Loans</li>",
  ">Home Loans</li>" // wait, just to be sure
);
fs.writeFileSync('src/components/common/Footer.tsx', content);
