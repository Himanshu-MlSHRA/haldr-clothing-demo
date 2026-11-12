import { useState } from 'react'
import { img, catName } from '../data/catalog'
import { TLink } from '../lib/transition'
import { useStore } from '../store'
import { Icon, Price, Stars, Swatches } from './ui'

export default function ProductCard({ p, eager = false }) {
  const { add, notify, wish, toggleWish, setDrawer } = useStore()
  const [color, setColor] = useState(0)
  const [quick, setQuick] = useState(false)
  const c = p.colors[color]
  const a = c.images[0]
  const b = c.images[1] || p.colors[(color + 1) % p.colors.length].images[0]
  const two = b && b !== a
  const liked = wish.includes(p.id)

  const quickAdd = (size) => {
    add(p.id, color, size)
    notify(`Added ${p.name} · ${c.name} · ${size}`)
    setQuick(false)
    setDrawer(true)
  }

  return (
    <article className={`card ${quick ? 'is-quick' : ''}`} onMouseLeave={() => setQuick(false)}>
      <div className="card__mwrap">
      <TLink to={`/product/${p.id}?c=${color}`} className="card__media" aria-label={`${p.name}, ${c.name}`}>
        <img className="card__img card__img--a" src={img(a)} alt={`${p.name} in ${c.name}`} loading={eager ? 'eager' : 'lazy'} decoding="async" />
        {two && <img className="card__img card__img--b" src={img(b)} alt="" loading="lazy" decoding="async" />}
        {p.badge && <span className={`badge badge--${p.badge.toLowerCase()}`}>{p.badge === '3D' ? '3D view' : p.badge}</span>}
      </TLink>
      <button className={`card__heart ${liked ? 'is-on' : ''}`} aria-pressed={liked} aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
        onClick={() => { toggleWish(p.id); notify(liked ? 'Removed from wishlist' : `Saved ${p.name} to wishlist`) }}>
        <Icon name="heart" />
      </button>
      <div className="card__quick">
        {!quick ? (
          <button className="card__qbtn" onClick={() => (p.sizes.length === 1 ? quickAdd(p.sizes[0]) : setQuick(true))}>
            <Icon name="plus" /> <span>Quick add</span>
          </button>
        ) : (
          <div className="card__sizes" role="group" aria-label="Pick a size">
            {p.sizes.map((s) => <button key={s} onClick={() => quickAdd(s)}>{s.replace('UK ', '')}</button>)}
          </div>
        )}
      </div>
      </div>
      <div className="card__info">
        <div className="card__row">
          <TLink to={`/product/${p.id}?c=${color}`} className="card__name">{p.name}</TLink>
          <Price p={p} />
        </div>
        <div className="card__row card__row--sub">
          <span className="card__cat">{catName(p.cat)} · <Stars value={p.rating} size={11} /> <span className="muted">({p.reviews})</span></span>
          {p.colors.length > 1 && <Swatches colors={p.colors} value={color} onChange={setColor} size="sm" label={`${p.name} colour`} />}
        </div>
      </div>
    </article>
  )
}
