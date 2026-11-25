
import { useState } from 'react'
import activities from '../../data/activities'

function RecentActivity() {
  const [showAll, setShowAll] = useState(false)

  const visibleActivities = showAll
    ? activities
    : activities.slice(0, 8)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[#153E46]">
          Recent Activity
        </h2>

        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-[#116B72] font-medium"
        >
          {showAll ? 'Show Less' : 'View All'}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">

          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Details</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {visibleActivities.map((activity) => (
              <tr key={activity.id} className="border-t border-gray-100">

                <td className="px-4 py-4 text-gray-500">
                  {activity.time}
                </td>

                <td className="px-4 py-4 font-medium text-[#153E46]">
                  {activity.type}
                </td>

                <td className="px-4 py-4 text-gray-600">
                  {activity.description}
                </td>

                <td className="px-4 py-4 text-gray-600">
                  {activity.user}
                </td>

                <td className="px-4 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    activity.status === 'Completed'
                      ? 'bg-green-100 text-green-700'
                      : activity.status === 'Pending'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {activity.status}
                  </span>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  )
}

export default RecentActivity
