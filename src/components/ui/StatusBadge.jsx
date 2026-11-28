const labels = {
  PENDING: 'Pending',
  ACCEPTED: 'Approved',
  REJECTED: 'Rejected',
  MORE_INFO_REQUIRED: 'More Information Required',
  OPEN: 'Open',
  CLOSED: 'Closed',
  CANCELLED: 'Cancelled',
  ACTIVE: 'Active',
  SUSPENDED: 'Suspended',
  SUBMITTED: 'Submitted',
  DECLINED: 'Declined',
}

const green = 'bg-green-100 text-green-700'
const orange = 'bg-orange-100 text-orange-700'
const red = 'bg-red-100 text-red-700'
const blue = 'bg-blue-100 text-blue-700'
const gray = 'bg-gray-100 text-gray-600'

const styles = {
  Completed: green,
  Approved: green,
  Open: green,
  Active: green,
  Pending: orange,
  Submitted: blue,
  Closed: gray,
  Cancelled: gray,
  Rejected: red,
  Declined: red,
  Suspended: red,
  'Requires Review': red,
  'More Information Required': blue,
}

// Accepts API codes (ACCEPTED) or display labels (Approved).
function StatusBadge({ status, className = '' }) {
  const label = labels[status] || status
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-medium ${
        styles[label] || 'bg-gray-100 text-gray-700'
      } ${className}`}
    >
      {label}
    </span>
  )
}

export default StatusBadge
