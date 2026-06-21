/* Collector League shared UI kit — design tokens + the fantastical holographic card component.
 * Loaded by every iframe. Injects the stylesheet and exposes window.CL.
 * The card shows the FULL real card image (object-fit:contain, never clipped) inside an ornate
 * rarity-colored holographic frame, with rarity + grade + value as overlays. */
(function () {
  var CSS = [
    "@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Inter:wght@400;600;700;800&display=swap');",
    ":root{--ink:#2a1f28;--gold:#FFCB05;--red:#E3350D;--cyan:#30D0E0}",
    "*{box-sizing:border-box}",
    "html,body{margin:0;background:transparent!important;font-family:Inter,system-ui,Arial,sans-serif;color:var(--ink);-webkit-font-smoothing:antialiased}",
    ".cl-mono{font-variant-numeric:tabular-nums}",
    ".cl-panel{position:relative;background:radial-gradient(120% 90% at 50% 0%,#fff 0%,#fff0f4 55%,#ffe2ec 100%);border-radius:22px;box-shadow:0 18px 50px rgba(227,53,13,.26),0 0 0 3px var(--gold),0 0 0 6px #ffe9a0;overflow:hidden}",
    ".cl-panel:before{content:'';position:absolute;inset:0;pointer-events:none;background:radial-gradient(40% 30% at 12% 8%,rgba(48,208,224,.16),transparent 60%),radial-gradient(42% 32% at 92% 4%,rgba(160,64,192,.12),transparent 60%)}",
    ".cl-bar{position:relative;background:linear-gradient(160deg,#ff5a2a,#E3350D 60%,#b5260a);color:#fff;padding:13px 18px;display:flex;align-items:center;justify-content:space-between;gap:8px;box-shadow:inset 0 -3px 0 rgba(0,0,0,.18),inset 0 2px 0 rgba(255,255,255,.35)}",
    ".cl-bar:after{content:'';position:absolute;left:0;right:0;top:0;height:50%;background:linear-gradient(rgba(255,255,255,.26),transparent);pointer-events:none}",
    ".cl-bar .t{font-family:'Baloo 2';font-weight:800;font-size:19px;letter-spacing:.5px;text-shadow:0 2px 4px rgba(0,0,0,.3);position:relative}",
    ".cl-bar .s{font-size:12px;opacity:.95;font-weight:800;position:relative}",
    /* CARD — ornate frame, FULL image (contain), overlays */
    ".cl-card{position:relative;aspect-ratio:5/7;border-radius:15px;padding:5px;display:flex;background:linear-gradient(155deg,var(--fr1,#eef1f5),var(--fr2,#8A94A6));box-shadow:0 12px 26px rgba(0,0,0,.28),inset 0 0 0 2px rgba(255,255,255,.55),inset 0 0 14px rgba(255,255,255,.2)}",
    ".cl-card:before{content:'';position:absolute;inset:-5px;z-index:-1;border-radius:21px;background:radial-gradient(62% 58% at 50% 36%,var(--glow,transparent),transparent 72%);filter:blur(10px)}",
    ".cl-card .art{position:relative;flex:1;border-radius:10px;overflow:hidden;background:radial-gradient(120% 90% at 50% 30%,#2a2330,#0f0c0a);box-shadow:inset 0 0 0 2px rgba(0,0,0,.45)}",
    ".cl-card .art img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block}",
    ".cl-card .holo{position:absolute;inset:0;pointer-events:none;mix-blend-mode:color-dodge;opacity:.5;background:linear-gradient(115deg,transparent 30%,rgba(255,0,170,.5),rgba(0,210,255,.5),rgba(255,235,0,.5),rgba(0,255,140,.5),transparent 70%);background-size:280% 280%;animation:clholo 4.5s linear infinite}",
    "@keyframes clholo{0%{background-position:0 0}100%{background-position:280% 280%}}",
    ".cl-card .spk{position:absolute;inset:0;pointer-events:none;background-image:radial-gradient(1.6px 1.6px at 22% 28%,#fff,transparent),radial-gradient(1.6px 1.6px at 68% 58%,#fff,transparent),radial-gradient(2px 2px at 45% 82%,#fff,transparent),radial-gradient(1.4px 1.4px at 82% 22%,#fff,transparent);animation:clspk 3s ease-in-out infinite}",
    "@keyframes clspk{0%,100%{opacity:0}50%{opacity:.95}}",
    ".cl-card .ov{position:absolute;z-index:3;font-family:'Baloo 2';font-weight:800;text-shadow:0 1px 3px rgba(0,0,0,.55)}",
    ".cl-card .ov.rar{top:7px;left:7px;font-size:10.5px;letter-spacing:.6px;text-transform:uppercase;color:#fff;background:rgba(0,0,0,.6);border:1px solid var(--rar,#888);border-radius:8px;padding:2px 8px}",
    ".cl-card .ov.grd{top:7px;right:7px;font-size:10px;color:#fff;background:rgba(0,0,0,.55);border-radius:8px;padding:2px 7px}",
    ".cl-card .ov.val{bottom:8px;left:50%;transform:translateX(-50%);font-size:15px;color:#3a2600;background:linear-gradient(#ffe07a,#e0922a);border-radius:10px;padding:3px 13px;box-shadow:0 2px 7px rgba(0,0,0,.35);text-shadow:none;white-space:nowrap}",
    ".cl-card .ov.cap{bottom:8px;left:7px;right:7px;text-align:center;font-size:12px;color:#fff;background:rgba(0,0,0,.45);border-radius:8px;padding:3px 6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    ".cl-card .mono{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:'Baloo 2';font-weight:800;font-size:46%;color:rgba(255,255,255,.92)}",
    ".cl-card .mono span{width:1.7em;height:1.7em;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.16);border:2px solid rgba(255,255,255,.5)}",
    /* rarity frame palettes */
    ".cl-card.r-EPIC{--fr1:#fff3c4;--fr2:#cf9a1c;--glow:rgba(245,180,0,.9)}",
    ".cl-card.r-RARE{--fr1:#ece0ff;--fr2:#5e34c4;--glow:rgba(122,82,240,.72)}",
    ".cl-card.r-UNCOMMON{--fr1:#d6e6ff;--fr2:#2b62c6;--glow:rgba(59,125,240,.6)}",
    ".cl-card.r-COMMON{--fr1:#f0f3f7;--fr2:#8A94A6;--glow:rgba(138,148,166,.45)}",
    ".cl-card.r-COMMON .holo,.cl-card.r-COMMON .spk,.cl-card.r-UNCOMMON .spk{display:none}",
    ".cl-card.down{background:linear-gradient(155deg,#ff7a4d,#b5260a)}.cl-card.down .art{background:repeating-linear-gradient(45deg,#9e1a28,#9e1a28 14px,#E3350D 14px,#E3350D 28px)}",
    ".cl-card.myst{--fr1:#fff;--fr2:#c9b3bd;--glow:rgba(180,150,170,.4)}",
    /* chips + buttons */
    ".cl-chip{display:inline-flex;align-items:center;gap:6px;border-radius:11px;padding:8px 12px;font-weight:700;font-size:13px;background:#fff;border:2px solid #efd9e0;color:#3a2730;cursor:pointer;transition:transform .08s,box-shadow .1s}",
    ".cl-chip:hover{transform:translateY(-1px);box-shadow:0 4px 10px rgba(0,0,0,.1)}",
    ".cl-chip.on{border-color:var(--red);background:linear-gradient(#fff,#fff4f2);box-shadow:0 3px 0 rgba(227,53,13,.3),0 0 0 1px var(--red) inset}",
    ".cl-chip .dot{width:12px;height:12px;border-radius:50%;background:var(--rar,#ccc);box-shadow:0 0 7px var(--rar,#ccc);flex:none}",
    ".cl-btn{font-family:'Baloo 2';font-weight:800;border:none;border-radius:13px;padding:13px 20px;font-size:15px;cursor:pointer;color:#fff;background:linear-gradient(160deg,#ff5a2a,#E3350D);box-shadow:0 5px 0 #9e2208,0 8px 16px rgba(227,53,13,.35)}",
    ".cl-btn:active{transform:translateY(3px);box-shadow:0 2px 0 #9e2208}",
    ".cl-btn.lg{width:100%;font-size:17px;padding:15px}",
    ".cl-btn:disabled{background:#c9b9bf;box-shadow:0 4px 0 #a99aa1;cursor:not-allowed}",
    ".cl-btn.ghost{background:#fff;color:var(--red);border:2px solid var(--red);box-shadow:0 4px 0 #f3c4ba}"
  ].join("\n");
  var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);

  // Render a card. c = card object (name,img,rarity,rarityKey,rarityColor,valueLabel,grade?). opts:{facedown, ghost, label}
  function card(c, opts) {
    opts = opts || {};
    if (opts.ghost) return '<div class="cl-card myst"><div class="art"><div class="mono"><span>?</span></div><div class="ov cap">' + (opts.label || 'Empty slot') + '</div></div></div>';
    var rar = '#' + (c.rarityColor || '8A94A6');
    if (opts.facedown) return '<div class="cl-card down" style="--rar:' + rar + '"><div class="art"><div class="mono"><span>CL</span></div></div></div>';
    var grd = c.grade ? ('<div class="ov grd">' + c.grade + '</div>') : '';
    var val = c.valueLabel ? ('<div class="ov val">' + c.valueLabel + '</div>') : '';
    return '<div class="cl-card r-' + (c.rarityKey || 'COMMON') + '" style="--rar:' + rar + '">'
      + '<div class="art"><img src="' + c.img + '" alt="' + (c.name || '') + '" loading="lazy"><div class="holo"></div><div class="spk"></div>'
      + '<div class="ov rar">' + (c.rarity || '') + '</div>' + grd + val + '</div></div>';
  }

  var RAR = { EPIC: ['Epic', 'F5B400'], RARE: ['Rare', '7A52F0'], UNCOMMON: ['Uncommon', '3B7DF0'], COMMON: ['Common', '8A94A6'] };
  window.CL = { card: card, RAR: RAR, slate: function () { return window.CL_POOL || window.CL_SLATE || []; } };
})();
