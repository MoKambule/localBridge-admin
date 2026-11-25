import { X } from 'lucide-react'

function ActivityDetails({activity, onClose}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-5 w-full lg:w-80 shrink-0">

      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <h2 className="text-lg font-bold text-[#153E46]">
          Activity Details
        </h2>

      <button
  onClick={onClose}
  className="text-gray-500 hover:text-red-600"
>
  <X size={20} />
</button>
      </div>

{/* Activity Information */}
<div className="mt-5 space-y-4">

  <div>
    <p className="text-xs text-gray-500">Activity Type</p>
    <p className="font-medium text-[#153E46]">{activity.type}</p>
  </div>

  <div>
    <p className="text-xs text-gray-500">User</p>
    <p className="font-medium">{activity.user}</p>
  </div>

  <div>
    <p className="text-xs text-gray-500">Date & Time</p>
    <p className="font-medium">{activity.time}</p>
  </div>

  <div>
    <p className="text-xs text-gray-500">Description</p>
    <p className="text-sm text-gray-600">{activity.description}</p>
  </div>

  <div>
    <p className="text-xs text-gray-500">Status</p>
  <span className={`inline-block px-3 py-1 rounded-full text-xs mt-1 ${
  activity.status === 'Completed'
    ? 'bg-green-100 text-green-700'
    : activity.status === 'Pending'
    ? 'bg-orange-100 text-orange-700'
    : 'bg-red-100 text-red-700'
}`}>
  {activity.status}
</span>
  </div>

</div>

    </div>
  )
}

export default ActivityDetails