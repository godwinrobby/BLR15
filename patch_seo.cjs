const fs = require('fs');
let content = fs.readFileSync('src/utils/seo.ts', 'utf8');

content = content.replace("canonicalPath: '/loans',", "canonicalPath: '/home-loans',");

fs.writeFileSync('src/utils/seo.ts', content);
