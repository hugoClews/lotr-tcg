// SVG Procedural Art Generator for Card Backgrounds and Placeholders

import { Culture, CardType } from './types';
import { cultureThemes } from './themes';

// Pseudo-random number generator with seed for reproducibility
function seededRandom(seed: number): () => number {
  return function() {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
}

// Generate unique pattern based on card name
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Culture-specific pattern generators
const patternGenerators: Record<Culture, (rand: () => number, width: number, height: number) => string> = {
  Shire: (rand, w, h) => {
    // Rolling hills and flowers
    let pattern = '';
    // Background hills
    for (let i = 0; i < 3; i++) {
      const hillY = h * 0.5 + rand() * h * 0.3;
      const hillWidth = w * 0.6 + rand() * w * 0.4;
      const hillX = rand() * w * 0.5;
      pattern += `<ellipse cx="${hillX + hillWidth/2}" cy="${hillY + 100}" rx="${hillWidth/2}" ry="${rand() * 60 + 40}" fill="rgba(34, 84, 34, ${0.3 + rand() * 0.2})" />`;
    }
    // Flowers
    for (let i = 0; i < 12; i++) {
      const x = rand() * w;
      const y = h * 0.6 + rand() * h * 0.4;
      const size = 3 + rand() * 5;
      const colors = ['#FFD700', '#FF69B4', '#87CEEB', '#FFA500'];
      const color = colors[Math.floor(rand() * colors.length)];
      pattern += `<circle cx="${x}" cy="${y}" r="${size}" fill="${color}" opacity="0.6" />`;
    }
    return pattern;
  },
  
  Elven: (rand, w, h) => {
    // Flowing curves and stars
    let pattern = '';
    // Flowing lines
    for (let i = 0; i < 5; i++) {
      const startX = rand() * w;
      const startY = rand() * h;
      const cp1x = startX + (rand() - 0.5) * 100;
      const cp1y = startY + (rand() - 0.5) * 100;
      const cp2x = startX + (rand() - 0.5) * 150;
      const cp2y = startY + (rand() - 0.5) * 150;
      const endX = startX + (rand() - 0.5) * 200;
      const endY = startY + (rand() - 0.5) * 200;
      pattern += `<path d="M${startX},${startY} C${cp1x},${cp1y} ${cp2x},${cp2y} ${endX},${endY}" stroke="rgba(144, 205, 244, ${0.2 + rand() * 0.2})" stroke-width="${1 + rand() * 2}" fill="none" />`;
    }
    // Stars
    for (let i = 0; i < 20; i++) {
      const x = rand() * w;
      const y = rand() * h * 0.7;
      const size = 1 + rand() * 3;
      pattern += `<circle cx="${x}" cy="${y}" r="${size}" fill="rgba(255, 255, 255, ${0.3 + rand() * 0.5})" />`;
    }
    return pattern;
  },
  
  Gandalf: (rand, w, h) => {
    // Mystic runes and light rays
    let pattern = '';
    // Light rays from center
    const centerX = w / 2;
    const centerY = h * 0.3;
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const length = 50 + rand() * 100;
      const endX = centerX + Math.cos(angle) * length;
      const endY = centerY + Math.sin(angle) * length;
      pattern += `<line x1="${centerX}" y1="${centerY}" x2="${endX}" y2="${endY}" stroke="rgba(246, 224, 94, ${0.1 + rand() * 0.2})" stroke-width="${1 + rand() * 2}" />`;
    }
    // Central glow
    pattern += `<circle cx="${centerX}" cy="${centerY}" r="30" fill="url(#gandalfGlow)" />`;
    pattern += `<defs><radialGradient id="gandalfGlow"><stop offset="0%" stop-color="rgba(255, 255, 255, 0.6)" /><stop offset="100%" stop-color="rgba(246, 224, 94, 0)" /></radialGradient></defs>`;
    return pattern;
  },
  
  Gondor: (rand, w, h) => {
    // White tree and tower motifs
    let pattern = '';
    // Tower silhouettes
    for (let i = 0; i < 3; i++) {
      const x = rand() * w;
      const towerHeight = 30 + rand() * 50;
      const towerWidth = 10 + rand() * 15;
      pattern += `<rect x="${x}" y="${h - towerHeight}" width="${towerWidth}" height="${towerHeight}" fill="rgba(45, 55, 72, ${0.1 + rand() * 0.15})" />`;
      // Tower top
      pattern += `<polygon points="${x},${h - towerHeight} ${x + towerWidth/2},${h - towerHeight - 10} ${x + towerWidth},${h - towerHeight}" fill="rgba(45, 55, 72, ${0.15 + rand() * 0.1})" />`;
    }
    // Abstract tree branches
    const treeX = w / 2;
    const treeY = h * 0.6;
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI - Math.PI / 2;
      const length = 20 + rand() * 40;
      const endX = treeX + Math.cos(angle) * length;
      const endY = treeY + Math.sin(angle) * length * 0.7;
      pattern += `<line x1="${treeX}" y1="${treeY}" x2="${endX}" y2="${endY}" stroke="rgba(160, 174, 192, ${0.2 + rand() * 0.2})" stroke-width="2" />`;
    }
    return pattern;
  },
  
  Rohan: (rand, w, h) => {
    // Horse motifs and sun rays
    let pattern = '';
    // Sun rays
    const sunX = w * 0.8;
    const sunY = h * 0.2;
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const innerR = 20;
      const outerR = 40 + rand() * 30;
      const startX = sunX + Math.cos(angle) * innerR;
      const startY = sunY + Math.sin(angle) * innerR;
      const endX = sunX + Math.cos(angle) * outerR;
      const endY = sunY + Math.sin(angle) * outerR;
      pattern += `<line x1="${startX}" y1="${startY}" x2="${endX}" y2="${endY}" stroke="rgba(255, 215, 0, ${0.3 + rand() * 0.3})" stroke-width="2" />`;
    }
    pattern += `<circle cx="${sunX}" cy="${sunY}" r="15" fill="rgba(255, 215, 0, 0.5)" />`;
    // Grass/plains texture
    for (let i = 0; i < 30; i++) {
      const x = rand() * w;
      const baseY = h * 0.7 + rand() * h * 0.3;
      const height = 10 + rand() * 20;
      pattern += `<line x1="${x}" y1="${baseY}" x2="${x + (rand() - 0.5) * 10}" y2="${baseY - height}" stroke="rgba(180, 160, 100, ${0.2 + rand() * 0.2})" stroke-width="1" />`;
    }
    return pattern;
  },
  
  Dwarven: (rand, w, h) => {
    // Geometric runes and forge flames
    let pattern = '';
    // Geometric border patterns
    for (let i = 0; i < 4; i++) {
      const y = h * 0.1 + i * 20;
      for (let j = 0; j < 10; j++) {
        const x = j * (w / 10);
        const size = 8;
        if ((i + j) % 2 === 0) {
          pattern += `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="rgba(246, 173, 85, ${0.2 + rand() * 0.2})" transform="rotate(45 ${x + size/2} ${y + size/2})" />`;
        }
      }
    }
    // Forge fire glow
    const fireX = w / 2;
    const fireY = h * 0.7;
    for (let i = 0; i < 5; i++) {
      const flameHeight = 30 + rand() * 40;
      const flameWidth = 15 + rand() * 20;
      const offsetX = (rand() - 0.5) * 40;
      pattern += `<ellipse cx="${fireX + offsetX}" cy="${fireY}" rx="${flameWidth/2}" ry="${flameHeight/2}" fill="rgba(255, ${100 + rand() * 100}, 0, ${0.2 + rand() * 0.2})" />`;
    }
    return pattern;
  },
  
  Ringwraith: (rand, w, h) => {
    // Spectral shadows and the Eye
    let pattern = '';
    // Swirling shadows
    for (let i = 0; i < 8; i++) {
      const startX = rand() * w;
      const startY = rand() * h;
      const endX = startX + (rand() - 0.5) * 150;
      const endY = startY + (rand() - 0.5) * 150;
      const cp1x = startX + (rand() - 0.5) * 100;
      const cp1y = startY + (rand() - 0.5) * 100;
      pattern += `<path d="M${startX},${startY} Q${cp1x},${cp1y} ${endX},${endY}" stroke="rgba(75, 0, 130, ${0.2 + rand() * 0.3})" stroke-width="${5 + rand() * 10}" fill="none" opacity="0.5" />`;
    }
    // Spectral eye
    const eyeX = w / 2;
    const eyeY = h * 0.4;
    pattern += `<ellipse cx="${eyeX}" cy="${eyeY}" rx="30" ry="15" fill="none" stroke="rgba(159, 122, 234, 0.5)" stroke-width="3" />`;
    pattern += `<circle cx="${eyeX}" cy="${eyeY}" r="8" fill="rgba(159, 122, 234, 0.7)" />`;
    return pattern;
  },
  
  Sauron: (rand, w, h) => {
    // Dark tower and fire
    let pattern = '';
    // Barad-dûr silhouette
    const towerX = w / 2 - 20;
    const towerHeight = h * 0.7;
    pattern += `<polygon points="${towerX},${h} ${towerX + 10},${h - towerHeight} ${towerX + 30},${h - towerHeight} ${towerX + 40},${h}" fill="rgba(0, 0, 0, 0.3)" />`;
    pattern += `<polygon points="${towerX + 15},${h - towerHeight} ${towerX + 20},${h - towerHeight - 20} ${towerX + 25},${h - towerHeight}" fill="rgba(0, 0, 0, 0.4)" />`;
    // Fire and lava
    for (let i = 0; i < 10; i++) {
      const x = rand() * w;
      const y = h - rand() * 40;
      const size = 10 + rand() * 20;
      pattern += `<ellipse cx="${x}" cy="${y}" rx="${size}" ry="${size * 0.5}" fill="rgba(255, ${rand() * 50}, 0, ${0.2 + rand() * 0.3})" />`;
    }
    // The Eye
    const eyeX = w / 2;
    const eyeY = h * 0.25;
    pattern += `<ellipse cx="${eyeX}" cy="${eyeY}" rx="25" ry="40" fill="url(#eyeGrad)" />`;
    pattern += `<defs><radialGradient id="eyeGrad"><stop offset="0%" stop-color="rgba(255, 150, 0, 0.8)" /><stop offset="50%" stop-color="rgba(255, 50, 0, 0.5)" /><stop offset="100%" stop-color="rgba(200, 0, 0, 0)" /></radialGradient></defs>`;
    return pattern;
  },
  
  Moria: (rand, w, h) => {
    // Cave depths and goblin eyes
    let pattern = '';
    // Stalactites
    for (let i = 0; i < 15; i++) {
      const x = rand() * w;
      const length = 20 + rand() * 40;
      const width = 5 + rand() * 10;
      pattern += `<polygon points="${x},0 ${x + width/2},${length} ${x + width},0" fill="rgba(60, 40, 40, ${0.3 + rand() * 0.2})" />`;
    }
    // Glowing eyes in darkness
    for (let i = 0; i < 8; i++) {
      const x = rand() * w;
      const y = h * 0.3 + rand() * h * 0.5;
      const spacing = 8;
      pattern += `<circle cx="${x}" cy="${y}" r="3" fill="rgba(255, 200, 0, ${0.4 + rand() * 0.4})" />`;
      pattern += `<circle cx="${x + spacing}" cy="${y}" r="3" fill="rgba(255, 200, 0, ${0.4 + rand() * 0.4})" />`;
    }
    // Darkness gradient
    pattern += `<rect x="0" y="0" width="${w}" height="${h}" fill="url(#moriaDepth)" />`;
    pattern += `<defs><linearGradient id="moriaDepth" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="rgba(0, 0, 0, 0.4)" /><stop offset="100%" stop-color="rgba(0, 0, 0, 0)" /></linearGradient></defs>`;
    return pattern;
  },
  
  Isengard: (rand, w, h) => {
    // Industrial, gears and machinery
    let pattern = '';
    // Gears
    for (let i = 0; i < 5; i++) {
      const x = rand() * w;
      const y = rand() * h;
      const radius = 15 + rand() * 25;
      const teeth = 8 + Math.floor(rand() * 8);
      let gearPath = '';
      for (let t = 0; t < teeth; t++) {
        const angle1 = (t / teeth) * Math.PI * 2;
        const angle2 = ((t + 0.5) / teeth) * Math.PI * 2;
        const innerR = radius * 0.7;
        const outerR = radius;
        const x1 = x + Math.cos(angle1) * innerR;
        const y1 = y + Math.sin(angle1) * innerR;
        const x2 = x + Math.cos(angle1) * outerR;
        const y2 = y + Math.sin(angle1) * outerR;
        const x3 = x + Math.cos(angle2) * outerR;
        const y3 = y + Math.sin(angle2) * outerR;
        const x4 = x + Math.cos(angle2) * innerR;
        const y4 = y + Math.sin(angle2) * innerR;
        gearPath += `M${x1},${y1} L${x2},${y2} L${x3},${y3} L${x4},${y4} Z `;
      }
      pattern += `<path d="${gearPath}" fill="rgba(113, 128, 150, ${0.2 + rand() * 0.2})" />`;
      pattern += `<circle cx="${x}" cy="${y}" r="${radius * 0.3}" fill="rgba(45, 55, 72, 0.3)" />`;
    }
    // White hand
    const handX = w / 2;
    const handY = h * 0.6;
    pattern += `<ellipse cx="${handX}" cy="${handY}" rx="25" ry="35" fill="rgba(255, 255, 255, 0.15)" />`;
    return pattern;
  },
  
  Dunland: (rand, w, h) => {
    // Fire, tribal patterns, destruction
    let pattern = '';
    // Flames
    for (let i = 0; i < 8; i++) {
      const x = rand() * w;
      const baseY = h;
      const flameHeight = 50 + rand() * 80;
      const flameWidth = 20 + rand() * 30;
      const cp1x = x + (rand() - 0.5) * flameWidth;
      const cp1y = baseY - flameHeight * 0.7;
      const tipX = x + (rand() - 0.5) * 20;
      const tipY = baseY - flameHeight;
      pattern += `<path d="M${x - flameWidth/2},${baseY} Q${cp1x},${cp1y} ${tipX},${tipY} Q${cp1x + flameWidth},${cp1y} ${x + flameWidth/2},${baseY} Z" fill="rgba(255, ${100 + rand() * 100}, 0, ${0.2 + rand() * 0.3})" />`;
    }
    // Tribal markings
    for (let i = 0; i < 6; i++) {
      const x = rand() * w;
      const y = rand() * h * 0.5;
      const size = 20 + rand() * 30;
      pattern += `<line x1="${x}" y1="${y}" x2="${x + size}" y2="${y + size * 0.5}" stroke="rgba(255, 200, 150, ${0.3 + rand() * 0.2})" stroke-width="3" />`;
      pattern += `<line x1="${x + size}" y1="${y}" x2="${x}" y2="${y + size * 0.5}" stroke="rgba(255, 200, 150, ${0.3 + rand() * 0.2})" stroke-width="3" />`;
    }
    return pattern;
  },
};

