import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CATEGORIES, PRODUCTS, byId, img, inr, inCat, reviewsFor, EDITORIAL, TREK } from '../data/catalog'
import { TLink, useGo, reduceMotion } from '../lib/transition'
import ProductCard from '../components/ProductCard'
import { Arrow, Icon, Marquee, Stars, useMagnet, useReveal, Words } from '../components/ui'

const Shoe3D = lazy(() => import('../components/Shoe3D'))

/* ------------------------------------------------------------------ hero */
function Hero() {
  const root = useRef(null)
  const cta = useRef(null)
  useMagnet(cta, 0.35)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!reduceMotion) {
        const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.15 })
        tl.from('.hero__strip > *', { y: 30, opacity: 0, duration: 1, stagger: 0.08 })
          .from('.hero__giant span', { yPercent: 105, duration: 1.4, stagger: 0.06 }, 0.1)
          .fromTo('.hero__rackclip', { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut' }, 0.2)
          .from('.hero__rack', { rotate: -5, duration: 2.6, ease: 'elastic.out(1, 0.25)' }, 0.9)
          .from('.hero__foot > *', { y: 24, opacity: 0, duration: 1, stagger: 0.08 }, 1)
          .from('.spot', { scale: 0, duration: 0.8, stagger: 0.1, ease: 'back.out(3)' }, 1.4)
      }
      // scroll: giant type drifts, rack rises
      gsap.to('.hero__giant', { xPercent: -14, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.8 } })
      gsap.to('.hero__rackwrap', { yPercent: -10, scale: 1.04, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.8 } })
      // the rack swings with scroll speed, like a real one would when bumped
      if (!reduceMotion) {
        const rot = gsap.quickTo('.hero__rack', 'rotate', { duration: 1.4, ease: 'elastic.out(1, 0.3)' })
        ScrollTrigger.create({ trigger: root.current, start: 'top top', end: 'bottom top',
          onUpdate: (s) => rot(gsap.utils.clamp(-4, 4, s.getVelocity() / -600)) })
      }
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="hero">
      <div className="wrap">
        <div className="hero__strip">
          <p className="hero__kicker">A NEW<br />CHAPTER</p>
          <span className="hero__badge" aria-hidden="true"><span className="logo__mark logo__mark--lg"><i /><i /><i /><i /></span></span>
          <p className="hero__season">FIELD / 26<br /><span className="muted">Apparel & trail supply</span></p>
          <TLink ref={cta} to="/shop" className="btn btn--grad">Shop the drop <Arrow /></TLink>
        </div>
      </div>
      <div className="hero__stage">
        <p className="hero__giant" aria-hidden="true">{'HALDR'.split('').map((l, i) => <span key={i}>{l}</span>)}</p>
        <div className="hero__rackwrap">
          <div className="hero__rackclip">
            <div className="hero__rack">
              <img src={img('rack-mixed')} alt="Caps, denim, a hoodie and a knit hanging on a chrome clothing rack" fetchpriority="high" />
              <TLink to="/shop/gear" className="spot" style={{ left: '22%', top: '19%' }}><i /><span>Caps & beanies</span></TLink>
              <TLink to="/shop/hoodies" className="spot" style={{ left: '56%', top: '34%' }}><i /><span>Hoodies from {inr(2990)}</span></TLink>
              <TLink to="/shop/shirts" className="spot" style={{ left: '76%', top: '44%' }}><i /><span>Shirts & knits</span></TLink>
            </div>
          </div>
        </div>
      </div>
      <div className="wrap hero__foot">
        <h1 className="hero__h1">Clothing, shoes and trek gear for city days and mountain weekends.</h1>
        <div className="hero__meta">
          <p><b>{PRODUCTS.length}</b> pieces · tees from <b>{inr(990)}</b></p>
          <p className="muted">Free shipping over ₹2,999 · COD available</p>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------ categories */
function Categories() {
  const root = useRef(null)
  const float = useRef(null)
  const [hover, setHover] = useState(0)
  useReveal(root)
  useEffect(() => {
    const el = float.current
    if (!el || matchMedia('(hover: none)').matches) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' })
    const move = (e) => { const r = root.current.getBoundingClientRect(); xTo(e.clientX - r.left); yTo(e.clientY - r.top) }
    root.current.addEventListener('pointermove', move)
    return () => root.current?.removeEventListener('pointermove', move)
  }, [])
  return (
    <section ref={root} className="cats sec">
      <div className="wrap">
        <div className="sec__head">
          <p className="mono">{'{ 01 }'} Categories</p>
          <h2 className="h2"><Words text="Shop by category" /></h2>
        </div>
        <ul className="cats__list">
          {CATEGORIES.map((c, i) => (
            <li key={c.id} onPointerEnter={() => { setHover(i); float.current?.classList.add('is-on') }} onPointerLeave={() => float.current?.classList.remove('is-on')}>
              <TLink to={`/shop/${c.id}`} className="cats__row">
                <span className="mono cats__n">0{i + 1}</span>
                <span className="cats__name">{c.name}</span>
                <span className="cats__blurb">{c.blurb}</span>
                <span className="cats__count mono">{inCat(c.id).length} items</span>
                <img className="cats__thumb" src={img(c.img)} alt="" loading="lazy" />
                <span className="cats__arrow"><Arrow /></span>
              </TLink>
            </li>
          ))}
        </ul>
      </div>
      <div ref={float} className="cats__float" aria-hidden="true">
        {CATEGORIES.map((c, i) => <img key={c.id} src={img(c.img)} alt="" className={i === hover ? 'is-on' : ''} />)}
      </div>
    </section>
  )
}

