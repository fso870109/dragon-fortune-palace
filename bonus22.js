/* v21.2 bonus presentation: in-machine stage, cinematic intro/outro, jewel/plaque art, HUD juice — play money only */
(function(){
const $=i=>document.getElementById(i),RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const tone=(...a)=>window.AV&&AV.tone(...a);
const sleep=ms=>new Promise(r=>setTimeout(r,RM?Math.min(ms,60):ms));
/* ---------- art: procedural sprites ---------- */
function cnv(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);return c}
const PAL={gold:['#fffbe6','#ffd65a','#c98a1c','#5a3200'],mini:['#eef8ff','#6fb6ff','#1f5fb0','#0a1f4a'],minor:['#effff6','#5be0a6','#178a5c','#06301f'],major:['#fff0f8','#ff7ab8','#c2185b','#4a0626'],col:['#fff6e0','#ffb347','#d2380e','#4a0a00'],jade:['#e8fff4','#6fd6a8','#1d7a58','#06281c']};
function jewel(k,S){const p=PAL[k];return cnv(S,S,(x,w)=>{const c=w/2,r=c*.9;
 // outer gold bezel
 let g=x.createLinearGradient(0,0,0,w);g.addColorStop(0,'#fff6cf');g.addColorStop(.45,'#ffd65a');g.addColorStop(.55,'#b87810');g.addColorStop(1,'#ffe39a');x.fillStyle=g;x.beginPath();x.arc(c,c,r,0,7);x.fill();
 x.lineWidth=w*.02;x.strokeStyle='#5a3200';x.stroke();
 // gem body
 const rr=r*.8;g=x.createRadialGradient(c-rr*.35,c-rr*.4,rr*.05,c,c,rr);g.addColorStop(0,p[0]);g.addColorStop(.35,p[1]);g.addColorStop(.8,p[2]);g.addColorStop(1,p[3]);x.fillStyle=g;x.beginPath();x.arc(c,c,rr,0,7);x.fill();
 // facets
 x.save();x.beginPath();x.arc(c,c,rr,0,7);x.clip();x.globalAlpha=.18;x.strokeStyle='#fff';x.lineWidth=w*.008;for(let i=0;i<8;i++){const a=i*Math.PI/4;x.beginPath();x.moveTo(c,c);x.lineTo(c+Math.cos(a)*rr,c+Math.sin(a)*rr);x.stroke()}x.globalAlpha=1;
 // inner glow
 g=x.createRadialGradient(c,c+rr*.25,0,c,c+rr*.25,rr*.7);g.addColorStop(0,'rgba(255,255,230,.55)');g.addColorStop(1,'rgba(255,255,230,0)');x.fillStyle=g;x.fillRect(0,0,w,w);
 // dragon emblem (embossed 龍)
 x.font=`900 ${rr*1.05}px "TCDisp","Noto Serif TC",serif`;x.textAlign='center';x.textBaseline='middle';x.fillStyle='rgba(0,0,0,.28)';x.fillText('龍',c+w*.012,c+w*.03);x.fillStyle='rgba(255,255,255,.22)';x.fillText('龍',c,c+w*.015);
 x.restore();
 // gloss
 g=x.createLinearGradient(0,c-rr,0,c);g.addColorStop(0,'rgba(255,255,255,.85)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.beginPath();x.ellipse(c,c-rr*.45,rr*.62,rr*.38,0,0,7);x.fill();
 x.fillStyle='rgba(255,255,255,.95)';x.beginPath();x.arc(c-rr*.45,c-rr*.5,rr*.09,0,7);x.fill()})}
function socket(S){return cnv(S,S,(x,w)=>{const c=w/2,r=c*.9;let g=x.createRadialGradient(c,c*.8,r*.1,c,c,r);g.addColorStop(0,'#3a1d52');g.addColorStop(1,'#12061e');x.fillStyle=g;x.beginPath();x.arc(c,c,r,0,7);x.fill();
 x.lineWidth=w*.035;g=x.createLinearGradient(0,0,0,w);g.addColorStop(0,'rgba(255,230,150,.75)');g.addColorStop(1,'rgba(120,70,10,.6)');x.strokeStyle=g;x.stroke();x.lineWidth=w*.01;x.strokeStyle='rgba(255,214,90,.35)';x.beginPath();x.arc(c,c,r*.78,0,7);x.stroke()})}
function sphere(S,cols){return cnv(S,S,(x,w)=>{const c=w/2,r=c*.92;const g=x.createRadialGradient(c-r*.35,c-r*.4,r*.05,c,c,r);cols.forEach((v,i)=>g.addColorStop(i/(cols.length-1),v));x.fillStyle=g;x.beginPath();x.arc(c,c,r,0,7);x.fill();x.fillStyle='rgba(255,255,255,.9)';x.beginPath();x.arc(c-r*.38,c-r*.42,r*.2,0,7);x.fill()})}
function frameSVG(c1,c2){return `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#fff6cf'/><stop offset='.5' stop-color='${c1}'/><stop offset='1' stop-color='${c2}'/></linearGradient></defs><rect x='3' y='3' width='54' height='54' rx='9' fill='none' stroke='url(#g)' stroke-width='5'/><rect x='8' y='8' width='44' height='44' rx='6' fill='none' stroke='#fff3c4' stroke-opacity='.5' stroke-width='1'/>${[[6,6],[54,6],[6,54],[54,54]].map(([a,b])=>`<path d='M${a-5} ${b} L${a} ${b-5} L${a+5} ${b} L${a} ${b+5}Z' fill='#fff3c4' stroke='#7a4a08' stroke-width='1'/>`).join('')}</svg>`)}")`}
const SPR={};
function art(){if(SPR.done)return;SPR.done=1;const S=128;['gold','mini','minor','major','col'].forEach(k=>SPR[k]=jewel(k,S).toDataURL());SPR.sock=socket(S).toDataURL();
 SPR.peg=sphere(24,['#fffbe6','#ffd65a','#a8640c','#4a2600']);SPR.ball=sphere(40,['#ffffff','#fff3d6','#e8c27a','#8a5a20']);
 const css=document.createElement('style');css.id='b22art';css.textContent=`
 html body #hsBox .hsG>i{background:url(${SPR.sock}) center/92% no-repeat!important;border:0!important;box-shadow:none!important}
 html body #hsBox .hsG>i.on{background:url(${SPR.gold}) center/100% no-repeat!important;border:0!important;box-shadow:0 0 14px rgba(255,200,90,.55)!important;border-radius:50%!important}
 html body #hsBox .hsG>i.on.mini{background-image:url(${SPR.mini})!important}#hsBox .hsG>i.on.minor{background-image:url(${SPR.minor})!important}#hsBox .hsG>i.on.major{background-image:url(${SPR.major})!important}#hsBox .hsG>i.on.col{background-image:url(${SPR.col})!important;box-shadow:0 0 22px rgba(255,140,40,1)!important}
 html body #hsBox .hsJp div{border:10px solid transparent!important;border-image:${frameSVG('#ffd65a','#a8640c')} 14 stretch!important;background:linear-gradient(180deg,rgba(60,24,80,.9),rgba(20,6,30,.95)) padding-box!important;border-radius:0!important}
 html body #hsBox .hsJp .mini{border-image-source:${frameSVG('#6fb6ff','#1f5fb0')}!important}#hsBox .hsJp .minor{border-image-source:${frameSVG('#5be0a6','#178a5c')}!important}#hsBox .hsJp .major{border-image-source:${frameSVG('#ff7ab8','#c2185b')}!important}`;document.body.appendChild(css)}
window.B22={SPR,art,swoop:t=>swoop(t)};
/* ---------- in-machine stage ---------- */
function stageRect(){const h=$('czHero'),b=$('board');if(!h||!b)return null;const a=h.getBoundingClientRect(),c=b.getBoundingClientRect();return {l:Math.min(a.left,c.left),t:Math.max(0,a.top),r:Math.max(a.right,c.right),b:c.bottom+8}}
function stage(){let s=$('b22Stage');if(!s){s=document.createElement('div');s.id='b22Stage';s.innerHTML='<div class="b22bg"></div><div class="b22rays"></div>';document.body.appendChild(s)}const r=stageRect();if(r)Object.assign(s.style,{left:r.l+'px',top:r.t+'px',width:(r.r-r.l)+'px',height:(r.b-r.t)+'px'});return s}
function fit(){const s=$('b22Stage');if(!s)return;const o=s.querySelector('.fxOv,#hsBox');if(!o)return;const inn=o.querySelector('.fxIn,.hsIn');if(!inn)return;inn.style.transform='none';const W=s.clientWidth-8,H=s.clientHeight-8,w=Math.max(inn.offsetWidth,inn.scrollWidth),h=Math.max(inn.offsetHeight,inn.scrollHeight);const k=Math.min(1,W/w,H/h);inn.style.transform=`scale(${k})`;inn.style.transformOrigin='50% 50%'}
new MutationObserver(ms=>{for(const m of ms)m.addedNodes.forEach(n=>{if(n.nodeType===1&&(n.id==='hsBox'||n.classList.contains('fxOv'))&&document.body.classList.contains('b22on')){art();const s=stage();s.appendChild(n);n.classList.add('b22in');requestAnimationFrame(fit);setTimeout(fit,120);try{new ResizeObserver(fit).observe(n.querySelector('.fxIn,.hsIn'))}catch(e){}}})}).observe(document.body,{childList:true});
addEventListener('resize',()=>{if(document.body.classList.contains('b22on')){stage();fit()}});
/* ---------- dragon swoop + title card ---------- */
const DRAGON=`<svg viewBox="0 0 600 160" width="600" height="160"><defs><linearGradient id="dg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6cf"/><stop offset=".45" stop-color="#ffd65a"/><stop offset="1" stop-color="#9a5a08"/></linearGradient></defs>
<path d="M10 90 C80 30 140 140 210 80 S330 30 390 90 S500 130 540 70" fill="none" stroke="#4a2200" stroke-width="34" stroke-linecap="round"/>
<path d="M10 90 C80 30 140 140 210 80 S330 30 390 90 S500 130 540 70" fill="none" stroke="url(#dg)" stroke-width="24" stroke-linecap="round"/>
<path d="M10 90 C80 30 140 140 210 80 S330 30 390 90 S500 130 540 70" fill="none" stroke="#fff3c4" stroke-width="4" stroke-dasharray="3 12" stroke-linecap="round"/>
<path d="M60 62 l-8 -22 l18 12 M150 112 l-6 22 l16 -14 M260 56 l-6 -24 l18 14 M360 66 l-4 -24 l16 16 M450 112 l-4 22 l16 -16" stroke="#ffd65a" stroke-width="6" fill="none" stroke-linecap="round"/>
<g transform="translate(540 70)"><path d="M-14 -22 L38 -10 L56 4 L36 12 L48 24 L18 22 L-10 20 Z" fill="url(#dg)" stroke="#4a2200" stroke-width="5" stroke-linejoin="round"/><path d="M4 -22 L-6 -46 L14 -28 M20 -18 L22 -44 L32 -20" stroke="#ffd65a" stroke-width="5" fill="none"/><circle cx="26" cy="-2" r="4" fill="#c2185b"/><path d="M56 4 C80 0 90 -14 100 -8 M50 16 C76 22 86 36 96 32" stroke="#ffe680" stroke-width="3" fill="none"/></g>
<circle cx="14" cy="90" r="0"/></svg>`;
function swoop(title){return new Promise(res=>{const d=document.createElement('div');d.className='b22drag';d.innerHTML=DRAGON;document.body.appendChild(d);
 tone(900,0,.9,'sawtooth',.025,140);tone(220,.1,.8,'triangle',.04,90);
 const t=document.createElement('div');t.className='b22title';t.innerHTML=`<b>${title}</b>`;setTimeout(()=>{document.body.appendChild(t);[392,523,659,784].forEach((f,i)=>tone(f,i*.06,.35,'square',.035));tone(98,0,.6,'sine',.12);window.shake&&shake(2)},RM?0:420);
 setTimeout(()=>{d.remove()},RM?100:1300);setTimeout(()=>{t.classList.add('out');setTimeout(()=>t.remove(),450)},RM?300:1500);setTimeout(res,RM?200:1350)})}
/* ---------- flow overrides ---------- */
const F=window.F21||{};const _back=F.back;
F.pre=async function(title){art();document.body.classList.add('f21pre');const b=$('board');b&&b.classList.add('b22away');tone(300,0,.5,'sawtooth',.02,1200);
 await sleep(RM?50:380);const s=stage();document.body.classList.add('b22on');s.classList.remove('out');void s.offsetWidth;s.classList.add('show');
 await swoop(title||'特殊事件');window.F21&&F21.bedOn&&F21.bedOn()};
F.back=function(){const s=$('b22Stage');const w=$('czWin');
 if(s&&w&&window.W21&&W21.trail){const a=s.getBoundingClientRect(),c=w.getBoundingClientRect();for(let i=0;i<18;i++)setTimeout(()=>W21.trail(a.left+a.width/2+(Math.random()-.5)*120,a.top+a.height*.55+(Math.random()-.5)*80,c.left+c.width/2,c.top+c.height/2),i*35)}
 setTimeout(()=>{if(s){s.classList.add('out');s.classList.remove('show')}document.body.classList.remove('b22on');const b=$('board');if(b){b.classList.remove('b22away');b.classList.add('b22back');setTimeout(()=>b.classList.remove('b22back'),900)}},350);
 _back&&_back()};
window.F21=F;
/* free games: dragon + title before the existing intro */

/* ---------- hold & spin HUD juice ---------- */
new MutationObserver(ms=>{for(const m of ms){const t=m.target;
 if(m.type==='childList'||m.type==='characterData'){const el=t.nodeType===3?t.parentNode:t;if(el&&el.id==='hsL'){el.classList.remove('b22bump');void el.offsetWidth;el.classList.add('b22bump');const box=$('hsBox');if(box){const one=el.textContent.trim()==='1';box.classList.toggle('tense',one);if(one){tone(70,0,.25,'sine',.14);tone(70,.32,.25,'sine',.1)}}}
  if(el&&el.id==='hsT'){el.classList.remove('b22bump');void el.offsetWidth;el.classList.add('b22bump')}}
 else if(m.type==='attributes'&&t.tagName==='I'&&t.classList.contains('suck')&&!t._b22s){t._b22s=1;setTimeout(()=>t._b22s=0,900);const col=document.querySelector('#hsBox .hsG>i.col');if(col&&window.W21&&W21.trail){const a=t.getBoundingClientRect(),b=col.getBoundingClientRect();for(let i=0;i<3;i++)setTimeout(()=>W21.trail(a.left+a.width/2,a.top+a.height/2,b.left+b.width/2,b.top+b.height/2),i*90)}}
 else if(m.type==='attributes'&&t.tagName==='I'&&t.classList.contains('on')&&!t._b22o&&t.closest('#hsBox')){t._b22o=1;const g=t.closest('.hsG');g&&(g.classList.remove('b22hit'),void g.offsetWidth,g.classList.add('b22hit'))}}
}).observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class']});
})();
