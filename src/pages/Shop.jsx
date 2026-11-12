import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import gsap from 'gsap'
import { CATEGORIES, PRODUCTS, catName, img, inr } from '../data/catalog'
import { TLink, reduceMotion } from '../lib/transition'
import { useStore } from '../store'
import ProductCard from '../components/ProductCard'
import { Icon, useReveal, Words } from '../components/ui'

const SORTS = [['featured', 'Featured'], ['new', 'New in'], ['low', 'Price: low to high'], ['high', 'Price: high to low'], ['rating', 'Top rated']]
const MAX = 15000

export default function Shop() {
  const { cat } = useParams()
  const [sp, setSp] = useSearchParams()
  const wishMode = sp.get('wish') === '1'
  const { wish } = useStore()
  const [sort, setSort] = useState('featured')
  const [max, setMax] = useState(MAX)
  const [sizes, setSizes] = useState([])
  const [sale, setSale] = useState(false)
  const [cols, setCols] = useState(4)
  const [sheet, setSheet] = useState(false)
  const head = useRef(null)
  const grid = useRef(null)
  useReveal(head, { immediate: true, delay: 0.3 })

  useEffect(() => { setSizes([]); setMax(MAX); setSale(false) }, [cat])
  const title = wishMode ? 'Wishlist' : cat ? catName(cat) : 'All products'
  useEffect(() => { document.title = `${title} — HALDR` }, [title])

  const base = wishMode ? PRODUCTS.filter((p) => wish.includes(p.id)) : cat ? PRODUCTS.filter((p) => p.cat === cat) : PRODUCTS
  const allSizes = useMemo(() => [...new Set(base.flatMap((p) => p.sizes))], [cat, wishMode, wish.length])
  const list = useMemo(() => {
    let l = base.filter((p) => p.price <= max && (!sale || p.compare) && (!sizes.length || p.sizes.some((s) => sizes.includes(s))))
    if (sort === 'low') l = [...l].sort((a, b) => a.price - b.price)
    if (sort === 'high') l = [...l].sort((a, b) => b.price - a.price)
    if (sort === 'rating') l = [...l].sort((a, b) => b.rating - a.rating)
    if (sort === 'new') l = [...l].sort((a, b) => (b.badge === 'New') - (a.badge === 'New'))
    return l
  }, [base, max, sale, sizes, sort])

  useEffect(() => {
    if (reduceMotion || !grid.current) return
    gsap.fromTo(grid.current.querySelectorAll('.card'), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', stagger: 0.035, delay: 0.1 })
  }, [cat, sort, max, sale, sizes.join(), cols, wishMode])

  const toggleSize = (s) => setSizes((x) => (x.includes(s) ? x.filter((y) => y !== s) : [...x, s]))
  const active = sizes.length + (max < MAX) + sale

  // plain JSX, not an inner component: an inner component gets a new identity every
  // render, which remounted the price slider and cut the drag off after one step
  const filters = (
    <div className="filters">
      <div className="fgroup">
        <p className="mono muted">Price · up to {inr(max)}</p>
        <input type="range" min={500} max={MAX} step={500} value={max} onChange={(e) => setMax(+e.target.value)} aria-label="Maximum price" />
      </div>
      <div className="fgroup">
        <p className="mono muted">Size</p>
        <div className="fsizes">{allSizes.map((s) => <button key={s} className={`size ${sizes.includes(s) ? 'is-on' : ''}`} aria-pressed={sizes.includes(s)} onClick={() => toggleSize(s)}>{s}</button>)}</div>
      </div>
      <label className="check"><input type="checkbox" checked={sale} onChange={(e) => setSale(e.target.checked)} /> <span>On sale only</span></label>
      {active > 0 && <button className="ulink small" onClick={() => { setSizes([]); setMax(MAX); setSale(false) }}>Clear filters</button>}
    </div>
  )

  return (
    <div className="shop">
      <section ref={head} className="shop__head wrap">
        <p className="crumbs mono"><TLink to="/">Home</TLink> / <TLink to="/shop">Shop</TLink>{cat && <> / {catName(cat)}</>}</p>
        <h1 className="giant-title"><Words text={title.toUpperCase()} /></h1>
        <div className="chips" role="navigation" aria-label="Categories">
          <TLink to="/shop" className={`chip ${!cat && !wishMode ? 'is-on' : ''}`}>All</TLink>
          {CATEGORIES.map((c) => (
            <TLink key={c.id} to={`/shop/${c.id}`} className={`chip ${cat === c.id ? 'is-on' : ''}`}>
              <img src={img(c.img)} alt="" />{c.name}
            </TLink>
          ))}
        </div>
      </section>

      <div className="wrap shop__bar">
        <button className="btn btn--line btn--sm shop__fbtn" onClick={() => setSheet(true)}>Filters{active ? ` (${active})` : ''}</button>
        <div className="shop__desk-filters">{filters}</div>
        <div className="shop__right">
          <span className="muted">{list.length} items</span>
          <label className="sel"><span className="sr">Sort</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>{SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
          </label>
          <div className="density" role="group" aria-label="Grid density">
            {[2, 3, 4].map((n) => <button key={n} className={cols === n ? 'is-on' : ''} onClick={() => setCols(n)} aria-label={`${n} columns`}>{Array.from({ length: n }).map((_, i) => <i key={i} />)}</button>)}
          </div>
        </div>
      </div>

      <div className="wrap">
        {list.length ? (
          <div ref={grid} className={`grid grid--${cols}`}>{list.map((p, i) => <ProductCard key={p.id} p={p} eager={i < 4} />)}</div>
        ) : (
          <div className="empty">
            <p className="h3">{wishMode ? 'Your wishlist is empty.' : 'Nothing matches those filters.'}</p>
            <p className="muted">{wishMode ? 'Tap the heart on any product to save it here.' : 'Try a higher price or fewer sizes.'}</p>
            <TLink to="/shop" className="btn btn--ink">Shop all products</TLink>
          </div>
        )}
      </div>

      {sheet && (
        <div className="fsheet" role="dialog" aria-modal="true" aria-label="Filters">
          <div className="fsheet__scrim" onClick={() => setSheet(false)} />
          <div className="fsheet__panel" data-lenis-prevent>
            <div className="drawer__head"><h2>Filters</h2><button className="ibtn" onClick={() => setSheet(false)} aria-label="Close"><Icon name="close" /></button></div>
            {filters}
            <button className="btn btn--ink btn--block" onClick={() => setSheet(false)}>Show {list.length} items</button>
          </div>
        </div>
      )}
    </div>
  )
}
