#!/usr/bin/env node
/** Temporary script to detect mojibake characters */
const fs = require('fs');
const p = require('path').join(__dirname, process.argv[2]);
const b = fs.readFileSync(p);
console.log('BOM?', b[0] === 0xEF && b[1] === 0xBB && b[2] === 0xBF);
console.log('First 5 bytes:', Array.from(b.slice(0, 5)).map(x => x.toString(16)).join(' '));
