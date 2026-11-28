const isProd = process.env.NODE_ENV === 'production'

const jwtSecret = process.env.JWT_SECRET || (isProd ? '' : 'dev-only-secret-change-me')
if (!jwtSecret || (isProd && jwtSecret.length < 32)) {
  console.error('JWT_SECRET must be set (32+ characters) in production.')
  process.exit(1)
}

export const config = {
  isProd,
  port: Number(process.env.PORT || 4000),
  databaseUrl:
    process.env.DATABASE_URL ||
    'postgres://localbridge:localbridge101@localhost:5433/localbridge',
  jwtSecret,
  // Set COOKIE_SECURE=true once the admin is served over https.
  cookieSecure: process.env.COOKIE_SECURE === 'true',
  adminRole: 'ADMIN',
  maxFailedLogins: 5,
  lockMinutes: 15,
}
