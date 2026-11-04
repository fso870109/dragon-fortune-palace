/* v21.1 win-moment FX: frame light chase, symbol animations, beam particles, coins, godrays, merged big-win sequence */
(function(){
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches,$=i=>document.getElementById(i);
const tone=(...a)=>window.AV&&AV.tone(...a);
/* ---------- particle engine (one canvas, additive, sprite-based, capped) ---------- */
const CAP=innerWidth<620?110:220,DPR=Math.min(innerWidth<620?1:1.25,devicePixelRatio||1);let cv,cx,W,H,P=[],rays=null,run=false;
function spr(sz,fn){const c=document.createElement('canvas');c.width=c.height=sz;fn(c.getContext('2d'),sz);return c}
const S={
 glow:spr(64,(x,s)=>{const g=x.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);g.addColorStop(0,'rgba(255,255,240,1)');g.addColorStop(.25,'rgba(255,220,120,.85)');g.addColorStop(1,'rgba(255,150,30,0)');x.fillStyle=g;x.fillRect(0,0,s,s)}),
 star:spr(64,(x,s)=>{const c=s/2;const g=x.createRadialGradient(c,c,0,c,c,c*.35);g.addColorStop(0,'#fff');g.addColorStop(1,'rgba(255,220,120,0)');x.fillStyle=g;x.fillRect(0,0,s,s);x.globalCompositeOperation='lighter';[[1,0],[0,1]].forEach(([a,b])=>{const l=x.createLinearGradient(c-c*a,c-c*b,c+c*a,c+c*b);l.addColorStop(0,'rgba(255,230,150,0)');l.addColorStop(.5,'rgba(255,255,240,1)');l.addColorStop(1,'rgba(255,230,150,0)');x.fillStyle=l;a?x.fillRect(0,c-1.5,s,3):x.fillRect(c-1.5,0,3,s)})}),
 coin:spr(64,(x,s)=>{const c=s/2,r=c-3;let g=x.createRadialGradient(c*.7,c*.6,2,c,c,r);g.addColorStop(0,'#fffbe0');g.addColorStop(.35,'#ffd65a');g.addColorStop(.8,'#c98a1c');g.addColorStop(1,'#7a4a08');x.fillStyle=g;x.beginPath();x.arc(c,c,r,0,7);x.fill();x.lineWidth=3;x.strokeStyle='#8a5a10';x.stroke();x.beginPath();x.arc(c,c,r*.68,0,7);x.lineWidth=2;x.strokeStyle='rgba(255,245,200,.8)';x.stroke();x.fillStyle='#9a6510';x.font=`900 ${r}px "TCDisp","Noto Serif TC",serif`;x.textAlign='center';x.textBaseline='middle';x.fillText('龍',c,c+1);x.fillStyle='rgba(255,255,255,.55)';x.beginPath();x.ellipse(c*.72,c*.62,r*.28,r*.14,-.6,0,7);x.fill()})};
S.coinD=spr(64,(x,s)=>{x.drawImage(S.coin,0,0);x.globalCompositeOperation='source-atop';x.fillStyle='rgba(60,30,0,.35)';x.fillRect(0,0,s,s)});
S.ray=spr(256,(x,s)=>{const g=x.createLinearGradient(0,0,s,0);g.addColorStop(0,'rgba(255,230,150,.9)');g.addColorStop(1,'rgba(255,200,80,0)');x.fillStyle=g;x.beginPath();x.moveTo(0,s/2);x.lineTo(s,s*.38);x.lineTo(s,s*.62);x.fill()});
function ensure(){if(cv)return;cv=document.createElement('canvas');cv.id='w21C';document.body.appendChild(cv);cx=cv.getContext('2d');const rs=()=>{W=innerWidth;H=innerHeight;cv.width=W*DPR;cv.height=H*DPR;cx.setTransform(DPR,0,0,DPR,0,0)};rs();addEventListener('resize',rs)}
function add(p){if(RM)return;ensure();if(P.length>=CAP)P.shift();p.t=0;P.push(p);if(!run){run=true;requestAnimationFrame(loop)}}
const ease=t=>1-Math.pow(1-t,3);
let lt=0;function loop(now){const dt=Math.min(.05,(now-(lt||now))/1000);lt=now;cx.clearRect(0,0,W,H);
 if(rays){rays.t+=dt;const k=Math.min(1,rays.t/.4)*Math.max(0,Math.min(1,(rays.d-rays.t)/.8));if(k<=0)rays=null;else{cx.save();cx.globalCompositeOperation='lighter';cx.translate(rays.x,rays.y);cx.rotate(rays.t*.35);const n=rays.n,R=Math.hypot(W,H)*.75;cx.globalAlpha=.32*k;for(let i=0;i<n;i++){cx.rotate(6.2832/n);cx.drawImage(S.ray,0,-R*.14,R,R*.28)}cx.globalAlpha=1;cx.restore()}}
 for(let i=P.length-1;i>=0;i--){const p=P[i];p.t+=dt;const u=p.t/p.life;if(u>=1){P.splice(i,1);continue}
  if(p.path){const q=p.path,L=q.len,d=ease(Math.min(1,u))*L;const pt=at(q,d);p.x=pt[0];p.y=pt[1]}else{p.vy+=(p.g||0)*dt;p.vx*=p.drag||1;p.vy*=p.drag||1;p.x+=p.vx*dt;p.y+=p.vy*dt}
  const a=u<.15?u/.15:1-Math.pow((u-.15)/.85,2);
  if(p.k==='coin'){const ph=p.ph+p.t*p.sp,sx=Math.cos(ph),sz=p.s;cx.globalCompositeOperation='source-over';
   for(let m=2;m>=0;m--){cx.globalAlpha=a*(m?0.18/m:1);cx.save();cx.translate(p.x-p.vx*dt*m*1.6,p.y-p.vy*dt*m*1.6);cx.rotate(p.r);cx.scale(Math.max(.08,Math.abs(sx)),1);cx.drawImage(sx<0?S.coinD:S.coin,-sz/2,-sz/2,sz,sz);cx.restore()}}
  else{cx.globalCompositeOperation='lighter';cx.globalAlpha=a*(p.a||1);const sz=p.s*(p.k==='star'?(.6+.4*Math.sin(p.t*14+p.ph)):1);cx.drawImage(S[p.k],p.x-sz/2,p.y-sz/2,sz,sz)}}
 cx.globalAlpha=1;cx.globalCompositeOperation='source-over';if(P.length||rays)requestAnimationFrame(loop);else{run=false;lt=0;cx.clearRect(0,0,W,H)}}
function at(q,d){let i=0;while(i<q.seg.length-1&&q.acc[i+1]<d)i++;const s=q.seg[i],f=(d-q.acc[i])/(s.l||1);return [s.x0+(s.x1-s.x0)*f,s.y0+(s.y1-s.y0)*f]}
function burst(x,y,n,spd,k){for(let i=0;i<n;i++){const a=Math.random()*6.283,v=spd*(.35+Math.random()*.65);add({k:k||(i%3?'glow':'star'),x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,g:60,drag:.96,life:.6+Math.random()*.5,s:(k==='star'?26:14)+Math.random()*12,ph:Math.random()*6})}}
function coins(n,tier){for(let i=0;i<n;i++){const fromTop=tier>=2&&i%2;add({k:'coin',x:fromTop?Math.random()*W:W/2+(Math.random()-.5)*60,y:fromTop?-30-Math.random()*H*.5:H*.62,vx:fromTop?(Math.random()-.5)*40:(Math.random()-.5)*520,vy:fromTop?80+Math.random()*120:-(520+Math.random()*420),g:fromTop?380:900,drag:.995,life:2.2+Math.random()*1.4,s:20+Math.random()*16,ph:Math.random()*6,sp:6+Math.random()*8,r:(Math.random()-.5)*.5})}}
function dust(n){for(let i=0;i<n;i++)add({k:i%4?'glow':'star',x:Math.random()*W,y:H*(.2+Math.random()*.6),vx:(Math.random()-.5)*30,vy:-20-Math.random()*40,g:0,drag:1,life:1.4+Math.random()*1.4,s:8+Math.random()*16,a:.8,ph:Math.random()*6})}
/* ---------- symbol motion styles ---------- */
const CHAR=/heroine|woman|hero$|oni|parrot|(?<!black)cat|neko|trex|lion|dragon|daruma/,GEM=/gem|jade|emerald|diamond|ring|^love$|crystal/,COIN=/coin|koban|ingot|hongbao|paper|^fu$|kamon/,SHINE=/bar|seven|sevens|7|^red7|^blue7|trophy|crown|car|chest|castle|fireworks|kitsune|blackcat|city/;
function styleOf(id){if(id==='wild')return 'wild';if(id==='scatter')return 'scatter';if(CHAR.test(id))return 'char';if(GEM.test(id))return 'gem';if(COIN.test(id))return 'coin';if(SHINE.test(id))return 'shine';return 'bounce'}
const HI=new Set();try{SYM.forEach((s,i)=>{if(i>=7)HI.add(s.id)})}catch(e){}
/* ---------- frame light chase ---------- */
function frameEls(){const b=$('board');if(!b)return null;const par=b.offsetParent;if(!par)return null;let f=$('w21F'),bl=$('w21Bloom');if(!f){f=document.createElement('div');f.id='w21F';par.appendChild(f);bl=document.createElement('div');bl.id='w21Bloom';par.appendChild(bl)}
 const pad=5;[f,bl].forEach(e=>Object.assign(e.style,{left:(b.offsetLeft-pad)+'px',top:(b.offsetTop-pad)+'px',width:(b.offsetWidth+pad*2)+'px',height:(b.offsetHeight+pad*2)+'px',boxSizing:'border-box'}));return [f,bl]}
let active=false,clearT=0;
function winOn(o){const tier=o.xr>=50?3:o.xr>=25?2:o.xr>=10?1:0;const fe=frameEls();active=true;clearTimeout(clearT);
 if(fe){const [f,bl]=fe;f.className='go t'+tier;bl.className='on t'+tier}
 const b=$('board');b.classList.add('w21on');
 const hits=[...b.querySelectorAll('.cell.hit')];hits.forEach((c,i)=>{const id=c.dataset.s||'';c.dataset.w=styleOf(id);c.classList.toggle('hi',HI.has(id));c.classList.add('w21a');const sym=c.querySelector('.sym');if(sym)sym.style.animationDelay=(i%5)*-.08+'s';if(!c.querySelector('.w21sh')){const s=document.createElement('span');s.className='w21sh';s.style.animationDelay=(i*.07)+'s';c.appendChild(s)}
  const r=c.getBoundingClientRect();setTimeout(()=>burst(r.left+r.width/2,r.top+r.height/2,HI.has(id)?14:8,HI.has(id)?260:180),i*40)});
 b.querySelectorAll('.cell.sc').forEach(c=>c.classList.add('w21sc'));
 // beam particles along paylines
 const lines=[...document.querySelectorAll('#lines polyline.core')].slice(0,6);lines.forEach((pl,li)=>{const q=pathOf(pl);if(!q)return;for(let j=0;j<(tier?6:4);j++)setTimeout(()=>add({k:'glow',path:q,x:0,y:0,life:1.1,s:22,a:1}),li*120+j*160);for(let j=0;j<3;j++)setTimeout(()=>add({k:'star',path:q,x:0,y:0,life:1.1,s:30,ph:j}),li*120+j*260+80)});
 // screen layer
 const v=$('w21V')||(()=>{const e=document.createElement('div');e.id='w21V';document.body.appendChild(e);return e})();v.style.opacity='';v.classList.remove('go');void v.offsetWidth;v.style.setProperty('--k',tier);v.classList.add('go');
 const m=$('machine');if(m){m.classList.remove('w21punch');void m.offsetWidth;m.classList.add('w21punch')}
 const h=$('czHero');h&&h.classList.add('w21br');
 const w=$('czWin');if(w){w.classList.add('w21up');setTimeout(()=>w.classList.remove('w21up'),900)}
 dust(tier?24:8);if(tier===0){coins(Math.min(14,4+Math.round(o.xr*2)),0)}
 // short-win beat sfx
 if(tier===0)[0,.12,.24].forEach((t,i)=>tone([1047,1319,1568][i],t,.22,'triangle',.05));
 clearT=setTimeout(winOff,tier?9000:3200)}
function winOff(){if(!active)return;active=false;const f=$('w21F'),bl=$('w21Bloom');if(f){f.classList.add('off');setTimeout(()=>{f.className=''},500)}if(bl)bl.className='';const b=$('board');b&&b.classList.remove('w21on');const h=$('czHero');h&&h.classList.remove('w21br');
 document.querySelectorAll('#board .cell.w21a').forEach(c=>{const s=c.querySelector('.sym');const done=()=>{c.classList.remove('w21a','hi');c.querySelector('.w21sh')?.remove()};if(!s||RM)return done();let fin=false;s.addEventListener('animationiteration',()=>{if(!fin){fin=true;done()}},{once:true});setTimeout(()=>{if(!fin){fin=true;done()}},1300)})}
function pathOf(pl){const pts=pl.points;if(!pts||!pts.numberOfItems)return null;const M=pl.getScreenCTM();if(!M)return null;const P2=[];for(let i=0;i<pts.numberOfItems;i++){const p=pts.getItem(i);P2.push([M.a*p.x+M.c*p.y+M.e,M.b*p.x+M.d*p.y+M.f])}
 const seg=[],acc=[0];let L=0;for(let i=0;i<P2.length-1;i++){const [x0,y0]=P2[i],[x1,y1]=P2[i+1],l=Math.hypot(x1-x0,y1-y0);seg.push({x0,y0,x1,y1,l});L+=l;acc.push(L)}return {seg,acc,len:L}}
/* ---------- hooks ---------- */
const CZo=window.CZ&&CZ.onSettle;if(CZo)CZ.onSettle=function(o){const r=CZo.apply(this,arguments);try{if(o.won>0)setTimeout(()=>winOn(o),30)}catch(e){console.error(e)}return r};
const lf=window.landFX;let landN=0;if(lf)window.landFX=function(c){if(active||document.querySelector('#board.w21on'))winOff();const r=lf.apply(this,arguments);try{const reel=document.querySelectorAll('#board .reel')[c]||null;if(reel){const R=reel.getBoundingClientRect();for(let i=0;i<5;i++)add({k:'glow',x:R.left+Math.random()*R.width,y:R.bottom-4,vx:(Math.random()-.5)*60,vy:-40-Math.random()*60,g:120,drag:.97,life:.45,s:10+Math.random()*8,a:.7})}}catch(e){}return r};
// spin start ring + clear
document.addEventListener('pointerdown',e=>{const s=e.target.closest&&e.target.closest('#spinBtn');if(!s||s.disabled)return;const r=document.createElement('span');r.className='w21ring';s.appendChild(r);setTimeout(()=>r.remove(),600);winOff()},true);
{const b0=document.getElementById('board');b0&&new MutationObserver(()=>{if(b0.getAttribute('aria-busy')==='true')winOff()}).observe(b0,{attributes:true,attributeFilter:['aria-busy']})}
/* ---------- merged big-win sequence ---------- */
const _bw=window.bigWin;if(_bw){window.bigWin=function(won,total,o){o=o||{};const x=won/total;
  if(!o.tier){o=Object.assign({},o,{tier:x>=50?['epic','傳說大獎','龍運降臨!! 傳說級獎金']:x>=25?['mega','超級大獎','金殿狂歡!! 超級獎金']:['big','大獎','好運降臨!! 大獎']})}
  pend={won,total,x};const r=_bw.call(this,won,total,o);return r}}
let pend=null;function seq(){const p=pend;pend=null;if(!p)return;const x=p.x;
  try{const t=$('bwTier');if(t){t.classList.remove('w21imp');void t.offsetWidth;t.classList.add('w21imp');const sp=document.createElement('span');sp.className='w21ts';sp.textContent=t.textContent;t.appendChild(sp)}
   const tier=x>=50?3:x>=25?2:1,dur=RM?600:Math.min(6500,2200+x*45);
   rays={x:innerWidth/2,y:innerHeight*.42,t:0,d:dur/1000+1.5,n:tier==1?10:tier==2?14:18};ensure();if(!run){run=true;requestAnimationFrame(loop)}
   coins([0,40,80,140][tier],tier);dust(tier*14);
   const beats=tier+2;for(let i=1;i<=beats;i++)setTimeout(()=>{if(!bwState||bwState.fin)return;const a=$('bwAmt');[t,a].forEach(e=>{if(!e)return;e.classList.remove('w21beat');void e.offsetWidth;e.classList.add('w21beat')});
     const base=[523,587,659,784,880][i%5];tone(base,0,.25,'triangle',.06);tone(base*1.5,.02,.25,'triangle',.04);tone(base/2,0,.3,'sine',.08);coins(tier*6,tier);burst(innerWidth/2,innerHeight*.45,10+tier*4,300,'star');window.shake&&shake(Math.min(4,tier+1))},dur*i/(beats+1));
  }catch(e){console.error(e)}}
const bwEl=$('bw');if(bwEl)new MutationObserver(()=>{if(bwEl.classList.contains('show')&&pend)seq()}).observe(bwEl,{attributes:true,attributeFilter:['class']});
// stop old duplicate callout from av.js (merged into one sequence)
const css=document.createElement('style');css.textContent='#avCall{display:none!important}';document.head.appendChild(css);
// orbs: burst on lock
new MutationObserver(ms=>{for(const m of ms){const t=m.target;if(t.tagName==='I'&&t.classList.contains('on')&&!t._w21&&t.closest('#hsBox')){t._w21=1;const r=t.getBoundingClientRect();burst(r.left+r.width/2,r.top+r.height/2,10,200)}}}).observe(document.body,{subtree:true,attributes:true,attributeFilter:['class']});
function trail(x0,y0,x1,y1){const l=Math.hypot(x1-x0,y1-y0)||1;const q={seg:[{x0,y0,x1,y1,l}],acc:[0,l],len:l};add({k:'glow',path:q,x:x0,y:y0,life:.55,s:22,a:1});add({k:'star',path:q,x:x0,y:y0,life:.6,s:28,ph:Math.random()*6})}
window.W21={winOn,winOff,burst,coins,styleOf,trail};
})();
