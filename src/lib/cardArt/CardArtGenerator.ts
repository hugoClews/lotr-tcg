// CardArtGenerator - Main Utility for Generating Card Art

import { Culture, CardType, CardArtPrompt, GeneratedArt, SiteArtPrompt } from './types';
import { cultureThemes, characterPrompts, sitePrompts, basePromptTemplate } from './themes';
import { 
  generateCardArtSVG, 
  generateCharacterPortraitSVG, 
  generateSiteArtSVG, 
  svgToDataUrl 
} from './svgGenerator';

// Configuration for different AI image generation services
interface AIServiceConfig {
  name: string;
  baseUrl: string;
  apiKeyEnvVar: string;
  requiresApiKey: boolean;
  maxWidth: number;
  maxHeight: number;
}

const AI_SERVICES: Record<string, AIServiceConfig> = {
  // Stable Diffusion via various providers
  stabilityAI: {
    name: 'Stability AI',
    baseUrl: 'https://api.stability.ai/v1/generation',
    apiKeyEnvVar: 'STABILITY_API_KEY',
    requiresApiKey: true,
    maxWidth: 1024,
    maxHeight: 1024,
  },
  
  // OpenAI DALL-E
  openai: {
    name: 'OpenAI DALL-E',
    baseUrl: 'https://api.openai.com/v1/images/generations',
    apiKeyEnvVar: 'OPENAI_API_KEY',
    requiresApiKey: true,
    maxWidth: 1024,
    maxHeight: 1024,
  },
  
  // Replicate (hosts many models)
  replicate: {
    name: 'Replicate',
    baseUrl: 'https://api.replicate.com/v1/predictions',
    apiKeyEnvVar: 'REPLICATE_API_TOKEN',
    requiresApiKey: true,
    maxWidth: 1024,
    maxHeight: 1024,
  },
  
  // Placeholder service (always works)
  placeholder: {
    name: 'SVG Placeholder',
    baseUrl: '',
    apiKeyEnvVar: '',
    requiresApiKey: false,
    maxWidth: 512,
    maxHeight: 512,
  },
};

export class CardArtGenerator {
  private preferredService: string;
  
  constructor(preferredService: string = 'placeholder') {
    this.preferredService = preferredService;
  }
  
  // Generate a full prompt for AI image generation
  generatePrompt(options: CardArtPrompt): string {
    const theme = cultureThemes[options.culture];
    
    let prompt = basePromptTemplate(options.culture, options.cardType);
    
    if (options.character && characterPrompts[options.character]) {
      prompt = characterPrompts[options.character] + ', ' + prompt;
    }
    
    if (options.mood) {
      prompt += `, ${options.mood} mood`;
    }
    
    if (options.scene) {
      prompt += `, scene: ${options.scene}`;
    }
    
    if (options.additionalDetails) {
      prompt += `, ${options.additionalDetails}`;
    }
    
    // Add negative prompts for better quality
    const negativePrompt = 'blurry, low quality, text, watermark, signature, modern elements, anachronistic';
    
    return prompt;
  }
  
  // Generate site art prompt
  generateSitePrompt(siteNumber: number): string | null {
    const site = sitePrompts[siteNumber];
    if (!site) return null;
    
    return `${site.prompt}, fantasy trading card art, cinematic landscape, epic scale, detailed environment`;
  }
  
  // Generate card art using SVG (always available fallback)
  generateSVGArt(
    culture: Culture,
    cardName: string,
    cardType: CardType = 'Character',
    dimensions: { width: number; height: number } = { width: 200, height: 280 }
  ): GeneratedArt {
    const svgContent = generateCardArtSVG(culture, cardName, dimensions.width, dimensions.height, cardType);
    const dataUrl = svgToDataUrl(svgContent);
    const prompt = this.generatePrompt({ culture, cardType, character: cardName });
    
    return {
      svgContent,
      dataUrl,
      prompt,
      culture,
      timestamp: Date.now(),
    };
  }
  
  // Generate character portrait
  generateCharacterPortrait(
    characterName: string,
    culture: Culture,
    dimensions: { width: number; height: number } = { width: 200, height: 200 }
  ): GeneratedArt {
    const svgContent = generateCharacterPortraitSVG(characterName, culture, dimensions.width, dimensions.height);
    const dataUrl = svgToDataUrl(svgContent);
    const prompt = characterPrompts[characterName] || this.generatePrompt({ 
      culture, 
      cardType: 'Character', 
      character: characterName 
    });
    
    return {
      svgContent,
      dataUrl,
      prompt,
      culture,
      timestamp: Date.now(),
    };
  }
  
