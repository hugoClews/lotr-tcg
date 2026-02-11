// Culture Themes and AI Generation Prompts

import { CultureTheme, Culture } from './types';

export const cultureThemes: Record<Culture, CultureTheme> = {
  // ========== FREE PEOPLES ==========
  
  Shire: {
    name: 'Shire',
    side: 'free_peoples',
    primaryColor: '#2D5016',
    secondaryColor: '#4A7023',
    accentColor: '#8B4513',
    borderColor: '#1A3009',
    textColor: '#F5F5DC',
    bgGradient: 'linear-gradient(135deg, #2D5016 0%, #4A7023 50%, #3A5A1C 100%)',
    symbol: '🏠',
    symbolUnicode: '⌂',
    artStyle: 'pastoral, cozy, rustic, warm lighting, rolling green hills',
    keywords: ['hobbit', 'halfling', 'pipe', 'ale', 'garden', 'burrow', 'peaceful'],
  },

  Elven: {
    name: 'Elven',
    side: 'free_peoples',
    primaryColor: '#1E3A5F',
    secondaryColor: '#2C5282',
    accentColor: '#90CDF4',
    borderColor: '#1A365D',
    textColor: '#E2E8F0',
    bgGradient: 'linear-gradient(135deg, #1E3A5F 0%, #2C5282 50%, #2B4C7E 100%)',
    symbol: '🌿',
    symbolUnicode: '⚘',
    artStyle: 'ethereal, graceful, silver and blue tones, starlight, ancient forest',
    keywords: ['elf', 'archer', 'immortal', 'wise', 'Rivendell', 'Lothlórien', 'starlight'],
  },

  Gandalf: {
    name: 'Gandalf',
    side: 'free_peoples',
    primaryColor: '#4A5568',
    secondaryColor: '#718096',
    accentColor: '#F6E05E',
    borderColor: '#2D3748',
    textColor: '#F7FAFC',
    bgGradient: 'linear-gradient(135deg, #4A5568 0%, #718096 50%, #5A6577 100%)',
    symbol: '🌟',
    symbolUnicode: '★',
    artStyle: 'mystical, powerful, grey robes and white light, wise wizard',
    keywords: ['wizard', 'staff', 'magic', 'fireworks', 'white', 'grey', 'Mithrandir'],
  },

  Gondor: {
    name: 'Gondor',
    side: 'free_peoples',
    primaryColor: '#E2E8F0',
    secondaryColor: '#CBD5E0',
    accentColor: '#1A202C',
    borderColor: '#A0AEC0',
    textColor: '#1A202C',
    bgGradient: 'linear-gradient(135deg, #E2E8F0 0%, #CBD5E0 50%, #D5DCE4 100%)',
    symbol: '🌳',
    symbolUnicode: '♔',
    artStyle: 'noble, majestic, white stone city, silver armor, white tree',
    keywords: ['Minas Tirith', 'king', 'ranger', 'Dúnedain', 'Númenor', 'citadel', 'tower'],
  },

  Rohan: {
    name: 'Rohan',
    side: 'free_peoples',
    primaryColor: '#B7791F',
    secondaryColor: '#D69E2E',
    accentColor: '#2D3748',
    borderColor: '#975A16',
    textColor: '#FFFAF0',
    bgGradient: 'linear-gradient(135deg, #B7791F 0%, #D69E2E 50%, #C4882A 100%)',
    symbol: '🐎',
    symbolUnicode: '♞',
    artStyle: 'golden plains, horse lords, braided hair, wooden halls, sunrise',
    keywords: ['horse', 'rider', 'Éomer', 'Théoden', 'Edoras', 'Meduseld', 'cavalry'],
  },

  Dwarven: {
    name: 'Dwarven',
    side: 'free_peoples',
    primaryColor: '#744210',
    secondaryColor: '#9C4221',
    accentColor: '#F6AD55',
    borderColor: '#5B3412',
    textColor: '#FEEBC8',
    bgGradient: 'linear-gradient(135deg, #744210 0%, #9C4221 50%, #8A5020 100%)',
    symbol: '⚒️',
    symbolUnicode: '⚒',
    artStyle: 'underground halls, forge fire, gems and gold, stone pillars, axes',
    keywords: ['dwarf', 'axe', 'beard', 'mountain', 'Khazad-dûm', 'forge', 'mithril'],
  },

  // ========== SHADOW ==========

  Ringwraith: {
    name: 'Ringwraith',
    side: 'shadow',
    primaryColor: '#2D1B4E',
    secondaryColor: '#44337A',
    accentColor: '#9F7AEA',
    borderColor: '#1A0F33',
    textColor: '#E9D8FD',
    bgGradient: 'linear-gradient(135deg, #2D1B4E 0%, #44337A 50%, #3B2A5E 100%)',
    symbol: '👁️',
    symbolUnicode: '◉',
    artStyle: 'spectral, terrifying, black robes, crowned shadows, morgul blade',
    keywords: ['Nazgûl', 'wraith', 'black rider', 'Witch-king', 'fell beast', 'spectral'],
  },

  Sauron: {
    name: 'Sauron',
    side: 'shadow',
    primaryColor: '#742A2A',
    secondaryColor: '#9B2C2C',
    accentColor: '#FC8181',
    borderColor: '#5B2222',
    textColor: '#FED7D7',
    bgGradient: 'linear-gradient(135deg, #742A2A 0%, #9B2C2C 50%, #862A2A 100%)',
    symbol: '🗼',
    symbolUnicode: '⛰',
    artStyle: 'dark tower, fire and shadow, orcs, brutal armor, Mordor',
    keywords: ['orc', 'Mordor', 'Barad-dûr', 'dark lord', 'eye', 'shadow', 'cruel'],
  },

  Moria: {
    name: 'Moria',
    side: 'shadow',
    primaryColor: '#5B2222',
    secondaryColor: '#822727',
    accentColor: '#E53E3E',
    borderColor: '#421616',
    textColor: '#FEB2B2',
    bgGradient: 'linear-gradient(135deg, #5B2222 0%, #822727 50%, #6B2525 100%)',
    symbol: '⛏️',
    symbolUnicode: '⛏',
    artStyle: 'deep mines, goblin caves, drums in the deep, bridge of Khazad-dûm',
    keywords: ['goblin', 'cave troll', 'Balrog', 'drums', 'darkness', 'mines', 'Durin'],
  },

  Isengard: {
    name: 'Isengard',
    side: 'shadow',
    primaryColor: '#1A1A1A',
    secondaryColor: '#2D3748',
    accentColor: '#A0AEC0',
    borderColor: '#0D0D0D',
    textColor: '#E2E8F0',
    bgGradient: 'linear-gradient(135deg, #1A1A1A 0%, #2D3748 50%, #232323 100%)',
    symbol: '⚙️',
    symbolUnicode: '⚙',
    artStyle: 'industrial, iron and steel, Orthanc tower, machinery, white hand',
    keywords: ['Uruk-hai', 'Saruman', 'Orthanc', 'white hand', 'industry', 'war machine'],
  },

  Dunland: {
    name: 'Dunland',
    side: 'shadow',
    primaryColor: '#9C4221',
    secondaryColor: '#C05621',
    accentColor: '#ED8936',
    borderColor: '#7B341E',
    textColor: '#FEEBC8',
    bgGradient: 'linear-gradient(135deg, #9C4221 0%, #C05621 50%, #AD4D22 100%)',
    symbol: '🔥',
    symbolUnicode: '♨',
    artStyle: 'wild men, fire and destruction, tribal warriors, burning villages',
    keywords: ['wild men', 'tribal', 'raiders', 'burning', 'savage', 'hatred'],
  },
};

