'use client';

import { useState } from 'react';
import Image from 'next/image';

export interface CardData {
  id: number;
  name: string;
  culture_name?: string;
  type_name?: string;
  twilight_cost: number;
  strength?: number;
  vitality?: number;
  resistance?: number;
  game_text?: string;
  flavor_text?: string;
  keywords?: string[];
  is_unique?: boolean;
  image_url?: string;
  rarity?: string;
  set_name?: string;
  exhausted?: boolean;
  wounds?: number;
  attached?: CardData[];
}

// Culture colors for accents - enhanced with richer palettes
// SVG paths for embossed culture icons (designed for 24x24 viewBox)
const cultureSvgPaths: Record<string, string> = {
  // Shire: Hobbit hole / round door
  Shire: 'M12,2 C6.5,2 2,6.5 2,12 C2,17.5 6.5,22 12,22 C17.5,22 22,17.5 22,12 C22,6.5 17.5,2 12,2 M12,4 C16.4,4 20,7.6 20,12 C20,16.4 16.4,20 12,20 C7.6,20 4,16.4 4,12 C4,7.6 7.6,4 12,4 M8,10 L8,14 M16,10 L16,14 M10,12 A2,2 0 1,0 14,12 A2,2 0 1,0 10,12',
  // Elven: Eight-pointed star
  Elven: 'M12,1 L13.5,8 L20,6 L15,11 L22,12 L15,13 L20,18 L13.5,16 L12,23 L10.5,16 L4,18 L9,13 L2,12 L9,11 L4,6 L10.5,8 Z',
  // Gandalf: Lightning bolt / staff
  Gandalf: 'M13,2 L7,11 L11,11 L9,22 L17,11 L13,11 L15,2 Z',
  // Gondor: White tree
  Gondor: 'M12,22 L12,14 M12,14 C12,14 6,12 6,8 C6,4 12,2 12,2 C12,2 18,4 18,8 C18,12 12,14 12,14 M12,8 C12,8 9,9 9,11 M12,8 C12,8 15,9 15,11 M12,6 L12,3 M8,8 C7,6 8,4 10,3 M16,8 C17,6 16,4 14,3',
  // Rohan: Horse head
  Rohan: 'M4,20 C4,20 6,16 8,14 C10,12 12,12 14,10 C16,8 18,4 20,4 C22,4 22,6 21,8 C20,10 18,11 17,12 L19,12 C19,14 17,16 15,16 C15,16 14,18 12,20 C10,22 8,22 6,20 L4,20 M18,6 A1,1 0 1,0 19,7 A1,1 0 1,0 18,6',
  // Dwarven: Crossed axes / hammer
  Dwarven: 'M4,4 L8,8 L6,10 L2,6 L4,4 M20,4 L16,8 L18,10 L22,6 L20,4 M8,8 L12,12 L16,8 M12,12 L12,20 M9,20 L15,20 M10,18 L14,18',
  // Ringwraith: Eye of Sauron / wraith hood
  Ringwraith: 'M12,4 C8,4 4,8 4,12 C4,14 6,16 8,17 L8,20 C8,20 10,22 12,22 C14,22 16,20 16,20 L16,17 C18,16 20,14 20,12 C20,8 16,4 12,4 M8,11 C8,11 10,9 12,9 C14,9 16,11 16,11 C16,11 14,13 12,13 C10,13 8,11 8,11 M12,10 A1,1 0 1,0 12,12 A1,1 0 1,0 12,10',
  // Sauron: Eye of Sauron / flame
  Sauron: 'M12,2 C6,2 2,12 2,12 C2,12 6,22 12,22 C18,22 22,12 22,12 C22,12 18,2 12,2 M12,6 C8,6 5,12 5,12 C5,12 8,18 12,18 C16,18 19,12 19,12 C19,12 16,6 12,6 M12,9 A3,3 0 1,0 12,15 A3,3 0 1,0 12,9',
  // Moria: Pickaxe / dwarven gate
  Moria: 'M4,8 L12,16 L20,8 M8,6 L12,2 L16,6 M12,16 L12,22 M8,22 L16,22 M6,8 L6,10 M18,8 L18,10',
  // Isengard: Hand of Saruman / cog
  Isengard: 'M12,2 L14,6 L18,4 L16,8 L22,8 L18,11 L22,14 L16,14 L18,18 L14,16 L12,22 L10,16 L6,18 L8,14 L2,14 L6,11 L2,8 L8,8 L6,4 L10,6 Z M12,8 A4,4 0 1,0 12,16 A4,4 0 1,0 12,8',
  // Dunland: Torch / flame
  Dunland: 'M12,2 C12,2 8,6 8,10 C8,14 10,16 12,16 C14,16 16,14 16,10 C16,6 12,2 12,2 M10,10 C10,8 11,6 12,5 C13,6 14,8 14,10 C14,12 13,13 12,13 C11,13 10,12 10,10 M10,16 L10,22 L14,22 L14,16',
  // Site: Compass / map marker
  Site: 'M12,2 L14,10 L22,12 L14,14 L12,22 L10,14 L2,12 L10,10 Z M12,8 A4,4 0 1,0 12,16 A4,4 0 1,0 12,8 M12,10 A2,2 0 1,0 12,14 A2,2 0 1,0 12,10',
};

