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

## 16. Final audit — favicon, SEO, responsiveness — 2026-09-27

- **Recovered `config/settings_schema.json`** (a Shopify sync had reset it to `[]`, wiping all
  global Theme Settings). Restored from the initial commit — Brand/Colors/Typography/Cart/
  Social/Favicon settings are back; saved values in settings_data.json unaffected.
- **Favicon:** added `assets/favicon.png` (SF logo, auto-cropped square 512px). `theme.liquid`
  now serves it (plus apple-touch-icon) as a fallback, overridden by Theme settings > Brand >
  Favicon if the merchant uploads one.
- **SEO (`snippets/meta-tags.liquid`):** fixed insecure `http:` og:image → `https:`, added an
  og:image fallback, and added JSON-LD **Product** structured data on product pages (name,
  image, brand, sku, price, availability) plus **Organization** + **WebSite/SearchAction** on
  the homepage. Existing: canonical, per-page title with shop name, meta description, OG/Twitter.
- **Homepage H1:** added a visually-hidden `<h1>` (shop name + description) since all visible
  homepage sections use H2 — one H1 per page now.
- **Audit results:** all `<img>` have alt text; no insecure links; every template has exactly
  one H1; responsive verified at 390px (cards → 2 cols, nav → drawer <989px, grids stack).
## 17. Header upgrades — overflow "…" nav + "View catalog" dropdown — 2026-09-27

Both read the live Navigation menu, so they auto-update as categories are added (only render
when Menu source = Shopify Navigation; built-in default path unchanged).
- **Priority-nav overflow:** `.header-nav__list` is now single-line; `global.js`
  `layoutNavOverflow()` moves top-level items that don't fit into a `[data-nav-more]` "•••"
  bucket that reveals them on hover (their mega menus fly out to the left). Recomputes on
  resize/load/section-load. `.no-js` falls back to wrapping.
- **"View catalog" dropdown** (`snippets/catalog-menu.liquid`) sits beside the search: an accent
  button opening a panel of all top categories, each with a fly-out of its subcategory columns.
  Toggled by `setupCatalogMenu()` (click to open, outside-click / Esc to close). Desktop only
  (hidden ≤989px; the mobile drawer already lists everything).
- CSS added to base.css (`.catalog-menu*`, `.header-nav__more*`, `.header__search-row`).
- Verified in a headless browser render (overflow bucket appears; catalog panel + flyouts).

- **Dynamic/extensible (verified):** homepage is a modular JSON section template; collections
  and product rows read live objects; mega menu supports Shopify Navigation (`menu_source:
  navigation`) with the built-in default as fallback. To add categories/subcategories freely
  with zero code, switch Header → Menu source to **Navigation** and build it in Online Store >
  Navigation (the code already renders 3-level nav as a mega menu). `footer-default-links.liquid`
  has a few static collection links used ONLY as a fallback until footer menus are set.

## 18. Tango-style homepage + mobile responsiveness pass — 2026-09-27

Reference again: tango-sports.com. Goals this session: match tango's homepage section
order, fix bad mobile responsiveness (was breaking on Samsung A36 etc.), add real social
links, add location, and relabel/repoint categories. Header, footer and the rest of the
store left as-is.

1. **Homepage re-laid-out to mirror tango exactly** (`templates/index.json`). New order:
   Hero → Bags & Shaker → Fitness Accessories → Treadmills → Exercise Cycles →
   Body Massagers → Featured Products → Benches & Rods → Shop By Category (collection list)
   → Newsletter. The previous extra rows (promo marquee, trust bar, best sellers, promo
   banners, strength, sports, sale, brand story) were removed from the template to match
   tango's density. Their section types still exist in `sections/`, so any can be re-added
   from Customize → Add section.
