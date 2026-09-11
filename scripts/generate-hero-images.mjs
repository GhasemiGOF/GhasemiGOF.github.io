#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const blogDir = path.join(__dirname, '../src/content/blog');
const outDir = path.join(__dirname, '../public/images/posts');

const palette = {
  'research-notes': { bg: '#f4f6f8', accent: '#5b7c99', shape: '#c8d6e3' },
  'phd-journal': { bg: '#f8f6f4', accent: '#8a7f72', shape: '#ddd5cb' },
  'building-shadonet': { bg: '#f3f6f4', accent: '#6b8f7a', shape: '#c5d9cc' },
  'paper-notes': { bg: '#f5f4f8', accent: '#7a6e99', shape: '#d4cde3' },
  'small-explainers': { bg: '#f6f7f4', accent: '#7a8f6e', shape: '#d5e0cc' },
  'research-questions': { bg: '#f8f4f6', accent: '#996e8b', shape: '#e3cdd8' },
  'conference-notes': { bg: '#f4f5f8', accent: '#6e7a99', shape: '#cdd3e3' },
  'monthly-research-logs': { bg: '#f7f6f3', accent: '#9a8b6e', shape: '#e0d9c5' },
};

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm = {};
  for (const line of match[1].split('\n')) {
    const m = line.match(/^(\w+):\s*"?([^"]*)"?$/);
    if (m) fm[m[1]] = m[2];
  }
  return fm;
}

function slugToFilename(id) {
  return id.replace(/\//g, '--') + '.svg';
}

function wrapText(text, maxChars = 28) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    if ((line + word).length > maxChars) {
      lines.push(line.trim());
      line = word + ' ';
    } else {
      line += word + ' ';
    }
  }
  if (line.trim()) lines.push(line.trim());
  return lines.slice(0, 3);
}

function heroSvg(title, folder) {
  const colors = palette[folder] ?? palette['research-notes'];
  const lines = wrapText(title);
  const textY = 300 - (lines.length - 1) * 18;
  const textElements = lines
    .map((line, i) => `<text x="120" y="${textY + i * 36}" font-family="Georgia, serif" font-size="28" fill="${colors.accent}">${escapeXml(line)}</text>`)
    .join('\n    ');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" role="img" aria-label="${escapeXml(title)}">
  <rect width="1200" height="630" fill="${colors.bg}"/>
  <circle cx="980" cy="120" r="60" fill="${colors.shape}" opacity="0.6"/>
  <rect x="880" y="380" width="180" height="180" rx="4" fill="${colors.shape}" opacity="0.4"/>
  <line x1="120" y1="420" x2="480" y2="420" stroke="${colors.shape}" stroke-width="2"/>
  <line x1="120" y1="460" x2="380" y2="460" stroke="${colors.shape}" stroke-width="1.5" opacity="0.7"/>
  <line x1="120" y1="500" x2="300" y2="500" stroke="${colors.shape}" stroke-width="1.5" opacity="0.5"/>
  ${textElements}
</svg>`;
}

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) files.push(full);
  }
  return files;
}

fs.mkdirSync(outDir, { recursive: true });

const files = walk(blogDir);
let count = 0;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const fm = parseFrontmatter(content);
  const rel = path.relative(blogDir, file).replace(/\.(md|mdx)$/, '');
  const folder = rel.split('/')[0];
  const title = fm.title ?? rel;
  const filename = slugToFilename(rel);
  const heroPath = `/images/posts/${filename}`;
  const svg = heroSvg(title, folder);

  fs.writeFileSync(path.join(outDir, filename), svg);
  count++;

  if (!content.includes('heroImage:')) {
    const updated = content.replace(
      /^---\n/,
      `---\nheroImage: "${heroPath}"\nogImage: "${heroPath}"\n`,
    );
    if (!updated.includes('series:') && palette[folder]) {
      const seriesNames = {
        'building-shadonet': 'Building ShadoNet',
        'phd-journal': 'PhD Journal',
        'research-notes': 'Research Notes',
        'paper-notes': 'Paper Notes',
        'research-questions': 'Research Questions',
        'monthly-research-logs': 'Monthly Research Logs',
      };
      if (seriesNames[folder]) {
        const withSeries = updated.replace(
          /^(category:.*\n)/m,
          `$1series: "${seriesNames[folder]}"\n`,
        );
        fs.writeFileSync(file, withSeries);
        continue;
      }
    }
    fs.writeFileSync(file, updated);
  }
}

console.log(`Generated ${count} hero images in ${outDir}`);
