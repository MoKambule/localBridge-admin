import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import ActivityDetails from './ActivityDetails'
import StatusBadge from '../ui/StatusBadge'
import { Empty, ErrorBox, Skeleton } from '../ui/StateViews'
import { useApi } from '../../hooks/useApi'
import { formatWhen } from '../../lib/format'

function RecentActivity() {
  const [showAll, setShowAll] = useState(false)
  const [selected, setSelected] = useState(null)
  const { data, error, loading, reload } = useApi('/activity?limit=25')

  const items = data || []
  const visible = showAll ? items : items.slice(0, 8)

  return (
    <section className="bg-white rounded-2xl border border-gray-200">
      <div className="flex items-center justify-between px-4 sm:px-5 py-4">
        <h2 className="text-lg font-bold text-brand-900">Recent Activity</h2>
        {items.length > 8 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-brand-600 font-medium px-2 py-1 -mr-2 rounded-lg hover:bg-teal-50"
          >
            {showAll ? 'Show Less' : 'View All'}
          </button>
        )}
      </div>

      {error ? (
        <ErrorBox error={error} onRetry={reload} />
      ) : loading && !data ? (
        <Skeleton />
      ) : visible.length === 0 ? (
        <Empty>No activity yet.</Empty>
      ) : (
        <>
          {/* Mobile: tappable list */}
          <ul className="md:hidden divide-y divide-gray-100 border-t border-gray-100">
            {visible.map((a) => (
              <li key={a.id}>
                <button
                  onClick={() => setSelected(a)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-gray-50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-brand-900 truncate">{a.type}</p>
                      <StatusBadge status={a.status} />
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">{a.description}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {a.user} · {formatWhen(a.time)}
                    </p>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 shrink-0" />
                </button>
              </li>
            ))}
          </ul>

          {/* Desktop: table */}
          <div className="hidden md:block overflow-x-auto border-t border-gray-100">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-5 py-3 font-medium">Time</th>
                  <th className="px-5 py-3 font-medium">Action</th>
                  <th className="px-5 py-3 font-medium">Details</th>
                  <th className="px-5 py-3 font-medium">User</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((a) => (
                  <tr
                    key={a.id}
                    onClick={() => setSelected(a)}
                    className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{formatWhen(a.time)}</td>
                    <td className="px-5 py-4 font-medium text-brand-900 whitespace-nowrap">{a.type}</td>
                    <td className="px-5 py-4 text-gray-600 max-w-xs truncate">{a.description}</td>
                    <td className="px-5 py-4 text-gray-600 whitespace-nowrap">{a.user}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={a.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <ActivityDetails activity={selected} onClose={() => setSelected(null)} />
    </section>
  )
}

export default RecentActivity
