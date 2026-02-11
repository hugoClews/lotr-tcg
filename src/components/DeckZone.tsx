'use client';

import { useState } from 'react';
import { CardData, CardPreview } from './Card';

interface DeckZoneProps {
  label: string;
  count: number;
  type: 'deck' | 'discard' | 'dead';
  cards?: CardData[];
  onDraw?: () => void;
  onClick?: () => void;
}

export default function DeckZone({
  label,
  count,
  type,
  cards = [],
  onDraw,
  onClick,
}: DeckZoneProps) {
  const [showPile, setShowPile] = useState(false);
  const [previewCard, setPreviewCard] = useState<CardData | null>(null);

  const typeStyles = {
    deck: {
      bg: 'bg-gradient-to-br from-amber-800 to-amber-950',
      border: 'border-amber-600',
      icon: '📚',
    },
    discard: {
      bg: 'bg-gradient-to-br from-slate-700 to-slate-900',
      border: 'border-slate-500',
      icon: '🗑️',
    },
    dead: {
      bg: 'bg-gradient-to-br from-red-900 to-red-950',
      border: 'border-red-700',
      icon: '💀',
    },
  };

  const style = typeStyles[type];

  return (
    <>
      <button
        onClick={() => {
          if (type === 'deck' && onDraw) {
            onDraw();
          } else if (cards.length > 0) {
            setShowPile(true);
          }
          onClick?.();
        }}
        className={`
          relative w-14 h-20 rounded-lg border-2 
          ${style.bg} ${style.border}
          flex flex-col items-center justify-center
          hover:scale-105 transition-transform
          ${cards.length > 0 || type === 'deck' ? 'cursor-pointer' : 'cursor-default opacity-50'}
        `}
      >
        {/* Stacked card effect for deck */}
        {type === 'deck' && count > 0 && (
          <>
            <div className={`absolute inset-0 ${style.bg} ${style.border} border-2 rounded-lg -translate-y-1 -translate-x-0.5`} />
            <div className={`absolute inset-0 ${style.bg} ${style.border} border-2 rounded-lg -translate-y-2 -translate-x-1`} />
          </>
        )}
        
        {/* Main card face */}
        <div className="relative z-10 flex flex-col items-center">
          <span className="text-xl">{style.icon}</span>
          <span className="text-xs font-bold">{count}</span>
        </div>

        {/* Label */}
        <span className="absolute -bottom-5 text-[10px] text-slate-400">{label}</span>

        {/* Top card preview for discard/dead */}
        {(type === 'discard' || type === 'dead') && cards.length > 0 && (
          <div 
            className="absolute inset-0 rounded-lg overflow-hidden"
            onMouseEnter={() => setPreviewCard(cards[cards.length - 1])}
            onMouseLeave={() => setPreviewCard(null)}
          >
            {/* Show faded top card */}
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-lg">{style.icon}</span>
            </div>
          </div>
        )}
      </button>

      {/* Preview popup */}
      {previewCard && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
          <CardPreview card={previewCard} />
        </div>
      )}

      {/* Pile viewer modal */}
      {showPile && cards.length > 0 && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8"
          onClick={() => setShowPile(false)}
        >
          <div 
            className="bg-slate-800 rounded-xl p-6 max-w-4xl max-h-[80vh] overflow-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{label} ({cards.length} cards)</h3>
              <button 
                onClick={() => setShowPile(false)}
                className="text-slate-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
              {cards.map((card, index) => (
                <div 
                  key={`${card.id}-${index}`}
                  className="text-center"
                  onMouseEnter={() => setPreviewCard(card)}
                  onMouseLeave={() => setPreviewCard(null)}
                >
                  <div className="w-16 h-24 bg-slate-700 rounded-lg flex items-center justify-center text-2xl mb-1">
                    {card.culture_name === 'Shire' && '🏠'}
                    {card.culture_name === 'Elven' && '🌿'}
                    {card.culture_name === 'Gandalf' && '🌟'}
                    {card.culture_name === 'Gondor' && '🌳'}
                    {card.culture_name === 'Dwarven' && '⚒️'}
                    {card.culture_name === 'Rohan' && '🐎'}
                    {!['Shire', 'Elven', 'Gandalf', 'Gondor', 'Dwarven', 'Rohan'].includes(card.culture_name || '') && '👁️'}
                  </div>
                  <span className="text-xs truncate block">{card.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
