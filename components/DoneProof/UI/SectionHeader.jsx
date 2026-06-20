import { ChevronRight } from 'lucide-react'

export default function SectionHeader({ title, action, onAction }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-base font-semibold text-stone-800">{title}</h2>
      {action && (
        <button 
          onClick={onAction} 
          className="text-sm font-medium text-sky-600 flex items-center gap-0.5"
        >
          {action} <ChevronRight size={15} />
        </button>
      )}
    </div>
  );
}
