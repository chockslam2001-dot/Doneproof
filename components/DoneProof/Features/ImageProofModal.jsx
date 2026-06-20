import { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export default function ImageProofModal({ task, proofImages, onClose }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  if (!proofImages || proofImages.length === 0) return null;

  const current = proofImages[currentIdx];

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-between bg-stone-900">
      <div className="flex items-center justify-between px-5 py-4 border-b border-stone-800">
        <h3 className="text-lg font-display text-white">{task.name}</h3>
        <button
          onClick={onClose}
          className="h-8 w-8 flex items-center justify-center rounded-full bg-stone-700 text-stone-300 hover:bg-stone-600 active:scale-95 transition-all"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-6 overflow-hidden">
        <img
          src={current.url}
          alt={`Proof ${currentIdx + 1}`}
          className="max-h-full max-w-full object-contain rounded-2xl animate-softFade"
        />
      </div>

      <div className="space-y-3 px-5 py-4 border-t border-stone-800">
        {/* Thumbnails */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {proofImages.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setCurrentIdx(idx)}
              className={`shrink-0 h-16 w-16 rounded-xl overflow-hidden border-2 transition-all ${
                idx === currentIdx ? "border-sky-400 ring-2 ring-sky-200" : "border-stone-700"
              }`}
            >
              <img src={img.url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        {/* Info and Navigation */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-stone-400">
            {currentIdx + 1} of {proofImages.length}
          </span>
          <span className="text-sm text-stone-500">{current.timestamp}</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setCurrentIdx((i) => (i - 1 + proofImages.length) % proofImages.length)}
            disabled={proofImages.length <= 1}
            className="flex-1 py-3 text-sm font-semibold text-stone-400 bg-stone-800 rounded-2xl hover:bg-stone-700 disabled:opacity-50 transition-colors"
          >
            <ChevronLeft size={18} className="mx-auto" />
          </button>
          <button
            onClick={() => setCurrentIdx((i) => (i + 1) % proofImages.length)}
            disabled={proofImages.length <= 1}
            className="flex-1 py-3 text-sm font-semibold text-stone-400 bg-stone-800 rounded-2xl hover:bg-stone-700 disabled:opacity-50 transition-colors"
          >
            <ChevronRight size={18} className="mx-auto" />
          </button>
        </div>
      </div>
    </div>
  );
}
