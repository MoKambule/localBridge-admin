import { AlertCircle, RefreshCw } from 'lucide-react'

export function Skeleton({ rows = 4 }) {
  return (
    <div className="animate-pulse space-y-3 p-4" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="h-14 rounded-xl bg-gray-100" />
      ))}
    </div>
  )
}

export function ErrorBox({ error, onRetry }) {
  return (
    <div className="m-4 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-800 flex items-start gap-3">
      <AlertCircle size={18} className="mt-0.5 shrink-0" />
      <div className="flex-1">
        <p className="font-medium">Couldn&apos;t load this data</p>
        <p className="text-red-700">{error?.message || 'Unknown error'}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 font-medium text-red-800 hover:underline"
        >
          <RefreshCw size={14} /> Retry
        </button>
      )}
    </div>
  )
}

export function Empty({ children }) {
  return <p className="text-center text-gray-500 py-10 text-sm">{children}</p>
}
