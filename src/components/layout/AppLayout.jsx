import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import BottomNav from './BottomNav'
import { navItems } from './navItems'

function AppLayout({ pendingCount }) {
  // Menu is "open" only for the route it was opened on, so navigating closes it.
  const { pathname } = useLocation()
  const [openAt, setOpenAt] = useState(null)
  const menuOpen = openAt === pathname
  const setMenuOpen = (v) => setOpenAt(v ? pathname : null)

  const current =
    navItems.find((i) => (i.end ? pathname === i.to : pathname.startsWith(i.to))) || null
  const title = current?.title || 'LocalBridge'

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    document.title = `${title} · LocalBridge Admin`
  }, [title])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => e.key === 'Escape' && setOpenAt(null)
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [menuOpen])

  return (
    <div className="min-h-dvh lg:flex">
      {/* Desktop sidebar */}
      <div className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-0 h-dvh">
          <Sidebar pendingCount={pendingCount} />
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-50 ${menuOpen ? '' : 'pointer-events-none'}`}
        aria-hidden={!menuOpen}
      >
        <div
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          className={`absolute inset-y-0 left-0 w-72 max-w-[85vw] transition-transform duration-250 ease-out ${
            menuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
          }`}
        >
          <Sidebar
            pendingCount={pendingCount}
            onNavigate={() => setMenuOpen(false)}
            onClose={() => setMenuOpen(false)}
          />
        </div>
      </div>

      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar title={title} pendingCount={pendingCount} onMenu={() => setMenuOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-8 w-full max-w-7xl mx-auto">
          <div key={pathname} className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      <BottomNav pendingCount={pendingCount} onMore={() => setMenuOpen(true)} />
    </div>
  )
}

export default AppLayout
