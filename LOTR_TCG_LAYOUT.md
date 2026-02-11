# Lord of the Rings Trading Card Game - Layout & UX

## Game Board Layout

### Physical Table Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           OPPONENT'S SIDE                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  DRAW    │  │ DISCARD  │  │  DEAD    │  │ ADVENTURE│  │  THREAT  │      │
│  │  DECK    │  │  PILE    │  │  PILE    │  │   DECK   │  │  ZONE    │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    OPPONENT'S SUPPORT AREA                          │   │
│  │              (Conditions, Artifacts, Possessions)                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    OPPONENT'S CHARACTER AREA                        │   │
│  │              (Minions & Shadow Characters)                          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐    │
│  │Site 1 │→│Site 2 │→│Site 3 │→│Site 4 │→│Site 5 │→│Site 6 │→│Site 7 │    │
│  │       │ │       │ │       │ │       │ │       │ │       │ │       │    │
│  │ START │ │       │ │       │ │CURRENT│ │       │ │       │ │ END   │    │
│  └───────┘ └───────┘ └───────┘ └───────┘ └───────┘ └───────┘ └───────┘    │
│                      ADVENTURE PATH (Site Path)                            │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    YOUR CHARACTER AREA                              │   │
│  │              (Ring-bearer + Companions)                             │   │
│  │                                                                      │   │
│  │   ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐       │   │
│  │   │RING-   │  │COMPAN- │  │COMPAN- │  │COMPAN- │  │COMPAN- │       │   │
│  │   │BEARER  │  │ION #1  │  │ION #2  │  │ION #3  │  │ION #4  │       │   │
│  │   │(Frodo) │  │        │  │        │  │        │  │        │       │   │
│  │   └────────┘  └────────┘  └────────┘  └────────┘  └────────┘       │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    YOUR SUPPORT AREA                                │   │
│  │              (Conditions, Artifacts, Possessions)                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  DRAW    │  │ DISCARD  │  │  DEAD    │  │   HAND   │  │ TWILIGHT │      │
│  │  DECK    │  │  PILE    │  │  PILE    │  │ (Hidden) │  │  POOL    │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                           YOUR SIDE                                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Core Game Zones

### 1. Adventure Path (Site Path)
- **7-9 Sites** arranged horizontally in the center of the play area
- Fellowship token/marker shows current position
- Sites are revealed as fellowship moves forward
- Each site has:
  - Site number (1-9)
  - Shadow number (twilight tokens generated)
  - Special game text/abilities

### 2. Character Areas

#### Fellowship Side (Your Characters)
- **Ring-bearer**: Always required (typically Frodo)
- **Companions**: Support characters (max 9 total fellowship strength)
- Cards attached to characters shown overlapping below

#### Shadow Side (Opponent's Minions)
- **Minions**: Evil characters played during Shadow phase
- **Support cards**: Conditions and possessions on minions

### 3. Support Areas
- **Possessions**: Items equipped to characters
- **Conditions**: Ongoing effects
- **Artifacts**: Powerful unique items

### 4. Deck Zones
- **Draw Deck**: Face-down, draw from
- **Discard Pile**: Face-up, cards removed from play
- **Dead Pile**: Killed characters and discarded uniques

### 5. Twilight Pool
- Central shared resource
- Represented by tokens (number visible to both players)
- Fellowship adds twilight when moving/playing cards
- Shadow spends twilight to play minions

---

## Turn Structure & UX Flow

### Phase Indicators (Visual)

```
┌───────────────────────────────────────────────────────────────┐
│  ○ Fellowship  │  ● Shadow  │  ○ Maneuver  │  ○ Archery  │   │
│  ○ Assignment  │  ○ Skirmish  │  ○ Regroup                   │
└───────────────────────────────────────────────────────────────┘
```

### 1. Fellowship Phase
**Owner:** Active player (Fellowship player)
- Play companions from hand
- Attach possessions/artifacts to characters
- Activate fellowship abilities
- **UI Highlight:** Green glow on playable cards

