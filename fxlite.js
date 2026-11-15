/* v28.121 lightweight FX — pooled canvas particles, sprite flash, pre-rendered vig/bloom. Presentation only. */
(function(){
'use strict';
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const V='?v=28121';
const BASE='assets/fxlite/';
const NEED=['coin','gem','spark','flash-sheet','vig','bloom','rays','halo','ring'];
const imgs={};
function load(k){return new Promise(ok=>{const i=new Image();i.onload=()=>{imgs[k]=i;ok(i)};i.onerror=()=>ok(null);i.src=BASE+k+'.webp'+V})}
const ready=Promise.all(NEED.map(load));
try{NEED.forEach(k=>{if(!imgs[k]){const i=new Image();i.src=BASE+k+'.webp'+V;imgs[k]=i}})}catch(e){}

function scale(){
  if(RM) return 0;
  const p=window.DFPPERF;
  if(!p) return 1;
  const s=p.scale!=null?p.scale:1;
  return p.tier===0?s*.65:s;
}
function cap(n){const s=scale();if(s<=0)return 0;return Math.max(0,Math.round(n*s))}

let host=null,cv=null,ctx=null,raf=0,dpr=1,parts=[],flashT=0,rings=[];
let _sw=0,_sh=0;
function size(force){
  if(!cv||!host)return;
  const ww=innerWidth,hh=innerHeight;
  if(!force && ww===_sw && hh===_sh && cv.width)return;
  _sw=ww;_sh=hh;
  dpr=Math.min(2,devicePixelRatio||1);
  const w=Math.max(1,Math.round(ww*dpr)),h=Math.max(1,Math.round(hh*dpr));
  if(cv.width!==w||cv.height!==h){cv.width=w;cv.height=h}
  cv.style.width=ww+'px';cv.style.height=hh+'px';
}
function world(){
  host=document.getElementById('fxLite');
  if(!host){
    host=document.createElement('div');host.id='fxLite';host.setAttribute('aria-hidden','true');
    host.innerHTML='<div class="fxLvig"></div><div class="fxLbloom"></div><div class="fxLflash" id="fxLflash"></div><canvas></canvas>';
    document.body.appendChild(host);
  }
  cv=host.querySelector('canvas');ctx=cv.getContext('2d',{alpha:true});
  size();
  host.classList.add('go');
  document.documentElement.classList.add('twFx');
  document.body.classList.add('twFx');
  return host;
}
function kill(){
  parts.length=0;rings.length=0;flashT=0;
  if(raf){cancelAnimationFrame(raf);raf=0}
  if(ctx&&cv)ctx.clearRect(0,0,cv.width,cv.height);
  if(host){host.classList.remove('go');const fl=host.querySelector('.fxLflash');if(fl)fl.style.opacity='0'}
  document.body.classList.remove('twFx','twShake','twPunch');
  document.documentElement.classList.remove('twFx');
}
function boot(){if(!raf)raf=requestAnimationFrame(tick)}
function emit(kind,x,y,n,opts){
  n=cap(n);if(!n)return;
  world();
  opts=opts||{};
  const W=innerWidth,H=innerHeight;
  for(let i=0;i<n;i++){
    const rain=kind==='rain'||kind==='coinfall';
    const gem=kind==='gem'||(rain&&Math.random()<.18);
    const k=gem?'gem':(kind==='spark'?'spark':'coin');
    parts.push({
      k,
      x:x!=null?x+(Math.random()-.5)*(opts.spread||40):Math.random()*W,
      y:y!=null?y+(Math.random()-.5)*(opts.spread||20):-12-Math.random()*30,
      vx:opts.vx!=null?opts.vx+(Math.random()-.5)*40:(rain?((Math.random()-.5)*48):((Math.random()-.5)*140)),
      vy:opts.vy!=null?opts.vy-(20+Math.random()*80):(rain?(80+Math.random()*90):(-40-Math.random()*160)),
      g:rain?420:220,
      life:0,
      max:rain?(.88+Math.random()*.9):(.55+Math.random()*.5),
      rot:Math.random()*6,
      vr:(Math.random()-.5)*8,
      sc:.45+Math.random()*.7,
      delay:rain?Math.random()*.32:0
    });
  }
  const maxP=Math.round(80+40*scale());
  if(parts.length>maxP)parts.splice(0,parts.length-maxP);
  boot();
}
function rain(n){emit('rain',null,null,n==null?(innerWidth<=360?16:24):n)}
function streaks(n){
  n=cap(n==null?(innerWidth<=360?4:6):n);if(!n)return;
  world();
  const W=innerWidth,H=innerHeight;
  for(let i=0;i<n;i++){
    parts.push({
      k:'streak',
      x:(.15+Math.random()*.7)*W,
      y:(.22+Math.random()*.5)*H,
      vx:0,vy:0,g:0,
      a:(Math.random()*150-75)*Math.PI/180,
      life:0,max:.62,delay:Math.random()*.09,sc:1,rot:0,vr:0
    });
  }
  boot();
}
function sparks(x,y,n){emit('spark',x,y,n==null?8:n,{spread:36,vy:-30})}
function coins(x,y,n){emit('coin',x,y,n==null?10:n,{spread:50,vy:-80})}
function flash(x,y){
  if(scale()<=0)return;
  world();
  const fl=host.querySelector('.fxLflash');if(!fl)return;
  flashT=performance.now();
  fl.style.opacity='1';
  fl.style.backgroundPosition='0 0';
  if(x!=null){fl.style.left='0';fl.style.top='0'}
  boot();
}
function ringAt(x,y,n){
  n=cap(n==null?3:n);if(!n)return;
  world();
  for(let i=0;i<n;i++)rings.push({x,y,life:0,max:.72,delay:i*.1});
  boot();
}
function impact(){
  if(scale()<=0)return;
  world();
  const b=document.getElementById('board');
  let x=innerWidth/2,y=innerHeight*.42;
  if(b){const r=b.getBoundingClientRect();x=r.left+r.width/2;y=r.top+r.height/2}
  flash(x,y);ringAt(x,y,3);
  document.body.classList.remove('twShake');
  requestAnimationFrame(()=>{
    document.body.classList.add('twShake');
    setTimeout(()=>document.body.classList.remove('twShake'),560);
  });
}
let last=0;
function tick(now){
  if(!ctx||!cv){raf=0;return}
  size();
  const W=cv.width/dpr,H=cv.height/dpr;
  ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.clearRect(0,0,W,H);
  const dt=Math.min(.05,(now-(last||now))/1000);last=now;
  /* flash sheet: 8 frames over 480ms via background-position */
  if(flashT){
    const fl=host&&host.querySelector('.fxLflash');
    const u=(now-flashT)/480;
    if(fl){
      if(u>=1){fl.style.opacity='0';flashT=0}
      else{
        const k=Math.min(7,Math.floor(u*8));
        const fw=fl.clientWidth||innerWidth;
        fl.style.backgroundSize=(fw*8)+'px 100%';
        fl.style.backgroundPosition=(-k*fw)+'px 0';
        fl.style.opacity=String(1-u*.15);
      }
    }
  }
  let w=0;
  for(let i=0;i<parts.length;i++){
    const p=parts[i];
    if(p.delay>0){p.delay-=dt;parts[w++]=p;continue}
    p.life+=dt;
    const k=1-p.life/p.max;
    if(k<=0)continue;
    if(p.k==='streak'){
      const len=90*(.6+k*.4);
      ctx.save();
      ctx.globalAlpha=Math.max(0,k);
      ctx.translate(p.x,p.y);ctx.rotate(p.a);
      const g=ctx.createLinearGradient(-len/2,0,len/2,0);
      g.addColorStop(0,'rgba(255,246,207,0)');g.addColorStop(.5,'#fff6cf');g.addColorStop(1,'rgba(255,246,207,0)');
      ctx.fillStyle=g;ctx.fillRect(-len/2,-1.5,len,3);
      ctx.restore();
      parts[w++]=p;continue;
    }
    p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=p.g*dt;p.rot+=p.vr*dt;
    const im=imgs[p.k];
    ctx.save();ctx.globalAlpha=Math.max(0,k);ctx.translate(p.x,p.y);ctx.rotate(p.rot);
    const s=(p.k==='spark'?14:18)*p.sc;
    if(im&&im.complete&&im.naturalWidth)ctx.drawImage(im,-s/2,-s/2,s,s);
    else{
      ctx.fillStyle=p.k==='gem'?'#7ee0ff':'#ffd65a';
      ctx.beginPath();ctx.arc(0,0,s*.4,0,7);ctx.fill();
    }
    ctx.restore();
    parts[w++]=p;
  }
  parts.length=w;
  /* rings: pre-rendered sprite, scale + opacity */
  let rw=0;
  for(let i=0;i<rings.length;i++){
    const r=rings[i];
    if(r.delay>0){r.delay-=dt;rings[rw++]=r;continue}
    r.life+=dt;
    const k=Math.min(1,r.life/r.max);
    if(k>=1)continue;
    const im=imgs.ring;
    const s=36+k*140;
    ctx.save();ctx.globalAlpha=1-k;ctx.translate(r.x,r.y);
    if(im&&im.complete&&im.naturalWidth)ctx.drawImage(im,-s/2,-s/2,s,s);
    else{ctx.strokeStyle='rgba(255,226,150,'+(1-k)+')';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,s/2,0,7);ctx.stroke()}
    ctx.restore();
    rings[rw++]=r;
  }
  rings.length=rw;
  if(parts.length||rings.length||flashT)raf=requestAnimationFrame(tick);
  else{raf=0;ctx.clearRect(0,0,W,H)}
}

/* 寶珠對碰: play flash when hsDone is applied; no extra coin rain (keep the look) */
const mo=new MutationObserver(ms=>{
  for(const m of ms){
    const t=m.target;
    if(t && t.id==='hsBox' && t.classList.contains('hsDone') && !t._fxLdone){
      t._fxLdone=1;impact();
    }
  }
});
function watchHs(){try{mo.observe(document.documentElement,{subtree:true,attributes:true,attributeFilter:['class']})}catch(e){}}
if(document.readyState==='loading')addEventListener('DOMContentLoaded',watchHs);else watchHs();

function warm(){try{world();size(true);if(host)host.classList.remove('go')}catch(e){}}
addEventListener('load',()=>{const ri=window.requestIdleCallback||(f=>setTimeout(f,40));ri(warm,{timeout:2000})});
window.FXLITE={
  ready:()=>ready, scale, world, kill, rain, streaks, sparks, coins, flash, impact, ring:ringAt,
  get RM(){return RM}
};
})();
