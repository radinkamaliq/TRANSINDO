#!/usr/bin/env node
/** Temporary script to detect mojibake characters */
const fs = require('fs');
const paths = [
  'frontend/src/pages/JourneyPlannerPage.jsx',
  'backend/src/services/journeyService.js',
  'test_payload.json',
];
const mojibakePatterns = [
  { pattern: 'â€¢', replacement: '•', name: 'bullet (â€¢ → •)' },
  { pattern: 'â†’', replacement: '→', name: 'arrow (â†’ → →)' },
  { pattern: 'âââ', replacement: '—', name: 'emdash' },
];

for (const p of paths) {
  const fullPath = require('path').join(__dirname, p);
  if (!fs.existsSync(fullPath)) continue;
  const s = fs.readFileSync(fullPath, 'utf8');
  const lines = s.split('\n');
  console.log(`\n=== ${p} ===`);
  lines.forEach((l, i) => {
    for (const { pattern, name } of mojibakePatterns) {
      if (l.includes(pattern)) {
        console.log(`  Line ${i+1}: ${name}`);
      }
    }
  });
}