export function generateCardArtSVG(
  culture: Culture,
  cardName: string,
  width: number = 200,
  height: number = 280,
  cardType: CardType = 'Character'
): string {
  const theme = cultureThemes[culture];
  const seed = hashString(cardName + culture);
  const rand = seededRandom(seed);
  
  const pattern = patternGenerators[culture](rand, width, height);
  
  // Create SVG with gradient background and culture-specific patterns
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${theme.primaryColor};stop-opacity:1" />
        <stop offset="50%" style="stop-color:${theme.secondaryColor};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${theme.primaryColor};stop-opacity:1" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    <!-- Background -->
    <rect width="${width}" height="${height}" fill="url(#bgGrad)" />
    
    <!-- Culture Pattern -->
    <g class="pattern">
      ${pattern}
    </g>
    
    <!-- Vignette overlay -->
    <rect width="${width}" height="${height}" fill="url(#vignette)" />
    <defs>
      <radialGradient id="vignette">
        <stop offset="50%" stop-color="rgba(0,0,0,0)" />
        <stop offset="100%" stop-color="rgba(0,0,0,0.4)" />
      </radialGradient>
    </defs>
    
    <!-- Culture Symbol (centered) -->
    <text x="${width/2}" y="${height/2}" 
          font-size="60" 
          text-anchor="middle" 
          dominant-baseline="middle" 
          fill="${theme.accentColor}" 
          opacity="0.3"
          filter="url(#glow)">
      ${theme.symbolUnicode}
    </text>
  </svg>`;
  
  return svg;
}

export function generateCharacterPortraitSVG(
  characterName: string,
  culture: Culture,
  width: number = 200,
  height: number = 200
): string {
  const theme = cultureThemes[culture];
  const seed = hashString(characterName);
  const rand = seededRandom(seed);
  
  // Generate abstract portrait silhouette
  const headRadius = 35 + rand() * 10;
  const shoulderWidth = 60 + rand() * 20;
  const neckWidth = 15 + rand() * 5;
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <defs>
      <linearGradient id="portraitBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${theme.primaryColor}" />
        <stop offset="100%" style="stop-color:${theme.secondaryColor}" />
      </linearGradient>
      <radialGradient id="faceHighlight" cx="30%" cy="30%">
        <stop offset="0%" stop-color="rgba(255,255,255,0.2)" />
        <stop offset="100%" stop-color="rgba(0,0,0,0)" />
      </radialGradient>
    </defs>
    
    <!-- Background -->
    <rect width="${width}" height="${height}" fill="url(#portraitBg)" />
    
    <!-- Decorative ring -->
    <circle cx="${width/2}" cy="${height/2}" r="${Math.min(width, height) * 0.45}" 
            fill="none" stroke="${theme.accentColor}" stroke-width="2" opacity="0.3" />
    
    <!-- Silhouette -->
    <ellipse cx="${width/2}" cy="${height * 0.35}" rx="${headRadius}" ry="${headRadius * 1.1}" 
             fill="${theme.side === 'shadow' ? '#1a1a1a' : '#2d3748'}" />
    
    <!-- Neck -->
    <rect x="${width/2 - neckWidth}" y="${height * 0.45}" 
          width="${neckWidth * 2}" height="${height * 0.15}" 
          fill="${theme.side === 'shadow' ? '#1a1a1a' : '#2d3748'}" />
    
    <!-- Shoulders -->
    <ellipse cx="${width/2}" cy="${height * 0.75}" rx="${shoulderWidth}" ry="${height * 0.2}" 
             fill="${theme.side === 'shadow' ? '#1a1a1a' : '#2d3748'}" />
    
    <!-- Highlight -->
    <ellipse cx="${width/2}" cy="${height * 0.35}" rx="${headRadius}" ry="${headRadius * 1.1}" 
             fill="url(#faceHighlight)" />
    
    <!-- Eyes glow (for shadow characters) -->
    ${theme.side === 'shadow' ? `
    <circle cx="${width/2 - 12}" cy="${height * 0.33}" r="4" fill="${theme.accentColor}" opacity="0.8" />
    <circle cx="${width/2 + 12}" cy="${height * 0.33}" r="4" fill="${theme.accentColor}" opacity="0.8" />
    ` : ''}
    
    <!-- Name initial -->
    <text x="${width/2}" y="${height * 0.9}" 
          font-size="16" font-weight="bold"
          text-anchor="middle" 
          fill="${theme.textColor}" 
          opacity="0.7">
      ${characterName.charAt(0).toUpperCase()}
    </text>
  </svg>`;
  
  return svg;
}

