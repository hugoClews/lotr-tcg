'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import GameBoard from '@/components/GameBoard';
import Tutorial, { QuickReference } from '@/components/Tutorial';

// Separate component that uses searchParams
function HomeContent() {
  const searchParams = useSearchParams();
  const [showTutorial, setShowTutorial] = useState(true);
  const [showCompletionBanner, setShowCompletionBanner] = useState(false);

  useEffect(() => {
    if (searchParams.get('tutorialComplete') === 'true') {
      setShowCompletionBanner(true);
      setShowTutorial(false);
      // Hide banner after 5 seconds
      const timer = setTimeout(() => setShowCompletionBanner(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  // Sample game state with demo data
  const initialState = {
    currentPhase: 'fellowship' as const,
    turnNumber: 1,
    activePlayer: 'fellowship' as const,
    twilightPool: 4,
    currentSite: 3,
    fellowshipPlayer: {
      hand: [
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
          game_text: 'Bearer must be a Hobbit. Bearer is strength +2.',
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
          name: 'Elrond\'s Council',
          culture_name: 'Elven',
          type_name: 'Event',
          twilight_cost: 0,
          game_text: 'Fellowship: Play to heal an Elf companion.',
        },
        {
          id: 205,
          name: 'Boromir',
          culture_name: 'Gondor',
          type_name: 'Companion',
          twilight_cost: 3,
          strength: 7,
          vitality: 3,
          is_unique: true,
          game_text: 'Ranger. Defender +1.',
          keywords: ['Ranger', 'Man'],
        },
      ],
      characters: [
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
          image_url: '/cards/characters/frodo.jpg',
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
          image_url: '/cards/characters/aragorn.jpg',
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
          image_url: '/cards/characters/legolas.jpg',
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
          image_url: '/cards/characters/gimli.jpg',
        },
      ],
      support: [],
      deck: 28,
      discard: [],
      dead: [],
    },
    shadowPlayer: {
      hand: Array(6).fill(null).map((_, i) => ({ id: -i, name: '', twilight_cost: 0 })),
      minions: [
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
          image_url: '/cards/characters/nazgul.jpg',
        },
        {
          id: 102,
          name: 'Cave Troll',
          culture_name: 'Moria',
          type_name: 'Minion • Troll',
          twilight_cost: 6,
          strength: 10,
          vitality: 3,
          game_text: 'Fierce. Damage +1.',
          keywords: ['Troll'],
          image_url: '/cards/characters/cave-troll.jpg',
        },
      ],
      support: [],
      deck: 32,
      discard: [],
    },
    sites: [],
  };

  return (
    <main className="relative">
      {/* Tutorial Completion Banner */}
      {showCompletionBanner && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top duration-500">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-4">
            <span className="text-3xl">🎉</span>
            <div>
              <h3 className="font-bold text-lg">Tutorial Complete!</h3>
              <p className="text-green-100 text-sm">You've mastered the basics. Now go destroy that Ring!</p>
            </div>
            <button 
              onClick={() => setShowCompletionBanner(false)}
              className="ml-4 text-green-200 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Play Tutorial Button - Fixed position */}
      <Link href="/tutorial">
        <button className="fixed top-4 left-4 z-40 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black px-6 py-3 rounded-xl font-bold shadow-lg transition-all hover:scale-105 flex items-center gap-2 group">
          <span className="text-xl group-hover:animate-bounce">🎮</span>
          <span>Play Tutorial</span>
        </button>
      </Link>

      {showTutorial && <Tutorial onClose={() => setShowTutorial(false)} />}
      <QuickReference />
      <GameBoard initialState={initialState} />
    </main>
  );
}

// Main export wrapped in Suspense
export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
