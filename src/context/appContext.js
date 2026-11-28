import { createContext, useContext } from 'react'

export const AuthContext = createContext(null)
export const StatsContext = createContext({ stats: null, reloadStats: () => {} })

export const useAuth = () => useContext(AuthContext)
export const useStats = () => useContext(StatsContext)