### 2. Shadow Phase  
**Owner:** Opposing player (Shadow player)
- Play minions using twilight pool
- Play shadow conditions
- Assign shadow equipment
- **UI Highlight:** Purple/red glow on shadow cards

### 3. Maneuver Phase
- Both players may use maneuver special abilities
- Quick actions back and forth
- **UI:** Action stack visible

### 4. Archery Phase
- Ranged combat resolution
- Assign archery wounds
- **UI:** Damage assignment interface

### 5. Assignment Phase
- Fellowship player assigns minions to characters
- Defender's choice
- **UI:** Drag-and-drop targeting lines

### 6. Skirmish Phase
- Resolve each skirmish one at a time
- Compare strength values
- Apply wounds/kill characters
- **UI:** Combat comparison popup

### 7. Regroup Phase
- Reconcile hand size
- Heal characters
- Prepare for next turn
- **UI:** End-of-turn summary

---

## Card Layout Design

### Card Anatomy

```
┌─────────────────────────────────┐
│ [Culture Symbol]     [Twilight] │  ← Header
│                          Cost   │
├─────────────────────────────────┤
│                                 │
│        [CARD ARTWORK]           │  ← Art Box (60% of card)
│                                 │
│                                 │
├─────────────────────────────────┤
│ CARD NAME            [Strength] │  ← Title Bar
│ Race/Type • Keywords  [Vitality]│
├─────────────────────────────────┤
│                                 │
│ Game text and abilities go      │  ← Text Box
│ here with keywords in BOLD      │
│                                 │
├─────────────────────────────────┤
│ "Flavor text in italics"        │  ← Flavor
│ Set Symbol • Rarity • Number    │  ← Footer
└─────────────────────────────────┘
```

### Culture Symbols & Colors

| Culture | Symbol | Color | Focus |
|---------|--------|-------|-------|
| Dwarven | ⚒️ Axe | Brown | Artifacts, damage prevention |
| Elven | 🌿 Leaf | Blue | Archery, card draw |
| Gandalf | 🌟 Star | Gray | Versatile, twilight control |
| Gondor | 🌳 Tree | White | Fortifications, defense |
| Rohan | 🐎 Horse | Gold | Movement, speed |
| Shire | 🏠 Hobbit hole | Green | Ring-bearer support |
| Dunland | 🔥 Fire | Orange | Aggression, possession hate |
| Isengard | ⚙️ Gear | Black | Industry, overwhelming force |
| Moria | ⛏️ Pick | Dark red | Swarm, Goblins |
| Ringwraith | 👁️ Eye | Dark purple | Corruption, Nazgûl |
| Sauron | 🗼 Tower | Blood red | Raw power, orcs |

---

## Digital UX Features

### Main Game Screen

```
┌──────────────────────────────────────────────────────────────┐
│ [Menu]  TWILIGHT: ◆◆◆◆◆(5)  [Phase: Shadow]  [Turn: 3] [⚙️] │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────┐ [Opponent Hand: 6 cards]           ┌─────┐         │
│  │Deck │                                    │Dead │         │
│  │ 32  │  [Opponent's Characters]           │Pile │         │
│  └─────┘                                    └─────┘         │
│                                                              │
│           [ADVENTURE PATH - Interactive Site Row]            │
│    ○ ─── ○ ─── ● ─── ○ ─── ○ ─── ○ ─── ○                   │
│                 ↑                                            │
│            [Fellowship Token]                                │
│                                                              │
│  ┌─────┐  [Your Characters]                 ┌─────┐         │
│  │Deck │                                    │Disc │         │
│  │ 28  │  [Support Area]                    │ard  │         │
│  └─────┘                                    └─────┘         │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │    [YOUR HAND - Fanned card display]                 │   │
│  └──────────────────────────────────────────────────────┘   │
├──────────────────────────────────────────────────────────────┤
│ [Pass] [Undo] [Chat: _______________] [Concede] [Log]       │
└──────────────────────────────────────────────────────────────┘
```

