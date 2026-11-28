import { Router } from 'express'
import { query } from '../db.js'

const router = Router()

// Read-only. Drafts are private to the provider and private_job_costs is never read.
router.get('/', async (_req, res) => {
  const { rows } = await query(
    `SELECT q.id, q.status, q.total_amount, q.submitted_at, q.decision_at,
            o.title AS opportunity_title, o.currency,
            COALESCE(b.business_name, p.display_name) AS provider_name
       FROM quotes q
       JOIN opportunities o ON o.id = q.opportunity_id
       JOIN users p ON p.id = q.provider_user_id
       LEFT JOIN LATERAL (
         SELECT business_name FROM business_profiles
          WHERE owner_user_id = p.id ORDER BY created_at LIMIT 1
       ) b ON TRUE
      WHERE q.status <> 'DRAFT'
      ORDER BY q.submitted_at DESC NULLS LAST
      LIMIT 500`,
  )
  res.json(
    rows.map((r) => ({
      id: r.id,
      status: r.status,
      opportunity: r.opportunity_title,
      provider: r.provider_name,
      total: r.total_amount === null ? null : Number(r.total_amount),
      currency: r.currency,
      submittedAt: r.submitted_at,
      decisionAt: r.decision_at,
    })),
  )
})

export default router
