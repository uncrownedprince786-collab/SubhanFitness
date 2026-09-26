/* ==========================================================================
   Subhan Fitness — global.js
   All storefront interactivity. Vanilla JS, no dependencies.
   ========================================================================== */
(function () {
  'use strict';

  const money = (cents) => {
    const amount = (cents / 100);
    const fmt = (window.themeSettings && window.themeSettings.moneyFormat) || 'Rs.{{amount}}';
    const withCommas = amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return fmt.replace(/\{\{\s*amount\s*\}\}/g, withCommas)
              .replace(/\{\{\s*amount_no_decimals\s*\}\}/g, Math.round(amount).toLocaleString('en-US'));
  };
  window.formatMoney = money;

  const lockScroll = (lock) => document.body.classList.toggle('body-scroll-lock', lock);

  /* -------------------------------------------------------------------------
     Drawer / overlay controller (cart drawer, menu drawer)
     ------------------------------------------------------------------------- */
  function openDrawer(drawer) {
    if (!drawer) return;
    drawer.classList.add('active');
    const overlay = document.querySelector(drawer.dataset.overlay || '#DrawerOverlay');
    if (overlay) overlay.classList.add('active');
    lockScroll(true);
    drawer.setAttribute('aria-hidden', 'false');
    const focusable = drawer.querySelector('button, a, input, [tabindex]');
    if (focusable) focusable.focus();
  }
  function closeDrawer(drawer) {
    if (!drawer) return;
    drawer.classList.remove('active');
    const overlay = document.querySelector(drawer.dataset.overlay || '#DrawerOverlay');
    if (overlay) overlay.classList.remove('active');
    lockScroll(false);
    drawer.setAttribute('aria-hidden', 'true');
  }
  window.SubhanDrawer = { open: openDrawer, close: closeDrawer };

  document.addEventListener('click', (e) => {
    const cartToggle = e.target.closest('[data-cart-drawer-toggle]');
    if (cartToggle && window.themeSettings.cartType === 'drawer') {
      e.preventDefault();
      openDrawer(document.getElementById('CartDrawer'));
      return;
    }
    const menuToggle = e.target.closest('[data-menu-toggle]');
    if (menuToggle) {
      e.preventDefault();
      openDrawer(document.getElementById('MenuDrawer'));
      return;
    }
    const close = e.target.closest('[data-drawer-close]');
    if (close) {
      e.preventDefault();
      closeDrawer(close.closest('.drawer'));
      return;
    }
    const overlay = e.target.closest('.drawer__overlay');
    if (overlay) {
      document.querySelectorAll('.drawer.active').forEach(closeDrawer);
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.drawer.active').forEach(closeDrawer);
      document.querySelectorAll('.facets.active').forEach((f) => {
        f.classList.remove('active');
        const ov = f.querySelector('.facets__overlay'); if (ov) ov.classList.remove('active');
        lockScroll(false);
      });
    }
  });

  /* -------------------------------------------------------------------------
     Cart API helpers
     ------------------------------------------------------------------------- */
  const Cart = {
    async getState() {
      const res = await fetch(`${window.routes.cart_url}.js`, { headers: { Accept: 'application/json' } });
      return res.json();
    },
    async add(items) {
      const res = await fetch(window.routes.cart_add_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ items })
      });
      if (!res.ok) { const err = await res.json(); throw err; }
      return res.json();
    },
    async change(line, quantity) {
      const res = await fetch(window.routes.cart_change_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ line, quantity })
      });
      return res.json();
    },
    async updateNote(note) {
      await fetch(window.routes.cart_update_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note })
      });
    }
  };
  window.SubhanCart = Cart;

  function updateCartCount(count) {
    document.querySelectorAll('[data-cart-count]').forEach((el) => {
      el.textContent = count;
      el.classList.toggle('hidden', count === 0);
    });
  }

  async function refreshCartDrawer() {
    const drawer = document.getElementById('CartDrawer');
    if (!drawer) return;
    const res = await fetch(`${window.routes.cart_url}?section_id=cart-drawer`);
    const text = await res.text();
    const html = new DOMParser().parseFromString(text, 'text/html');
    const newContent = html.querySelector('[data-cart-drawer-content]');
    const current = drawer.querySelector('[data-cart-drawer-content]');
    if (newContent && current) current.replaceWith(newContent);
  }

  async function refreshCartPage() {
    if (!document.querySelector('[data-cart-page]')) return;
    const res = await fetch(`${window.routes.cart_url}?section_id=main-cart`);
    const text = await res.text();
    const html = new DOMParser().parseFromString(text, 'text/html');
    const fresh = html.querySelector('[data-cart-page]');
    const current = document.querySelector('[data-cart-page]');
    if (fresh && current) current.replaceWith(fresh);
  }

  function announce(msg) {
    const region = document.getElementById('cart-live-region');
    if (region) region.textContent = msg;
  }

  /* -------------------------------------------------------------------------
     Product form — AJAX add to cart
     ------------------------------------------------------------------------- */
  class ProductForm extends HTMLElement {
    constructor() {
      super();
      this.form = this.querySelector('form');
      if (!this.form) return;
      this.submitButton = this.querySelector('[type="submit"]');
      this.form.addEventListener('submit', this.onSubmit.bind(this));
    }
    async onSubmit(e) {
      e.preventDefault();
      if (this.submitButton.classList.contains('loading')) return;
      this.submitButton.classList.add('loading');
      this.submitButton.setAttribute('aria-disabled', 'true');
      const formData = new FormData(this.form);
      const items = [{
        id: formData.get('id'),
        quantity: parseInt(formData.get('quantity') || '1', 10)
      }];
      const props = {};
      for (const [key, value] of formData.entries()) {
        const m = key.match(/^properties\[(.+)\]$/);
        if (m) props[m[1]] = value;
      }
      if (Object.keys(props).length) items[0].properties = props;
      try {
        await Cart.add(items);
        const state = await Cart.getState();
        updateCartCount(state.item_count);
        announce(`${this.dataset.productTitle || 'Product'} added to cart`);
        const type = window.themeSettings.cartType;
        if (type === 'drawer') {
          await refreshCartDrawer();
          openDrawer(document.getElementById('CartDrawer'));
        } else if (type === 'notification') {
          document.dispatchEvent(new CustomEvent('cart:notify', { detail: { items } }));
        } else {
          window.location = window.routes.cart_url;
        }
      } catch (err) {
        const msg = (err && err.description) || (window.cartStrings && window.cartStrings.error);
        const errEl = this.querySelector('[data-product-form-error]');
        if (errEl) { errEl.textContent = msg; errEl.hidden = false; }
      } finally {
        this.submitButton.classList.remove('loading');
        this.submitButton.removeAttribute('aria-disabled');
      }
    }
  }
  customElements.define('product-form', ProductForm);

  /* -------------------------------------------------------------------------
     Variant selection
     ------------------------------------------------------------------------- */
  class VariantSelects extends HTMLElement {
    constructor() {
      super();
      const data = this.querySelector('[data-variant-json]');
      this.variants = data ? JSON.parse(data.textContent) : [];
      this.addEventListener('change', this.onChange.bind(this));
    }
    getSelectedOptions() {
      const options = [];
      this.querySelectorAll('[data-option-index]').forEach((group) => {
        const idx = parseInt(group.dataset.optionIndex, 10);
        let value = null;
        const checked = group.querySelector('input:checked');
        if (checked) value = checked.value;
        const select = group.querySelector('select');
        if (select) value = select.value;
        options[idx] = value;
      });
      return options;
    }
    onChange() {
      const selected = this.getSelectedOptions();
      const variant = this.variants.find((v) =>
        v.options.every((opt, i) => opt === selected[i])
      );
      this.updateAvailability(selected);
      const evt = new CustomEvent('variant:change', { detail: { variant }, bubbles: true });
      this.dispatchEvent(evt);
      this.updateUI(variant);
    }
    updateAvailability() {
      // Mark unavailable option combinations (single-option quick pass)
      const inputs = this.querySelectorAll('input[data-variant-input]');
      inputs.forEach((input) => {
        const optionIndex = parseInt(input.closest('[data-option-index]').dataset.optionIndex, 10);
        const testOptions = this.getSelectedOptions();
        testOptions[optionIndex] = input.value;
        const exists = this.variants.some((v) =>
          v.available && v.options[optionIndex] === input.value &&
          testOptions.every((o, i) => i === optionIndex || o == null || v.options[i] === o)
        );
        input.disabled = !exists;
      });
    }
    updateUI(variant) {
      const container = document.getElementById(this.dataset.section || 'ProductInfo') || document;
      const idInput = document.querySelector(`#${this.dataset.formId || 'product-form'} [name="id"]`) ||
                      document.querySelector('[name="id"][data-variant-id-input]');
      if (idInput && variant) idInput.value = variant.id;

      const priceEl = container.querySelector('[data-price-wrapper]');
      const addBtn = container.querySelector('[data-add-button] span');
      const addButtonEl = container.querySelector('[data-add-button]');
      const availEl = container.querySelector('[data-availability]');

      if (!variant) {
        if (addButtonEl) { addButtonEl.disabled = true; }
        if (addBtn) addBtn.textContent = 'Unavailable';
        return;
      }

      // Update price
      if (priceEl) {
        let html;
        if (variant.compare_at_price && variant.compare_at_price > variant.price) {
          const pct = Math.round((1 - variant.price / variant.compare_at_price) * 100);
          html = `<span class="price price--on-sale">
                    <span class="price__sale">${money(variant.price)}</span>
                    <s class="price__compare">${money(variant.compare_at_price)}</s>
                    <span class="badge badge--sale">-${pct}%</span>
                  </span>`;
        } else {
          html = `<span class="price"><span class="price__regular">${money(variant.price)}</span></span>`;
        }
        priceEl.innerHTML = html;
      }
      // Availability + button
      if (addButtonEl && addBtn) {
        if (variant.available) {
          addButtonEl.disabled = false;
          addBtn.textContent = addButtonEl.dataset.defaultText || 'Add to cart';
        } else {
          addButtonEl.disabled = true;
          addBtn.textContent = 'Sold out';
        }
      }
      if (availEl) {
        availEl.className = 'product__availability ' + (variant.available ? 'in-stock' : 'out-stock');
        availEl.querySelector('[data-availability-text]').textContent = variant.available ? 'In stock' : 'Out of stock';
      }
      // Update URL
      if (variant.id && this.dataset.updateUrl !== 'false') {
        const url = new URL(window.location);
        url.searchParams.set('variant', variant.id);
        window.history.replaceState({}, '', url);
      }
      // Update selected media
      if (variant.featured_media) {
        const gallery = document.querySelector('[data-media-gallery]');
        if (gallery) {
          const target = gallery.querySelector(`[data-media-id="${variant.featured_media.id}"]`);
          if (target) target.click();
        }
      }
      // Selected label text
      this.querySelectorAll('[data-selected-value]').forEach((el) => {
        const idx = parseInt(el.dataset.selectedValue, 10);
        const group = this.querySelector(`[data-option-index="${idx}"]`);
        const checked = group && (group.querySelector('input:checked') || group.querySelector('select'));
        if (checked) el.textContent = checked.value;
      });
    }
  }
  customElements.define('variant-selects', VariantSelects);

  /* -------------------------------------------------------------------------
     Quantity input
     ------------------------------------------------------------------------- */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-quantity-button]');
    if (!btn) return;
    const wrapper = btn.closest('.quantity-input');
    const input = wrapper.querySelector('input');
    let val = parseInt(input.value, 10) || 1;
    const min = parseInt(input.min, 10) || 1;
    if (btn.dataset.quantityButton === 'increase') val += 1;
    else val = Math.max(min, val - 1);
    input.value = val;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });

  /* -------------------------------------------------------------------------
     Cart line item changes (drawer + page)
     ------------------------------------------------------------------------- */
  document.addEventListener('change', async (e) => {
    const input = e.target.closest('[data-cart-quantity]');
    if (!input) return;
    const line = parseInt(input.dataset.line, 10);
    const qty = parseInt(input.value, 10);
    input.closest('.cart-item, .cart-page__row')?.classList.add('loading');
    await Cart.change(line, qty);
    const state = await Cart.getState();
    updateCartCount(state.item_count);
    await refreshCartDrawer();
    await refreshCartPage();
  });
  document.addEventListener('click', async (e) => {
    const remove = e.target.closest('[data-cart-remove]');
    if (!remove) return;
    e.preventDefault();
    const line = parseInt(remove.dataset.line, 10);
    await Cart.change(line, 0);
    const state = await Cart.getState();
    updateCartCount(state.item_count);
    await refreshCartDrawer();
    await refreshCartPage();
  });
  document.addEventListener('change', (e) => {
    const note = e.target.closest('[data-cart-note]');
    if (note) Cart.updateNote(note.value);
  });

  /* -------------------------------------------------------------------------
     Predictive search
     ------------------------------------------------------------------------- */
  class PredictiveSearch extends HTMLElement {
    constructor() {
      super();
      this.input = this.querySelector('input[type="search"]');
      this.results = this.querySelector('[data-predictive-results]');
      this.timeout = null;
      if (this.input) {
        this.input.addEventListener('input', this.onInput.bind(this));
        this.input.addEventListener('focus', this.onInput.bind(this));
      }
      document.addEventListener('click', (e) => {
        if (!this.contains(e.target) && this.results) this.results.hidden = true;
      });
    }
    onInput() {
      clearTimeout(this.timeout);
      const q = this.input.value.trim();
      if (q.length < 2) { if (this.results) this.results.hidden = true; return; }
      this.timeout = setTimeout(() => this.search(q), 250);
    }
    async search(q) {
      const params = new URLSearchParams({
        q,
        'resources[type]': 'product,collection,page',
        'resources[limit]': '6',
        'section_id': 'predictive-search'
      });
      try {
        const res = await fetch(`${window.routes.predictive_search_url}?${params}`);
        const text = await res.text();
        const html = new DOMParser().parseFromString(text, 'text/html');
        const inner = html.querySelector('[data-predictive-inner]');
        if (inner && this.results) {
          this.results.innerHTML = inner.innerHTML;
          this.results.hidden = false;
        }
      } catch (err) { /* silent */ }
    }
  }
  customElements.define('predictive-search', PredictiveSearch);

  /* -------------------------------------------------------------------------
     Facets (collection filtering) — AJAX render
     ------------------------------------------------------------------------- */
  class FacetFilters extends HTMLElement {
    constructor() {
      super();
      this.form = this.querySelector('form');
      this.sectionId = this.dataset.section;
      if (this.form) {
        this.form.addEventListener('input', this.debounce(this.onChange.bind(this), 400));
        this.form.addEventListener('change', (e) => {
          if (e.target.matches('select, input[type="checkbox"]')) this.onChange();
        });
      }
      // mobile toggle
      this.facetsPanel = this.querySelector('.facets');
      this.overlay = this.querySelector('.facets__overlay');
      document.addEventListener('click', (e) => {
        if (e.target.closest('[data-facets-open]')) { this.facetsPanel?.classList.add('active'); this.overlay?.classList.add('active'); lockScroll(true); }
        if (e.target.closest('[data-facets-close]') || e.target === this.overlay) { this.facetsPanel?.classList.remove('active'); this.overlay?.classList.remove('active'); lockScroll(false); }
      });
      // sort select outside form
      const sort = document.querySelector('[data-sort-by]');
      if (sort) sort.addEventListener('change', () => this.onSort(sort.value));
      // active facet removal + clear all
      document.addEventListener('click', (e) => {
        const clear = e.target.closest('[data-facet-remove]');
        if (clear) { e.preventDefault(); this.renderFromUrl(clear.getAttribute('href')); }
      });
    }
    debounce(fn, wait) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), wait); }; }
    onSort(value) {
      const url = new URL(window.location);
      url.searchParams.set('sort_by', value);
      url.searchParams.delete('page');
      this.renderFromUrl(url.toString());
    }
    onChange() {
      const params = new URLSearchParams(new FormData(this.form));
      const url = new URL(window.location);
      const sort = url.searchParams.get('sort_by');
      const base = url.pathname + '?' + params.toString() + (sort ? `&sort_by=${sort}` : '');
      this.renderFromUrl(base);
    }
    async renderFromUrl(url) {
      const results = document.getElementById('ProductGridContainer');
      if (results) results.classList.add('loading');
      const fetchUrl = url + (url.includes('?') ? '&' : '?') + 'section_id=' + this.sectionId;
      const res = await fetch(fetchUrl);
      const text = await res.text();
      const html = new DOMParser().parseFromString(text, 'text/html');
      ['#ProductGridContainer', '[data-facets-inner]', '[data-active-facets]', '[data-collection-count]'].forEach((sel) => {
        const fresh = html.querySelector(sel);
        const current = document.querySelector(sel);
        if (fresh && current) current.innerHTML = fresh.innerHTML;
      });
      if (results) results.classList.remove('loading');
      window.history.pushState({}, '', url);
    }
  }
  customElements.define('facet-filters', FacetFilters);

  window.addEventListener('popstate', () => {
    const ff = document.querySelector('facet-filters');
    if (ff) ff.renderFromUrl(window.location.href);
  });

  /* -------------------------------------------------------------------------
     Load more / infinite pagination (optional button)
     ------------------------------------------------------------------------- */
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-load-more]');
    if (!btn) return;
    e.preventDefault();
    btn.classList.add('loading');
    const res = await fetch(btn.href + (btn.href.includes('?') ? '&' : '?') + 'section_id=' + btn.dataset.section);
    const text = await res.text();
    const html = new DOMParser().parseFromString(text, 'text/html');
    const newItems = html.querySelector('[data-product-grid]');
    const grid = document.querySelector('[data-product-grid]');
    if (newItems && grid) grid.insertAdjacentHTML('beforeend', newItems.innerHTML);
    const newBtn = html.querySelector('[data-load-more]');
    const wrap = btn.closest('[data-load-more-wrap]');
    if (newBtn) { btn.href = newBtn.href; btn.classList.remove('loading'); }
    else if (wrap) wrap.remove();
  });

  /* -------------------------------------------------------------------------
     Product media gallery
     ------------------------------------------------------------------------- */
  document.addEventListener('click', (e) => {
    const thumb = e.target.closest('[data-thumb]');
    if (!thumb) return;
    const gallery = thumb.closest('[data-media-gallery]');
    const main = gallery.querySelector('[data-main-media] img');
    if (main) {
      main.src = thumb.dataset.mediaSrc;
      main.srcset = '';
    }
    gallery.querySelectorAll('[data-thumb]').forEach((t) => t.classList.remove('active'));
    thumb.classList.add('active');
  });

  /* -------------------------------------------------------------------------
     Slideshow
     ------------------------------------------------------------------------- */
  class SlideShow extends HTMLElement {
    constructor() {
      super();
      this.track = this.querySelector('.slideshow__track');
      this.slides = Array.from(this.querySelectorAll('.slideshow__slide'));
      this.dots = Array.from(this.querySelectorAll('.slideshow__dot'));
      this.index = 0;
      this.autoplay = this.dataset.autoplay === 'true';
      this.interval = parseInt(this.dataset.speed || '6', 10) * 1000;
      if (this.slides.length <= 1) return;
      this.querySelector('.slideshow__arrow--next')?.addEventListener('click', () => this.go(this.index + 1));
      this.querySelector('.slideshow__arrow--prev')?.addEventListener('click', () => this.go(this.index - 1));
      this.dots.forEach((d, i) => d.addEventListener('click', () => this.go(i)));
      if (this.autoplay) this.start();
      this.addEventListener('mouseenter', () => this.stop());
      this.addEventListener('mouseleave', () => { if (this.autoplay) this.start(); });
    }
    go(i) {
      this.index = (i + this.slides.length) % this.slides.length;
      this.track.style.transform = `translateX(-${this.index * 100}%)`;
      this.dots.forEach((d, di) => d.classList.toggle('active', di === this.index));
    }
    start() { this.stop(); this.timer = setInterval(() => this.go(this.index + 1), this.interval); }
    stop() { clearInterval(this.timer); }
  }
  customElements.define('slide-show', SlideShow);

  /* -------------------------------------------------------------------------
     Sticky header on scroll
     ------------------------------------------------------------------------- */
  const header = document.querySelector('[data-sticky-header]');
  if (header) {
    let last = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      header.classList.toggle('is-scrolled', y > 60);
      last = y;
    }, { passive: true });
  }

  /* -------------------------------------------------------------------------
     Cart notification popup (cart_type == notification)
     ------------------------------------------------------------------------- */
  document.addEventListener('cart:notify', async () => {
    const note = document.getElementById('CartNotification');
    if (!note) return;
    const res = await fetch(`${window.routes.cart_url}?section_id=cart-notification`);
    const text = await res.text();
    const html = new DOMParser().parseFromString(text, 'text/html');
    const fresh = html.querySelector('#CartNotification .cart-notification__inner');
    const cur = note.querySelector('.cart-notification__inner');
    if (fresh && cur) cur.replaceWith(fresh);
    note.classList.add('active');
    clearTimeout(note._t);
    note._t = setTimeout(() => note.classList.remove('active'), 5000);
  });

  /* -------------------------------------------------------------------------
     Scroll-reveal animations (progressive enhancement — safe if unsupported)
     ------------------------------------------------------------------------- */
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function revealObserver() {
    return new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  }

  function setupReveal(root) {
    if (reduceMotion || !('IntersectionObserver' in window)) return;
    const io = revealObserver();
    const scope = root || document;

    // Staggered children inside grids/rows
    scope.querySelectorAll('.product-grid, .collection-list, .trust-bar, .multicolumn').forEach((group) => {
      Array.from(group.children).forEach((child, i) => {
        if (child.classList.contains('reveal')) return;
        child.classList.add('reveal');
        child.style.transitionDelay = Math.min(i * 55, 330) + 'ms';
        io.observe(child);
      });
    });

    // Standalone blocks
    scope.querySelectorAll('.section-header, .section-title-center, .image-with-text__content, .image-with-text__media, .rich-text .rte, .newsletter__inner, .slideshow .slide__content, .featured-collection__viewall').forEach((el) => {
      if (el.classList.contains('reveal')) return;
      el.classList.add('reveal');
      io.observe(el);
    });
  }

  if (document.readyState !== 'loading') setupReveal();
  else document.addEventListener('DOMContentLoaded', () => setupReveal());

  // Re-run for sections added/edited in the theme editor
  document.addEventListener('shopify:section:load', (e) => setupReveal(e.target));

})();
