import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { byId, img, inr } from '../data/catalog'
import { TLink, useGo, reduceMotion } from '../lib/transition'
import { useStore } from '../store'
import { PromoBox, shipCost } from './Cart'
import { Arrow, Icon } from '../components/ui'

const STATES = ['Andhra Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu & Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Madhya Pradesh', 'Maharashtra', 'Meghalaya', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal']

const luhn = (n) => { let s = 0, alt = false; for (let i = n.length - 1; i >= 0; i--) { let d = +n[i]; if (alt) { d *= 2; if (d > 9) d -= 9 } s += d; alt = !alt } return s % 10 === 0 }
const brandOf = (n) => /^4/.test(n) ? 'VISA' : /^(5[1-5]|2[2-7])/.test(n) ? 'MASTERCARD' : /^3[47]/.test(n) ? 'AMEX' : /^(60|65|81|82|508)/.test(n) ? 'RUPAY' : ''

function CardPreview({ num, name, exp, flip, brand }) {
  const groups = (num.padEnd(16, '•').match(/.{1,4}/g) || []).join(' ')
  return (
    <div className={`ccard ${flip ? 'is-flip' : ''}`} aria-hidden="true">
      <div className="ccard__in">
        <div className="ccard__face ccard__front">
          <div className="ccard__top"><span className="ccard__chip" /><span className="ccard__brand">{brand || 'CARD'}</span></div>
          <p className="ccard__num">{groups}</p>
          <div className="ccard__bot"><span><em>Card holder</em>{name || 'YOUR NAME'}</span><span><em>Expires</em>{exp || 'MM/YY'}</span></div>
        </div>
        <div className="ccard__face ccard__back"><span className="ccard__strip" /><span className="ccard__cvv">CVV •••</span><span className="ccard__brand">{brand}</span></div>
      </div>
    </div>
  )
}

function FakeQR({ seed }) {
  const cells = useMemo(() => {
    let s = 0; for (const c of seed) s = (s * 31 + c.charCodeAt(0)) >>> 0
    const r = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296)
    return Array.from({ length: 21 * 21 }, (_, i) => { const x = i % 21, y = Math.floor(i / 21); const f = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13); return f ? ((x % 6 === 0 || y % 6 === 0 || (x > 13 && (x - 14) % 6 === 0) || (y > 13 && (y - 14) % 6 === 0)) || ((x % 7 > 1 && x % 7 < 5) && (y % 7 > 1 && y % 7 < 5))) : r() > 0.52 })
  }, [seed])
  return <svg className="qr" viewBox="0 0 21 21" aria-label="UPI QR code (demo)">{cells.map((on, i) => on && <rect key={i} x={i % 21} y={Math.floor(i / 21)} width="1" height="1" />)}</svg>
}