/* ---------------------------------------------------------- best sellers */
function BestSellers() {
  const root = useRef(null)
  const [tab, setTab] = useState('all')
  const tabs = [['all', 'All'], ['tshirts', 'Tees'], ['jackets', 'Jackets'], ['shoes', 'Shoes'], ['gear', 'Gear']]
  const list = (tab === 'all' ? PRODUCTS.filter((p) => p.badge === 'Bestseller' || p.badge === 'New' || p.badge === '3D') : inCat(tab)).slice(0, 8)
  useReveal(root)
  useEffect(() => {
    if (reduceMotion) return
    gsap.fromTo('.best .card', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'expo.out', stagger: 0.05 })
  }, [tab])
  return (
    <section ref={root} className="best sec">
      <div className="wrap">
        <h2 className="giant-title"><Words text="BEST SELLERS" /></h2>
        <div className="best__bar">
          <div className="tabs" role="tablist">
            {tabs.map(([id, l]) => <button key={id} role="tab" aria-selected={tab === id} className={`tab ${tab === id ? 'is-on' : ''}`} onClick={() => setTab(id)}>{l}</button>)}
          </div>
          <TLink to="/shop" className="ulink mono">View all {PRODUCTS.length} →</TLink>
        </div>
        <div className="grid grid--4">{list.map((p, i) => <ProductCard key={p.id} p={p} eager={i < 4} />)}</div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------ 3D feature */
function Feature3D() {
  const root = useRef(null)
  const [v, setV] = useState(0)
  const [show, setShow] = useState(false)
  const p = byId['trail-runner-01']
  useReveal(root)
  useEffect(() => {
    const io = new IntersectionObserver((e) => { if (e[e.length - 1].isIntersecting) { setShow(true); io.disconnect() } }, { rootMargin: '400px' })
    io.observe(root.current)
    return () => io.disconnect()
  }, [])
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.f3d__ghost', { xPercent: 20 }, { xPercent: -30, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 1 } })
    }, root)
    return () => ctx.revert()
  }, [])
  return (
    <section ref={root} className="f3d sec">
      <p className="f3d__ghost" aria-hidden="true">TRAIL RUNNER 01</p>
      <div className="wrap f3d__grid">
        <div className="f3d__copy">
          <p className="mono">{'{ 02 }'} In 3D</p>
          <h2 className="h2"><Words text="Trail Runner 01, from every angle." /></h2>
          <p className="lead">Drag to turn it. Three colourways, one lugged outsole, 290 g a shoe.</p>
          <ul className="f3d__specs">
            {p.details.map((d) => <li key={d}><Icon name="check" />{d}</li>)}
          </ul>
          <div className="f3d__variants" role="radiogroup" aria-label="Colourway">
            {p.colors.map((c, i) => (
              <button key={c.name} role="radio" aria-checked={v === i} className={`vbtn ${v === i ? 'is-on' : ''}`} onClick={() => setV(i)}>
                <span style={{ background: c.hex }} />{c.name}
              </button>
            ))}
          </div>
          <div className="f3d__buy">
            <span className="price price--big"><span className="price__now">{inr(p.price)}</span></span>
            <TLink to={`/product/${p.id}?c=${v}`} className="btn btn--ink">Shop Trail Runner 01 <Arrow /></TLink>
          </div>
        </div>
        <div className="f3d__stage">
          {show && <Suspense fallback={<div className="shoe3d"><div className="shoe3d__load"><span /></div></div>}><Shoe3D variant={p.colors[v].variant} /></Suspense>}
          <p className="f3d__hint mono"><Icon name="cube" /> Drag to rotate</p>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------- editorial (pinned) */
function Editorial() {
  const root = useRef(null)
  const track = useRef(null)
  const shots = [EDITORIAL[3], TREK[2], EDITORIAL[0], TREK[6], EDITORIAL[8], TREK[0], EDITORIAL[5], TREK[8]]
  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 900px)', () => {
      const dist = () => track.current.scrollWidth - window.innerWidth
      gsap.to(track.current, { x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: root.current, pin: true, start: 'top top', end: () => `+=${dist()}`, scrub: 0.8, invalidateOnRefresh: true } })
      gsap.utils.toArray('.ed__item img').forEach((im) => {
        gsap.fromTo(im, { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${dist()}`, scrub: true } })
      })
    })
    return () => mm.revert()
  }, [])
  return (
    <section ref={root} className="ed">
      <div ref={track} className="ed__track">
        <div className="ed__intro">
          <p className="mono">{'{ 03 }'} Field notes</p>
          <h2 className="giant-title giant-title--left">OUT<br />THERE</h2>
          <p className="lead">The same pieces, a long way from the city. Shot on weekends between Manali and the Western Ghats.</p>
          <TLink to="/shop/jackets" className="btn btn--line">Shop outerwear <Arrow /></TLink>
        </div>
        {shots.map((s, i) => (
          <figure key={s} className={`ed__item ed__item--${i % 3}`}>
            <img src={img(s)} alt="" loading="lazy" />
            <span className="mono ed__n">{String(i + 1).padStart(2, '0')}</span>
          </figure>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------- shop the kit */
const KIT = [
  { id: 'ascent-28', x: 42, y: 47, c: 0 },
  { id: 'alpine-leather-boot', x: 17, y: 69, c: 0 },
  { id: 'heavyweight-box-tee', x: 73, y: 54, c: 2 },
  { id: 'watch-beanie', x: 62, y: 12, c: 2 },
]
function Kit() {
  const root = useRef(null)
  const [open, setOpen] = useState(0)
  const go = useGo()
  useReveal(root)
  const p = byId[KIT[open].id]
  return (
    <section ref={root} className="kit sec">
      <div className="wrap kit__grid">
        <div className="kit__img">
          <img src={img('gear-flat5')} alt="Trekking kit laid out: poles, hat, pack, boots, sweater and socks" loading="lazy" />
          {KIT.map((k, i) => (
            <button key={k.id} className={`hot ${open === i ? 'is-on' : ''}`} style={{ left: `${k.x}%`, top: `${k.y}%` }} onClick={() => setOpen(i)} aria-label={`Show ${byId[k.id].name}`}>
              <span />
            </button>
          ))}
        </div>
        <div className="kit__side">
          <p className="mono">{'{ 04 }'} Shop the kit</p>
          <h2 className="h2"><Words text="Packed for three days in the hills." /></h2>
          <p className="lead">Tap a dot to see what’s in the kit.</p>
          <div key={open} className="kit__card">
            <img src={img(p.colors[KIT[open].c].images[0])} alt="" />
            <div>
              <p className="mono muted">{String(open + 1).padStart(2, '0')} / {String(KIT.length).padStart(2, '0')}</p>
              <h3>{p.name}</h3>
              <p className="muted small">{p.blurb}</p>
              <div className="kit__row"><b>{inr(p.price)}</b><button className="btn btn--ink btn--sm" onClick={() => go(`/product/${p.id}?c=${KIT[open].c}`)}>View product <Arrow /></button></div>
            </div>
          </div>
          <div className="kit__dots">{KIT.map((k, i) => <button key={k.id} aria-label={byId[k.id].name} className={open === i ? 'is-on' : ''} onClick={() => setOpen(i)} />)}</div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------- reviews */
function Reviews() {
  const root = useRef(null)
  useReveal(root)
  const all = PRODUCTS.slice(0, 14).flatMap((p) => reviewsFor(p).slice(0, 1).map((r) => ({ ...r, p })))
  const half = Math.ceil(all.length / 2)
  const Row = ({ items, dir }) => (
    <div className={`rv__row rv__row--${dir}`}>
      <div className="rv__track">
        {[...items, ...items].map((r, i) => (
          <article key={i} className="rv">
            <Stars value={r.stars} />
            <h3>“{r.title}”</h3>
            <p>{r.body}</p>
            <footer><img src={img(r.p.colors[0].images[0])} alt="" /><span><b>{r.name}</b> · {r.city}<br /><span className="muted">{r.p.name}</span></span></footer>
          </article>
        ))}
      </div>
    </div>
  )
  return (
    <section ref={root} className="rvs sec">
      <div className="wrap rvs__head">
        <div>
          <p className="mono">{'{ 05 }'} Reviews</p>
          <h2 className="h2"><Words text="12,400 reviews and counting." /></h2>
        </div>
        <div className="rvs__score"><span className="rvs__big">4.8</span><div><Stars value={4.8} size={20} /><p className="muted small">Average across all products</p></div></div>
      </div>
      <Row items={all.slice(0, half)} dir="l" />
      <Row items={all.slice(half)} dir="r" />
    </section>
  )
}

function Perks() {
  const items = [['truck', 'Free shipping', 'On orders over ₹2,999'], ['return', '30-day returns', 'Free pickup from your door'], ['lock', 'Secure checkout', 'Cards, UPI and COD'], ['pin', 'Made in India', 'Cut and sewn in Tiruppur']]
  return (
    <section className="perks">
      <div className="wrap perks__grid">
        {items.map(([i, h, s]) => <div key={h} className="perk"><Icon name={i} /><div><b>{h}</b><span className="muted">{s}</span></div></div>)}
      </div>
    </section>
  )
}

export default function Home() {
  useEffect(() => { document.title = 'HALDR — Clothing, shoes & trek gear' }, [])
  return (
    <>
      <Hero />
      <Marquee items={['New drop — FIELD/26', 'Free shipping over ₹2,999', 'Cash on delivery', 'Use HALDR10 for 10% off']} speed={30} className="marquee--accent" />
      <Categories />
      <BestSellers />
      <Feature3D />
      <Editorial />
      <Kit />
      <Reviews />
      <Perks />
    </>
  )
}
