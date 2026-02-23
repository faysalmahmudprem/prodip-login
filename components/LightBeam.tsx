import React, { useEffect, useRef } from 'react';
import { LightStatus } from '../App';

interface LightBeamProps {
  isOn: boolean;
  status: LightStatus;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

export const LightBeam: React.FC<LightBeamProps> = ({ isOn, status }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  const getBeamGradient = () => {
    switch (status) {
      case 'error': return 'linear-gradient(to bottom, rgba(239,68,68,0.2) 0%, rgba(239,68,68,0.05) 40%, transparent 80%)';
      case 'success': return 'linear-gradient(to bottom, rgba(74,222,128,0.25) 0%, rgba(74,222,128,0.1) 40%, transparent 80%)';
      default: return 'linear-gradient(to bottom, rgba(254,249,195,0.15) 0%, rgba(254,249,195,0.05) 40%, transparent 80%)';
    }
  };

  const getCoreGradient = () => {
    switch (status) {
      case 'error': return 'linear-gradient(to bottom, rgba(239,68,68,0.2) 0%, transparent 70%)';
      case 'success': return 'linear-gradient(to bottom, rgba(134,239,172,0.2) 0%, transparent 70%)';
      default: return 'linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, transparent 70%)';
    }
  };

  // FIX: Canvas always mounted, animation starts/stops based on isOn
  // This prevents the "blank canvas on 2nd toggle" bug
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    if (!isOn) {
      // Stop animation and clear
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current = [];
      window.removeEventListener('resize', resizeCanvas);
      return;
    }

    // Re-initialize particles every time lamp turns on
    particlesRef.current = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: (Math.random() - 0.5) * 0.2 - 0.1,
      opacity: Math.random() * 0.5 + 0.1,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
        ctx.fill();
      });
      requestRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
    };
  }, [isOn]);

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">

      {/* Outer light cone */}
      <div
        className={`absolute left-1/2 top-[63%] w-[180px] md:w-[300px] h-[380px] md:h-[600px] -translate-x-1/2 origin-top transition-all duration-500 ease-out ${isOn ? 'opacity-100 scale-100' : 'opacity-0 scale-y-0'}`}
        style={{
          background: getBeamGradient(),
          clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
          filter: 'blur(8px)',
        }}
      >
        {/* FIX: Canvas always in DOM, never conditionally removed */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      {/* Core beam */}
      <div
        className={`absolute left-1/2 top-[63%] w-[120px] md:w-[200px] h-[250px] md:h-[400px] -translate-x-1/2 origin-top transition-all duration-500 ease-out delay-75 ${isOn ? 'opacity-100 scale-100' : 'opacity-0 scale-y-0'}`}
        style={{
          background: getCoreGradient(),
          clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)',
          filter: 'blur(15px)',
          mixBlendMode: 'overlay',
        }}
      />

      {/* Floor spot */}
      <div
        className={`absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[180px] md:w-[300px] h-[40px] md:h-[60px] rounded-[100%] blur-xl transition-all duration-1000 ${isOn ? 'opacity-100 scale-100' : 'opacity-0 scale-50'} ${status === 'error' ? 'bg-red-500/20' : status === 'success' ? 'bg-green-400/20' : 'bg-yellow-100/5'}`}
      />
    </div>
  );
};
