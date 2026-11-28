import { Link } from 'react-router-dom'
import { Bell, Menu } from 'lucide-react'
import { useAuth } from '../../context/appContext'

function TopBar({ title, pendingCount, onMenu }) {
  const { user } = useAuth()
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-200 pt-safe">
      <div className="flex items-center gap-3 px-4 sm:px-6 h-14 sm:h-16">
        <button
          onClick={onMenu}
          aria-label="Open menu"
          className="lg:hidden p-2 -ml-2 rounded-lg text-brand-900 hover:bg-gray-100 active:bg-gray-200"
        >
          <Menu size={22} />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="text-base sm:text-lg font-bold text-brand-900 truncate">{title}</h1>
          <p className="hidden sm:block text-xs text-gray-500">LocalBridge Admin</p>
        </div>

        <Link
          to="/applications"
          aria-label={`${pendingCount} pending applications`}
          className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100 active:bg-gray-200"
        >
          <Bell size={20} />
          {pendingCount > 0 && (
            <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-lb-orange text-brand-900 text-[10px] font-bold flex items-center justify-center">
              {pendingCount}
            </span>
          )}
        </Link>

        <div className="w-8 h-8 rounded-full bg-brand-600 text-white text-sm font-bold flex items-center justify-center">
          {(user?.name || 'A')[0].toUpperCase()}
        </div>
      </div>
    </header>
  )
}

export default TopBar