2. **Categories relabelled + repointed** to existing sub-collections (real products show):
   - Cardio Machines → **Treadmills** (collection `treadmills`)
   - **Exercise Cycles** added (collection `exercise-bikes`)
   - Recovery & Wellness → **Body Massagers** (collection `body-massagers`)
   - Body Support & Braces → **Benches & Rods** (collection `weight-benches`)
   - Bags & Gear → **Bags & Shaker** (collection `bags-gear`)
   Applied to the homepage product rows, the Shop-By-Category tiles, and
   `footer-default-links.liquid` (the shop column). NOTE: the header nav + mobile drawer read
   Shopify Navigation (store data), so the owner must rename those menu items in Online Store
   → Navigation, and rename the actual Collections in admin if the collection titles should
   change too. Tiles for Exercise Cycles / Benches & Rods use no manual image (icon 'none') so
   they fall back to the collection image / placeholder and stay visually consistent.
3. **Mobile responsiveness fixed** (`assets/base.css`) — root cause of the "breaking" look was
   horizontal scroll: only `body` had `overflow-x:hidden`, and the header row overflowed.
   - Added `overflow-x:hidden; max-width:100%` to `html` (stops the page scrolling sideways).
   - Rebuilt the ≤989px header grid to `auto 1fr auto` (hamburger left, logo centred and
     width-capped at 44vw, icons pinned right, tighter gaps) so it never overflows with either
     the image logo or the text wordmark.
   - Product carousels now show ~2 cards with a peek on phones (was one 80%-wide card):
     `.scroll-carousel` grid-auto-columns 46% (<600px), 30% (≥600px), 23% (≥990px) — matches
     tango's mobile rows. Verified at 393px (A36 width) with a headless render of the real
     base.css: page scrollWidth == viewport width (no horizontal scroll), header clean,
     carousels show 2 cards, category tiles 2-up.
