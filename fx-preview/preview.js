/* 寶珠對碰 FX preview — old = v28.120 techniques; new = canvas + pre-rendered webp. Not the live game. */
(function(){
"use strict";
const $ = id => document.getElementById(id);
const stage = $('stage'), world = $('world'), canvas = $('fxCanvas'), statusEl = $('status');
const A = p => 'assets/'+p+'.webp';
let mode = 'old', timer = [], artReady = null, imgs = {}, particles = [], raf = 0, seed = 1;

function rnd(){ seed = (seed*1664525+1013904223)>>>0; return (seed>>>8)/16777216 }
function later(ms, fn){ const t=setTimeout(fn, ms); timer.push(t); return t }
function clearTimers(){ timer.splice(0).forEach(clearTimeout) }
function setStatus(s){ statusEl.textContent=s }

window.__fxPreview = {mode:'old', moment:'', marks:[], playing:false};
function mark(name){
  const row={name,t:performance.now()};
  window.__fxPreview.marks.push(row);
  window.__fxPreview.moment=name;
}

/* ---------- preload new assets ---------- */
const NEED=['jewel-gold','jewel-mini','jewel-minor','jewel-major','jewel-col','jewel-gold-bright','socket','vig','rays','f21-orb','halo','cell-glow','flash-sheet','spark','coin','gem','title-entry','title-prize','title-grand','end-banner','dragon'];
function loadImg(src){return new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=no;i.src=src})}
const preloaded=Promise.all(NEED.map(k=>loadImg(A(k)).then(i=>{imgs[k]=i;return i}))).catch(()=>null);

/* ---------- old: encode jewels at entry (mirrors bonus22 art()) ---------- */
const PAL={gold:['#fffbe6','#ffd65a','#c98a1c','#5a3200'],mini:['#eef8ff','#6fb6ff','#1f5fb0','#0a1f4a'],minor:['#effff6','#5be0a6','#178a5c','#06301f'],major:['#fff0f8','#ff7ab8','#c2185b','#4a0626'],col:['#fff6e0','#ffb347','#d2380e','#4a0a00']};
function cnv(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);return c}
function jewel(k,S){const p=k==='gold'?['#fff3c0','#ffa21a','#b8460a','#3a0e00']:PAL[k];const W=Math.round(S*1.6),H=S;return cnv(W,H,(x,w,h)=>{
 const rr=(X,Y,ww,hh,r)=>{x.beginPath();x.moveTo(X+r,Y);x.arcTo(X+ww,Y,X+ww,Y+hh,r);x.arcTo(X+ww,Y+hh,X,Y+hh,r);x.arcTo(X,Y+hh,X,Y,r);x.arcTo(X,Y,X+ww,Y,r);x.closePath()};
 const u=h/100;let g;
 g=x.createLinearGradient(0,0,0,h);[['#fffbe0',0],['#ffd65a',.14],['#b8740e',.38],['#5a2c02',.52],['#e2a632',.7],['#fff0b0',.86],['#9a5a08',1]].forEach(([c,o])=>g.addColorStop(o,c));
 x.fillStyle=g;rr(0,0,w,h,14*u);x.fill();x.lineWidth=2.2*u;x.strokeStyle='#2a1000';x.stroke();
 g=x.createLinearGradient(0,0,w,0);g.addColorStop(0,'rgba(0,0,0,.35)');g.addColorStop(.2,'rgba(0,0,0,0)');g.addColorStop(.8,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.35)');x.fillStyle=g;rr(0,0,w,h,14*u);x.fill();
 const fi=9*u;x.fillStyle='#2a1000';rr(fi-1.5*u,fi-1.5*u,w-2*fi+3*u,h-2*fi+3*u,9*u);x.fill();
 g=x.createLinearGradient(0,fi,0,h-fi);g.addColorStop(0,p[1]);g.addColorStop(.5,p[2]);g.addColorStop(1,p[3]);x.fillStyle=g;rr(fi,fi,w-2*fi,h-2*fi,8*u);x.fill();
 const cx=w/2,cy=h/2,gw=w*.36,gh=h*.36,n=16,pts=[];
 for(let i=0;i<n;i++){const a=i/n*Math.PI*2-Math.PI/2+Math.PI/n,c=Math.cos(a),s=Math.sin(a);pts.push([cx+Math.pow(Math.abs(c),.7)*Math.sign(c)*gw,cy+Math.pow(Math.abs(s),.7)*Math.sign(s)*gh])}
 g=x.createRadialGradient(cx-gw*.3,cy-gh*.45,gh*.05,cx,cy+gh*.1,gw);g.addColorStop(0,p[0]);g.addColorStop(.3,p[1]);g.addColorStop(.7,p[2]);g.addColorStop(1,p[3]);
 x.fillStyle=g;x.beginPath();pts.forEach(([X,Y],i)=>x[i?'lineTo':'moveTo'](X,Y));x.closePath();x.fill();
})}
function socket(S){return cnv(S,S,(x,w)=>{const c=w/2,R=c*.94;let g=x.createLinearGradient(0,c-R,0,c+R);g.addColorStop(0,'#fff8d6');g.addColorStop(.45,'#8a5410');g.addColorStop(1,'#fff0b8');x.fillStyle=g;x.beginPath();x.arc(c,c,R,0,7);x.fill();const r3=R*.68;g=x.createRadialGradient(c,c-r3*.25,r3*.05,c,c+r3*.25,r3);g.addColorStop(0,'#6a3a88');g.addColorStop(1,'#040108');x.fillStyle=g;x.beginPath();x.arc(c,c,r3,0,7);x.fill()})}
function encodeArt(){
  // Recreate the live first-entry cost: paint jewels to canvas and encode PNG on the main thread.
  const S=192;
  ['gold','mini','minor','major','col'].forEach(k=>{jewel(k,S).toDataURL('image/png')});
  socket(S).toDataURL('image/png');
  artReady=true;
}

