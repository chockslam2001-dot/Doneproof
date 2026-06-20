export default function Toast({ message }) {
  if (!message) return null;
  
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white px-4 py-3 rounded-full text-sm font-medium shadow-lg animate-slideUp max-w-xs text-center">
      {message}
    </div>
  );
}