// AI Image Generation Prompts
export const basePromptTemplate = (culture: Culture, type: string) => {
  const theme = cultureThemes[culture];
  return `Fantasy trading card game art, ${theme.artStyle}, highly detailed, dramatic lighting, digital painting, concept art style, Lord of the Rings inspired, ${type}`;
};

export const characterPrompts: Record<string, string> = {
  // Free Peoples
  'Frodo Baggins': 'young hobbit with curly brown hair, large innocent eyes, wearing a mithril coat under simple hobbit clothes, holding the One Ring on a chain, brave but weary expression, fantasy portrait',
  'Samwise Gamgee': 'stout loyal hobbit gardener, sandy hair, honest face, carrying cooking pots and rope, devoted expression, wearing traveling clothes, fantasy portrait',
  'Aragorn': 'rugged ranger king, dark hair streaked with grey, intense grey eyes, wearing ranger cloak and carrying Andúril the reforged sword, noble bearing despite worn appearance, fantasy portrait',
  'Legolas': 'ethereal elf prince with long silver-blonde hair, keen blue eyes, elegant elven bow, pointed ears, graceful warrior stance, wearing Mirkwood green and brown, fantasy portrait',
  'Gimli': 'fierce dwarf warrior with magnificent red beard with braids and beads, wielding two-handed axe, sturdy armor, proud stance, helm with runes, fantasy portrait',
  'Gandalf the Grey': 'tall elderly wizard with long grey beard and pointed grey hat, wise ancient eyes, gnarled wooden staff with crystal, grey robes, knowing smile, fantasy portrait',
  'Gandalf the White': 'majestic wizard in radiant white robes, white staff of power, long white hair and beard, blazing with inner light, commanding presence, fantasy portrait',
  'Boromir': 'proud gondorian warrior with reddish-brown hair, wearing the horn of Gondor, noble but conflicted expression, heavy armor with white tree emblem, fantasy portrait',
  
  // Shadow
  'Witch-king': 'terrifying Nazgûl lord in black robes, iron crown, no visible face in hood just darkness, wielding morgul blade and flail, spectral and menacing, fantasy portrait',
  'Saruman': 'corrupt wizard with white beard and robes now stained, piercing eyes, many-colored cloak, dark staff, treacherous expression, fantasy portrait',
  'Gollum': 'wretched twisted creature, pale skin stretched over bones, huge luminous eyes, wispy hair, obsessed expression, reaching for precious ring, fantasy portrait',
  'Lurtz': 'massive Uruk-hai commander, dark skin painted with white hand, fierce yellow eyes, heavy armor and scimitars, brutal warrior, fantasy portrait',
};

