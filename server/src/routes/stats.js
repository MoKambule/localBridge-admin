import { Router } from 'express'
import { query } from '../db.js'
import { config } from '../config.js'

const router = Router()

// Real people only: users who hold the ADMIN role are not counted.
const NOT_ADMIN = `NOT EXISTS (SELECT 1 FROM user_roles r WHERE r.user_id = u.id AND r.role = $1)`

router.get('/stats', async (_req, res) => {
  const { rows } = await query(
    `SELECT
       (SELECT count(*)::int FROM users u WHERE ${NOT_ADMIN}) AS total_users,
       (SELECT count(*)::int FROM users u
         WHERE ${NOT_ADMIN} AND u.created_at >= now() - interval '30 days') AS new_users_30d,
       (SELECT count(*)::int FROM business_profiles WHERE business_status = 'ACTIVE') AS businesses,
       (SELECT count(*)::int FROM applications WHERE status = 'PENDING') AS pending_applications,
       (SELECT count(*)::int FROM opportunities WHERE status = 'OPEN') AS open_opportunities,
       (SELECT count(*)::int FROM opportunities) AS total_opportunities,
       (SELECT count(*)::int FROM quotes WHERE status <> 'DRAFT') AS quotes,
       (SELECT count(*)::int FROM quotes WHERE status = 'ACCEPTED') AS accepted_quotes`,
    [config.adminRole],
  )
  const r = rows[0]
  res.json({
    totalUsers: r.total_users,
    newUsers30d: r.new_users_30d,
    businesses: r.businesses,
    pendingApplications: r.pending_applications,
    openOpportunities: r.open_opportunities,
    totalOpportunities: r.total_opportunities,
    quotes: r.quotes,
    acceptedQuotes: r.accepted_quotes,
  })
})

// Activity feed built from real rows: registrations, applications, and admin decisions
// (which the portal records in audit_logs).
router.get('/activity', async (req, res) => {
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100)
  const { rows } = await query(
    `SELECT * FROM (
        SELECT 'reg-' || u.id AS id,
               'New Registration' AS type,
               u.display_name AS actor,
               u.created_at AS at,
               'A new account was created on LocalBridge.' AS description,
               'Completed' AS status
          FROM users u
         WHERE ${NOT_ADMIN}
        UNION ALL
        SELECT 'app-' || ap.application_id,
               'Provider Application',
               ap.owner_name,
               ap.created_at,
               ap.business_name || ' submitted an application for review.',
               CASE ap.status WHEN 'PENDING' THEN 'Pending'
                              WHEN 'ACCEPTED' THEN 'Approved'
                              WHEN 'REJECTED' THEN 'Rejected'
                              ELSE 'More Information Required' END
          FROM applications ap
        UNION ALL
        SELECT 'log-' || al.id,
               'Application Reviewed',
               COALESCE(a.display_name, 'Admin'),
               al.created_at,
               ap.business_name || ' was ' ||
                 CASE al.action WHEN 'APPLICATION_ACCEPTED' THEN 'approved.'
                                WHEN 'APPLICATION_REJECTED' THEN 'rejected.'
                                ELSE 'sent back for more information.' END,
               'Completed'
          FROM audit_logs al
          JOIN applications ap ON ap.application_id = al.entity_id
          LEFT JOIN users a ON a.id = al.actor_user_id
         WHERE al.entity_type = 'APPLICATION'
           AND al.action IN ('APPLICATION_ACCEPTED','APPLICATION_REJECTED','APPLICATION_INFO_REQUESTED')
      ) feed
      ORDER BY at DESC
      LIMIT $2`,
    [config.adminRole, limit],
  )
  res.json(rows.map((r) => ({ ...r, user: r.actor, time: r.at })))
})

export default router
