#!/usr/bin/env node
/** Strip BOM from file if present */
const fs = require('fs');
const p = require('path').join(__dirname, process.argv[2]);
const b = fs.readFileSync(p);
if (b[0] === 0xEF && b[1] === 0xBB && b[2] === 0xBF) {
  fs.writeFileSync(p, b.slice(3));
  console.log(`BOM stripped from ${p}`);
} else {
  console.log(`No BOM in ${p}`);
}
