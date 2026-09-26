# Subhan Fitness — Development Log & Reference

A complete record of how this theme was built, the decisions made, and how to
continue. Written for future reference (by the owner or an AI assistant reading
this repo fresh). These `.md` files live in the repo but are ignored by Shopify —
they do not affect the theme.

---

## 1. What this is

A complete, custom **Shopify Online Store 2.0 theme** for **Subhan Fitness**, a
Pakistani fitness / gym / sports equipment store. Built from scratch to be
structurally comparable to a full multi-category sports store (reference:
tango-sports.com) while being 100% original and 100% Shopify-native/dynamic.

**Design language:** brand colors — accent/orange `#FF4D04`, dark `#0C0807`, warm
cream backgrounds (`#FBF7F1` / `#F3EBE0`). Fonts — **Plus Jakarta Sans** (headings)
+ **Inter** (body) via Google Fonts. Clean, sporty, animated.

**Core principle:** every product/collection surface reads live Shopify objects.
Adding products/collections in the admin makes them appear automatically — no
theme code changes required.

---

## 2. Repository & deployment

- **GitHub:** `uncrownedprince786-collab/SubhanFitness`, branch **`main`**.
- The store is connected to this repo via Shopify's GitHub integration, as theme
  **"SubhanFitness/main"**. Pushes to `main` auto-deploy to that (unpublished) theme.
- The owner has also used **uploaded ZIP** copies of the theme at times. Note:
  editing on a ZIP theme means hotfixes must be applied by replacing asset files
  via **Edit code** (products/collections/pages are store-wide and unaffected;
  only theme *settings* are per-theme).
- Windows long-path + forward-slash zips were used for packaging.

---

## 3. Theme architecture (file map)

```
layout/theme.liquid          Core layout. Loads base.css FIRST, then a fonts
                             {% style %} block, then a color-variables block
                             (with per-value fallbacks). Google Fonts links.
                             Renders header-group, content, footer-group, cart
                             drawer, WhatsApp button.
layout/password.liquid       Password page layout.

config/settings_schema.json  Theme settings: Brand, Colors, Typography (sizes),
                             Layout, Product cards, Cart, Social media.
config/settings_data.json    Current values incl. brand colors + dummy social links.

assets/base.css              Entire design system. :root has brand defaults so the
                             theme is styled even without the inline vars.
                             IMPORTANT: uses the 1rem = 10px convention
                             (html { font-size: 62.5% }).
assets/global.js             All interactivity: cart AJAX, add-to-cart, variants,
                             predictive search, facets, quantity, drawers,
                             slideshow, sticky header, scroll-reveal animations,
                             carousel arrows, mega-menu edge flipping.

sections/  (section groups)  header-group.json, footer-group.json, password-group.json
sections/  (header/footer)   header.liquid (logo picker + menu source),
                             announcement-bar.liquid (rotating + social icons),
                             footer.liquid (menus w/ default fallback + contact).
sections/  (homepage)        hero-slideshow, promo-marquee, multicolumn (trust),
                             collection-list (category tiles w/ fitness icons),
                             featured-collection (product carousel + View all),
                             image-with-text, featured-product (spotlight),
                             rich-text, newsletter.
sections/  (templates)       main-product, main-collection-product-grid,
                             main-collection-banner, main-list-collections,
                             main-cart, main-search, main-page, main-contact,
                             main-blog, main-article, main-404, main-password,
                             product-recommendations, predictive-search, faq,
                             page-hero, page-body.

snippets/                    icon (incl. fitness icons), card-product, price,
                             rating, buy-buttons, variant-picker,
                             product-media-gallery, breadcrumbs, pagination,
                             facets, cart-drawer(+items), cart-notification,
                             predictive-search, menu-drawer(+default),
                             mega-menu-default, header-mega-menu, meta-tags,
                             footer-default-links, whatsapp-button.

templates/*.json             index, product, collection, cart, search, page,
                             page.contact, page.about, page.faq, page.content,
                             blog, article, list-collections, 404.
templates/customers/*.liquid login, register, account, order, addresses,
                             reset_password, activate_account.
locales/en.default.json      All storefront strings.
```

### Reference docs in the repo
- `SETUP_GUIDE.md` — full store setup (navigation, collections, filters, demo data).
- `PAGE_CONTENT.md` — SEO starter copy for policy pages + how to create pages.
- `project-history/DEVELOPMENT_LOG.md` — this file.

---

## 4. Homepage layout (re-sequenced, distinct rhythm)

