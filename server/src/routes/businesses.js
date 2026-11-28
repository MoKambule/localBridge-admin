import { Router } from 'express'
import { query } from '../db.js'

const router = Router()

router.get('/', async (_req, res) => {
  const { rows } = await query(
    `SELECT b.id, b.business_name, b.owner_name, b.location_text, b.capacity,
            b.contact_number, b.business_status, b.created_at,
            u.email, c.name AS category
       FROM business_profiles b
       JOIN users u ON u.id = b.owner_user_id
       LEFT JOIN categories c ON c.id = b.category_id
      ORDER BY b.created_at DESC
      LIMIT 500`,
  )
  res.json(
    rows.map((r) => ({
      id: r.id,
      business: r.business_name,
      owner: r.owner_name,
      email: r.email,
      phone: r.contact_number,
      category: r.category,
      location: r.location_text,
      capacity: r.capacity,
      status: r.business_status,
      createdAt: r.created_at,
    })),
  )
})

export default router
