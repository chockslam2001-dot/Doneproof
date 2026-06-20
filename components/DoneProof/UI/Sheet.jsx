import { X } from 'lucide-react'

export default function Sheet({ open, onClose, children, title, full }) {
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/20" onClick={onClose} />}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 bg-white rounded-t-3xl transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-full"
        } ${full ? "max-h-[95vh]" : "max-h-[85vh]"} overflow-y-auto`}
      >
        <div className="sticky top-0 bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between rounded-t-3xl">
          <h3 className="font-semibold text-stone-800">{title}</h3>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-800">
            <X size={20} />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </>
  );
}
