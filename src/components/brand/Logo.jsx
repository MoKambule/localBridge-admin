import { palette, brand } from '../../brand'

export function LogoMark({ className = 'w-9 h-9' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="14" fill={palette.orange} />
      <path d="M18 17v27M46 17v27" stroke={palette.bark} strokeWidth="4" strokeLinecap="round" />
      <path d="M25 29.5V44M32 33V44M39 29.5V44" stroke={palette.copper} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M4 38 18 19Q32 47 46 19L60 38" fill="none" stroke={palette.ebony} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 44h56" stroke={palette.bark} strokeWidth="4" strokeLinecap="round" />
      <path d="M8 54q4.5-4 9 0t9 0t9 0t9 0t9 0" fill="none" stroke={palette.khaki} strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  )
}

export function Wordmark({ className = 'text-lg' }) {
  return (
    <span className={`font-bold leading-tight tracking-tight ${className}`}>
      <span style={{ color: palette.khaki }}>Local</span>
      <span style={{ color: palette.orange }}>Bridge</span>
    </span>
  )
}

export function Logo({ slogan = false, size = 'md' }) {
  const big = size === 'lg'
  return (
    <div className={`flex items-center ${big ? 'gap-4' : 'gap-3'}`}>
      <LogoMark className={big ? 'w-16 h-16' : 'w-9 h-9 shrink-0'} />
      <div>
        <Wordmark className={big ? 'text-4xl' : 'text-lg'} />
        {slogan && (
          <p
            className={`${big ? 'text-base mt-1' : 'text-[11px] mt-0.5'} leading-snug`}
            style={{ color: palette.khaki }}
          >
            {big ? brand.slogan : brand.sloganShort}
          </p>
        )}
      </div>
    </div>
  )
}
