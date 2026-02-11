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

// Culture symbols and colors matching original TCG
const cultureStyles: Record<string, { symbol: string; borderColor: string; accentColor: string }> = {
  Shire: { symbol: '🏠', borderColor: '#5D7A4A', accentColor: '#8FBC8F' },
  Elven: { symbol: '✧', borderColor: '#4A6B8A', accentColor: '#87CEEB' },
  Gandalf: { symbol: '⚡', borderColor: '#6B6B7A', accentColor: '#B0C4DE' },
  Gondor: { symbol: '🌳', borderColor: '#7A7A6B', accentColor: '#D4D4C4' },
  Rohan: { symbol: '🐴', borderColor: '#8A7A4A', accentColor: '#DAA520' },
  Dwarven: { symbol: '⚒️', borderColor: '#8A6A4A', accentColor: '#CD853F' },
  Ringwraith: { symbol: '👁️', borderColor: '#4A3A5A', accentColor: '#9370DB' },
  Sauron: { symbol: '🔥', borderColor: '#6A3A3A', accentColor: '#CD5C5C' },
  Moria: { symbol: '⛏️', borderColor: '#5A4A3A', accentColor: '#8B7355' },
  Isengard: { symbol: '⚙️', borderColor: '#4A4A4A', accentColor: '#778899' },
  Dunland: { symbol: '🔥', borderColor: '#6A4A3A', accentColor: '#D2691E' },
  Site: { symbol: '🗺️', borderColor: '#5A5A4A', accentColor: '#BDB76B' },
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

  // Card dimensions (2.5 x 3.5 ratio)
  const sizes = {
    micro: { w: 45, h: 63, border: 2, title: 6, text: 5, art: 28 },
    tiny: { w: 70, h: 98, border: 3, title: 8, text: 6, art: 45 },
    small: { w: 110, h: 154, border: 4, title: 10, text: 8, art: 70 },
    medium: { w: 160, h: 224, border: 5, title: 12, text: 9, art: 105 },
    large: { w: 250, h: 350, border: 6, title: 16, text: 11, art: 165 },
  };
  const s = sizes[size];

  // Card back (face down)
  if (faceDown) {
    return (
      <div
        className={`relative cursor-pointer ${className}`}
        style={{ width: s.w, height: s.h }}
        onClick={onClick}
      >
        {/* Ornate card back */}
        <div className="absolute inset-0 rounded-lg overflow-hidden"
          style={{ 
            background: 'linear-gradient(135deg, #2A1F10 0%, #4A3520 50%, #2A1F10 100%)',
            border: `${s.border}px solid #6A5030`,
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5), 0 4px 8px rgba(0,0,0,0.3)'
          }}>
          {/* Decorative pattern */}
          <div className="absolute inset-2 rounded border opacity-30" style={{ borderColor: '#C0A060' }} />
          <div className="absolute inset-4 rounded border opacity-20" style={{ borderColor: '#C0A060' }} />
          
          {/* Center emblem */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center" style={{ color: '#C0A060' }}>
              <div style={{ fontSize: s.art * 0.4 }}>💍</div>
              {size !== 'micro' && size !== 'tiny' && (
                <div style={{ fontSize: s.title * 0.8, fontFamily: 'serif' }}>Middle-earth</div>
              )}
            </div>
          </div>
          
          {/* Corner decorations */}
          {size !== 'micro' && (
            <>
              <div className="absolute top-1 left-1" style={{ color: '#C0A060', fontSize: s.title }}>❧</div>
              <div className="absolute top-1 right-1" style={{ color: '#C0A060', fontSize: s.title, transform: 'scaleX(-1)' }}>❧</div>
              <div className="absolute bottom-1 left-1" style={{ color: '#C0A060', fontSize: s.title, transform: 'scaleY(-1)' }}>❧</div>
              <div className="absolute bottom-1 right-1" style={{ color: '#C0A060', fontSize: s.title, transform: 'scale(-1)' }}>❧</div>
            </>
          )}
        </div>
      </div>
    );
  }

  const hasImage = card.image_url && !imageError;

  return (
    <div
      className={`relative cursor-pointer transition-all duration-200 ${className}`}
      style={{ 
        width: s.w, 
        height: s.h,
        transform: selected ? 'translateY(-4px)' : 'none',
        filter: selected ? 'brightness(1.1)' : playable ? 'brightness(1.05)' : 'none',
      }}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      {/* Main card frame - ornate wood/gold style */}
      <div className="absolute inset-0 rounded-lg overflow-hidden"
        style={{ 
          background: `linear-gradient(180deg, #3A2810 0%, #2A1A08 100%)`,
          border: `${s.border}px solid ${style.borderColor}`,
          boxShadow: selected 
            ? `0 0 12px ${style.accentColor}, 0 4px 12px rgba(0,0,0,0.4)` 
            : playable 
              ? `0 0 8px rgba(100,200,100,0.5), 0 4px 8px rgba(0,0,0,0.3)`
              : '0 4px 8px rgba(0,0,0,0.3)'
        }}>
        
        {/* Inner gold border */}
        <div className="absolute inset-0.5 rounded-md" style={{ border: `1px solid rgba(192,160,96,0.3)` }} />
        
        {/* Title bar */}
        <div className="relative px-1 py-0.5 text-center"
          style={{ 
            background: 'linear-gradient(180deg, #4A3820 0%, #3A2810 100%)',
            borderBottom: '1px solid #6A5030',
            minHeight: s.title * 1.5
          }}>
          {/* Culture symbol + cost */}
          <div className="absolute left-0.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5"
            style={{ color: style.accentColor, fontSize: s.title * 0.9 }}>
            <span>{style.symbol}</span>
          </div>
          
          {/* Twilight cost */}
          <div className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full flex items-center justify-center font-bold"
            style={{ 
              width: s.title * 1.4, 
              height: s.title * 1.4, 
              background: 'linear-gradient(135deg, #3A2860 0%, #2A1850 100%)',
              border: '1px solid #6A58A0',
              color: '#C0B0E0',
              fontSize: s.title * 0.9
            }}>
            {card.twilight_cost}
          </div>
          
          {/* Card name */}
          <div className="truncate px-4" style={{ 
            color: '#E8D8B8', 
            fontSize: s.title,
            fontFamily: 'Georgia, serif',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
          }}>
            {card.is_unique && <span style={{ color: '#FFD700' }}>◆</span>}
            {card.name}
          </div>
        </div>

        {/* Art area */}
        <div className="relative mx-1" style={{ height: s.art, marginTop: 2 }}>
          <div className="absolute inset-0 rounded overflow-hidden"
            style={{ 
              background: hasImage ? '#1A1A1A' : `linear-gradient(135deg, ${style.borderColor}40 0%, ${style.borderColor}20 100%)`,
              border: '2px solid #4A3820'
            }}>
            {hasImage ? (
              <Image
                src={card.image_url!}
                alt={card.name}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              // Placeholder art
              <div className="absolute inset-0 flex items-center justify-center">
                <span style={{ fontSize: s.art * 0.5, opacity: 0.6 }}>{style.symbol}</span>
              </div>
            )}
          </div>
        </div>

        {/* Type line */}
        {size !== 'micro' && (
          <div className="mx-1 mt-1 px-1 text-center truncate"
            style={{ 
              background: 'linear-gradient(90deg, transparent 0%, rgba(192,160,96,0.2) 50%, transparent 100%)',
              color: '#C0A080',
              fontSize: s.text,
              fontStyle: 'italic'
            }}>
            {card.type_name}
          </div>
        )}

        {/* Text box - parchment style */}
        <div className="absolute bottom-1 left-1 right-1 rounded overflow-hidden"
          style={{ 
            background: 'linear-gradient(180deg, #E8DCC8 0%, #D8CCAC 100%)',
            border: '1px solid #A08860',
            minHeight: size === 'micro' ? s.h * 0.15 : size === 'tiny' ? s.h * 0.2 : s.h * 0.25,
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
          }}>
          
          {/* Stats for characters */}
          {(card.strength || card.vitality) && (
            <div className="absolute bottom-0 right-0 flex gap-0.5 p-0.5">
              {card.strength && (
                <div className="rounded flex items-center justify-center font-bold"
                  style={{ 
                    width: s.title * 1.2, 
                    height: s.title * 1.2,
                    background: 'linear-gradient(135deg, #8B0000 0%, #5B0000 100%)',
                    color: 'white',
                    fontSize: s.text,
                    border: '1px solid #A02020'
                  }}>
                  {card.strength}
                </div>
              )}
              {card.vitality && (
                <div className="rounded flex items-center justify-center font-bold"
                  style={{ 
                    width: s.title * 1.2, 
                    height: s.title * 1.2,
                    background: 'linear-gradient(135deg, #006400 0%, #004000 100%)',
                    color: 'white',
                    fontSize: s.text,
                    border: '1px solid #208020'
                  }}>
                  {card.vitality}
                </div>
              )}
            </div>
          )}
          
          {/* Resistance for Ring-bearer */}
          {card.resistance && (
            <div className="absolute top-0 right-0 p-0.5">
              <div className="rounded-full flex items-center justify-center font-bold"
                style={{ 
                  width: s.title * 1.3, 
                  height: s.title * 1.3,
                  background: 'linear-gradient(135deg, #FFD700 0%, #B8860B 100%)',
                  color: '#2A1A00',
                  fontSize: s.text,
                  border: '1px solid #DAA520'
                }}>
                {card.resistance}
              </div>
            </div>
          )}

          {/* Game text */}
          {size !== 'micro' && size !== 'tiny' && card.game_text && (
            <div className="p-1 pr-8" style={{ 
              color: '#2A2010',
              fontSize: s.text * 0.9,
              lineHeight: 1.2,
              maxHeight: s.h * 0.18,
              overflow: 'hidden'
            }}>
              {card.game_text.slice(0, size === 'small' ? 60 : 120)}
              {card.game_text.length > (size === 'small' ? 60 : 120) && '...'}
            </div>
          )}
        </div>

        {/* Corner decorations */}
        {size !== 'micro' && size !== 'tiny' && (
          <>
            <div className="absolute top-0 left-0 opacity-50" style={{ color: '#C0A060', fontSize: s.title * 0.7 }}>┌</div>
            <div className="absolute top-0 right-0 opacity-50" style={{ color: '#C0A060', fontSize: s.title * 0.7 }}>┐</div>
          </>
        )}
      </div>

      {/* Selection/playable glow */}
      {(selected || playable) && (
        <div className="absolute -inset-1 rounded-xl pointer-events-none"
          style={{ 
            border: `2px solid ${selected ? style.accentColor : '#50A050'}`,
            boxShadow: `0 0 10px ${selected ? style.accentColor : 'rgba(80,160,80,0.5)'}`,
            opacity: 0.8
          }} />
      )}
    </div>
  );
}

// Large preview card for hover
export function CardPreview({ card }: { card: CardData }) {
  return (
    <div className="bg-black/90 p-3 rounded-xl shadow-2xl border border-amber-900/50">
      <Card card={card} size="large" />
    </div>
  );
}
