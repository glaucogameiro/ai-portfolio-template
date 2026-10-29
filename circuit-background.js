(() => {"use strict";
const background=document.getElementById("circuit-background"),media=document.getElementById("ambient-media"),toggle=document.getElementById("background-toggle"),motion=matchMedia("(prefers-reduced-motion: reduce)"),mobile=matchMedia("(max-width: 620px)");
let internal=false,overlay=false,paused=motion.matches;
function place(){const holder=document.getElementById("mobile-ambient-holder");const parent=internal&&mobile.matches&&holder?holder:background;if(media.parentElement!==parent)parent.append(media);}
function sync(){background.hidden=!internal;document.getElementById("site-shell").classList.toggle("is-internal",internal);toggle.hidden=!internal;place();media.classList.toggle("template-motion-paused",paused||overlay||document.hidden);toggle.textContent=paused?"Play background":"Pause background";toggle.setAttribute("aria-pressed",String(!paused));}
toggle.addEventListener("click",()=>{paused=!paused;sync();});motion.addEventListener("change",()=>{paused=motion.matches;sync();});mobile.addEventListener("change",sync);document.addEventListener("visibilitychange",sync);
window.GGCircuitBackground={setRoute(key){internal=key!=="home";sync();},setOverlay(value){overlay=value;sync();},park(){if(media.parentElement!==background)background.append(media);}};
})();