4. **Social links** set for real (`config/settings_data.json`, shown in announcement bar +
   footer automatically): Facebook `facebook.com/profile.php?id=61594236452333`, Instagram
   `instagram.com/thesubhanfitness` (used the clean profile handle; the QR share `stkn`/`utm`
   params from the pasted link are omitted as they aren't needed for a public profile link).
5. **Location**: footer address updated (`sections/footer-group.json`). Owner then asked to
   keep it as-is, so it reads exactly **"Asad Center Munir Chowk Gujranwala"** (no ", Pakistan").

## 19. Remove unnecessary pages — 2026-09-27

Per owner request ("remove unnecessary pages"): removed **Blog** and **Warranty**.
- Deleted `templates/page.warranty.json` (the Warranty & After-Sales page template). The
  informational warranty mentions in the FAQ and the product-page accordion were kept — they
  are helpful copy, not a page.
- Removed the **Blog** link from `snippets/footer-default-links.liquid` (Company column). Blog
  templates (`blog.json`, `article.json`) were left in place so nothing errors and it can be
  restored later. To take the blog off the site entirely the owner should also remove any
  "Blog"/"News" item from Online Store → Navigation and hide/delete the blog in admin.
- All other pages (About, Contact, Shipping, Returns, Privacy, Terms, FAQ, Track Order) kept.

## 20. Hero + Collection list matched to Tango — 2026-09-28

Owner request: make the **hero banner the exact size/feel as tango-sports.com** and the
**Collection list like tango**, keeping SF theme colours; nothing else changed. Measured the
live tango site to get the real specs, and verified the result in a local render harness at
desktop (1440) + mobile (375), in both OS light and dark colour schemes.

**Tango specs measured (for reference):** hero is a *boxed* slider (constrained to page-width,
centred with side gutters, ~4px radius), **16:9 at every breakpoint** (1280×720 desktop,
343×193 mobile), with a **fraction pager ("1 / 2")** + arrows. Collection list is a
**horizontal slider of square tiles** (~146px desktop showing ~8, ~170px/2.2-visible mobile)
with the **label + chevron below** each tile.

1. **Hero — 16:9, boxed, fraction pager** (`sections/hero-slideshow.liquid`, `assets/base.css`,
   `assets/global.js`):
   - Wrapped the slideshow in `<div class="page-width hero-boxed">` and added
     `.slideshow--boxed` (rounded `var(--radius)` = 12px + soft shadow) → boxed/centred like tango
     instead of full-bleed.
   - `.slide__media.ratio-wide` changed **16/6 → 16/9**, and the ≤749px override 4/5 → **16/9**,
     so the hero is 16:9 at all widths (matches tango exactly). Schema label updated to
     "Wide (16:9, like Tango)". `height:"wide"` in `index.json` already selected, so no data change.
   - Replaced the dot indicators with a **fraction counter** (`.slideshow__fraction`, current
     number in accent orange); `global.js go()` now updates `.slideshow__frac-current`.
   - Mobile text tuned so it fits the shorter 16:9 box (smaller heading, hide `.slide__text`,
     tighter gaps/buttons). Verified: no content overflow, no horizontal page scroll at 375px.

2. **Collection list — tango square-tile slider** (`sections/collection-list.liquid`):
   - Wrapper is now `collection-list--tango scroll-carousel` (reuses the theme's carousel
     arrow/scroll JS; dropped the base `.collection-list` class so scroll-reveal doesn't hide
     off-screen tiles). Card markup rebuilt to **square media on top + caption (title + chevron)
     below** (was an overlay title on a square image).
   - All new styles are **scoped under `.collection-list--tango`** so the `/collections` page
     (`main-list-collections.liquid`, which shares `.collection-card`) keeps its original overlay
     design — nothing else changed. Tile counts: `grid-auto-columns` 42% (<750) / 22% (≥750) /
     12.5% (≥990) → ~2.3 on mobile, ~8 on desktop, matching tango.

**Not changed:** header, footer, product carousels, other sections, colours, content/menus.
**Deploy note:** deployed by pushing to `main` from a git checkout at **`C:\sfrepo`** (short path;
the long scratch path triggers `$GIT_DIR too big`). Shopify's GitHub integration auto-deploys.

## 21. Hero controls + section spacing tuned to Tango — 2026-09-28

Follow-up after comparing live against tango:
1. **Hero nav = Tango control cluster.** The prev/next arrows were plain white circles at the
   left/right edges with an invisible chevron (the icon `<svg>` was never sized). Rebuilt to
   Tango's **`‹ 1 / 2 ›` cluster** centred at the bottom: the two arrows now sit inside
   `.slideshow__controls` on either side of the fraction. Arrows are small (3.4rem desktop /
   3rem mobile) translucent-dark circles that turn accent on hover, and the chevron SVG is now
   explicitly sized (`.slideshow__arrow .icon { width:1.8rem } + .icon svg { width:100% }`) so it
   actually shows. Markup change in `sections/hero-slideshow.liquid`; CSS in `assets/base.css`.
2. **Section spacing tightened toward Tango.** Tango's rhythm is ~25px header→hero and ~30px
   between sections; ours was 64px everywhere (big cream void under the hero). Changed
   `--section-spacing` **64px → 42px** (whole page tighter, more Tango-like) and added a targeted
   rule `.shopify-section:has(.hero-boxed) + .shopify-section .section { margin-top: 3rem }` so the
   gap directly under the hero is ~30px like tango. Verified in the render harness: hero→section
   gap = 30px desktop / 29px mobile, chevrons visible, no horizontal scroll.

**Deploy:** push to `main` from `C:\sfrepo`.

## 22. Product-section density pass (tighter, like Tango) — 2026-09-28

Owner: homepage product sections looked much taller/sparser than tango. Scope chosen by owner:
**tighter spacing only** (keep the card style, per-row count, and section headings as-is).
- **Removed the bottom "VIEW ALL — <collection>" button** from `featured-collection.liquid`
  (the `.featured-collection__viewall` block). Tango has only the top-right View all; the bottom
  button added ~78px of empty space per section. Top-right View all kept.
- **Tightened global rhythm:** `--section-spacing` 42px → **32px**, and `.section-header`
  margin-bottom 2.8rem → **2rem**.
- **Removed the light-grey section backgrounds** (`#f4f5f6`) from the three showcase rows in
  `templates/index.json` (exercise cycles, fitness accessories, benches & rods). They created a
  band whose inner padding stacked on the section margin (~64px gaps) and weren't tango-like;
  tango uses one uniform background. Now every section shares the cream page background and the
  gaps are uniform. The dark newsletter band (`#0c0f12`) was kept.
- Verified in the render harness: hero→section 30px, section→section 32px, no horizontal scroll.

**Deploy:** push to `main` from `C:\sfrepo`.

## 23. Root-cause fixes: spacing setting, phantom padding, hero crossfade — 2026-09-28

Inspected the LIVE site (thesubhanfitness.com) directly and found the real causes the earlier
CSS-only spacing edits missed:
1. **`--section-spacing` was driven by a theme setting, not base.css.** `layout/theme.liquid`
   injects `--section-spacing: {{ settings.spacing_sections }}px` inline (was **56px**), which
   overrode base.css. Set `spacing_sections` 56 → **32** in `settings_data.json`, the
   `theme.liquid` default, and the `settings_schema.json` default (range step is 4, so 32 not 30).
2. **Phantom section padding (Liquid empty-string is truthy).** `featured-collection`,
   `featured-products` and `multicolumn` used `{% if section.settings.background %}` to add
   `padding: var(--section-spacing) 0`. An empty string is truthy in Liquid, so the padding was
   applied to EVERY section (56px) on top of the 56px margin → the huge gaps. Changed all three to
   `{% if section.settings.background != blank %}`. Now empty-background sections get no padding.
3. **Hero "one full + one half" = the horizontal slide animation.** Switched the hero from a
   translateX slide to a **crossfade**: slides are stacked (absolute; first child stays relative to
   hold the 16:9 height), only `.slideshow__slide.is-active` is opaque, `global.js go()` toggles
   `is-active` instead of translating, and the first slide is marked `is-active` in the template.
   Only one banner is ever shown. (Product slider "4 full, no cropped peek" from §22 confirmed
   live: `grid-auto-columns: calc(25% - gap)`.)
- Verified: spacing 30/32px uniform, no phantom padding, hero shows a single slide.

**Deploy:** push to `main` from `C:\sfrepo`.
## 24. Dark-mode color-scheme + collection heading alignment — 2026-09-28

- **Phone dark-mode fix.** The store has a fixed light palette but declared no `color-scheme`,
  so Chrome/Android "auto dark theme" was inverting the page on the owner's phone — which made
  the (white-background) logo show as a bright box. Added `<meta name="color-scheme" content="light">`
  in `theme.liquid` and `:root { color-scheme: light }` in `base.css` so the site always renders
  in its intended light palette regardless of the device's dark mode. (If the owner still wants a
  cleaner logo, upload a transparent-background PNG in Theme settings → Header/Brand.)
