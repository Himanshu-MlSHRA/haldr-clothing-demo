import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { StoreProvider, useStore } from './store'
import { TransitionProvider, reduceMotion } from './lib/transition'
import Nav from './components/Nav'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Product from './pages/Product'
import Cart from './pages/Cart'
import About from './pages/About'
import Order from './pages/Order'

const Checkout = lazy(() => import('./pages/Checkout'))

gsap.registerPlugin(ScrollTrigger)

function Toast() {
  const { toast } = useStore()
  if (!toast) return null
  return <div key={toast.key} className="toast" role="status"><span className="toast__dot" />{toast.text}</div>
}

function Shell() {
  const loc = useLocation()
  const bare = loc.pathname.startsWith('/checkout')
  useEffect(() => { requestAnimationFrame(() => ScrollTrigger.refresh()) }, [loc.pathname])
  return (
    <>
      {!bare && <Nav />}
      <main id="main" key={loc.pathname}>
        <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
          <Routes location={loc}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:cat" element={<Shop />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order/:id" element={<Order />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </main>
      {!bare && <Footer />}
      <CartDrawer />
      <Toast />
    </>
  )
}

export default function App() {
  useEffect(() => {
    if (reduceMotion) return
    const lenis = new Lenis({ duration: 1.1, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
    window.__lenis = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    document.fonts?.ready.then(refresh)
    return () => { window.removeEventListener('load', refresh); gsap.ticker.remove(tick); lenis.destroy(); window.__lenis = null }
  }, [])
  return (
    <StoreProvider>
      <TransitionProvider>
        <Shell />
      </TransitionProvider>
    </StoreProvider>
  )
}
