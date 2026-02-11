'use client';

import { useState, useCallback } from 'react';
import Card, { CardData, CardPreview } from './Card';
import TwilightPool from './TwilightPool';
import PhaseIndicator from './PhaseIndicator';

export type GamePhase = 'fellowship' | 'shadow' | 'maneuver' | 'archery' | 'assignment' | 'skirmish' | 'regroup';

export interface GameState {
  currentPhase: GamePhase;
  turnNumber: number;
  activePlayer: 'fellowship' | 'shadow';
  twilightPool: number;
  currentSite: number;
  fellowshipPlayer: { hand: CardData[]; characters: CardData[]; support: CardData[]; deck: number; discard: CardData[]; dead: CardData[]; };
  shadowPlayer: { hand: CardData[]; minions: CardData[]; support: CardData[]; deck: number; discard: CardData[]; };
  sites: CardData[];
}

interface GameBoardProps { initialState?: Partial<GameState>; }

const defaultState: GameState = {
  currentPhase: 'fellowship', turnNumber: 1, activePlayer: 'fellowship', twilightPool: 0, currentSite: 1,
  fellowshipPlayer: { hand: [], characters: [], support: [], deck: 30, discard: [], dead: [] },
  shadowPlayer: { hand: [], minions: [], support: [], deck: 30, discard: [] },
  sites: [],
};

