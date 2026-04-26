/* ============================================================
   AnimAction33 — Shared JS utilities
   ============================================================ */

// ---------- Header scroll shrink ----------
(function () {
  const header = document.querySelector(".aa-header");
  if (!header) return;
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add("shrunk");
    else header.classList.remove("shrunk");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

// ---------- Reveal on scroll ----------
window.AA_revealScan = (function () {
  if (!("IntersectionObserver" in window)) {
    return function () {
      document.querySelectorAll(".reveal").forEach((e) => e.classList.add("in"));
    };
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  function scan() {
    document.querySelectorAll(".reveal").forEach((e) => {
      if (e.dataset.revealBound) return;
      e.dataset.revealBound = "1";
      io.observe(e);
    });
  }
  scan();
  return scan;
})();

// ---------- Counters ----------
window.AA_animateCounters = (function () {
  const animate = (el) => {
    const end = parseInt(el.getAttribute("data-count"), 10);
    const suffix = el.getAttribute("data-suffix") || "";
    const dur = 1400;
    const start = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animate(e.target);
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  function scan() {
    document.querySelectorAll("[data-count]").forEach((c) => {
      if (c.dataset.counterBound) return;
      c.dataset.counterBound = "1";
      io.observe(c);
    });
  }
  scan();
  return scan;
})();

// ---------- WhatsApp popup ----------
(function () {
  const float = document.getElementById("wa-float");
  const popup = document.getElementById("wa-popup");
  if (!float || !popup) return;
  const close = popup.querySelector(".wa-close");
  float.addEventListener("click", (e) => {
    e.preventDefault();
    popup.classList.toggle("open");
  });
  if (close) close.addEventListener("click", () => popup.classList.remove("open"));
})();

// ---------- Confetti burst ----------
window.AA_confetti = function (x, y, n) {
  const colors = ["#E8252C", "#FFC91F", "#1C5FD8", "#0F1B3D", "#FFF5D6"];
  n = n || 60;
  for (let i = 0; i < n; i++) {
    const p = document.createElement("div");
    p.className = "confetti-piece";
    p.style.background = colors[(Math.random() * colors.length) | 0];
    p.style.left = x + "px";
    p.style.top = y + "px";
    document.body.appendChild(p);
    const angle = Math.random() * Math.PI * 2;
    const dist = 120 + Math.random() * 260;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist - 80;
    const rot = (Math.random() - 0.5) * 720;
    p.animate(
      [
        { transform: "translate(0,0) rotate(0)", opacity: 1 },
        { transform: `translate(${dx}px, ${dy + 400}px) rotate(${rot}deg)`, opacity: 0 },
      ],
      { duration: 1500 + Math.random() * 600, easing: "cubic-bezier(.2,.7,.3,1)" }
    ).onfinish = () => p.remove();
  }
};

// ---------- Konami code easter egg ----------
(function () {
  const seq = [
    "ArrowUp","ArrowUp","ArrowDown","ArrowDown",
    "ArrowLeft","ArrowRight","ArrowLeft","ArrowRight",
    "b","a",
  ];
  let i = 0;
  window.addEventListener("keydown", (e) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (k === seq[i]) {
      i++;
      if (i === seq.length) {
        i = 0;
        triggerKonami();
      }
    } else i = k === seq[0] ? 1 : 0;
  });
  function triggerKonami() {
    const mascot = document.querySelector(".hero-mascot");
    if (mascot) {
      mascot.style.animation = "konami-dance 0.6s ease-in-out 6";
    }
    const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    window.AA_confetti(cx, cy, 200);
    showToast("🎉 Konami activé ! Gwen fait la danse du singe !");
    setTimeout(() => { if (mascot) mascot.style.animation = ""; }, 4000);
  }
  // style inject
  const s = document.createElement("style");
  s.textContent = `
    @keyframes konami-dance {
      0%,100% { transform: translateY(0) rotate(-4deg); }
      25%     { transform: translateY(-24px) rotate(6deg); }
      50%     { transform: translateY(0) rotate(-6deg); }
      75%     { transform: translateY(-18px) rotate(4deg); }
    }
    .aa-toast {
      position: fixed; top: 24px; left: 50%; transform: translateX(-50%) translateY(-20px);
      background: var(--ink); color: var(--yellow); border: 3px solid var(--yellow);
      padding: 14px 24px; border-radius: 999px; font-weight: 800; z-index: 9999;
      opacity: 0; transition: opacity .3s, transform .3s;
      box-shadow: 6px 6px 0 0 var(--yellow);
    }
    .aa-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
  `;
  document.head.appendChild(s);
  window.showToast = function (msg, ms) {
    const t = document.createElement("div");
    t.className = "aa-toast";
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add("show"));
    setTimeout(() => {
      t.classList.remove("show");
      setTimeout(() => t.remove(), 400);
    }, ms || 3000);
  };
})();

// ---------- Logo 5-click easter egg ----------
(function () {
  const logos = document.querySelectorAll("[data-logo-click]");
  logos.forEach((logo) => {
    let clicks = 0;
    let timer;
    logo.addEventListener("click", (e) => {
      clicks++;
      clearTimeout(timer);
      timer = setTimeout(() => (clicks = 0), 1500);
      if (clicks === 5) {
        clicks = 0;
        const img = logo.querySelector("img");
        if (img) {
          img.style.transition = "transform .2s";
          img.style.transform = "scale(1.2) rotate(-8deg)";
          setTimeout(() => (img.style.transform = ""), 350);
        }
        showToast("🐵 Bien joué 😉");
        const rect = logo.getBoundingClientRect();
        window.AA_confetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 40);
      }
    });
  });
})();
