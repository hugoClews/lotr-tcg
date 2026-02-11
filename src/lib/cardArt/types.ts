// Card Art Types and Interfaces

export type Culture = 
  | 'Shire' | 'Elven' | 'Gandalf' | 'Gondor' | 'Rohan' | 'Dwarven'  // Free Peoples
  | 'Ringwraith' | 'Sauron' | 'Moria' | 'Isengard' | 'Dunland';      // Shadow

export type CardType = 'Character' | 'Event' | 'Possession' | 'Condition' | 'Site' | 'Ally';

export interface CultureTheme {
  name: Culture;
  side: 'free_peoples' | 'shadow';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  borderColor: string;
  textColor: string;
  bgGradient: string;
  symbol: string;
  symbolUnicode: string;
  artStyle: string;
  keywords: string[];
}

export interface CardArtPrompt {
  character?: string;
  culture: Culture;
  cardType: CardType;
  mood?: string;
  scene?: string;
  additionalDetails?: string;
}

export interface GeneratedArt {
  svgContent: string;
  dataUrl: string;
  prompt: string;
  culture: Culture;
  timestamp: number;
}

export interface SiteArtPrompt {
  siteName: string;
  siteNumber: number;
  kingdom: string;
  description?: string;
}
