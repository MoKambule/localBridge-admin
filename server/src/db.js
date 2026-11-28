import pg from 'pg'
import { config } from './config.js'

export const pool = new pg.Pool({ connectionString: config.databaseUrl, max: 10 })

pool.on('error', (err) => console.error('Unexpected Postgres error', err))

export const query = (text, params) => pool.query(text, params)

// Run fn inside a transaction; commits on success, rolls back on any throw.
export async function withTransaction(fn) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await fn(client)
    await client.query('COMMIT')
    return result
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}