/* ---------- canvas particle pool (new only) ---------- */
function sizeCanvas(){
  const r=stage.getBoundingClientRect(), d=Math.min(2,devicePixelRatio||1);
  canvas.width=Math.round(r.width*d); canvas.height=Math.round(r.height*d);
  canvas.style.width=r.width+'px'; canvas.style.height=r.height+'px';
  return d;
}
function emit(kind,x,y,n){
  if(mode!=='new') return;
  const r=stage.getBoundingClientRect();
  for(let i=0;i<n;i++){
    particles.push({
      kind, x, y,
      vx:(rnd()-.5)*(kind==='coin'?80:140),
      vy:kind==='coin'?(-40-rnd()*120):( -20-rnd()*180),
      life:0, max:.7+rnd()*.6,
      rot:rnd()*6, vr:(rnd()-.5)*8,
      sc:.4+rnd()*.7
    });
  }
  if(particles.length>120) particles.splice(0, particles.length-120);
  if(!raf) raf=requestAnimationFrame(tick);
}
function tick(now){
  const d=sizeCanvas(), ctx=canvas.getContext('2d');
  ctx.setTransform(d,0,0,d,0,0);
  const r=stage.getBoundingClientRect();
  ctx.clearRect(0,0,r.width,r.height);
  const g=1/60;
  let w=0;
  for(let i=0;i<particles.length;i++){
    const p=particles[i];
    p.life+=g; p.x+=p.vx*g; p.y+=p.vy*g; p.vy+=220*g; p.rot+=p.vr*g;
    const k=1-p.life/p.max;
    if(k<=0) continue;
    const im=imgs[p.kind]; if(!im) {particles[w++]=p;continue}
    ctx.save(); ctx.globalAlpha=Math.max(0,k); ctx.translate(p.x,p.y); ctx.rotate(p.rot);
    const s=24*p.sc; ctx.drawImage(im,-s/2,-s/2,s,s); ctx.restore();
    particles[w++]=p;
  }
  particles.length=w;
  if(particles.length) raf=requestAnimationFrame(tick); else {raf=0;ctx.clearRect(0,0,r.width,r.height)}
}

