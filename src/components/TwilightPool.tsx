'use client';

interface TwilightPoolProps {
  count: number;
  onChange?: (delta: number) => void;
  maxDisplay?: number;
}

export default function TwilightPool({ count, onChange, maxDisplay = 20 }: TwilightPoolProps) {
  // Pool gets more ominous as it fills
  const intensity = Math.min(count / 10, 1);
  const glowIntensity = Math.min(count / 5, 1);

  return (
    <div className="flex items-center gap-3 rounded-xl px-4 py-2 transition-all duration-500"
      style={{ 
        background: `linear-gradient(135deg, rgba(90,50,120,${0.3 + intensity * 0.3}) 0%, rgba(60,30,90,${0.4 + intensity * 0.3}) 100%)`,
        border: '2px solid rgba(140,100,180,0.5)',
        boxShadow: count > 5 ? `0 0 ${10 + glowIntensity * 15}px rgba(120,80,160,${0.3 + glowIntensity * 0.3})` : 'none'
      }}>
      <span className="text-purple-300 font-bold text-xs tracking-wider">TWILIGHT</span>
      
      <div className="flex items-center gap-1 min-w-[60px]">
        {count <= 8 ? (
          <div className="flex flex-wrap gap-0.5">
            {Array.from({ length: count }).map((_, i) => (
              <span key={i} className="text-purple-300 text-lg" style={{ 
                textShadow: count > 4 ? `0 0 ${4 + (i/count) * 6}px rgba(180,140,220,0.8)` : 'none',
                animation: count > 6 ? 'pulse 2s infinite' : 'none',
                animationDelay: `${i * 100}ms`
              }}>◆</span>
            ))}
            {count === 0 && <span className="text-purple-500/50">◇</span>}
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <span className="text-purple-300 text-2xl" style={{ textShadow: '0 0 10px rgba(180,140,220,0.8)' }}>◆</span>
            <span className="text-2xl font-bold text-purple-200">×{count}</span>
          </div>
        )}
      </div>

      {onChange && (
        <div className="flex gap-1">
          <button onClick={() => onChange(-1)} disabled={count === 0}
            className="w-6 h-6 rounded font-bold text-sm transition-colors disabled:opacity-30"
            style={{ background: 'rgba(140,100,180,0.4)', color: '#E0D0F0' }}>−</button>
          <button onClick={() => onChange(1)}
            className="w-6 h-6 rounded font-bold text-sm transition-colors"
            style={{ background: 'rgba(140,100,180,0.4)', color: '#E0D0F0' }}>+</button>
        </div>
      )}
    </div>
  );
}