export const sitePrompts: Record<number, { name: string; kingdom: string; prompt: string }> = {
  1: { name: 'Bag End', kingdom: 'Shire', prompt: 'cozy hobbit hole door in green hillside, round green door, flower garden, peaceful morning light, fantasy landscape' },
  2: { name: 'The Prancing Pony', kingdom: 'Bree', prompt: 'rustic medieval inn at night, warm lantern light spilling from windows, rain on cobblestones, mysterious atmosphere, fantasy tavern' },
  3: { name: 'Weathertop', kingdom: 'Arnor', prompt: 'ancient ruined watchtower on stormy hilltop, crumbling stone walls, wind-swept grasses, dramatic clouds, ominous atmosphere, fantasy ruin' },
  4: { name: 'Rivendell', kingdom: 'Elven', prompt: 'ethereal elven city in mountain valley, waterfalls, elegant bridges, autumn leaves, golden light, peaceful sanctuary, fantasy architecture' },
  5: { name: 'Moria Gates', kingdom: 'Moria', prompt: 'massive ancient dwarven doors with glowing elven script, mountain lake reflection, moonlight, mysterious atmosphere, fantasy entrance' },
  6: { name: 'Balin\'s Tomb', kingdom: 'Moria', prompt: 'dark underground chamber with single shaft of light on stone tomb, dwarf skeletons, dust motes, somber atmosphere, fantasy dungeon' },
  7: { name: 'Lothlórien', kingdom: 'Elven', prompt: 'magical forest with giant silver mallorn trees, ethereal blue-white light, elven platforms high in trees, mystical atmosphere, fantasy forest' },
  8: { name: 'Amon Hen', kingdom: 'Gondor', prompt: 'ancient seeing seat atop forested hill, carved stone throne, autumn forest, river below, dramatic vista, fantasy monument' },
  9: { name: 'Helm\'s Deep', kingdom: 'Rohan', prompt: 'massive fortress built into mountain, towering walls and deep, rain and lightning, siege warfare, desperate defense, fantasy castle' },
};

