# HALDR

Storefront for HALDR — clothing, shoes and trek gear.

Live: https://haldr-store.vercel.app

## Features

- Home page with scroll animations, a pinned horizontal editorial and shop-the-kit hotspots
- Interactive 3D shoe viewer with three colourways (react-three-fiber)
- Shop with category, size, price and sale filters, sorting and grid density
- Product pages with gallery, size guide, reviews (you can post your own) and PIN-code delivery check
- Bag drawer, promo codes (`HALDR10`, `TRAIL15`), wishlist — saved in localStorage
- Checkout with card / UPI / cash on delivery and an order confirmation page (demo, no real payments)

## Stack

React 18 · React Router · Vite · Tailwind CSS · GSAP · Lenis · three.js / @react-three/fiber

## Run locally

```bash
npm install
npm run dev
```

`npm run build` outputs to `dist/`. `vercel.json` rewrites routes to `index.html` so deep links like `/shop/jackets` work.

3D shoe model: Khronos glTF sample models (CC-BY 4.0).
