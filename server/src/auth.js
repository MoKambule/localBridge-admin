import jwt from 'jsonwebtoken'
import { config } from './config.js'
import { query } from './db.js'
import { HttpError } from './http.js'

export const COOKIE = 'lb_admin'
const MAX_AGE_MS = 8 * 60 * 60 * 1000

export function setSession(res, userId) {
  const token = jwt.sign({ sub: String(userId) }, config.jwtSecret, { expiresIn: '8h' })
  res.cookie(COOKIE, token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: config.cookieSecure,
    maxAge: MAX_AGE_MS,
    path: '/',
  })
}

export function clearSession(res) {
  res.clearCookie(COOKIE, { path: '/' })
}

// Verifies the cookie AND re-checks the database on every request, so an admin who is
// suspended or loses the ADMIN role is locked out immediately.
export async function requireAdmin(req, _res, next) {
  const token = req.cookies?.[COOKIE]
  if (!token) throw new HttpError(401, 'Not signed in')

  let payload
  try {
    payload = jwt.verify(token, config.jwtSecret)
  } catch {
    throw new HttpError(401, 'Session expired')
  }

  const { rows } = await query(
    `SELECT u.id, u.display_name, u.email
       FROM users u
       JOIN user_roles r ON r.user_id = u.id AND r.role = $2
      WHERE u.id::text = $1 AND u.account_status = 'ACTIVE'`,
    [payload.sub, config.adminRole],
  )
  if (!rows[0]) throw new HttpError(401, 'Not signed in')

  req.admin = { id: rows[0].id, name: rows[0].display_name, email: rows[0].email }
  next()
}
