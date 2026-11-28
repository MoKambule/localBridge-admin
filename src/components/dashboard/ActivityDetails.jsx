import Sheet from '../ui/Sheet'
import StatusBadge from '../ui/StatusBadge'
import { formatWhen } from '../../lib/format'

function Field({ label, children }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <div className="mt-0.5">{children}</div>
    </div>
  )
}

function ActivityDetails({ activity, onClose }) {
  return (
    <Sheet open={!!activity} onClose={onClose} title="Activity Details">
      {activity && (
        <div className="space-y-5">
          <Field label="Activity Type">
            <p className="font-medium text-brand-900">{activity.type}</p>
          </Field>
          <Field label="User">
            <p className="font-medium">{activity.user}</p>
          </Field>
          <Field label="Date & Time">
            <p className="font-medium">{formatWhen(activity.time)}</p>
          </Field>
          <Field label="Description">
            <p className="text-sm text-gray-600">{activity.description}</p>
          </Field>
          <Field label="Status">
            <StatusBadge status={activity.status} />
          </Field>
        </div>
      )}
    </Sheet>
  )
}

export default ActivityDetails