/* ---------- board ---------- */
const START_CELLS=[
  {i:0,k:'gold',t:'×2'},{i:2,k:'mini',t:'迷你'},{i:3,k:'gold',t:'×5'},
  {i:6,k:'minor',t:'小獎'},{i:9,k:'gold',t:'×3'},{i:11,k:'gold',t:'×8'}
];
const REST=[1,4,5,7,8,10,12,13,14];
const FILL_REST=[
  {i:1,k:'gold',t:'×1'},{i:4,k:'gold',t:'×3'},{i:5,k:'major',t:'大獎'},
  {i:7,k:'gold',t:'×2'},{i:8,k:'col',t:'聚寶'},{i:10,k:'gold',t:'×5'},
  {i:12,k:'gold',t:'×1'},{i:13,k:'mini',t:'迷你'},{i:14,k:'gold',t:'×10'}
];

function cellStyle(k, on){
  const url=on?A('jewel-'+k):A('socket');
  return 'background-image:url('+url+')';
}
function boardHTML(opts){
  opts=opts||{};
  const cells=Array.from({length:15},(_,i)=>`<i data-i="${i}" class="sock"></i>`).join('');
  return `<div class="board${opts.in?' in':''}"><div class="hsIn">
    <h2>寶珠對碰</h2>
    <div class="hsJp">
      <div class="mini"><b>迷你</b><span>3,000</span></div>
      <div class="minor"><b>小獎</b><span>8,000</span></div>
      <div class="major"><b>大獎</b><span>24,000</span></div>
      <div class="grand"><b>巨獎</b><span>80,000</span></div>
    </div>
    <div class="hsG">${cells}</div>
    <div class="hsF"><span>剩餘重轉 <b id="hsL">3</b></span><span>累計 <b id="hsT">0</b></span></div>
    <p class="hsTip">寶珠會鎖定在原位，出現新寶珠即重置為 3 次・集滿 15 格得「巨獎」</p>
    <div class="hsEndWrap"></div>
  </div></div>`;
}
function paintCell(el, spec, land){
  el.className='on '+(spec.k==='gold'?'':spec.k)+(land?' land':'');
  el.style.cssText=cellStyle(spec.k,true);
  el.innerHTML=(spec.k==='col'?'<small>聚寶</small>':'')+(spec.t.indexOf('×')===0||/\d/.test(spec.t)?'<span>'+spec.t+'</span>':'<b>'+spec.t+'</b>')+(mode==='new'?'<i class="glow" style="background-image:url('+A('cell-glow')+')"></i>':'');
}

/* ---------- sequences ---------- */
function resetWorld(){
  clearTimers();
  particles.length=0;
  if(raf){cancelAnimationFrame(raf);raf=0}
  const ctx=canvas.getContext('2d');ctx&&ctx.clearRect(0,0,canvas.width,canvas.height);
  stage.classList.remove('pre','hsDone','full');
  world.innerHTML='';
  window.__fxPreview.playing=false;
}

function layers(){
  const isNew=mode==='new';
  const bg=isNew?`style="background-image:url(${A('vig')})"`:'';
  const rays=isNew?`style="background-image:url(${A('rays')})"`:'';
  const orb=isNew?`style="background-image:url(${A('f21-orb')})"`:'';
  const drag=isNew?`<img class="dragon" alt="" src="${A('dragon')}">`:`<div class="dragon" id="oldDragon"></div>`;
  const title=isNew?`<div class="title-slam"><img src="${A('title-entry')}" alt="寶珠對碰"></div>`:`<div class="title-slam"><b>寶珠對碰</b></div>`;
  return `<div class="bg" ${bg}></div><div class="rays" ${rays}></div><div class="orb" ${orb}></div>${drag}${title}<div class="halo-fx"></div><div class="flash" id="flashEl" hidden></div>`;
}

