import { Router } from 'express'
import bcrypt from 'bcryptjs'
import rateLimit from 'express-rate-limit'
import { query } from '../db.js'
import { config } from '../config.js'
import { HttpError } from '../http.js'
import { clearSession, requireAdmin, setSession } from '../auth.js'

const router = Router()

// Used so a missing account takes as long to reject as a wrong password.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 10)

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Please try again later.' },
})

router.post('/login', loginLimiter, async (req, res) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim() : ''
  const password = typeof req.body?.password === 'string' ? req.body.password : ''
  if (!email || !password) throw new HttpError(400, 'Email and password are required')

  const { rows } = await query(
    `SELECT u.id, u.display_name, u.email, u.account_status,
            c.password_hash, c.failed_logins, c.locked_until
       FROM users u
       JOIN user_roles r ON r.user_id = u.id AND r.role = $2
       JOIN admin_credentials c ON c.user_id = u.id
      WHERE lower(u.email) = lower($1)
      LIMIT 1`,
    [email, config.adminRole],
  )
  const user = rows[0]

  if (user?.locked_until && new Date(user.locked_until) > new Date()) {
    throw new HttpError(423, 'Account temporarily locked. Try again later.')
  }

  const ok = await bcrypt.compare(password, user?.password_hash || DUMMY_HASH)

  if (!user || !ok || user.account_status !== 'ACTIVE') {
    if (user) {
      await query(
        `UPDATE admin_credentials
            SET failed_logins = failed_logins + 1,
                locked_until = CASE WHEN failed_logins + 1 >= $2
                                    THEN now() + make_interval(mins => $3)
                                    ELSE locked_until END,
                updated_at = now()
          WHERE user_id = $1`,
        [user.id, config.maxFailedLogins, config.lockMinutes],
      )
    }
    throw new HttpError(401, 'Invalid email or password')
  }

  await query(
    'UPDATE admin_credentials SET failed_logins = 0, locked_until = NULL WHERE user_id = $1',
    [user.id],
  )

  setSession(res, user.id)
  res.json({ id: user.id, name: user.display_name, email: user.email })
})

router.post('/logout', (_req, res) => {
  clearSession(res)
  res.status(204).end()
})

router.get('/me', requireAdmin, (req, res) => {
  res.json(req.admin)
})

export default router
