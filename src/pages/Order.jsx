import { useEffect, useLayoutEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import gsap from 'gsap'
import { byId, img, inr, PRODUCTS } from '../data/catalog'
import { TLink, reduceMotion } from '../lib/transition'
import ProductCard from '../components/ProductCard'
import { Arrow } from '../components/ui'

export default function Order() {
  const { id } = useParams()
  const root = useRef(null)
  let o = null
  try { o = JSON.parse(localStorage.getItem('haldr.order.' + id)) } catch {}
  useEffect(() => { document.title = `Order ${id} — HALDR` }, [id])
  useLayoutEffect(() => {
    if (reduceMotion || !root.current) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 })
      tl.fromTo('.tick circle', { strokeDashoffset: 160 }, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.out' })
        .fromTo('.tick path', { strokeDashoffset: 40 }, { strokeDashoffset: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')
        .from('.ord__h span', { yPercent: 110, duration: 1, ease: 'expo.out', stagger: 0.06 }, '-=0.3')
        .from('.ord__card, .track li', { y: 30, opacity: 0, duration: 0.8, ease: 'expo.out', stagger: 0.06 }, '-=0.6')
      // confetti in brand colours
      const box = root.current.querySelector('.confetti')
      for (let i = 0; i < 60; i++) {
        const s = document.createElement('i'); box.appendChild(s)
        s.style.background = ['#FF5A1F', '#111', '#D9CDB8', '#7B8463'][i % 4]
        gsap.fromTo(s, { x: 0, y: 0, rotate: 0, opacity: 1 }, { x: gsap.utils.random(-420, 420), y: gsap.utils.random(-320, 120), rotate: gsap.utils.random(-540, 540), opacity: 0, duration: gsap.utils.random(1.4, 2.4), ease: 'power3.out', delay: 0.9 })
      }
    }, root)
    return () => ctx.revert()
  }, [id])

  if (!o) return (
    <div className="wrap empty" style={{ paddingTop: 160 }}>
      <p className="h3">We couldn’t find order {id}.</p>
      <TLink to="/shop" className="btn btn--ink">Continue shopping <Arrow /></TLink>
    </div>
  )
  const steps = [['Confirmed', 'Just now'], ['Packed', 'Within 24 hours'], ['Shipped', 'Tracking by SMS'], ['Delivered', o.eta]]
  return (
    <div ref={root} className="ord wrap">
      <div className="ord__hero">
        <span className="confetti" aria-hidden="true" />
        <svg className="tick" viewBox="0 0 56 56" aria-hidden="true"><circle cx="28" cy="28" r="25" /><path d="m17 29 7 7 15-16" /></svg>
        <p className="mono muted">Order {o.id}</p>
        <h1 className="ord__h">{`Thank you, ${o.name}.`.split(' ').map((w, i) => <span className="w" key={i}><span>{w}</span> </span>)}</h1>
        <p className="lead">Your order is confirmed. A receipt is on its way to {o.email}.</p>
      </div>
      <ol className="track">
        {steps.map(([h, s], i) => <li key={h} className={i === 0 ? 'is-on' : ''}><span className="track__dot" /><b>{h}</b><span className="muted small">{s}</span></li>)}
      </ol>
      <div className="ord__grid">
        <div className="ord__card">
          <h2 className="h3">Items</h2>
          <ul className="minis">
            {o.items.map((i) => { const p = byId[i.id]; const c = p.colors[i.color]; return (
              <li key={i.key}><span className="minis__img"><img src={img(c.images[0])} alt="" /><em>{i.qty}</em></span><span><b>{p.name}</b><span className="muted small">{c.name} · {i.size}</span></span><span>{inr(p.price * i.qty)}</span></li>) })}
          </ul>
          <div className="sumrow"><span>Subtotal</span><span>{inr(o.totals.sub)}</span></div>
          {o.totals.discount > 0 && <div className="sumrow ok"><span>Promo</span><span>−{inr(o.totals.discount)}</span></div>}
          <div className="sumrow"><span>Shipping</span><span>{o.totals.shipping ? inr(o.totals.shipping) : 'Free'}</span></div>
          {o.totals.cod > 0 && <div className="sumrow"><span>COD fee</span><span>{inr(o.totals.cod)}</span></div>}
          <div className="sumrow sumrow--total"><span>Paid</span><span>{inr(o.totals.total)}</span></div>
        </div>
        <div className="ord__card">
          <h2 className="h3">Delivery</h2>
          <p>{o.address}</p>
          <p className="muted small" style={{ marginTop: 8 }}>{o.ship === 'express' ? 'Express' : 'Standard'} · arrives by <b>{o.eta}</b></p>
          <h2 className="h3" style={{ marginTop: 28 }}>Payment</h2>
          <p>{o.pay}</p>
          <TLink to="/shop" className="btn btn--ink btn--block" style={{ marginTop: 28 }}>Continue shopping <Arrow /></TLink>
        </div>
      </div>
      <section className="related">
        <h2 className="giant-title giant-title--sm">FOR NEXT TIME</h2>
        <div className="grid grid--4">{PRODUCTS.filter((p) => p.badge === 'New').slice(0, 4).map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </section>
    </div>
  )
}
