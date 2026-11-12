import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { byId, img, inr, PRODUCTS } from '../data/catalog'
import { useGo, TLink } from '../lib/transition'
import { FREE_SHIP, useStore } from '../store'
import { Icon } from './ui'

export function CartLine({ item, compact }) {
  const { setQty, remove } = useStore()
  const p = byId[item.id]
  const c = p.colors[item.color]
  return (
    <li className={`line ${compact ? 'line--compact' : ''}`}>
      <TLink to={`/product/${p.id}?c=${item.color}`} className="line__img"><img src={img(c.images[0])} alt={p.name} /></TLink>
      <div className="line__body">
        <div className="line__top">
          <TLink to={`/product/${p.id}?c=${item.color}`} className="line__name">{p.name}</TLink>
          <span className="line__price">{inr(p.price * item.qty)}</span>
        </div>
        <p className="line__meta">{c.name} · {item.size}</p>
        <div className="line__bottom">
          <div className="qty" role="group" aria-label="Quantity">
            <button onClick={() => setQty(item.key, item.qty - 1)} aria-label="Decrease"><Icon name="minus" /></button>
            <span aria-live="polite">{item.qty}</span>
            <button onClick={() => setQty(item.key, item.qty + 1)} aria-label="Increase"><Icon name="plus" /></button>
          </div>
          <button className="line__rm" onClick={() => remove(item.key)}>Remove</button>
        </div>
      </div>
    </li>
  )
}

export function ShipBar() {
  const { totals } = useStore()
  const pct = Math.min(100, ((FREE_SHIP - totals.toFree) / FREE_SHIP) * 100)
  return (
    <div className="ship">
      <p>{totals.toFree > 0 ? <>Add <b>{inr(totals.toFree)}</b> more for free shipping</> : <>You’ve unlocked <b>free shipping</b> 🎉</>}</p>
      <span className="ship__bar"><span style={{ width: `${pct}%` }} /></span>
    </div>
  )
}

export default function CartDrawer() {
  const { cart, drawer, setDrawer, totals, add, notify } = useStore()
  const go = useGo()
  const panel = useRef(null)
  const scrim = useRef(null)

  useEffect(() => {
    if (!panel.current) return
    if (drawer) {
      window.__lenis?.stop()
      gsap.set([panel.current, scrim.current], { display: 'block' })
      gsap.fromTo(scrim.current, { opacity: 0 }, { opacity: 1, duration: 0.4 })
      gsap.fromTo(panel.current, { xPercent: 100 }, { xPercent: 0, duration: 0.7, ease: 'expo.out' })
      gsap.fromTo(panel.current.querySelectorAll('.line'), { x: 40, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.05, delay: 0.2, duration: 0.6, ease: 'expo.out' })
      const k = (e) => e.key === 'Escape' && setDrawer(false)
      window.addEventListener('keydown', k)
      return () => window.removeEventListener('keydown', k)
    } else {
      window.__lenis?.start()
      gsap.to(scrim.current, { opacity: 0, duration: 0.3 })
      gsap.to(panel.current, { xPercent: 100, duration: 0.5, ease: 'expo.in', onComplete: () => gsap.set([panel.current, scrim.current], { display: 'none' }) })
    }
  }, [drawer])

  const ids = new Set(cart.map((i) => i.id))
  const upsell = PRODUCTS.filter((p) => p.cat === 'gear' && !ids.has(p.id) && p.price < 1500).slice(0, 2)

  return (
    <>
      <div ref={scrim} className="drawer-scrim" onClick={() => setDrawer(false)} style={{ display: 'none' }} />
      <aside ref={panel} className="drawer" style={{ display: 'none' }} role="dialog" aria-modal="true" aria-label="Shopping bag" data-lenis-prevent>
        <div className="drawer__head">
          <h2>Bag <span className="mono muted">({totals.count})</span></h2>
          <button className="ibtn" onClick={() => setDrawer(false)} aria-label="Close bag"><Icon name="close" /></button>
        </div>
        {cart.length === 0 ? (
          <div className="drawer__empty">
            <p className="drawer__big">Your bag is empty.</p>
            <p className="muted">Start with a bestseller — the Loopback Hoodie or the Ridge 3L Shell.</p>
            <button className="btn btn--ink" onClick={() => { setDrawer(false); go('/shop') }}>Shop all products</button>
          </div>
        ) : (
          <>
            <ShipBar />
            <ul className="drawer__lines">{cart.map((i) => <CartLine key={i.key} item={i} compact />)}</ul>
            {upsell.length > 0 && (
              <div className="upsell">
                <p className="mono muted">Add to your kit</p>
                {upsell.map((p) => (
                  <div key={p.id} className="upsell__row">
                    <img src={img(p.colors[0].images[0])} alt="" />
                    <span>{p.name}<br /><b>{inr(p.price)}</b></span>
                    <button className="btn btn--line btn--sm" onClick={() => { add(p.id, 0, p.sizes[0]); notify(`Added ${p.name}`) }}>Add</button>
                  </div>
                ))}
              </div>
            )}
            <div className="drawer__foot">
              <div className="sumrow"><span>Subtotal</span><b>{inr(totals.sub - totals.discount)}</b></div>
              <p className="muted small">Taxes included. Shipping calculated at checkout.</p>
              <button className="btn btn--accent btn--block" onClick={() => { setDrawer(false); go('/checkout') }}>
                <Icon name="lock" /> Checkout · {inr(totals.sub - totals.discount)}
              </button>
              <button className="btn btn--line btn--block" onClick={() => { setDrawer(false); go('/cart') }}>View bag</button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
