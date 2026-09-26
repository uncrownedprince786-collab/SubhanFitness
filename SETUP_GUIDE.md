# Subhan Fitness — Store Setup Guide

This theme is a **complete, Shopify-native storefront skeleton**. Every product/collection
surface reads live Shopify objects, so once you add products and create the collections
below, the whole store populates automatically — **no theme code changes required**.

Work top to bottom. Total time: ~30–45 minutes.

---

## 1. Install the theme

1. Zip the `subhan-fitness` folder (the folder that contains `layout/`, `sections/`,
   `templates/`, `assets/`, `config/`, `locales/`, `snippets/`).
2. Shopify admin → **Online Store → Themes → Add theme → Upload zip file**.
3. Click **Customize** to open the theme editor. Do **not** publish yet — keep it as a
   draft/unpublished theme until you approve it.

> The theme uploads and previews with placeholders even before you add any data.

---

## 2. Create the collections

The homepage and mega menu reference collections by **handle** (the part of the URL after
`/collections/`). Create the collections below with **exactly these handles** and everything
wires up automatically. If a handle doesn't exist yet, the theme just shows a graceful
placeholder — nothing breaks.

**Tip — use Automated collections + tags** so products self-assign. For each subcategory,
set a condition like `Product tag → is equal to → dumbbells`. Then tagging a product
`dumbbells` files it automatically. Parent collections (e.g. *Strength & Weights*) can match
a broader tag such as `strength`.

### Storefront / merchandising collections (used on the homepage)

| Collection | Handle | Suggested rule |
|---|---|---|
| Best Sellers | `best-sellers` | Automated: `Product → is → in stock` sorted by best-selling, **or** manual pick |
| Sale | `sale` | Automated: `Compare-at price → is greater than → 0` (auto-lists anything on sale) |

### Top-level category collections (used in the mega menu tabs)

| Category | Handle |
|---|---|
| Strength & Weights | `strength-weights` |
| Cardio Machines | `cardio-machines` |
| Fitness Accessories | `fitness-accessories` |
| Recovery & Wellness | `recovery-wellness` |
| Body Support & Braces | `body-support` |
| Sports & Team | `sports-team` |
| Bags & Gear | `bags-gear` |

### Subcategory collections (mega-menu columns)

**Strength & Weights**
`dumbbells`, `adjustable-dumbbells`, `kettlebells`, `barbells-plates`, `weight-sets`,
`weight-benches`, `power-racks`, `multi-gym-stations`, `smith-machines`,
`weightlifting-belts`, `lifting-straps`, `ankle-wrist-weights`

**Cardio Machines**
`treadmills`, `walking-pads`, `exercise-bikes`, `spin-bikes`, `upright-bikes`,
`recumbent-bikes`, `elliptical-trainers`, `rowing-machines`, `steppers-aerobic`

**Fitness Accessories**
`resistance-bands`, `jump-ropes`, `hand-grippers`, `ab-core`, `tummy-trimmers`,
`yoga-mats`, `yoga-accessories`, `pilates-boards`, `foam-rollers`

**Recovery & Wellness**
`massage-guns`, `body-massagers`, `foot-leg-massagers`, `massage-chairs`,
`vibration-plates`, `cupping-hijama`, `heat-therapy`

**Body Support & Braces**
`knee-supports`, `ankle-supports`, `wrist-supports`, `back-supports`,
`elbow-supports`, `kinesiology-tape`

**Sports & Team**
`table-tennis`, `badminton`, `snooker-billiards`, `snooker-cues`,
`cricket`, `football`, `basketball`, `boxing-mma`

**Bags & Gear**
`duffel-bags`, `backpacks`, `cross-body-bags`, `bottles-shakers`, `gym-gloves`, `gym-towels`

> You don't have to create **all** subcategories on day one. Create the ones you stock;
> the menu only shows links you add in step 3.

Add a **collection image** and **description** to each (Collection page → *Image* / *Description*).
The theme uses these on the collection banner and category cards automatically.

---

## 3. Build the Navigation menus (mega menu + footer)

**Online Store → Navigation.** The header menu is 3 levels deep:
**top tab → column heading → links in the column.**

