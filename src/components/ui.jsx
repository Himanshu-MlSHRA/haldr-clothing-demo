import { useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { inr } from '../data/catalog'
import { reduceMotion } from '../lib/transition'

export function Stars({ value, size = 14 }) {
  return (
    <span className="stars" style={{ '--s': `${size}px` }} aria-label={`${value.toFixed(1)} out of 5`}>
      <span className="stars__bg">★★★★★</span>
      <span className="stars__fg" style={{ width: `${(value / 5) * 100}%` }}>★★★★★</span>
    </span>
  )
}

export function Price({ p, big }) {
  const off = p.compare ? Math.round((1 - p.price / p.compare) * 100) : 0
  return (
    <span className={`price ${big ? 'price--big' : ''}`}>
      <span className="price__now">{inr(p.price)}</span>
      {p.compare && <><s className="price__was">{inr(p.compare)}</s><span className="price__off">−{off}%</span></>}
    </span>
  )
}

export function Swatches({ colors, value, onChange, size = 'md', label }) {
  return (
    <div className={`swatches swatches--${size}`} role="radiogroup" aria-label={label || 'Colour'}>
      {colors.map((c, i) => (
        <button key={c.name} type="button" role="radio" aria-checked={i === value} aria-label={c.name}
          className={`sw ${i === value ? 'is-on' : ''}`} style={{ '--c': c.hex }}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onChange(i) }} />
      ))}
    </div>
  )
}

export function Marquee({ items, speed = 40, className = '' }) {
  const row = [...items, ...items]
  return (
    <div className={`marquee ${className}`} aria-hidden="true">
      <div className="marquee__track" style={{ '--dur': `${speed}s` }}>
        {row.map((t, i) => <span key={i} className="marquee__item">{t}<i>✦</i></span>)}
      </div>
    </div>
  )
}

// Split a heading into masked lines/words and slide them up when it enters.
export function useReveal(ref, { delay = 0, start = 'top 85%', immediate = false } = {}) {
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || reduceMotion) return
    const targets = el.querySelectorAll('[data-r]')
    const ctx = gsap.context(() => {
      gsap.from(targets, {
        yPercent: 110, opacity: 0, rotate: 2, duration: 1.1, ease: 'expo.out', stagger: 0.06, delay,
        scrollTrigger: immediate ? undefined : { trigger: el, start, once: true },
      })
    }, el)
    return () => ctx.revert()
  }, [])
}

export function Words({ text, className = '' }) {
  return (
    <span className={`words ${className}`}>
      {text.split(' ').map((w, i) => (
        <span className="w" key={i}><span data-r>{w}</span>{' '}</span>
      ))}
    </span>
  )
}

// Fade-and-rise for blocks of cards etc. (staggered children)
export function useStagger(ref, selector, { start = 'top 85%' } = {}) {
  useLayoutEffect(() => {
    if (!ref.current || reduceMotion) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray(selector).forEach((el, i) => {
        gsap.from(el, { y: 60, opacity: 0, duration: 1, ease: 'expo.out', delay: (i % 4) * 0.07,
          scrollTrigger: { trigger: el, start, once: true } })
      })
    }, ref)
    return () => ctx.revert()
  }, [])
}

// Button that leans toward the pointer.
export function useMagnet(ref, strength = 0.3) {
  useEffect(() => {
    const el = ref.current
    if (!el || reduceMotion || matchMedia('(hover: none)').matches) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' })
    const move = (e) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - r.left - r.width / 2) * strength)
      yTo((e.clientY - r.top - r.height / 2) * strength)
    }
    const leave = () => { xTo(0); yTo(0) }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave) }
  }, [])
}

export function Arrow() {
  return <svg className="arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
}

export function Icon({ name }) {
  const P = {
    bag: <path d="M5 8h14l-1.2 12H6.2L5 8Z M9 8V6a3 3 0 0 1 6 0v2" />,
    heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />,
    search: <><circle cx="11" cy="11" r="6" /><path d="m20 20-4.5-4.5" /></>,
    close: <path d="M6 6l12 12M18 6 6 18" />,
    truck: <><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" /><circle cx="7" cy="17" r="1.6" /><circle cx="17" cy="17" r="1.6" /></>,
    return: <path d="M4 10h11a5 5 0 0 1 0 10H9M4 10l4-4M4 10l4 4" />,
    lock: <><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
    check: <path d="m5 12 5 5 9-10" />,
    plus: <path d="M12 5v14M5 12h14" />,
    minus: <path d="M5 12h14" />,
    cube: <><path d="M12 3 4 7v10l8 4 8-4V7z" /><path d="M4 7l8 4 8-4M12 11v10" /></>,
    pin: <><path d="M12 21s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.7-6 10-6 10Z" /><circle cx="12" cy="11" r="2" /></>,
  }
  return <svg className="ico" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{P[name]}</svg>
}
