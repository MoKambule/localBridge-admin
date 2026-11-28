import { useEffect } from 'react'
import { X } from 'lucide-react'

// Bottom sheet on phones, right-hand panel from sm up.
function Sheet({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-black/40 animate-fade-in" onClick={onClose} />
      <div className="absolute bottom-0 inset-x-0 max-h-[85dvh] sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-96 bg-white rounded-t-2xl sm:rounded-none shadow-2xl flex flex-col animate-sheet-up sm:animate-sheet-left">
        <div className="sm:hidden mx-auto mt-2 h-1 w-10 rounded-full bg-gray-300" />
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-brand-900">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 -mr-2 rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        <div className="overflow-y-auto p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Sheet
