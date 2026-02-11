# LOTR TCG Card Art System

This document describes the card art generation system for the Lord of the Rings Trading Card Game project.

## Overview

The card art system provides:
1. **Procedural SVG generation** - Creates unique, culture-specific card backgrounds and portraits
2. **AI prompt templates** - Ready-to-use prompts for external AI image generation services
3. **CSS/Tailwind styling** - Culture-specific card frame styles
4. **Extensible architecture** - Easy to add new cultures, characters, or integrate AI services

## Directory Structure

```
/public/cards/
├── cultures/           # Culture-specific card backgrounds
│   ├── shire-bg.svg
│   ├── elven-bg.svg
│   ├── gandalf-bg.svg
│   ├── gondor-bg.svg
│   ├── rohan-bg.svg
│   ├── dwarven-bg.svg
│   ├── ringwraith-bg.svg
│   ├── sauron-bg.svg
│   ├── moria-bg.svg
│   ├── isengard-bg.svg
│   └── dunland-bg.svg
├── characters/         # Character portrait silhouettes
│   ├── frodo.svg
│   ├── aragorn.svg
│   ├── legolas.svg
│   └── ... (28 total)
├── sites/              # Adventure path site artwork
│   ├── site-1-bag-end.svg
│   ├── site-2-prancing-pony.svg
│   └── ... (9 total)
└── manifest.json       # Asset manifest with metadata

/src/lib/cardArt/
├── index.ts            # Main exports
├── types.ts            # TypeScript interfaces
├── themes.ts           # Culture themes and AI prompts
├── svgGenerator.ts     # SVG procedural generation
└── CardArtGenerator.ts # Main utility class

/src/styles/
└── card-cultures.css   # Culture-specific CSS variables and classes
```

## Cultures

### Free Peoples (Light Side)
| Culture | Primary Color | Symbol | Art Style |
|---------|--------------|--------|-----------|
| Shire | Forest Green | ⌂ | Pastoral, cozy, rolling hills |
| Elven | Deep Blue | ⚘ | Ethereal, starlit, flowing curves |
| Gandalf | Steel Grey | ★ | Mystical, light rays, wisdom |
| Gondor | White/Silver | ♔ | Noble, white stone, tower motifs |
| Rohan | Golden | ♞ | Golden plains, sun rays, horses |
| Dwarven | Bronze/Amber | ⚒ | Forge fire, geometric runes |

### Shadow (Dark Side)
| Culture | Primary Color | Symbol | Art Style |
|---------|--------------|--------|-----------|
| Ringwraith | Deep Purple | ◉ | Spectral, swirling shadows |
| Sauron | Crimson/Black | ⛰ | Dark tower, fire, the Eye |
| Moria | Dark Red | ⛏ | Cave depths, goblin eyes |
| Isengard | Iron/Steel | ⚙ | Industrial, gears, machinery |
| Dunland | Burnt Orange | ♨ | Wild fire, tribal patterns |

## Usage

### In React Components

```tsx
import { CardArtGenerator } from '@/lib/cardArt';

const generator = new CardArtGenerator();

// Generate SVG art for a card
const art = generator.generateSVGArt('Elven', 'Legolas', 'Character');
// Returns: { svgContent, dataUrl, prompt, culture, timestamp }

// Use in an image tag
<img src={art.dataUrl} alt="Legolas" />

// Or inline the SVG
<div dangerouslySetInnerHTML={{ __html: art.svgContent }} />
```

### In CSS

```css
/* Import the culture styles */
@import '@/styles/card-cultures.css';

/* Use culture-specific classes */
.my-card {
  /* Apply Elven card frame */
  @apply card-frame card-frame-elven;
}

/* Use CSS variables directly */
.custom-elven {
  background: var(--elven-gradient);
  border-color: var(--elven-border);
  color: var(--elven-text);
}
```

### In Tailwind

```tsx
import { getCultureTailwindClasses } from '@/lib/cardArt';

const classes = getCultureTailwindClasses('Elven');
// Returns: { bg, border, text, accent, gradient, ring }

<div className={`${classes.gradient} ${classes.border} ${classes.text}`}>
  Card content
</div>
```

## AI Image Generation Prompts

The system includes optimized prompts for AI image generation. While the SVG placeholders work immediately, you can use these prompts with external AI services:

### Character Prompts

```typescript
import { characterPrompts } from '@/lib/cardArt';

console.log(characterPrompts['Frodo Baggins']);
// "young hobbit with curly brown hair, large innocent eyes, wearing a mithril coat 
//  under simple hobbit clothes, holding the One Ring on a chain, brave but weary 
//  expression, fantasy portrait"

console.log(characterPrompts['Aragorn']);
// "rugged ranger king, dark hair streaked with grey, intense grey eyes, wearing 
//  ranger cloak and carrying Andúril the reforged sword, noble bearing despite 
//  worn appearance, fantasy portrait"
```

### Culture Base Prompts

```typescript
import { basePromptTemplate, cultureThemes } from '@/lib/cardArt';

const prompt = basePromptTemplate('Elven', 'Character');
// "Fantasy trading card game art, ethereal, graceful, silver and blue tones, 
//  starlight, ancient forest, highly detailed, dramatic lighting, digital painting, 
//  concept art style, Lord of the Rings inspired, Character"

const theme = cultureThemes['Elven'];
// { artStyle: 'ethereal, graceful, silver and blue tones, starlight, ancient forest',
//   keywords: ['elf', 'archer', 'immortal', 'wise', 'Rivendell', ...] }
```

