export class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

// Express 5 forwards rejected promises to the error handler, so no wrapper needed.
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
export function parseId(value) {
  if (!UUID.test(String(value))) throw new HttpError(400, 'Invalid id')
  return String(value).toLowerCase()
}

export function requireText(value, field, max = 2000) {
  const text = typeof value === 'string' ? value.trim() : ''
  if (!text) throw new HttpError(400, `${field} is required`)
  if (text.length > max) throw new HttpError(400, `${field} must be ${max} characters or fewer`)
  return text
}

// Escape % and _ so user input is matched literally inside ILIKE.
export function likePattern(q) {
  return `%${String(q).trim().replace(/[\\%_]/g, (c) => `\\${c}`)}%`
}
