import { lazy, Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import gsap from 'gsap'
import { byId, catName, img, inr, PRODUCTS, reviewsFor } from '../data/catalog'
import { TLink, reduceMotion } from '../lib/transition'
import { useStore } from '../store'
import ProductCard from '../components/ProductCard'
import { Arrow, Icon, Price, Stars, Swatches } from '../components/ui'

const Shoe3D = lazy(() => import('../components/Shoe3D'))

// Lenis isn't running when reduced motion is on, so fall back to a native scroll.
function scrollToEl(sel, offset) {
  if (window.__lenis) { window.__lenis.scrollTo(sel, { offset }); return }
  const el = document.querySelector(sel)
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset })
}

function Gallery({ p, color }) {
  const imgs = p.colors[color].images
  const slides = p.model3d ? ['__3d', ...imgs] : imgs
  const [i, setI] = useState(0)
  const [phone, setPhone] = useState(() => matchMedia('(max-width: 899px)').matches)
  useEffect(() => { const m = matchMedia('(max-width: 899px)'); const on = () => setPhone(m.matches); m.addEventListener('change', on); return () => m.removeEventListener('change', on) }, [])
  const main = useRef(null)
  const strip = useRef(null)
  useEffect(() => { setI(0); if (strip.current) strip.current.scrollLeft = 0 }, [color, p.id])
  useEffect(() => {
    if (reduceMotion || !main.current) return
    gsap.fromTo(main.current, { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', duration: 0.9, ease: 'expo.inOut' })
  }, [i, color])
  const zoom = (e) => {
    const im = e.currentTarget.querySelector('img'); if (!im) return
    const r = e.currentTarget.getBoundingClientRect()
    im.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`
  }
  const cur = slides[i]
  return (
    <div className="gal">
      <div className="gal__thumbs" role="tablist" aria-label="Product images">
        {slides.map((s, k) => (
          <button key={s} role="tab" aria-selected={i === k} className={`gal__t ${i === k ? 'is-on' : ''}`} onClick={() => setI(k)}>
            {s === '__3d' ? <span className="gal__3d"><Icon name="cube" />3D</span> : <img src={img(s)} alt="" />}
          </button>
        ))}
      </div>
      {!phone && <div className="gal__main">
        {cur === '__3d' ? (
          <div ref={main} className="gal__frame gal__frame--3d">
            <Suspense fallback={<div className="shoe3d"><div className="shoe3d__load"><span /></div></div>}>
              <Shoe3D variant={p.colors[color].variant} />
            </Suspense>
            <p className="f3d__hint mono"><Icon name="cube" /> Drag to rotate</p>
          </div>
        ) : (
          <div ref={main} className="gal__frame gal__frame--zoom" onPointerMove={zoom}>
            <img src={img(cur)} alt={`${p.name}, ${p.colors[color].name}`} />
          </div>
        )}
      </div>}
      {/* phone: swipe strip */}
      {phone && <div ref={strip} className="gal__strip" onScroll={(e) => setI(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}>
        {slides.map((s) => (
          <div key={s} className={`gal__slide ${s === '__3d' ? 'gal__slide--3d' : ''}`}>
            {s === '__3d' ? <Suspense fallback={null}><Shoe3D variant={p.colors[color].variant} /></Suspense> : <img src={img(s)} alt={`${p.name}, ${p.colors[color].name}`} />}
          </div>
        ))}
      </div>}
      {slides.length > 1 && <div className="gal__dots">{slides.map((s, k) => <span key={s} className={i === k ? 'is-on' : ''} />)}</div>}
    </div>
  )
}

function SizeGuide({ onClose, shoe }) {
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Size guide">
      <div className="modal__scrim" onClick={onClose} />
      <div className="modal__box" data-lenis-prevent>
        <div className="drawer__head"><h2>Size guide</h2><button className="ibtn" onClick={onClose} aria-label="Close"><Icon name="close" /></button></div>
        {shoe ? (
          <table className="tbl"><thead><tr><th>UK</th><th>EU</th><th>US</th><th>Foot (cm)</th></tr></thead>
            <tbody>{[[6, 39, 7, 24.5], [7, 41, 8, 25.4], [8, 42, 9, 26.2], [9, 43, 10, 27.1], [10, 44.5, 11, 27.9], [11, 46, 12, 28.8]].map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody></table>
        ) : (
          <table className="tbl"><thead><tr><th>Size</th><th>Chest (cm)</th><th>Length (cm)</th><th>Fits</th></tr></thead>
            <tbody>{[['XS', 104, 68, '34"'], ['S', 110, 70, '36"'], ['M', 116, 72, '38–40"'], ['L', 122, 74, '42"'], ['XL', 128, 76, '44"'], ['XXL', 134, 78, '46"']].map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody></table>
        )}
        <p className="muted small">Between sizes? Our tees and hoodies are boxy — size down for a regular fit.</p>
      </div>
    </div>
  )
}

function Accordion({ items }) {
  const [open, setOpen] = useState(0)
  return (
    <div className="acc">
      {items.map(([h, body], i) => (
        <div key={h} className={`acc__item ${open === i ? 'is-open' : ''}`}>
          <button className="acc__h" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>{h}<span className="acc__pm" /></button>
          <div className="acc__body"><div>{body}</div></div>
        </div>
      ))}
    </div>
  )
}

function Reviews({ p }) {
  const { myReviews, addReview, notify } = useStore()
  const base = useMemo(() => reviewsFor(p), [p.id])
  const list = [...(myReviews[p.id] || []), ...base]
  const [form, setForm] = useState(false)
  const [sort, setSort] = useState('recent')
  const [f, setF] = useState({ stars: 0, title: '', body: '', name: '' })
  const [err, setErr] = useState({})
  const [helpful, setHelpful] = useState({})
  const dist = [5, 4, 3, 2, 1].map((s) => list.filter((r) => r.stars === s).length)
  const avg = list.reduce((s, r) => s + r.stars, 0) / list.length
  const shown = sort === 'high' ? [...list].sort((a, b) => b.stars - a.stars) : sort === 'low' ? [...list].sort((a, b) => a.stars - b.stars) : list

  const submit = (e) => {
    e.preventDefault()
    const er = {}
    if (!f.stars) er.stars = 'Pick a star rating.'
    if (f.title.trim().length < 3) er.title = 'Add a short title.'
    if (f.body.trim().length < 10) er.body = 'Tell us a bit more (10+ characters).'
    if (!f.name.trim()) er.name = 'Add your name.'
    setErr(er)
    if (Object.keys(er).length) return
    addReview(p.id, { id: 'me-' + Date.now(), ...f, city: 'You', verified: false, size: '—', date: 'Just now' })
    setF({ stars: 0, title: '', body: '', name: '' }); setForm(false)
    notify('Thanks — your review is live')
  }

  return (
    <section id="reviews" className="prv wrap">
      <div className="prv__side">
        <p className="mono">{'{ Reviews }'}</p>
        <div className="prv__score"><span className="rvs__big">{avg.toFixed(1)}</span><div><Stars value={avg} size={20} /><p className="muted small">{list.length} reviews on this page · {p.reviews} total</p></div></div>
        <ul className="bars">
          {dist.map((n, i) => (
            <li key={i}><span>{5 - i}★</span><span className="bar"><span style={{ width: `${(n / list.length) * 100}%` }} /></span><span className="muted">{n}</span></li>
          ))}
        </ul>
        <button className="btn btn--ink btn--block" onClick={() => setForm((x) => !x)}>{form ? 'Cancel' : 'Write a review'}</button>
        {form && (
          <form className="rform" onSubmit={submit} noValidate>
            <div className="rstars" role="radiogroup" aria-label="Your rating">
              {[1, 2, 3, 4, 5].map((s) => <button type="button" key={s} role="radio" aria-checked={f.stars === s} className={s <= f.stars ? 'is-on' : ''} onClick={() => setF({ ...f, stars: s })} aria-label={`${s} stars`}>★</button>)}
            </div>
            <p className="err">{err.stars}</p>
            <label className="field"><span>Title</span><input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} aria-invalid={!!err.title} /><em className="err">{err.title}</em></label>
            <label className="field"><span>Review</span><textarea rows={4} value={f.body} onChange={(e) => setF({ ...f, body: e.target.value })} aria-invalid={!!err.body} /><em className="err">{err.body}</em></label>
            <label className="field"><span>Name</span><input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} aria-invalid={!!err.name} /><em className="err">{err.name}</em></label>
            <button className="btn btn--accent btn--block" type="submit">Post review</button>
          </form>
        )}
      </div>
      <div className="prv__list">
        <div className="prv__bar">
          <h2 className="h3">What people say</h2>
          <label className="sel"><span className="sr">Sort reviews</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}><option value="recent">Most recent</option><option value="high">Highest rated</option><option value="low">Lowest rated</option></select>
          </label>
        </div>
        {shown.map((r) => (
          <article key={r.id} className="rev">
            <div className="rev__top"><Stars value={r.stars} /><span className="muted small">{r.date}</span></div>
            <h3>{r.title}</h3>
            <p>{r.body}</p>
            <div className="rev__meta">
              <span><b>{r.name}</b> · {r.city}{r.verified && <span className="vbadge"><Icon name="check" />Verified buyer</span>}</span>
              <span className="muted small">Size bought: {r.size}</span>
            </div>
            <button className={`helpful ${helpful[r.id] ? 'is-on' : ''}`} onClick={() => setHelpful((h) => ({ ...h, [r.id]: !h[r.id] }))}>
              Helpful · {(r.id.length * 3) % 17 + (helpful[r.id] ? 1 : 0)}
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

export default function Product() {
  const { id } = useParams()
  const [sp] = useSearchParams()
  const p = byId[id]
  const { add, notify, wish, toggleWish, setDrawer } = useStore()
  const [color, setColor] = useState(() => Math.max(0, Math.min(Number.parseInt(sp.get('c') || '0', 10) || 0, (p?.colors.length || 1) - 1)))
  const [size, setSize] = useState(p?.sizes.length === 1 ? p.sizes[0] : null)
  const [qty, setQty] = useState(1)
  const [needSize, setNeedSize] = useState(false)
  const [guide, setGuide] = useState(false)
  const [pin, setPin] = useState('')
  const [pinMsg, setPinMsg] = useState('')
  const [sticky, setSticky] = useState(false)
  const buyRef = useRef(null)
  const root = useRef(null)

  useEffect(() => {
    if (!p) return
    document.title = `${p.name} — HALDR`
    setSize(p.sizes.length === 1 ? p.sizes[0] : null); setQty(1)
  }, [id])
  // follow ?c= too, e.g. opening the same product in another colour from the bag
  const cParam = sp.get('c')
  useEffect(() => {
    if (!p) return
    const n = Number.parseInt(cParam || '0', 10)
    setColor(Number.isFinite(n) ? Math.max(0, Math.min(n, p.colors.length - 1)) : 0)
  }, [id, cParam])
  useLayoutEffect(() => {
    if (!p || reduceMotion) return
    const ctx = gsap.context(() => {
      gsap.from('.pinfo > *', { y: 30, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.05, delay: 0.35 })
    }, root)
    return () => ctx.revert()
  }, [id])
  useEffect(() => {
    const el = buyRef.current; if (!el) return
    const io = new IntersectionObserver((e) => setSticky(!e[e.length - 1].isIntersecting && e[e.length - 1].boundingClientRect.top < 0))
    io.observe(el); return () => io.disconnect()
  }, [id])

  if (!p) return <div className="wrap empty" style={{ paddingTop: 160 }}><p className="h3">Product not found.</p><TLink to="/shop" className="btn btn--ink">Back to shop</TLink></div>

  const c = p.colors[color]
  const liked = wish.includes(p.id)
  const related = PRODUCTS.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 4)
  const fill = related.length < 4 ? PRODUCTS.filter((x) => x.cat !== p.cat && x.badge === 'Bestseller').slice(0, 4 - related.length) : []

  const flyToBag = () => {
    const src = document.querySelector('.gal__frame img, .gal__slide img')
    const bag = document.querySelector('.nav .ibtn[aria-label^="Bag"]')
    if (!src || !bag || reduceMotion) return
    const a = src.getBoundingClientRect(), b = bag.getBoundingClientRect()
    const ghost = src.cloneNode(); ghost.className = 'fly'
    Object.assign(ghost.style, { left: a.left + 'px', top: a.top + 'px', width: a.width + 'px', height: a.height + 'px' })
    document.body.appendChild(ghost)
    gsap.to(ghost, { left: b.left + b.width / 2 - 20, top: b.top + b.height / 2 - 20, width: 40, height: 40, borderRadius: 40, opacity: 0.4, duration: 0.9, ease: 'power3.in', onComplete: () => ghost.remove() })
  }
  const addToBag = () => {
    if (!size) { setNeedSize(true); gsap.fromTo('.sizes', { x: -8 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' }); return }
    flyToBag()
    add(p.id, color, size, qty)
    notify(`Added ${qty} × ${p.name} · ${c.name} · ${size}`)
    setTimeout(() => setDrawer(true), 850)
  }
  const checkPin = (e) => {
    e.preventDefault()
    if (!/^[1-9]\d{5}$/.test(pin)) { setPinMsg('Enter a valid 6-digit PIN code.'); return }
    const d = new Date(); d.setDate(d.getDate() + (pin[0] <= '4' ? 3 : 5))
    setPinMsg(`Delivers by ${d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} · COD available`)
  }

  return (
    <div ref={root} className="pdp">
      <div className="wrap pdp__grid">
        <Gallery p={p} color={color} />
        <div className="pinfo">
          <p className="crumbs mono"><TLink to="/shop">Shop</TLink> / <TLink to={`/shop/${p.cat}`}>{catName(p.cat)}</TLink></p>
          {p.badge && <span className={`badge badge--inline badge--${p.badge.toLowerCase()}`}>{p.badge === '3D' ? 'View in 3D' : p.badge}</span>}
          <h1 className="pinfo__name">{p.name}</h1>
          <a href="#reviews" className="pinfo__rating" onClick={(e) => { e.preventDefault(); scrollToEl('#reviews', -90) }}>
            <Stars value={p.rating} /> <span>{p.rating.toFixed(1)}</span> <span className="muted">({p.reviews} reviews)</span>
          </a>
          <Price p={p} big />
          <p className="muted small">Inclusive of all taxes</p>
          <p className="pinfo__blurb">{p.blurb}</p>

          <div className="pgroup">
            <p className="mono">Colour · <b>{c.name}</b></p>
            <Swatches colors={p.colors} value={color} onChange={setColor} size="lg" />
          </div>
          <div className="pgroup">
            <div className="pgroup__row"><p className="mono">Size {size && <>· <b>{size}</b></>}</p>{p.sizes.length > 1 && <button className="ulink small" onClick={() => setGuide(true)}>Size guide</button>}</div>
            <div className="sizes">
              {p.sizes.map((s, i) => (
                <button key={s} className={`size ${size === s ? 'is-on' : ''} ${i === p.sizes.length - 1 && p.sizes.length > 1 ? 'is-low' : ''}`} aria-pressed={size === s} onClick={() => { setSize(s); setNeedSize(false) }}>
                  {s}{i === p.sizes.length - 1 && p.sizes.length > 1 && <em>2 left</em>}
                </button>
              ))}
            </div>
            <p className="err" role="alert">{needSize ? 'Pick a size to continue.' : ''}</p>
          </div>

          <div ref={buyRef} className="pbuy">
            <div className="qty qty--lg" role="group" aria-label="Quantity">
              <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease"><Icon name="minus" /></button>
              <span>{qty}</span>
              <button onClick={() => setQty(Math.min(9, qty + 1))} aria-label="Increase"><Icon name="plus" /></button>
            </div>
            <button className="btn btn--ink btn--grow" onClick={addToBag}>Add to bag · {inr(p.price * qty)} <Arrow /></button>
            <button className={`ibtn ibtn--box ${liked ? 'is-on' : ''}`} aria-pressed={liked} aria-label="Wishlist" onClick={() => { toggleWish(p.id); notify(liked ? 'Removed from wishlist' : 'Saved to wishlist') }}><Icon name="heart" /></button>
          </div>

          <form className="pin" onSubmit={checkPin}>
            <Icon name="pin" />
            <input inputMode="numeric" maxLength={6} placeholder="Enter PIN code" value={pin} onChange={(e) => { setPin(e.target.value.replace(/\D/g, '')); setPinMsg('') }} aria-label="PIN code" />
            <button className="ulink" type="submit">Check</button>
          </form>
          {pinMsg && <p className={`small ${pinMsg.startsWith('Deliver') ? 'ok' : 'err'}`}>{pinMsg}</p>}

          <ul className="pperks">
            <li><Icon name="truck" />Free shipping over ₹2,999</li>
            <li><Icon name="return" />30-day free returns</li>
            <li><Icon name="lock" />Secure payment · UPI, cards, COD</li>
          </ul>

          <Accordion items={[
            ['Details', <ul className="dlist">{p.details.map((d) => <li key={d}>{d}</li>)}</ul>],
            ['Material & care', <p>Machine wash cold, inside out. Line dry in the shade. Do not tumble dry or iron prints. Leather and packs: wipe clean with a damp cloth.</p>],
            ['Shipping & returns', <p>Dispatched in 24 hours from Mumbai. Free shipping over ₹2,999, otherwise ₹99. Return or exchange within 30 days — we pick up from your door.</p>],
          ]} />
        </div>
      </div>

      <Reviews p={p} />

      <section className="wrap related">
        <h2 className="giant-title giant-title--sm">YOU MAY ALSO LIKE</h2>
        <div className="grid grid--4">{[...related, ...fill].map((x) => <ProductCard key={x.id} p={x} />)}</div>
      </section>

      <div className={`sticky-buy ${sticky ? 'is-on' : ''}`} aria-hidden={!sticky}>
        <img src={img(c.images[0])} alt="" />
        <div><b>{p.name}</b><span className="muted small">{c.name}{size ? ` · ${size}` : ''}</span></div>
        <button className="btn btn--ink btn--sm" tabIndex={sticky ? 0 : -1} onClick={() => (size ? addToBag() : scrollToEl('.sizes', -140))}>{size ? `Add · ${inr(p.price * qty)}` : 'Pick size'}</button>
      </div>

      {guide && <SizeGuide shoe={p.cat === 'shoes'} onClose={() => setGuide(false)} />}
    </div>
  )
}
