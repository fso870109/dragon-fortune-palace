/* v21.3 reel-centric architecture.
   REEL bus: every feature is a module hooked into the reel spin lifecycle:
     REEL.on('spinStart',fn) · REEL.on('reelStop',fn(i)) · REEL.on('spinEnd',fn(result))
   Feature state comes from holdspin.js ('czhs' events) and feat.js ('czf' events).
   Meters live on the rail above the reels; payoffs play on/over the reels. Play money only. */
(function(){
const $=i=>document.getElementById(i),RM=matchMedia('(prefers-reduced-motion: reduce)').matches,NF=new Intl.NumberFormat('zh-TW');
const tone=(...a)=>window.AV&&AV.tone(...a);const sleep=ms=>new Promise(r=>setTimeout(r,RM?Math.min(ms,60):ms));
/* ---------- lifecycle bus ---------- */
const H={spinStart:[],reelStop:[],spinEnd:[]};const emit=(k,...a)=>H[k].forEach(f=>{try{f(...a)}catch(e){console.error(e)}});
const REEL=window.REEL={on:(k,f)=>H[k].push(f),emit};
function hook(){const b=$('board');if(!b)return;new MutationObserver(()=>{if(b.getAttribute('aria-busy')==='true')emit('spinStart')}).observe(b,{attributes:true,attributeFilter:['aria-busy']});
 const lf=window.landFX;if(lf)window.landFX=function(c){const r=lf.apply(this,arguments);emit('reelStop',c);return r};
 const so=window.CZ&&CZ.onSettle;if(so)CZ.onSettle=function(o){const r=so.apply(this,arguments);emit('spinEnd',o);return r}}
/* ---------- geometry helpers ---------- */
const cellsGrid=()=>{const rs=[...document.querySelectorAll('#board .reel')];return rs.map(r=>[...r.firstElementChild.children].slice(0,3))};
function cellRect(i){const b=$('board').getBoundingClientRect(),c=i%5,r=i/5|0;const w=b.width/5,h=b.height/3;return {x:b.left+c*w,y:b.top+r*h,w,h,cx:b.left+(c+.5)*w,cy:b.top+(r+.5)*h}}
/* v21.4: no meters, no token flights — hidden games stay hidden until they trigger */
let hs={orbs:[],meter:0,M:1000};
addEventListener('czhs',e=>{const d=e.detail;hs={orbs:d.orbs,meter:d.meter,M:d.M};stickyUI(d.added)});
/* ---------- sticky charged orbs on the reels ---------- */
let sticky;function stickyUI(added){const b=$('board');if(!b)return;const par=b.offsetParent;if(!par)return;if(!sticky){sticky=document.createElement('div');sticky.id='b23Sticky';par.appendChild(sticky)}
 Object.assign(sticky.style,{left:b.offsetLeft+'px',top:b.offsetTop+'px',width:b.offsetWidth+'px',height:b.offsetHeight+'px'});
 const S=window.B22&&B22.SPR;window.B22&&B22.art&&B22.art();
 const want=new Set(hs.orbs);[...sticky.children].forEach(c=>{if(!want.has(+c.dataset.i))c.remove()});
 hs.orbs.forEach(i=>{if(sticky.querySelector(`[data-i="${i}"]`))return;const o=document.createElement('i');o.dataset.i=i;o.style.left=(i%5*20)+'%';o.style.top=((i/5|0)*33.333)+'%';if(B22.SPR.gold)o.style.backgroundImage=`url(${B22.SPR.gold})`;if(i===added)o.classList.add('new');sticky.appendChild(o)})}
/* ---------- reel-stop anticipation: free-game scatters + pending hidden games ---------- */
let sc=0;const reels=()=>document.querySelectorAll('#board .reel');
const hiddenPending=()=>{try{return (window.CZF&&CZF.pending&&CZF.pending())||(window.CZHS&&CZHS.pending&&CZHS.pending())}catch(e){return false}};
function tease(from){reels().forEach((r,k)=>{if(k>from)r.classList.add('b23tease')});tone(200,0,.6,'sawtooth',.02,800)}
REEL.on('spinStart',()=>{sc=0;document.querySelectorAll('#board .reel.b23tease').forEach(r=>r.classList.remove('b23tease'))});
REEL.on('reelStop',i=>{const reel=reels()[i];if(!reel)return;reel.classList.remove('b23tease');const n=[...reel.firstElementChild.children].slice(0,3).filter(c=>c.dataset.s==='scatter').length;
 if(n){sc+=n;tone(660+sc*220,0,.18,'triangle',.06);tone(1320+sc*220,.05,.2,'sine',.04);reel.classList.add('b23sc');setTimeout(()=>reel.classList.remove('b23sc'),700)}
 if(i===2&&(sc===2||hiddenPending()))tease(i);else if(sc===2&&n)tease(i)});
REEL.on('spinEnd',()=>{setTimeout(()=>document.querySelectorAll('#board .reel.b23tease').forEach(r=>r.classList.remove('b23tease')),300);place()});
/* ---------- reveal: emerging from the reels ---------- */
function place(){const b=$('board');if(sticky&&b)Object.assign(sticky.style,{left:b.offsetLeft+'px',top:b.offsetTop+'px',width:b.offsetWidth+'px',height:b.offsetHeight+'px'})}
function layoutHS(o){const b=$('board').getBoundingClientRect();o.classList.add('b23');o.style.setProperty('--bl',b.left+'px');o.style.setProperty('--bt',b.top+'px');o.style.setProperty('--bw',b.width+'px');o.style.setProperty('--bh',b.height+'px')}
new MutationObserver(ms=>{for(const m of ms)m.addedNodes.forEach(n=>{if(n.nodeType===1&&n.id==='hsBox'){window.B22&&B22.art();layoutHS(n)}})}).observe(document.body,{childList:true});
function inBoard(cls,html){const b=$('board'),d=document.createElement('div');d.className=cls;d.innerHTML=html;Object.assign(d.style,{left:b.offsetLeft+'px',top:b.offsetTop+'px',width:b.offsetWidth+'px',height:b.offsetHeight+'px'});b.offsetParent.appendChild(d);return d}
function slam(t){const d=inBoard('r24t',`<b>${t}</b>`);[392,523,659,784].forEach((f,i)=>tone(f,i*.05,.3,'square',.035));tone(98,0,.5,'sine',.12);setTimeout(()=>{d.classList.add('out');setTimeout(()=>d.remove(),420)},RM?200:900)}
async function crackCells(ids){const L=inBoard('r24c','');ids.forEach((i,k)=>{const e=document.createElement('i');e.style.left=(i%5*20)+'%';e.style.top=((i/5|0)*33.333)+'%';e.style.animationDelay=(k*60)+'ms';L.appendChild(e)});
 tone(900,0,.3,'triangle',.04,1600);await sleep(380);L.classList.add('crack');tone(1600,0,.06,'square',.04);tone(1200,.08,.06,'square',.04);await sleep(260);L.classList.add('burst');window.shake&&shake(1);
 ids.forEach(i=>{const r=cellRect(i);window.W21&&W21.burst(r.cx,r.cy,10,200)});tone(140,0,.3,'square',.06);await sleep(260);L.remove()}
const F=window.F21||{};const bedOn=F.bedOn,bedOff=F.bedOff;
F.pre=async function(title){const b=$('board');let ids;
 if(title==='寶珠鎖定重轉'){ids=(window.__hsStart||[]).slice();if(!ids.length)ids=[6,7,8]}else{const all=[...Array(15).keys()];ids=[];while(ids.length<3){const k=all.splice(Math.random()*all.length|0,1)[0];ids.push(k)}}
 const fr=$('w21F');if(fr)fr.className='go t2';await crackCells(ids);
 if(title==='寶珠鎖定重轉'){b.classList.add('b23lock');if(sticky)sticky.classList.add('lock')}
 slam(title||'隱藏遊戲');bedOn&&bedOn();await sleep(RM?60:950);if(sticky)sticky.classList.remove('lock')};
F.back=function(){const b=$('board'),w=$('czWin');if(w&&window.W21){const c=w.getBoundingClientRect(),r=b.getBoundingClientRect();for(let i=0;i<12;i++)setTimeout(()=>W21.trail(r.left+Math.random()*r.width,r.top+Math.random()*r.height,c.left+c.width/2,c.top+c.height/2),i*30)}
 b.classList.remove('b23lock');const fr=$('w21F');if(fr)fr.className='';bedOff&&bedOff();stickyUI(-1)};
window.F21=F;
setInterval(()=>document.body.classList.toggle('b23fs',!!window.FS),400);
function boot(){hook();place();stickyUI(-1);window.CZHS&&CZHS.emit&&CZHS.emit();addEventListener('resize',()=>{place();stickyUI(-1)})}
if(document.readyState==='complete')setTimeout(boot,350);else addEventListener('load',()=>setTimeout(boot,350));
})();
