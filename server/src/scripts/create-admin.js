import bcrypt from 'bcryptjs'
import { pool, query, withTransaction } from '../db.js'
import { config } from '../config.js'

// Creates the first admin from ADMIN_EMAIL / ADMIN_PASSWORD if no user has that email.
// Never touches an existing account.
export async function ensureAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim()
  const password = process.env.ADMIN_PASSWORD
  if (!email || !password) return

  if (password.length < 8) {
    console.error('ADMIN_PASSWORD must be at least 8 characters; skipping admin creation.')
    return
  }

  const existing = await query('SELECT id FROM users WHERE lower(email) = lower($1)', [email])
  if (existing.rows[0]) return

  const hash = await bcrypt.hash(password, 10)
  await withTransaction(async (db) => {
    const { rows } = await db.query(
      `INSERT INTO users (email, display_name, account_status)
       VALUES ($1, $2, 'ACTIVE') RETURNING id`,
      [email, process.env.ADMIN_NAME?.trim() || 'Admin'],
    )
    const id = rows[0].id
    await db.query('INSERT INTO user_roles (user_id, role) VALUES ($1, $2)', [id, config.adminRole])
    await db.query('INSERT INTO admin_credentials (user_id, password_hash) VALUES ($1, $2)', [id, hash])
  })
  console.log(`Created admin account for ${email}`)
}

// `npm run create-admin` runs this file directly.
if (import.meta.url === `file://${process.argv[1]}`) {
  await ensureAdmin()
  await pool.end()
}
