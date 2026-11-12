import { useState } from 'react'
import { CATEGORIES } from '../data/catalog'
import { TLink } from '../lib/transition'
import { useStore } from '../store'
import { Marquee } from './ui'

export default function Footer() {
  const { notify } = useStore()
  const [email, setEmail] = useState('')
  const [err, setErr] = useState('')
  const [done, setDone] = useState(false)
  const submit = (e) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErr('Enter an email like name@domain.com'); return }
    setDone(true); notify('You’re in — 10% off code sent (demo)')
  }
  return (
    <footer className="foot">
      <Marquee items={['Free shipping over ₹2,999', '30-day returns', 'Cash on delivery', 'Made in India', 'Tested in the Himalaya']} speed={35} className="marquee--dark" />
      <div className="wrap foot__grid">
        <div className="foot__news">
          <h2 className="foot__h">Get 10% off your first order.</h2>
          <p className="muted">New drops, restocks and trek guides. One email a fortnight.</p>
          {done ? <p className="foot__ok">Thanks — check {email} for your code. (Demo: use <b>HALDR10</b>)</p> : (
            <form className="news" onSubmit={submit} noValidate>
              <label className="sr" htmlFor="nl">Email</label>
              <input id="nl" type="email" placeholder="you@email.com" value={email} onChange={(e) => { setEmail(e.target.value); setErr('') }} aria-invalid={!!err} aria-describedby="nl-err" />
              <button className="btn btn--accent" type="submit">Subscribe</button>
              <p id="nl-err" className="err" role="alert">{err}</p>
            </form>
          )}
        </div>
        <nav className="foot__cols" aria-label="Footer">
          <div><p className="mono muted">Shop</p>{CATEGORIES.map((c) => <TLink key={c.id} to={`/shop/${c.id}`} className="ulink">{c.name}</TLink>)}</div>
          <div><p className="mono muted">Help</p><TLink to="/about" className="ulink">Shipping</TLink><TLink to="/about" className="ulink">Returns</TLink><TLink to="/about" className="ulink">Size guide</TLink><TLink to="/cart" className="ulink">Your bag</TLink></div>
          <div><p className="mono muted">HALDR</p><TLink to="/about" className="ulink">Our story</TLink><a className="ulink" href="mailto:hello@haldr.example">hello@haldr.example</a><span>Bandra West, Mumbai</span></div>
        </nav>
      </div>
      <div className="wrap"><p className="foot__word" aria-hidden="true">HALDR</p></div>
      <div className="wrap foot__base mono">
        <span>© 2026 HALDR Apparel & Trail Supply — a demo storefront.</span>
        <span>Photography: Pinterest stand-ins · 3D shoe: Khronos glTF sample (CC-BY 4.0)</span>
      </div>
    </footer>
  )
}
