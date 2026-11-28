import { useEffect } from 'react'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

import AppLayout from './components/layout/AppLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Opportunities from './pages/Opportunities'
import Businesses from './pages/Businesses'
import Quotations from './pages/Quotations'
import Users from './components/users/Users'
import Applications from './components/provider/Applications'
import ApplicationDetails from './components/provider/ApplicationDetails'
import ComingSoon from './components/ui/ComingSoon'
import { StatsContext, useAuth } from './context/appContext'
import { useApi } from './hooks/useApi'

const comingSoon = [
  ['reports', 'Reports'],
  ['settings', 'Settings'],
]

// Everything inside requires a signed-in admin. Stats are loaded once here so the
// sidebar badge and the dashboard share them.
function Protected() {
  const { user, ready } = useAuth()
  const location = useLocation()
  const { data: stats, error, reload } = useApi(user ? '/stats' : null)

  useEffect(() => {
    if (!user) return
    const t = setInterval(reload, 60_000)
    return () => clearInterval(t)
  }, [user, reload])

  if (!ready) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-brand-900 text-white">
        <Loader2 className="animate-spin" />
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />

  return (
    <StatsContext.Provider value={{ stats, error, reloadStats: reload }}>
      <AppLayout pendingCount={stats?.pendingApplications ?? 0} />
    </StatsContext.Provider>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<Protected />}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="businesses" element={<Businesses />} />
        <Route path="applications" element={<Applications />} />
        <Route path="applications/:id" element={<ApplicationDetails />} />
        <Route path="opportunities" element={<Opportunities />} />
        <Route path="quotations" element={<Quotations />} />

        {comingSoon.map(([path, title]) => (
          <Route key={path} path={path} element={<ComingSoon title={title} />} />
        ))}

        <Route
          path="*"
          element={
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h2 className="font-bold text-brand-900">Page not found</h2>
              <Link to="/" className="inline-block mt-3 text-brand-600 hover:underline">
                Return to Overview
              </Link>
            </div>
          }
        />
      </Route>
    </Routes>
  )
}

export default App