function setOldDragon(){
  const d=world.querySelector('.dragon');
  if(!d||mode!=='old')return;
  d.innerHTML=`<svg viewBox="0 0 600 160" width="100%" height="auto"><defs><linearGradient id="dg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6cf"/><stop offset=".45" stop-color="#ffd65a"/><stop offset="1" stop-color="#9a5a08"/></linearGradient></defs>
<path d="M10 90 C80 30 140 140 210 80 S330 30 390 90 S500 130 540 70" fill="none" stroke="#4a2200" stroke-width="34" stroke-linecap="round"/>
<path d="M10 90 C80 30 140 140 210 80 S330 30 390 90 S500 130 540 70" fill="none" stroke="url(#dg)" stroke-width="24" stroke-linecap="round"/>
<path d="M10 90 C80 30 140 140 210 80 S330 30 390 90 S500 130 540 70" fill="none" stroke="#fff3c4" stroke-width="4" stroke-dasharray="3 12" stroke-linecap="round"/>
<path d="M60 62 l-8 -22 l18 12 M150 112 l-6 22 l16 -14 M260 56 l-6 -24 l18 14 M360 66 l-4 -24 l16 16 M450 112 l-4 22 l16 -16" stroke="#ffd65a" stroke-width="6" fill="none" stroke-linecap="round"/>
<g transform="translate(540 70)"><path d="M-14 -22 L38 -10 L56 4 L36 12 L48 24 L18 22 L-10 20 Z" fill="url(#dg)" stroke="#4a2200" stroke-width="5" stroke-linejoin="round"/><circle cx="26" cy="-2" r="4" fill="#c2185b"/></g></svg>`;
}

function playFlashSheet(){
  const el=$('flashEl'); if(!el||mode!=='new')return;
  el.hidden=false; el.style.backgroundPosition='0 0';
  const t0=performance.now(), frames=8, size=256, dur=480;
  (function f(now){
    const k=Math.min(frames-1, Math.floor((now-t0)/dur*frames));
    el.style.backgroundPosition=(-k*size)+'px 0';
    if(now-t0<dur) requestAnimationFrame(f); else later(80,()=>{el.hidden=true});
  })(t0);
}

function mountBoard(withPop){
  world.insertAdjacentHTML('beforeend', boardHTML({in:true}));
  const cells=[...world.querySelectorAll('.hsG i')];
  cells.forEach((el,i)=>{
    el.className='sock'+(withPop?' pop':'');
    el.style.cssText=cellStyle('gold',false);
  });
  return cells;
}

async function playEntry(){
  resetWorld(); seed=1;
  window.__fxPreview.playing=true;
  window.__fxPreview.marks=[];
  mark('entry-start');
  if(mode==='old'){ encodeArt(); mark('art-encoded') }
  else { await preloaded; mark('assets-ready') }
  world.innerHTML=layers();
  if(mode==='old') setOldDragon();
  stage.classList.add('pre');
  later(380,()=>{
    const d=world.querySelector('.dragon'); if(d) d.classList.add('go');
    mark('dragon');
  });
  later(800,()=>{
    const t=world.querySelector('.title-slam'); if(t) t.classList.add('go');
    mark('title');
  });
  later(1350,()=>{
    stage.classList.remove('pre');
    const slam=world.querySelector('.title-slam'); if(slam) slam.remove();
    const drag=world.querySelector('.dragon'); if(drag) drag.remove();
    const cells=mountBoard(true);
    mark('board');
    later(500,()=>{
      START_CELLS.forEach((spec,n)=>later(n*160,()=>{
        const el=cells[spec.i];
        paintCell(el,spec,true);
        if(mode==='new'){
          const r=el.getBoundingClientRect(), s=stage.getBoundingClientRect();
          emit('spark', r.left-s.left+r.width/2, r.top-s.top+r.height/2, 6);
        }
        $('hsT').textContent=['2,000','5,000','6,000','14,000','17,000','25,000'][n];
        if(n===START_CELLS.length-1){ mark('entry-lands'); window.__fxPreview.playing=false; setStatus((mode==='old'?'舊版':'新版')+'進場結束。可接著播放跳獎。') }
      }));
    });
  });
  setStatus((mode==='old'?'舊版':'新版')+'進場播放中。');
}

