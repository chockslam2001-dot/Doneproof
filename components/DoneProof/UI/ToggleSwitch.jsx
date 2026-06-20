export default function ToggleSwitch({ on, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      aria-pressed={on}
      aria-label={label}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-sky-300 ${
        on ? "bg-sky-400" : "bg-stone-200"
      }`}
    >
      <span 
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-300 ${
          on ? "translate-x-6" : "translate-x-1"
        }`} 
      />
    </button>
  );
}
