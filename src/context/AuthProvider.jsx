import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'
import { AuthContext } from './appContext'

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    api
      .get('/auth/me')
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setReady(true))

    const onExpired = () => setUser(null)
    window.addEventListener('lb:unauthorized', onExpired)
    return () => window.removeEventListener('lb:unauthorized', onExpired)
  }, [])

  const login = useCallback(async (email, password) => {
    setUser(await api.post('/auth/login', { email, password }))
  }, [])

  const logout = useCallback(async () => {
    await api.post('/auth/logout').catch(() => {})
    setUser(null)
  }, [])

  const value = useMemo(() => ({ user, ready, login, logout }), [user, ready, login, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
