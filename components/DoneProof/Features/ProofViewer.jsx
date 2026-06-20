import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProofViewer({ item, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Combine all proofs into a single array
  const allProofs = [
    ...(item.proofImages || []).map(img => ({ ...img, type: 'image' })),
    ...(item.proofAudios || []).map(audio => ({ ...audio, type: 'audio' }))
  ];

  if (allProofs.length === 0) return null;

  const currentProof = allProofs[currentIndex];
  const isImage = currentProof.type === 'image';

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-between bg-stone-900">
      <div className="flex items-center justify-between px-5 py-4 border-b border-stone-800">
        <h3 className="text-lg font-display text-white">{item.name || item.task || 'Proof'}</h3>
        <button
          onClick={onClose}
          className="h-8 w-8 flex items-center justify-center rounded-full bg-stone-700 text-stone-300 hover:bg-stone-600 active:scale-95 transition-all"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-6 overflow-hidden">
        {isImage ? (
          <img
            src={currentProof.url}
            alt={`Proof ${currentIndex + 1}`}
            className="max-h-full max-w-full object-contain rounded-2xl animate-softFade"
          />
        ) : (
          <div className="w-full max-w-sm space-y-4 animate-softFade">
            <div className="bg-stone-800 rounded-2xl p-6 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-sky-500 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <audio controls src={currentProof.url} className="w-full" />
            {currentProof.duration && (
              <p className="text-center text-sm text-stone-400">
                Duration: {Math.floor(currentProof.duration / 60)}:{(currentProof.duration % 60).toString().padStart(2, '0')}
              </p>
            )}
          </div>
        )}
      </div>

      {allProofs.length > 1 && (
        <div className="space-y-3 px-5 py-4 border-t border-stone-800">
          {/* Thumbnails/indicators */}
          <div className="flex gap-2 overflow-x-auto scrollbar-none">
            {allProofs.map((proof, idx) => (
              <button
                key={proof.id}
                onClick={() => setCurrentIndex(idx)}
                className={`shrink-0 h-16 w-16 rounded-xl overflow-hidden border-2 transition-all flex items-center justify-center ${
                  idx === currentIndex ? 'border-sky-400 ring-2 ring-sky-200' : 'border-stone-700'
                } ${proof.type === 'audio' ? 'bg-stone-800' : ''}`}
              >
                {proof.type === 'image' ? (
                  <img src={proof.url} alt={`Proof ${idx + 1}`} className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-6 h-6 text-stone-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                  </svg>
                )}
              </button>
            ))}
          </div>

          {/* Info and Navigation */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-stone-400">
              {currentIndex + 1} of {allProofs.length}
            </span>
            <span className="text-sm text-stone-500">{currentProof.timestamp}</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentIndex((i) => (i - 1 + allProofs.length) % allProofs.length)}
              className="flex-1 py-3 text-sm font-semibold text-stone-400 bg-stone-800 rounded-2xl hover:bg-stone-700 transition-colors"
            >
              <ChevronLeft size={18} className="mx-auto" />
            </button>
            <button
              onClick={() => setCurrentIndex((i) => (i + 1) % allProofs.length)}
              className="flex-1 py-3 text-sm font-semibold text-stone-400 bg-stone-800 rounded-2xl hover:bg-stone-700 transition-colors"
            >
              <ChevronRight size={18} className="mx-auto" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}