import { useCallback, useEffect, useState } from 'react'
import { api } from '../lib/api'

// GET helper. Keeps showing the previous data while a refetch is in flight,
// so filters, pagination and reloads do not flash empty.
export function useApi(path) {
  const [tick, setTick] = useState(0)
  const [result, setResult] = useState({ key: null, data: null, error: null })

  useEffect(() => {
    if (!path) return
    const key = `${path}|${tick}`
    let cancelled = false
    api
      .get(path)
      .then((data) => !cancelled && setResult({ key, data, error: null }))
      .catch((error) => !cancelled && setResult({ key, data: null, error }))
    return () => {
      cancelled = true
    }
  }, [path, tick])

  const reload = useCallback(() => setTick((t) => t + 1), [])
  const loading = !!path && result.key !== `${path}|${tick}`

  return { data: result.data, error: result.error, loading, reload }
}