export function getCultureTailwindClasses(culture: Culture): {
  bg: string;
  border: string;
  text: string;
  accent: string;
  gradient: string;
  ring: string;
} {
  const classes: Record<Culture, ReturnType<typeof getCultureTailwindClasses>> = {
    Shire: {
      bg: 'bg-green-800',
      border: 'border-green-600',
      text: 'text-green-50',
      accent: 'text-amber-600',
      gradient: 'bg-gradient-to-br from-green-800 via-green-700 to-green-800',
      ring: 'ring-green-400',
    },
    Elven: {
      bg: 'bg-blue-900',
      border: 'border-blue-500',
      text: 'text-blue-50',
      accent: 'text-cyan-300',
      gradient: 'bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900',
      ring: 'ring-blue-400',
    },
    Gandalf: {
      bg: 'bg-gray-700',
      border: 'border-gray-500',
      text: 'text-gray-50',
      accent: 'text-yellow-400',
      gradient: 'bg-gradient-to-br from-gray-700 via-gray-600 to-gray-700',
      ring: 'ring-gray-400',
    },
    Gondor: {
      bg: 'bg-slate-200',
      border: 'border-slate-400',
      text: 'text-slate-900',
      accent: 'text-slate-700',
      gradient: 'bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300',
      ring: 'ring-slate-400',
    },
    Rohan: {
      bg: 'bg-amber-700',
      border: 'border-amber-500',
      text: 'text-amber-50',
      accent: 'text-amber-200',
      gradient: 'bg-gradient-to-br from-amber-700 via-amber-600 to-yellow-700',
      ring: 'ring-amber-400',
    },
    Dwarven: {
      bg: 'bg-orange-900',
      border: 'border-orange-700',
      text: 'text-orange-50',
      accent: 'text-orange-300',
      gradient: 'bg-gradient-to-br from-orange-900 via-amber-900 to-orange-900',
      ring: 'ring-orange-400',
    },
    Ringwraith: {
      bg: 'bg-purple-950',
      border: 'border-purple-700',
      text: 'text-purple-50',
      accent: 'text-purple-300',
      gradient: 'bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950',
      ring: 'ring-purple-500',
    },
    Sauron: {
      bg: 'bg-red-950',
      border: 'border-red-700',
      text: 'text-red-50',
      accent: 'text-red-300',
      gradient: 'bg-gradient-to-br from-red-950 via-red-900 to-red-950',
      ring: 'ring-red-500',
    },
    Moria: {
      bg: 'bg-rose-950',
      border: 'border-rose-800',
      text: 'text-rose-50',
      accent: 'text-rose-400',
      gradient: 'bg-gradient-to-br from-rose-950 via-red-950 to-stone-900',
      ring: 'ring-rose-500',
    },
    Isengard: {
      bg: 'bg-zinc-900',
      border: 'border-zinc-600',
      text: 'text-zinc-50',
      accent: 'text-zinc-300',
      gradient: 'bg-gradient-to-br from-zinc-900 via-zinc-800 to-neutral-900',
      ring: 'ring-zinc-500',
    },
    Dunland: {
      bg: 'bg-orange-800',
      border: 'border-orange-600',
      text: 'text-orange-50',
      accent: 'text-orange-200',
      gradient: 'bg-gradient-to-br from-orange-800 via-red-800 to-orange-900',
      ring: 'ring-orange-500',
    },
  };
  
  return classes[culture];
}
