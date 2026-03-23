const fs = require('fs');

let css = fs.readFileSync('app/home/landing.css', 'utf8');
css = css.replace(
`@theme {
  --color-charcoal: #0c0c0c;
  --color-landing-bg: #020617;   /* slate-950 */
  --color-aqua: #00FFFF;
  --color-aqua-dim: rgba(0, 255, 255, 0.12);
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
}`,
`@theme {
  --color-charcoal: #0c0c0c;
  --color-landing-bg: #020617;   /* slate-950 */
  --color-aqua: #00FFFF;
  --color-aqua-dim: rgba(0, 255, 255, 0.12);
  --color-yellow: #FFD700;
  --color-yellow-dim: rgba(255, 215, 0, 0.12);
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
}`);
fs.writeFileSync('app/home/landing.css', css);

let content = fs.readFileSync('app/home/page.tsx', 'utf8');

const replacements = [
  ['glow: "from-cyan-500/20"', 'glow: "from-aqua/20"'],
  ['glow: "from-blue-500/20"', 'glow: "from-aqua/20"'],
  ['glow: "from-teal-500/20"', 'glow: "from-aqua/20"'],
  ['glow: "from-indigo-500/20"', 'glow: "from-aqua/20"'],
  ['glow: "from-cyan-400/20"', 'glow: "from-aqua/20"'],
  ['shadow-cyan-500', 'shadow-aqua'],
  ['shadow-cyan-400', 'shadow-aqua'],
  ['text-cyan-400', 'text-aqua'],
  ['text-cyan-300', 'text-aqua/80'],
  ['bg-linear-to-r from-cyan-400 to-blue-600', 'bg-aqua'],
  ['bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent', 'text-aqua'],
  ['to-cyan-900', 'to-aqua'],
  ['bg-cyan-500', 'bg-aqua'],
  ['bg-cyan-400', 'bg-aqua'],
  ['border-cyan-500', 'border-aqua'],
  ['bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500', 'text-aqua'],
  ['hover:bg-cyan-400', 'hover:opacity-90'],
  ['hover:text-cyan-400', 'hover:opacity-80']
];

for (let [search, replace] of replacements) {
  content = content.split(search).join(replace);
}

fs.writeFileSync('app/home/page.tsx', content);
console.log('Colors replaced successfully!');
