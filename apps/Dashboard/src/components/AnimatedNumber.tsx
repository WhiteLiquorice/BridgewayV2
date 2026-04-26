import { useState, useEffect, useRef } from 'react'

/**
 * Animated counter that tweens from 0 to `value`.
 *
 * Props:
 *  value      – target number
 *  duration   – animation duration in ms (default 800)
 *  prefix     – e.g. "$"
 *  suffix     – e.g. "%"
 *  decimals   – decimal places (default 0)
 *  className  – applied to the <span>
 */
export default function AnimatedNumber({ value, duration = 800, prefix = '', suffix = '', decimals = 0, className = '' }) {
  const [display, setDisplay] = useState(0)
  const rafRef = useRef(null)
  const startRef = useRef(null)
  const fromRef = useRef(0)

  useEffect(() => {
    fromRef.current = display
    startRef.current = null

    function animate(ts) {
      if (!startRef.current) startRef.current = ts
      const elapsed = ts - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      // ease-out quad
      const eased = 1 - (1 - progress) * (1 - progress)
      const current = fromRef.current + (value - fromRef.current) * eased
      setDisplay(current)
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [value, duration])

  const formatted = Number(display).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return (
    <span className={`tabular-nums ${className}`}>
      {prefix}{formatted}{suffix}
    </span>
  )
}