- **Collection-list heading** set to left-aligned (`center_heading: false` in `index.json`) so it
  matches the other section headings (eyebrow + orange bar) and tango's left-aligned headings,
  instead of the centered underlined style.
- Verified live: color-scheme light applied, heading left-aligned; responsiveness re-checked —
  desktop 4 / tablet 3 / mobile 2 whole cards, hero 16:9 at all sizes, no horizontal scroll.

**Deploy:** push to `main` from `C:\sfrepo`.

## 25. About-us icons, mobile hero buttons, real contact info, remove pages — 2026-09-28

- **About "What We Stand For" giant icons fixed** (not removed). Root cause: `.multicolumn__item .icon`
  had no size cap on the inner `<svg>`, so icons rendered ~full-column width. Restyled to a compact
  circular badge (7rem circle, 3.4rem icon, soft-accent bg) in `base.css`. (Say the word if you'd
  rather delete the whole section instead.)
- **Mobile hero buttons** no longer overlap the "1 / 2" pager: on ≤749px the hero shows a single
  CTA (secondary button hidden), text is centred with bottom padding reserved for the pager.
- **Real contact details.** WhatsApp number was a placeholder (`923001234567`) → set to the real
  `923008151524` in `settings_data.json` (used by the floating WhatsApp button and the contact-page
  link). Added a contact-info block to `main-contact.liquid` showing the real phone (0300 8151524,
  tel: link), email (subhanfitness567@gmail.com, mailto:) and address (Asad Center, Munir Chowk,
  Gujranwala) — matching the footer.
- **Removed Shipping / Returns / FAQs from the footer** (`footer-default-links.liquid` help column).
  The page TEMPLATES were left in place so existing pages don't break; to fully remove the pages the
  owner must delete them in Online Store → Pages (and remove any menu items in Navigation).

**Deploy:** push to `main` from `C:\sfrepo`.
