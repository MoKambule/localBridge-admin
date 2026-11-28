import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '../context/appContext'
import { Logo, LogoMark, Wordmark } from '../components/brand/Logo'
import { brand, palette } from '../brand'

function Login() {
  const { user, ready, login } = useAuth()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (ready && user) return <Navigate to={location.state?.from || '/'} replace />

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await login(email, password)
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-2 bg-brand-900">
      {/* Brand panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 text-white pt-safe">
        <div />
        <div>
          <LogoMark className="w-24 h-24 mb-8" />
          <h2 className="text-4xl font-bold leading-tight max-w-md">
            <Wordmark className="text-5xl block mb-3" />
            <span className="text-2xl font-semibold" style={{ color: palette.khaki }}>
              {brand.slogan}
            </span>
          </h2>
        </div>
        <p className="text-sm text-teal-100/60">Admin portal · authorised staff only</p>
      </div>

      {/* Form */}
      <div className="flex flex-col justify-center min-h-dvh lg:min-h-0 px-5 py-10 bg-brand-900 lg:bg-gray-50 pt-safe pb-safe">
        <div className="lg:hidden mb-8 mx-auto text-center">
          <div className="inline-block text-left">
            <Logo slogan />
          </div>
        </div>

        <form
          onSubmit={submit}
          className="w-full max-w-sm mx-auto bg-white rounded-2xl shadow-xl lg:shadow-sm lg:border border-gray-200 p-6 sm:p-8"
        >
          <h1 className="text-xl font-bold text-brand-900">Sign in</h1>
          <p className="text-sm text-gray-500 mt-1">Use your admin account.</p>

          {error && (
            <p role="alert" className="mt-4 rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <label className="block mt-5 text-sm font-medium text-gray-700" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base sm:text-sm outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600"
          />

          <label className="block mt-4 text-sm font-medium text-gray-700" htmlFor="password">
            Password
          </label>
          <div className="relative mt-1">
            <input
              id="password"
              type={show ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-11 text-base sm:text-sm outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600"
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              aria-label={show ? 'Hide password' : 'Show password'}
              className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600"
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {busy && <Loader2 size={16} className="animate-spin" />}
            Sign in
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
