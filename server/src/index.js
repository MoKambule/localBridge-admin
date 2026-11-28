import express from 'express'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { config } from './config.js'
import { pool } from './db.js'
import { HttpError } from './http.js'
import { requireAdmin } from './auth.js'
import { ensureAdmin } from './scripts/create-admin.js'
import authRoutes from './routes/auth.js'
import statsRoutes from './routes/stats.js'
import providerRoutes from './routes/providers.js'
import userRoutes from './routes/users.js'
import opportunityRoutes from './routes/opportunities.js'
import businessRoutes from './routes/businesses.js'
import quoteRoutes from './routes/quotes.js'

const app = express()
app.disable('x-powered-by')
app.set('trust proxy', 1)
app.use(helmet())
app.use(express.json({ limit: '50kb' }))
app.use(cookieParser())

app.get('/api/health', async (_req, res) => {
  await pool.query('SELECT 1')
  res.json({ ok: true })
})

app.use('/api/auth', authRoutes)

// Everything below needs a signed-in admin.
app.use('/api', requireAdmin)
app.use('/api', statsRoutes)
app.use('/api/providers', providerRoutes)
app.use('/api/users', userRoutes)
app.use('/api/opportunities', opportunityRoutes)
app.use('/api/businesses', businessRoutes)
app.use('/api/quotes', quoteRoutes)

app.use('/api', (_req, _res, next) => next(new HttpError(404, 'Not found')))

app.use((err, _req, res, _next) => {
  if (err instanceof HttpError) return res.status(err.status).json({ error: err.message })
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON' })
  console.error(err)
  res.status(500).json({ error: 'Something went wrong' })
})

async function waitForDb(attempts = 30) {
  for (let i = 1; i <= attempts; i++) {
    try {
      await pool.query('SELECT 1')
      return
    } catch (err) {
      if (i === attempts) throw err
      console.log(`Waiting for database (${i}/${attempts})...`)
      await new Promise((r) => setTimeout(r, 2000))
    }
  }
}

await waitForDb()
await ensureAdmin()
app.listen(config.port, () => console.log(`Admin API listening on :${config.port}`))
