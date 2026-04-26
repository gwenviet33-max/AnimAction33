// tweaks-brand.jsx — Shared Tweaks panel for brand pages (Homepage, Anniversaires, Contact, Admin)
// Drives the :root tokens defined in styles.css

(function(){
  function mountBrandTweaks(defaults){
    const TWEAK_DEFAULTS = defaults;

    function App(){
      const [t,setT] = useTweaks(TWEAK_DEFAULTS);

      React.useEffect(()=>{
        const r = document.documentElement.style;
        r.setProperty("--blue",t.blue);
        r.setProperty("--red",t.red);
        r.setProperty("--yellow",t.yellow);
        r.setProperty("--ink",t.ink);
        r.setProperty("--paper",t.paper);
        r.setProperty("--cream",t.cream);
        r.setProperty("--font-display",`"${t.fontDisplay}", "Arial Black", sans-serif`);
        r.setProperty("--font-body",`"${t.fontBody}", system-ui, sans-serif`);
        r.setProperty("--font-hand",`"${t.fontHand}", cursive`);
        r.setProperty("--radius-sm",t.radiusSm+"px");
        r.setProperty("--radius",t.radius+"px");
        r.setProperty("--radius-lg",t.radiusLg+"px");
        const ink = t.ink;
        r.setProperty("--shadow-sm",`${t.shadowSm}px ${t.shadowSm}px 0 0 ${ink}`);
        r.setProperty("--shadow",`${t.shadow}px ${t.shadow}px 0 0 ${ink}`);
        r.setProperty("--shadow-lg",`${t.shadowLg}px ${t.shadowLg}px 0 0 ${ink}`);
        r.setProperty("--shadow-xl",`${t.shadowXl}px ${t.shadowXl}px 0 0 ${ink}`);
        r.setProperty("--border",`${t.border}px solid ${ink}`);
        r.setProperty("--border-thick",`${t.border+1}px solid ${ink}`);
        r.setProperty("--border-thicker",`${t.border+2}px solid ${ink}`);
        document.body.style.fontSize = t.bodySize+"px";
      },[t]);

      function applyPreset(name){
        const presets = {
          "Original":   {blue:"#1C5FD8",red:"#E8252C",yellow:"#FFC91F",ink:"#0F1B3D",paper:"#FFFDF6",cream:"#FFF5D6"},
          "Sunshine":   {blue:"#FF6B35",red:"#E63946",yellow:"#FFD23F",ink:"#1A1A2E",paper:"#FFF8E7",cream:"#FFE8C8"},
          "Mint Pop":   {blue:"#00B4A6",red:"#FF4D6D",yellow:"#FFE66D",ink:"#0D2818",paper:"#F0FFF4",cream:"#E0F5E9"},
          "Lavender":   {blue:"#7B5EA7",red:"#FF7E5F",yellow:"#FED5A8",ink:"#2D1B4E",paper:"#FAF6FF",cream:"#F0E5FF"},
          "Mono Bold":  {blue:"#000000",red:"#FF0000",yellow:"#FFEE00",ink:"#000000",paper:"#FFFFFF",cream:"#F5F5F5"},
          "Pastel":     {blue:"#A8D5E2",red:"#F9A1BC",yellow:"#FFE5A0",ink:"#3E3A4A",paper:"#FFFCF5",cream:"#FFF0E0"},
          "Vintage":    {blue:"#3E5C76",red:"#C44536",yellow:"#E9B824",ink:"#1B2D40",paper:"#F5EFE0",cream:"#EBE0C5"},
          "Acid":       {blue:"#39FF14",red:"#FF10F0",yellow:"#FAFF00",ink:"#000000",paper:"#FFFFFF",cream:"#E0FFE0"},
        };
        const p = presets[name]; if(!p) return;
        setT("preset",name);
        Object.entries(p).forEach(([k,v])=>setT(k,v));
      }

      return (
        <TweaksPanel title="Tweaks · Brand">
          <TweakSection label="Preset palette" />
          <TweakSelect label="Palette" value={t.preset||"Original"} options={["Original","Sunshine","Mint Pop","Lavender","Mono Bold","Pastel","Vintage","Acid"]} onChange={applyPreset}/>

          <TweakSection label="Couleurs" />
          <TweakColor label="Bleu" value={t.blue} onChange={v=>setT("blue",v)}/>
          <TweakColor label="Rouge" value={t.red} onChange={v=>setT("red",v)}/>
          <TweakColor label="Jaune" value={t.yellow} onChange={v=>setT("yellow",v)}/>
          <TweakColor label="Encre" value={t.ink} onChange={v=>setT("ink",v)}/>
          <TweakColor label="Papier" value={t.paper} onChange={v=>setT("paper",v)}/>
          <TweakColor label="Crème" value={t.cream} onChange={v=>setT("cream",v)}/>

          <TweakSection label="Typographie" />
          <TweakSelect label="Display" value={t.fontDisplay} options={["Archivo Black","Bungee","Bungee Shade","Rubik Mono One","Anton","Bebas Neue","Druk Wide","Space Grotesk"]} onChange={v=>setT("fontDisplay",v)}/>
          <TweakSelect label="Body" value={t.fontBody} options={["Figtree","Inter","Space Grotesk","DM Sans","Manrope","Work Sans"]} onChange={v=>setT("fontBody",v)}/>
          <TweakSelect label="Hand" value={t.fontHand} options={["Caveat Brush","Caveat","Permanent Marker","Shadows Into Light","Kalam","Patrick Hand"]} onChange={v=>setT("fontHand",v)}/>
          <TweakSlider label="Taille body" value={t.bodySize} min={12} max={22} unit="px" onChange={v=>setT("bodySize",v)}/>

          <TweakSection label="Forme" />
          <TweakSlider label="Radius S" value={t.radiusSm} min={0} max={40} unit="px" onChange={v=>setT("radiusSm",v)}/>
          <TweakSlider label="Radius M" value={t.radius} min={0} max={50} unit="px" onChange={v=>setT("radius",v)}/>
          <TweakSlider label="Radius L" value={t.radiusLg} min={0} max={60} unit="px" onChange={v=>setT("radiusLg",v)}/>
          <TweakSlider label="Bordure" value={t.border} min={0} max={8} unit="px" onChange={v=>setT("border",v)}/>

          <TweakSection label="Ombres brutalistes" />
          <TweakSlider label="Shadow S" value={t.shadowSm} min={0} max={20} unit="px" onChange={v=>setT("shadowSm",v)}/>
          <TweakSlider label="Shadow M" value={t.shadow} min={0} max={24} unit="px" onChange={v=>setT("shadow",v)}/>
          <TweakSlider label="Shadow L" value={t.shadowLg} min={0} max={30} unit="px" onChange={v=>setT("shadowLg",v)}/>
          <TweakSlider label="Shadow XL" value={t.shadowXl} min={0} max={40} unit="px" onChange={v=>setT("shadowXl",v)}/>
        </TweaksPanel>
      );
    }

    const mount = document.createElement("div");
    mount.id = "tweaks-mount";
    document.body.appendChild(mount);
    ReactDOM.createRoot(mount).render(<App/>);
  }

  window.mountBrandTweaks = mountBrandTweaks;
})();
