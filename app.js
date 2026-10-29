(async () => {
  "use strict";
  const $ = id => document.getElementById(id);
  document.querySelector(".skip-link").addEventListener("click", event => {event.preventDefault(); $("main-content").focus();});
  const video = $("intro-video");
  const stage = $("portal-stage");
  const sections = await window.GGPortfolio.load();
  let settleTimer;
  let defaultHint = "SELECT A NODE TO EXPLORE";
  const rememberIntro = () => {try {sessionStorage.setItem("gg-portal-intro-seen", "1");} catch (_) {}};
  const hasSeenIntro = () => {try {return sessionStorage.getItem("gg-portal-intro-seen") === "1";} catch (_) {return false;}};
  const showReady = () => {
    clearTimeout(settleTimer);
    video.pause();
    stage.classList.remove("is-intro");
    document.body.classList.add("portal-ready");
    $("intro-tools").hidden = true;
    $("enter-portal").hidden = true;
    $("hotspots").hidden = false;
    $("mobile-nav").hidden = false;
    $("replay-intro").hidden = false;
    $("portal-hint").textContent = defaultHint;
    rememberIntro();
  };
  const startIntro = async () => {
    if (!video.querySelector("source")) { showReady(); return; }
    clearTimeout(settleTimer);
    document.body.classList.remove("portal-ready");
    $("hotspots").hidden = true;
    $("mobile-nav").hidden = true;
    $("replay-intro").hidden = true;
    $("enter-portal").hidden = true;
    $("intro-tools").hidden = false;
    $("portal-hint").textContent = "OPENING THE PORTAL";
    stage.classList.add("is-intro");
    video.currentTime = 0;
    try { await video.play(); } catch (_) {
      stage.classList.remove("is-intro");
      $("enter-portal").hidden = false;
      $("portal-hint").textContent = "YOUR PORTAL IS READY";
    }
  };
  video.addEventListener("ended", () => {
    stage.classList.remove("is-intro");
    $("portal-hint").textContent = "PORTAL READY";
    settleTimer = setTimeout(showReady, 1000);
  });
  video.addEventListener("error", showReady);
  $("skip-intro").addEventListener("click", showReady);
  $("enter-portal").addEventListener("click", showReady);
  $("replay-intro").addEventListener("click", startIntro);
  $("sound-toggle").addEventListener("click", () => {
    video.muted = !video.muted;
    $("sound-toggle").textContent = video.muted ? "Sound off" : "Sound on";
    $("sound-toggle").setAttribute("aria-pressed", String(!video.muted));
  });
  document.querySelectorAll(".hotspot").forEach(link => {
    const announce = () => {$("portal-hint").textContent = link.dataset.hint;};
    const reset = () => {$("portal-hint").textContent = defaultHint;};
    link.addEventListener("mouseenter", announce);
    link.addEventListener("focus", announce);
    link.addEventListener("mouseleave", reset);
    link.addEventListener("blur", reset);
  });
  const renderRoute = (key, moveFocus = true) => {
    const section = sections[key];
    window.GGCircuitBackground.park();
    window.GGPortfolio.closeDialogs();
    document.querySelectorAll(".section-nav a").forEach(link => {if(link.getAttribute("href") === "#"+key)link.setAttribute("aria-current","page");else link.removeAttribute("aria-current");});
    if (!section) {
      $("home-view").hidden = false;
      $("section-view").hidden = true;
      window.GGCircuitBackground.setRoute("home");
      document.title = "Your Name — Applied AI & Systems Integration";
      if (moveFocus) window.scrollTo({top:0, behavior:"instant"});
      return;
    }
    video.pause();
    clearTimeout(settleTimer);
    $("home-view").hidden = true;
    $("section-view").hidden = false;
    $("section-number").textContent = section.number + " / PORTFOLIO";
    $("section-title").textContent = section.title;
    $("section-subtitle").textContent = section.subtitle;
    $("section-content").innerHTML = window.GGPortfolio.render(key);
    window.GGCircuitBackground.setRoute(key);
    document.title = section.title + " — Your Name";
    window.scrollTo({top:0, behavior:"instant"});
    if (moveFocus) $("section-title").focus({preventScroll:true});
  };
  const routeKey = () => sections[location.hash.slice(1)] ? location.hash.slice(1) : "home";
  const flow = window.GGNavigationFlow?.create({shell:$("site-shell"),overlay:$("navigation-flow"),canvas:$("navigation-flow-canvas")});
  let currentRoute = routeKey();
  let routing = false;
  let pendingRoute = null;
  const focusRoute = (key, previous) => {
    if (key !== "home") $("section-title").focus({preventScroll:true});
    else {
      const container = matchMedia("(max-width: 620px)").matches ? $("mobile-nav") : $("hotspots");
      const link = container.querySelector('a[href="#'+previous+'"]');
      (link || $("home-heading")).focus({preventScroll:true});
    }
  };
  const navigate = async key => {
    if (routing) {pendingRoute = key; return;}
    if (key === currentRoute) return;
    const previous = currentRoute;
    routing = true;
    const commit = () => {
      if (key === "home") showReady();
      renderRoute(key, false);
      currentRoute = key;
    };
    try {
      if (flow) await flow.run(commit, {section: key.replaceAll("-", "_") === "home" ? "portal" : key.replaceAll("-", "_")});
      else commit();
    } finally {
      routing = false;
    }
    const next = pendingRoute;
    pendingRoute = null;
    if (next && next !== currentRoute) {navigate(next); return;}
    focusRoute(key, previous);
  };
  window.addEventListener("hashchange", () => navigate(routeKey()));
  document.addEventListener("keydown", event => {if (event.key === "Escape" && currentRoute !== "home" && !document.querySelector("dialog[open]")) location.hash = "home";});
  renderRoute(currentRoute, false);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (hasSeenIntro() || reducedMotion || currentRoute !== "home") showReady();
  else startIntro();
})().catch(error => {console.error(error);const message=document.getElementById("site-message");message.hidden=false;message.textContent="The portfolio could not load. Please reload the page or use the résumé PDF link above.";});
