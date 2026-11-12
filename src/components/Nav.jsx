import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { CATEGORIES, PRODUCTS, img, inr } from '../data/catalog'
import { TLink, useGo } from '../lib/transition'
import { useStore } from '../store'
import { Icon } from './ui'

const LINKS = [
  { to: '/shop', label: 'Shop all' },
  { to: '/shop/tshirts', label: 'Tees' },
  { to: '/shop/jackets', label: 'Jackets' },
  { to: '/shop/shoes', label: 'Shoes' },
  { to: '/shop/gear', label: 'Trek gear' },
  { to: '/about', label: 'About' },
]

export default function Nav() {
  const { totals, setDrawer, wish } = useStore()
  const loc = useLocation()
  const [menu, setMenu] = useState(false)
  const [search, setSearch] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [solid, setSolid] = useState(false)
  const bag = useRef(null)
  const menuRef = useRef(null)
  const last = useRef(0)

  useEffect(() => {
    const on = () => {
      const y = window.scrollY
      setSolid(y > 20)
      if (y > 300 && y > last.current + 4) setHidden(true)
      else if (y < last.current - 4 || y < 300) setHidden(false)
      last.current = y
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => { setMenu(false); setSearch(false); setHidden(false) }, [loc.pathname])
  useEffect(() => {
    if (totals.count && bag.current) gsap.fromTo(bag.current, { scale: 1.35, rotate: -10 }, { scale: 1, rotate: 0, duration: 0.8, ease: 'elastic.out(1, 0.35)' })
  }, [totals.count])
  useEffect(() => {
    document.documentElement.classList.toggle('lock', menu || search)
    if (menu || search) window.__lenis?.stop(); else window.__lenis?.start()
    if (menu && menuRef.current) {
      gsap.fromTo(menuRef.current.querySelectorAll('.mm__link'), { yPercent: 120 }, { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.05, delay: 0.15 })
      gsap.fromTo(menuRef.current.querySelectorAll('.mm__cat'), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', stagger: 0.06, delay: 0.3 })
    }
  }, [menu, search])

  const active = (to) => (to === '/shop' ? loc.pathname === '/shop' : loc.pathname.startsWith(to))

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className={`nav ${solid ? 'is-solid' : ''} ${hidden && !menu ? 'is-hidden' : ''} ${menu ? 'is-menu' : ''}`}>
        <div className="wrap nav__row">
          <TLink to="/" className="logo" aria-label="HALDR home">
            <span className="logo__mark" aria-hidden="true"><i /><i /><i /><i /></span>HALDR
          </TLink>
          <nav className="nav__links" aria-label="Main">
            {LINKS.map((l) => (
              <TLink key={l.to} to={l.to} className={`nav__link ${active(l.to) ? 'is-on' : ''}`}>
                <span className="br">{'{'}</span>{l.label}<span className="br">{'}'}</span>
              </TLink>
            ))}
          </nav>
          <div className="nav__end">
            <button className="ibtn" aria-label="Search" onClick={() => setSearch(true)}><Icon name="search" /></button>
            <TLink to="/shop?wish=1" className="ibtn ibtn--hide-sm" aria-label={`Wishlist, ${wish.length} items`}>
              <Icon name="heart" />{wish.length > 0 && <span className="dot">{wish.length}</span>}
            </TLink>
            <button ref={bag} className="ibtn" aria-label={`Bag, ${totals.count} items`} onClick={() => setDrawer(true)}>
              <Icon name="bag" />{totals.count > 0 && <span className="dot dot--accent">{totals.count}</span>}
            </button>
            <button className={`burger ${menu ? 'is-open' : ''}`} aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu} onClick={() => setMenu((m) => !m)}>
              <span /><span />
            </button>
          </div>
        </div>
      </header>

      <div ref={menuRef} className={`mm ${menu ? 'is-open' : ''}`} aria-hidden={!menu} data-lenis-prevent>
        <div className="wrap mm__inner">
          <nav className="mm__nav" aria-label="Mobile">
            {[{ to: '/', label: 'Home' }, ...LINKS, { to: '/cart', label: 'Bag' }].map((l, i) => (
              <div className="mm__clip" key={l.to}>
                <TLink to={l.to} className="mm__link" tabIndex={menu ? 0 : -1}><span className="mono">0{i + 1}</span>{l.label}</TLink>
              </div>
            ))}
          </nav>
          <div className="mm__cats">
            {CATEGORIES.slice(0, 4).map((c) => (
              <TLink key={c.id} to={`/shop/${c.id}`} className="mm__cat" tabIndex={menu ? 0 : -1}>
                <img src={img(c.img)} alt="" loading="lazy" /><span>{c.name}</span>
              </TLink>
            ))}
          </div>
          <p className="mm__foot mono">Free shipping over ₹2,999 · 30-day returns · Cash on delivery</p>
        </div>
      </div>

      {search && <Search onClose={() => setSearch(false)} />}
    </>
  )
}

function Search({ onClose }) {
  const [q, setQ] = useState('')
  const go = useGo()
  const box = useRef(null)
  const input = useRef(null)
  useEffect(() => {
    input.current?.focus()
    gsap.fromTo(box.current, { yPercent: -100 }, { yPercent: 0, duration: 0.6, ease: 'expo.out' })
    const k = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [])
  const res = q.trim().length < 1 ? PRODUCTS.filter((p) => p.badge === 'Bestseller').slice(0, 6)
    : PRODUCTS.filter((p) => (p.name + ' ' + p.cat + ' ' + p.colors.map((c) => c.name).join(' ')).toLowerCase().includes(q.toLowerCase())).slice(0, 8)
  const pick = (p) => { onClose(); go(`/product/${p.id}`) }
  return (
    <div className="search" role="dialog" aria-modal="true" aria-label="Search">
      <div className="search__scrim" onClick={onClose} />
      <div ref={box} className="search__box" data-lenis-prevent>
        <div className="wrap">
          <div className="search__row">
            <Icon name="search" />
            <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search jackets, boots, tees…" aria-label="Search products"
              onKeyDown={(e) => { if (e.key === 'Enter' && res[0]) pick(res[0]) }} />
            <button className="ibtn" onClick={onClose} aria-label="Close search"><Icon name="close" /></button>
          </div>
          <p className="mono muted search__k">{q ? `${res.length} results` : 'Bestsellers'}</p>
          <ul className="search__list">
            {res.map((p) => (
              <li key={p.id}>
                <button onClick={() => pick(p)}>
                  <img src={img(p.colors[0].images[0])} alt="" />
                  <span>{p.name}</span>
                  <span className="mono">{inr(p.price)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
