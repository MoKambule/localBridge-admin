import { Router } from 'express'
import { query } from '../db.js'

const router = Router()

router.get('/', async (_req, res) => {
  const { rows } = await query(
    `SELECT o.id, o.title, o.location_text, o.status, o.budget_amount, o.currency,
            o.closes_at, o.delivery_at, c.name AS category,
            b.display_name AS buyer_name,
            (SELECT count(*)::int FROM quotes q WHERE q.opportunity_id = o.id AND q.status <> 'DRAFT') AS quote_count
       FROM opportunities o
       JOIN users b ON b.id = o.buyer_user_id
       LEFT JOIN categories c ON c.id = o.category_id
      ORDER BY o.created_at DESC
      LIMIT 500`,
  )
  res.json(
    rows.map((r) => ({
      id: r.id,
      title: r.title,
      category: r.category,
      location: r.location_text,
      status: r.status,
      budget: r.budget_amount === null ? null : Number(r.budget_amount),
      currency: r.currency,
      closesAt: r.closes_at,
      deliveryAt: r.delivery_at,
      buyerName: r.buyer_name,
      quoteCount: r.quote_count,
    })),
  )
})

export default router