  // Generate site art
  generateSiteArt(
    siteName: string,
    siteNumber: number,
    kingdom: string,
    dimensions: { width: number; height: number } = { width: 200, height: 140 }
  ): { svgContent: string; dataUrl: string; prompt: string } {
    const svgContent = generateSiteArtSVG(siteName, siteNumber, kingdom, dimensions.width, dimensions.height);
    const dataUrl = svgToDataUrl(svgContent);
    const prompt = this.generateSitePrompt(siteNumber) || `${siteName}, ${kingdom} region, fantasy landscape`;
    
    return {
      svgContent,
      dataUrl,
      prompt,
    };
  }
  
  // Get all prompts for a culture (useful for batch generation)
  getAllCulturePrompts(culture: Culture): {
    cardArt: string;
    companion: string;
    minion: string;
    event: string;
    possession: string;
  } {
    const theme = cultureThemes[culture];
    
    return {
      cardArt: basePromptTemplate(culture, 'Character'),
      companion: `${theme.artStyle}, heroic warrior, determined expression, ${basePromptTemplate(culture, 'Character')}`,
      minion: `${theme.artStyle}, threatening enemy, menacing pose, ${basePromptTemplate(culture, 'Character')}`,
      event: `${theme.artStyle}, dramatic action scene, magical effects, ${basePromptTemplate(culture, 'Event')}`,
      possession: `${theme.artStyle}, legendary item, glowing with power, detailed craftsmanship, ${basePromptTemplate(culture, 'Possession')}`,
    };
  }
  
  // Export configuration for external AI services
  getAIServiceConfig(): typeof AI_SERVICES {
    return AI_SERVICES;
  }
  
  // Check which AI services are available (have API keys)
  checkAvailableServices(): string[] {
    const available: string[] = ['placeholder']; // Always available
    
    for (const [key, config] of Object.entries(AI_SERVICES)) {
      if (config.requiresApiKey) {
        const envKey = config.apiKeyEnvVar;
        if (typeof process !== 'undefined' && process.env && process.env[envKey]) {
          available.push(key);
        }
      }
    }
    
    return available;
  }
  
  // Generate batch art for all cultures
  generateAllCultureSamples(): Map<Culture, GeneratedArt> {
    const samples = new Map<Culture, GeneratedArt>();
    const cultures: Culture[] = [
      'Shire', 'Elven', 'Gandalf', 'Gondor', 'Rohan', 'Dwarven',
      'Ringwraith', 'Sauron', 'Moria', 'Isengard', 'Dunland'
    ];
    
    for (const culture of cultures) {
      samples.set(culture, this.generateSVGArt(culture, `Sample ${culture} Card`));
    }
    
    return samples;
  }
  
  // Generate batch character portraits
  generateKeyCharacterPortraits(): Map<string, GeneratedArt> {
    const portraits = new Map<string, GeneratedArt>();
    
    const characters: Array<{ name: string; culture: Culture }> = [
      { name: 'Frodo Baggins', culture: 'Shire' },
      { name: 'Samwise Gamgee', culture: 'Shire' },
      { name: 'Aragorn', culture: 'Gondor' },
      { name: 'Legolas', culture: 'Elven' },
      { name: 'Gimli', culture: 'Dwarven' },
      { name: 'Gandalf the Grey', culture: 'Gandalf' },
      { name: 'Gandalf the White', culture: 'Gandalf' },
      { name: 'Boromir', culture: 'Gondor' },
      { name: 'Witch-king', culture: 'Ringwraith' },
      { name: 'Saruman', culture: 'Isengard' },
      { name: 'Gollum', culture: 'Sauron' },
      { name: 'Lurtz', culture: 'Isengard' },
    ];
    
    for (const char of characters) {
      portraits.set(char.name, this.generateCharacterPortrait(char.name, char.culture));
    }
    
    return portraits;
  }
  
  // Generate all site arts
  generateAllSiteArts(): Map<number, { svgContent: string; dataUrl: string; prompt: string; name: string }> {
    const sites = new Map();
    
    for (const [siteNum, siteData] of Object.entries(sitePrompts)) {
      const num = parseInt(siteNum);
      const art = this.generateSiteArt(siteData.name, num, siteData.kingdom);
      sites.set(num, { ...art, name: siteData.name });
    }
    
    return sites;
  }
}

// Export singleton instance
export const cardArtGenerator = new CardArtGenerator();

// Export helper functions
export { generateCardArtSVG, generateCharacterPortraitSVG, generateSiteArtSVG, svgToDataUrl };
export { cultureThemes, characterPrompts, sitePrompts, getCultureTailwindClasses } from './themes';
