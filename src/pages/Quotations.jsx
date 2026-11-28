import { useState } from 'react'
import StatusBadge from '../components/ui/StatusBadge'
import { Empty, ErrorBox, Skeleton } from '../components/ui/StateViews'
import { useApi } from '../hooks/useApi'
import { formatDate, formatMoney } from '../lib/format'

const filters = ['ALL', 'SUBMITTED', 'ACCEPTED', 'DECLINED']
const filterLabel = { ALL: 'All', SUBMITTED: 'Submitted', ACCEPTED: 'Accepted', DECLINED: 'Declined' }

function Quotations() {
  const { data, error, loading, reload } = useApi('/quotes')
  const [filter, setFilter] = useState('ALL')
  const visible = (data || []).filter((q) => filter === 'ALL' || q.status === filter)

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-brand-900">Quotations</h2>
        <p className="text-sm text-gray-500 mt-1">
          Quotes providers have submitted (read-only). Drafts and private job costs are not shown.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
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
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {error ? (
          <ErrorBox error={error} onRetry={reload} />
        ) : loading && !data ? (
          <Skeleton />
        ) : visible.length === 0 ? (
          <Empty>No quotations found.</Empty>
        ) : (
          <>
            <ul className="md:hidden divide-y divide-gray-100">
              {visible.map((q) => (
                <li key={q.id} className="px-4 py-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-brand-900">{q.opportunity}</p>
                    <StatusBadge status={q.status} />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{q.provider}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatMoney(q.total, q.currency)} · Submitted {formatDate(q.submittedAt)}
                  </p>
                </li>
              ))}
            </ul>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    {['Opportunity', 'Provider', 'Total', 'Submitted', 'Status'].map((h) => (
                      <th key={h} className="px-5 py-3 font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visible.map((q) => (
                    <tr key={q.id} className="border-t border-gray-100">
                      <td className="px-5 py-4 font-semibold text-brand-900">{q.opportunity}</td>
                      <td className="px-5 py-4 text-gray-600">{q.provider}</td>
                      <td className="px-5 py-4 text-gray-600 whitespace-nowrap">{formatMoney(q.total, q.currency)}</td>
                      <td className="px-5 py-4 text-gray-600 whitespace-nowrap">{formatDate(q.submittedAt)}</td>
                      <td className="px-5 py-4"><StatusBadge status={q.status} /></td>
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

export default Quotations
