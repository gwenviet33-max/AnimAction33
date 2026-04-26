// presta-flags.js — shared enable/disable for optional prestations
// Default: only "anniversaires" is shown. Mariages/EVG/Team are hidden until admin enables them.
// Storage key: aa_presta_flags = {"mariages":false,"evg":false,"team":false}

(function(){
  const KEY = "aa_presta_flags";
  const DEFAULTS = { mariages: false, evg: false, team: false };

  function read(){
    try { return Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem(KEY) || "{}")); }
    catch(e){ return Object.assign({}, DEFAULTS); }
  }
  function write(flags){
    localStorage.setItem(KEY, JSON.stringify(flags));
    document.dispatchEvent(new CustomEvent("aa-presta-flags-change", { detail: flags }));
  }
  function set(name, on){
    const f = read(); f[name] = !!on; write(f); return f;
  }

  // Hide disabled cards/links on homepage and other public pages
  function applyToDocument(){
    const f = read();
    document.querySelectorAll("[data-presta]").forEach(el=>{
      const k = el.dataset.presta;
      if(k in f){
        el.style.display = f[k] ? "" : "none";
      }
    });
  }

  // Page-level lock: if the current page corresponds to a disabled presta,
  // overlay a soft "coming soon" banner with a back-to-home link.
  // Pages opt in by setting <body data-presta-page="mariages|evg|team">.
  function lockPageIfDisabled(){
    const tag = document.body.dataset.prestaPage;
    if(!tag) return;
    const f = read();
    const enabled = !!f[tag];
    let lock = document.getElementById("aa-presta-lock");
    if(!enabled){
      if(!lock){
        lock = document.createElement("div");
        lock.id = "aa-presta-lock";
        lock.innerHTML = `
          <style>
            #aa-presta-lock{position:fixed;inset:0;z-index:99998;background:rgba(8,8,16,.86);
              backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
              display:flex;align-items:center;justify-content:center;padding:24px;font-family:"Figtree",system-ui,sans-serif}
            #aa-presta-lock .ppl-card{max-width:520px;background:#fff;color:#0F1B3D;
              border-radius:24px;padding:38px 36px;text-align:center;
              box-shadow:0 30px 80px rgba(0,0,0,.4)}
            #aa-presta-lock .ppl-tag{display:inline-block;font-size:11px;letter-spacing:3px;
              text-transform:uppercase;color:#E8252C;font-weight:700;margin-bottom:18px;
              padding:6px 14px;border:2px solid #E8252C;border-radius:999px}
            #aa-presta-lock h2{font-family:"Archivo Black","Arial Black",sans-serif;
              font-size:38px;line-height:1;margin:0 0 14px;text-transform:uppercase}
            #aa-presta-lock p{font-size:16px;color:#0F1B3D;opacity:.7;line-height:1.55;margin-bottom:24px}
            #aa-presta-lock .ppl-row{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
            #aa-presta-lock a.ppl-btn{display:inline-block;padding:12px 22px;
              border-radius:999px;font-weight:700;font-size:14px;letter-spacing:.5px;
              text-transform:uppercase;text-decoration:none;border:2px solid #0F1B3D}
            #aa-presta-lock a.primary{background:#FFC91F;color:#0F1B3D;box-shadow:4px 4px 0 0 #0F1B3D}
            #aa-presta-lock a.ghost{background:#fff;color:#0F1B3D}
          </style>
          <div class="ppl-card">
            <span class="ppl-tag">● BIENTÔT</span>
            <h2>Cette prestation arrive bientôt</h2>
            <p>On finalise les derniers détails. En attendant, jetez un œil aux prestations déjà disponibles ou contactez-nous directement.</p>
            <div class="ppl-row">
              <a class="ppl-btn primary" href="Homepage.html">← Retour à l'accueil</a>
              <a class="ppl-btn ghost" href="Contact.html">Nous contacter</a>
            </div>
          </div>`;
        document.body.appendChild(lock);
      }
    } else if (lock) {
      lock.remove();
    }
  }

  function init(){
    applyToDocument();
    lockPageIfDisabled();
    document.addEventListener("aa-presta-flags-change", ()=>{
      applyToDocument(); lockPageIfDisabled();
    });
    // React to changes from another tab (admin in another window)
    window.addEventListener("storage", e=>{
      if(e.key === KEY){ applyToDocument(); lockPageIfDisabled(); }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.AA_presta = { read, write, set, KEY };
})();
