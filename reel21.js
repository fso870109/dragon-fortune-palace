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
/* ---------- rail of meters above the reels ---------- */
const MOD=[];let rail;
function mountRail(){const b=$('board');if(!b||$('b23Rail'))return;rail=document.createElement('div');rail.id='b23Rail';($('machine')||document.body).appendChild(rail);MOD.forEach(m=>{const e=document.createElement('div');e.className='b23m '+m.id;e.innerHTML=m.html();rail.appendChild(e);m.el=e;m.ui&&m.ui()})}
function reveal(m){const e=m.el;if(!e)return;e.classList.remove('b23gain');void e.offsetWidth;e.classList.add('b23gain');const r=e.getBoundingClientRect();window.W21&&W21.burst(r.left+r.width/2,r.top+r.height/2,10,170);tone(880,0,.08,'triangle',.05);tone(1320,.08,.12,'triangle',.05)}
function fly(fromI,m){if(!m.el||!window.W21)return;const a=cellRect(fromI),b=m.el.getBoundingClientRect();const t=document.createElement('div');t.className='b23tok '+m.id;t.style.left=a.cx+'px';t.style.top=a.cy+'px';document.body.appendChild(t);
 // staged reveal on the reel cell: glow -> crack -> burst, then the token flies to its meter
 setTimeout(()=>{t.classList.add('crack');tone(1600,0,.05,'square',.03)},RM?0:260);setTimeout(()=>{W21.burst(a.cx,a.cy,12,200);t.classList.add('go');t.style.left=(b.left+b.width/2)+'px';t.style.top=(b.top+b.height/2)+'px';W21.trail(a.cx,a.cy,b.left+b.width/2,b.top+b.height/2)},RM?0:480);setTimeout(()=>{t.remove();reveal(m)},RM?50:950)}
/* 寶珠: n/6 orbs + energy */
let hs={orbs:[],meter:0,M:1000};
const mOrb={id:'orb',html:()=>`<b>寶珠</b><div class="dots">${'<i></i>'.repeat(6)}</div><u><s></s></u>`,ui(){const e=this.el;if(!e)return;[...e.querySelectorAll('.dots i')].forEach((d,i)=>d.classList.toggle('on',i<hs.orbs.length));e.querySelector('s').style.width=Math.min(100,hs.meter/hs.M*100)+'%';e.classList.toggle('hot',hs.orbs.length>=4)}};
/* 旋風聚寶 vortex */
let fs={tk:{p:0,w:0,m:0},tw:{n:0,pot:0},TW_N:60,armed:0};
const mTw={id:'tw',html:()=>`<b>旋風</b><div class="vx"><i></i></div><em>0</em>`,ui(){const e=this.el;if(!e)return;const p=fs.tw.n/fs.TW_N;e.style.setProperty('--p',p);e.querySelector('em').textContent=NF.format(Math.round(fs.tw.pot||0));e.classList.toggle('hot',p>=.85)}};
/* 彩金輪: 12 segments light one by one */
const seg12=()=>{let s='';for(let i=0;i<12;i++){const a0=i/12*6.283-1.571,a1=(i+1)/12*6.283-1.571,p=a=>`${(14+Math.cos(a)*13).toFixed(1)},${(14+Math.sin(a)*13).toFixed(1)}`;s+=`<path d="M14,14 L${p(a0)} A13,13 0 0 1 ${p(a1)}Z"/>`}return s};
const mWh={id:'wh',html:()=>`<b>彩金輪</b><svg viewBox="0 0 28 28">${seg12()}<circle cx="14" cy="14" r="4"/></svg>`,ui(){const e=this.el;if(!e)return;[...e.querySelectorAll('path')].forEach((p,i)=>p.classList.toggle('on',i<fs.tk.w));e.classList.toggle('hot',fs.tk.w>=10)}};
/* 幸運彈珠: balls into a tray */
const mPl={id:'pl',html:()=>`<b>彈珠</b><div class="tray">${'<i></i>'.repeat(5)}</div>`,ui(){const e=this.el;if(!e)return;[...e.querySelectorAll('.tray i')].forEach((d,i)=>d.classList.toggle('on',i<fs.tk.p));e.classList.toggle('hot',fs.tk.p>=4)}};
/* 狂熱倍數: medallion charges in 3 stages */
const mMx={id:'mx',html:()=>`<b>狂熱</b><div class="med"><i></i><span>×</span></div>`,ui(){const e=this.el;if(!e)return;e.style.setProperty('--c',fs.armed?3:fs.tk.m);e.querySelector('span').textContent=fs.armed?'×'+fs.armed:'×';e.classList.toggle('hot',!!fs.armed||fs.tk.m>=2)}};
MOD.push(mOrb,mTw,mWh,mPl,mMx);
addEventListener('czhs',e=>{const d=e.detail;const prev=hs.orbs.length;hs={orbs:d.orbs,meter:d.meter,M:d.M};if(d.added>=0)fly(d.added,mOrb);else if(d.forced){reveal(mOrb)}stickyUI(d.added);mOrb.ui()});
let prevTk=null;
addEventListener('czf',e=>{const d=e.detail;const old=prevTk||d.tk;fs=d;prevTk=Object.assign({},d.tk);
 const pick=()=>Math.random()*15|0;
 if(d.k==='plinko'&&(d.tk.p>old.p||d.full))fly(pick(),mPl);if(d.k==='wheel'&&(d.tk.w>old.w||d.full))fly(pick(),mWh);if(d.k==='mult'&&(d.tk.m>old.m||d.armed))fly(pick(),mMx);
 MOD.forEach(m=>m.ui&&m.ui())});
