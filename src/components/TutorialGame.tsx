'use client';

import { useState, useEffect, useRef } from 'react';
import Card, { CardData } from './Card';
import { GamePhase } from './GameBoard';

const tutorialSteps = [
  { id: 'welcome', title: 'Welcome! 🧙‍♂️', message: "Learn the basics. Click Continue!", highlight: '' },
  { id: 'hand', title: 'Your Hand', message: "Cards you can play.", highlight: 'hand' },
  { id: 'phase', title: 'Fellowship Phase', message: "Play cards now!", highlight: 'phase' },
  { id: 'select', title: 'Select Boromir', message: "Click Boromir.", highlight: 'boromir', wait: 'boromir' },
  { id: 'play', title: 'Play Card', message: "Click Play button.", highlight: 'play', wait: 'play' },
  { id: 'twilight', title: 'Twilight ◆', message: "Opponent uses this!", highlight: 'twilight' },
  { id: 'pass1', title: 'Pass', message: "End your phase.", highlight: 'pass', wait: 'pass' },
  { id: 'shadow', title: 'Shadow Phase', message: "Opponent's turn...", highlight: 'phase', action: 'shadow' },
  { id: 'minion', title: 'Enemy!', message: "Orc appeared!", highlight: 'minions' },
  { id: 'pass2', title: 'Combat', message: "Click Pass.", highlight: 'pass', wait: 'pass' },
  { id: 'fight', title: 'Skirmish!', message: "Aragorn vs Orc!", highlight: 'chars', action: 'fight' },
  { id: 'win', title: 'Victory!', message: "Orc defeated!", highlight: '' },
  { id: 'move', title: 'Move', message: "Advance forward.", highlight: 'move', wait: 'move' },
  { id: 'done', title: 'Done! 🎉', message: "You learned the basics!", highlight: '' },
];