export default function Checkout() {
  const { cart, totals, clear } = useStore()
  const go = useGo()
  const [f, setF] = useState({ email: '', phone: '', first: '', last: '', addr: '', addr2: '', city: '', state: 'Maharashtra', pin: '' })
  const [ship, setShip] = useState('standard')
  const [pay, setPay] = useState('card')
  const [card, setCard] = useState({ num: '', name: '', exp: '', cvv: '' })
  const [flip, setFlip] = useState(false)
  const [upi, setUpi] = useState('')
  const [err, setErr] = useState({})
  const [stage, setStage] = useState(null) // processing text
  const overlay = useRef(null)
  useEffect(() => { document.title = 'Checkout — HALDR' }, [])

  const net = totals.sub - totals.discount
  const shipping = shipCost(net, ship)
  const cod = pay === 'cod' ? 49 : 0
  const total = net + shipping + cod
  const brand = brandOf(card.num)
  const set = (k) => (e) => { setF({ ...f, [k]: e.target.value }); setErr((x) => ({ ...x, [k]: '' })) }

  if (!cart.length && !stage) return (
    <div className="wrap empty" style={{ paddingTop: 160 }}>
      <p className="h3">Your bag is empty.</p>
      <TLink to="/shop" className="btn btn--ink">Shop all products <Arrow /></TLink>
    </div>
  )

  const validate = () => {
    const e = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Enter a valid email.'
    if (!/^[6-9]\d{9}$/.test(f.phone)) e.phone = 'Enter a 10-digit mobile number.'
    if (!f.first.trim()) e.first = 'Required.'
    if (!f.last.trim()) e.last = 'Required.'
    if (f.addr.trim().length < 5) e.addr = 'Enter your street address.'
    if (!f.city.trim()) e.city = 'Required.'
    if (!/^[1-9]\d{5}$/.test(f.pin)) e.pin = '6-digit PIN code.'
    if (pay === 'card') {
      if (card.num.length < 15 || !luhn(card.num)) e.num = 'Card number isn’t valid. Demo: 4242 4242 4242 4242'
      if (!card.name.trim()) e.cname = 'Name on card.'
      const [m, y] = card.exp.split('/').map(Number)
      const now = new Date(); const yy = now.getFullYear() % 100
      if (!m || m > 12 || !y || y < yy || (y === yy && m < now.getMonth() + 1)) e.exp = 'Check the expiry.'
      if (!/^\d{3,4}$/.test(card.cvv)) e.cvv = '3 or 4 digits.'
    }
    if (pay === 'upi' && !/^[\w.-]{2,}@[a-z]{2,}$/i.test(upi)) e.upi = 'Enter a UPI ID like name@okhdfc.'
    setErr(e)
    if (Object.keys(e).length) {
      const first = document.querySelector('.co [aria-invalid="true"]')
      if (first && window.__lenis) { window.__lenis.scrollTo(first, { offset: -140 }); first.focus({ preventScroll: true }) }
      else first?.focus()
      return false
    }
    return true
  }

  const place = (e) => {
    e.preventDefault()
    if (!validate()) return
    const id = 'HD' + Math.floor(100000 + Math.random() * 899999)
    const eta = new Date(); eta.setDate(eta.getDate() + (ship === 'express' ? 2 : 5))
    const order = {
      id, items: cart, totals: { sub: totals.sub, discount: totals.discount, shipping, cod, total },
      name: f.first, email: f.email, address: `${f.addr}${f.addr2 ? ', ' + f.addr2 : ''}, ${f.city}, ${f.state} ${f.pin}`,
      pay: pay === 'card' ? `${brand || 'Card'} •••• ${card.num.slice(-4)}` : pay === 'upi' ? `UPI · ${upi}` : 'Cash on delivery',
      ship, eta: eta.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }), at: Date.now(),
    }
    const steps = pay === 'cod' ? ['Confirming your order…', 'Reserving stock…', 'Done'] : ['Contacting your bank…', 'Authorising ' + inr(total) + '…', 'Payment approved']
    setStage(steps[0])
    requestAnimationFrame(() => overlay.current && gsap.fromTo(overlay.current, { opacity: 0 }, { opacity: 1, duration: 0.3 }))
    setTimeout(() => setStage(steps[1]), 900)
    setTimeout(() => setStage(steps[2]), 1900)
    setTimeout(() => {
      try { localStorage.setItem('haldr.order.' + id, JSON.stringify(order)) } catch {}
      clear()
      go(`/order/${id}`)
      setTimeout(() => setStage(null), 800)
    }, 2600)
  }

  const F = ({ k, label, half, ...rest }) => (
    <label className={`field ${half ? 'field--half' : ''}`}>
      <span>{label}</span>
      <input value={f[k]} onChange={set(k)} aria-invalid={!!err[k]} {...rest} />
      <em className="err">{err[k]}</em>
    </label>
  )

  return (
    <div className="co wrap">
      <div className="co__head">
        <TLink to="/" className="logo"><span className="logo__mark" aria-hidden="true"><i /><i /><i /><i /></span>HALDR</TLink>
        <ol className="co__steps mono"><li className="is-done">Bag</li><li className="is-on">Details & payment</li><li>Confirmation</li></ol>
        <span className="mono muted small"><Icon name="lock" /> Secure checkout</span>
      </div>

      <form className="co__grid" onSubmit={place} noValidate>
        <div className="co__form">
          <section className="co__sec">
            <h2 className="co__h"><span>1</span>Contact</h2>
            <div className="fields">
              {F({ k: 'email', label: 'Email', type: 'email', autoComplete: 'email', half: true })}
              {F({ k: 'phone', label: 'Mobile (+91)', inputMode: 'numeric', maxLength: 10, autoComplete: 'tel-national', half: true })}
            </div>
          </section>

          <section className="co__sec">
            <h2 className="co__h"><span>2</span>Delivery address</h2>
            <div className="fields">
              {F({ k: 'first', label: 'First name', autoComplete: 'given-name', half: true })}
              {F({ k: 'last', label: 'Last name', autoComplete: 'family-name', half: true })}
              {F({ k: 'addr', label: 'Flat, house no., street', autoComplete: 'address-line1' })}
              {F({ k: 'addr2', label: 'Area, landmark (optional)', autoComplete: 'address-line2' })}
              {F({ k: 'city', label: 'City', autoComplete: 'address-level2', half: true })}
              <label className="field field--half"><span>State</span>
                <select value={f.state} onChange={set('state')}>{STATES.map((s) => <option key={s}>{s}</option>)}</select>
              </label>
              {F({ k: 'pin', label: 'PIN code', inputMode: 'numeric', maxLength: 6, autoComplete: 'postal-code', half: true })}
            </div>
          </section>

          <section className="co__sec">
            <h2 className="co__h"><span>3</span>Shipping</h2>
            <div className="opts">
              <label className={`opt ${ship === 'standard' ? 'is-on' : ''}`}><input type="radio" name="ship" checked={ship === 'standard'} onChange={() => setShip('standard')} />
                <span><b>Standard</b><em>4–6 working days</em></span><b>{shipCost(net, 'standard') ? inr(99) : 'Free'}</b></label>
              <label className={`opt ${ship === 'express' ? 'is-on' : ''}`}><input type="radio" name="ship" checked={ship === 'express'} onChange={() => setShip('express')} />
                <span><b>Express</b><em>1–2 working days, metros</em></span><b>{inr(199)}</b></label>
            </div>
          </section>

          <section className="co__sec">
            <h2 className="co__h"><span>4</span>Payment</h2>
            <div className="paytabs" role="tablist">
              {[['card', 'Card'], ['upi', 'UPI'], ['cod', 'Cash on delivery']].map(([k, l]) => (
                <button type="button" key={k} role="tab" aria-selected={pay === k} className={`paytab ${pay === k ? 'is-on' : ''}`} onClick={() => setPay(k)}>{l}</button>
              ))}
            </div>
            {pay === 'card' && (
              <div className="paycard">
                <CardPreview num={card.num} name={card.name.toUpperCase()} exp={card.exp} flip={flip} brand={brand} />
                <div className="fields">
                  <label className="field"><span>Card number</span>
                    <input inputMode="numeric" autoComplete="cc-number" value={card.num.replace(/(\d{4})(?=\d)/g, '$1 ')} aria-invalid={!!err.num}
                      onChange={(e) => { setCard({ ...card, num: e.target.value.replace(/\D/g, '').slice(0, 16) }); setErr({ ...err, num: '' }) }} placeholder="4242 4242 4242 4242" />
                    <em className="err">{err.num}</em></label>
                  <label className="field"><span>Name on card</span>
                    <input autoComplete="cc-name" value={card.name} aria-invalid={!!err.cname} onChange={(e) => { setCard({ ...card, name: e.target.value }); setErr({ ...err, cname: '' }) }} />
                    <em className="err">{err.cname}</em></label>
                  <label className="field field--half"><span>Expiry (MM/YY)</span>
                    <input inputMode="numeric" autoComplete="cc-exp" placeholder="08/29" value={card.exp} aria-invalid={!!err.exp}
                      onChange={(e) => { let v = e.target.value.replace(/\D/g, '').slice(0, 4); if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2); setCard({ ...card, exp: v }); setErr({ ...err, exp: '' }) }} />
                    <em className="err">{err.exp}</em></label>
                  <label className="field field--half"><span>CVV</span>
                    <input inputMode="numeric" autoComplete="cc-csc" type="password" maxLength={4} value={card.cvv} aria-invalid={!!err.cvv}
                      onFocus={() => setFlip(true)} onBlur={() => setFlip(false)} onChange={(e) => { setCard({ ...card, cvv: e.target.value.replace(/\D/g, '') }); setErr({ ...err, cvv: '' }) }} />
                    <em className="err">{err.cvv}</em></label>
                </div>
              </div>
            )}
            {pay === 'upi' && (
              <div className="payupi">
                <FakeQR seed={upi || 'haldr'} />
                <div>
                  <p>Scan with any UPI app, or enter your UPI ID and approve the request on your phone.</p>
                  <label className="field"><span>UPI ID</span>
                    <input value={upi} placeholder="name@okhdfc" aria-invalid={!!err.upi} onChange={(e) => { setUpi(e.target.value); setErr({ ...err, upi: '' }) }} />
                    <em className="err">{err.upi}</em></label>
                  <p className="mono muted small">GPay · PhonePe · Paytm · BHIM</p>
                </div>
              </div>
            )}
            {pay === 'cod' && <p className="paycod">Pay in cash or UPI when your order arrives. A ₹49 handling fee applies.</p>}
            <p className="demo-note"><Icon name="lock" /> Demo checkout — no real payment is taken. Test card: 4242 4242 4242 4242, any future date.</p>
          </section>

          <button className="btn btn--accent btn--block btn--xl co__pay" type="submit">
            {pay === 'cod' ? 'Place order' : 'Pay'} · {inr(total)} <Arrow />
          </button>
        </div>

        <aside className="summary summary--sticky">
          <h2 className="h3">Order · {totals.count} items</h2>
          <ul className="minis">
            {cart.map((i) => { const p = byId[i.id]; const c = p.colors[i.color]; return (
              <li key={i.key}><span className="minis__img"><img src={img(c.images[0])} alt="" /><em>{i.qty}</em></span>
                <span><b>{p.name}</b><span className="muted small">{c.name} · {i.size}</span></span><span>{inr(p.price * i.qty)}</span></li>) })}
          </ul>
          <PromoBox />
          <div className="sumrow"><span>Subtotal</span><span>{inr(totals.sub)}</span></div>
          {totals.discount > 0 && <div className="sumrow ok"><span>Promo</span><span>−{inr(totals.discount)}</span></div>}
          <div className="sumrow"><span>Shipping</span><span>{shipping ? inr(shipping) : 'Free'}</span></div>
          {cod > 0 && <div className="sumrow"><span>COD fee</span><span>{inr(cod)}</span></div>}
          <div className="sumrow sumrow--total"><span>Total</span><span>{inr(total)}</span></div>
          <p className="muted small">Inclusive of GST.</p>
        </aside>
      </form>

      {stage && (
        <div ref={overlay} className="paying" role="status" aria-live="assertive">
          <div className="paying__box">
            <span className={`paying__ring ${stage.includes('approved') || stage === 'Done' ? 'is-done' : ''}`}><Icon name="check" /></span>
            <p>{stage}</p>
          </div>
        </div>
      )}
    </div>
  )
}