export function generateSiteArtSVG(
  siteName: string,
  siteNumber: number,
  kingdom: string,
  width: number = 200,
  height: number = 140
): string {
  const seed = hashString(siteName);
  const rand = seededRandom(seed);
  
  // Determine theme based on kingdom
  const kingdomColors: Record<string, { primary: string; secondary: string; accent: string }> = {
    Shire: { primary: '#2D5016', secondary: '#4A7023', accent: '#8B4513' },
    Bree: { primary: '#5D4037', secondary: '#795548', accent: '#FFAB91' },
    Arnor: { primary: '#37474F', secondary: '#546E7A', accent: '#90A4AE' },
    Elven: { primary: '#1E3A5F', secondary: '#2C5282', accent: '#90CDF4' },
    Moria: { primary: '#1A1A1A', secondary: '#2D2D2D', accent: '#FF6B6B' },
    Gondor: { primary: '#E0E0E0', secondary: '#BDBDBD', accent: '#424242' },
    Rohan: { primary: '#B7791F', secondary: '#D69E2E', accent: '#FFFAF0' },
    Mordor: { primary: '#3D0000', secondary: '#5D0000', accent: '#FF4500' },
  };
  
  const colors = kingdomColors[kingdom] || kingdomColors.Arnor;
  
  // Generate terrain based on kingdom
  let terrain = '';
  
  if (kingdom === 'Shire' || kingdom === 'Rohan') {
    // Rolling hills
    for (let i = 0; i < 4; i++) {
      const hillY = height * 0.5 + i * 15 + rand() * 20;
      terrain += `<ellipse cx="${width * (0.2 + i * 0.25)}" cy="${hillY + 50}" rx="${80 + rand() * 40}" ry="${30 + rand() * 20}" fill="rgba(50, 100, 50, ${0.2 + rand() * 0.15})" />`;
    }
  } else if (kingdom === 'Elven') {
    // Tall trees
    for (let i = 0; i < 6; i++) {
      const x = rand() * width;
      const treeHeight = 60 + rand() * 40;
      terrain += `<polygon points="${x},${height} ${x + 5},${height - treeHeight} ${x + 10},${height}" fill="rgba(70, 100, 70, ${0.3 + rand() * 0.2})" />`;
      terrain += `<ellipse cx="${x + 5}" cy="${height - treeHeight}" rx="${15 + rand() * 10}" ry="${20 + rand() * 10}" fill="rgba(30, 80, 60, ${0.3 + rand() * 0.2})" />`;
    }
  } else if (kingdom === 'Moria' || kingdom === 'Mordor') {
    // Dark mountains/caves
    for (let i = 0; i < 5; i++) {
      const x = rand() * width;
      const peakHeight = 50 + rand() * 50;
      terrain += `<polygon points="${x},${height} ${x + rand() * 40},${height - peakHeight} ${x + 60 + rand() * 40},${height}" fill="rgba(20, 20, 20, ${0.4 + rand() * 0.2})" />`;
    }
  } else {
    // Generic mountains
    for (let i = 0; i < 4; i++) {
      const x = rand() * width;
      const peakHeight = 40 + rand() * 40;
      const peakWidth = 50 + rand() * 50;
      terrain += `<polygon points="${x},${height} ${x + peakWidth/2},${height - peakHeight} ${x + peakWidth},${height}" fill="rgba(80, 80, 100, ${0.3 + rand() * 0.2})" />`;
    }
  }
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <defs>
      <linearGradient id="siteBg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:${colors.primary}" />
        <stop offset="100%" style="stop-color:${colors.secondary}" />
      </linearGradient>
    </defs>
    
    <!-- Sky/Background -->
    <rect width="${width}" height="${height}" fill="url(#siteBg)" />
    
    <!-- Terrain -->
    ${terrain}
    
    <!-- Path/Road -->
    <path d="M0,${height * 0.9} Q${width * 0.3},${height * 0.7} ${width * 0.5},${height * 0.8} T${width},${height * 0.85}" 
          stroke="${colors.accent}" stroke-width="4" fill="none" opacity="0.4" />
    
    <!-- Site number marker -->
    <circle cx="${width - 25}" cy="25" r="18" fill="${colors.accent}" opacity="0.8" />
    <text x="${width - 25}" y="30" font-size="16" font-weight="bold" text-anchor="middle" fill="${colors.primary}">
      ${siteNumber}
    </text>
  </svg>`;
  
  return svg;
}

export function svgToDataUrl(svg: string): string {
  const encoded = encodeURIComponent(svg);
  return `data:image/svg+xml,${encoded}`;
}
