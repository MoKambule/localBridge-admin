import { useState } from 'react'
import StatusBadge from '../components/ui/StatusBadge'
import { Empty, ErrorBox, Skeleton } from '../components/ui/StateViews'
import { useApi } from '../hooks/useApi'
import { formatDate, formatMoney } from '../lib/format'

const filters = ['ALL', 'OPEN', 'CLOSED', 'CANCELLED']

function Opportunities() {
  const { data, error, loading, reload } = useApi('/opportunities')
  const [filter, setFilter] = useState('ALL')

  const all = data || []
  const visible = all.filter((o) => filter === 'ALL' || o.status === filter)

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-brand-900">Opportunities</h2>
        <p className="text-sm text-gray-500 mt-1">Opportunities posted by buyers (read-only).</p>
      </div>

      <div className="flex gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-2 rounded-full text-sm font-medium border transition ${
              filter === f
                ? 'bg-brand-600 border-brand-600 text-white'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {error ? (
          <ErrorBox error={error} onRetry={reload} />
        ) : loading && !data ? (
          <Skeleton />
        ) : visible.length === 0 ? (
          <Empty>No opportunities found.</Empty>
        ) : (
          <>
            <ul className="md:hidden divide-y divide-gray-100">
              {visible.map((o) => (
                <li key={o.id} className="px-4 py-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-brand-900">{o.title}</p>
                    <StatusBadge status={o.status} />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {o.category} · {o.location}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatMoney(o.budget, o.currency)} · Closes {formatDate(o.closesAt)} · {o.quoteCount} quote{o.quoteCount === 1 ? '' : 's'}
                  </p>
                </li>
              ))}
            </ul>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    {['Opportunity', 'Buyer', 'Budget', 'Quotes', 'Closes', 'Status'].map((h) => (
                      <th key={h} className="px-5 py-3 font-medium whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visible.map((o) => (
                    <tr key={o.id} className="border-t border-gray-100">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-brand-900">{o.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {o.category} · {o.location}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {o.buyerName}
                      </td>
                      <td className="px-5 py-4 text-gray-600 whitespace-nowrap">{formatMoney(o.budget, o.currency)}</td>
                      <td className="px-5 py-4 text-gray-600">{o.quoteCount}</td>
                      <td className="px-5 py-4 text-gray-600 whitespace-nowrap">{formatDate(o.closesAt)}</td>
                      <td className="px-5 py-4">
                        <StatusBadge status={o.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Opportunities
