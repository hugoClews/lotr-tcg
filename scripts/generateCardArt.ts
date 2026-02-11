#!/usr/bin/env npx ts-node

/**
 * Card Art Generator Script
 * Generates all placeholder SVG art for the LOTR TCG card game
 * 
 * Usage: npx ts-node scripts/generateCardArt.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// Import generators (inline since we can't import ES modules easily)
type Culture = 
  | 'Shire' | 'Elven' | 'Gandalf' | 'Gondor' | 'Rohan' | 'Dwarven'
  | 'Ringwraith' | 'Sauron' | 'Moria' | 'Isengard' | 'Dunland';

const cultureThemes: Record<Culture, { 
  primaryColor: string; 
  secondaryColor: string; 
  accentColor: string;
  symbolUnicode: string;
  side: string;
}> = {
  Shire: { primaryColor: '#2D5016', secondaryColor: '#4A7023', accentColor: '#8B4513', symbolUnicode: '⌂', side: 'free_peoples' },
  Elven: { primaryColor: '#1E3A5F', secondaryColor: '#2C5282', accentColor: '#90CDF4', symbolUnicode: '⚘', side: 'free_peoples' },
  Gandalf: { primaryColor: '#4A5568', secondaryColor: '#718096', accentColor: '#F6E05E', symbolUnicode: '★', side: 'free_peoples' },
  Gondor: { primaryColor: '#E2E8F0', secondaryColor: '#CBD5E0', accentColor: '#1A202C', symbolUnicode: '♔', side: 'free_peoples' },
  Rohan: { primaryColor: '#B7791F', secondaryColor: '#D69E2E', accentColor: '#2D3748', symbolUnicode: '♞', side: 'free_peoples' },
  Dwarven: { primaryColor: '#744210', secondaryColor: '#9C4221', accentColor: '#F6AD55', symbolUnicode: '⚒', side: 'free_peoples' },
  Ringwraith: { primaryColor: '#2D1B4E', secondaryColor: '#44337A', accentColor: '#9F7AEA', symbolUnicode: '◉', side: 'shadow' },
  Sauron: { primaryColor: '#742A2A', secondaryColor: '#9B2C2C', accentColor: '#FC8181', symbolUnicode: '⛰', side: 'shadow' },
  Moria: { primaryColor: '#5B2222', secondaryColor: '#822727', accentColor: '#E53E3E', symbolUnicode: '⛏', side: 'shadow' },
  Isengard: { primaryColor: '#1A1A1A', secondaryColor: '#2D3748', accentColor: '#A0AEC0', symbolUnicode: '⚙', side: 'shadow' },
  Dunland: { primaryColor: '#9C4221', secondaryColor: '#C05621', accentColor: '#ED8936', symbolUnicode: '♨', side: 'shadow' },
};

const characters: Array<{ name: string; culture: Culture; title?: string }> = [
  { name: 'Frodo', culture: 'Shire', title: 'Ring-bearer' },
  { name: 'Sam', culture: 'Shire', title: 'Faithful Companion' },
  { name: 'Merry', culture: 'Shire', title: 'Friend to Fellowship' },
  { name: 'Pippin', culture: 'Shire', title: 'Hobbit of the Shire' },
  { name: 'Aragorn', culture: 'Gondor', title: 'Heir of Isildur' },
  { name: 'Boromir', culture: 'Gondor', title: 'Son of Denethor' },
  { name: 'Faramir', culture: 'Gondor', title: 'Captain of Ithilien' },
  { name: 'Legolas', culture: 'Elven', title: 'Prince of Mirkwood' },
  { name: 'Arwen', culture: 'Elven', title: 'Evenstar' },
  { name: 'Elrond', culture: 'Elven', title: 'Lord of Rivendell' },
  { name: 'Galadriel', culture: 'Elven', title: 'Lady of Light' },
  { name: 'Gimli', culture: 'Dwarven', title: "Gimli's Axe" },
  { name: 'Gandalf', culture: 'Gandalf', title: 'The Grey Pilgrim' },
  { name: 'Theoden', culture: 'Rohan', title: 'King of the Mark' },
  { name: 'Eomer', culture: 'Rohan', title: 'Third Marshal' },
  { name: 'Eowyn', culture: 'Rohan', title: 'Lady of Rohan' },
  { name: 'WitchKing', culture: 'Ringwraith', title: 'Lord of the Nazgûl' },
  { name: 'Nazgul', culture: 'Ringwraith', title: 'Dark Rider' },
  { name: 'Saruman', culture: 'Isengard', title: 'Servant of the Eye' },
  { name: 'Lurtz', culture: 'Isengard', title: 'Uruk Captain' },
  { name: 'UrukHai', culture: 'Isengard', title: 'Berserker' },
  { name: 'Gollum', culture: 'Sauron', title: 'Stinker' },
  { name: 'MouthOfSauron', culture: 'Sauron', title: 'Lieutenant of Barad-dûr' },
  { name: 'OrcCaptain', culture: 'Sauron', title: 'Orc Captain' },
  { name: 'CaveTroll', culture: 'Moria', title: 'Moria Troll' },
  { name: 'GoblinRunner', culture: 'Moria', title: 'Scout' },
  { name: 'Balrog', culture: 'Moria', title: "Durin's Bane" },
  { name: 'Wildman', culture: 'Dunland', title: 'Savage Fighter' },
];

const sites = [
  { number: 1, name: 'Bag End', kingdom: 'Shire' },
  { number: 2, name: 'Prancing Pony', kingdom: 'Bree' },
  { number: 3, name: 'Weathertop', kingdom: 'Arnor' },
  { number: 4, name: 'Rivendell', kingdom: 'Elven' },
  { number: 5, name: 'Moria Gate', kingdom: 'Moria' },
  { number: 6, name: 'Balins Tomb', kingdom: 'Moria' },
  { number: 7, name: 'Lothlorien', kingdom: 'Elven' },
  { number: 8, name: 'Amon Hen', kingdom: 'Gondor' },
  { number: 9, name: 'Helms Deep', kingdom: 'Rohan' },
];

function seededRandom(seed: number): () => number {
  return function() {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function generateCulturePattern(culture: Culture, rand: () => number, w: number, h: number): string {
  const theme = cultureThemes[culture];
  let pattern = '';
  
  switch (culture) {
    case 'Shire':
      // Rolling hills and flowers
      for (let i = 0; i < 3; i++) {
        const hillY = h * 0.5 + rand() * h * 0.3;
        pattern += `<ellipse cx="${w * (0.2 + i * 0.3)}" cy="${hillY + 50}" rx="${80}" ry="${40 + rand() * 20}" fill="rgba(34, 84, 34, 0.3)" />`;
      }
      for (let i = 0; i < 8; i++) {
        const x = rand() * w;
        const y = h * 0.7 + rand() * h * 0.3;
        const colors = ['#FFD700', '#FF69B4', '#87CEEB'];
        pattern += `<circle cx="${x}" cy="${y}" r="${3 + rand() * 4}" fill="${colors[Math.floor(rand() * 3)]}" opacity="0.6" />`;
      }
      break;
      
    case 'Elven':
      // Stars and flowing lines
      for (let i = 0; i < 20; i++) {
        const x = rand() * w;
        const y = rand() * h * 0.7;
        pattern += `<circle cx="${x}" cy="${y}" r="${1 + rand() * 3}" fill="rgba(255, 255, 255, ${0.3 + rand() * 0.5})" />`;
      }
      for (let i = 0; i < 4; i++) {
        const startX = rand() * w;
        const startY = rand() * h;
        const endX = startX + (rand() - 0.5) * 150;
        const endY = startY + (rand() - 0.5) * 150;
        pattern += `<path d="M${startX},${startY} Q${startX + 50},${startY - 30} ${endX},${endY}" stroke="rgba(144, 205, 244, 0.3)" stroke-width="2" fill="none" />`;
      }
      break;
      
    case 'Gandalf':
      // Light rays
      const centerX = w / 2;
      const centerY = h * 0.3;
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const length = 50 + rand() * 80;
        const endX = centerX + Math.cos(angle) * length;
        const endY = centerY + Math.sin(angle) * length;
        pattern += `<line x1="${centerX}" y1="${centerY}" x2="${endX}" y2="${endY}" stroke="rgba(246, 224, 94, 0.2)" stroke-width="${1 + rand() * 2}" />`;
      }
      pattern += `<circle cx="${centerX}" cy="${centerY}" r="25" fill="rgba(255, 255, 255, 0.3)" />`;
      break;
      
    case 'Gondor':
      // White tree and towers
      const treeX = w / 2;
      const treeY = h * 0.6;
      for (let i = 0; i < 7; i++) {
        const angle = (i / 7) * Math.PI - Math.PI / 2;
        const length = 25 + rand() * 35;
        pattern += `<line x1="${treeX}" y1="${treeY}" x2="${treeX + Math.cos(angle) * length}" y2="${treeY + Math.sin(angle) * length * 0.6}" stroke="rgba(160, 174, 192, 0.3)" stroke-width="2" />`;
      }
      pattern += `<rect x="${treeX - 3}" y="${treeY}" width="6" height="40" fill="rgba(160, 174, 192, 0.25)" />`;
      break;
      
    case 'Rohan':
      // Sun and grass
      const sunX = w * 0.8;
      const sunY = h * 0.2;
      pattern += `<circle cx="${sunX}" cy="${sunY}" r="20" fill="rgba(255, 215, 0, 0.5)" />`;
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        pattern += `<line x1="${sunX + Math.cos(angle) * 20}" y1="${sunY + Math.sin(angle) * 20}" x2="${sunX + Math.cos(angle) * 40}" y2="${sunY + Math.sin(angle) * 40}" stroke="rgba(255, 215, 0, 0.4)" stroke-width="2" />`;
      }
      for (let i = 0; i < 20; i++) {
        const x = rand() * w;
        const baseY = h * 0.8 + rand() * h * 0.2;
        pattern += `<line x1="${x}" y1="${baseY}" x2="${x + (rand() - 0.5) * 8}" y2="${baseY - 15 - rand() * 15}" stroke="rgba(180, 160, 100, 0.3)" stroke-width="1" />`;
      }
      break;
      
    case 'Dwarven':
      // Geometric patterns and forge glow
      for (let i = 0; i < 3; i++) {
        const y = h * 0.1 + i * 25;
        for (let j = 0; j < 8; j++) {
          if ((i + j) % 2 === 0) {
            pattern += `<rect x="${j * (w / 8) + 5}" y="${y}" width="8" height="8" fill="rgba(246, 173, 85, 0.25)" transform="rotate(45 ${j * (w / 8) + 9} ${y + 4})" />`;
          }
        }
      }
      pattern += `<ellipse cx="${w / 2}" cy="${h * 0.7}" rx="40" ry="25" fill="rgba(255, 150, 0, 0.25)" />`;
      break;
      
    case 'Ringwraith':
      // Swirling shadows
      for (let i = 0; i < 6; i++) {
        const startX = rand() * w;
        const startY = rand() * h;
        const cp1x = startX + (rand() - 0.5) * 100;
        const cp1y = startY + (rand() - 0.5) * 100;
        const endX = startX + (rand() - 0.5) * 120;
        const endY = startY + (rand() - 0.5) * 120;
        pattern += `<path d="M${startX},${startY} Q${cp1x},${cp1y} ${endX},${endY}" stroke="rgba(75, 0, 130, 0.3)" stroke-width="${6 + rand() * 8}" fill="none" />`;
      }
      pattern += `<ellipse cx="${w / 2}" cy="${h * 0.4}" rx="25" ry="12" fill="none" stroke="rgba(159, 122, 234, 0.5)" stroke-width="2" />`;
      pattern += `<circle cx="${w / 2}" cy="${h * 0.4}" r="6" fill="rgba(159, 122, 234, 0.7)" />`;
      break;
      
    case 'Sauron':
      // Dark tower and eye
      pattern += `<polygon points="${w / 2 - 15},${h} ${w / 2 - 5},${h * 0.3} ${w / 2 + 5},${h * 0.3} ${w / 2 + 15},${h}" fill="rgba(0, 0, 0, 0.4)" />`;
      pattern += `<ellipse cx="${w / 2}" cy="${h * 0.25}" rx="20" ry="35" fill="rgba(255, 100, 0, 0.4)" />`;
      for (let i = 0; i < 8; i++) {
        const x = rand() * w;
        const y = h - rand() * 30;
        pattern += `<ellipse cx="${x}" cy="${y}" rx="${10 + rand() * 15}" ry="${5 + rand() * 8}" fill="rgba(255, ${rand() * 50}, 0, 0.25)" />`;
      }
      break;
      
    case 'Moria':
      // Cave depths
      for (let i = 0; i < 12; i++) {
        const x = rand() * w;
        const length = 20 + rand() * 35;
        pattern += `<polygon points="${x},0 ${x + 4},${length} ${x + 8},0" fill="rgba(40, 30, 30, 0.4)" />`;
      }
      for (let i = 0; i < 6; i++) {
        const x = rand() * w;
        const y = h * 0.4 + rand() * h * 0.4;
        pattern += `<circle cx="${x}" cy="${y}" r="3" fill="rgba(255, 200, 0, 0.5)" />`;
        pattern += `<circle cx="${x + 7}" cy="${y}" r="3" fill="rgba(255, 200, 0, 0.5)" />`;
      }
      break;
      
    case 'Isengard':
      // Gears
      for (let i = 0; i < 4; i++) {
        const x = rand() * w;
        const y = rand() * h;
        const r = 15 + rand() * 20;
        pattern += `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="rgba(113, 128, 150, 0.3)" stroke-width="3" />`;
        pattern += `<circle cx="${x}" cy="${y}" r="${r * 0.4}" fill="rgba(45, 55, 72, 0.3)" />`;
      }
      pattern += `<ellipse cx="${w / 2}" cy="${h * 0.65}" rx="20" ry="30" fill="rgba(255, 255, 255, 0.15)" />`;
      break;
      
    case 'Dunland':
      // Flames
      for (let i = 0; i < 6; i++) {
        const x = rand() * w;
        const flameHeight = 50 + rand() * 60;
        pattern += `<ellipse cx="${x}" cy="${h - flameHeight / 2}" rx="${15 + rand() * 15}" ry="${flameHeight / 2}" fill="rgba(255, ${80 + rand() * 80}, 0, 0.3)" />`;
      }
      for (let i = 0; i < 5; i++) {
        const x = rand() * w;
        const y = rand() * h * 0.5;
        const size = 20 + rand() * 25;
        pattern += `<line x1="${x}" y1="${y}" x2="${x + size}" y2="${y + size * 0.4}" stroke="rgba(255, 200, 150, 0.35)" stroke-width="3" />`;
        pattern += `<line x1="${x + size}" y1="${y}" x2="${x}" y2="${y + size * 0.4}" stroke="rgba(255, 200, 150, 0.35)" stroke-width="3" />`;
      }
      break;
  }
  
  return pattern;
}

function generateCardArt(culture: Culture, name: string, w: number = 200, h: number = 280): string {
  const theme = cultureThemes[culture];
  const seed = hashString(name + culture);
  const rand = seededRandom(seed);
  const pattern = generateCulturePattern(culture, rand, w, h);
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs>
    <linearGradient id="bgGrad-${name.replace(/\s/g, '')}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${theme.primaryColor}" />
      <stop offset="50%" style="stop-color:${theme.secondaryColor}" />
      <stop offset="100%" style="stop-color:${theme.primaryColor}" />
    </linearGradient>
    <radialGradient id="vignette-${name.replace(/\s/g, '')}">
      <stop offset="50%" stop-color="rgba(0,0,0,0)" />
      <stop offset="100%" stop-color="rgba(0,0,0,0.4)" />
    </radialGradient>
    <filter id="glow-${name.replace(/\s/g, '')}">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <rect width="${w}" height="${h}" fill="url(#bgGrad-${name.replace(/\s/g, '')})" />
  ${pattern}
  <rect width="${w}" height="${h}" fill="url(#vignette-${name.replace(/\s/g, '')})" />
  
  <text x="${w/2}" y="${h/2}" 
        font-size="50" 
        text-anchor="middle" 
        dominant-baseline="middle" 
        fill="${theme.accentColor}" 
        opacity="0.35"
        filter="url(#glow-${name.replace(/\s/g, '')})">
    ${theme.symbolUnicode}
  </text>
</svg>`;
}

function generatePortrait(name: string, culture: Culture, w: number = 200, h: number = 200): string {
  const theme = cultureThemes[culture];
  const seed = hashString(name);
  const rand = seededRandom(seed);
  
  const headRadius = 35 + rand() * 10;
  const shoulderWidth = 60 + rand() * 20;
  const neckWidth = 15 + rand() * 5;
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs>
    <linearGradient id="portraitBg-${name}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${theme.primaryColor}" />
      <stop offset="100%" style="stop-color:${theme.secondaryColor}" />
    </linearGradient>
  </defs>
  
  <rect width="${w}" height="${h}" fill="url(#portraitBg-${name})" />
  <circle cx="${w/2}" cy="${h/2}" r="${Math.min(w, h) * 0.45}" fill="none" stroke="${theme.accentColor}" stroke-width="2" opacity="0.3" />
  
  <ellipse cx="${w/2}" cy="${h * 0.35}" rx="${headRadius}" ry="${headRadius * 1.1}" fill="${theme.side === 'shadow' ? '#1a1a1a' : '#2d3748'}" />
  <rect x="${w/2 - neckWidth}" y="${h * 0.45}" width="${neckWidth * 2}" height="${h * 0.15}" fill="${theme.side === 'shadow' ? '#1a1a1a' : '#2d3748'}" />
  <ellipse cx="${w/2}" cy="${h * 0.75}" rx="${shoulderWidth}" ry="${h * 0.2}" fill="${theme.side === 'shadow' ? '#1a1a1a' : '#2d3748'}" />
  
  ${theme.side === 'shadow' ? `
  <circle cx="${w/2 - 12}" cy="${h * 0.33}" r="4" fill="${theme.accentColor}" opacity="0.8" />
  <circle cx="${w/2 + 12}" cy="${h * 0.33}" r="4" fill="${theme.accentColor}" opacity="0.8" />` : ''}
  
  <text x="${w/2}" y="${h * 0.92}" font-size="14" font-weight="bold" text-anchor="middle" fill="${theme.accentColor}" opacity="0.8">${name}</text>
</svg>`;
}

function generateSiteArt(name: string, siteNumber: number, kingdom: string, w: number = 280, h: number = 160): string {
  const seed = hashString(name);
  const rand = seededRandom(seed);
  
  const kingdomColors: Record<string, { primary: string; secondary: string; accent: string }> = {
    Shire: { primary: '#2D5016', secondary: '#4A7023', accent: '#8B4513' },
    Bree: { primary: '#5D4037', secondary: '#795548', accent: '#FFAB91' },
    Arnor: { primary: '#37474F', secondary: '#546E7A', accent: '#90A4AE' },
    Elven: { primary: '#1E3A5F', secondary: '#2C5282', accent: '#90CDF4' },
    Moria: { primary: '#1A1A1A', secondary: '#2D2D2D', accent: '#FF6B6B' },
    Gondor: { primary: '#546E7A', secondary: '#78909C', accent: '#ECEFF1' },
    Rohan: { primary: '#B7791F', secondary: '#D69E2E', accent: '#FFFAF0' },
  };
  
  const colors = kingdomColors[kingdom] || kingdomColors.Arnor;
  
  let terrain = '';
  if (kingdom === 'Shire' || kingdom === 'Rohan') {
    for (let i = 0; i < 4; i++) {
      terrain += `<ellipse cx="${w * (0.2 + i * 0.25)}" cy="${h * 0.7 + i * 10}" rx="${60 + rand() * 30}" ry="${25 + rand() * 15}" fill="rgba(50, 100, 50, ${0.2 + rand() * 0.15})" />`;
    }
  } else if (kingdom === 'Elven') {
    for (let i = 0; i < 5; i++) {
      const x = rand() * w;
      const treeH = 50 + rand() * 35;
      terrain += `<polygon points="${x},${h} ${x + 5},${h - treeH} ${x + 10},${h}" fill="rgba(70, 100, 70, 0.3)" />`;
      terrain += `<ellipse cx="${x + 5}" cy="${h - treeH}" rx="${12 + rand() * 8}" ry="${15 + rand() * 10}" fill="rgba(30, 80, 60, 0.35)" />`;
    }
  } else {
    for (let i = 0; i < 4; i++) {
      const x = rand() * w;
      const peakH = 40 + rand() * 35;
      terrain += `<polygon points="${x},${h} ${x + 30 + rand() * 20},${h - peakH} ${x + 60 + rand() * 30},${h}" fill="rgba(60, 60, 80, ${0.25 + rand() * 0.2})" />`;
    }
  }
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs>
    <linearGradient id="siteBg-${siteNumber}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:${colors.primary}" />
      <stop offset="100%" style="stop-color:${colors.secondary}" />
    </linearGradient>
  </defs>
  
  <rect width="${w}" height="${h}" fill="url(#siteBg-${siteNumber})" />
  ${terrain}
  <path d="M0,${h * 0.88} Q${w * 0.3},${h * 0.72} ${w * 0.5},${h * 0.8} T${w},${h * 0.85}" stroke="${colors.accent}" stroke-width="4" fill="none" opacity="0.4" />
  
  <circle cx="${w - 28}" cy="28" r="20" fill="${colors.accent}" opacity="0.85" />
  <text x="${w - 28}" y="34" font-size="18" font-weight="bold" text-anchor="middle" fill="${colors.primary}">${siteNumber}</text>
  
  <text x="${w / 2}" y="${h - 12}" font-size="12" text-anchor="middle" fill="${colors.accent}" opacity="0.9">${name}</text>
</svg>`;
}

// Main execution
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '..', 'public', 'cards');

// Ensure directories exist
const dirs = ['cultures', 'characters', 'sites', 'frames'];
for (const dir of dirs) {
  const dirPath = path.join(publicDir, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

console.log('🎨 Generating LOTR TCG Card Art...\n');

// Generate culture sample cards
console.log('📜 Generating culture backgrounds...');
const cultures: Culture[] = ['Shire', 'Elven', 'Gandalf', 'Gondor', 'Rohan', 'Dwarven', 'Ringwraith', 'Sauron', 'Moria', 'Isengard', 'Dunland'];

for (const culture of cultures) {
  const svg = generateCardArt(culture, `${culture} Sample`);
  const filename = `${culture.toLowerCase()}-bg.svg`;
  fs.writeFileSync(path.join(publicDir, 'cultures', filename), svg);
  console.log(`  ✓ ${filename}`);
}

// Generate character portraits
console.log('\n👤 Generating character portraits...');
for (const char of characters) {
  const svg = generatePortrait(char.name, char.culture);
  const filename = `${char.name.toLowerCase().replace(/\s+/g, '-')}.svg`;
  fs.writeFileSync(path.join(publicDir, 'characters', filename), svg);
  console.log(`  ✓ ${filename} (${char.culture})`);
}

// Generate site artwork
console.log('\n🗺️  Generating site artwork...');
for (const site of sites) {
  const svg = generateSiteArt(site.name, site.number, site.kingdom);
  const filename = `site-${site.number}-${site.name.toLowerCase().replace(/\s+/g, '-')}.svg`;
  fs.writeFileSync(path.join(publicDir, 'sites', filename), svg);
  console.log(`  ✓ ${filename} (${site.kingdom})`);
}

// Generate a manifest file
const manifest = {
  generated: new Date().toISOString(),
  cultures: cultures.map(c => ({
    name: c,
    file: `cultures/${c.toLowerCase()}-bg.svg`,
    side: cultureThemes[c].side,
  })),
  characters: characters.map(c => ({
    name: c.name,
    title: c.title,
    culture: c.culture,
    file: `characters/${c.name.toLowerCase().replace(/\s+/g, '-')}.svg`,
  })),
  sites: sites.map(s => ({
    number: s.number,
    name: s.name,
    kingdom: s.kingdom,
    file: `sites/site-${s.number}-${s.name.toLowerCase().replace(/\s+/g, '-')}.svg`,
  })),
};

fs.writeFileSync(path.join(publicDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log('\n📋 Generated manifest.json');

console.log(`\n✅ Card art generation complete!`);
console.log(`   ${cultures.length} culture backgrounds`);
console.log(`   ${characters.length} character portraits`);
console.log(`   ${sites.length} site artworks`);
console.log(`\n📁 Output directory: ${publicDir}`);
