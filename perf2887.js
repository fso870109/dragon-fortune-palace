/* v28.87 perf tier: device class + frame governor. Presentation only (odds / economy untouched).
   tier 2 = full effects, 1 = trimmed particle budgets, 0 = lite (html.dfpLite pauses decorative CSS loops). */
(function(){
const H=document.documentElement,nc=navigator.hardwareConcurrency||4,dm=navigator.deviceMemory||4;
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
let tier=(nc<=4||dm<=2)?0:(nc<=6||dm<=4)?1:2;
try{const s=sessionStorage.getItem('dfp_ptier');if(s!==null&&s!=='')tier=Math.min(tier,+s|0)}catch(e){}
const SC=[.28,.4,.5]; /* v28.88: particle budgets halved again on every tier */
function apply(){H.classList.toggle('dfpLite',tier===0);H.setAttribute('data-ptier',tier)}
function down(){if(tier<=0)return;tier--;apply();try{sessionStorage.setItem('dfp_ptier',tier)}catch(e){}}
/* sample ~1.2 s of frames at a heavy moment; mostly-slow frames step the tier down for this session */
let on=0;function watch(){if(on||tier===0||document.hidden)return;on=1;let n=0,slow=0,last=0,t0=0;
 const f=t=>{if(document.hidden){on=0;return}if(last){n++;if(t-last>36)slow++}else t0=t;last=t;if(t-t0<1200)requestAnimationFrame(f);else{on=0;if(n>=10&&slow/n>.5)down()}};requestAnimationFrame(f)}
window.DFPPERF={get tier(){return tier},get scale(){return RM?.35:SC[tier]},get trail(){return tier>1?1:0},down:down,watch:watch};
apply();
})();
