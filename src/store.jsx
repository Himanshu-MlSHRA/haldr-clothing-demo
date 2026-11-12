import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { byId } from './data/catalog'

const Ctx = createContext(null)
const load = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d } catch { return d } }
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

export const FREE_SHIP = 2999
export const PROMOS = { HALDR10: 0.1, TRAIL15: 0.15 }

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => load('haldr.cart', []).filter((i) => byId[i.id]))
  const [wish, setWish] = useState(() => load('haldr.wish', []))
  const [promo, setPromo] = useState(() => load('haldr.promo', null))
  const [drawer, setDrawer] = useState(false)
  const [toast, setToast] = useState(null)
  const [myReviews, setMyReviews] = useState(() => load('haldr.reviews', {}))
  const t = useRef(0)

  useEffect(() => save('haldr.cart', cart), [cart])
  useEffect(() => save('haldr.wish', wish), [wish])
  useEffect(() => save('haldr.promo', promo), [promo])
  useEffect(() => save('haldr.reviews', myReviews), [myReviews])

  const notify = useCallback((text) => {
    setToast({ text, key: Date.now() })
    clearTimeout(t.current)
    t.current = setTimeout(() => setToast(null), 2600)
  }, [])

  const add = useCallback((id, color, size, qty = 1) => {
    const key = `${id}|${color}|${size}`
    setCart((c) => {
      const f = c.find((i) => i.key === key)
      return f ? c.map((i) => (i.key === key ? { ...i, qty: Math.min(9, i.qty + qty) } : i)) : [...c, { key, id, color, size, qty }]
    })
  }, [])
  const setQty = useCallback((key, qty) => setCart((c) => (qty <= 0 ? c.filter((i) => i.key !== key) : c.map((i) => (i.key === key ? { ...i, qty: Math.min(9, qty) } : i)))), [])
  const remove = useCallback((key) => setCart((c) => c.filter((i) => i.key !== key)), [])
  const clear = useCallback(() => { setCart([]); setPromo(null) }, [])
  const toggleWish = useCallback((id) => setWish((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id])), [])
  const addReview = useCallback((pid, r) => setMyReviews((m) => ({ ...m, [pid]: [r, ...(m[pid] || [])] })), [])

  const totals = useMemo(() => {
    const sub = cart.reduce((s, i) => s + byId[i.id].price * i.qty, 0)
    const saved = cart.reduce((s, i) => s + ((byId[i.id].compare || byId[i.id].price) - byId[i.id].price) * i.qty, 0)
    const discount = promo && PROMOS[promo] ? Math.round(sub * PROMOS[promo]) : 0
    const count = cart.reduce((s, i) => s + i.qty, 0)
    return { sub, saved, discount, count, toFree: Math.max(0, FREE_SHIP - (sub - discount)) }
  }, [cart, promo])

  const value = useMemo(() => ({
    cart, add, setQty, remove, clear, totals, wish, toggleWish, promo, setPromo,
    drawer, setDrawer, toast, notify, myReviews, addReview,
  }), [cart, add, setQty, remove, clear, totals, wish, toggleWish, promo, drawer, toast, notify, myReviews, addReview])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useStore = () => useContext(Ctx)
