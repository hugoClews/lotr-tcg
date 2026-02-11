'use client';

import { GamePhase } from './GameBoard';

interface PhaseIndicatorProps {
  currentPhase: GamePhase;
  onPhaseClick?: (phase: GamePhase) => void;
}

const phases: { id: GamePhase; name: string; icon: string; color: string }[] = [
  { id: 'fellowship', name: 'Fellowship', icon: '🏃', color: '#50A060' },
  { id: 'shadow', name: 'Shadow', icon: '👁️', color: '#8050A0' },
  { id: 'maneuver', name: 'Maneuver', icon: '🎯', color: '#A08050' },
  { id: 'archery', name: 'Archery', icon: '🏹', color: '#5080A0' },
  { id: 'assignment', name: 'Assignment', icon: '⚔️', color: '#A07050' },
  { id: 'skirmish', name: 'Skirmish', icon: '💥', color: '#A05060' },
  { id: 'regroup', name: 'Regroup', icon: '🔄', color: '#508080' },
];

export default function PhaseIndicator({ currentPhase, onPhaseClick }: PhaseIndicatorProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg p-1" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}>
      {phases.map((phase, index) => {
        const isCurrent = phase.id === currentPhase;
        const currentIndex = phases.findIndex(p => p.id === currentPhase);
        const isPast = index < currentIndex;

        return (
          <button
            key={phase.id}
            onClick={() => onPhaseClick?.(phase.id)}
            className="relative flex items-center gap-1 px-2 py-1 rounded transition-all duration-200"
            style={{ 
              background: isCurrent ? phase.color : isPast ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
              color: isCurrent ? 'white' : isPast ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.6)',
              boxShadow: isCurrent ? `0 0 10px ${phase.color}50` : 'none',
              transform: isCurrent ? 'scale(1.05)' : 'scale(1)'
            }}
            title={phase.name}
          >
            <span className="text-sm">{phase.icon}</span>
            <span className="text-[10px] font-medium hidden lg:inline">{phase.name}</span>
            {isCurrent && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full animate-pulse" style={{ background: '#FFD700' }} />}
          </button>
        );
      })}
    </div>
  );
}

export function PhaseIndicatorCompact({ currentPhase, onPhaseClick }: PhaseIndicatorProps) {
  const current = phases.find(p => p.id === currentPhase);
  const currentIndex = phases.findIndex(p => p.id === currentPhase);

  return (
    <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: 'rgba(0,0,0,0.3)' }}>
      <button onClick={() => { const prev = Math.max(0, currentIndex - 1); onPhaseClick?.(phases[prev].id); }}
        disabled={currentIndex === 0} className="text-white/50 hover:text-white disabled:opacity-30">◀</button>
      <div className="flex items-center gap-2 px-3 py-1 rounded-lg font-bold" style={{ background: current?.color }}>
        <span>{current?.icon}</span>
        <span className="text-sm">{current?.name}</span>
        <span className="text-xs opacity-70">({currentIndex + 1}/{phases.length})</span>
      </div>
      <button onClick={() => { const next = Math.min(phases.length - 1, currentIndex + 1); onPhaseClick?.(phases[next].id); }}
        disabled={currentIndex === phases.length - 1} className="text-white/50 hover:text-white disabled:opacity-30">▶</button>
    </div>
  );
}
