import React, { useState, useEffect, useRef } from 'react';
import { Lamp } from './components/Lamp';
import { LoginCard } from './components/LoginCard';
import { LightBeam } from './components/LightBeam';

export type LightStatus = 'neutral' | 'error' | 'success';

const App: React.FC = () => {
  const [isLampOn, setIsLampOn] = useState(() => {
    try { return localStorage.getItem('lumi-lamp-state') === 'true'; }
    catch { return false; }
  });

  const [lightStatus, setLightStatus] = useState<LightStatus>('neutral');
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try { localStorage.setItem('lumi-lamp-state', String(isLampOn)); }
    catch { /* ignore */ }
  }, [isLampOn]);

  useEffect(() => {
    return () => { if (errorTimerRef.current) clearTimeout(errorTimerRef.current); };
  }, []);

  const toggleLamp = () => {
    setLightStatus('neutral');
    setIsLampOn(prev => !prev);
  };

  const handleAuthError = () => {
    setLightStatus('error');
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    errorTimerRef.current = setTimeout(() => setLightStatus('neutral'), 800);
  };

  const handleAuthSuccess = () => setLightStatus('success');

  return (
    <div className="relative min-h-screen w-full flex flex-col overflow-x-hidden bg-slate-950 transition-colors duration-1000">

      {/* Fixed background layer so it does not scroll with content */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-slate-950 z-0" />
        <div className={`absolute -top-[10%] -left-[10%] w-[600px] h-[600px] rounded-full blur-[100px] animate-float-slow transition-all duration-1000 ${isLampOn ? 'opacity-60' : 'opacity-20'} ${lightStatus === 'error' ? 'bg-red-900/30' : lightStatus === 'success' ? 'bg-green-900/30' : 'bg-purple-900/20'}`} />
        <div className={`absolute top-[20%] -right-[10%] w-[500px] h-[500px] rounded-full blur-[100px] animate-float-slower transition-all duration-1000 ${isLampOn ? 'opacity-60' : 'opacity-20'} ${lightStatus === 'error' ? 'bg-red-900/20' : lightStatus === 'success' ? 'bg-emerald-900/30' : 'bg-blue-900/10'}`} />
        <div className={`absolute -bottom-[20%] left-[20%] w-[700px] h-[700px] rounded-full blur-[120px] animate-float-slowest transition-all duration-1000 ${isLampOn ? 'opacity-60' : 'opacity-20'} ${lightStatus === 'error' ? 'bg-orange-900/20' : lightStatus === 'success' ? 'bg-green-500/10' : 'bg-emerald-900/10'}`} />
      </div>

      {/* Scrollable content wrapper */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full min-h-screen m-auto max-w-6xl p-4 py-12 gap-8 md:gap-20">
        <div className="relative flex-shrink-0 flex justify-center items-end h-[380px] w-[280px] md:h-[600px] md:w-[400px]">
          <LightBeam isOn={isLampOn} status={lightStatus} />
          <Lamp isOn={isLampOn} onToggle={toggleLamp} status={lightStatus} />
        </div>
        <div className="relative flex-shrink-0 w-full max-w-md min-h-[500px] flex items-center justify-center">
          <LoginCard isVisible={isLampOn} onError={handleAuthError} onSuccess={handleAuthSuccess} />
        </div>
      </div>

      <div className="fixed bottom-0 w-full h-1/4 bg-gradient-to-t from-slate-900 to-transparent opacity-50 pointer-events-none z-0" />
      <div className={`fixed bottom-8 w-full text-center text-xs text-slate-600 transition-opacity duration-500 pointer-events-none select-none z-10 ${isLampOn ? 'opacity-0' : 'opacity-100'}`}>
        Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-500 text-[10px]">Space</kbd> to toggle lamp
      </div>

      {/* Developer Credit */}
      <div className="fixed bottom-2 w-full text-center z-20 pointer-events-none">
        <p className="text-[10px] text-slate-500/70 tracking-wider">
          Developed by{' '}
          <a
            href="https://bio.link/faysalmahmudprem"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-slate-400 hover:text-slate-300 transition-colors pointer-events-auto"
          >
            Faysal Mahmud Prem
          </a>
        </p>
      </div>
    </div>
  );
};

export default App;
