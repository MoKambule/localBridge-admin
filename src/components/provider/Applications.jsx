import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight, Search } from 'lucide-react'
import StatusBadge from '../ui/StatusBadge'
import { Empty, ErrorBox, Skeleton } from '../ui/StateViews'
import { useApi } from '../../hooks/useApi'
import { formatDate } from '../../lib/format'

const filters = ['ALL', 'PENDING', 'MORE_INFO_REQUIRED', 'ACCEPTED', 'REJECTED']
const filterLabel = {
  ALL: 'All',
  PENDING: 'Pending',
  MORE_INFO_REQUIRED: 'Info needed',
  ACCEPTED: 'Approved',
  REJECTED: 'Rejected',
}

function Applications() {
  const navigate = useNavigate()
  const { data, error, loading, reload } = useApi('/providers')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('ALL')

  const all = useMemo(() => data || [], [data])

  const counts = useMemo(() => {
    const c = { ALL: all.length }
    all.forEach((p) => (c[p.status] = (c[p.status] || 0) + 1))
    return c
  }, [all])

  const visible = all.filter((p) => {
    const q = query.trim().toLowerCase()
    const matchesQuery =
      !q || [p.name, p.business, p.email].some((v) => v?.toLowerCase().includes(q))
    return matchesQuery && (filter === 'ALL' || p.status === filter)
  })

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-brand-900">Provider Applications</h2>
        <p className="text-sm text-gray-500 mt-1">
          Review and manage service provider applications.
        </p>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, business or email"
          className="w-full bg-white border border-gray-300 rounded-xl pl-10 pr-3 py-3 text-base sm:text-sm outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600"
        />
      </div>

      {(
        <div className="-mx-4 sm:mx-0 px-4 sm:px-0 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 px-3.5 py-2 rounded-full text-sm font-medium border transition ${
                filter === f
                  ? 'bg-brand-600 border-brand-600 text-white'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {filterLabel[f]}
              <span className={`ml-1.5 ${filter === f ? 'text-white/80' : 'text-gray-400'}`}>
                {counts[f] || 0}
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {error ? (
          <ErrorBox error={error} onRetry={reload} />
        ) : loading && !data ? (
          <Skeleton />
        ) : (
          <>
            {/* Mobile cards */}
            <ul className="md:hidden divide-y divide-gray-100">
              {visible.map((a) => (
                <li key={a.id}>
                  <Link
                    to={`/applications/${a.id}`}
                    className="flex items-center gap-3 px-4 py-4 active:bg-gray-50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-brand-900 truncate">{a.name}</p>
                      <p className="text-sm text-gray-600 truncate">{a.business}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {a.category || 'No category'} · {formatDate(a.createdAt)}
                      </p>
                      <div className="mt-2">
                        <StatusBadge status={a.status} />
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-300 shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    {['Applicant', 'Business', 'Category', 'Date Submitted', 'Status', ''].map(
                      (h, i) => (
                        <th key={i} className="px-5 py-3 font-medium whitespace-nowrap">
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {visible.map((a) => (
                    <tr
                      key={a.id}
                      onClick={() => navigate(`/applications/${a.id}`)}
                      className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-brand-600">{a.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{a.email}</p>
                      </td>
                      <td className="px-5 py-4 text-gray-600">{a.business}</td>
                      <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                        {a.category || '—'}
                      </td>
                      <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                        {formatDate(a.createdAt)}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={a.status} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <ChevronRight size={18} className="inline text-gray-300" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {visible.length === 0 && (
              <Empty>
                {all.length === 0 ? 'No applications yet.' : 'Nothing matches your search.'}
              </Empty>
            )}
          </>
        )}
      </div>

      {data && (
        <p className="text-xs text-gray-500">
          Showing {visible.length} of {all.length}
        </p>
      )}
    </div>
  )
}

export default Applications
