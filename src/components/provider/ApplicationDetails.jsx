import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import StatusBadge from '../ui/StatusBadge'
import { ErrorBox, Skeleton } from '../ui/StateViews'
import { useToast } from '../ui/toastContext'
import { useStats } from '../../context/appContext'
import { useApi } from '../../hooks/useApi'
import { api } from '../../lib/api'
import { documentLabel, formatBytes, formatDate, formatWhen } from '../../lib/format'

function Field({ label, children }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium text-gray-800 mt-1 break-words">{children || '—'}</p>
    </div>
  )
}

function Doc({ doc }) {
  return (
    <div className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-800">{documentLabel(doc.kind)}</p>
        <p className="text-xs text-gray-500 truncate">
          {doc.fileName}
          {doc.sizeBytes ? ` · ${formatBytes(doc.sizeBytes)}` : ''}
        </p>
      </div>
    </div>
  )
}

const card = 'bg-white rounded-xl border border-gray-200 p-5 sm:p-6'
const textarea =
  'w-full border border-gray-300 rounded-lg p-3 text-base sm:text-sm outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600'

function ApplicationDetails() {
  const { id } = useParams()
  const toast = useToast()
  const { reloadStats } = useStats()
  const { data: app, error, loading, reload } = useApi(`/providers/${id}`)

  const [rejectionReason, setRejectionReason] = useState('')
  const [requestedInfo, setRequestedInfo] = useState('')
  const [busy, setBusy] = useState(false)

  async function act(path, body, message) {
    setBusy(true)
    try {
      await api.post(`/providers/${id}/${path}`, body)
      toast(message)
      setRejectionReason('')
      setRequestedInfo('')
      reload()
      reloadStats()
    } catch (err) {
      toast(err.message, 'error')
      reload()
    } finally {
      setBusy(false)
    }
  }

  const back = (
    <Link
      to="/applications"
      className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:underline"
    >
      <ArrowLeft size={16} /> Back to Applications
    </Link>
  )

  if (error?.status === 404 || error?.status === 400) {
    return (
      <div className={card}>
        <h2 className="text-lg font-bold text-brand-900">Application not found</h2>
        <div className="mt-4">{back}</div>
      </div>
    )
  }
  if (error && !app) return <div className="bg-white rounded-xl border border-gray-200"><ErrorBox error={error} onRetry={reload} /></div>
  if (!app || loading && app.id !== id) return <div className="bg-white rounded-xl border border-gray-200"><Skeleton rows={5} /></div>

  const isFinal = app.status === 'ACCEPTED' || app.status === 'REJECTED'

  return (
    <div className="space-y-4 sm:space-y-6">
      {back}

      <div className={card}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-brand-900">{app.business}</h2>
            <p className="text-sm text-gray-500 mt-1">
              Review the applicant&apos;s information and documents.
            </p>
          </div>
          <StatusBadge status={app.status} className="w-fit !py-2 !px-3 font-semibold" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-start">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <div className={card}>
            <h3 className="font-bold text-brand-900 mb-5">Applicant Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Owner Name">{app.name}</Field>
              <Field label="Email Address">{app.email}</Field>
              <Field label="Contact Number">{app.phone}</Field>
              <Field label="Date Submitted">{formatDate(app.createdAt)}</Field>
            </div>
          </div>

          <div className={card}>
            <h3 className="font-bold text-brand-900 mb-5">Business Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Business Name">{app.business}</Field>
              <Field label="Category">{app.category}</Field>
              <Field label="Location">{app.location}</Field>
              <Field label="Capacity">{app.capacity}</Field>
            </div>
            {app.about && (
              <div className="mt-5">
                <Field label="About">{app.about}</Field>
              </div>
            )}
          </div>

          <div className={card}>
            <h3 className="font-bold text-brand-900 mb-2">Verification Documents</h3>
            <p className="text-xs text-gray-500 mb-5">Documents submitted by the applicant.</p>
            <div className="space-y-3">
              {app.documents.length === 0 && (
                <p className="text-sm text-gray-500">No documents were uploaded.</p>
              )}
              {app.documents.map((d) => (
                <Doc key={d.id} doc={d} />
              ))}
            </div>
            <p className="text-xs text-orange-700 mt-4">
              Only file names are shown. Document storage and previews are not connected yet.
            </p>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6 lg:sticky lg:top-24">
          {app.rejectionReason && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-5">
              <h3 className="font-semibold text-red-800">Rejection Reason</h3>
              <p className="text-sm text-red-700 mt-2">{app.rejectionReason}</p>
            </div>
          )}

          {app.requestedInfo && app.status === 'MORE_INFO_REQUIRED' && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
              <h3 className="font-semibold text-blue-800">Additional Information Requested</h3>
              <p className="text-sm text-blue-700 mt-2">{app.requestedInfo}</p>
            </div>
          )}

          <div className={card}>
            <h3 className="font-bold text-brand-900 mb-4">Application Decision</h3>

            {isFinal ? (
              <p className="text-sm text-gray-600">
                This application was {app.status.toLowerCase()}
                {app.reviewedBy ? ` by ${app.reviewedBy}` : ''}
                {app.reviewedAt ? ` · ${formatWhen(app.reviewedAt)}` : ''}.
              </p>
            ) : (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Approve Application</h4>
                  <p className="text-xs text-gray-500 mb-3">
                    Approving grants the Provider role and creates their business profile.
                  </p>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => act('approve', {}, 'Application approved')}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                  >
                    {busy && <Loader2 size={16} className="animate-spin" />}
                    Approve Application
                  </button>
                </div>

                <div className="border-t border-gray-100" />

                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    act('reject', { reason: rejectionReason }, 'Application rejected')
                  }}
                >
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Reject Application</h4>
                  <label className="block text-xs text-gray-600 mb-2" htmlFor="reason">
                    Rejection reason (required)
                  </label>
                  <textarea
                    id="reason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Explain why this application is being rejected..."
                    rows="3"
                    maxLength={2000}
                    className={textarea}
                  />
                  <button
                    type="submit"
                    disabled={busy || !rejectionReason.trim()}
                    className="mt-3 w-full px-5 py-3 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-40"
                  >
                    Reject Application
                  </button>
                </form>

                <div className="border-t border-gray-100" />

                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    act('request-info', { message: requestedInfo }, 'Information request sent')
                  }}
                >
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Request More Information</h4>
                  <label className="block text-xs text-gray-600 mb-2" htmlFor="info">
                    Missing information or documents (required)
                  </label>
                  <textarea
                    id="info"
                    value={requestedInfo}
                    onChange={(e) => setRequestedInfo(e.target.value)}
                    placeholder="Example: Please upload a clearer copy of your ID document..."
                    rows="3"
                    maxLength={2000}
                    className={textarea}
                  />
                  <button
                    type="submit"
                    disabled={busy || !requestedInfo.trim()}
                    className="mt-3 w-full px-5 py-3 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 disabled:opacity-40"
                  >
                    Request More Information
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApplicationDetails
