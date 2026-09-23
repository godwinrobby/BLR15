const fs = require('fs');
let content = fs.readFileSync('src/components/website/HomePage.tsx', 'utf8');

content = content.replace(
  "onClick={() => onNavigate('loans')}",
  "onClick={() => onNavigate('home-loans')}"
);

fs.writeFileSync('src/components/website/HomePage.tsx', content);
