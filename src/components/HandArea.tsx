'use client';

import { useState } from 'react';
import Card, { CardData } from './Card';
import { GamePhase } from './GameBoard';

interface HandAreaProps {
  cards: CardData[];
  onCardClick?: (card: CardData) => void;
  onCardHover?: (card: CardData | null) => void;
  selectedCard?: CardData | null;
  currentPhase: GamePhase;
  maxHandSize?: number;
}

// Sample hand for demo
const sampleHand: CardData[] = [
  {
    id: 201,
    name: 'The One Ring',
    culture_name: 'Shire',
    type_name: 'The One Ring',
    twilight_cost: 0,
    is_unique: true,
    game_text: 'Response: If bearer is about to take a wound, he wears The One Ring until the regroup phase.',
  },
  {
    id: 202,
    name: 'Sting',
    culture_name: 'Shire',
    type_name: 'Possession • Hand Weapon',
    twilight_cost: 1,
    is_unique: true,
    game_text: 'Bearer must be a Hobbit. Bearer is strength +2. Response: If bearer is about to take a wound, discard Sting to prevent that wound.',
    keywords: ['Hand Weapon'],
  },
  {
    id: 203,
    name: 'Gandalf\'s Staff',
    culture_name: 'Gandalf',
    type_name: 'Artifact • Staff',
    twilight_cost: 2,
    is_unique: true,
    game_text: 'Bearer must be Gandalf. Fellowship: Exert Gandalf to remove (2).',
    keywords: ['Staff'],
  },
  {
    id: 204,
    name: 'The Gaffer',
    culture_name: 'Shire',
    type_name: 'Ally • Hobbit',
    twilight_cost: 1,
    strength: 2,
    vitality: 2,
    is_unique: true,
    game_text: 'To play, spot a Hobbit. Fellowship: Exert The Gaffer to heal a Hobbit companion.',
    keywords: ['Hobbit'],
  },
  {
    id: 205,
    name: 'Elrond\'s Council',
    culture_name: 'Elven',
    type_name: 'Event',
    twilight_cost: 0,
    game_text: 'Fellowship: Play to heal an Elf companion. That companion is strength +1 until the regroup phase.',
  },
  {
    id: 206,
    name: 'Frying Pan',
    culture_name: 'Shire',
    type_name: 'Possession • Hand Weapon',
    twilight_cost: 0,
    game_text: 'Bearer must be Sam. Bearer is strength +2.',
    keywords: ['Hand Weapon'],
  },
];

export default function HandArea({
  cards,
  onCardClick,
  onCardHover,
  selectedCard,
  currentPhase,
  maxHandSize = 8,
}: HandAreaProps) {
  const [expanded, setExpanded] = useState(true);
  const displayCards = cards.length > 0 ? cards : sampleHand;

  // Determine which cards are playable based on phase
  const canPlayCard = (card: CardData) => {
    if (currentPhase === 'fellowship') {
      // Can play Free Peoples cards during fellowship phase
      const fpCultures = ['Shire', 'Gandalf', 'Elven', 'Dwarven', 'Gondor', 'Rohan'];
      return fpCultures.includes(card.culture_name || '');
    }
    if (currentPhase === 'shadow') {
      // Shadow phase - typically not your turn
      return false;
    }
    return false;
  };

  return (
    <div className="fixed bottom-16 left-0 right-0 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Hand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-700 hover:bg-slate-600 px-4 py-1 rounded-t-lg text-sm transition-colors"
        >
          {expanded ? '▼ Hide Hand' : '▲ Show Hand'} ({displayCards.length}/{maxHandSize})
        </button>

        {/* Hand area */}
        {expanded && (
          <div className="bg-slate-800/90 backdrop-blur rounded-t-xl p-4 border-t border-x border-slate-600">
            <div className="flex justify-center items-end gap-2 overflow-x-auto pb-2">
              {displayCards.map((card, index) => {
                const isPlayable = canPlayCard(card);
                const fanAngle = (index - (displayCards.length - 1) / 2) * 3;
                const fanOffset = Math.abs(index - (displayCards.length - 1) / 2) * 5;

                return (
                  <div
                    key={card.id}
                    className="transition-transform duration-200 hover:-translate-y-4 hover:z-50"
                    style={{
                      transform: `rotate(${fanAngle}deg) translateY(${fanOffset}px)`,
                    }}
                    onMouseEnter={() => onCardHover?.(card)}
                    onMouseLeave={() => onCardHover?.(null)}
                  >
                    <Card
                      card={card}
                      size="medium"
                      onClick={() => onCardClick?.(card)}
                      selected={selectedCard?.id === card.id}
                      playable={isPlayable}
                    />
                  </div>
                );
              })}
            </div>

            {/* Hand size indicator */}
            {displayCards.length > maxHandSize && (
              <div className="text-center text-red-400 text-sm mt-2">
                ⚠️ Over hand limit! Discard {displayCards.length - maxHandSize} card(s) during Regroup.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
