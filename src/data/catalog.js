// HALDR — a fictional apparel & trail-supply brand for a client demo.
// Photography: stand-in images until the real product shoot is done.

export const BRAND = 'HALDR'

export const CATEGORIES = [
  { id: 'tshirts', name: 'T-shirts', blurb: 'Heavy cotton, boxy cuts.', img: 'tee-onmodel' },
  { id: 'shirts', name: 'Shirts', blurb: 'Overshirts and chore shirts.', img: 'shirt-model2' },
  { id: 'hoodies', name: 'Hoodies', blurb: '480 gsm loopback fleece.', img: 'hood-charcoal' },
  { id: 'jackets', name: 'Jackets', blurb: '3-layer shells, field jackets.', img: 'jkt-ed1' },
  { id: 'shoes', name: 'Shoes & Boots', blurb: 'Trail runners to leather hikers.', img: 'boot-ed' },
  { id: 'gear', name: 'Trek Gear', blurb: 'Packs, beanies, the kit.', img: 'gear-flat1' },
]

export const img = (name) => `/img/p/${name}.webp`

const SIZES_TOP = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const SIZES_SHOE = ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11']
const ONE = ['One size']

const p = (o) => ({ rating: 4.7, reviews: 0, compare: null, badge: null, ...o })

export const PRODUCTS = [
  // ---------- T-shirts
  p({ id: 'heavyweight-box-tee', name: 'Heavyweight Box Tee', cat: 'tshirts', price: 1490, compare: 1890, badge: 'Bestseller',
    blurb: 'A 260 gsm cotton tee with a dropped shoulder and a collar that keeps its shape wash after wash.',
    details: ['260 gsm combed cotton jersey', 'Boxy fit, dropped shoulder', 'Ribbed 2.5 cm collar', 'Pre-shrunk, garment washed'],
    sizes: SIZES_TOP, rating: 4.8,
    colors: [
      { name: 'Cream', hex: '#EDE6DA', images: ['tee-cream', 'tee-onmodel'] },
      { name: 'White', hex: '#F7F7F5', images: ['tee-white', 'tee-onmodel2'] },
      { name: 'Sand', hex: '#D9CDB8', images: ['tee-sand'] },
    ] }),
  p({ id: 'oversized-studio-tee', name: 'Oversized Studio Tee', cat: 'tshirts', price: 1290,
    blurb: 'Our widest cut. Sits off the shoulder, falls straight, looks right with wide trousers.',
    details: ['240 gsm cotton', 'Oversized fit — size down for regular', 'Side-seamed body', 'Made in Tiruppur'],
    sizes: SIZES_TOP, rating: 4.6,
    colors: [{ name: 'Optic White', hex: '#FAFAFA', images: ['tee-boxy', 'tee-studio', 'hang-tee1'] }] }),
  p({ id: 'washed-everyday-tee', name: 'Washed Everyday Tee', cat: 'tshirts', price: 990, compare: 1290, badge: 'Sale',
    blurb: 'Enzyme washed for a broken-in hand from day one. The tee you reach for without thinking.',
    details: ['200 gsm cotton', 'Regular fit', 'Enzyme + silicone wash', 'Taped shoulder seams'],
    sizes: SIZES_TOP, rating: 4.5,
    colors: [{ name: 'Chalk', hex: '#EFEEEA', images: ['hang-tee2', 'hang-tee3'] }] }),

  // ---------- Hoodies
  p({ id: 'loopback-hoodie', name: 'Loopback Hoodie', cat: 'hoodies', price: 2990, badge: 'Bestseller',
    blurb: 'Heavy 480 gsm loopback fleece, a double-layer hood and no drawcords to fiddle with.',
    details: ['480 gsm cotton loopback', 'Double-layer hood', 'Kangaroo pocket', 'Ribbed cuffs and hem'],
    sizes: SIZES_TOP, rating: 4.9,
    colors: [
      { name: 'Black', hex: '#141414', images: ['hood-black'] },
      { name: 'Charcoal', hex: '#3C4148', images: ['hood-charcoal'] },
      { name: 'Heather Grey', hex: '#B9BABC', images: ['hood-grey'] },
      { name: 'White', hex: '#F4F4F2', images: ['hood-white'] },
    ] }),
  p({ id: 'camp-hoodie', name: 'Camp Hoodie', cat: 'hoodies', price: 3290, badge: 'New',
    blurb: 'A brushed-back hoodie in off-white, cut a little longer for cold mornings at camp.',
    details: ['420 gsm brushed fleece', 'Relaxed fit', 'Tonal back print', 'Longline hem'],
    sizes: SIZES_TOP, rating: 4.7,
    colors: [{ name: 'Off-white', hex: '#EEEDEA', images: ['hood-hang'] }] }),

  // ---------- Shirts
  p({ id: 'canvas-overshirt', name: 'Canvas Overshirt', cat: 'shirts', price: 3490, badge: 'New',
    blurb: 'A brushed cotton canvas overshirt with two chest pockets. Wear it closed or over a tee.',
    details: ['10 oz brushed cotton canvas', 'Two flap chest pockets', 'Horn-look buttons', 'Relaxed fit'],
    sizes: SIZES_TOP, rating: 4.8,
    colors: [
      { name: 'Cream', hex: '#ECE6D8', images: ['shirt-cream', 'shirt-model2'] },
      { name: 'Olive', hex: '#7B8463', images: ['shirt-olive'] },
      { name: 'Black', hex: '#1A1A1A', images: ['shirt-black'] },
    ] }),
  p({ id: 'chore-shirt', name: 'Chore Shirt', cat: 'shirts', price: 2790,
    blurb: 'Patch pockets, a boxy body and a twill that softens every time it is washed.',
    details: ['Cotton twill', 'Three patch pockets', 'Boxy fit', 'Corozo buttons'],
    sizes: SIZES_TOP, rating: 4.6,
    colors: [
      { name: 'Khaki', hex: '#C9B994', images: ['shirt-khaki', 'shirt-model1'] },
      { name: 'Ecru', hex: '#EAE4D7', images: ['shirt-ecru', 'shirt-model4'] },
    ] }),
  p({ id: 'flannel-shirt', name: 'Wool Flannel Shirt', cat: 'shirts', price: 2490, compare: 3190, badge: 'Sale',
    blurb: 'A brushed wool-blend flannel for the shoulder season — warm enough on its own, thin enough to layer.',
    details: ['60% wool, 40% cotton', 'Brushed both sides', 'Zip front', 'Regular fit'],
    sizes: SIZES_TOP, rating: 4.5,
    colors: [
      { name: 'Brown Check', hex: '#7A5B44', images: ['shirt-plaid'] },
      { name: 'Charcoal', hex: '#3A3B3D', images: ['shirt-charcoal', 'shirt-model3'] },
    ] }),

  // ---------- Jackets
  p({ id: 'ridge-3l-shell', name: 'Ridge 3L Shell', cat: 'jackets', price: 12990, badge: 'Bestseller',
    blurb: 'A three-layer waterproof shell with a helmet-ready hood, pit zips and taped seams throughout.',
    details: ['3-layer 20K/20K membrane', 'Fully taped seams', 'Helmet-compatible hood', 'Pit zips, two hand pockets'],
    sizes: SIZES_TOP, rating: 4.9,
    colors: [
      { name: 'Sand', hex: '#C8B79A', images: ['jkt-sand', 'jkt-ed1'] },
      { name: 'Snow', hex: '#F1F1EF', images: ['jkt-snow', 'jkt-float'] },
      { name: 'Stone', hex: '#CFCDC6', images: ['jkt-stone'] },
    ] }),
  p({ id: 'vapor-lite-jacket', name: 'Vapor Lite Jacket', cat: 'jackets', price: 8990,
    blurb: 'A 290 g packable rain jacket that stuffs into its own pocket. For trail days that might turn.',
    details: ['2.5-layer 10K/10K', '290 g (size M)', 'Packs into chest pocket', 'Reflective trims'],
    sizes: SIZES_TOP, rating: 4.7,
    colors: [
      { name: 'White', hex: '#F4F4F2', images: ['jkt-white', 'hang-jkt1'] },
      { name: 'Fog', hex: '#DADBDD', images: ['jkt-fog'] },
      { name: 'Ice', hex: '#E6E8E8', images: ['jkt-ice', 'jkt-pale'] },
    ] }),
  p({ id: 'summit-two-tone', name: 'Summit Two-Tone Shell', cat: 'jackets', price: 14490, badge: 'New',
    blurb: 'Our expedition shell in two greys, with reinforced shoulders where the pack straps sit.',
    details: ['3-layer, 40D face fabric', 'Reinforced shoulders', 'Water-resistant zips', 'Adjustable hem'],
    sizes: SIZES_TOP, rating: 4.8,
    colors: [{ name: 'Glacier', hex: '#D7D8D6', images: ['jkt-two', 'jkt-ed2'] }] }),
  p({ id: 'field-jacket', name: 'M-65 Field Jacket', cat: 'jackets', price: 6990,
    blurb: 'A four-pocket field jacket in waxed cotton, with a hood that rolls into the collar.',
    details: ['Waxed cotton sateen', 'Four bellows pockets', 'Packaway hood', 'Drawcord waist'],
    sizes: SIZES_TOP, rating: 4.6,
    colors: [{ name: 'Olive', hex: '#5E6447', images: ['hang-jkt2'] }] }),
  p({ id: 'wool-pea-coat', name: 'Wool Pea Coat', cat: 'jackets', price: 9490, compare: 11990, badge: 'Sale',
    blurb: 'A double-breasted coat in a dense wool melton, cut short enough to wear with a pack.',
    details: ['80% wool melton', 'Double-breasted', 'Quilted lining', 'Cropped length'],
    sizes: SIZES_TOP, rating: 4.7,
    colors: [{ name: 'Grey Melange', hex: '#9D9FA1', images: ['hang-jkt3'] }] }),

  // ---------- Shoes
  p({ id: 'trail-runner-01', name: 'Trail Runner 01', cat: 'shoes', price: 7990, badge: '3D',
    blurb: 'Our first trail runner: a breathable upper, a cushioned midsole and a lugged outsole. Spin it in 3D.',
    details: ['Engineered mesh upper', 'EVA midsole, 8 mm drop', '4 mm multi-directional lugs', '290 g (UK 8)'],
    sizes: SIZES_SHOE, rating: 4.8, model3d: true,
    colors: [
      { name: 'Beach', hex: '#A97C82', variant: 'Beach', images: ['3d-beach', '3d-beach-side'] },
      { name: 'Midnight', hex: '#1D5C8C', variant: 'Midnight', images: ['3d-midnight', '3d-midnight-side'] },
      { name: 'Street', hex: '#1A1A1A', variant: 'Street', images: ['3d-street', '3d-street-side'] },
    ] }),
  p({ id: 'court-low', name: 'Court Low', cat: 'shoes', price: 5490, badge: 'Bestseller',
    blurb: 'A clean leather court shoe with a cupsole that softens in the first week.',
    details: ['Full-grain leather', 'Stitched cupsole', 'Cushioned insole', 'Waxed laces'],
    sizes: SIZES_SHOE, rating: 4.7,
    colors: [{ name: 'Triple White', hex: '#F5F5F3', images: ['shoe-court', 'shoe-float'] }] }),
  p({ id: 'gum-trainer', name: 'Gum Sole Trainer', cat: 'shoes', price: 5990,
    blurb: 'White leather on a natural gum sole — the one pair that goes with everything.',
    details: ['Leather upper', 'Natural gum rubber sole', 'Padded collar', 'Removable insole'],
    sizes: SIZES_SHOE, rating: 4.6,
    colors: [{ name: 'White / Gum', hex: '#EDE9E1', images: ['shoe-gum'] }] }),
  p({ id: 'knit-runner', name: 'Knit Daily Runner', cat: 'shoes', price: 4990, compare: 5990, badge: 'Sale',
    blurb: 'A sock-like knit upper on a light foam sole, for days that are mostly walking.',
    details: ['Recycled knit upper', 'Light foam midsole', 'Pull tab', 'Machine washable'],
    sizes: SIZES_SHOE, rating: 4.5,
    colors: [{ name: 'Oat', hex: '#DCD3C3', images: ['shoe-knit'] }] }),
  p({ id: 'mocha-low', name: 'Mocha Low', cat: 'shoes', price: 5290, badge: 'New',
    blurb: 'Cream and mocha leather panels on a flat cupsole. A low with a little colour.',
    details: ['Leather and suede', 'Flat cupsole', 'Perforated toe', 'Cotton laces'],
    sizes: SIZES_SHOE, rating: 4.7,
    colors: [{ name: 'Cream / Mocha', hex: '#6B4A35', images: ['shoe-mocha'] }] }),
  p({ id: 'cloud-chunky', name: 'Cloud Chunky', cat: 'shoes', price: 6490,
    blurb: 'A thick, wavy midsole that adds 4 cm and a lot of comfort to every step.',
    details: ['Leather upper', '40 mm foam midsole', 'Wave sidewall', 'Padded tongue'],
    sizes: SIZES_SHOE, rating: 4.4,
    colors: [{ name: 'Cloud', hex: '#F3F3F1', images: ['shoe-chunky', 'shoe-runner'] }] }),
  p({ id: 'alpine-leather-boot', name: 'Alpine Leather Boot', cat: 'shoes', price: 11990, badge: 'Bestseller',
    blurb: 'A waterproof nubuck hiking boot with a stiff shank and a lugged rubber outsole.',
    details: ['Waterproof nubuck', 'Waterproof membrane', 'Nylon shank', 'Lugged rubber outsole'],
    sizes: SIZES_SHOE, rating: 4.9,
    colors: [
      { name: 'Brown', hex: '#7A5232', images: ['boot-brown', 'boot-ed'] },
      { name: 'Desert', hex: '#8C7155', images: ['boot-desert'] },
    ] }),
  p({ id: 'black-peak-boot', name: 'Black Peak Boot', cat: 'shoes', price: 10990,
    blurb: 'All-black leather, speed hooks and a rand that shrugs off scree.',
    details: ['Full-grain leather', 'Rubber toe rand', 'Speed-lace hooks', 'Gusseted tongue'],
    sizes: SIZES_SHOE, rating: 4.8,
    colors: [{ name: 'Black', hex: '#151515', images: ['boot-black', 'boot-pair', 'boot-dark'] }] }),
  p({ id: 'duo-hiker', name: 'Duo Hiker', cat: 'shoes', price: 9990, badge: 'New',
    blurb: 'A mid-height hiker with a retro profile, in black or bone.',
    details: ['Leather and mesh', 'Mid-height collar', 'Vibram-style outsole', 'Metal eyelets'],
    sizes: SIZES_SHOE, rating: 4.6,
    colors: [{ name: 'Black / Bone', hex: '#E6E1D6', images: ['boot-duo'] }] }),

  // ---------- Trek gear
  p({ id: 'ascent-28', name: 'Ascent 28L Pack', cat: 'gear', price: 6990, badge: 'Bestseller',
    blurb: 'A 28-litre day pack with a ventilated back panel, hip belt and a sleeve for a 2 L bladder.',
    details: ['28 L capacity', 'Ventilated mesh back', 'Hydration sleeve', '1.1 kg'],
    sizes: ONE, rating: 4.8,
    colors: [
      { name: 'Beige', hex: '#D8CBB6', images: ['pack-beige'] },
      { name: 'Olive', hex: '#5C6448', images: ['pack-olive'] },
      { name: 'Cream', hex: '#E9E3D6', images: ['pack-cream'] },
    ] }),
  p({ id: 'ridgeline-45', name: 'Ridgeline 45L Pack', cat: 'gear', price: 9490,
    blurb: 'For multi-day treks: an adjustable torso, a lid pocket and a sleeping-bag compartment.',
    details: ['45 L capacity', 'Adjustable torso', 'Lid + side pockets', 'Rain cover included'],
    sizes: ONE, rating: 4.7,
    colors: [{ name: 'Forest', hex: '#4A5A48', images: ['pack-green'] }] }),
  p({ id: 'rolltop-daypack', name: 'Roll-Top Daypack', cat: 'gear', price: 4990,
    blurb: 'A welded, waterproof roll-top with a padded laptop sleeve. Commutes and day hikes.',
    details: ['22 L, expands to 26 L', 'Welded waterproof body', '16" laptop sleeve', 'Magnetic chest strap'],
    sizes: ONE, rating: 4.6,
    colors: [
      { name: 'Graphite', hex: '#5A5A56', images: ['pack-roll'] },
      { name: 'Slate', hex: '#8E989A', images: ['pack-grey'] },
    ] }),
  p({ id: 'sling-18', name: 'Summit Sling 18L', cat: 'gear', price: 3990, compare: 4790, badge: 'Sale',
    blurb: 'A single-strap summit pack that carries a shell, water and snacks — and nothing else.',
    details: ['18 L', 'Single cross-body strap', 'Bungee lash points', '480 g'],
    sizes: ONE, rating: 4.5,
    colors: [{ name: 'Signal Red', hex: '#C2392B', images: ['pack-red'] }] }),
  p({ id: 'watch-beanie', name: 'Ribbed Watch Beanie', cat: 'gear', price: 890,
    blurb: 'A merino-blend rib knit with a deep turn-up. Warm without the itch.',
    details: ['50% merino wool', 'Deep cuff', 'One size', 'Hand wash'],
    sizes: ONE, rating: 4.8,
    colors: [
      { name: 'Black', hex: '#161616', images: ['beanie-black'] },
      { name: 'Grey', hex: '#9A9A98', images: ['beanie-grey'] },
      { name: 'Ash', hex: '#BDBDBB', images: ['beanie-ash'] },
    ] }),
  p({ id: 'fisherman-beanie', name: 'Fisherman Beanie', cat: 'gear', price: 790, badge: 'New',
    blurb: 'A short, shallow beanie that sits above the ears. Comes in three colours.',
    details: ['Acrylic-wool blend', 'Shallow fit', 'Woven label', 'One size'],
    sizes: ONE, rating: 4.6,
    colors: [{ name: 'Navy', hex: '#1E2333', images: ['beanie-fisher', 'beanie-trio'] }] }),
]

