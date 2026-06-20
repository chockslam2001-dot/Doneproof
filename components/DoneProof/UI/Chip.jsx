export default function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-200 ${
        active ? "bg-stone-800 text-white" : "bg-stone-100 text-stone-500 hover:bg-stone-200"
      }`}
    >
      {children}
    </button>
  );
}
