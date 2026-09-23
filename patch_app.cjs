const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Update alias mappings
content = content.replace("'loans': 'loans',", "'loans': 'home-loans',");
content = content.replace("'home-loans': 'loans',", "'home-loans': 'home-loans',");

// Update validTabs mapping (just in case I missed any)
content = content.replace(/loans: 'loans'/g, "loans: 'home-loans'");

// Update the condition for rendering HomeLoansPage
content = content.replace(
  "{(activeTab === 'loans' || activeTab === 'personal-loan' || activeTab === 'car-loan') && (",
  "{(activeTab === 'home-loans' || activeTab === 'personal-loan' || activeTab === 'car-loan') && ("
);

// We should also make sure HomeLoansPage receives the right initialCategory
// Currently it is:
//            initialCategory={
//              activeTab === 'personal-loan' ? 'personal' :
//              activeTab === 'car-loan' ? 'car' :
//              'home'
//            }
// This is already perfectly fine for 'home-loans' giving 'home'.

fs.writeFileSync('src/App.tsx', content);
