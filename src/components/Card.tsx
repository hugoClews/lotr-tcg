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

// Culture frame styles - designed like physical TCG cards
const cultureFrames: Record<string, {
  frame: string;
  inner: string;
  title: string;
  text: string;
  accent: string;
  symbol: string;
}> = {
  Shire: {
    frame: 'bg-gradient-to-b from-emerald-800 via-emerald-900 to-emerald-950 border-emerald-600',
    inner: 'bg-gradient-to-b from-emerald-100 to-emerald-200',
    title: 'bg-emerald-800 text-emerald-100',
    text: 'bg-emerald-50 text-emerald-900',
    accent: 'bg-emerald-600',
    symbol: '🏠',
  },
  Elven: {
    frame: 'bg-gradient-to-b from-blue-700 via-blue-900 to-blue-950 border-blue-400',
    inner: 'bg-gradient-to-b from-blue-100 to-blue-200',
    title: 'bg-blue-800 text-blue-100',
    text: 'bg-blue-50 text-blue-900',
    accent: 'bg-blue-500',
    symbol: '✧',
  },
  Gandalf: {
    frame: 'bg-gradient-to-b from-slate-500 via-slate-700 to-slate-900 border-slate-400',
    inner: 'bg-gradient-to-b from-slate-100 to-slate-200',
    title: 'bg-slate-700 text-slate-100',
    text: 'bg-slate-50 text-slate-900',
    accent: 'bg-slate-500',
    symbol: '⚡',
  },
  Gondor: {
    frame: 'bg-gradient-to-b from-stone-300 via-stone-500 to-stone-700 border-stone-200',
    inner: 'bg-gradient-to-b from-stone-50 to-stone-100',
    title: 'bg-stone-600 text-stone-100',
    text: 'bg-stone-50 text-stone-800',
    accent: 'bg-stone-400',
    symbol: '🌳',
  },
  Rohan: {
    frame: 'bg-gradient-to-b from-yellow-600 via-yellow-800 to-yellow-950 border-yellow-500',
    inner: 'bg-gradient-to-b from-yellow-100 to-yellow-200',
    title: 'bg-yellow-800 text-yellow-100',
    text: 'bg-yellow-50 text-yellow-900',
    accent: 'bg-yellow-500',
    symbol: '🐴',
  },
  Dwarven: {
    frame: 'bg-gradient-to-b from-amber-700 via-amber-900 to-amber-950 border-amber-600',
    inner: 'bg-gradient-to-b from-amber-100 to-amber-200',
    title: 'bg-amber-800 text-amber-100',
    text: 'bg-amber-50 text-amber-900',
    accent: 'bg-amber-600',
    symbol: '⚒️',
  },
  Ringwraith: {
    frame: 'bg-gradient-to-b from-violet-800 via-violet-950 to-black border-violet-500',
    inner: 'bg-gradient-to-b from-violet-200 to-violet-300',
    title: 'bg-violet-900 text-violet-100',
    text: 'bg-violet-100 text-violet-900',
    accent: 'bg-violet-600',
    symbol: '👁️',
  },
  Sauron: {
    frame: 'bg-gradient-to-b from-red-800 via-red-950 to-black border-red-600',
    inner: 'bg-gradient-to-b from-red-200 to-red-300',
    title: 'bg-red-900 text-red-100',
    text: 'bg-red-100 text-red-900',
    accent: 'bg-red-600',
    symbol: '🔥',
  },
  Moria: {
    frame: 'bg-gradient-to-b from-orange-900 via-stone-900 to-black border-orange-700',
    inner: 'bg-gradient-to-b from-orange-200 to-stone-300',
    title: 'bg-stone-800 text-orange-100',
    text: 'bg-stone-100 text-stone-900',
    accent: 'bg-orange-700',
    symbol: '⛏️',
  },
  Isengard: {
    frame: 'bg-gradient-to-b from-zinc-600 via-zinc-800 to-black border-zinc-400',
    inner: 'bg-gradient-to-b from-zinc-200 to-zinc-300',
    title: 'bg-zinc-800 text-zinc-100',
    text: 'bg-zinc-100 text-zinc-900',
    accent: 'bg-zinc-500',
    symbol: '⚙️',
  },
  Dunland: {
    frame: 'bg-gradient-to-b from-orange-700 via-orange-900 to-orange-950 border-orange-500',
    inner: 'bg-gradient-to-b from-orange-100 to-orange-200',
    title: 'bg-orange-800 text-orange-100',
    text: 'bg-orange-50 text-orange-900',
    accent: 'bg-orange-600',
    symbol: '🔥',
  },
  Site: {
    frame: 'bg-gradient-to-b from-stone-600 via-stone-800 to-stone-950 border-stone-500',
    inner: 'bg-gradient-to-b from-stone-100 to-stone-200',
    title: 'bg-stone-700 text-stone-100',
    text: 'bg-stone-50 text-stone-900',
    accent: 'bg-stone-500',
    symbol: '🗺️',
  },
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
  const frame = cultureFrames[card.culture_name || 'Site'] || cultureFrames.Site;

  // Card dimensions based on standard TCG ratio (2.5 x 3.5 inches = 5:7 ratio)
  const sizeClasses = {
    micro: 'w-[40px] h-[56px]',
    tiny: 'w-[60px] h-[84px]',
    small: 'w-[100px] h-[140px]',
    medium: 'w-[150px] h-[210px]',
    large: 'w-[250px] h-[350px]',
  };

  const textSizes = {
    micro: { name: 'text-[4px]', stats: 'text-[3px]', body: 'text-[3px]', cost: 'text-[6px]' },
    tiny: { name: 'text-[6px]', stats: 'text-[5px]', body: 'text-[4px]', cost: 'text-[8px]' },
    small: { name: 'text-[9px]', stats: 'text-[7px]', body: 'text-[6px]', cost: 'text-xs' },
    medium: { name: 'text-xs', stats: 'text-[9px]', body: 'text-[8px]', cost: 'text-sm' },
    large: { name: 'text-base', stats: 'text-xs', body: 'text-[10px]', cost: 'text-lg' },
  };

  const ts = textSizes[size];

  // Card back design
  if (faceDown) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-md shadow-xl cursor-pointer ${className}`}
        onClick={onClick}
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
          border: '3px solid #d4af37',
        }}
      >
        <div className="w-full h-full flex items-center justify-center rounded-sm"
          style={{
            background: `
              radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.5) 70%),
              repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(212,175,55,0.1) 10px, rgba(212,175,55,0.1) 20px)
            `,
          }}
        >
          <div className="text-center">
            <div className="text-yellow-500 opacity-80" style={{ fontSize: size === 'tiny' ? '16px' : size === 'small' ? '24px' : size === 'medium' ? '36px' : '48px' }}>
              💍
            </div>
            {size !== 'tiny' && (
              <div className="text-yellow-600 font-serif italic" style={{ fontSize: size === 'small' ? '6px' : size === 'medium' ? '8px' : '10px' }}>
                Middle-earth
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        ${sizeClasses[size]}
        ${frame.frame}
        ${selected ? 'ring-4 ring-yellow-400 ring-offset-2 ring-offset-black scale-105' : ''}
        ${playable ? 'ring-2 ring-green-400 shadow-green-400/50 shadow-lg' : ''}
        ${card.exhausted ? 'rotate-90' : ''}
        rounded-md border-2 shadow-xl cursor-pointer
        transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:z-50
        flex flex-col p-[3px] relative
        ${className}
      `}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      {/* Inner card frame */}
      <div className="flex-1 flex flex-col rounded-sm overflow-hidden bg-black/20">
        
        {/* Top bar: Culture symbol + Cost */}
        <div className={`flex justify-between items-center px-1 ${frame.accent}`} 
          style={{ minHeight: size === 'tiny' ? '10px' : size === 'small' ? '14px' : size === 'medium' ? '18px' : '24px' }}>
          <span className={ts.cost}>{frame.symbol}</span>
          <span className={`${ts.cost} font-bold bg-black/30 rounded-full w-5 h-5 flex items-center justify-center text-white`}
            style={{ 
              width: size === 'tiny' ? '12px' : size === 'small' ? '16px' : size === 'medium' ? '20px' : '28px',
              height: size === 'tiny' ? '12px' : size === 'small' ? '16px' : size === 'medium' ? '20px' : '28px',
            }}>
            {card.twilight_cost}
          </span>
        </div>

        {/* Art box - takes up ~55-60% of card height */}
        <div className={`${frame.inner} relative overflow-hidden`} style={{ height: '55%', minHeight: '50%' }}>
          {card.image_url && !imageError ? (
            <img
              src={card.image_url}
              alt={card.name}
              className="w-full h-full object-cover object-center"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            // Placeholder art - gradient with culture symbol
            <div className="w-full h-full flex items-center justify-center"
              style={{
                background: `
                  radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 50%),
                  radial-gradient(ellipse at 70% 70%, rgba(0,0,0,0.2) 0%, transparent 50%)
                `,
              }}
            >
              <span style={{ 
                fontSize: size === 'tiny' ? '20px' : size === 'small' ? '32px' : size === 'medium' ? '48px' : '72px',
                opacity: 0.4 
              }}>
                {frame.symbol}
              </span>
            </div>
          )}
          
          {/* Wounds overlay */}
          {card.wounds && card.wounds > 0 && (
            <div className="absolute top-1 right-1 flex gap-0.5">
              {Array.from({ length: Math.min(card.wounds, 4) }).map((_, i) => (
                <span key={i} className="drop-shadow-lg" style={{ fontSize: size === 'tiny' ? '8px' : size === 'small' ? '10px' : '14px' }}>
                  💔
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Title bar */}
        <div className={`${frame.title} px-1 flex justify-between items-center`}
          style={{ minHeight: size === 'tiny' ? '12px' : size === 'small' ? '16px' : size === 'medium' ? '22px' : '32px' }}>
          <span className={`${ts.name} font-bold truncate flex-1`}>
            {card.is_unique && <span className="text-yellow-400 mr-0.5">◆</span>}
            {card.name}
          </span>
          {/* Stats badges */}
          {(card.strength !== undefined || card.vitality !== undefined) && (
            <div className="flex gap-0.5 ml-1">
              {card.strength !== undefined && (
                <span className={`${ts.stats} bg-red-600 text-white rounded px-1 font-bold`}>
                  {card.strength}
                </span>
              )}
              {card.vitality !== undefined && (
                <span className={`${ts.stats} bg-blue-600 text-white rounded px-1 font-bold`}>
                  {card.vitality}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Type line */}
        <div className={`${frame.text} px-1 border-b border-black/10`}
          style={{ minHeight: size === 'tiny' ? '8px' : size === 'small' ? '10px' : size === 'medium' ? '14px' : '20px' }}>
          <span className={`${ts.body} opacity-70 truncate block`}>
            {card.type_name}
          </span>
        </div>

        {/* Game text box */}
        {size !== 'tiny' && (
          <div className={`${frame.text} px-1 py-0.5 flex-1 overflow-hidden`}>
            <p className={`${ts.body} leading-tight`} style={{
              display: '-webkit-box',
              WebkitLineClamp: size === 'small' ? 2 : size === 'medium' ? 3 : 5,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {card.game_text}
            </p>
          </div>
        )}

        {/* Resistance (Ring-bearer only) */}
        {card.resistance !== undefined && (
          <div className="absolute bottom-2 right-2">
            <span className={`bg-yellow-500 text-black rounded-full font-bold flex items-center justify-center shadow-lg`}
              style={{ 
                width: size === 'tiny' ? '14px' : size === 'small' ? '18px' : size === 'medium' ? '24px' : '32px',
                height: size === 'tiny' ? '14px' : size === 'small' ? '18px' : size === 'medium' ? '24px' : '32px',
                fontSize: size === 'tiny' ? '8px' : size === 'small' ? '10px' : size === 'medium' ? '12px' : '16px',
              }}>
              {card.resistance}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// Large preview for hover/modal
export function CardPreview({ card }: { card: CardData }) {
  return (
    <div className="transform scale-100">
      <Card card={card} size="large" />
    </div>
  );
}
