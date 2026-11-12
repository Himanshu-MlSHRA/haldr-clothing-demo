import { createContext, forwardRef, useCallback, useContext, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const Ctx = createContext(null)

const label = (path) => {
  if (path === '/') return 'Home'
  if (path.startsWith('/shop')) return 'Shop'
  if (path.startsWith('/product')) return 'Product'
  if (path.startsWith('/cart')) return 'Bag'
  if (path.startsWith('/checkout')) return 'Checkout'
  if (path.startsWith('/order')) return 'Order'
  if (path.startsWith('/about')) return 'About'
  return ''
}

export function TransitionProvider({ children }) {
  const navigate = useNavigate()
  const loc = useLocation()
  const busy = useRef(false)
  const curtain = useRef(null)
  const word = useRef(null)

  const go = useCallback((to, opts = {}) => {
    const path = typeof to === 'string' ? to : to.pathname
    if (busy.current) return
    if (path === loc.pathname + loc.search && !opts.force) { window.__lenis?.scrollTo(0); return }
    const finish = () => {
      navigate(to, opts)
      window.__lenis?.scrollTo(0, { immediate: true })
      window.scrollTo(0, 0)
    }
    if (reduceMotion || !curtain.current) { finish(); return }
    busy.current = true
    word.current.textContent = label(path.split('?')[0])
    const tl = gsap.timeline({ onComplete: () => { busy.current = false } })
    tl.set(curtain.current, { display: 'flex', yPercent: 100 })
      .to(curtain.current, { yPercent: 0, duration: 0.55, ease: 'expo.inOut' })
      .fromTo(word.current, { yPercent: 110 }, { yPercent: 0, duration: 0.45, ease: 'expo.out' }, 0.25)
      .add(() => { finish() })
      .add(() => requestAnimationFrame(() => ScrollTrigger.refresh()), '+=0.05')
      .to(word.current, { yPercent: -110, duration: 0.4, ease: 'expo.in' }, '+=0.15')
      .to(curtain.current, { yPercent: -100, duration: 0.6, ease: 'expo.inOut' }, '-=0.2')
      .set(curtain.current, { display: 'none' })
  }, [navigate, loc])

  return (
    <Ctx.Provider value={go}>
      {children}
      <div ref={curtain} className="curtain" aria-hidden="true">
        <span className="curtain__brand">HALDR</span>
        <span className="curtain__clip"><span ref={word} className="curtain__word" /></span>
      </div>
    </Ctx.Provider>
  )
}

export const useGo = () => useContext(Ctx)

// A Link that plays the curtain. Falls back to normal behaviour for new-tab clicks.
export const TLink = forwardRef(function TLink({ to, children, onClick, ...rest }, ref) {
  const go = useGo()
  return (
    <Link
      ref={ref}
      to={to}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
        e.preventDefault()
        go(to)
      }}
      {...rest}
    >
      {children}
    </Link>
  )
})
