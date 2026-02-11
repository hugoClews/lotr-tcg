'use client';

import Card, { CardData } from './Card';

interface CharacterAreaProps {
  characters: CardData[];
  side: 'fellowship' | 'shadow';
  onCardClick?: (card: CardData) => void;
  onCardHover?: (card: CardData | null) => void;
  selectedCard?: CardData | null;
}

// Sample characters for demo
const sampleFellowship: CardData[] = [
  {
    id: 1,
    name: 'Frodo',
    culture_name: 'Shire',
    type_name: 'Companion • Ring-bearer',
    twilight_cost: 0,
    strength: 3,
    vitality: 4,
    resistance: 10,
    is_unique: true,
    game_text: 'Ring-bearer. Resistance +2 while at a sanctuary site.',
    keywords: ['Hobbit'],
  },
  {
    id: 2,
    name: 'Aragorn',
    culture_name: 'Gondor',
    type_name: 'Companion',
    twilight_cost: 4,
    strength: 8,
    vitality: 4,
    is_unique: true,
    game_text: 'Ranger. While skirmishing a Nazgûl, Aragorn is strength +2.',
    keywords: ['Ranger', 'Man'],
  },
  {
    id: 3,
    name: 'Legolas',
    culture_name: 'Elven',
    type_name: 'Companion',
    twilight_cost: 4,
    strength: 6,
    vitality: 3,
    is_unique: true,
    game_text: 'Archer. Archery phase: Exert Legolas to wound a minion.',
    keywords: ['Archer', 'Elf'],
  },
  {
    id: 4,
    name: 'Gimli',
    culture_name: 'Dwarven',
    type_name: 'Companion',
    twilight_cost: 2,
    strength: 6,
    vitality: 3,
    is_unique: true,
    game_text: 'Damage +1. Gimli is strength +2 while skirmishing an Orc.',
    keywords: ['Dwarf'],
  },
];

const sampleMinions: CardData[] = [
  {
    id: 101,
    name: 'Úlairë Enquëa',
    culture_name: 'Ringwraith',
    type_name: 'Minion • Nazgûl',
    twilight_cost: 6,
    strength: 11,
    vitality: 4,
    is_unique: true,
    game_text: 'Fierce. When this minion wins a skirmish, wound the Ring-bearer.',
    keywords: ['Nazgûl'],
  },
  {
    id: 102,
    name: 'Moria Scout',
    culture_name: 'Moria',
    type_name: 'Minion • Orc',
    twilight_cost: 2,
    strength: 5,
    vitality: 1,
    game_text: 'When you play this minion, you may draw a card.',
    keywords: ['Orc'],
    wounds: 1,
  },
];

export default function CharacterArea({
  characters,
  side,
  onCardClick,
  onCardHover,
  selectedCard,
}: CharacterAreaProps) {
  const displayCharacters = characters.length > 0 
    ? characters 
    : (side === 'fellowship' ? sampleFellowship : sampleMinions);

  return (
    <div className="min-h-48 flex justify-center items-start gap-4 flex-wrap py-2">
      {displayCharacters.map((character, index) => (
        <div 
          key={character.id} 
          className="relative"
          onMouseEnter={() => onCardHover?.(character)}
          onMouseLeave={() => onCardHover?.(null)}
        >
          {/* Main character card */}
          <Card
            card={character}
            size="medium"
            onClick={() => onCardClick?.(character)}
            selected={selectedCard?.id === character.id}
            playable={false}
          />

          {/* Attached cards (possessions, conditions) */}
          {character.attached && character.attached.length > 0 && (
            <div className="absolute -bottom-4 left-2 flex -space-x-10">
              {character.attached.map((attached, attachIndex) => (
                <div 
                  key={attached.id}
                  style={{ transform: `translateY(${attachIndex * 8}px)` }}
                >
                  <Card
                    card={attached}
                    size="small"
                    onClick={() => onCardClick?.(attached)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Ring-bearer indicator */}
          {character.type_name?.includes('Ring-bearer') && (
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-xs px-2 py-0.5 rounded-full font-bold shadow-lg">
              💍 Ring-bearer
            </div>
          )}

          {/* Strength/Vitality badge */}
          <div className="absolute -bottom-2 right-0 flex gap-1">
            {character.exhausted && (
              <span className="bg-gray-600 text-white text-xs px-1 rounded">
                💤
              </span>
            )}
          </div>
        </div>
      ))}

      {/* Empty state */}
      {displayCharacters.length === 0 && (
        <div className="flex items-center justify-center w-full h-32 text-slate-500">
          {side === 'fellowship' 
            ? 'No companions in play' 
            : 'No minions in play'}
        </div>
      )}
    </div>
  );
}
