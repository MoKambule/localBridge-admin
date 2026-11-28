import { NavLink } from 'react-router-dom'
import { LogOut, X } from 'lucide-react'
import { navItems } from './navItems'
import { Logo } from '../brand/Logo'
import { useAuth } from '../../context/appContext'

function Sidebar({ pendingCount, onNavigate, onClose }) {
  const { user, logout } = useAuth()

  return (
    <aside className="h-full w-full bg-brand-900 text-white flex flex-col pt-safe">
      <div className="flex items-start justify-between px-5 py-5">
        <Logo slogan />
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-2 -mr-2 rounded-lg text-teal-100 hover:bg-white/10 lg:hidden"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4" aria-label="Main">
        <ul className="space-y-1">
          {navItems.map(({ to, label, icon: Icon, end, badge }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium border-l-[3px] transition-colors ${
                    isActive
                      ? 'bg-brand-600 text-white border-lb-orange'
                      : 'border-transparent text-teal-50/80 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <Icon size={18} className="shrink-0" />
                <span className="flex-1">{label}</span>
                {badge && pendingCount > 0 && (
                  <span className="min-w-5 h-5 px-1.5 rounded-full bg-lb-orange text-brand-900 text-[11px] font-bold flex items-center justify-center">
                    {pendingCount}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-5 py-4 border-t border-white/10 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-600 flex items-center justify-center text-sm font-bold shrink-0">
            {(user?.name || 'A')[0].toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">{user?.name || 'Admin'}</p>
            <p className="text-xs text-teal-100/60 truncate">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            aria-label="Sign out"
            title="Sign out"
            className="p-2 rounded-lg text-teal-100/80 hover:bg-white/10 hover:text-white"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
