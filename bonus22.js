/* v28.17 bonus presentation: richer 3D metallic jewels, contained fill; theme-symbol spins — play money only */
(function(){
const $=i=>document.getElementById(i),RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const tone=(...a)=>window.AV&&AV.tone(...a);
const sleep=ms=>new Promise(r=>setTimeout(r,RM?Math.min(ms,60):ms));
/* ---------- art: procedural sprites ---------- */
function cnv(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);return c}
const PAL={gold:['#fffbe6','#ffd65a','#c98a1c','#5a3200'],mini:['#eef8ff','#6fb6ff','#1f5fb0','#0a1f4a'],minor:['#effff6','#5be0a6','#178a5c','#06301f'],major:['#fff0f8','#ff7ab8','#c2185b','#4a0626'],col:['#fff6e0','#ffb347','#d2380e','#4a0a00'],jade:['#e8fff4','#6fd6a8','#1d7a58','#06281c']};
function jewel(k,S){const p=PAL[k];return cnv(S,S,(x,w)=>{
 const c=w/2,R=c*.94; /* fill cell short side; CSS clips overflow */
 // deep contact shadow (in-canvas, no CSS bleed)
 x.fillStyle='rgba(0,0,0,.55)';x.beginPath();x.ellipse(c,c+R*.78,R*.78,R*.2,0,0,7);x.fill();
 // ----- outer metal rim (thickness) -----
 let g=x.createLinearGradient(0,c-R,0,c+R);
 g.addColorStop(0,'#fff8d6');g.addColorStop(.12,'#ffe9a0');g.addColorStop(.28,'#e8b840');
 g.addColorStop(.42,'#8a4a0c');g.addColorStop(.55,'#3a1800');g.addColorStop(.7,'#d4a028');
 g.addColorStop(.88,'#fff0b8');g.addColorStop(1,'#c98a1c');
 x.fillStyle=g;x.beginPath();x.arc(c,c,R,0,7);x.fill();
 x.lineWidth=Math.max(2,w*.028);x.strokeStyle='#1a0800';x.stroke();
 // milled coin edge
 x.save();x.strokeStyle='rgba(60,25,0,.65)';x.lineWidth=w*.012;
 for(let i=0;i<36;i++){const a=i*Math.PI/18,r0=R*.91,r1=R*.995;x.beginPath();x.moveTo(c+Math.cos(a)*r0,c+Math.sin(a)*r0);x.lineTo(c+Math.cos(a)*r1,c+Math.sin(a)*r1);x.stroke()}
 x.restore();
 // inner step (depth ledge)
 const R2=R*.86;
 g=x.createLinearGradient(0,c-R2,0,c+R2);
 g.addColorStop(0,'#3a1800');g.addColorStop(.35,'#e8c060');g.addColorStop(.5,'#fff6cf');g.addColorStop(.65,'#a8640c');g.addColorStop(1,'#2a1000');
 x.fillStyle=g;x.beginPath();x.arc(c,c,R2,0,7);x.fill();
 // enamel / theme ring
 const rr=R*.78;
 g=x.createLinearGradient(0,c-rr,0,c+rr);g.addColorStop(0,p[0]);g.addColorStop(.45,p[1]);g.addColorStop(1,p[2]);
 x.fillStyle=g;x.beginPath();x.arc(c,c,rr,0,7);x.fill();
 x.lineWidth=w*.014;x.strokeStyle='rgba(255,248,210,.55)';x.beginPath();x.arc(c,c,rr-w*.006,Math.PI*1.15,Math.PI*1.85);x.stroke();
 x.strokeStyle='rgba(0,0,0,.45)';x.beginPath();x.arc(c,c,rr-w*.006,Math.PI*.15,Math.PI*.85);x.stroke();
 // ----- gem sphere (strong 3D) -----
 const rg=rr*.9;
 g=x.createRadialGradient(c-rg*.4,c-rg*.45,rg*.04,c+rg*.05,c+rg*.12,rg);
 g.addColorStop(0,p[0]);g.addColorStop(.22,p[1]);g.addColorStop(.55,p[2]);g.addColorStop(.82,p[3]);g.addColorStop(1,'#000');
 x.fillStyle=g;x.beginPath();x.arc(c,c,rg,0,7);x.fill();
 // faceted spokes (clipped)
 x.save();x.beginPath();x.arc(c,c,rg,0,7);x.clip();
 x.globalAlpha=.28;x.strokeStyle='#fff';x.lineWidth=w*.01;
 for(let i=0;i<10;i++){const a=i*Math.PI/5+.12;x.beginPath();x.moveTo(c,c);x.lineTo(c+Math.cos(a)*rg,c+Math.sin(a)*rg);x.stroke()}
 x.globalAlpha=.4;x.beginPath();x.arc(c,c,rg*.42,0,7);x.stroke();
 // ambient occlusion at bottom of gem
 g=x.createRadialGradient(c,c+rg*.35,0,c,c+rg*.35,rg*.7);g.addColorStop(0,'rgba(0,0,0,.35)');g.addColorStop(1,'rgba(0,0,0,0)');
 x.globalAlpha=1;x.fillStyle=g;x.fillRect(0,0,w,w);
 // embossed 龍 — soft so number overlay stays readable
 const fs=rg*1.02;x.font=`900 ${fs}px "TCDisp","Noto Serif TC",serif`;x.textAlign='center';x.textBaseline='middle';
 x.fillStyle='rgba(0,0,0,.5)';x.fillText('龍',c+w*.014,c+w*.04);
 x.fillStyle='rgba(255,248,210,.32)';x.fillText('龍',c-w*.008,c+w*.006);
 // warm under-glow
 g=x.createRadialGradient(c,c+rg*.2,0,c,c+rg*.2,rg*.55);g.addColorStop(0,'rgba(255,230,140,.45)');g.addColorStop(1,'rgba(255,230,140,0)');
 x.fillStyle=g;x.fillRect(0,0,w,w);x.restore();
 // 8 rivet studs on bezel
 for(let i=0;i<8;i++){const a=i*Math.PI/4-Math.PI/2,sx=c+Math.cos(a)*(R+R2)*.5,sy=c+Math.sin(a)*(R+R2)*.5,sr=w*.036;
  g=x.createRadialGradient(sx-sr*.4,sy-sr*.4,0,sx,sy,sr);g.addColorStop(0,'#fffce8');g.addColorStop(.4,'#ffd65a');g.addColorStop(.75,'#a8640c');g.addColorStop(1,'#2a1000');
  x.fillStyle=g;x.beginPath();x.arc(sx,sy,sr,0,7);x.fill();
  x.fillStyle='rgba(255,255,255,.7)';x.beginPath();x.arc(sx-sr*.25,sy-sr*.3,sr*.28,0,7);x.fill()}
 // primary specular (glass/metal) — strong palace highlight
 g=x.createLinearGradient(0,c-rg*.95,0,c-rg*.1);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.35,'rgba(255,255,255,.7)');g.addColorStop(.7,'rgba(255,248,220,.2)');g.addColorStop(1,'rgba(255,255,255,0)');
 x.fillStyle=g;x.beginPath();x.ellipse(c-rg*.1,c-rg*.48,rg*.55,rg*.3,-.3,0,7);x.fill();
 x.fillStyle='#fff';x.beginPath();x.arc(c-rg*.4,c-rg*.5,rg*.14,0,7);x.fill();
 x.fillStyle='rgba(255,255,255,.55)';x.beginPath();x.ellipse(c+rg*.22,c-rg*.2,rg*.12,rg*.06,.5,0,7);x.fill();
 // metal rim catch-light (top arc)
 x.strokeStyle='rgba(255,250,220,.85)';x.lineWidth=w*.03;x.beginPath();x.arc(c,c,R*.97,Math.PI*1.2,Math.PI*1.8);x.stroke();
 // secondary rim light (right-bottom)
 x.strokeStyle='rgba(255,220,120,.65)';x.lineWidth=w*.022;x.beginPath();x.arc(c,c,rg*.97,Math.PI*.05,Math.PI*.55);x.stroke();
 // outer bevel shade for thickness
 x.strokeStyle='rgba(0,0,0,.4)';x.lineWidth=w*.018;x.beginPath();x.arc(c,c,R*.99,Math.PI*.15,Math.PI*.85);x.stroke();
 if(k==='col'){x.fillStyle='#fff6cf';[[c+rg*.5,c-rg*.2],[c-rg*.52,c+rg*.1],[c+rg*.2,c+rg*.5]].forEach(([px,py],i)=>{x.save();x.translate(px,py);x.rotate(i*.7);x.fillRect(-w*.012,-w*.045,w*.024,w*.09);x.fillRect(-w*.045,-w*.012,w*.09,w*.024);x.restore()})}
})}
function socket(S){return cnv(S,S,(x,w)=>{const c=w/2,R=c*.94;
 let g=x.createLinearGradient(0,c-R,0,c+R);g.addColorStop(0,'#fff8d6');g.addColorStop(.2,'#ffd65a');g.addColorStop(.45,'#8a5410');g.addColorStop(.7,'#e0a028');g.addColorStop(1,'#fff0b8');
 x.fillStyle=g;x.beginPath();x.arc(c,c,R,0,7);x.fill();
 x.lineWidth=Math.max(2,w*.026);x.strokeStyle='#1a0800';x.stroke();
 x.strokeStyle='rgba(60,25,0,.55)';x.lineWidth=w*.01;
 for(let i=0;i<24;i++){const a=i*Math.PI/12,r0=R*.9,r1=R*.99;x.beginPath();x.moveTo(c+Math.cos(a)*r0,c+Math.sin(a)*r0);x.lineTo(c+Math.cos(a)*r1,c+Math.sin(a)*r1);x.stroke()}
 const r2=R*.82;g=x.createLinearGradient(0,c-r2,0,c+r2);g.addColorStop(0,'#2a1000');g.addColorStop(.45,'#c9a050');g.addColorStop(1,'#1a0800');
 x.fillStyle=g;x.beginPath();x.arc(c,c,r2,0,7);x.fill();
 const r3=R*.68;g=x.createRadialGradient(c,c-r3*.25,r3*.05,c,c+r3*.25,r3);g.addColorStop(0,'#6a3a88');g.addColorStop(.4,'#1c0a30');g.addColorStop(1,'#040108');
 x.fillStyle=g;x.beginPath();x.arc(c,c,r3,0,7);x.fill();
 x.lineWidth=w*.02;x.strokeStyle='rgba(255,214,90,.55)';x.beginPath();x.arc(c,c,r3-w*.01,Math.PI*1.1,Math.PI*1.9);x.stroke();
 x.strokeStyle='rgba(0,0,0,.7)';x.beginPath();x.arc(c,c,r3-w*.01,Math.PI*.1,Math.PI*.9);x.stroke();
 x.save();x.beginPath();x.arc(c,c,r3*.9,0,7);x.clip();
 x.globalAlpha=.18;x.font=`900 ${r3*1.05}px "TCDisp","Noto Serif TC",serif`;x.textAlign='center';x.textBaseline='middle';x.fillStyle='#ffd65a';x.fillText('龍',c,c+w*.015);
 x.globalAlpha=.4;g=x.createRadialGradient(c,c,0,c,c,r3*.5);g.addColorStop(0,'rgba(255,200,100,.2)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,w,w);
 x.restore();
 for(let i=0;i<4;i++){const a=i*Math.PI/2+Math.PI/4,sx=c+Math.cos(a)*(R+r2)/2,sy=c+Math.sin(a)*(R+r2)/2;
  g=x.createRadialGradient(sx-1,sy-1,0,sx,sy,w*.04);g.addColorStop(0,'#fff6cf');g.addColorStop(.55,'#e0a028');g.addColorStop(1,'#2a1000');
  x.fillStyle=g;x.beginPath();x.arc(sx,sy,w*.036,0,7);x.fill()}})}
function sphere(S,cols){return cnv(S,S,(x,w)=>{const c=w/2,r=c*.92;const g=x.createRadialGradient(c-r*.35,c-r*.4,r*.05,c,c,r);cols.forEach((v,i)=>g.addColorStop(i/(cols.length-1),v));x.fillStyle=g;x.beginPath();x.arc(c,c,r,0,7);x.fill();x.fillStyle='rgba(255,255,255,.9)';x.beginPath();x.arc(c-r*.38,c-r*.42,r*.2,0,7);x.fill()})}
function frameSVG(c1,c2){return `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#fff6cf'/><stop offset='.5' stop-color='${c1}'/><stop offset='1' stop-color='${c2}'/></linearGradient></defs><rect x='3' y='3' width='54' height='54' rx='9' fill='none' stroke='url(#g)' stroke-width='5'/><rect x='8' y='8' width='44' height='44' rx='6' fill='none' stroke='#fff3c4' stroke-opacity='.5' stroke-width='1'/>${[[6,6],[54,6],[6,54],[54,54]].map(([a,b])=>`<path d='M${a-5} ${b} L${a} ${b-5} L${a+5} ${b} L${a} ${b+5}Z' fill='#fff3c4' stroke='#7a4a08' stroke-width='1'/>`).join('')}</svg>`)}")`}
const SPR={};
function art(){if(SPR.done)return;SPR.done=1;const S=192;['gold','mini','minor','major','col'].forEach(k=>SPR[k]=jewel(k,S).toDataURL());SPR.sock=socket(S).toDataURL();
 SPR.peg=sphere(24,['#fffbe6','#ffd65a','#a8640c','#4a2600']);SPR.ball=sphere(40,['#ffffff','#fff3d6','#e8c27a','#8a5a20']);
 /* vertical reel-strip used while a cell is spinning */
 SPR.strip=cnv(64,256,(x,w,h)=>{x.fillStyle='#12061e';x.fillRect(0,0,w,h);const keys=['gold','mini','minor','major','col','gold'];
  keys.forEach((k,i)=>{const yy=i*(h/6)+4,p=PAL[k]||PAL.gold;let gg=x.createRadialGradient(w/2,yy+16,2,w/2,yy+18,18);gg.addColorStop(0,p[0]);gg.addColorStop(.45,p[1]);gg.addColorStop(1,p[3]);x.fillStyle=gg;x.beginPath();x.arc(w/2,yy+18,16,0,7);x.fill();x.strokeStyle='#ffd65a';x.lineWidth=2;x.stroke();x.fillStyle='rgba(255,255,255,.35)';x.beginPath();x.ellipse(w/2-4,yy+10,7,4,0,0,7);x.fill()});
  let veil=x.createLinearGradient(0,0,0,h);veil.addColorStop(0,'rgba(10,4,20,.55)');veil.addColorStop(.5,'rgba(10,4,20,0)');veil.addColorStop(1,'rgba(10,4,20,.55)');x.fillStyle=veil;x.fillRect(0,0,w,h)}).toDataURL();
 const css=document.createElement('style');css.id='b22art';css.textContent=`
 html body #hsBox .hsG>i,html body #b22Stage #hsBox .hsG>i,html body #hsBox.b23 .hsG>i{background:url(${SPR.sock}) center / auto 96% no-repeat!important;border:0!important;box-shadow:none!important;overflow:hidden!important}
 html body #hsBox .hsG>i.on,html body #b22Stage #hsBox .hsG>i.on,html body #hsBox.b23 .hsG>i.on{background:url(${SPR.gold}) center / auto 96% no-repeat!important;border:0!important;box-shadow:none!important;filter:none!important;overflow:hidden!important}
 html body #hsBox .hsG>i.on.mini{background-image:url(${SPR.mini})!important}
 html body #hsBox .hsG>i.on.minor{background-image:url(${SPR.minor})!important}
 html body #hsBox .hsG>i.on.major{background-image:url(${SPR.major})!important}
 html body #hsBox .hsG>i.on.col{background-image:url(${SPR.col})!important}
 html body #hsBox .hsG>i.on{--orb:url(${SPR.gold})}html body #hsBox .hsG>i.on.mini{--orb:url(${SPR.mini})}html body #hsBox .hsG>i.on.minor{--orb:url(${SPR.minor})}html body #hsBox .hsG>i.on.major{--orb:url(${SPR.major})}html body #hsBox .hsG>i.on.col{--orb:url(${SPR.col})}
 html body #hsBox .hsG>i.spin,html body #b22Stage #hsBox .hsG>i.spin,html body #hsBox.b23 .hsG>i.spin{background:#0a0414!important;background-image:none!important;animation:none!important;border-radius:6%!important;box-shadow:inset 0 0 0 1.5px rgba(255,214,90,.45),inset 0 8px 12px rgba(0,0,0,.55),inset 0 -8px 12px rgba(0,0,0,.45)!important;filter:none!important;overflow:hidden!important}
 html body #hsBox .hsG>i.miss{background:url(${SPR.sock}) center/94% no-repeat!important;filter:brightness(1.55)!important;box-shadow:inset 0 0 0 2px rgba(255,214,90,.7)!important;transition:filter .12s}
 html body #hsBox .hsG>i.land{filter:brightness(1.35)!important}
 html body #hsBox .hsJp div{border:10px solid transparent!important;border-image:${frameSVG('#ffd65a','#a8640c')} 14 stretch!important;background:linear-gradient(180deg,rgba(60,24,80,.9),rgba(20,6,30,.95)) padding-box!important;border-radius:0!important}
 html body #hsBox .hsJp .mini{border-image-source:${frameSVG('#6fb6ff','#1f5fb0')}!important}#hsBox .hsJp .minor{border-image-source:${frameSVG('#5be0a6','#178a5c')}!important}#hsBox .hsJp .major{border-image-source:${frameSVG('#ff7ab8','#c2185b')}!important}
 @keyframes b22Reel{to{background-position:center 256px}}`;document.body.appendChild(css)}
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
