import { Router } from 'express'
import { query } from '../db.js'
import { config } from '../config.js'
import { likePattern } from '../http.js'

const router = Router()

// Read-only. Admin accounts are not listed.
router.get('/', async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1)
  const pageSize = Math.min(Math.max(parseInt(req.query.pageSize, 10) || 20, 1), 100)

  const params = [config.adminRole]
  const conditions = [
    'NOT EXISTS (SELECT 1 FROM user_roles x WHERE x.user_id = u.id AND x.role = $1)',
  ]

  if (req.query.q) {
    params.push(likePattern(req.query.q))
    const n = params.length
    conditions.push(
      `(u.display_name ILIKE $${n} OR u.email ILIKE $${n} OR u.phone ILIKE $${n})`,
    )
  }
  if (req.query.role) {
    params.push(String(req.query.role))
    conditions.push(
      `EXISTS (SELECT 1 FROM user_roles f WHERE f.user_id = u.id AND f.role = $${params.length})`,
    )
  }
  const where = `WHERE ${conditions.join(' AND ')}`

  const [{ rows: count }, { rows }] = await Promise.all([
    query(`SELECT count(*)::int AS total FROM users u ${where}`, params),
    query(
      `SELECT u.id, u.display_name, u.email, u.phone, u.account_status, u.created_at,
              COALESCE((SELECT array_agg(r.role ORDER BY r.role) FROM user_roles r
                         WHERE r.user_id = u.id), '{}') AS roles
         FROM users u
         ${where}
        ORDER BY u.created_at DESC, u.id
        LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}`,
      params,
    ),
  ])

  res.json({
    page,
    pageSize,
    total: count[0].total,
    roles: ['CUSTOMER', 'PROVIDER'],
    items: rows.map((r) => ({
      id: r.id,
      name: r.display_name,
      email: r.email,
      phone: r.phone,
      accountStatus: r.account_status,
      roles: r.roles,
      createdAt: r.created_at,
    })),
  })
})

export default router
