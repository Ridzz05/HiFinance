const fs = require('fs');
let content = fs.readFileSync('app/home/page.tsx', 'utf8');

// Replace standard white with the requested Slate 50 for text readability
content = content.split('text-white').join('text-slate-50');

fs.writeFileSync('app/home/page.tsx', content);
console.log('Text white replaced successfully!');