export default function TutorialGame({ onComplete, onExit }: { onComplete?: () => void; onExit?: () => void }) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<CardData | null>(null);
  const [fight, setFight] = useState(false);
  
  const handRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<HTMLDivElement>(null);
  const twilightRef = useRef<HTMLDivElement>(null);
  const passRef = useRef<HTMLButtonElement>(null);
  const playRef = useRef<HTMLDivElement>(null);
  const moveRef = useRef<HTMLButtonElement>(null);
  const minionsRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<HTMLDivElement>(null);
  const boromirRef = useRef<HTMLDivElement>(null);
  
  const [rect, setRect] = useState<DOMRect | null>(null);

  const [game, setGame] = useState({
    phase: 'fellowship' as GamePhase,
    twilight: 2,
    site: 1,
    hand: [
      { id: 1, name: 'Boromir', culture_name: 'Gondor', type_name: 'Companion', twilight_cost: 3, strength: 7, vitality: 3, is_unique: true },
      { id: 2, name: 'Sting', culture_name: 'Shire', type_name: 'Possession', twilight_cost: 1, is_unique: true },
    ] as CardData[],
    chars: [
      { id: 10, name: 'Frodo', culture_name: 'Shire', type_name: 'Ring-bearer', twilight_cost: 0, strength: 3, vitality: 4, resistance: 10, is_unique: true },
      { id: 11, name: 'Aragorn', culture_name: 'Gondor', type_name: 'Companion', twilight_cost: 4, strength: 8, vitality: 4, is_unique: true },
    ] as CardData[],
    minions: [] as CardData[],
  });

  const cur = tutorialSteps[step];

  useEffect(() => {
    const refs: Record<string, React.RefObject<HTMLElement | null>> = {
      hand: handRef, phase: phaseRef, twilight: twilightRef, pass: passRef,
      play: playRef, move: moveRef, minions: minionsRef, chars: charsRef, boromir: boromirRef,
    };
    const ref = cur?.highlight ? refs[cur.highlight] : null;
    const update = () => setRect(ref?.current?.getBoundingClientRect() || null);
    setTimeout(update, 100);
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [step, selected, cur?.highlight]);

  useEffect(() => {
    if (cur?.action === 'shadow') {
      setTimeout(() => {
        setGame(g => ({ ...g, phase: 'shadow', twilight: g.twilight - 3,
          minions: [{ id: 100, name: 'Orc', culture_name: 'Sauron', type_name: 'Minion', twilight_cost: 3, strength: 6, vitality: 2 }]
        }));
      }, 500);
    }
    if (cur?.action === 'fight') {
      setFight(true);
      setTimeout(() => { setFight(false); setGame(g => ({ ...g, minions: [], phase: 'regroup' })); }, 1500);
    }
  }, [step, cur?.action]);

  const next = () => step < tutorialSteps.length - 1 ? setStep(s => s + 1) : onComplete?.();

  const click = (target: string) => {
    if (cur?.wait !== target) return;
    if (target === 'boromir') { setSelected(game.hand.find(c => c.name === 'Boromir') || null); next(); }
    else if (target === 'play' && selected) {
      setGame(g => ({ ...g, twilight: g.twilight + (selected?.twilight_cost || 0), hand: g.hand.filter(c => c.id !== selected.id), chars: [...g.chars, selected] }));
      setSelected(null); next();
    }
    else if (target === 'pass') {
      const phases: GamePhase[] = ['fellowship', 'shadow', 'maneuver', 'archery', 'assignment', 'skirmish', 'regroup'];
      setGame(g => ({ ...g, phase: phases[(phases.indexOf(g.phase) + 1) % 7] })); next();
    }
    else if (target === 'move') { setGame(g => ({ ...g, site: g.site + 1 })); next(); }
  };

  const isWait = (t: string) => cur?.wait === t;

  // Layout: 36px top + 60px shadow + 24px sites + 70px chars + 90px hand + 44px action = 324px + tooltip
  // This fits in 600px viewport with room for tooltip

  return (
    <div className="h-screen bg-slate-900 text-white flex flex-col overflow-hidden">
      {/* Highlight */}
      {rect && (
        <div className="fixed inset-0 z-40 pointer-events-none">
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute border-2 border-yellow-400 rounded animate-pulse" style={{
            left: rect.left - 4, top: rect.top - 4, width: rect.width + 8, height: rect.height + 8,
            boxShadow: '0 0 20px rgba(250,204,21,0.7)'
          }} />
        </div>
      )}

      {/* TOP BAR - 36px */}
      <div className="h-9 shrink-0 bg-black/80 flex items-center justify-between px-2 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-bold text-xs">T1</span>
          <div ref={phaseRef} className="bg-slate-700 px-1.5 py-0.5 rounded text-[10px] capitalize">{game.phase}</div>
        </div>
        <div ref={twilightRef} className="bg-purple-900/80 px-1.5 py-0.5 rounded border border-purple-500 text-[10px]">◆{game.twilight}</div>
        <button ref={passRef} onClick={() => click('pass')}
          className={`bg-amber-600 px-2 py-0.5 rounded font-bold text-[10px] ${isWait('pass') ? 'ring-2 ring-yellow-400 z-[60]' : ''}`}>
          Pass→
        </button>
      </div>

      {/* SHADOW - 60px */}
      <div className="h-[60px] shrink-0 bg-red-950/40 px-2 py-0.5">
        <div className="text-red-400 text-[9px] font-bold">Shadow</div>
        <div ref={minionsRef} className="h-[48px] flex justify-center items-center gap-1">
          {game.minions.length === 0 ? <span className="text-slate-600 text-[9px]">No minions</span> :
            game.minions.map(m => <div key={m.id} className={fight ? 'animate-bounce' : ''}><Card card={m} size="tiny" /></div>)}
        </div>
      </div>

      {/* SITES - 24px */}
      <div className="h-6 shrink-0 bg-slate-800/60 flex justify-center items-center gap-0.5">
        {[1,2,3,4,5,6,7,8,9].map(n => (
          <div key={n} className={`w-4 h-4 rounded text-[8px] flex items-center justify-center font-bold ${
            n === game.site ? 'bg-yellow-500 text-black' : n < game.site ? 'bg-green-700' : 'bg-slate-700'
          }`}>{n}</div>
        ))}
      </div>

      {/* CHARACTERS - 70px */}
      <div className="h-[70px] shrink-0 bg-blue-950/40 px-2 py-0.5">
        <div className="text-blue-400 text-[9px] font-bold">Fellowship</div>
        <div ref={charsRef} className="h-[56px] flex justify-center items-center gap-1">
          {game.chars.map(c => (
            <div key={c.id} className={`relative ${c.name === 'Aragorn' && fight ? 'animate-bounce' : ''}`}>
              <Card card={c} size="tiny" />
              {c.name === 'Frodo' && <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 text-[7px] bg-yellow-500 text-black px-0.5 rounded">💍</span>}
            </div>
          ))}
        </div>
      </div>

      {/* HAND - 90px */}
      <div ref={handRef} className="h-[90px] shrink-0 bg-amber-900/20 border-y border-amber-500/50 px-2 py-1">
        <div className="text-amber-400 text-[10px] font-bold text-center">YOUR HAND ({game.hand.length})</div>
        <div className="h-[72px] flex justify-center items-center gap-2">
          {game.hand.map((c, i) => (
            <div key={c.id} ref={c.name === 'Boromir' ? boromirRef : undefined}
              onClick={() => c.name === 'Boromir' && click('boromir')}
              className={`cursor-pointer hover:scale-105 transition-transform
                ${isWait('boromir') && c.name === 'Boromir' ? 'z-[60] ring-2 ring-yellow-400 rounded animate-pulse' : ''}
                ${selected?.id === c.id ? 'ring-2 ring-green-400 rounded' : ''}`}
              style={{ transform: `rotate(${(i - 0.5) * 4}deg)` }}>
              <Card card={c} size="tiny" />
            </div>
          ))}
        </div>
      </div>

      {/* SPACER - fills remaining */}
      <div className="flex-1 bg-slate-900" />

      {/* ACTION BAR - 44px */}
      <div className="h-11 shrink-0 bg-black flex items-center justify-center gap-2 border-t border-slate-600">
        {selected && (
          <div ref={playRef} onClick={() => click('play')}
            className={`bg-green-600 px-2 py-1 rounded font-bold text-[10px] cursor-pointer ${isWait('play') ? 'ring-2 ring-yellow-400 z-[60]' : ''}`}>
            Play {selected.name} +{selected.twilight_cost}◆
          </div>
        )}
        <button ref={moveRef} onClick={() => click('move')}
          className={`bg-yellow-600 px-2 py-1 rounded font-bold text-[10px] ${isWait('move') ? 'ring-2 ring-yellow-400 z-[60]' : ''}`}>
          Move→
        </button>
      </div>

      {/* TOOLTIP - positioned above action bar */}
      {cur && (
        <div className="fixed left-1/2 bottom-14 -translate-x-1/2 w-64 bg-amber-900 rounded border-2 border-amber-400 shadow-xl z-[100]">
          <div className="bg-amber-800 px-2 py-1 flex justify-between rounded-t">
            <span className="font-bold text-amber-100 text-xs">{cur.title}</span>
            <span className="text-amber-300 text-[10px]">{step + 1}/{tutorialSteps.length}</span>
          </div>
          <div className="h-0.5 bg-amber-950"><div className="h-full bg-amber-400" style={{ width: `${((step + 1) / tutorialSteps.length) * 100}%` }} /></div>
          <div className="p-2 text-amber-100 text-xs">{cur.message}</div>
          <div className="px-2 pb-2 flex justify-between">
            <button onClick={() => onExit?.()} className="text-amber-400 text-[10px] underline">Skip</button>
            {!cur.wait ? (
              <button onClick={next} className="bg-amber-600 px-3 py-0.5 rounded font-bold text-[10px]">Continue→</button>
            ) : (
              <span className="text-amber-300 text-[9px] animate-pulse">👆 Click element</span>
            )}
          </div>
        </div>
      )}

      {fight && <div className="fixed inset-0 z-[80] flex items-center justify-center pointer-events-none"><span className="text-5xl animate-ping">⚔️</span></div>}
    </div>
  );
}
