'use client';

import Card, { CardData } from './Card';

interface Site {
  id: number;
  name: string;
  site_number: number;
  shadow_number: number;
  game_text?: string;
  region?: 'sanctuary' | 'wilderness' | 'underground';
  image_url?: string;
}

interface SitePathProps {
  sites: CardData[];
  currentSite: number;
  onSiteClick: (siteNumber: number) => void;
  totalSites?: number;
}

const defaultSites: Site[] = [
  { id: 1, name: 'Bag End', site_number: 1, shadow_number: 0, region: 'sanctuary', image_url: '/cards/sites/bag-end.jpg' },
  { id: 2, name: 'East Road', site_number: 2, shadow_number: 3, region: 'wilderness' },
  { id: 3, name: 'Weathertop', site_number: 3, shadow_number: 5, region: 'wilderness', image_url: '/cards/sites/weathertop.jpg' },
  { id: 4, name: 'Rivendell', site_number: 4, shadow_number: 0, region: 'sanctuary', image_url: '/cards/sites/rivendell.jpg' },
  { id: 5, name: 'Moria Gate', site_number: 5, shadow_number: 6, region: 'underground', image_url: '/cards/sites/moria-gate.jpg' },
  { id: 6, name: 'Lothlórien', site_number: 6, shadow_number: 0, region: 'sanctuary', image_url: '/cards/sites/lothlorien.jpg' },
  { id: 7, name: 'Amon Hen', site_number: 7, shadow_number: 7, region: 'wilderness' },
  { id: 8, name: 'Fangorn', site_number: 8, shadow_number: 4, region: 'wilderness' },
  { id: 9, name: 'Mount Doom', site_number: 9, shadow_number: 9, region: 'underground', image_url: '/cards/sites/mount-doom.jpg' },
];

export default function SitePath({ 
  sites, 
  currentSite, 
  onSiteClick,
  totalSites = 9 
}: SitePathProps) {
  const displaySites = sites.length > 0 ? sites : defaultSites;

  const regionStyles = {
    sanctuary: {
      gradient: 'from-emerald-800 via-emerald-900 to-emerald-950',
      border: 'border-emerald-500',
      glow: 'shadow-emerald-500/30',
      icon: '🏠',
    },
    wilderness: {
      gradient: 'from-amber-800 via-amber-900 to-amber-950',
      border: 'border-amber-600',
      glow: 'shadow-amber-500/30',
      icon: '🌲',
    },
    underground: {
      gradient: 'from-stone-700 via-stone-900 to-black',
      border: 'border-stone-500',
      glow: 'shadow-stone-500/30',
      icon: '⛰️',
    },
  };

  return (
    <div className="flex items-center gap-0.5 bg-black/30 backdrop-blur rounded-xl p-2 border border-amber-900/50">
      {displaySites.slice(0, totalSites).map((site, index) => {
        const siteData = site as Site;
        const siteNumber = siteData.site_number || index + 1;
        const shadowNumber = siteData.shadow_number ?? 3;
        const region = siteData.region || 'wilderness';
        const isCurrent = siteNumber === currentSite;
        const isPast = siteNumber < currentSite;
        const isNext = siteNumber === currentSite + 1;
        const style = regionStyles[region];

        return (
          <div key={siteData.id || index} className="flex items-center">
            {/* Site Card - Compact */}
            <button
              onClick={() => isNext && onSiteClick(siteNumber)}
              disabled={!isNext}
              className={`
                relative transition-all duration-200
                ${isCurrent ? 'scale-105 z-10' : ''}
                ${isPast ? 'opacity-40 grayscale scale-95' : ''}
                ${isNext ? 'hover:scale-105 cursor-pointer animate-pulse' : 'cursor-default'}
              `}
            >
              {/* Site mini-card - Much smaller */}
              <div 
                className={`
                  w-10 h-14 rounded border overflow-hidden relative
                  bg-gradient-to-b ${style.gradient} ${style.border}
                  ${isCurrent ? `ring-1 ring-yellow-400 shadow-md ${style.glow}` : ''}
                  ${isNext ? 'ring-1 ring-blue-400' : ''}
                `}
              >
                {/* Site number badge */}
                <div className="absolute -top-0.5 -left-0.5 w-3.5 h-3.5 bg-black rounded-full flex items-center justify-center text-[7px] font-bold border border-amber-500 z-10">
                  {siteNumber}
                </div>

                {/* Shadow number badge */}
                <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-purple-900 rounded-full flex items-center justify-center text-[7px] font-bold border border-purple-400 z-10">
                  {shadowNumber}
                </div>

                {/* Site art/content */}
                <div className="h-full flex flex-col pt-2">
                  {/* Art area */}
                  <div className="flex-1 flex items-center justify-center bg-black/20 relative overflow-hidden">
                    {siteData.image_url ? (
                      <img 
                        src={siteData.image_url} 
                        alt={siteData.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : null}
                    <span className={`text-sm ${siteData.image_url ? 'absolute opacity-50' : ''}`}>
                      {style.icon}
                    </span>
                  </div>
                  
                  {/* Site name */}
                  <div className="bg-black/50 px-0.5 text-center">
                    <p className="text-[5px] font-bold truncate text-white">{siteData.name}</p>
                  </div>
                </div>

                {/* Current site marker */}
                {isCurrent && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 z-20">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center text-[8px] shadow-md animate-bounce border border-yellow-300">
                      🚶
                    </div>
                  </div>
                )}
              </div>
            </button>

            {/* Connection path - Shorter */}
            {index < totalSites - 1 && (
              <div className="flex items-center mx-0">
                <div className={`w-2 h-px ${isPast ? 'bg-amber-600' : 'bg-amber-900/50'}`} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