const cultureStyles: Record<string, { 
  symbol: string; 
  accent: string; 
  border: string; 
  frameGradient: [string, string, string];
  textureHue: number;
  metalGradient: [string, string, string, string]; // light, mid, dark, highlight for emboss
}> = {
  Shire: { symbol: '🏠', accent: '#7A9968', border: '#5D7A4A', frameGradient: ['#5D7A4A', '#7A9968', '#4A6838'], textureHue: 90, metalGradient: ['#A8C896', '#7A9968', '#4A6838', '#D0E8BE'] },
  Elven: { symbol: '✧', accent: '#8AB4D4', border: '#5A8AAA', frameGradient: ['#4A7A9A', '#8AB4D4', '#3A6A8A'], textureHue: 200, metalGradient: ['#B8D8F0', '#8AB4D4', '#4A7A9A', '#E0F0FF'] },
  Gandalf: { symbol: '⚡', accent: '#A0A0B8', border: '#6B6B8A', frameGradient: ['#5A5A7A', '#9090A8', '#4A4A6A'], textureHue: 240, metalGradient: ['#C8C8E0', '#9090A8', '#5A5A7A', '#E8E8F8'] },
  Gondor: { symbol: '🌳', accent: '#C0C0B0', border: '#8A8A7A', frameGradient: ['#7A7A6A', '#B0B0A0', '#6A6A5A'], textureHue: 50, metalGradient: ['#E8E8D8', '#C0C0B0', '#8A8A7A', '#F8F8F0'] },
  Rohan: { symbol: '🐴', accent: '#D4B870', border: '#AA8A4A', frameGradient: ['#8A6A2A', '#C4A860', '#7A5A1A'], textureHue: 40, metalGradient: ['#F0D890', '#D4B870', '#AA8A4A', '#FFF0B0'] },
  Dwarven: { symbol: '⚒️', accent: '#C49A6A', border: '#8A5A2A', frameGradient: ['#7A4A1A', '#B48A5A', '#6A3A0A'], textureHue: 25, metalGradient: ['#E0B888', '#C49A6A', '#8A5A2A', '#F8D8B0'] },
  Ringwraith: { symbol: '👁️', accent: '#9A6AAA', border: '#6A3A7A', frameGradient: ['#4A1A5A', '#8A5A9A', '#3A0A4A'], textureHue: 280, metalGradient: ['#C090D0', '#9A6AAA', '#6A3A7A', '#E0B0F0'] },
  Sauron: { symbol: '🔥', accent: '#CC5050', border: '#8A2020', frameGradient: ['#6A0000', '#AA3030', '#5A0000'], textureHue: 0, metalGradient: ['#F07070', '#CC5050', '#8A2020', '#FF9090'] },
  Moria: { symbol: '⛏️', accent: '#9A8A6A', border: '#6A5A3A', frameGradient: ['#5A4A2A', '#8A7A5A', '#4A3A1A'], textureHue: 35, metalGradient: ['#C0B090', '#9A8A6A', '#6A5A3A', '#E0D0B0'] },
  Isengard: { symbol: '⚙️', accent: '#909090', border: '#606060', frameGradient: ['#505050', '#808080', '#404040'], textureHue: 0, metalGradient: ['#C0C0C0', '#909090', '#606060', '#E0E0E0'] },
  Dunland: { symbol: '🔥', accent: '#C47040', border: '#8A4020', frameGradient: ['#6A3010', '#A46030', '#5A2000'], textureHue: 20, metalGradient: ['#E89868', '#C47040', '#8A4020', '#FFB888'] },
  Site: { symbol: '🗺️', accent: '#A0A080', border: '#707050', frameGradient: ['#606040', '#909070', '#505030'], textureHue: 60, metalGradient: ['#C8C8A8', '#A0A080', '#707050', '#E8E8D0'] },
};

interface CardProps {
  card: CardData;
  size?: 'micro' | 'tiny' | 'small' | 'medium' | 'large';
  onClick?: () => void;
  onDoubleClick?: () => void;
  selected?: boolean;
  playable?: boolean;
  faceDown?: boolean;
  className?: string;
}

