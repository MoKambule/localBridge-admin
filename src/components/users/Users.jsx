import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import StatusBadge from '../ui/StatusBadge'
import { Empty, ErrorBox, Skeleton } from '../ui/StateViews'
import { useApi } from '../../hooks/useApi'
import { formatDate, roleLabel } from '../../lib/format'

const PAGE_SIZE = 20

function Users() {
  const [input, setInput] = useState('')
  const [q, setQ] = useState('')
  const [role, setRole] = useState('')
  const [page, setPage] = useState(1)

  // Wait for the user to stop typing before hitting the API.
  useEffect(() => {
    const t = setTimeout(() => setQ(input), 300)
    return () => clearTimeout(t)
  }, [input])

  const params = new URLSearchParams({ page, pageSize: PAGE_SIZE })
  if (q.trim()) params.set('q', q.trim())
  if (role) params.set('role', role)
  const { data, error, loading, reload } = useApi(`/users?${params}`)

  const items = data?.items || []
  const totalPages = Math.max(1, Math.ceil((data?.total || 0) / PAGE_SIZE))

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-brand-900">Users</h2>
        <p className="text-sm text-gray-500 mt-1">Everyone registered on LocalBridge.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              setPage(1)
            }}
            placeholder="Search name, email or phone"
            className="w-full bg-white border border-gray-300 rounded-xl pl-10 pr-3 py-3 text-base sm:text-sm outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600"
          />
        </div>
        {data?.roles?.length > 0 && (
          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value)
              setPage(1)
            }}
            aria-label="Filter by role"
            className="bg-white border border-gray-300 rounded-xl px-3 py-3 text-base sm:text-sm"
          >
            <option value="">All roles</option>
            {data.roles.map((r) => (
              <option key={r} value={r}>
                {roleLabel(r)}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {error ? (
          <ErrorBox error={error} onRetry={reload} />
        ) : loading && !data ? (
          <Skeleton />
        ) : (
          <>
            <ul className="md:hidden divide-y divide-gray-100">
              {items.map((u) => (
                <li key={u.id} className="px-4 py-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-brand-900 truncate">{u.name || '—'}</p>
                      <p className="text-sm text-gray-600 truncate">{u.email}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{u.phone}</p>
                    </div>
                    <StatusBadge status={u.accountStatus} />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    {u.roles.map(roleLabel).join(', ') || 'No role'} · Joined {formatDate(u.createdAt)}
                  </p>
                </li>
              ))}
            </ul>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    {['User', 'Phone', 'Roles', 'Status', 'Joined'].map((h) => (
                      <th key={h} className="px-5 py-3 font-medium whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((u) => (
                    <tr key={u.id} className="border-t border-gray-100">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-brand-900">{u.name || '—'}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{u.email}</p>
                      </td>
                      <td className="px-5 py-4 text-gray-600 whitespace-nowrap">{u.phone}</td>
                      <td className="px-5 py-4 text-gray-600">
                        {u.roles.map(roleLabel).join(', ') || '—'}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={u.accountStatus} />
                      </td>
                      <td className="px-5 py-4 text-gray-600 whitespace-nowrap">{formatDate(u.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {items.length === 0 && <Empty>No users found.</Empty>}
          </>
        )}
      </div>

      {data && data.total > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            {data.total} user{data.total === 1 ? '' : 's'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page <= 1}
              aria-label="Previous page"
              className="p-2 rounded-lg border border-gray-200 bg-white disabled:opacity-40"
            >
              <ChevronLeft size={18} />
            </button>
            <span>
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages}
              aria-label="Next page"
              className="p-2 rounded-lg border border-gray-200 bg-white disabled:opacity-40"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Users
