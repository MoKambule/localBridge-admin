import { useCallback, useState } from 'react'
import { AlertCircle, CheckCircle2, Info } from 'lucide-react'
import { ToastContext } from './toastContext'

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const toast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500)
  }, [])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        aria-live="polite"
        className="fixed z-[70] inset-x-0 bottom-[calc(5rem+env(safe-area-inset-bottom))] lg:bottom-6 flex flex-col items-center gap-2 px-4 pointer-events-none"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="animate-toast pointer-events-auto flex items-center gap-2 bg-brand-900 text-white text-sm px-4 py-3 rounded-xl shadow-lg max-w-sm"
          >
            {t.type === 'success' ? (
              <CheckCircle2 size={18} className="text-emerald-300 shrink-0" />
            ) : t.type === 'error' ? (
              <AlertCircle size={18} className="text-red-300 shrink-0" />
            ) : (
              <Info size={18} className="text-sky-300 shrink-0" />
            )}
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
