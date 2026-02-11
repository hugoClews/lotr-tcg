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

// Culture colors for accents
const cultureStyles: Record<string, { symbol: string; accent: string; border: string }> = {
  Shire: { symbol: '🏠', accent: '#7A9968', border: '#5D7A4A' },
  Elven: { symbol: '✧', accent: '#6B8AAA', border: '#4A6B8A' },
  Gandalf: { symbol: '⚡', accent: '#8B8B9A', border: '#6B6B7A' },
  Gondor: { symbol: '🌳', accent: '#9A9A8B', border: '#7A7A6B' },
  Rohan: { symbol: '🐴', accent: '#AA9A6A', border: '#8A7A4A' },
  Dwarven: { symbol: '⚒️', accent: '#AA8A6A', border: '#8A6A4A' },
  Ringwraith: { symbol: '👁️', accent: '#7A5A8A', border: '#5A3A6A' },
  Sauron: { symbol: '🔥', accent: '#AA5A5A', border: '#8A3A3A' },
  Moria: { symbol: '⛏️', accent: '#8A7A5A', border: '#6A5A3A' },
  Isengard: { symbol: '⚙️', accent: '#7A7A7A', border: '#5A5A5A' },
  Dunland: { symbol: '🔥', accent: '#AA6A4A', border: '#8A4A2A' },
  Site: { symbol: '🗺️', accent: '#8A8A6A', border: '#6A6A4A' },
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

  // Card back
  if (faceDown) {
    return (
      <div className={`relative cursor-pointer ${className}`} style={{ width: s.w, height: s.h }} onClick={onClick}>
        <svg viewBox="0 0 250 350" className="absolute inset-0 w-full h-full">
          <defs>
            <pattern id={`woodBack-${card.id}`} patternUnits="userSpaceOnUse" width="50" height="50">
              <rect fill="#2A1A0A" width="50" height="50"/>
              <g stroke="#3A2515" strokeWidth="0.8" opacity="0.5">
                <path d="M0,10 Q12,8 25,12 T50,10" fill="none"/>
                <path d="M0,25 Q15,22 30,28 T50,25" fill="none"/>
                <path d="M0,40 Q10,38 20,42 T50,40" fill="none"/>
              </g>
            </pattern>
            <linearGradient id={`goldBack-${card.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C9A227"/>
              <stop offset="50%" stopColor="#E5C54B"/>
              <stop offset="100%" stopColor="#C9A227"/>
            </linearGradient>
          </defs>
          <rect width="250" height="350" rx="12" fill={`url(#woodBack-${card.id})`}/>
          <rect x="4" y="4" width="242" height="342" rx="10" fill="none" stroke={`url(#goldBack-${card.id})`} strokeWidth="3"/>
          <rect x="20" y="20" width="210" height="310" rx="6" fill="none" stroke={`url(#goldBack-${card.id})`} strokeWidth="1" opacity="0.5"/>
          <circle cx="125" cy="140" r="50" fill="none" stroke={`url(#goldBack-${card.id})`} strokeWidth="2"/>
          <text x="125" y="150" textAnchor="middle" fontSize="50" fill={`url(#goldBack-${card.id})`}>💍</text>
          <text x="125" y="220" textAnchor="middle" fontSize="14" fill="#C9A227" fontFamily="Georgia, serif">Middle-earth</text>
          <text x="125" y="240" textAnchor="middle" fontSize="10" fill="#8A7A4A" fontFamily="Georgia, serif">Trading Card Game</text>
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
          {/* Wood grain texture */}
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
          </pattern>
          
          {/* Gold gradient */}
          <linearGradient id={`gold-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37"/>
            <stop offset="30%" stopColor="#F5D061"/>
            <stop offset="50%" stopColor="#D4AF37"/>
            <stop offset="70%" stopColor="#AA8C2C"/>
            <stop offset="100%" stopColor="#D4AF37"/>
          </linearGradient>
          
          {/* Dark gold for shadows */}
          <linearGradient id={`darkGold-${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8A6A1A"/>
            <stop offset="100%" stopColor="#5A4A10"/>
          </linearGradient>
          
          {/* Parchment gradient */}
          <linearGradient id={`parchment-${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F0E6D0"/>
            <stop offset="50%" stopColor="#E8DCC0"/>
            <stop offset="100%" stopColor="#D8CAA8"/>
          </linearGradient>
          
          {/* Parchment noise texture */}
          <filter id={`parchNoise-${uniqueId}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise"/>
            <feDiffuseLighting in="noise" lightingColor="#F0E6D0" surfaceScale="1.5">
              <feDistantLight azimuth="45" elevation="55"/>
            </feDiffuseLighting>
          </filter>
          
          {/* Culture accent gradient */}
          <linearGradient id={`cultureAccent-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={style.accent}/>
            <stop offset="100%" stopColor={style.border}/>
          </linearGradient>
        </defs>
        
        {/* Main frame with wood texture */}
        <rect width="250" height="350" rx="12" fill={`url(#wood-${uniqueId})`}/>
        
        {/* Outer gold border */}
        <rect x="3" y="3" width="244" height="344" rx="10" fill="none" stroke={`url(#gold-${uniqueId})`} strokeWidth="4"/>
        
        {/* Inner dark border */}
        <rect x="8" y="8" width="234" height="334" rx="8" fill="none" stroke="#1A0A00" strokeWidth="1" opacity="0.5"/>
        
        {/* Title bar */}
        <rect x="12" y="12" width="226" height="34" rx="4" fill="url(#darkGold-${uniqueId})" opacity="0.9"/>
        <rect x="12" y="12" width="226" height="34" rx="4" fill="none" stroke={`url(#gold-${uniqueId})`} strokeWidth="1.5"/>
        
        {/* Art frame */}
        <rect x="14" y="50" width="222" height="155" rx="4" fill="#0A0805"/>
        <rect x="14" y="50" width="222" height="155" rx="4" fill="none" stroke={`url(#gold-${uniqueId})`} strokeWidth="2"/>
        
        {/* Type bar */}
        <rect x="14" y="208" width="222" height="20" fill="rgba(42,26,8,0.7)"/>
        <line x1="14" y1="208" x2="236" y2="208" stroke={`url(#gold-${uniqueId})`} strokeWidth="1"/>
        <line x1="14" y1="228" x2="236" y2="228" stroke={`url(#gold-${uniqueId})`} strokeWidth="1"/>
        
        {/* Text box with parchment */}
        <rect x="12" y="232" width="226" height="106" rx="4" fill={`url(#parchment-${uniqueId})`}/>
        <rect x="12" y="232" width="226" height="106" rx="4" fill="none" stroke="#9A8A6A" strokeWidth="1"/>
        
        {/* Parchment texture lines */}
        <g stroke="#C8B898" strokeWidth="0.5" opacity="0.4">
          <line x1="20" y1="250" x2="230" y2="250"/>
          <line x1="20" y1="265" x2="230" y2="265"/>
          <line x1="20" y1="280" x2="230" y2="280"/>
          <line x1="20" y1="295" x2="230" y2="295"/>
          <line x1="20" y1="310" x2="230" y2="310"/>
        </g>
        
        {/* Corner accents */}
        <g fill={`url(#gold-${uniqueId})`}>
          <path d="M12,12 L32,12 L32,16 L16,16 L16,32 L12,32 Z"/>
          <path d="M238,12 L218,12 L218,16 L234,16 L234,32 L238,32 Z"/>
          <path d="M12,338 L32,338 L32,334 L16,334 L16,318 L12,318 Z"/>
          <path d="M238,338 L218,338 L218,334 L234,334 L234,318 L238,318 Z"/>
        </g>
        
        {/* Corner dots */}
        <circle cx="22" cy="22" r="3" fill={`url(#gold-${uniqueId})`}/>
        <circle cx="228" cy="22" r="3" fill={`url(#gold-${uniqueId})`}/>
        <circle cx="22" cy="328" r="3" fill={`url(#gold-${uniqueId})`}/>
        <circle cx="228" cy="328" r="3" fill={`url(#gold-${uniqueId})`}/>
      </svg>

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col" style={{ padding: `${s.w * 0.05}px` }}>
        {/* Title area */}
        <div className="relative flex items-center justify-between px-1" style={{ height: s.h * 0.1, marginTop: s.h * 0.005 }}>
          {/* Culture symbol */}
          <span style={{ fontSize: s.titleSize * 1.1, filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.5))' }}>{style.symbol}</span>
          
          {/* Card name */}
          <div className="flex-1 text-center truncate px-1" style={{ 
            color: '#F0E8D0', 
            fontSize: s.titleSize, 
            fontFamily: 'Georgia, serif',
            textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
            fontWeight: 'bold'
          }}>
            {card.is_unique && <span style={{ color: '#FFD700' }}>◆</span>}
            {card.name}
          </div>
          
          {/* Twilight cost */}
          <div className="rounded-full flex items-center justify-center font-bold"
            style={{ 
              width: s.statSize * 1.3, height: s.statSize * 1.3,
              background: 'linear-gradient(135deg, #4A3870 0%, #2A1850 100%)',
              border: '2px solid #7A68A0',
              color: '#E0D0F0',
              fontSize: s.titleSize * 0.9,
              boxShadow: '0 2px 4px rgba(0,0,0,0.4)'
            }}>
            {card.twilight_cost}
          </div>
        </div>

        {/* Art area */}
        <div className="relative mx-auto overflow-hidden" style={{ 
          width: '90%', 
          height: s.artH, 
          marginTop: s.h * 0.015,
          borderRadius: 4
        }}>
          {hasImage ? (
            <Image src={card.image_url!} alt={card.name} fill className="object-cover" onError={() => setImageError(true)} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${style.border}60 0%, ${style.border}30 100%)` }}>
              <span style={{ fontSize: s.artH * 0.4, opacity: 0.5 }}>{style.symbol}</span>
            </div>
          )}
        </div>

        {/* Type line */}
        <div className="text-center truncate" style={{ 
          color: '#C0A070',
          fontSize: s.textSize * 0.9,
          fontStyle: 'italic',
          marginTop: s.h * 0.01,
          height: s.h * 0.055,
          lineHeight: `${s.h * 0.055}px`
        }}>
          {card.type_name}
        </div>

        {/* Text box */}
        <div className="relative flex-1 mx-auto overflow-hidden" style={{ 
          width: '92%',
          marginTop: s.h * 0.005,
          padding: s.w * 0.02
        }}>
          {/* Game text */}
          {size !== 'micro' && size !== 'tiny' && card.game_text && (
            <div style={{ 
              color: '#2A2010',
              fontSize: s.textSize * 0.85,
              lineHeight: 1.25,
              fontFamily: 'Georgia, serif'
            }}>
              {card.game_text.slice(0, size === 'small' ? 80 : size === 'medium' ? 150 : 250)}
              {card.game_text.length > (size === 'small' ? 80 : size === 'medium' ? 150 : 250) && '...'}
            </div>
          )}
          
          {/* Stats */}
          <div className="absolute bottom-1 right-1 flex gap-1">
            {card.strength !== undefined && (
              <div className="flex items-center justify-center font-bold rounded"
                style={{ 
                  width: s.statSize, height: s.statSize,
                  background: 'linear-gradient(135deg, #C02020 0%, #801010 100%)',
                  color: 'white',
                  fontSize: s.statSize * 0.65,
                  border: '1px solid #E04040',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.4)'
                }}>
                {card.strength}
              </div>
            )}
            {card.vitality !== undefined && (
              <div className="flex items-center justify-center font-bold rounded"
                style={{ 
                  width: s.statSize, height: s.statSize,
                  background: 'linear-gradient(135deg, #208020 0%, #105010 100%)',
                  color: 'white',
                  fontSize: s.statSize * 0.65,
                  border: '1px solid #40A040',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.4)'
                }}>
                {card.vitality}
              </div>
            )}
          </div>
          
          {/* Resistance (Ring-bearer) */}
          {card.resistance !== undefined && (
            <div className="absolute top-1 right-1 flex items-center justify-center font-bold rounded-full"
              style={{ 
                width: s.statSize * 1.1, height: s.statSize * 1.1,
                background: 'linear-gradient(135deg, #FFD700 0%, #B8860B 100%)',
                color: '#2A1A00',
                fontSize: s.statSize * 0.6,
                border: '2px solid #DAA520',
                boxShadow: '0 0 6px rgba(255,215,0,0.5)'
              }}>
              {card.resistance}
            </div>
          )}
        </div>
      </div>

      {/* Selection glow */}
      {selected && (
        <div className="absolute -inset-1 rounded-xl pointer-events-none" 
          style={{ border: `2px solid ${style.accent}`, boxShadow: `0 0 12px ${style.accent}` }} />
      )}
      {playable && !selected && (
        <div className="absolute -inset-1 rounded-xl pointer-events-none animate-pulse"
          style={{ border: '2px solid #50C050', boxShadow: '0 0 8px rgba(80,192,80,0.6)' }} />
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