### Menu: `Main menu` (handle `main-menu`) — the header mega menu

Create top-level items linking to each category collection, then nest columns and links.
Example for the first two tabs (repeat the pattern for the rest using the handles above):

```
Strength & Weights → /collections/strength-weights
├─ Free Weights → /collections/strength-weights
│   ├─ Dumbbells → /collections/dumbbells
│   ├─ Adjustable Dumbbells → /collections/adjustable-dumbbells
│   ├─ Kettlebells → /collections/kettlebells
│   ├─ Barbells & Plates → /collections/barbells-plates
│   └─ Weight Sets → /collections/weight-sets
├─ Benches & Racks → /collections/weight-benches
│   ├─ Weight Benches → /collections/weight-benches
│   ├─ Power Racks → /collections/power-racks
│   ├─ Multi-Gym Stations → /collections/multi-gym-stations
│   └─ Smith Machines → /collections/smith-machines
└─ Lifting Accessories → /collections/weightlifting-belts
    ├─ Weightlifting Belts → /collections/weightlifting-belts
    ├─ Lifting Straps & Grips → /collections/lifting-straps
    └─ Ankle & Wrist Weights → /collections/ankle-wrist-weights

Cardio Machines → /collections/cardio-machines
├─ Running & Walking → /collections/treadmills
│   ├─ Treadmills → /collections/treadmills
│   └─ Walking Pads → /collections/walking-pads
├─ Cycling → /collections/exercise-bikes
│   ├─ Exercise Bikes → /collections/exercise-bikes
│   ├─ Spin Bikes → /collections/spin-bikes
│   ├─ Upright Bikes → /collections/upright-bikes
│   └─ Recumbent Bikes → /collections/recumbent-bikes
└─ Other Cardio → /collections/elliptical-trainers
    ├─ Elliptical Trainers → /collections/elliptical-trainers
    ├─ Rowing Machines → /collections/rowing-machines
    └─ Steppers & Aerobic → /collections/steppers-aerobic

Fitness Accessories → /collections/fitness-accessories
├─ Training → /collections/resistance-bands
│   ├─ Resistance Bands, Jump Ropes, Hand Grippers, Ab & Core, Tummy Trimmers
└─ Yoga & Pilates → /collections/yoga-mats
    ├─ Yoga Mats, Yoga Accessories, Pilates & Push-up Boards, Foam Rollers

Recovery & Wellness → /collections/recovery-wellness
├─ Massage → /collections/massage-guns
│   ├─ Massage Guns, Body Massagers, Foot & Leg Massagers, Massage Chairs
└─ Therapy → /collections/vibration-plates
    ├─ Vibration Plates, Cupping & Hijama, Heat Therapy

Body Support & Braces → /collections/body-support
├─ Knee, Ankle, Wrist & Palm, Back, Elbow Supports, Kinesiology Tape

Sports & Team → /collections/sports-team
├─ Racket & Table → /collections/table-tennis (Table Tennis, Badminton, Snooker & Billiards, Snooker Cues)
└─ Team & Combat → /collections/cricket (Cricket, Football, Basketball, Boxing & MMA)

Bags & Gear → /collections/bags-gear
├─ Duffel Bags, Gym Backpacks, Cross-Body Bags, Water Bottles & Shakers, Gym Gloves, Gym Towels

Sale → /collections/sale
```

**How the theme renders it automatically:**
- A top item **with sub-items that themselves have children** → renders as a full **mega menu** (columns).
- A top item whose children have **no** grandchildren → renders as a simple **dropdown**.
- A top item with **no** children → renders as a plain link.
- Any item named "Sale" or "Clearance" is highlighted in the accent color.

You can rename, reorder, add, or remove anything here later with **no code changes.**

### Footer menus

Create three link lists and the footer columns fill in automatically:

- **`footer-shop`** → e.g. Best Sellers, New Arrivals, Strength & Weights, Cardio Machines, Sale
- **`footer-help`** → Contact Us, Delivery & Exchange, Shipping Policy, FAQs, Track Order
- **`footer-company`** → About Us, Terms & Conditions, Privacy Policy, Blog

