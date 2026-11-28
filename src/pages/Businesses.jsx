import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import StatusBadge from '../components/ui/StatusBadge'
import { Empty, ErrorBox, Skeleton } from '../components/ui/StateViews'
import { useApi } from '../hooks/useApi'
import { formatDate } from '../lib/format'

function Businesses() {
  const { data, error, loading, reload } = useApi('/businesses')
  const [query, setQuery] = useState('')

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (data || []).filter(
      (b) => !q || [b.business, b.owner, b.email, b.category].some((v) => v?.toLowerCase().includes(q)),
    )
  }, [data, query])

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-brand-900">Businesses</h2>
        <p className="text-sm text-gray-500 mt-1">Active service provider profiles on LocalBridge.</p>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search business, owner, email or category"
          className="w-full bg-white border border-gray-300 rounded-xl pl-10 pr-3 py-3 text-base sm:text-sm outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {error ? (
          <ErrorBox error={error} onRetry={reload} />
        ) : loading && !data ? (
          <Skeleton />
        ) : visible.length === 0 ? (
          <Empty>{data?.length ? 'Nothing matches your search.' : 'No businesses yet.'}</Empty>
        ) : (
          <>
            <ul className="md:hidden divide-y divide-gray-100">
              {visible.map((b) => (
                <li key={b.id} className="px-4 py-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-brand-900">{b.business}</p>
                    <StatusBadge status={b.status} />
                  </div>
                  <p className="text-sm text-gray-600">{b.owner}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {b.category || 'No category'} · {b.location || '—'}
                  </p>
                </li>
              ))}
            </ul>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    {['Business', 'Category', 'Location', 'Capacity', 'Since', 'Status'].map((h) => (
                      <th key={h} className="px-5 py-3 font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visible.map((b) => (
                    <tr key={b.id} className="border-t border-gray-100">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-brand-900">{b.business}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {b.owner} · {b.email}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-gray-600">{b.category || '—'}</td>
                      <td className="px-5 py-4 text-gray-600">{b.location || '—'}</td>
                      <td className="px-5 py-4 text-gray-600">{b.capacity || '—'}</td>
                      <td className="px-5 py-4 text-gray-600 whitespace-nowrap">{formatDate(b.createdAt)}</td>
                      <td className="px-5 py-4"><StatusBadge status={b.status} /></td>
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

export default Businesses
