// Minimal modal wiring for service items (dummy data OK)
(function () {
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

  function clear(el) { while (el && el.firstChild) el.removeChild(el.firstChild); }

  function renderSections(container, sections, namePrefix) {
    if (!container) return;
    clear(container);
    const forms = sections || [];
    forms.forEach((sec, idx) => {
      const wrap = document.createElement('div');
      const h = document.createElement('h3');
      h.className = 'section-title';
      h.textContent = sec['section-title'] || '';
      wrap.appendChild(h);
      const type = (sec['section-type'] || 'radio-text').toLowerCase();
      const body = document.createElement('div');
      body.className = (type === 'grid' || type === 'grid-items' || type === 'items') ? 'grid grid-2-4 gap-16' : 'stack sm';
      const name = `${namePrefix}_${idx+1}`;
      const items = sec['section-items'] || [];

      items.forEach((it) => {
        const hasImg = !!(it && (it['img-url'] || it['img']));
        if (type === 'grid' || type === 'grid-items' || type === 'items') {
          // Card with optional counter, matches previous design
          const card = document.createElement('div');
          card.className = 'item-card text-center';
          const img = document.createElement('img');
          img.className = 'avatar-round';
          img.src = (it['img-url'] || it['img'] || 'https://placehold.co/150x150/e2e8f0/666');
          img.alt = (it['text'] || '');
          const p = document.createElement('p');
          p.className = 'item-name';
          p.textContent = it['text'] || '';
          card.appendChild(img);
          card.appendChild(p);

          if (it['countable']) {
            const qty = document.createElement('div');
            qty.className = 'qty';
            const dec = document.createElement('button');
            dec.className = 'btn btn-ghost btn-qty';
            dec.dataset.delta = '-1';
            dec.textContent = '-';
            const span = document.createElement('span');
            span.className = 'qty-val';
            span.textContent = String(it['count'] ?? 0);
            const inc = document.createElement('button');
            inc.className = 'btn btn-ghost btn-qty';
            inc.dataset.delta = '1';
            inc.textContent = '+';
            const unit = document.createElement('span');
            unit.className = 'muted unit';
            unit.textContent = it['unit'] || '';
            qty.appendChild(dec);
            qty.appendChild(span);
            qty.appendChild(inc);
            qty.appendChild(unit);
            card.appendChild(qty);
          }
          body.appendChild(card);
        } else if (type === 'radio-image' || hasImg) {
          const label = document.createElement('label');
          label.className = 'choice-card';
          const input = document.createElement('input');
          input.type = 'radio';
          input.name = name;
          input.className = 'radio';
          const img = document.createElement('img');
          img.className = 'thumb-211';
          img.src = (it['img-url'] || it['img'] || '/images/service-300x200.svg');
          img.alt = (it['text'] || '');
          const span = document.createElement('span');
          span.textContent = it['text'] || '';
          label.appendChild(input);
          label.appendChild(img);
          label.appendChild(span);
          body.appendChild(label);
        } else {
          const label = document.createElement('label');
          label.className = 'choice-row';
          const input = document.createElement('input');
          input.type = 'radio';
          input.name = name;
          input.className = 'radio';
          const span = document.createElement('span');
          span.textContent = (typeof it === 'string') ? it : (it['text'] || '');
          label.appendChild(input);
          label.appendChild(span);
          body.appendChild(label);
        }
      });

      wrap.appendChild(body);
      container.appendChild(wrap);
    });

    // Hook quantity controls
    container.querySelectorAll('.btn-qty').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const root = btn.closest('.qty');
        const span = root && root.querySelector('.qty-val');
        if (!span) return;
        const cur = parseInt(span.textContent || '0', 10) || 0;
        const delta = parseInt(btn.dataset.delta || '0', 10) || 0;
        const next = Math.max(0, cur + delta);
        span.textContent = String(next);
      });
    });
  }

  function openModal(data) {
    const modal = $('#service-modal');
    if (!modal) return;
    const img = $('#modal-image', modal);
    const title = $('#modal-title', modal);
    const formBox = $('#modal-form', modal);

    if (img) img.src = data.image || '/images/service-300x200.svg';
    if (title) title.textContent = data.title || 'サービス詳細（ダミー）';

    // render dynamic form sections if provided
    if (formBox) renderSections(formBox, data.forms, 'form');

    modal.classList.add('open');
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    const modal = $('#service-modal');
    if (!modal) return;
    modal.classList.remove('open');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function openDetails(data) {
    const modal = $('#details-modal');
    if (!modal) return;
    const img = $('#details-modal-image', modal);
    const title = $('#details-modal-title', modal);
    const box = $('#details-form', modal);
    if (img) img.src = data.image || '/images/service-300x200.svg';
    if (title) title.textContent = data.title || 'サービス詳細（ダミー）';
    if (box) renderSections(box, data.details, 'detail');
    modal.classList.add('open');
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeDetails() {
    const modal = $('#details-modal');
    if (!modal) return;
    modal.classList.remove('open');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function openCartAdded(data) {
    const modal = $('#cart-added-modal');
    if (!modal) return;
    const img = $('#cart-added-item-image', modal);
    const title = $('#cart-added-item-title', modal);
    const details = $('#cart-added-item-details', modal);
    if (img) img.src = data.image || '/images/service-300x200.svg';
    if (title) title.textContent = data.title || 'サービス名';
    if (details) details.textContent = '選択内容: ダミー';
    modal.classList.add('open');
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeCartAdded() {
    const modal = $('#cart-added-modal');
    if (!modal) return;
    modal.classList.remove('open');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function init() {
    const modal = $('#service-modal');
    if (!modal) return;

    // Build dataset
    const raw = Array.isArray(window.SERVICE_ITEMS) ? window.SERVICE_ITEMS : [];
    const byId = new Map(raw.map(it => [String(it.id || ''), it]));

    // Open on any service card click (dummy OK)
    $all('.card-service').forEach((card) => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        const match = id ? byId.get(String(id)) : null;
        // Derive fallback data
        const titleEl = card.querySelector('h3');
        const imgEl = card.querySelector('img');
        const fallback = {
          title: titleEl ? titleEl.textContent.trim() : 'サービス詳細（ダミー）',
          image: imgEl ? imgEl.getAttribute('src') : '/images/service-300x200.svg',
        };
        openModal(match || fallback);
      });
    });

    // Close buttons
    const closeBtn = $('#close-modal-btn', modal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    const backBtn = $('#back-modal-btn', modal);
    if (backBtn) backBtn.addEventListener('click', closeModal);

    // Next → Details
    const nextBtn = modal.querySelector('.actions .btn-primary');
    if (nextBtn) nextBtn.addEventListener('click', () => {
      const anyCard = document.querySelector('.card-service');
      const id = anyCard ? anyCard.getAttribute('data-id') : null;
      const match = id ? byId.get(String(id)) : null;
      const title = anyCard ? (anyCard.querySelector('h3')?.textContent || '') : '';
      const image = anyCard ? (anyCard.querySelector('img')?.getAttribute('src') || '') : '';
      const data = match || { title, image };
      closeModal();
      openDetails(data);
    });

    // Details modal events
    const details = $('#details-modal');
    if (details) {
      const closeD = $('#close-details-modal-btn', details);
      if (closeD) closeD.addEventListener('click', closeDetails);
      const backToService = $('#back-to-service-modal-btn', details);
      if (backToService) backToService.addEventListener('click', () => {
        closeDetails();
        const anyCard = document.querySelector('.card-service');
        const title = anyCard ? (anyCard.querySelector('h3')?.textContent || '') : '';
        const image = anyCard ? (anyCard.querySelector('img')?.getAttribute('src') || '') : '';
        openModal({ title, image });
      });
      const addToCart = $('#add-to-cart-btn', details);
      if (addToCart) addToCart.addEventListener('click', () => {
        const anyCard = document.querySelector('.card-service');
        const title = anyCard ? (anyCard.querySelector('h3')?.textContent || '') : '';
        const image = anyCard ? (anyCard.querySelector('img')?.getAttribute('src') || '') : '';
        closeDetails();
        openCartAdded({ title, image });
      });
      details.addEventListener('click', (e) => { if (e.target === details) closeDetails(); });
    }

    // Cart added modal events
    const cartAdded = $('#cart-added-modal');
    if (cartAdded) {
      const closeC = $('#close-cart-added-modal-btn', cartAdded);
      if (closeC) closeC.addEventListener('click', closeCartAdded);
      const cont = $('#continue-shopping-btn', cartAdded);
      if (cont) cont.addEventListener('click', () => { closeCartAdded(); });
      cartAdded.addEventListener('click', (e) => { if (e.target === cartAdded) closeCartAdded(); });
    }

    // Click outside dialog closes
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // ESC closes
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });

    // Category filter tabs
    const tabContainer = document.querySelector('.tabs');
    if (tabContainer) {
      const tabs = $all('.tab', tabContainer);
      const cards = $all('.service-grid .card-service');
      function applyFilter(category) {
        cards.forEach((card) => {
          const c = (card.getAttribute('data-category') || '').trim();
          if (!category || category === 'all' || c === category) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      }
      tabs.forEach((btn) => {
        btn.addEventListener('click', () => {
          tabs.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          const cat = btn.getAttribute('data-category') || 'all';
          applyFilter(cat);
        });
      });
      // default: show all
      applyFilter('all');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
