/* v28.18 bonus presentation: palace jewel plaques (faceted gem, dragon scales) + idle motion, contained fill; theme-symbol spins — play money only */
(function(){
const $=i=>document.getElementById(i),RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const tone=(...a)=>window.AV&&AV.tone(...a);
const sleep=ms=>new Promise(r=>setTimeout(r,RM?Math.min(ms,60):ms));
/* ---------- art: procedural sprites ---------- */
function cnv(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);return c}
const PAL={gold:['#fffbe6','#ffd65a','#c98a1c','#5a3200'],mini:['#eef8ff','#6fb6ff','#1f5fb0','#0a1f4a'],minor:['#effff6','#5be0a6','#178a5c','#06301f'],major:['#fff0f8','#ff7ab8','#c2185b','#4a0626'],col:['#fff6e0','#ffb347','#d2380e','#4a0a00'],jade:['#e8fff4','#6fd6a8','#1d7a58','#06281c']};
function jewel(k,S){const p=k==='gold'?['#fff3c0','#ffa21a','#b8460a','#3a0e00']:PAL[k];const W=Math.round(S*1.6),H=S;return cnv(W,H,(x,w,h)=>{
 /* v28.18 palace jewel plaque: wide (fills cell), thick gold frame, tier enamel w/ dragon scales, faceted cushion gem */
 const rr=(X,Y,ww,hh,r)=>{x.beginPath();x.moveTo(X+r,Y);x.arcTo(X+ww,Y,X+ww,Y+hh,r);x.arcTo(X+ww,Y+hh,X,Y+hh,r);x.arcTo(X,Y+hh,X,Y,r);x.arcTo(X,Y,X+ww,Y,r);x.closePath()};
 const u=h/100;let g;
 // outer gold frame (thick bevel)
 g=x.createLinearGradient(0,0,0,h);[['#fffbe0',0],['#ffd65a',.14],['#b8740e',.38],['#5a2c02',.52],['#e2a632',.7],['#fff0b0',.86],['#9a5a08',1]].forEach(([c,o])=>g.addColorStop(o,c));
 x.fillStyle=g;rr(0,0,w,h,14*u);x.fill();x.lineWidth=2.2*u;x.strokeStyle='#2a1000';x.stroke();
 g=x.createLinearGradient(0,0,w,0);g.addColorStop(0,'rgba(0,0,0,.35)');g.addColorStop(.2,'rgba(0,0,0,0)');g.addColorStop(.8,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.35)');x.fillStyle=g;rr(0,0,w,h,14*u);x.fill();
 x.strokeStyle='rgba(255,252,225,.9)';x.lineWidth=1.6*u;rr(3*u,3*u,w-6*u,h-6*u,11*u);x.stroke();
 // inner groove
 const fi=9*u;x.fillStyle='#2a1000';rr(fi-1.5*u,fi-1.5*u,w-2*fi+3*u,h-2*fi+3*u,9*u);x.fill();
 // tier enamel field
 g=x.createLinearGradient(0,fi,0,h-fi);g.addColorStop(0,p[1]);g.addColorStop(.5,p[2]);g.addColorStop(1,p[3]);
 x.fillStyle=g;rr(fi,fi,w-2*fi,h-2*fi,8*u);x.fill();
 // dragon-scale pattern on enamel
 x.save();rr(fi,fi,w-2*fi,h-2*fi,8*u);x.clip();x.lineWidth=1.3*u;
 for(let row=0,y=fi;y<h;row++,y+=7*u)for(let X=fi+(row%2?5*u:0)-10*u;X<w;X+=10*u){x.strokeStyle='rgba(255,236,170,.32)';x.beginPath();x.arc(X,y,5*u,0,Math.PI);x.stroke();x.strokeStyle='rgba(0,0,0,.25)';x.beginPath();x.arc(X,y+1*u,5*u,.2,Math.PI-.2);x.stroke()}
 g=x.createRadialGradient(w/2,h/2,0,w/2,h/2,w*.5);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.45)');x.fillStyle=g;x.fillRect(0,0,w,h);x.restore();
 // corner cloud scrolls + diamond studs
 [[fi+7*u,fi+7*u,1,1],[w-fi-7*u,fi+7*u,-1,1],[fi+7*u,h-fi-7*u,1,-1],[w-fi-7*u,h-fi-7*u,-1,-1]].forEach(([cx,cy,sx,sy])=>{
  x.save();x.translate(cx,cy);x.scale(sx,sy);x.strokeStyle='#ffe9a0';x.lineWidth=2.2*u;x.lineCap='round';
  x.beginPath();x.arc(4*u,4*u,4*u,Math.PI,Math.PI*2.4);x.stroke();x.beginPath();x.moveTo(-3*u,-3*u);x.lineTo(14*u,-3*u);x.moveTo(-3*u,-3*u);x.lineTo(-3*u,14*u);x.stroke();
  g=x.createRadialGradient(-1*u,-1*u,0,0,0,4*u);g.addColorStop(0,'#fff');g.addColorStop(.5,'#ffd65a');g.addColorStop(1,'#7a3e04');x.fillStyle=g;
  x.beginPath();x.moveTo(-3*u,-7.5*u);x.lineTo(1.5*u,-3*u);x.lineTo(-3*u,1.5*u);x.lineTo(-7.5*u,-3*u);x.closePath();x.fill();x.restore()});
 // central faceted cushion gem
 const cx=w/2,cy=h/2,gw=w*.36,gh=h*.36,n=16,pts=[];
 for(let i=0;i<n;i++){const a=i/n*Math.PI*2-Math.PI/2+Math.PI/n,c=Math.cos(a),s=Math.sin(a),k2=Math.pow(Math.abs(c),.7)*Math.sign(c),s2=Math.pow(Math.abs(s),.7)*Math.sign(s);pts.push([cx+k2*gw,cy+s2*gh])}
 // gold bezel setting
 x.save();x.shadowColor='rgba(0,0,0,.6)';x.shadowBlur=6*u;x.shadowOffsetY=3*u;
 g=x.createLinearGradient(0,cy-gh,0,cy+gh);g.addColorStop(0,'#fff6cf');g.addColorStop(.4,'#e0a028');g.addColorStop(.7,'#6a3404');g.addColorStop(1,'#ffd65a');x.fillStyle=g;
 x.beginPath();pts.forEach(([X,Y],i)=>{const dx=X-cx,dy=Y-cy;x[i?'lineTo':'moveTo'](cx+dx*1.13,cy+dy*1.17)});x.closePath();x.fill();x.restore();
 // prongs
 for(let i=0;i<n;i+=2){const [X,Y]=pts[i],dx=X-cx,dy=Y-cy;x.fillStyle='#fff3c4';x.beginPath();x.arc(cx+dx*1.08,cy+dy*1.1,2.2*u,0,7);x.fill()}
 // gem body
 g=x.createRadialGradient(cx-gw*.3,cy-gh*.45,gh*.05,cx,cy+gh*.1,gw);g.addColorStop(0,p[0]);g.addColorStop(.3,p[1]);g.addColorStop(.7,p[2]);g.addColorStop(1,p[3]);
 x.fillStyle=g;x.beginPath();pts.forEach(([X,Y],i)=>x[i?'lineTo':'moveTo'](X,Y));x.closePath();x.fill();
 // facets: crown triangles alternating light/dark, table octagon
 const tb=pts.map(([X,Y])=>[cx+(X-cx)*.55,cy+(Y-cy)*.55]);
 for(let i=0;i<n;i++){const a=pts[i],b=pts[(i+1)%n],c=tb[i],d=tb[(i+1)%n];const lit=Math.sin((i/n)*Math.PI*2-2.2);
  x.fillStyle=lit>0?`rgba(255,255,255,${.08+lit*.3})`:`rgba(0,0,0,${-lit*.32})`;x.beginPath();x.moveTo(a[0],a[1]);x.lineTo(b[0],b[1]);x.lineTo(d[0],d[1]);x.lineTo(c[0],c[1]);x.closePath();x.fill();
  x.strokeStyle='rgba(255,255,255,.28)';x.lineWidth=.9*u;x.stroke()}
 g=x.createLinearGradient(0,cy-gh*.55,0,cy+gh*.55);g.addColorStop(0,'rgba(255,255,255,.35)');g.addColorStop(.5,'rgba(255,255,255,.05)');g.addColorStop(1,'rgba(0,0,0,.2)');
 x.fillStyle=g;x.beginPath();tb.forEach(([X,Y],i)=>x[i?'lineTo':'moveTo'](X,Y));x.closePath();x.fill();
 // faint 龍 seal in table (kept soft for number)
 x.font=`900 ${gh*1.15}px "TCDisp","Noto Serif TC",serif`;x.textAlign='center';x.textBaseline='middle';x.fillStyle='rgba(255,248,210,.13)';x.fillText('龍',cx,cy+gh*.06);
 // specular star + highlight
 x.fillStyle='rgba(255,255,255,.75)';x.beginPath();x.ellipse(cx-gw*.42,cy-gh*.5,gw*.2,gh*.1,-.35,0,7);x.fill();
 const st=(X,Y,r)=>{x.fillStyle='#fff';x.beginPath();for(let i=0;i<8;i++){const a=i*Math.PI/4,rad=i%2?r*.22:r;x.lineTo(X+Math.cos(a)*rad,Y+Math.sin(a)*rad)}x.closePath();x.fill()};
 st(cx-gw*.56,cy-gh*.58,7*u);st(cx+gw*.62,cy+gh*.42,4*u);
 // top frame catch-light
 x.strokeStyle='rgba(255,255,240,.8)';x.lineWidth=2*u;x.beginPath();x.moveTo(16*u,2.8*u);x.lineTo(w-16*u,2.8*u);x.stroke();
 if(k==='col'){x.fillStyle='#fff6cf';[[cx+gw*1.25,cy-gh*.6],[cx-gw*1.25,cy+gh*.55]].forEach(([X,Y])=>st(X,Y,8*u))}
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
