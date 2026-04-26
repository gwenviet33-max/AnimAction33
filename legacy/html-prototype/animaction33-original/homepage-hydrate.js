/**
 * Homepage hydrator — reads aaStore and rewrites editable zones.
 * Loaded after admin-store.js. Re-runs on storage events (cross-tab).
 */
(function () {
  if (!window.aaStore) {
    console.warn("homepage-hydrate: aaStore missing");
    return;
  }
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => [...(root || document).querySelectorAll(sel)];
  const escapeHtml = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // ----- HERO TEXT -----
  function hydrateHero(h = aaStore.get("hero")) {
    const pill = $('[data-aa="hero.pill"]');
    if (pill) pill.textContent = h.pill;
    const title = $('[data-aa="hero.title"]');
    if (title) {
      title.innerHTML = `${escapeHtml(h.title_l1)}<span class="line2">${escapeHtml(h.title_l2)} <span class="accent-red">${escapeHtml(h.title_l2_accent)}</span></span>`;
    }
    const sub = $('[data-aa="hero.sub"]');
    if (sub) sub.innerHTML = escapeHtml(h.sub).replace(/\n/g, "<br/>");
    const cta1 = $('[data-aa="hero.cta_primary"]');
    if (cta1) cta1.textContent = h.cta_primary;
    const cta2 = $('[data-aa="hero.cta_secondary"]');
    if (cta2) cta2.textContent = h.cta_secondary;
  }

  // ----- STATS (hero + block) -----
  function hydrateHeroStats(stats = aaStore.get("stats")) {
    const wrap = $('[data-aa-section="stats.hero"]');
    if (!wrap) return;
    wrap.innerHTML = stats.hero.map(s => {
      const num = isFinite(parseInt(s.value, 10))
        ? `<span class="n" data-count="${escapeHtml(s.value)}" data-suffix="${escapeHtml(s.suffix || "")}">0</span>`
        : `<span class="n">${escapeHtml(s.value)}${escapeHtml(s.suffix || "")}</span>`;
      return `<div class="hero-stat">${num}<span class="l">${escapeHtml(s.label)}</span></div>`;
    }).join("");
  }
  function hydrateBlockStats(stats = aaStore.get("stats")) {
    const wrap = $('[data-aa-section="stats.block"]');
    if (!wrap) return;
    wrap.innerHTML = stats.block.map((s, i) => {
      const cls = i === 0 ? "reveal" : `reveal d${i}`;
      const isNum = isFinite(parseInt(s.value, 10)) && /^[\d\s]+$/.test(s.value);
      const inner = isNum
        ? `<span data-count="${escapeHtml(s.value)}" data-suffix="${escapeHtml(s.suffix || "")}">0</span>`
        : `${escapeHtml(s.value)}${escapeHtml(s.suffix || "")}`;
      const fontStyle = !isNum && s.value.length > 5 ? ' style="font-size: clamp(30px, 3.5vw, 44px)"' : "";
      return `<div class="${cls}"><div class="stat-big"${fontStyle}>${inner}</div><div class="stat-label">${escapeHtml(s.label)}</div></div>`;
    }).join("");
  }
  function hydrateStats(stats = aaStore.get("stats")) {
    hydrateHeroStats(stats);
    hydrateBlockStats(stats);
  }

  // ----- MARQUEE -----
  function hydrateMarquee(items = aaStore.get("marquee")) {
    const track = $('[data-aa-section="marquee"]');
    if (!track) return;
    const html = items.map(t => `<span>${escapeHtml(t)}</span>`).join("");
    track.innerHTML = html + html; // duplicate for seamless loop
  }

  // ----- PRESTATIONS CARDS -----
  function hydratePrestations(items = aaStore.get("prestations")) {
    const grid = $('[data-aa-section="prestations"]');
    if (!grid) return;
    grid.innerHTML = items.map((p, i) => {
      const cls = `presta-card c${(i % 6) + 1} reveal${i > 0 ? ` d${Math.min(i, 2)}` : ""}`;
      const isLink = !!p.href;
      const tag = isLink ? "a" : "div";
      const hrefAttr = isLink ? ` href="${escapeHtml(p.href)}"` : "";
      const dataPresta = p.key && p.key !== "anniversaires" ? ` data-presta="${escapeHtml(p.key)}"` : "";
      return `<${tag} class="${cls}"${hrefAttr}${dataPresta}>
        <div>
          <span class="emoji">${escapeHtml(p.emoji)}</span>
          <h3>${escapeHtml(p.title)}</h3>
          <p>${escapeHtml(p.desc)}</p>
        </div>
        <div class="presta-foot"><span class="presta-price">${escapeHtml(p.price)}</span><span class="presta-arrow">→</span></div>
      </${tag}>`;
    }).join("");
  }

  // ----- GAMES CATALOG -----
  function hydrateGames(items = aaStore.get("games")) {
    const scroll = $('[data-aa-section="games"]');
    if (!scroll) return;
    scroll.innerHTML = items.map(g => `
      <div class="game-card">
        <span class="emoji">${escapeHtml(g.emoji)}</span>
        <span class="cat">${escapeHtml(g.cat)}</span>
        <h4>${escapeHtml(g.name)}</h4>
        <div class="players">${escapeHtml(g.players)}</div>
      </div>`).join("");
  }

  // ----- TESTIMONIALS -----
  function hydrateTestimonials(items = aaStore.get("testimonials")) {
    const grid = $('[data-aa-section="testimonials"]');
    if (!grid) return;
    grid.innerHTML = items.map((t, i) => {
      const cls = i === 0 ? "testi-card reveal" : `testi-card reveal d${i}`;
      const stars = "★".repeat(Math.max(1, Math.min(5, t.stars || 5)));
      return `<div class="${cls}"><div class="stars">${stars}</div><p>« ${escapeHtml(t.text)} »</p></div>`;
    }).join("");
  }

  // ----- FAQ -----
  function hydrateFaq(items = aaStore.get("faq")) {
    const list = $('[data-aa-section="faq"]');
    if (!list) return;
    list.innerHTML = items.map(f => `
      <div class="faq-item reveal">
        <div class="faq-q">${escapeHtml(f.q)} <span class="faq-toggle">+</span></div>
        <div class="faq-a"><p>${escapeHtml(f.a)}</p></div>
      </div>`).join("");
    // Re-bind toggle
    list.querySelectorAll(".faq-item").forEach(item => {
      item.querySelector(".faq-q").addEventListener("click", () => item.classList.toggle("open"));
    });
  }

  // ----- CONTACT -----
  function hydrateContact(c = aaStore.get("contact")) {
    const phoneTop = $('[data-aa="contact.phone"]');
    if (phoneTop) {
      phoneTop.textContent = `📞 ${c.phone}`;
      phoneTop.href = `tel:${c.phone_raw || c.phone.replace(/\s/g, "")}`;
    }
    const phoneLine = $('[data-aa="contact.phone_line"]');
    if (phoneLine) phoneLine.textContent = `📞 ${c.phone}`;
    const emailLine = $('[data-aa="contact.email_line"]');
    if (emailLine) emailLine.textContent = `✉️ ${c.email}`;
    const zoneLine = $('[data-aa="contact.zone_line"]');
    if (zoneLine) zoneLine.textContent = `📍 ${c.zone}`;
  }

  // ----- DRIVE -----
  function hydrateAll() {
    hydrateHero();
    hydrateStats();
    hydrateMarquee();
    hydratePrestations();
    hydrateGames();
    hydrateTestimonials();
    hydrateFaq();
    hydrateContact();
    if (typeof window.AA_revealScan === "function") window.AA_revealScan();
    if (typeof window.AA_animateCounters === "function") window.AA_animateCounters();
  }

  // First pass
  hydrateAll();
  // Re-apply presta-flags after hydration (new nodes need the visibility logic)
  document.dispatchEvent(new CustomEvent("aa-presta-flags-change"));

  // Subscribe to changes (live update when admin saves)
  function postHydrate() {
    if (typeof window.AA_revealScan === "function") window.AA_revealScan();
    if (typeof window.AA_animateCounters === "function") window.AA_animateCounters();
  }
  aaStore.onChange("hero", (v) => { hydrateHero(v); postHydrate(); });
  aaStore.onChange("stats", (v) => { hydrateStats(v); postHydrate(); });
  aaStore.onChange("marquee", hydrateMarquee);
  aaStore.onChange("prestations", (v) => {
    hydratePrestations(v);
    document.dispatchEvent(new CustomEvent("aa-presta-flags-change"));
    postHydrate();
  });
  aaStore.onChange("games", hydrateGames);
  aaStore.onChange("testimonials", (v) => { hydrateTestimonials(v); postHydrate(); });
  aaStore.onChange("faq", (v) => { hydrateFaq(v); postHydrate(); });
  aaStore.onChange("contact", hydrateContact);

  // Expose for debugging
  window.AA_hydrate = hydrateAll;
})();