/* ---------- sticky charged orbs on the reels ---------- */
let sticky;function stickyUI(added){const b=$('board');if(!b)return;const par=b.offsetParent;if(!par)return;if(!sticky){sticky=document.createElement('div');sticky.id='b23Sticky';par.appendChild(sticky)}
 Object.assign(sticky.style,{left:b.offsetLeft+'px',top:b.offsetTop+'px',width:b.offsetWidth+'px',height:b.offsetHeight+'px'});
 const S=window.B22&&B22.SPR;window.B22&&B22.art&&B22.art();
 const want=new Set(hs.orbs);[...sticky.children].forEach(c=>{if(!want.has(+c.dataset.i))c.remove()});
 hs.orbs.forEach(i=>{if(sticky.querySelector(`[data-i="${i}"]`))return;const o=document.createElement('i');o.dataset.i=i;o.style.left=(i%5*20)+'%';o.style.top=((i/5|0)*33.333)+'%';if(B22.SPR.gold)o.style.backgroundImage=`url(${B22.SPR.gold})`;if(i===added)o.classList.add('new');sticky.appendChild(o)})}
/* ---------- scatter lamps for free games (per reel stop) ---------- */
let lamps,sc=0;function mountLamps(){const b=$('board');if(!b||$('b23Lamps'))return;lamps=document.createElement('div');lamps.id='b23Lamps';lamps.innerHTML='<i></i><i></i><i></i>';b.offsetParent.appendChild(lamps);place()}
function place(){const b=$('board');if(rail&&b){const m=rail.offsetParent||document.body,q=b.getBoundingClientRect(),o=m.getBoundingClientRect();rail.style.left=(q.left-o.left+2)+'px';rail.style.width=(q.width-4)+'px';rail.style.top=(q.top-o.top-62)+'px'}if(lamps&&b){lamps.style.left=(b.offsetLeft+b.offsetWidth/2)+'px';lamps.style.top=(b.offsetTop-9)+'px'}if(sticky&&b)Object.assign(sticky.style,{left:b.offsetLeft+'px',top:b.offsetTop+'px',width:b.offsetWidth+'px',height:b.offsetHeight+'px'})}
REEL.on('spinStart',()=>{sc=0;lamps&&[...lamps.children].forEach(l=>l.className='');document.querySelectorAll('#board .reel.b23tease').forEach(r=>r.classList.remove('b23tease'))});
REEL.on('reelStop',i=>{const reel=document.querySelectorAll('#board .reel')[i];if(!reel)return;const n=[...reel.firstElementChild.children].slice(0,3).filter(c=>c.dataset.s==='scatter').length;
 if(n){for(let k=0;k<n&&sc<3;k++){const l=lamps&&lamps.children[sc];l&&(l.className='on');sc++}tone(660+sc*220,0,.18,'triangle',.06);tone(1320+sc*220,.05,.2,'sine',.04);reel.classList.add('b23sc');setTimeout(()=>reel.classList.remove('b23sc'),700)}
 if(sc===2){document.querySelectorAll('#board .reel').forEach((r,k)=>{if(k>i)r.classList.add('b23tease')});tone(200,0,.6,'sawtooth',.02,800)}
 if(sc>=3&&lamps)lamps.classList.add('full')});
