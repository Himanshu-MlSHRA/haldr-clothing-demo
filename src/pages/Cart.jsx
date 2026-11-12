import { useEffect, useState } from 'react'
import { PRODUCTS, inr } from '../data/catalog'
import { TLink, useGo } from '../lib/transition'
import { PROMOS, useStore } from '../store'
import { CartLine, ShipBar } from '../components/CartDrawer'
import ProductCard from '../components/ProductCard'
import { Arrow, Icon } from '../components/ui'

export function PromoBox() {
  const { promo, setPromo, notify } = useStore()
  const [code, setCode] = useState('')
  const [err, setErr] = useState('')
  if (promo) return <p className="promo promo--on"><Icon name="check" /> <b>{promo}</b> applied — {PROMOS[promo] * 100}% off <button className="ulink small" onClick={() => setPromo(null)}>Remove</button></p>
  return (
    <form className="promo" onSubmit={(e) => {
      e.preventDefault()
      const c = code.trim().toUpperCase()
      if (PROMOS[c]) { setPromo(c); notify(`${c} applied`); setErr('') } else setErr('That code isn’t valid. Try HALDR10.')
    }}>
      <input placeholder="Promo code" value={code} onChange={(e) => { setCode(e.target.value); setErr('') }} aria-label="Promo code" aria-invalid={!!err} />
      <button className="btn btn--line btn--sm" type="submit">Apply</button>
      <p className="err small">{err}</p>
    </form>
  )
}

export function shipCost(sub, method) {
  if (method === 'express') return 199
  return sub >= 2999 ? 0 : 99
}

export default function Cart() {
  const { cart, totals } = useStore()
  const go = useGo()
  useEffect(() => { document.title = 'Your bag — HALDR' }, [])
  const net = totals.sub - totals.discount
  const ship = shipCost(net, 'standard')
  const recs = PRODUCTS.filter((p) => p.badge === 'Bestseller' && !cart.some((i) => i.id === p.id)).slice(0, 4)
  return (
    <div className="cartpage wrap">
      <p className="crumbs mono"><TLink to="/">Home</TLink> / Bag</p>
      <h1 className="giant-title giant-title--left">YOUR BAG <span className="muted">({totals.count})</span></h1>
      {cart.length === 0 ? (
        <div className="empty">
          <p className="h3">Nothing in here yet.</p>
          <TLink to="/shop" className="btn btn--ink">Shop all products <Arrow /></TLink>
        </div>
      ) : (
        <div className="cartpage__grid">
          <div>
            <ShipBar />
            <ul className="cartpage__lines">{cart.map((i) => <CartLine key={i.key} item={i} />)}</ul>
          </div>
          <aside className="summary">
            <h2 className="h3">Order summary</h2>
            <PromoBox />
            <div className="sumrow"><span>Subtotal</span><span>{inr(totals.sub)}</span></div>
            {totals.saved > 0 && <div className="sumrow ok"><span>Sale savings</span><span>−{inr(totals.saved)} (included)</span></div>}
            {totals.discount > 0 && <div className="sumrow ok"><span>Promo</span><span>−{inr(totals.discount)}</span></div>}
            <div className="sumrow"><span>Shipping</span><span>{ship ? inr(ship) : 'Free'}</span></div>
            <div className="sumrow sumrow--total"><span>Total</span><span>{inr(net + ship)}</span></div>
            <p className="muted small">Inclusive of GST.</p>
            <button className="btn btn--accent btn--block" onClick={() => go('/checkout')}><Icon name="lock" /> Checkout securely</button>
            <div className="paylogos mono">UPI · VISA · MASTERCARD · RUPAY · COD</div>
          </aside>
        </div>
      )}
      {recs.length > 0 && (
        <section className="related">
          <h2 className="giant-title giant-title--sm">COMPLETE THE KIT</h2>
          <div className="grid grid--4">{recs.map((p) => <ProductCard key={p.id} p={p} />)}</div>
        </section>
      )}
    </div>
  )
}