(The header menu setting is on **Header** section; footer menu handles are set on the
**Footer** section blocks. Both are already pre-wired to the handles above.)

---

## 4. Turn on filters (collection page)

**Shopify admin → Apps → Search & Discovery** (free, by Shopify) → **Filters** →
add filters such as **Price, Availability, Product type, Vendor, and any metafields/options**
(e.g. Color, Weight). The collection pages read these automatically — the sidebar,
mobile filter drawer, active-filter pills, and AJAX updating all work with whatever you enable.

---

## 5. Product data the theme uses

Standard Shopify fields power most of the product page (title, images, price,
compare-at price, variants, inventory/availability, description). Two **optional**
extras make it richer:

| Feature | Where | How |
|---|---|---|
| **Star ratings** on cards & product page | `reviews.rating` + `reviews.rating_count` metafields | Install any reviews app (Shopify Product Reviews, Judge.me, Loox). They set these automatically. |
| **Specifications table** | `custom.specifications` metafield | Create a **metafield definition**: Products → Metafields → `custom.specifications`, type **JSON** or **Metaobject list**. Store rows like `[{"label":"Weight","value":"20 kg"},{"label":"Material","value":"Rubber"}]`. |
| **Per-product shipping note** | `custom.shipping_info` metafield (rich text) | Optional. Overrides the default shipping copy in the product's Shipping row. |

If these aren't set, those sections simply hide or fall back to sensible defaults.

---

## 6. Add demo products (to preview), then real products

**Demo phase** — add ~15–25 products so every homepage section fills. Cover this variety
so you can see all states working:

- ✅ A few **normal** priced products (no compare-at)
- ✅ Several **sale** products (set a **Compare-at price** higher than price → they show the discount badge and appear in `sale`)
- ✅ Products with **variants** (e.g. Dumbbell weight 1–40 kg, or Color) → the variant swatches + "Choose options" flow
- ✅ Products with **multiple images** → gallery + hover second image on cards
- ✅ Products across **different collections** (tag them so they land in the right categories)
- ✅ Products with **different availability** (mark one out of stock / continue-selling off) → "Sold out" badge

Assign each demo product to its collection (via tags if you used automated collections, or
manually). Set the homepage section collections in the theme editor if you want different
picks (they're already pointed at `best-sellers`, `cardio-machines`, `strength-weights`, `sale`).

**Going live** — when your real Subhan Fitness catalog is ready:
1. Delete or unpublish the demo products.
2. Add the real products with images, prices, variants.
3. Tag/assign them to the same collections.
4. Everything (homepage, mega menu, category pages, product pages, search, cart) keeps
   working — **no theme edits.**

---

## 7. Theme settings to review (Customize → Theme settings)

- **Brand**: upload your logo (falls back to a "SUBHAN**FITNESS**" wordmark), set favicon.
- **Colors**: accent color drives buttons, badges, links (default energetic red `#f5361f`).
- **Cart**: choose Drawer / Page / Notification; set the **free-shipping threshold**
  (default Rs 15,000) and toggle the progress bar.
- **Social media**: add Facebook/Instagram/TikTok/YouTube + WhatsApp number (enables the
  WhatsApp buttons and footer icons).
- **Product cards**: image ratio, ratings, hover image, quick add, discount badge.

---

## 8. Recommended pages & policies

Create these in **Online Store → Pages** (linked from the footer):
About Us, Contact Us (uses the `page.contact` template with a working form automatically),
Delivery & Exchange Policy, Shipping Policy, FAQs.
Set legal policies in **Settings → Policies** (Refund, Privacy, Terms) — Shopify links these
in the footer/checkout.

---

## Acceptance criteria — confirmed

- **Give the store 100 real products tomorrow?** → Add them, assign to collections. Homepage,
  category, product, search, and cart all populate automatically. ✅ No theme code changes.
- **Create a new collection tomorrow?** → Its page works instantly via `collection.json`
  (banner + filters + grid + pagination). Add it to the menu in Navigation to surface it. ✅
- **Replace all demo products with real ones?** → Templates read live objects, so everything
  keeps working. ✅

The theme is intentionally **not published** — publish only after your review.