REEL.on('spinEnd',()=>{setTimeout(()=>{lamps&&lamps.classList.remove('full');document.querySelectorAll('#board .reel.b23tease').forEach(r=>r.classList.remove('b23tease'))},1200);place()});
/* ---------- payoffs play on/over the reels ---------- */
function heroRect(){const h=$('czHero'),b=$('board');const a=h.getBoundingClientRect(),c=b.getBoundingClientRect();return {l:c.left,r:c.right,t:Math.max(0,a.top)+4,b:c.top-2}}
function layoutHS(o){const b=$('board').getBoundingClientRect(),hr=heroRect();o.classList.add('b23');o.style.setProperty('--bl',b.left+'px');o.style.setProperty('--bt',b.top+'px');o.style.setProperty('--bw',b.width+'px');o.style.setProperty('--bh',b.height+'px');o.style.setProperty('--ht',hr.t+'px');o.style.setProperty('--hb',hr.b+'px');o.style.setProperty('--vw',innerWidth+'px')}
function layoutFx(o){const r=heroRect();o.classList.add('b23fx');Object.assign(o.style,{left:r.l+'px',top:r.t+'px',width:(r.r-r.l)+'px',height:(r.b-r.t)+'px'});requestAnimationFrame(()=>fitFx(o));try{new ResizeObserver(()=>fitFx(o)).observe(o.querySelector('.fxIn'))}catch(e){}}
function fitFx(o){const inn=o.querySelector('.fxIn');if(!inn)return;inn.style.transform='none';const k=Math.min(1,(o.clientWidth-6)/Math.max(inn.offsetWidth,inn.scrollWidth),(o.clientHeight-6)/Math.max(inn.offsetHeight,inn.scrollHeight));inn.style.transform=`scale(${k})`}
new MutationObserver(ms=>{for(const m of ms)m.addedNodes.forEach(n=>{if(n.nodeType!==1)return;if(n.id==='hsBox'){window.B22&&B22.art();layoutHS(n)}else if(n.classList&&n.classList.contains('fxOv'))layoutFx(n)})}).observe(document.body,{childList:true});
/* flow: short, reel-centric */
const F=window.F21||{};const bedOn=F.bedOn,bedOff=F.bedOff;
function slam(t){const d=document.createElement('div');d.className='b22title b23t';d.innerHTML=`<b>${t}</b>`;const r=heroRect();d.style.top=(r.t+(r.b-r.t)*.45)+'px';document.body.appendChild(d);[392,523,659,784].forEach((f,i)=>tone(f,i*.05,.3,'square',.035));tone(98,0,.5,'sine',.12);setTimeout(()=>{d.classList.add('out');setTimeout(()=>d.remove(),450)},RM?200:800)}
F.pre=async function(title){const b=$('board');if(title==='寶珠鎖定重轉'){b.classList.add('b23lock');tone(140,0,.25,'square',.06);tone(90,.12,.4,'sawtooth',.05);window.shake&&shake(2);const fr=$('w21F');if(fr){fr.className='go t2'}if(sticky)sticky.classList.add('lock')}else{document.body.classList.add('b23hero')}
 slam(title||'特殊事件');bedOn&&bedOn();await sleep(RM?60:850);if(sticky)sticky.classList.remove('lock')};
F.back=function(){const b=$('board'),w=$('czWin');if(w&&window.W21){const c=w.getBoundingClientRect(),r=b.getBoundingClientRect();for(let i=0;i<14;i++)setTimeout(()=>W21.trail(r.left+Math.random()*r.width,r.top+Math.random()*r.height,c.left+c.width/2,c.top+c.height/2),i*30)}
 b.classList.remove('b23lock');document.body.classList.remove('b23hero');const fr=$('w21F');if(fr)fr.className='';bedOff&&bedOff();stickyUI(-1)};
window.F21=F;
setInterval(()=>document.body.classList.toggle('b23fs',!!window.FS),400);
function boot(){hook();mountRail();mountLamps();place();stickyUI(-1);window.CZHS&&CZHS.emit&&CZHS.emit();window.CZF&&CZF.emit&&CZF.emit();addEventListener('resize',()=>{place();stickyUI(-1)})}
if(document.readyState==='complete')setTimeout(boot,350);else addEventListener('load',()=>setTimeout(boot,350));
})();
