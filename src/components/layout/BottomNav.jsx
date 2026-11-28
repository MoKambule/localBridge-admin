import { NavLink } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { navItems } from './navItems'

const tabs = ['/', '/applications', '/users']

function BottomNav({ pendingCount, onMore }) {
  const items = navItems.filter((i) => tabs.includes(i.to))

  return (
    <nav
      aria-label="Primary"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-gray-200 pb-safe"
    >
      <ul className="grid grid-cols-4">
        {items.map(({ to, label, short, icon: Icon, end, badge }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `relative flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${
                  isActive ? 'text-brand-600' : 'text-gray-500'
                }`
              }
            >
              <span className="relative">
                <Icon size={22} />
                {badge && pendingCount > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-4 h-4 px-1 rounded-full bg-lb-orange text-brand-900 text-[10px] font-bold flex items-center justify-center">
                    {pendingCount}
                  </span>
                )}
              </span>
              {short || label}
            </NavLink>
          </li>
        ))}
        <li>
          <button
            onClick={onMore}
            className="w-full flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium text-gray-500"
          >
            <Menu size={22} />
            More
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default BottomNav
