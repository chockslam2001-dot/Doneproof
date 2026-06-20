export default function ProgressRing({ percent, size = 64, stroke = 7 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle 
        cx={size / 2} 
        cy={size / 2} 
        r={r} 
        fill="none" 
        stroke="currentColor" 
        className="text-stone-100" 
        strokeWidth={stroke} 
      />
      <circle
        cx={size / 2} 
        cy={size / 2} 
        r={r} 
        fill="none" 
        stroke="currentColor" 
        className="text-sky-400"
        strokeWidth={stroke} 
        strokeDasharray={c} 
        strokeDashoffset={offset} 
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(0.22,1,0.36,1)" }}
      />
    </svg>
  );
}
