// Prints resume/resume.html to public/Shahzaib_Resume.pdf (A4, 2 pages) and a PNG per page for checking.
// usage: node resume/build.mjs [pngDir]
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
const require = createRequire('/Users/ideofuzion/ClaudeVideoGen/.claude/skills/motion-reel/node_modules/');
const { chromium } = require('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const pngDir = process.argv[2];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 2 });
await p.goto('file://' + path.join(here, 'resume.html'));
await p.evaluate(() => document.fonts.ready);
// a page that overflows its sheet is a broken resume: report it
const over = await p.evaluate(() => [...document.querySelectorAll('.page')].map((pg, i) => {
  const foot = pg.querySelector('footer').getBoundingClientRect().top;
  const last = [...pg.querySelectorAll('section')].pop().getBoundingClientRect().bottom;
  return { page: i + 1, gapToFooterPx: Math.round(foot - last) };
}));
console.log(over);
await p.pdf({ path: path.join(here, '../public/Shahzaib_Resume.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true });
if (pngDir) {
  const pages = await p.locator('.page').all();
  for (let i = 0; i < pages.length; i++) await pages[i].screenshot({ path: `${pngDir}/resume-${i + 1}.png` });
}
await b.close();
