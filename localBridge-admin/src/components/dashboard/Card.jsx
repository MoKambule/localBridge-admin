
function Card({ title, value, percentage, color, trend }) {
  const colors = {
    aqua: 'bg-teal-50',
    blue: 'bg-blue-50',
    orange: 'bg-orange-50',
    purple: 'bg-purple-50',
    green: 'bg-green-50'
  }

  return (
    <div className={`${colors[color]} rounded-xl p-4`}>
      <p className="text-sm text-gray-600">{title}</p>

      <div className="flex items-center justify-between mt-3">
        <h2 className="text-2xl font-bold text-[#153E46]">
          {value}
        </h2>

        <span className={`text-xs font-medium ${
          trend === 'up' ? 'text-green-600' : 'text-red-500'
        }`}>
          {percentage}
        </span>
      </div>
    </div>
  )
}

export default Card