`templates/index.json` order:
1. Hero slideshow
2. **Promo marquee** (scrolling strip)
3. Trust bar (multicolumn)
4. Category tiles (collection-list, fitness icons)
5. Best Sellers (featured-collection carousel)
6. Promo banner (image-with-text)
7. Cardio Machines (featured-collection carousel)
8. Spotlight product (featured-product)
9. Strength & Weights (featured-collection carousel)
10. On Sale Now (featured-collection carousel)
11. Brand story (rich-text)
12. Newsletter

Empty product sections show **demo placeholder products** (image, title, example
price, sale badge) until real products are assigned/tagged — then they auto-fill.

---

## 5. Navigation (mega menu)

- Header setting **"Menu source"**: `theme` (built-in) or `navigation` (Shopify).
- **Built-in default** (`snippets/mega-menu-default.liquid` + `menu-drawer-default.liquid`)
  ships the full 7-category hierarchy so the menu works immediately. Links point at
  `/collections/<handle>`.
- Top-level tabs (7): Strength & Weights, Cardio Machines, Fitness Accessories,
  Recovery & Wellness, Body Support, Sports & Team, Bags & Gear. (Sale was removed
  from the bar — it wrapped oddly; still linked in footer/homepage.)
- Mega menu is anchored to the tab's left edge; a JS check flips right-edge tabs
  leftwards so nothing clips (commit ef0391b).

---

## 6. Category (collection) taxonomy — 66 collections

Categories are **Shopify Collections** (their pages auto-render via
`templates/collection.json`). Created via **Matrixify** bulk import (free plan caps
10 items/import, so files were split).

**Merchandising:** `best-sellers` (tag `best-seller`), `sale` (auto: compare-at price > 0).

**Top-level:** `strength-weights`, `cardio-machines`, `fitness-accessories`,
`recovery-wellness`, `body-support`, `sports-team`, `bags-gear`.

**Subcategories (by group):**
- Strength: `dumbbells`, `adjustable-dumbbells`, `kettlebells`, `barbells-plates`,
  `weight-sets`, `weight-benches`, `power-racks`, `multi-gym-stations`,
  `smith-machines`, `weightlifting-belts`, `lifting-straps`, `ankle-wrist-weights`
- Cardio: `treadmills`, `walking-pads`, `exercise-bikes`, `spin-bikes`,
  `upright-bikes`, `recumbent-bikes`, `elliptical-trainers`, `rowing-machines`,
  `steppers-aerobic`
- Fitness Accessories: `resistance-bands`, `jump-ropes`, `hand-grippers`, `ab-core`,
  `tummy-trimmers`, `yoga-mats`, `yoga-accessories`, `pilates-boards`, `foam-rollers`
- Recovery: `massage-guns`, `body-massagers`, `foot-leg-massagers`, `massage-chairs`,
  `vibration-plates`, `cupping-hijama`, `heat-therapy`
- Body Support: `knee-supports`, `ankle-supports`, `elbow-supports`, `wrist-supports`,
  `back-supports`, `kinesiology-tape`
- Sports: `table-tennis`, `badminton`, `snooker-billiards`, `snooker-cues`, `cricket`,
  `football`, `basketball`, `boxing-mma`
- Bags & Gear: `duffel-bags`, `backpacks`, `cross-body-bags`, `bottles-shakers`,
  `gym-gloves`, `gym-towels`

**Smart-collection rules:** each collection = automated, condition `Tag = <handle>`.
Top-level collections use **Must Match = any** across their subcategory tags, so
tagging a product with a subcategory handle also files it into the parent.

---

## 7. Pages — 7

Imported via **Matrixify (Pages entity)**. Handles + templates:
- `about-us` → template `about` (designed)
- `faqs` → template `faq` (designed accordion + FAQ JSON-LD)
- `contact` → template `contact` (working form)
- `shipping` → template `content` (SEO copy)
- `returns` → template `content` (SEO copy)
- `privacy-policy` → template `content` (SEO copy)
- `terms-conditions` → template `content` (SEO copy)

SEO title/description set via metafields `global.title_tag` / `global.description_tag`.
Bodies contain `[bracketed]` placeholders for the owner to fill (email, phone,
address, free-shipping amount, date). Footer links match these handles.

---

## 8. Products — how they route

Add products in Shopify admin (or **Products → Import**, native CSV, no row limit).
Key conventions:
- **Tags** = collection handles (e.g. `dumbbells`). One subcategory tag files the
  product into the sub AND its parent category (smart rules), plus homepage rows.
