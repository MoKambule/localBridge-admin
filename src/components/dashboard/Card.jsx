import { Link } from 'react-router-dom'

const colors = {
  aqua: 'bg-teal-50 text-teal-700',
  blue: 'bg-blue-50 text-blue-700',
  orange: 'bg-orange-50 text-orange-700',
  purple: 'bg-purple-50 text-purple-700',
  green: 'bg-green-50 text-green-700',
}

function Card({ title, value, percentage, color = 'aqua', trend, icon: Icon, to, className = '' }) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-gray-600">{title}</p>
        {Icon && (
          <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${colors[color]}`}>
            <Icon size={16} />
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-end justify-between gap-x-2 mt-3">
        <h2 className="text-2xl font-bold text-brand-900">{value}</h2>
        <span
          className={`text-xs font-medium pb-1 ${
            trend === 'up' ? 'text-green-600' : 'text-red-500'
          }`}
        >
          {percentage}
        </span>
      </div>
    </>
  )

  const base = `block bg-white border border-gray-200 rounded-2xl p-4 ${className}`

  return to ? (
    <Link
      to={to}
      className={`${base} transition hover:border-brand-600/40 hover:shadow-sm active:scale-[0.99]`}
    >
      {body}
    </Link>
  ) : (
    <div className={base}>{body}</div>
  )
}

export default Card