export default function GameBoard({ initialState }: GameBoardProps) {
  const [gameState, setGameState] = useState<GameState>({ ...defaultState, ...initialState });
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [previewCard, setPreviewCard] = useState<CardData | null>(null);
  const [gameLog, setGameLog] = useState<string[]>(['Game started.']);

  const addLog = useCallback((msg: string) => setGameLog(p => [...p, `[Turn ${gameState.turnNumber}] ${msg}`]), [gameState.turnNumber]);
  const handlePhaseChange = (phase: GamePhase) => { setGameState(p => ({ ...p, currentPhase: phase })); addLog(`Phase: ${phase}`); };

  const advancePhase = () => {
    const phases: GamePhase[] = ['fellowship', 'shadow', 'maneuver', 'archery', 'assignment', 'skirmish', 'regroup'];
    const idx = phases.indexOf(gameState.currentPhase);
    const next = (idx + 1) % phases.length;
    if (next === 0) { setGameState(p => ({ ...p, currentPhase: phases[0], turnNumber: p.turnNumber + 1 })); addLog('New turn'); }
    else handlePhaseChange(phases[next]);
  };

  const handleTwilightChange = (d: number) => setGameState(p => ({ ...p, twilightPool: Math.max(0, p.twilightPool + d) }));
  const handleSiteMove = (n: number) => { setGameState(p => ({ ...p, currentSite: n, twilightPool: p.twilightPool + 3 })); addLog(`Moved to site ${n}`); };

  const playCard = (card: CardData) => {
    setGameState(p => ({
      ...p,
      fellowshipPlayer: {
        ...p.fellowshipPlayer,
        hand: p.fellowshipPlayer.hand.filter(c => c.id !== card.id),
        characters: card.type_name?.includes('Companion') ? [...p.fellowshipPlayer.characters, card] : p.fellowshipPlayer.characters,
      },
      twilightPool: p.twilightPool + card.twilight_cost,
    }));
    addLog(`Played ${card.name}`);
    setSelectedCard(null);
  };

  const canPlay = (c: CardData) => gameState.currentPhase === 'fellowship' && ['Shire', 'Gandalf', 'Elven', 'Dwarven', 'Gondor', 'Rohan'].includes(c.culture_name || '');

  // Balanced grid: header, shadow 25%, sites 15%, fellowship 30%, hand compact
  return (
    <div className="h-screen w-screen overflow-hidden grid text-white" style={{ 
      gridTemplateRows: '50px 25% 15% 30% auto',
      background: 'linear-gradient(180deg, #2D2438 0%, #1E2A38 40%, #2A3830 100%)'
    }}>
      {previewCard && <div className="fixed top-1/2 right-4 -translate-y-1/2 z-50"><CardPreview card={previewCard} /></div>}

      {/* ROW 1: Header - richer colors */}
      <div className="flex items-center justify-between px-4" style={{ 
        background: 'linear-gradient(90deg, #3D2850 0%, #2A3848 50%, #3D2850 100%)',
        borderBottom: '2px solid #5A4870'
      }}>
        <div className="flex items-center gap-4">
          <div className="text-center px-3 py-1 rounded-lg" style={{ background: 'rgba(255,215,0,0.15)', border: '1px solid rgba(255,215,0,0.3)' }}>
            <div className="text-[10px] text-amber-300/70">Turn</div>
            <div className="text-2xl font-bold text-amber-300">{gameState.turnNumber}</div>
          </div>
          <PhaseIndicator currentPhase={gameState.currentPhase} onPhaseClick={handlePhaseChange} />
        </div>
        <TwilightPool count={gameState.twilightPool} onChange={handleTwilightChange} />
        <button onClick={advancePhase} className="px-5 py-2 rounded-lg font-bold text-sm transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #D4A855 0%, #B8860B 100%)', color: '#2A1F00', boxShadow: '0 2px 8px rgba(212,168,85,0.4)' }}>
          Pass →
        </button>
      </div>

      {/* ROW 2: Shadow Zone - darker, more menacing */}
      <div className="m-2 rounded-xl overflow-hidden" style={{ 
        background: 'linear-gradient(180deg, #3A2845 0%, #2D1F38 100%)',
        border: '2px solid #5A3870',
        boxShadow: 'inset 0 0 30px rgba(90,56,112,0.3)'
      }}>
        <div className="flex justify-between items-center px-4 py-2" style={{ background: 'rgba(90,56,112,0.3)', borderBottom: '1px solid #5A3870' }}>
          <h3 className="font-bold text-sm text-purple-300 flex items-center gap-2">
            <span className="text-lg">👁️</span> Shadow Forces
          </h3>
          <div className="flex gap-3 text-xs text-purple-300/70">
            <span>Deck: {gameState.shadowPlayer.deck}</span>
            <span>Discard: {gameState.shadowPlayer.discard.length}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 p-3 h-[calc(100%-40px)]">
          <div className="flex-1 flex justify-center gap-2">
            {gameState.shadowPlayer.minions.length === 0 ? 
              <span className="text-purple-400/50 italic">No minions in play</span> :
              gameState.shadowPlayer.minions.map(m => (
                <div key={m.id} className="hover:scale-105 transition-transform" onMouseEnter={() => setPreviewCard(m)} onMouseLeave={() => setPreviewCard(null)}>
                  <Card card={m} size="small" />
                </div>
              ))}
          </div>
          <div className="flex -space-x-4">
            {Array.from({ length: gameState.shadowPlayer.hand.length || 5 }).map((_, i) => (
              <div key={i} className="hover:-translate-y-1 transition-transform" style={{ transform: `rotate(${(i - 2) * 5}deg)` }}>
                <Card card={{ id: -i, name: '', twilight_cost: 0 }} size="tiny" faceDown />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROW 3: Site Path - the journey */}
      <div className="mx-2 rounded-xl flex items-center justify-center gap-2 px-4" style={{ 
        background: 'linear-gradient(90deg, #2A4030 0%, #3A4838 25%, #384858 50%, #483838 75%, #4A3030 100%)',
        border: '2px solid #5A6850',
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3)'
      }}>
        {/* Golden path line */}
        <div className="absolute left-1/4 right-1/4 h-1 rounded-full" style={{ background: 'linear-gradient(90deg, #6A8060 0%, #607890 50%, #806050 100%)', opacity: 0.4 }} />
        
        {[1,2,3,4,5,6,7,8,9].map(n => {
          const isCurrent = n === gameState.currentSite;
          const isPassed = n < gameState.currentSite;
          // Regional colors: Shire green → Misty blue → Mordor red-brown
          const regionBg = n <= 3 ? 'linear-gradient(135deg, #4A6848 0%, #3A5838 100%)' : 
                          n <= 6 ? 'linear-gradient(135deg, #485868 0%, #384858 100%)' : 
                                   'linear-gradient(135deg, #685048 0%, #583830 100%)';
          const regionBorder = n <= 3 ? '#6A8860' : n <= 6 ? '#607890' : '#906050';
          
          return (
            <button key={n} onClick={() => n === gameState.currentSite + 1 && handleSiteMove(n)} 
              disabled={n !== gameState.currentSite + 1}
              className={`relative flex flex-col items-center transition-all duration-300 ${isCurrent ? 'scale-125 z-10' : isPassed ? 'opacity-60 scale-95' : 'opacity-80 hover:opacity-100'}`}>
              <div className={`w-12 h-14 rounded-lg flex flex-col items-center justify-center transition-all`}
                style={{ 
                  background: regionBg, 
                  border: `2px solid ${isCurrent ? '#FFD700' : regionBorder}`,
                  boxShadow: isCurrent ? '0 0 15px rgba(255,215,0,0.5), inset 0 0 10px rgba(255,215,0,0.2)' : 'none'
                }}>
                <span className={`text-lg font-bold ${isCurrent ? 'text-yellow-300' : 'text-white/80'}`}>{n}</span>
                {isCurrent && <span className="text-xs">🚶</span>}
                {isPassed && <span className="text-xs text-green-400">✓</span>}
              </div>
              <span className={`text-[9px] mt-1 ${isCurrent ? 'text-yellow-300 font-bold' : 'text-white/60'}`}>
                {['Bag End', 'E.Road', 'Weather', 'Rivend', 'Moria', 'Lórien', 'A.Hen', 'Fangorn', 'Doom'][n-1]}
              </span>
            </button>
          );
        })}
      </div>

      {/* ROW 4: Fellowship - your heroes, warm and inviting */}
      <div className="m-2 rounded-xl overflow-hidden" style={{ 
        background: 'linear-gradient(180deg, #2A4035 0%, #1E3028 100%)',
        border: '2px solid #4A7050',
        boxShadow: 'inset 0 0 30px rgba(74,112,80,0.2)'
      }}>
        <div className="flex justify-between items-center px-4 py-2" style={{ background: 'rgba(74,112,80,0.3)', borderBottom: '1px solid #4A7050' }}>
          <h3 className="font-bold text-sm text-emerald-300 flex items-center gap-2">
            <span className="text-lg">🛡️</span> Your Fellowship
          </h3>
          <div className="flex gap-3 text-xs text-emerald-300/70">
            <span>Deck: {gameState.fellowshipPlayer.deck}</span>
            <span>Discard: {gameState.fellowshipPlayer.discard.length}</span>
          </div>
        </div>
        <div className="flex justify-center items-center gap-3 p-3 h-[calc(100%-40px)]">
          {gameState.fellowshipPlayer.characters.length === 0 ? 
            <span className="text-emerald-400/50 italic">No companions in play</span> :
            gameState.fellowshipPlayer.characters.map(c => (
              <div key={c.id} className="relative hover:scale-105 transition-transform" onMouseEnter={() => setPreviewCard(c)} onMouseLeave={() => setPreviewCard(null)}>
                <Card card={c} size="small" onClick={() => setSelectedCard(selectedCard?.id === c.id ? null : c)} selected={selectedCard?.id === c.id} />
                {c.type_name?.includes('Ring-bearer') && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-bold"
                    style={{ background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', color: '#2A1F00', boxShadow: '0 0 8px rgba(255,215,0,0.5)' }}>
                    💍 Ring-bearer
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* ROW 5: Hand - compact but styled */}
      <div className="mx-2 mb-2 rounded-xl flex items-center gap-4 px-4 py-2" style={{ 
        background: 'linear-gradient(180deg, #382830 0%, #2A2028 100%)',
        border: '2px solid #5A4050',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.3)'
      }}>
        <div className="shrink-0">
          <h3 className="font-bold text-sm text-rose-300 flex items-center gap-2">
            <span>🃏</span> Hand
          </h3>
          <p className="text-[10px] text-rose-300/60">{gameState.fellowshipPlayer.hand.length} cards</p>
        </div>
        
        <div className="flex-1 flex justify-center gap-1 overflow-x-auto py-1">
          {gameState.fellowshipPlayer.hand.length === 0 ? 
            <span className="text-rose-400/50 italic">No cards in hand</span> :
            gameState.fellowshipPlayer.hand.map((card, i) => (
              <div key={card.id} 
                className="transition-all duration-200 hover:-translate-y-3 hover:z-50 cursor-pointer"
                style={{ transform: `rotate(${(i - (gameState.fellowshipPlayer.hand.length - 1) / 2) * 4}deg)` }}
                onMouseEnter={() => setPreviewCard(card)} onMouseLeave={() => setPreviewCard(null)}>
                <Card card={card} size="tiny" onClick={() => setSelectedCard(selectedCard?.id === card.id ? null : card)}
                  onDoubleClick={() => canPlay(card) && playCard(card)} selected={selectedCard?.id === card.id} playable={canPlay(card)} />
              </div>
            ))}
        </div>
        
        <div className="shrink-0 flex gap-2">
          {selectedCard && canPlay(selectedCard) && (
            <button onClick={() => playCard(selectedCard)} className="px-3 py-2 rounded-lg text-xs font-bold transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #50A060 0%, #408050 100%)', boxShadow: '0 2px 8px rgba(80,160,96,0.4)' }}>
              Play {selectedCard.name.slice(0, 10)}
            </button>
          )}
          <button className="px-3 py-2 rounded-lg text-xs font-bold transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #5080A0 0%, #406080 100%)', boxShadow: '0 2px 8px rgba(80,128,160,0.4)' }}>
            Ability
          </button>
          <button onClick={() => gameState.currentSite < 9 && handleSiteMove(gameState.currentSite + 1)}
            disabled={gameState.currentPhase !== 'regroup'}
            className="px-3 py-2 rounded-lg text-xs font-bold transition-all hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
            style={{ background: 'linear-gradient(135deg, #D4A855 0%, #B8860B 100%)', color: '#2A1F00', boxShadow: '0 2px 8px rgba(212,168,85,0.4)' }}>
            Move →
          </button>
        </div>
      </div>
    </div>
  );
}
