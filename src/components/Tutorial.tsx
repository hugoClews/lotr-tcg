'use client';

import { useState } from 'react';

interface TutorialStep {
  title: string;
  content: string;
  highlight?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    title: '🎯 Your Goal',
    content: `Get your Ring-bearer (Frodo) from Site 1 to Site 9 without dying.

Your opponent wants to kill Frodo or corrupt him with burden tokens before he reaches Mount Doom.`,
  },
  {
    title: '💎 The Twilight Pool',
    content: `The central resource of the game. When YOU play cards or move forward, you add twilight to the pool.

Your OPPONENT then spends that twilight to play minions against you!

The tension: Strong companions cost more twilight, giving your opponent more resources.`,
    highlight: 'twilight',
  },
  {
    title: '🃏 One Deck, Two Sides',
    content: `Your deck contains BOTH Free Peoples cards (your fellowship) AND Shadow cards (to attack your opponent).

When you move forward → Opponent plays Shadow against you
When opponent moves → YOU play Shadow against them`,
  },
  {
    title: '🏃 Fellowship Phase',
    content: `Your turn to build your fellowship:
• Play companions (adds twilight to pool)
• Attach possessions and artifacts
• Use "Fellowship:" abilities

Every card you play costs twilight — be strategic!`,
    highlight: 'fellowship',
  },
  {
    title: '👁️ Shadow Phase',
    content: `Your opponent's turn to attack:
• They spend twilight to play minions
• Attach shadow cards
• Use "Shadow:" abilities

No twilight = no minions. Safe passage!`,
    highlight: 'shadow',
  },
  {
    title: '🏹 Archery Phase',
    content: `Ranged combat happens first:
1. Count archery values on each side
2. Fellowship assigns wounds to minions
3. Shadow assigns wounds to companions

Characters with "Archer" keyword contribute archery damage.`,
    highlight: 'archery',
  },
  {
    title: '⚔️ Assignment & Skirmish',
    content: `Fellowship player assigns minions to companions, then fight!

For each skirmish:
• Compare Strength values
• Higher strength wins
• Loser takes wounds

If strength is DOUBLED → instant death (overwhelmed)`,
    highlight: 'skirmish',
  },
  {
    title: '🗺️ The Adventure Path',
    content: `9 Sites from Bag End to Mount Doom.

Each site has a Shadow Number — when you move there, that much twilight is added to the pool.

🏠 Sanctuaries: Heal wounds at Regroup
🌲 Wilderness: Standard travel
⛰️ Underground: Often more dangerous`,
    highlight: 'sites',
  },
  {
    title: '💍 The Ring-bearer',
    content: `Frodo carries The One Ring and has a Resistance value.

Wearing the Ring can save him from wounds BUT adds burden tokens.

If Burdens ≥ Resistance → Frodo is corrupted. You lose!`,
  },
  {
    title: '🔄 Regroup & Move Again',
    content: `After combat:
• Heal 1 wound per companion at Sanctuaries
• Discard to hand limit (8 cards)

Then choose: Move AGAIN or stay?

Double-moving is risky but can win games fast.`,
    highlight: 'regroup',
  },
  {
    title: '💡 Strategy Tips',
    content: `Fellowship:
• Don't overcommit — save twilight
• Time moves to hit Sanctuaries when weak
• Protect Frodo at all costs

Shadow:
• Wait for big twilight pools
• Overwhelm (2× strength) for instant kills
• Save Nazgûl for key moments`,
  },
  {
    title: '🏆 You\'re Ready!',
    content: `Victory conditions:

✅ Fellowship wins: Frodo reaches Site 9 alive
❌ Shadow wins: Frodo is killed or corrupted

The road goes ever on... Good luck, Ring-bearer!`,
  },
];

interface TutorialProps {
  onClose?: () => void;
}

export default function Tutorial({ onClose }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = tutorialSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-600 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-900 to-amber-800 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-amber-100">{step.title}</h2>
          <button
            onClick={onClose}
            className="text-amber-200 hover:text-white text-2xl transition-colors"
          >
            ×
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-slate-700">
          <div
            className="h-full bg-amber-500 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-slate-200 whitespace-pre-line text-lg leading-relaxed min-h-[200px]">
            {step.content}
          </div>
        </div>

        {/* Navigation */}
        <div className="px-6 py-4 bg-slate-900/50 flex justify-between items-center">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            ← Previous
          </button>

          <div className="flex gap-1">
            {tutorialSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-amber-500' : 'bg-slate-600 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>

          {currentStep < tutorialSteps.length - 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg font-bold transition-colors"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-bold transition-colors"
            >
              Start Playing! 🎮
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Quick reference card for during gameplay
export function QuickReference() {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-lg text-sm transition-colors z-40"
      >
        📖 Help
      </button>
    );
  }

  return (
    <div className="fixed top-4 left-4 bg-slate-800 rounded-xl p-4 shadow-xl border border-slate-600 w-80 z-40">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-lg">Quick Reference</h3>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
          ×
        </button>
      </div>

      <div className="space-y-3 text-sm">
        <div>
          <h4 className="font-bold text-amber-400">Turn Order</h4>
          <ol className="list-decimal list-inside text-slate-300">
            <li>Fellowship - Play companions</li>
            <li>Shadow - Opponent plays minions</li>
            <li>Maneuver - Special abilities</li>
            <li>Archery - Ranged combat</li>
            <li>Assignment - Assign fights</li>
            <li>Skirmish - Resolve combat</li>
            <li>Regroup - Heal & move again?</li>
          </ol>
        </div>

        <div>
          <h4 className="font-bold text-amber-400">Combat</h4>
          <p className="text-slate-300">Higher Strength wins. Loser takes wounds.</p>
          <p className="text-slate-300">2× Strength = Overwhelming (instant kill)</p>
        </div>

        <div>
          <h4 className="font-bold text-amber-400">Keywords</h4>
          <ul className="text-slate-300 space-y-1">
            <li><span className="text-blue-400">Archer</span> - Deals archery damage</li>
            <li><span className="text-red-400">Fierce</span> - Can target Ring-bearer</li>
            <li><span className="text-yellow-400">Damage +X</span> - Extra wounds</li>
            <li><span className="text-green-400">Defender +X</span> - Protect others</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-amber-400">Victory</h4>
          <p className="text-green-400">✅ Frodo reaches Site 9</p>
          <p className="text-red-400">❌ Frodo dies or is corrupted</p>
        </div>
      </div>
    </div>
  );
}
