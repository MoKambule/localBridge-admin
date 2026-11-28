import { Router } from 'express'
import { query, withTransaction } from '../db.js'
import { HttpError, parseId, requireText } from '../http.js'

const router = Router()

// Reviewer, time and reason come from the latest admin decision in audit_logs,
// so the applications table keeps exactly the columns in the design.
const BASE = `
  SELECT ap.application_id, ap.business_name, ap.owner_name, ap.location_text, ap.capacity,
         ap.contact_number, ap.about, ap.status, ap.created_at,
         u.id AS user_id, u.email, u.display_name,
         c.name AS category,
         d.action AS decision_action, d.metadata AS decision_metadata,
         d.created_at AS decided_at, d.actor_name
    FROM applications ap
    JOIN users u ON u.id = ap.owner_user_id
    LEFT JOIN categories c ON c.id = ap.category_id
    LEFT JOIN LATERAL (
      SELECT al.action, al.metadata, al.created_at, a.display_name AS actor_name
        FROM audit_logs al
        LEFT JOIN users a ON a.id = al.actor_user_id
       WHERE al.entity_type = 'APPLICATION'
         AND al.entity_id = ap.application_id
         AND al.action IN ('APPLICATION_ACCEPTED','APPLICATION_REJECTED','APPLICATION_INFO_REQUESTED')
       ORDER BY al.created_at DESC
       LIMIT 1
    ) d ON TRUE`

const toJson = (r) => ({
  id: r.application_id,
  userId: r.user_id,
  name: r.owner_name || r.display_name,
  email: r.email,
  phone: r.contact_number,
  business: r.business_name,
  category: r.category,
  location: r.location_text,
  capacity: r.capacity,
  about: r.about,
  status: r.status,
  createdAt: r.created_at,
  // Only show the reason / request while it still applies to the current status.
  rejectionReason:
    r.status === 'REJECTED' && r.decision_action === 'APPLICATION_REJECTED'
      ? r.decision_metadata?.reason ?? null
      : null,
  requestedInfo:
    r.status === 'MORE_INFO_REQUIRED' && r.decision_action === 'APPLICATION_INFO_REQUESTED'
      ? r.decision_metadata?.message ?? null
      : null,
  reviewedAt: r.decision_action ? r.decided_at : null,
  reviewedBy: r.decision_action ? r.actor_name : null,
})

router.get('/', async (req, res) => {
  const params = []
  let where = ''
  if (req.query.status) {
    params.push(String(req.query.status))
    where = 'WHERE ap.status = $1'
  }
  const { rows } = await query(`${BASE} ${where} ORDER BY ap.created_at DESC LIMIT 500`, params)
  res.json(rows.map(toJson))
})

async function loadOne(id) {
  const { rows } = await query(`${BASE} WHERE ap.application_id = $1`, [id])
  if (!rows[0]) throw new HttpError(404, 'Application not found')
  const { rows: files } = await query(
    `SELECT id, entity_type, file_url, content_type, size_bytes
       FROM attachments WHERE application_id = $1 ORDER BY created_at`,
    [id],
  )
  return {
    ...toJson(rows[0]),
    documents: files.map((f) => ({
      id: f.id,
      kind: f.entity_type,
      fileName: f.file_url.split('/').pop(),
      contentType: f.content_type,
      sizeBytes: f.size_bytes === null ? null : Number(f.size_bytes),
    })),
  }
}

router.get('/:id', async (req, res) => {
  res.json(await loadOne(parseId(req.params.id)))
})

// Only applications that are waiting on the admin can be decided. Everything happens in
// one transaction so a decision, its audit entry and the new profile cannot half-apply.
async function decide(id, admin, { status, action, metadata }) {
  await withTransaction(async (db) => {
    const { rows } = await db.query(
      'SELECT * FROM applications WHERE application_id = $1 FOR UPDATE',
      [id],
    )
    const app = rows[0]
    if (!app) throw new HttpError(404, 'Application not found')
    if (!['PENDING', 'MORE_INFO_REQUIRED'].includes(app.status)) {
      throw new HttpError(409, `This application has already been ${app.status.toLowerCase()}.`)
    }

    await db.query('UPDATE applications SET status = $2 WHERE application_id = $1', [id, status])
    await db.query(
      `INSERT INTO audit_logs (actor_user_id, action, entity_type, entity_id, metadata)
       VALUES ($1, $2, 'APPLICATION', $3, $4)`,
      [admin.id, action, id, JSON.stringify(metadata)],
    )

    if (status === 'ACCEPTED') {
      // Accepting grants the PROVIDER role and creates the business profile the
      // provider needs before they can quote ("provider actions require an active
      // business profile"). Skipped if the owner already has one.
      await db.query(
        `INSERT INTO business_profiles
           (owner_user_id, business_name, owner_name, location_text, category_id,
            capacity, contact_number, about, business_status)
         SELECT $1, $2, $3, $4, $5, $6, $7, $8, 'ACTIVE'
          WHERE NOT EXISTS (SELECT 1 FROM business_profiles WHERE owner_user_id = $1)`,
        [app.owner_user_id, app.business_name, app.owner_name, app.location_text,
         app.category_id, app.capacity, app.contact_number, app.about],
      )
      await db.query(
        `INSERT INTO user_roles (user_id, role) VALUES ($1, 'PROVIDER')
         ON CONFLICT (user_id, role) DO NOTHING`,
        [app.owner_user_id],
      )
    }
  })
}

router.post('/:id/approve', async (req, res) => {
  const id = parseId(req.params.id)
  await decide(id, req.admin, { status: 'ACCEPTED', action: 'APPLICATION_ACCEPTED', metadata: {} })
  res.json(await loadOne(id))
})

router.post('/:id/reject', async (req, res) => {
  const id = parseId(req.params.id)
  const reason = requireText(req.body?.reason, 'Rejection reason')
  await decide(id, req.admin, {
    status: 'REJECTED',
    action: 'APPLICATION_REJECTED',
    metadata: { reason },
  })
  res.json(await loadOne(id))
})

router.post('/:id/request-info', async (req, res) => {
  const id = parseId(req.params.id)
  const message = requireText(req.body?.message, 'Request message')
  await decide(id, req.admin, {
    status: 'MORE_INFO_REQUIRED',
    action: 'APPLICATION_INFO_REQUESTED',
    metadata: { message },
  })
  res.json(await loadOne(id))
})

export default router
