const fs = require('fs');
const path = require('path');

const replacements = {
  'hsl(43,38%,96%)': 'var(--clr-bg)',
  'hsl(193,43%,15%)': 'var(--clr-foreground)',
  'hsl(169,59%,31%)': 'var(--clr-primary)',
  'hsl(38,24%,86%)': 'var(--clr-border)',
  'hsl(44,44%,99%)': 'var(--clr-card)',
  'hsl(14,83%,62%)': 'var(--clr-accent)',
  'hsl(193,15%,50%)': 'var(--clr-muted)',
  'hsl(193,15%,45%)': 'var(--clr-muted)',
  'hsl(38,24%,92%)': 'var(--clr-border)',
  'hsl(1,72%,52%)': 'var(--destructive)',
  // Transparent variants
  'hsl(169,59%,31%,0.08)': 'var(--clr-primary-subtle)',
  'hsl(169,59%,31%,0.2)': 'color-mix(in srgb, var(--clr-primary) 20%, transparent)',
  'hsl(169,59%,31%,0.12)': 'color-mix(in srgb, var(--clr-primary) 12%, transparent)',
  'hsl(169,59%,31%,0.4)': 'color-mix(in srgb, var(--clr-primary) 40%, transparent)',
  'hsl(14,83%,62%,0.12)': 'color-mix(in srgb, var(--clr-accent) 12%, transparent)',
  'hsl(169,59%,38%)': 'var(--clr-primary-light)',
};

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src'));
let changedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;
  
  for (const [oldStr, newStr] of Object.entries(replacements)) {
    // Escape parenthesis in regex
    const regex = new RegExp(oldStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    newContent = newContent.replace(regex, newStr);
  }
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    changedFiles++;
  }
});

console.log(`Updated ${changedFiles} files with semantic CSS variables.`);
