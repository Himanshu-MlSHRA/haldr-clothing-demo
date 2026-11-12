import { useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { img } from '../data/catalog'
import { TLink, reduceMotion } from '../lib/transition'
import { Arrow, useReveal, Words } from '../components/ui'

const STEPS = [
  ['01', 'Designed in Mumbai', 'Every piece starts as a problem we had on a trip — a hood that blew back, a pack strap that rubbed.', 'rack-black'],
  ['02', 'Made in Tiruppur', 'Our tees and fleece are knitted, dyed and sewn by two family-run units we visit every season.', 'hang-tee1'],
  ['03', 'Tested in the hills', 'Samples go up to Hampta Pass, Kedarkantha and the Ghats before anything is approved.', 'tr-3'],
  ['04', 'Shipped in 24 hours', 'Orders leave our Mumbai warehouse the next working day, in recycled paper mailers.', 'gear-flat4'],
]

export default function About() {
  const root = useRef(null)
  const head = useRef(null)
  useReveal(head, { immediate: true, delay: 0.3 })
  useEffect(() => { document.title = 'About — HALDR' }, [])
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.ab__img').forEach((el) => {
        gsap.fromTo(el, { clipPath: 'inset(20% 20% 20% 20% round 24px)' }, { clipPath: 'inset(0% 0% 0% 0% round 16px)', ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 35%', scrub: 0.6 } })
        gsap.fromTo(el.querySelector('img'), { scale: 1.3 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 } })
      })
      if (!reduceMotion) gsap.from('.ab__step', { y: 60, opacity: 0, stagger: 0.12, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.ab__steps', start: 'top 75%' } })
    }, root)
    return () => ctx.revert()
  }, [])
  return (
    <div ref={root} className="ab">
      <section ref={head} className="wrap ab__head">
        <p className="mono">{'{ About }'}</p>
        <h1 className="giant-title giant-title--left"><Words text="CLOTHES FOR THE WAY UP." /></h1>
        <p className="lead ab__lead">HALDR started in 2021 with one heavy tee and a rain shell. We make clothing, shoes and trek gear that work in a Mumbai monsoon and on a Himalayan pass — and look plain enough for both.</p>
      </section>
      <section className="wrap ab__duo">
        <figure className="ab__img"><img src={img('ed-1')} alt="" loading="lazy" /></figure>
        <figure className="ab__img"><img src={img('tr-6')} alt="" loading="lazy" /></figure>
      </section>
      <section className="wrap ab__steps">
        {STEPS.map(([n, h, p, im]) => (
          <article key={n} className="ab__step">
            <span className="mono">{n}</span>
            <figure className="ab__img ab__img--sm"><img src={img(im)} alt="" loading="lazy" /></figure>
            <h2 className="h3">{h}</h2>
            <p className="muted">{p}</p>
          </article>
        ))}
      </section>
      <section className="wrap ab__stats">
        {[['30', 'pieces in the FIELD/26 drop'], ['12,400', 'customer reviews, 4.8 average'], ['24 h', 'from order to dispatch'], ['30 days', 'free returns, picked up']].map(([a, b]) => (
          <div key={b}><b>{a}</b><span className="muted">{b}</span></div>
        ))}
      </section>
      <section className="wrap ab__cta">
        <h2 className="giant-title"><Words text="READY WHEN YOU ARE." /></h2>
        <TLink to="/shop" className="btn btn--grad btn--xl">Shop the drop <Arrow /></TLink>
      </section>
    </div>
  )
}