function settleBoard(full){
  world.innerHTML=layers();
  const slam=world.querySelector('.title-slam'); if(slam) slam.remove();
  const drag=world.querySelector('.dragon'); if(drag) drag.remove();
  const orb=world.querySelector('.orb'); if(orb) orb.style.display='none';
  const cells=mountBoard(false);
  START_CELLS.forEach(spec=>paintCell(cells[spec.i],spec,false));
  if(full) FILL_REST.forEach(spec=>paintCell(cells[spec.i],spec,false));
  $('hsT').textContent=full?'80,000':'25,000';
  $('hsL').textContent=full?'0':'0';
  return cells;
}

function playPrize(grand){
  resetWorld(); seed=2;
  window.__fxPreview.playing=true;
  window.__fxPreview.marks=[];
  if(mode==='old') encodeArt();
  settleBoard(!!grand);
  mark('prize-start');
  later(30,()=>{
    stage.classList.add('hsDone');
    if(grand) stage.classList.add('full');
    if(mode==='new'){
      playFlashSheet();
      const r=stage.getBoundingClientRect();
      emit('coin', r.width/2, r.height*.42, grand?16:10);
      emit('spark', r.width/2, r.height*.42, grand?14:8);
      if(grand) emit('gem', r.width/2, r.height*.44, 6);
    }
    const wrap=world.querySelector('.hsEndWrap');
    const label=grand?'集滿 15 格！巨獎':'寶珠總獎金';
    const amt=grand?'80,000':'25,000';
    wrap.innerHTML=`<div class="hsEnd"><small>${label}</small><span class="amt">${amt}</span><button type="button">收下</button></div>`;
    mark('prize-card');
    later(900,()=>{ window.__fxPreview.playing=false; setStatus((mode==='old'?'舊版':'新版')+(grand?'巨獎':'跳獎')+'結束。') });
  });
  setStatus((mode==='old'?'舊版':'新版')+(grand?'巨獎':'跳獎')+'播放中。');
}

function setMode(m){
  mode=m;
  window.__fxPreview.mode=m;
  stage.classList.toggle('old', m==='old');
  stage.classList.toggle('new', m==='new');
  stage.dataset.mode=m;
  $('btnOld').classList.toggle('on', m==='old');
  $('btnNew').classList.toggle('on', m==='new');
  $('btnOld').setAttribute('aria-pressed', m==='old'?'true':'false');
  $('btnNew').setAttribute('aria-pressed', m==='new'?'true':'false');
  resetWorld();
  setStatus('目前為'+(m==='old'?'舊版':'新版')+'。請播放進場或跳獎。');
}

$('btnOld').onclick=()=>setMode('old');
$('btnNew').onclick=()=>setMode('new');
$('btnEntry').onclick=()=>playEntry();
$('btnPrize').onclick=()=>playPrize(false);
$('btnGrand').onclick=()=>playPrize(true);

window.__fxPreview.playEntry=playEntry;
window.__fxPreview.playPrize=playPrize;
window.__fxPreview.setMode=setMode;
window.__fxPreview.reset=resetWorld;

preloaded.then(()=>{ if(mode==='new') setStatus('新版圖資已備妥。請播放進場或跳獎。') });
})();
