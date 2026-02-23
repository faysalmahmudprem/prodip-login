import React, { useState, useEffect, useRef } from 'react';
import { LightStatus } from '../App';

interface LampProps {
  isOn: boolean;
  onToggle: () => void;
  status: LightStatus;
}

export const Lamp: React.FC<LampProps> = ({ isOn, onToggle, status }) => {
  const [isPulling, setIsPulling] = useState(false);
  const pullTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // FIX: Cleanup timeout on unmount to avoid setState on unmounted component
  useEffect(() => {
    return () => { if (pullTimerRef.current) clearTimeout(pullTimerRef.current); };
  }, []);

  // Space bar shortcut
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (e.target as HTMLElement).tagName !== 'INPUT') {
        e.preventDefault();
        handlePull();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isPulling]);

  const handlePull = () => {
    if (isPulling) return;
    setIsPulling(true);
    onToggle();
    pullTimerRef.current = setTimeout(() => setIsPulling(false), 350);
  };

  const getLightColors = () => {
    switch (status) {
      case 'error':   return { shade: '#fca5a5', bulb: '#ef4444', glow: '#dc2626' };
      case 'success': return { shade: '#dcfce7', bulb: '#86efac', glow: '#4ade80' };
      default:        return { shade: '#fef9c3', bulb: '#fef08a', glow: '#facc15' };
    }
  };

  const colors = getLightColors();

  return (
    <div className="relative w-full h-full flex justify-center items-end z-20">
      <svg
        viewBox="0 0 400 600"
        className="w-full h-full drop-shadow-2xl"
        preserveAspectRatio="xMidYMax meet"
      >
        <defs>
          <linearGradient id="standGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#cbd5e1" />
            <stop offset="20%"  stopColor="#e2e8f0" />
            <stop offset="80%"  stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <filter id="bulbGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Stand & Base */}
        <rect x="190" y="300" width="20" height="250" fill="url(#standGradient)" rx="2" />
        <ellipse cx="200" cy="550" rx="70" ry="15" fill="#e2e8f0" />
        <path d="M 130 550 v 10 a 70 15 0 0 0 140 0 v -10" fill="#94a3b8" />

        {/* Shade Interior */}
        <ellipse
          cx="200" cy="380" rx="120" ry="20"
          fill={isOn ? colors.shade : '#334155'}
          className="transition-colors duration-300"
        />

        {/* Bulb glow */}
        {isOn && (
          <ellipse
            cx="200" cy="380" rx="60" ry="10"
            fill={colors.bulb}
            filter="url(#bulbGlow)"
            opacity="0.9"
            className="transition-colors duration-200"
          />
        )}

        {/* FIX: Rope with MUCH larger transparent hit area (80px wide, full rope height) */}
        <g
          className="cursor-pointer"
          onClick={handlePull}
          style={{ transformOrigin: '200px 380px' }}
        >
          {/* Visible rope line */}
          <line
            x1="180" y1="380"
            x2="180" y2={isPulling ? 495 : 480}
            stroke="#e2e8f0" strokeWidth="3"
            className="transition-all duration-300 ease-in-out"
          />
          {/* Rope knob */}
          <g style={{ transform: isPulling ? 'translateY(15px)' : 'translateY(0)', transition: 'transform 0.3s ease-in-out' }}>
            <circle cx="180" cy="485" r="8" fill="#f1f5f9" />
            <path d="M 180 480 L 176 490 L 184 490 Z" fill="#f1f5f9" />
          </g>
          {/* FIX: Large invisible hit rect - 80px wide, centered on rope */}
          <rect x="140" y="370" width="80" height="140" fill="transparent" />
        </g>

        {/* Shade Exterior */}
        <g style={{ pointerEvents: 'none' }}>
          <path
            d="M 125 180 Q 200 170 275 180 L 320 380 Q 200 400 80 380 Z"
            fill="#749871"
          />
          <path
            d="M 125 180 Q 200 170 240 178 L 260 384 Q 200 400 80 380 Z"
            fill="#86a883" opacity="0.3"
            style={{ mixBlendMode: 'screen' }}
          />

          {/* Face */}
          <g transform="translate(0, 15)">
            {/* Eyes */}
            <path d="M 155 260 Q 170 245 185 260" fill="none" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" />
            <path d="M 215 260 Q 230 245 245 260" fill="none" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" />

            {/* Mouth changes with status */}
            {status === 'error' ? (
              <circle cx="200" cy="300" r="10" fill="#1e293b" />
            ) : status === 'success' ? (
              <path d="M 175 285 Q 200 335 225 285" fill="#1e293b" />
            ) : (
              <g>
                <path d="M 175 285 Q 200 335 225 285" fill="#1e293b" />
                <path d="M 175 285 Q 200 295 225 285" fill="#1e293b" />
                <mask id="mouthMask">
                  <path d="M 175 285 Q 200 335 225 285 Z" fill="white" />
                </mask>
                <circle cx="200" cy="320" r="15" fill="#ef4444" mask="url(#mouthMask)" />
              </g>
            )}
          </g>
        </g>
      </svg>

      {/* Tooltip - only shows when lamp is off */}
      <div className={`absolute top-[78%] left-[18%] bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-[11px] font-medium px-3 py-1 rounded-full pointer-events-none transition-all duration-700 shadow-lg whitespace-nowrap z-50 ${isOn ? 'opacity-0 translate-y-4 scale-95' : 'opacity-100 animate-pulse'}`}>
        Click to pull
        <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-white/20" />
      </div>
    </div>
  );
};
