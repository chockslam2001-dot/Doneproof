import { useState, useEffect } from 'react'
import { breathingPatterns } from '../constants'

export default function BreathingCircle({ patternKey }) {
  const pattern = breathingPatterns[patternKey];
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [count, setCount] = useState(pattern.phases[0].s);

  useEffect(() => {
    setPhaseIdx(0);
    setCount(pattern.phases[0].s);
  }, [patternKey]);

  useEffect(() => {
    const t = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          setPhaseIdx((p) => (p + 1) % pattern.phases.length);
          return pattern.phases[(phaseIdx + 1) % pattern.phases.length].s;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phaseIdx, pattern]);

  const phase = pattern.phases[phaseIdx];
  const isIn = phase.l === "Breathe in";
  const isOut = phase.l === "Breathe out";
  const scale = isIn ? 1.3 : isOut ? 1 : phaseIdx === 0 ? 1 : 1.3;

  return (
    <div className="flex flex-col items-center py-6">
      <div className="relative h-44 w-44 flex items-center justify-center">
        <div 
          className="absolute inset-0 rounded-full bg-sky-100" 
          style={{ transform: `scale(${scale})`, transition: `transform ${phase.s}s ease-in-out` }} 
        />
        <div 
          className="absolute inset-3 rounded-full bg-sky-200" 
          style={{ transform: `scale(${scale})`, transition: `transform ${phase.s}s ease-in-out`, opacity: 0.8 }} 
        />
        <div className="relative h-20 w-20 rounded-full bg-white shadow-md flex flex-col items-center justify-center">
          <span className="text-2xl font-display text-sky-600">{count}</span>
        </div>
      </div>
      <p className="mt-5 text-lg font-display text-stone-700">{phase.l}</p>
      <p className="text-sm text-stone-400 mt-0.5">{pattern.label}</p>
    </div>
  );
}