export default function Card({
  card,
  size = 'medium',
  onClick,
  onDoubleClick,
  selected = false,
  playable = false,
  faceDown = false,
  className = '',
}: CardProps) {
  const [imageError, setImageError] = useState(false);
  const style = cultureStyles[card.culture_name || 'Site'] || cultureStyles.Site;

  const sizes = {
    micro: { w: 50, h: 70, titleSize: 6, textSize: 5, artH: 30, statSize: 8 },
    tiny: { w: 75, h: 105, titleSize: 8, textSize: 6, artH: 48, statSize: 10 },
    small: { w: 120, h: 168, titleSize: 10, textSize: 8, artH: 78, statSize: 14 },
    medium: { w: 180, h: 252, titleSize: 13, textSize: 10, artH: 115, statSize: 18 },
    large: { w: 250, h: 350, titleSize: 16, textSize: 12, artH: 160, statSize: 22 },
  };
  const s = sizes[size];

  // Card back with Celtic knots
  if (faceDown) {
    return (
      <div className={`relative cursor-pointer ${className}`} style={{ width: s.w, height: s.h }} onClick={onClick}>
        <svg viewBox="0 0 250 350" className="absolute inset-0 w-full h-full">
          <defs>
            {/* Aged leather texture */}
            <filter id={`leatherBack-${card.id}`}>
              <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="5" result="noise"/>
              <feDiffuseLighting in="noise" lightingColor="#2A1A0A" surfaceScale="2">
                <feDistantLight azimuth="45" elevation="60"/>
              </feDiffuseLighting>
            </filter>
            <pattern id={`woodBack-${card.id}`} patternUnits="userSpaceOnUse" width="50" height="50">
              <rect fill="#2A1A0A" width="50" height="50"/>
              <g stroke="#3A2515" strokeWidth="0.8" opacity="0.5">
                <path d="M0,10 Q12,8 25,12 T50,10" fill="none"/>
                <path d="M0,25 Q15,22 30,28 T50,25" fill="none"/>
                <path d="M0,40 Q10,38 20,42 T50,40" fill="none"/>
              </g>
            </pattern>
            <linearGradient id={`goldBack-${card.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B6914"/>
              <stop offset="20%" stopColor="#D4AF37"/>
              <stop offset="35%" stopColor="#FFE878"/>
              <stop offset="50%" stopColor="#D4AF37"/>
              <stop offset="65%" stopColor="#FFFACD"/>
              <stop offset="80%" stopColor="#B8860B"/>
              <stop offset="100%" stopColor="#8B6914"/>
            </linearGradient>
            {/* Celtic knot pattern for card back */}
            <pattern id={`celticBack-${card.id}`} patternUnits="userSpaceOnUse" width="40" height="40">
              <rect fill="transparent" width="40" height="40"/>
              <g stroke={`url(#goldBack-${card.id})`} strokeWidth="2" fill="none" opacity="0.6">
                <path d="M0,20 Q10,10 20,20 Q30,30 40,20" />
                <path d="M20,0 Q30,10 20,20 Q10,30 20,40" />
                <circle cx="20" cy="20" r="5" strokeWidth="1.5"/>
              </g>
            </pattern>
            {/* Celtic corner knot symbol for back */}
            <symbol id={`celticCornerBack-${card.id}`} viewBox="0 0 40 40">
              <path d="M5,5 C5,20 20,20 20,5 M20,5 C20,20 35,20 35,5" fill="none" stroke={`url(#goldBack-${card.id})`} strokeWidth="2"/>
              <path d="M5,5 C20,5 20,20 5,20 M5,20 C5,35 20,35 20,20" fill="none" stroke={`url(#goldBack-${card.id})`} strokeWidth="2"/>
              <circle cx="12" cy="12" r="3" fill={`url(#goldBack-${card.id})`}/>
            </symbol>
          </defs>
          <rect width="250" height="350" rx="12" fill={`url(#woodBack-${card.id})`}/>
          <rect width="250" height="350" rx="12" fill={`url(#celticBack-${card.id})`} opacity="0.4"/>
          <rect x="4" y="4" width="242" height="342" rx="10" fill="none" stroke={`url(#goldBack-${card.id})`} strokeWidth="4"/>
          <rect x="12" y="12" width="226" height="326" rx="8" fill="none" stroke={`url(#goldBack-${card.id})`} strokeWidth="1" opacity="0.3"/>
          {/* Central medallion */}
          <circle cx="125" cy="145" r="60" fill="none" stroke={`url(#goldBack-${card.id})`} strokeWidth="3"/>
          <circle cx="125" cy="145" r="52" fill="none" stroke={`url(#goldBack-${card.id})`} strokeWidth="1.5"/>
          <circle cx="125" cy="145" r="44" fill="rgba(42,26,10,0.8)"/>
          <text x="125" y="158" textAnchor="middle" fontSize="55" fill={`url(#goldBack-${card.id})`}>💍</text>
          {/* Celtic corner knots using symbol */}
          <use href={`#celticCornerBack-${card.id}`} x="2" y="2" width="35" height="35"/>
          <use href={`#celticCornerBack-${card.id}`} x="213" y="2" width="35" height="35" transform="translate(463, 0) scale(-1, 1)"/>
          <use href={`#celticCornerBack-${card.id}`} x="2" y="313" width="35" height="35" transform="translate(0, 663) scale(1, -1)"/>
          <use href={`#celticCornerBack-${card.id}`} x="213" y="313" width="35" height="35" transform="translate(463, 663) scale(-1, -1)"/>
          <text x="125" y="235" textAnchor="middle" fontSize="16" fill="#C9A227" fontFamily="Georgia, serif" letterSpacing="3">Middle-earth</text>
          <text x="125" y="258" textAnchor="middle" fontSize="11" fill="#8A7A4A" fontFamily="Georgia, serif" letterSpacing="1">Trading Card Game</text>
        </svg>
      </div>
    );
  }

  const hasImage = card.image_url && !imageError;
  const uniqueId = `card-${card.id}-${size}`;

  return (
    <div
      className={`relative cursor-pointer transition-all duration-200 ${className}`}
      style={{ 
        width: s.w, height: s.h,
        transform: selected ? 'translateY(-6px) scale(1.02)' : playable ? 'translateY(-2px)' : 'none',
        filter: playable && !selected ? 'brightness(1.1)' : 'none',
      }}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      {/* SVG Card Frame */}
      <svg viewBox="0 0 250 350" className="absolute inset-0 w-full h-full" style={{ filter: selected ? `drop-shadow(0 0 8px ${style.accent})` : 'drop-shadow(2px 4px 6px rgba(0,0,0,0.4))' }}>
        <defs>
          {/* Enhanced wood grain texture with depth */}
          <pattern id={`wood-${uniqueId}`} patternUnits="userSpaceOnUse" width="60" height="60">
            <rect fill="#3A2815" width="60" height="60"/>
            <g fill="none" stroke="#4A3520" strokeWidth="0.6" opacity="0.7">
              <path d="M0,8 Q15,6 30,10 T60,8"/>
              <path d="M0,20 Q18,17 36,23 T60,20"/>
              <path d="M0,32 Q12,30 24,34 T60,32"/>
              <path d="M0,44 Q20,41 40,47 T60,44"/>
              <path d="M0,56 Q15,54 30,58 T60,56"/>
            </g>
            <g fill="none" stroke="#2A1808" strokeWidth="0.4" opacity="0.5">
              <path d="M0,4 Q20,2 40,6 T60,4"/>
              <path d="M0,14 Q10,12 20,16 T60,14"/>
              <path d="M0,26 Q22,23 44,29 T60,26"/>
              <path d="M0,38 Q14,36 28,40 T60,38"/>
              <path d="M0,50 Q18,47 36,53 T60,50"/>
            </g>
            {/* Subtle knots */}
            <circle cx="15" cy="25" r="3" fill="#2A1808" opacity="0.3"/>
            <circle cx="45" cy="50" r="2" fill="#2A1808" opacity="0.2"/>
          </pattern>
          
          {/* IMPROVEMENT 3: Enhanced metallic gold gradient with specular highlights */}
          <linearGradient id={`gold-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B6914"/>
            <stop offset="20%" stopColor="#D4AF37"/>
            <stop offset="35%" stopColor="#FFE878"/>
            <stop offset="50%" stopColor="#D4AF37"/>
            <stop offset="65%" stopColor="#FFFACD"/>
            <stop offset="80%" stopColor="#B8860B"/>
            <stop offset="100%" stopColor="#8B6914"/>
          </linearGradient>
          
          {/* Secondary gold highlight for shine pass */}
          <linearGradient id={`goldShine-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent"/>
            <stop offset="40%" stopColor="transparent"/>
            <stop offset="50%" stopColor="rgba(255,255,255,0.4)"/>
            <stop offset="60%" stopColor="transparent"/>
            <stop offset="100%" stopColor="transparent"/>
          </linearGradient>
          
          {/* Embossed gold for raised elements */}
          <linearGradient id={`goldEmboss-${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF5C0"/>
            <stop offset="20%" stopColor="#E8C84A"/>
            <stop offset="80%" stopColor="#9A7A2A"/>
            <stop offset="100%" stopColor="#6A4A0A"/>
          </linearGradient>
          
          {/* Dark gold for shadows and depth */}
          <linearGradient id={`darkGold-${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5A4A20"/>
            <stop offset="50%" stopColor="#3A2A10"/>
            <stop offset="100%" stopColor="#2A1A08"/>
          </linearGradient>
          
          {/* IMPROVEMENT 2: Parchment texture filter with noise */}
          <filter id={`parchment-${uniqueId}`} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise"/>
            <feDiffuseLighting in="noise" lightingColor="#F5ECD0" surfaceScale="2">
              <feDistantLight azimuth="45" elevation="60"/>
            </feDiffuseLighting>
          </filter>
          
          {/* Parchment base gradient with age staining */}
          <linearGradient id={`parchmentGrad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5ECD8"/>
            <stop offset="25%" stopColor="#EDE4C8"/>
            <stop offset="50%" stopColor="#E8DAB8"/>
            <stop offset="75%" stopColor="#E0D0A8"/>
            <stop offset="100%" stopColor="#D8C898"/>
          </linearGradient>
          
          {/* Radial staining for aged look */}
          <radialGradient id={`parchStain-${uniqueId}`} cx="30%" cy="80%" r="60%">
            <stop offset="0%" stopColor="#C8B080" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="transparent"/>
          </radialGradient>
          
          {/* Edge darkening for parchment */}
          <linearGradient id={`parchEdge-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8A7A50" stopOpacity="0.2"/>
            <stop offset="10%" stopColor="transparent"/>
            <stop offset="90%" stopColor="transparent"/>
            <stop offset="100%" stopColor="#8A7A50" stopOpacity="0.2"/>
          </linearGradient>
          
          {/* Culture accent gradient */}
          <linearGradient id={`cultureAccent-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={style.frameGradient[0]}/>
            <stop offset="50%" stopColor={style.frameGradient[1]}/>
            <stop offset="100%" stopColor={style.frameGradient[2]}/>
          </linearGradient>
          
          {/* IMPROVEMENT 1: Celtic knotwork pattern for borders */}
          <pattern id={`celticKnot-${uniqueId}`} patternUnits="userSpaceOnUse" width="24" height="24">
            <rect fill="transparent" width="24" height="24"/>
            <g stroke={`url(#gold-${uniqueId})`} strokeWidth="1.5" fill="none">
              {/* Interlaced loops */}
              <path d="M0,12 Q6,6 12,12 Q18,18 24,12"/>
              <path d="M12,0 Q18,6 12,12 Q6,18 12,24"/>
              {/* Over/under crossings */}
              <circle cx="12" cy="12" r="3" strokeWidth="1"/>
            </g>
          </pattern>
          
          {/* IMPROVEMENT 1: Celtic corner knot symbol */}
          <symbol id={`celticCorner-${uniqueId}`} viewBox="0 0 40 40">
            <path d="M5,5 C5,20 20,20 20,5 M20,5 C20,20 35,20 35,5" fill="none" stroke={`url(#gold-${uniqueId})`} strokeWidth="2"/>
            <path d="M5,5 C20,5 20,20 5,20 M5,20 C5,35 20,35 20,20" fill="none" stroke={`url(#gold-${uniqueId})`} strokeWidth="2"/>
            <circle cx="12" cy="12" r="3" fill={`url(#gold-${uniqueId})`}/>
          </symbol>
          
          {/* Filigree corner pattern */}
          <symbol id={`filigree-${uniqueId}`} viewBox="0 0 40 40">
            <g stroke={`url(#goldEmboss-${uniqueId})`} strokeWidth="1.5" fill="none">
              {/* Main spiral */}
              <path d="M5,35 Q5,5 35,5"/>
              <path d="M10,35 Q10,10 35,10"/>
              {/* Decorative curls */}
              <path d="M5,25 Q0,25 0,20 Q0,15 5,15"/>
              <path d="M15,5 Q15,0 20,0 Q25,0 25,5"/>
              {/* Inner details */}
              <circle cx="20" cy="20" r="2"/>
              <path d="M15,25 Q17,22 20,22 Q23,22 25,25"/>
            </g>
          </symbol>
          
          {/* Drop shadow filter */}
          <filter id={`innerShadow-${uniqueId}`} x="-10%" y="-10%" width="120%" height="120%">
            <feOffset dx="0" dy="2" in="SourceAlpha" result="offset"/>
            <feGaussianBlur in="offset" stdDeviation="2" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
          
          {/* PRINTED TEXT EFFECTS */}
          
          {/* Title text: Letterpress/engraved effect - premium deep emboss */}
          <filter id={`titlePrint-${uniqueId}`} x="-10%" y="-30%" width="120%" height="160%">
            {/* Noise for ink/metal texture */}
            <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="4" result="noise" seed="5"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.5" xChannelSelector="R" yChannelSelector="G" result="displaced"/>
            
            {/* Create emboss shadow (pressed into surface) */}
            <feOffset in="SourceAlpha" dx="0.8" dy="1.2" result="shadowOffset"/>
            <feGaussianBlur in="shadowOffset" stdDeviation="0.4" result="shadowBlur"/>
            <feFlood floodColor="#000000" floodOpacity="0.6" result="shadowColor"/>
            <feComposite in="shadowColor" in2="shadowBlur" operator="in" result="shadow"/>
            
            {/* Create highlight (raised edge catch light) */}
            <feOffset in="SourceAlpha" dx="-0.4" dy="-0.6" result="highlightOffset"/>
            <feGaussianBlur in="highlightOffset" stdDeviation="0.3" result="highlightBlur"/>
            <feFlood floodColor="#FFF8E0" floodOpacity="0.4" result="highlightColor"/>
            <feComposite in="highlightColor" in2="highlightBlur" operator="in" result="highlight"/>
            
            {/* Slight blur for ink absorption */}
            <feGaussianBlur in="displaced" stdDeviation="0.15" result="softText"/>
            
            {/* Layer: shadow, then text, then highlight */}
            <feMerge>
              <feMergeNode in="shadow"/>
              <feMergeNode in="softText"/>
              <feMergeNode in="highlight"/>
            </feMerge>
          </filter>
          
          {/* Game text: Ink-on-parchment effect - aged printed feel */}
          <filter id={`textPrint-${uniqueId}`} x="-5%" y="-15%" width="110%" height="130%">
            {/* Fine noise for paper fiber interaction */}
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="fineNoise" seed="12"/>
            <feDisplacementMap in="SourceGraphic" in2="fineNoise" scale="0.35" xChannelSelector="R" yChannelSelector="G" result="textured"/>
            
            {/* Slight softening - ink absorption into paper */}
            <feGaussianBlur in="textured" stdDeviation="0.2" result="absorbed"/>
            
            {/* Subtle pressed-in shadow */}
            <feOffset in="SourceAlpha" dx="0.3" dy="0.5" result="textShadow"/>
            <feGaussianBlur in="textShadow" stdDeviation="0.3" result="textShadowBlur"/>
            <feFlood floodColor="#1A0A00" floodOpacity="0.35" result="textShadowColor"/>
            <feComposite in="textShadowColor" in2="textShadowBlur" operator="in" result="textShadowFinal"/>
            
            <feMerge>
              <feMergeNode in="textShadowFinal"/>
              <feMergeNode in="absorbed"/>
            </feMerge>
          </filter>
          
          {/* Type line: Softer italic print effect */}
          <filter id={`typePrint-${uniqueId}`} x="-5%" y="-15%" width="110%" height="130%">
            <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" result="noise" seed="8"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.4" xChannelSelector="R" yChannelSelector="G" result="displaced"/>
            <feGaussianBlur in="displaced" stdDeviation="0.18" result="soft"/>
            
            {/* Subtle emboss */}
            <feOffset in="SourceAlpha" dx="0.4" dy="0.6" result="typeShadow"/>
            <feGaussianBlur in="typeShadow" stdDeviation="0.25" result="typeShadowBlur"/>
            <feFlood floodColor="#000000" floodOpacity="0.3" result="typeShadowColor"/>
            <feComposite in="typeShadowColor" in2="typeShadowBlur" operator="in" result="typeShadowFinal"/>
            
            <feMerge>
              <feMergeNode in="typeShadowFinal"/>
              <feMergeNode in="soft"/>
            </feMerge>
          </filter>
          
          {/* Stat numbers: Stamped/pressed effect */}
          <filter id={`statPrint-${uniqueId}`} x="-15%" y="-15%" width="130%" height="130%">
            <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="2" result="noise" seed="3"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.4" xChannelSelector="R" yChannelSelector="G" result="stamped"/>
            <feGaussianBlur in="stamped" stdDeviation="0.12" result="soft"/>
            
            <feOffset in="SourceAlpha" dx="0.5" dy="0.8" result="statShadow"/>
            <feGaussianBlur in="statShadow" stdDeviation="0.4" result="statShadowBlur"/>
            <feFlood floodColor="#000000" floodOpacity="0.5" result="statShadowColor"/>
            <feComposite in="statShadowColor" in2="statShadowBlur" operator="in" result="statShadowFinal"/>
            
            <feMerge>
              <feMergeNode in="statShadowFinal"/>
              <feMergeNode in="soft"/>
            </feMerge>
          </filter>
          
          {/* EMBOSSED BORDER EFFECTS */}
          
          {/* Border emboss filter - creates raised/beveled gold look */}
          <filter id={`borderEmboss-${uniqueId}`} x="-5%" y="-5%" width="110%" height="110%">
            {/* Noise for surface texture irregularity */}
            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="surfaceNoise" seed="42"/>
            <feDisplacementMap in="SourceGraphic" in2="surfaceNoise" scale="0.8" xChannelSelector="R" yChannelSelector="G" result="texturedBorder"/>
            
            {/* 3D lighting for emboss effect */}
            <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blurAlpha"/>
            <feSpecularLighting in="blurAlpha" surfaceScale="4" specularConstant="0.8" specularExponent="20" lightingColor="#FFF8D0" result="specular">
              <fePointLight x="-50" y="-50" z="150"/>
            </feSpecularLighting>
            <feComposite in="specular" in2="SourceAlpha" operator="in" result="specularMask"/>
            
            {/* Inner shadow for depth */}
            <feOffset in="SourceAlpha" dx="1.5" dy="2" result="shadowOffset"/>
            <feGaussianBlur in="shadowOffset" stdDeviation="1.5" result="shadowBlur"/>
            <feFlood floodColor="#2A1A08" floodOpacity="0.7" result="shadowFill"/>
            <feComposite in="shadowFill" in2="shadowBlur" operator="in" result="innerShadow"/>
            
            <feMerge>
              <feMergeNode in="innerShadow"/>
              <feMergeNode in="texturedBorder"/>
              <feMergeNode in="specularMask"/>
            </feMerge>
          </filter>
          
          {/* Decorative line emboss - for thinner lines */}
          <filter id={`lineEmboss-${uniqueId}`} x="-10%" y="-20%" width="120%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="lineNoise" seed="17"/>
            <feDisplacementMap in="SourceGraphic" in2="lineNoise" scale="0.5" xChannelSelector="R" yChannelSelector="G" result="wobblyLine"/>
            
            <feGaussianBlur in="SourceAlpha" stdDeviation="0.5" result="lineBlur"/>
            <feSpecularLighting in="lineBlur" surfaceScale="3" specularConstant="0.7" specularExponent="15" lightingColor="#FFFAE0" result="lineSpec">
              <feDistantLight azimuth="225" elevation="45"/>
            </feSpecularLighting>
            <feComposite in="lineSpec" in2="SourceAlpha" operator="in" result="lineLit"/>
            
            <feMerge>
              <feMergeNode in="wobblyLine"/>
              <feMergeNode in="lineLit"/>
            </feMerge>
          </filter>
          
          {/* EMBOSSED CULTURE ICON EFFECTS */}
          
          {/* Culture icon emboss - stamped metallic foil effect */}
          <filter id={`iconEmboss-${uniqueId}`} x="-20%" y="-20%" width="140%" height="140%">
            {/* Base texture */}
            <feTurbulence type="fractalNoise" baseFrequency="0.1" numOctaves="3" result="iconNoise" seed="33"/>
            <feDisplacementMap in="SourceGraphic" in2="iconNoise" scale="0.3" xChannelSelector="R" yChannelSelector="G" result="texturedIcon"/>
            
            {/* Create deep inset shadow (stamped into surface) */}
            <feOffset in="SourceAlpha" dx="1" dy="1.5" result="iconShadowOff"/>
            <feGaussianBlur in="iconShadowOff" stdDeviation="1" result="iconShadowBlur"/>
            <feFlood floodColor="#1A0A00" floodOpacity="0.8" result="iconShadowFill"/>
            <feComposite in="iconShadowFill" in2="iconShadowBlur" operator="in" result="iconDeepShadow"/>
            
            {/* Specular highlight for metallic sheen */}
            <feGaussianBlur in="SourceAlpha" stdDeviation="0.8" result="iconSpecBlur"/>
            <feSpecularLighting in="iconSpecBlur" surfaceScale="5" specularConstant="1.2" specularExponent="25" lightingColor="#FFFEF0" result="iconSpecular">
              <fePointLight x="-30" y="-30" z="100"/>
            </feSpecularLighting>
            <feComposite in="iconSpecular" in2="SourceAlpha" operator="in" result="iconSpecMask"/>
            
            {/* Diffuse lighting for body */}
            <feDiffuseLighting in="SourceAlpha" surfaceScale="3" diffuseConstant="0.8" result="iconDiffuse">
              <feDistantLight azimuth="225" elevation="50"/>
            </feDiffuseLighting>
            <feComposite in="iconDiffuse" in2="SourceAlpha" operator="in" result="iconDiffMask"/>
            
            {/* Inner glow/rim light */}
            <feOffset in="SourceAlpha" dx="-0.5" dy="-0.5" result="iconHighOff"/>
            <feGaussianBlur in="iconHighOff" stdDeviation="0.3" result="iconHighBlur"/>
            <feFlood floodColor="#FFF8D0" floodOpacity="0.5" result="iconHighFill"/>
            <feComposite in="iconHighFill" in2="iconHighBlur" operator="in" result="iconHighlight"/>
            
            <feMerge>
              <feMergeNode in="iconDeepShadow"/>
              <feMergeNode in="iconDiffMask"/>
              <feMergeNode in="texturedIcon"/>
              <feMergeNode in="iconSpecMask"/>
              <feMergeNode in="iconHighlight"/>
            </feMerge>
          </filter>
          
          {/* Metallic gradient for culture icons */}
          <linearGradient id={`iconMetal-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={style.metalGradient[3]}/>
            <stop offset="25%" stopColor={style.metalGradient[0]}/>
            <stop offset="50%" stopColor={style.metalGradient[1]}/>
            <stop offset="75%" stopColor={style.metalGradient[2]}/>
            <stop offset="100%" stopColor={style.metalGradient[1]}/>
          </linearGradient>
          
          {/* Secondary metallic shine for icons */}
          <linearGradient id={`iconShine-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.4)"/>
            <stop offset="30%" stopColor="rgba(255,255,255,0.1)"/>
            <stop offset="50%" stopColor="rgba(255,255,255,0)"/>
            <stop offset="70%" stopColor="rgba(255,255,255,0.05)"/>
            <stop offset="100%" stopColor="rgba(255,255,255,0.2)"/>
          </linearGradient>
        </defs>
        
        {/* Main frame with wood texture */}
        <rect width="250" height="350" rx="12" fill={`url(#wood-${uniqueId})`}/>
        
        {/* Subtle overlay grain */}
        <rect width="250" height="350" rx="12" fill={`url(#celticKnot-${uniqueId})`} opacity="0.08"/>
        
        {/* EMBOSSED OUTER BORDER - with bevel and texture */}
        <g filter={`url(#borderEmboss-${uniqueId})`}>
          <rect x="3" y="3" width="244" height="344" rx="10" fill="none" stroke={`url(#gold-${uniqueId})`} strokeWidth="5"/>
        </g>
        
        {/* Metallic shine pass on border (separate layer for highlight) */}
        <rect x="3" y="3" width="244" height="344" rx="10" fill="none" stroke={`url(#goldShine-${uniqueId})`} strokeWidth="4" opacity="0.6"/>
        
        {/* Inner recessed border with emboss */}
        <rect x="9" y="9" width="232" height="332" rx="8" fill="none" stroke="#1A0A00" strokeWidth="1.5"/>
        <g filter={`url(#lineEmboss-${uniqueId})`}>
          <rect x="10" y="10" width="230" height="330" rx="7" fill="none" stroke={`url(#gold-${uniqueId})`} strokeWidth="1" opacity="0.7"/>
        </g>
        
        {/* EMBOSSED Celtic corner knots at all 4 corners */}
        <g filter={`url(#lineEmboss-${uniqueId})`}>
          <use href={`#celticCorner-${uniqueId}`} x="2" y="2" width="35" height="35"/>
          <use href={`#celticCorner-${uniqueId}`} x="213" y="2" width="35" height="35" transform="translate(463, 0) scale(-1, 1)"/>
          <use href={`#celticCorner-${uniqueId}`} x="2" y="313" width="35" height="35" transform="translate(0, 663) scale(1, -1)"/>
          <use href={`#celticCorner-${uniqueId}`} x="213" y="313" width="35" height="35" transform="translate(463, 663) scale(-1, -1)"/>
        </g>
        
        {/* Title bar with embossed effect */}
        <rect x="12" y="12" width="226" height="34" rx="4" fill={`url(#darkGold-${uniqueId})`}/>
        <rect x="12" y="12" width="226" height="1" rx="0" fill="rgba(255,245,200,0.2)"/>
        <g filter={`url(#lineEmboss-${uniqueId})`}>
          <rect x="12" y="12" width="226" height="34" rx="4" fill="none" stroke={`url(#gold-${uniqueId})`} strokeWidth="2"/>
        </g>
        
        {/* EMBOSSED Culture Icon in title bar */}
        <g transform="translate(20, 17)" filter={`url(#iconEmboss-${uniqueId})`}>
          <g transform="scale(1)">
            <path d={cultureSvgPaths[card.culture_name || 'Site'] || cultureSvgPaths.Site} 
                  fill={`url(#iconMetal-${uniqueId})`} 
                  stroke={style.metalGradient[2]}
                  strokeWidth="0.5"/>
          </g>
        </g>
        {/* Icon metallic shine overlay */}
        <g transform="translate(20, 17)">
          <path d={cultureSvgPaths[card.culture_name || 'Site'] || cultureSvgPaths.Site} 
                fill={`url(#iconShine-${uniqueId})`}
                opacity="0.5"/>
        </g>
        
        {/* PRINTED Title Text */}
        <g filter={`url(#titlePrint-${uniqueId})`}>
          <text x="125" y="35" textAnchor="middle" 
                fill="#F8F0D8" 
                fontSize="14" 
                fontFamily="Georgia, serif" 
                fontWeight="bold"
                letterSpacing="0.5">
            {card.is_unique && '◆ '}{card.name.length > 18 ? card.name.slice(0, 18) + '…' : card.name}
          </text>
        </g>
        
        {/* Twilight cost circle in title bar */}
        <g transform="translate(222, 29)">
          <circle r="11" fill="url(#darkGold-${uniqueId})" stroke={`url(#goldEmboss-${uniqueId})`} strokeWidth="1.5"/>
          <circle r="9" fill="linear-gradient(135deg, #5A4090 0%, #3A2060 50%, #2A1050 100%)"/>
          <circle r="9" fill="#3A2060"/>
          <circle r="9" fill="none" stroke="#8A78B0" strokeWidth="1.5"/>
          <text y="4" textAnchor="middle" fill="#E8D8F8" fontSize="12" fontWeight="bold" fontFamily="Georgia, serif"
                filter={`url(#statPrint-${uniqueId})`}>{card.twilight_cost}</text>
        </g>
        
        {/* Decorative title bar accents - embossed */}
        <g filter={`url(#lineEmboss-${uniqueId})`} opacity="0.6">
          <line x1="48" y1="29" x2="90" y2="29" stroke={`url(#gold-${uniqueId})`} strokeWidth="0.8"/>
          <line x1="160" y1="29" x2="196" y2="29" stroke={`url(#gold-${uniqueId})`} strokeWidth="0.8"/>
        </g>
        <circle cx="125" cy="11" r="2" fill={`url(#goldEmboss-${uniqueId})`}/>
        
        {/* Art frame with deeper inset */}
        <rect x="14" y="50" width="222" height="155" rx="4" fill="#050403"/>
        <rect x="15" y="51" width="220" height="153" rx="3" fill="#0A0805"/>
        {/* EMBOSSED art frame border */}
        <g filter={`url(#borderEmboss-${uniqueId})`}>
          <rect x="14" y="50" width="222" height="155" rx="4" fill="none" stroke={`url(#gold-${uniqueId})`} strokeWidth="2.5"/>
        </g>
        {/* Inner art frame highlight */}
        <rect x="16" y="52" width="218" height="151" rx="2" fill="none" stroke="rgba(255,245,200,0.15)" strokeWidth="0.5"/>
        
        {/* Art frame corner jewels - embossed gemstone effect */}
        <g filter={`url(#iconEmboss-${uniqueId})`}>
          <circle cx="22" cy="58" r="3.5" fill={`url(#cultureAccent-${uniqueId})`}/>
          <circle cx="228" cy="58" r="3.5" fill={`url(#cultureAccent-${uniqueId})`}/>
          <circle cx="22" cy="197" r="3.5" fill={`url(#cultureAccent-${uniqueId})`}/>
          <circle cx="228" cy="197" r="3.5" fill={`url(#cultureAccent-${uniqueId})`}/>
        </g>
        <circle cx="22" cy="58" r="3.5" fill="none" stroke={`url(#goldEmboss-${uniqueId})`} strokeWidth="1"/>
        <circle cx="228" cy="58" r="3.5" fill="none" stroke={`url(#goldEmboss-${uniqueId})`} strokeWidth="1"/>
        <circle cx="22" cy="197" r="3.5" fill="none" stroke={`url(#goldEmboss-${uniqueId})`} strokeWidth="1"/>
        <circle cx="228" cy="197" r="3.5" fill="none" stroke={`url(#goldEmboss-${uniqueId})`} strokeWidth="1"/>
        
        {/* Type bar with metallic sheen */}
        <rect x="14" y="208" width="222" height="22" fill="rgba(42,26,8,0.9)"/>
        <rect x="14" y="208" width="222" height="1" fill="rgba(255,245,200,0.12)"/>
        {/* EMBOSSED type bar borders */}
        <g filter={`url(#lineEmboss-${uniqueId})`}>
          <line x1="14" y1="208" x2="236" y2="208" stroke={`url(#gold-${uniqueId})`} strokeWidth="1.8"/>
          <line x1="14" y1="230" x2="236" y2="230" stroke={`url(#gold-${uniqueId})`} strokeWidth="1.8"/>
        </g>
        {/* PRINTED Type line text */}
        <g filter={`url(#typePrint-${uniqueId})`}>
          <text x="125" y="223" textAnchor="middle" 
                fill="#D0B070" 
                fontSize="11" 
                fontFamily="Georgia, serif" 
                fontStyle="italic"
                letterSpacing="0.5">
            {card.type_name || ''}
          </text>
        </g>
        {/* Type bar decorative elements - embossed dots */}
        <g filter={`url(#iconEmboss-${uniqueId})`}>
          <circle cx="30" cy="219" r="1.8" fill={`url(#goldEmboss-${uniqueId})`}/>
          <circle cx="220" cy="219" r="1.8" fill={`url(#goldEmboss-${uniqueId})`}/>
        </g>
        
        {/* Text box with aged parchment texture filter */}
        <rect x="12" y="232" width="226" height="106" rx="4" fill={`url(#parchmentGrad-${uniqueId})`}/>
        <rect x="12" y="232" width="226" height="106" rx="4" fill={`url(#parchStain-${uniqueId})`}/>
        <rect x="12" y="232" width="226" height="106" rx="4" fill={`url(#parchEdge-${uniqueId})`}/>
        <rect x="12" y="232" width="226" height="106" rx="4" filter={`url(#parchment-${uniqueId})`} fillOpacity="0.3"/>
        {/* EMBOSSED text box border */}
        <g filter={`url(#lineEmboss-${uniqueId})`}>
          <rect x="12" y="232" width="226" height="106" rx="4" fill="none" stroke={`url(#gold-${uniqueId})`} strokeWidth="1.8"/>
        </g>
        
        {/* Parchment ruled lines with printed irregularity */}
        <g stroke="#A89868" strokeWidth="0.5" opacity="0.3" filter={`url(#textPrint-${uniqueId})`}>
          <line x1="22" y1="252" x2="228" y2="252"/>
          <line x1="20" y1="268" x2="230" y2="268"/>
          <line x1="21" y1="284" x2="229" y2="284"/>
          <line x1="20" y1="300" x2="228" y2="300"/>
          <line x1="22" y1="316" x2="230" y2="316"/>
        </g>
        
        {/* Decorative divider above text box - embossed */}
        <g filter={`url(#iconEmboss-${uniqueId})`}>
          <circle cx="125" cy="232" r="3.5" fill={`url(#goldEmboss-${uniqueId})`}/>
        </g>
        <g filter={`url(#lineEmboss-${uniqueId})`}>
          <rect x="60" y="231" width="50" height="1.5" fill={`url(#gold-${uniqueId})`}/>
          <rect x="140" y="231" width="50" height="1.5" fill={`url(#gold-${uniqueId})`}/>
        </g>
        
        {/* EMBOSSED corner accents with Celtic spiral motif */}
        <g filter={`url(#borderEmboss-${uniqueId})`}>
          <g fill={`url(#goldEmboss-${uniqueId})`}>
            {/* Top-left */}
            <path d="M12,12 L36,12 L36,15 L15,15 L15,36 L12,36 Z"/>
            {/* Top-right */}
            <path d="M238,12 L214,12 L214,15 L235,15 L235,36 L238,36 Z"/>
            {/* Bottom-left */}
            <path d="M12,338 L36,338 L36,335 L15,335 L15,314 L12,314 Z"/>
            {/* Bottom-right */}
            <path d="M238,338 L214,338 L214,335 L235,335 L235,314 L238,314 Z"/>
          </g>
        </g>
        
        {/* Corner accent circles with embossed gems */}
        <g filter={`url(#lineEmboss-${uniqueId})`}>
          <circle cx="24" cy="24" r="4" fill="none" stroke={`url(#gold-${uniqueId})`} strokeWidth="1.5"/>
          <circle cx="226" cy="24" r="4" fill="none" stroke={`url(#gold-${uniqueId})`} strokeWidth="1.5"/>
          <circle cx="24" cy="326" r="4" fill="none" stroke={`url(#gold-${uniqueId})`} strokeWidth="1.5"/>
          <circle cx="226" cy="326" r="4" fill="none" stroke={`url(#gold-${uniqueId})`} strokeWidth="1.5"/>
        </g>
        <g filter={`url(#iconEmboss-${uniqueId})`}>
          <circle cx="24" cy="24" r="2.5" fill={`url(#cultureAccent-${uniqueId})`}/>
          <circle cx="226" cy="24" r="2.5" fill={`url(#cultureAccent-${uniqueId})`}/>
          <circle cx="24" cy="326" r="2.5" fill={`url(#cultureAccent-${uniqueId})`}/>
          <circle cx="226" cy="326" r="2.5" fill={`url(#cultureAccent-${uniqueId})`}/>
        </g>
        
        {/* PRINTED Game text in text box */}
        {card.game_text && (
          <g filter={`url(#textPrint-${uniqueId})`}>
            <foreignObject x="18" y="238" width="214" height="80">
              <div xmlns="http://www.w3.org/1999/xhtml" style={{
                color: '#2A1A08',
                fontSize: '9px',
                lineHeight: '1.35',
                fontFamily: 'Georgia, serif',
                padding: '4px',
                overflow: 'hidden'
              }}>
                {card.game_text.slice(0, 180)}{card.game_text.length > 180 ? '...' : ''}
              </div>
            </foreignObject>
          </g>
        )}
        
        {/* PRINTED Stat boxes (if present) */}
        {(card.strength !== undefined || card.vitality !== undefined) && (
          <g transform="translate(200, 318)">
            {card.strength !== undefined && (
              <g transform={`translate(${card.vitality !== undefined ? -22 : 0}, 0)`}>
                <rect x="0" y="0" width="18" height="18" rx="2" fill="#A01010"/>
                <rect x="0" y="0" width="18" height="18" rx="2" fill="url(#darkGold-${uniqueId})" fillOpacity="0.3"/>
                <rect x="0" y="0" width="18" height="18" rx="2" fill="none" stroke="#F05050" strokeWidth="1.5"/>
                <text x="9" y="14" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="Georgia, serif"
                      filter={`url(#statPrint-${uniqueId})`}>{card.strength}</text>
              </g>
            )}
            {card.vitality !== undefined && (
              <g>
                <rect x="0" y="0" width="18" height="18" rx="2" fill="#108010"/>
                <rect x="0" y="0" width="18" height="18" rx="2" fill="url(#darkGold-${uniqueId})" fillOpacity="0.3"/>
                <rect x="0" y="0" width="18" height="18" rx="2" fill="none" stroke="#50C050" strokeWidth="1.5"/>
                <text x="9" y="14" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="Georgia, serif"
                      filter={`url(#statPrint-${uniqueId})`}>{card.vitality}</text>
              </g>
            )}
          </g>
        )}
        
        {/* Resistance (Ring-bearer) with embossed glow */}
        {card.resistance !== undefined && (
          <g transform="translate(218, 244)">
            <circle r="10" fill="#D4AF37" filter={`url(#iconEmboss-${uniqueId})`}/>
            <circle r="10" fill="none" stroke="#FFD700" strokeWidth="1.5"/>
            <text y="4" textAnchor="middle" fill="#2A1A00" fontSize="11" fontWeight="bold" fontFamily="Georgia, serif"
                  filter={`url(#statPrint-${uniqueId})`}>{card.resistance}</text>
          </g>
        )}
      </svg>

      {/* Content overlay - only art area (text is now in SVG) */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Art area positioned over the SVG art frame */}
        <div className="absolute overflow-hidden" style={{ 
          left: '6.4%',
          top: '15%',
          width: '87.2%', 
          height: '44%',
          borderRadius: 4
        }}>
          {hasImage ? (
            <Image src={card.image_url!} alt={card.name} fill className="object-cover" onError={() => setImageError(true)} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center" style={{ 
              background: `linear-gradient(135deg, ${style.border}80 0%, ${style.border}40 50%, ${style.border}60 100%)` 
            }}>
              {/* Fallback culture icon (embossed version is in title bar) */}
              <svg viewBox="0 0 24 24" style={{ width: '40%', height: '40%', opacity: 0.5 }}>
                <path d={cultureSvgPaths[card.culture_name || 'Site'] || cultureSvgPaths.Site} 
                      fill={style.accent}
                      stroke={style.border}
                      strokeWidth="0.5"/>
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Selection glow - enhanced */}
      {selected && (
        <div className="absolute -inset-1 rounded-xl pointer-events-none" 
          style={{ 
            border: `2px solid ${style.accent}`, 
            boxShadow: `0 0 12px ${style.accent}, 0 0 24px ${style.accent}40, inset 0 0 8px ${style.accent}20` 
          }} />
      )}
      {playable && !selected && (
        <div className="absolute -inset-1 rounded-xl pointer-events-none animate-pulse"
          style={{ 
            border: '2px solid #60D060', 
            boxShadow: '0 0 10px rgba(80,192,80,0.7), 0 0 20px rgba(80,192,80,0.4)' 
          }} />
      )}
    </div>
  );
}

export function CardPreview({ card }: { card: CardData }) {
  return (
    <div className="bg-black/95 p-4 rounded-xl shadow-2xl border border-amber-900/50 backdrop-blur">
      <Card card={card} size="large" />
    </div>
  );
}
