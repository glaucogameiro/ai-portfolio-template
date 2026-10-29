(() => {
  "use strict";
  const duration = 1100;
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const clamp = n => Math.max(0, Math.min(1, n));
  const smooth = (a, b, n) => {const t = clamp((n-a)/(b-a)); return t*t*(3-2*t);};
  const keywords = /^(from|import|def|return|async|await|with|as)$/;

  function syntax(ctx, text, x, y, size, alpha) {
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.font = size + 'px Consolas, "Cascadia Code", monospace';
    let left = x;
    for (const token of text.match(/"[^"]*"|'[^']*'|\b\w+\b|[^\w"']+/g) || [text]) {
      ctx.fillStyle = /^["']/.test(token) ? "#cfbc8e" : keywords.test(token) ? "#aca8e9" : "#bdeef1";
      ctx.fillText(token, left, y);
      left += ctx.measureText(token).width;
    }
    ctx.restore();
  }

  function draw(ctx, width, height, p, section) {
    ctx.clearRect(0, 0, width, height);
    const envelope = smooth(0, .22, p) * (1-smooth(.64, 1, p));
    if (envelope <= 0) return;
    ctx.save();
    ctx.globalAlpha = envelope;
    const glow = ctx.createRadialGradient(width*.5, height*.48, 0, width*.5, height*.48, Math.max(width,height)*.72);
    glow.addColorStop(0, "#091d2bd9");
    glow.addColorStop(.65, "#07111d99");
    glow.addColorStop(1, "#050c1240");
    ctx.fillStyle = glow;
    ctx.fillRect(0,0,width,height);
    const lines = ["from portfolio import PortfolioProfile", "profile = PortfolioProfile()", 'section = profile.open("' + section + '")', "section.render()"];
    const longest = Math.max(...lines.map(line => line.length));
    const size = Math.min(28, (width-56)/(longest*.61));
    const lineHeight = Math.max(30, size*1.8);
    const left = Math.max(28, (width-Math.min(width-56, 960))*.5);
    const top = Math.max(92, height*.47-lineHeight*1.25);
    const active = Math.min(3, Math.floor(p*4.7));
    const drift = smooth(0,1,p)*12;
    const ambient = ["def open_node(section):", "return portfolio[section]", "await load_profile()", "with portfolio.session():"];
    ctx.font = Math.max(11,size*.62) + 'px Consolas, monospace';
    ctx.fillStyle = "#6babb6";
    ctx.globalAlpha = envelope*.13;
    ambient.forEach((line,i) => ctx.fillText(line, left + (i%2)*Math.min(440,width*.3) - drift, top-lineHeight*2+i*lineHeight*2.1));
    ctx.globalAlpha = envelope;
    lines.forEach((line,i) => {
      const reveal = smooth(i*.09, i*.09+.26, p);
      ctx.save();
      ctx.beginPath();
      ctx.rect(left-1, top+i*lineHeight-size-5, (width-left)*reveal, lineHeight);
      ctx.clip();
      syntax(ctx, line, left+drift, top+i*lineHeight, size, i===active ? .98 : i<active ? .58 : .19);
      ctx.restore();
    });
    const scanX = -150+p*(width+300);
    const sweep = ctx.createLinearGradient(scanX-100,0,scanX+100,0);
    sweep.addColorStop(0,"#67dce900"); sweep.addColorStop(.5,"#67dce914"); sweep.addColorStop(1,"#67dce900");
    ctx.fillStyle = sweep; ctx.fillRect(0,0,width,height);
    ctx.strokeStyle = "#6de9ee66"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(left,top+lineHeight*3.7); ctx.lineTo(left+Math.min(width-left-28,900)*smooth(0,.9,p),top+lineHeight*3.7); ctx.stroke();
    ctx.restore();
  }

  function create({shell, overlay, canvas}) {
    const ctx = canvas.getContext("2d");
    function run(commit, {section = "core_profile"} = {}) {
      if (motion.matches || !ctx || document.hidden) {commit(); window.scrollTo({top:0,behavior:"instant"}); return Promise.resolve();}
      const scrollY = window.scrollY;
      const width = document.documentElement.clientWidth;
      const snapshot = shell.cloneNode(true);
      snapshot.removeAttribute("id");
      snapshot.querySelectorAll("[id]").forEach(node => node.removeAttribute("id"));
      snapshot.classList.add("route-snapshot");
      snapshot.setAttribute("aria-hidden", "true");
      snapshot.inert = true;
      snapshot.style.top = -scrollY + "px";
      snapshot.style.width = width + "px";
      snapshot.style.minHeight = Math.max(document.body.scrollHeight, window.innerHeight+scrollY) + "px";
      snapshot.style.background = getComputedStyle(document.body).background;
      const originals = shell.querySelectorAll("video");
      snapshot.querySelectorAll("video").forEach((copy,i) => {
        const original = originals[i];
        if (!original || original.readyState < 2) {copy.remove(); return;}
        const still = document.createElement("canvas");
        still.width = original.videoWidth; still.height = original.videoHeight;
        still.className = copy.className;
        try {still.getContext("2d").drawImage(original,0,0); copy.replaceWith(still);} catch (_) {copy.remove();}
      });
      document.body.append(snapshot);
      const previousOverflow = document.documentElement.style.overflow;
      const previousInert = shell.inert;
      document.documentElement.style.overflow = "hidden";
      shell.inert = true;
      shell.setAttribute("aria-busy", "true");
      document.body.classList.add("is-routing");
      overlay.hidden = false;
      const resize = () => {
        const scale = Math.min(devicePixelRatio || 1, 1.5);
        canvas.width = Math.round(window.innerWidth*scale);
        canvas.height = Math.round(window.innerHeight*scale);
        ctx.setTransform(scale,0,0,scale,0,0);
      };
      resize();
      const cleanup = () => {
        snapshot.remove(); overlay.hidden = true; delete overlay.dataset.phase;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        shell.inert = previousInert;
        shell.removeAttribute("aria-busy");
        document.body.classList.remove("is-routing");
        document.documentElement.style.overflow = previousOverflow;
        window.removeEventListener("resize",resize);
      };
      try {commit(); window.scrollTo({top:0,behavior:"instant"});} catch (error) {cleanup(); throw error;}
      window.addEventListener("resize",resize);
      return new Promise(resolve => {
        const start = performance.now();
        const tick = now => {
          const p = motion.matches ? 1 : clamp((now-start)/duration);
          // The opaque source fades over the real destination. No intermediate page or blank frame.
          overlay.dataset.phase = p < .22 ? "enter" : p < .7 ? "flow" : "reveal";
          snapshot.style.opacity = String(1-smooth(.06,.94,p));
          draw(ctx,window.innerWidth,window.innerHeight,p,section);
          if (p < 1) requestAnimationFrame(tick);
          else {cleanup(); resolve();}
        };
        requestAnimationFrame(tick);
      });
    }
    return {run};
  }
  window.GGNavigationFlow = {create};
})();