### Key UX Interactions

1. **Card Hover**: 
   - Enlarged card preview
   - Highlight valid targets
   - Show related cards

2. **Drag & Drop**:
   - Play cards from hand to zones
   - Attach possessions to characters
   - Assign combat

3. **Context Menus**:
   - Right-click for card options
   - Examine, exhaust, wound, discard

4. **Visual Feedback**:
   - Glow effects for playable cards
   - Shake animation for invalid actions
   - Particle effects for special abilities

5. **Information Display**:
   - Twilight pool always visible
   - Current phase clearly indicated
   - Turn number and active player shown

### Mobile Considerations
- Tap to select, double-tap to play
- Pinch to zoom card details
- Swipe through hand
- Collapsible opponent area
- Portrait mode with vertical site path

---

## Deck Building Interface

```
┌────────────────────────────────────────────────────────────────┐
│  DECK BUILDER                                    [Save] [Load] │
├─────────────────────────────┬──────────────────────────────────┤
│  CARD COLLECTION            │  CURRENT DECK                   │
│  ┌────────────────────────┐ │  ┌────────────────────────────┐ │
│  │ [Search: ___________ ] │ │  │ Ring-bearer: Frodo (1)     │ │
│  │ [Filter: Culture  ▼]   │ │  │ Adventure Deck: 9 sites    │ │
│  │ [Filter: Type     ▼]   │ │  │ ─────────────────────────  │ │
│  │ [Filter: Cost     ▼]   │ │  │ Free Peoples: 32 cards     │ │
│  │                        │ │  │   Companions: 8            │ │
│  │  ┌────┐ ┌────┐ ┌────┐ │ │  │   Events: 12               │ │
│  │  │Card│ │Card│ │Card│ │ │  │   Possessions: 8           │ │
│  │  │ 1  │ │ 2  │ │ 3  │ │ │  │   Conditions: 4            │ │
│  │  └────┘ └────┘ └────┘ │ │  │ ─────────────────────────  │ │
│  │  ┌────┐ ┌────┐ ┌────┐ │ │  │ Shadow: 28 cards           │ │
│  │  │Card│ │Card│ │Card│ │ │  │   Minions: 14              │ │
│  │  │ 4  │ │ 5  │ │ 6  │ │ │  │   Events: 8                │ │
│  │  └────┘ └────┘ └────┘ │ │  │   Conditions: 6            │ │
│  │        [Load More]     │ │  │ ─────────────────────────  │ │
│  └────────────────────────┘ │  │ Total: 60 cards ✓          │ │
│                             │  └────────────────────────────┘ │
│  [Card Preview Panel]       │  [Mana Curve] [Stats]          │
└─────────────────────────────┴──────────────────────────────────┘
```

---

## Sound & Feedback Design

### Audio Cues
- **Card play**: Satisfying "thump" sound
- **Twilight added**: Mystical chime
- **Phase change**: Subtle transition tone
- **Combat**: Metal clash for skirmishes
- **Victory/Defeat**: Orchestral stinger

### Animations
- Cards slide smoothly from hand to play
- Twilight tokens float into pool
- Damage shows as red flash + shake
- Character death: fade + fall animation
- Movement: Fellowship marker slides along path

---

## Accessibility Features

- **Colorblind mode**: Pattern-based culture identification
- **Large text mode**: Scalable UI elements
- **Screen reader support**: Full card text narration
- **Keyboard navigation**: Full game playable without mouse
- **Turn timer**: Optional for competitive play
- **Auto-pass**: Skip phases with no valid actions

---

## Multiplayer Features

- **Matchmaking**: Ranked and casual queues
- **Friend challenges**: Direct game invites
- **Spectator mode**: Watch ongoing games
- **Tournament support**: Swiss and bracket formats
- **Chat**: In-game messaging with emotes
- **Replay system**: Review completed games
