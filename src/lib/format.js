const dateFmt = new Intl.DateTimeFormat('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
const timeFmt = new Intl.DateTimeFormat('en-ZA', { hour: '2-digit', minute: '2-digit', hour12: false })

export const formatDate = (iso) => (iso ? dateFmt.format(new Date(iso)) : '—')

export function formatWhen(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  const days = Math.round(
    (new Date().setHours(0, 0, 0, 0) - new Date(d).setHours(0, 0, 0, 0)) / 86_400_000,
  )
  if (days === 0) return `Today, ${timeFmt.format(d)}`
  if (days === 1) return `Yesterday, ${timeFmt.format(d)}`
  return dateFmt.format(d)
}

// Amounts are numeric(12,2) in ZAR (the design's convention), already in rands.
export function formatMoney(amount, currency = 'ZAR') {
  if (amount === null || amount === undefined) return '—'
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatBytes(n) {
  if (n === null || n === undefined) return ''
  return n < 1024 * 1024 ? `${Math.max(1, Math.round(n / 1024))} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`
}

export const documentLabel = (kind) =>
  ({
    ID_DOCUMENT: 'Identity Document',
    PROOF_OF_ADDRESS: 'Proof of Address',
    COMPANY_REGISTRATION: 'Company Registration',
  })[kind] || kind

export const roleLabel = (r) => r.charAt(0) + r.slice(1).toLowerCase()