- Add `best-seller` to feature in the Best Sellers carousel.
- A **compare-at price** higher than price → sale badge + auto-listed in `sale`.
- 2+ images → hover image swap on cards. Variants via Option columns.
- A products import template was provided (`subhan-fitness-products-template.csv`).

---

## 9. Commerce wiring (verified correct, Shopify-native)

Add to cart, cart drawer/page, qty update/remove, checkout (`name="checkout"`),
Buy it now (`{{ form | payment_button }}`), predictive search, track order
(account). Requires in the store: a **payment provider** (use Bogus Gateway to
test), and **customer accounts** enabled for login/track-order.

---

## 10. Key decisions & fixes (chronological)

1. Built full OS 2.0 theme: header/mega-menu, collection system, product system,
   cart, search, footer, all templates, setup guide.
2. Rebranded to SF colors (#FF4D04 / #0C0807 / cream); built-in mega menu so it
   shows without Navigation setup; fitness icons for category tiles (replaced
   fashion-style placeholder art).
3. **CSS loading fix:** the theme looked unstyled because (a) `html { font-size:
   62.5% }` was only in the mobile query — added globally; (b) color vars were
   fragile — base.css now ships :root brand defaults + the inline block overrides
   with per-value fallbacks; fonts isolated in their own style block.
4. Fonts → Inter + Plus Jakarta Sans (Google Fonts). Removed skip-to-content.
   Logo picker added to Header section (and global Brand). Social icons + floating
   WhatsApp button. Review app-block support on product page.
5. "View all" buttons on every product section (top-right + bottom), dynamic to the
   section's collection.
6. Empty sections: first hidden on live / editor-preview; then switched to always
   showing **demo placeholder products** (owner preference).
7. Added scroll-reveal animations + scrolling promo marquee + horizontal product
   carousels with prev/next arrows. Fixed carousels not overflowing (fixed-% column
   widths) so arrows appear.
8. Removed Sale from mega-menu bar (odd wrap). Designed About/FAQ/content page
   templates + SEO content. Fixed mega-menu edge clipping.
9. Bulk data: Matrixify CSVs for 66 collections (split for free plan) + 7 pages;
   native Shopify products template.

---

## 11. How to resume work (for an AI assistant)

- The full theme is this repo. Read `SETUP_GUIDE.md` and this log first.
- Deploy model: push to `main` → auto-deploys to SubhanFitness/main. Always
  `git pull` first (Shopify commits editor changes back).
- base.css uses 1rem=10px (62.5% root). Colors via CSS variables with brand
  defaults in base.css :root.
- Products/collections/pages are **store data**, not in the repo — cannot be created
  from theme code; use admin or Matrixify/CSV imports.
- Validation before pushing: JSON parses, `{% schema %}` blocks parse, every
  `render`/section reference resolves, Liquid tags balanced, `node --check`
  global.js, CSS brace balance.

---

## 12. Outstanding / possible next steps

- Add real hero slideshow images + copy (Customize → Home page).
- Add collection images to top-level categories for nicer tiles.
- Optionally add: countdown sale banner, testimonials carousel, Instagram/stats
  strip, a dedicated multi-product "Featured Products" carousel.
- Fill `[bracketed]` placeholders in the policy pages.
- Enable payment provider + customer accounts; then publish the theme.

---

## 13. Session update — 2026-09-27

Three changes made this session:

1. **Replaced the single-product "spotlight" with a multi-product Featured Products section.**
   - Deleted `sections/featured-product.liquid` (the old Editor's Pick single product).
   - Added `sections/featured-products.liquid` — block-based (one **Product** block per
     product), so the owner can hand-pick any number of products to feature. Renders as a
     carousel (with arrows) or grid, reuses the `card-product` snippet, and falls back to a
     skeleton placeholder when no products are picked yet. Has a preset, so it also shows in
     Customize → Add section.
   - `templates/index.json`: the `spotlight` slot now uses `type: featured-products` with 4
     empty product blocks pre-seeded. Homepage order is unchanged (still position 8).

2. **Removed the scrollbar under every carousel.** `.scroll-carousel` in `assets/base.css`
   now hides the scrollbar cross-browser (`scrollbar-width: none`, `-ms-overflow-style: none`,
   `::-webkit-scrollbar { display:none }`) and drops the old `padding-bottom`. Navigation is
   via the JS-injected **prev/next arrows** (desktop) and swipe (mobile). No JS change needed —
   the arrows already call `scrollBy`.

3. **Documented how to add a tango-sports–style home section:** drop a `.liquid` file in
   `sections/` with a `{% schema %}` + preset (auto-appears in Customize → Add section), or
   wire it into `templates/index.json` (`sections` + `order`). Reuse `.section`/`.page-width`/
   `.section-header`/`.scroll-carousel`/`card-product` to match the theme.

4. **Fuller homepage (tango-style density).** Added 6 more rows to `templates/index.json`
   (config only — reuses existing `featured-collection` + `image-with-text` sections, no new
   code): `fitness_showcase` (fitness-accessories), `recovery_showcase` (recovery-wellness,
   grey), `promo_banner_2` (image-with-text, image_right → recovery), `sports_showcase`
   (sports-team), `bags_showcase` (bags-gear, grey), `body_support_showcase` (body-support).
   Homepage now has 18 rows. Empty collections show demo placeholder products until real
   products are tagged. Owner can reorder/hide any of these in Customize with no code.
5. **Featured Products = real slider.** Bumped the `featured-products` section from 4 to 8
   product slots + 8 placeholder cards so the row overflows and the prev/next arrows show.
6. **Free-delivery threshold → Rs.2,000 everywhere** (cart free-shipping setting, announcement
   bar, promo marquee, promo banner, docs).
7. **Hero branding slide reworked** (see `hero-slideshow.liquid` + `.slide__scrim` in base.css):
   all slides share one short 16:6 height (no layout jump); the branding slide shows the gym
   photo with a left gradient scrim hiding the low-res baked-in text, and renders crisp LIVE
   text ("SUBHAN <span class=accent>FITNESS</span>" + tagline from the slide Heading/Text
   fields) so nothing pixelates. Image asset: `assets/hero-subhan-branding.jpg`.

## 14. Premium polish pass — 2026-09-27 (CSS + micro-interactions only)

Pure visual/UX polish in `assets/base.css` (+ the `.product__icon-row` scoped style in
`sections/main-product.liquid`). **No structural, Liquid-logic, mega-menu, collection, or
product-system changes; nothing hardcoded; everything still Theme-Editor driven.**
- Added elevation/motion tokens: `--shadow-sm/md/lg`, `--ease`, `--accent-soft`, `--accent-ring`.
- **Cards:** bigger hover lift + `--shadow-lg` + 1.08 image zoom, title turns accent on hover,
  badge shadow + gradient sale badge, clearer price hierarchy, larger stars, and **quick-add
  reveals on hover (desktop, `hover:hover`)** while staying always-visible on touch.
- **Buttons:** consistent hover lift + accent-ring shadow; new `.button--ghost-accent`; secondary
  now white. **View-all** CTAs unified across all product sections (top + bottom).
- **Section headers:** more spacing, gradient accent bar, tighter letter-spacing.
- **Mega menu:** softer shadow, roomier padding, underlined column headings, hover-pill links,
  invisible hover bridge (`::before`) so the panel doesn't drop on cursor travel.
- **Header nav:** animated accent underline on hover/focus.
- **Product page:** smoother gallery (image scale + swap fade hook `.is-swapping`), nicer active/
  hover thumbnails, cleaner variant swatches, stronger Add-to-cart/Buy-now, trust `icon_row`
  restyled as a divided card.
- **Category cards, footer links, mobile drawer:** hover states + accent consistency.
- **Mobile:** larger tap targets (buttons, header icons, drawer rows, quantity). Reduced-motion
  media query disables the added transforms. Section spacing 56→64px, grid gap 20→22px.
- Verified with a headless browser render of the real base.css before pushing.

## 15. Added missing designed page templates — 2026-09-27

Six new **page templates** (no new sections/code — each assembles existing sections:
`page-hero`, `multicolumn`, `rich-text`, `faq`, `page-body`), so styling/layout is fixed and
content is editable from the Theme Editor / page body. Validated: every section type, setting
id and block type checked against the section schemas.
- `templates/page.shipping.json` — Shipping & Delivery (hero + trust facts + details).
- `templates/page.returns.json` — Returns & Exchange (hero + 3-step columns + policy).
- `templates/page.warranty.json` — Warranty & After-Sales (hero + overview + FAQ).
- `templates/page.track-order.json` — Track Your Order (hero + steps + how-to + account CTA).
- `templates/page.privacy.json` — Privacy Policy (hero + page-body).
- `templates/page.terms.json` — Terms & Conditions (hero + page-body).
Merchant: create a Page, pick the matching template (see `PAGE_CONTENT.md` table for the
suggested handles the footer links already point at), then edit the copy. Placeholder text
uses [bracketed] fields and the Rs.2,000 free-delivery threshold.
