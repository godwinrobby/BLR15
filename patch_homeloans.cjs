const fs = require('fs');
let content = fs.readFileSync('src/components/website/HomeLoansPage.tsx', 'utf8');

// The category tabs start at: {/* Category Filter Tabs */}
// And end at: </div>
// Actually, let's just use regex or exact replacement

const tabsHtml = `          {/* Category Filter Tabs */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {[
              { id: 'all', label: 'All Financing Options' },
              { id: 'home', label: 'Home Loans (4)' },
              { id: 'personal', label: 'Personal Loan (Instant)' },
              { id: 'car', label: 'Car Loan (New & EV)' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id as any)}
                className={\`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer \${
                  selectedCategory === tab.id
                    ? 'bg-[#0B1B3D] text-amber-400 shadow-md shadow-[#0B1B3D]/20 scale-105'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }\`}
              >
                {tab.label}
              </button>
            ))}
          </div>`;

content = content.replace(tabsHtml, "");

// We also need to change the filter logic:
// .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
// We can leave this as is, because selectedCategory will be initialized properly.
// However, the user said "Keep only home loans based content SAme in Personal Loan, Car Loan too".
// And selectedCategory should not be 'all'. So we can remove the 'all' from initialCategory default.

content = content.replace("initialCategory?: 'all' | 'home' | 'personal' | 'car';", "initialCategory?: 'home' | 'personal' | 'car';");
content = content.replace("initialCategory = 'all',", "initialCategory = 'home',");
content = content.replace("useState<'all' | 'home' | 'personal' | 'car'>(initialCategory);", "useState<'home' | 'personal' | 'car'>(initialCategory);");
content = content.replace("selectedCategory === 'all' || ", "");

fs.writeFileSync('src/components/website/HomeLoansPage.tsx', content);