### Site Prompts

```typescript
import { sitePrompts } from '@/lib/cardArt';

console.log(sitePrompts[4]);
// { name: 'Rivendell', kingdom: 'Elven', 
//   prompt: 'ethereal elven city in mountain valley, waterfalls, elegant bridges, 
//            autumn leaves, golden light, peaceful sanctuary, fantasy architecture' }
```

## Supported AI Services

The CardArtGenerator is designed to work with these services (API keys required):

| Service | Environment Variable | Notes |
|---------|---------------------|-------|
| Stability AI | `STABILITY_API_KEY` | Stable Diffusion models |
| OpenAI | `OPENAI_API_KEY` | DALL-E 3 |
| Replicate | `REPLICATE_API_TOKEN` | Various SD models |

To check available services:

```typescript
const generator = new CardArtGenerator();
const available = generator.checkAvailableServices();
// ['placeholder'] - always available
// ['placeholder', 'openai'] - if OPENAI_API_KEY is set
```

## Regenerating Assets

To regenerate all SVG placeholder art:

```bash
cd /root/clawd/card_game_project
npx ts-node scripts/generateCardArt.ts
```

This will regenerate:
- 11 culture backgrounds
- 28 character portraits  
- 9 site artworks
- Updated manifest.json

## CSS Classes Reference

### Card Frame Base
```css
.card-frame           /* Base frame styling */
.card-frame-ornate    /* Decorative double border */
```

### Culture-Specific Frames
```css
.card-frame-shire
.card-frame-elven
.card-frame-gandalf
.card-frame-gondor
.card-frame-rohan
.card-frame-dwarven
.card-frame-ringwraith
.card-frame-sauron
.card-frame-moria
.card-frame-isengard
.card-frame-dunland
.card-frame-site
```

### Card Components
```css
.card-art-area        /* Art display area */
.card-title-bar       /* Card name section */
.card-stats           /* Stats container */
.card-stat            /* Individual stat badge */
.card-stat-strength   /* Red strength badge */
.card-stat-vitality   /* Blue vitality badge */
.card-stat-resistance /* Gold resistance badge */
.card-twilight-cost   /* Circular cost indicator */
.card-game-text       /* Card text area */
.card-unique-marker   /* ◆ unique indicator */
```

### Animations
```css
.card-playable        /* Glowing pulse for playable cards */
.card-selected        /* Selection highlight effect */
.shadow-eyes-effect   /* Glowing eyes for shadow creatures */
```

## Extending the System

### Adding a New Culture

1. Add to `types.ts`:
```typescript
export type Culture = ... | 'NewCulture';
```

2. Add theme in `themes.ts`:
```typescript
NewCulture: {
  name: 'NewCulture',
  side: 'free_peoples', // or 'shadow'
  primaryColor: '#...',
  secondaryColor: '#...',
  accentColor: '#...',
  borderColor: '#...',
  textColor: '#...',
  bgGradient: 'linear-gradient(...)',
  symbol: '🆕',
  symbolUnicode: '♦',
  artStyle: 'describe the visual style',
  keywords: ['keyword1', 'keyword2'],
}
```

3. Add pattern generator in `svgGenerator.ts`:
```typescript
NewCulture: (rand, w, h) => {
  let pattern = '';
  // Generate culture-specific SVG elements
  return pattern;
},
```

4. Add CSS in `card-cultures.css`:
```css
.card-frame-newculture {
  background: var(--newculture-gradient);
  border-color: var(--newculture-border);
  color: var(--newculture-text);
}
```

### Adding New Characters

Add to `scripts/generateCardArt.ts`:
```typescript
const characters = [
  ...existing,
  { name: 'NewCharacter', culture: 'Elven', title: 'Character Title' },
];
```

Then add an AI prompt in `themes.ts`:
```typescript
'NewCharacter': 'detailed description for AI image generation...',
```

## File Manifest

The `manifest.json` in `/public/cards/` contains metadata for all generated assets:

```json
{
  "generated": "2024-02-11T12:07:00.000Z",
  "cultures": [
    { "name": "Shire", "file": "cultures/shire-bg.svg", "side": "free_peoples" },
    ...
  ],
  "characters": [
    { "name": "Frodo", "title": "Ring-bearer", "culture": "Shire", "file": "characters/frodo.svg" },
    ...
  ],
  "sites": [
    { "number": 1, "name": "Bag End", "kingdom": "Shire", "file": "sites/site-1-bag-end.svg" },
    ...
  ]
}
```

## Best Practices

1. **Use SVG placeholders in development** - They're instant and look good
2. **Generate AI art for production** - Use the prompts with your preferred service
3. **Maintain consistent dimensions**:
   - Card backgrounds: 200×280px
   - Character portraits: 200×200px
   - Site artwork: 280×160px
4. **Use the manifest.json** - It provides all metadata for dynamic loading
5. **Apply CSS classes consistently** - Use the provided culture classes for visual consistency

## Troubleshooting

### SVGs not displaying
- Check that the file paths are correct
- Ensure the `public` folder is accessible
- Verify the manifest.json matches actual files

### CSS variables not working
- Import `card-cultures.css` in your root layout
- Check that your bundler supports CSS variables

### AI generation fails
- Verify API keys are set in environment
- Check service rate limits
- Fall back to SVG placeholders

---

*Generated for LOTR TCG Card Game Project*