export const byId = Object.fromEntries(PRODUCTS.map((x) => [x.id, x]))
export const inCat = (cat) => PRODUCTS.filter((x) => x.cat === cat)
export const catName = (id) => CATEGORIES.find((c) => c.id === id)?.name || 'All products'
export const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN')

// ---------- reviews (demo content, generated deterministically per product)
const NAMES = ['Aarav M.', 'Ishita K.', 'Rohan S.', 'Meera P.', 'Kabir J.', 'Ananya R.', 'Vikram T.', 'Sana Q.', 'Dev A.', 'Tara N.', 'Arjun B.', 'Nisha G.', 'Kunal D.', 'Riya V.', 'Zoya F.', 'Neil C.']
const CITIES = ['Mumbai', 'Bengaluru', 'Pune', 'Delhi', 'Manali', 'Dehradun', 'Kochi', 'Jaipur', 'Shillong', 'Hyderabad']
const TEXT = {
  tshirts: [['Collar still flat after ten washes', 'Heavy without being hot. The collar hasn’t rolled even once.'], ['Finally a boxy tee that fits', 'Size down if you want it regular — the M is roomy on me.'], ['Fabric feels expensive', 'Thick cotton, clean stitching. Bought a second colour.']],
  hoodies: [['Warmest hoodie I own', 'Wore it on a cold morning in Spiti and didn’t need a jacket.'], ['Hood holds its shape', 'Double hood stays up and doesn’t flop. Great weight.'], ['Worth the price', 'Heavy fleece, no pilling after a month of daily wear.']],
  shirts: [['My go-to layer', 'Over a tee in the evening, buttoned up when it’s colder.'], ['Softens nicely', 'A little stiff at first, perfect after two washes.'], ['Pockets are useful', 'Phone fits in the chest pocket without sagging.']],
  jackets: [['Bone dry in a Meghalaya downpour', 'Three hours of rain near Cherrapunji and nothing came through.'], ['Hood fits over my helmet', 'Used it on a climbing trip — the hood works with a helmet on.'], ['Pit zips are a lifesaver', 'Opened them on the climb, closed at the top. Breathes well.']],
  shoes: [['Comfortable out of the box', 'No break-in needed. Walked 15k steps on day one.'], ['Grip is excellent', 'Wet rocks on the Triund trail and I never slipped.'], ['True to size', 'Ordered my usual UK 9 and it fits with thick socks.']],
  gear: [['Carries well when full', 'Hip belt takes the weight off. Did a 3-day trek with it.'], ['Lots of pockets, in the right places', 'Everything has a spot and the bottle pocket is reachable.'], ['Solid build', 'Zips feel strong, fabric shrugs off rain.']],
}
function rng(seed) { let s = 0; for (const c of seed) s = (s * 31 + c.charCodeAt(0)) >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296) }
export function reviewsFor(prod) {
  const r = rng(prod.id)
  const n = 5 + Math.floor(r() * 4)
  const pool = TEXT[prod.cat] || TEXT.gear
  const out = []
  for (let i = 0; i < n; i++) {
    const [title, body] = pool[Math.floor(r() * pool.length)]
    const stars = r() < 0.72 ? 5 : r() < 0.8 ? 4 : 3
    const day = 2 + Math.floor(r() * 80)
    const d = new Date(2026, 10, 9 - day)
    out.push({
      id: `${prod.id}-${i}`, name: NAMES[Math.floor(r() * NAMES.length)], city: CITIES[Math.floor(r() * CITIES.length)],
      stars, title, body, verified: r() > 0.2,
      size: prod.sizes[Math.min(prod.sizes.length - 1, 1 + Math.floor(r() * 3))],
      date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    })
  }
  return out
}
PRODUCTS.forEach((x) => { x.reviews = 40 + (x.id.length * 37) % 380 })

export const EDITORIAL = ['ed-1', 'ed-2', 'ed-3', 'ed-4', 'ed-5', 'ed-6', 'ed-7', 'ed-8', 'ed-9', 'ed-10', 'ed-11']
export const TREK = ['tr-1', 'tr-2', 'tr-3', 'tr-4', 'tr-5', 'tr-6', 'tr-7', 'tr-8', 'tr-9']
