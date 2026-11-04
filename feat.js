/* v20.3 extra events: 旋風聚寶 / 幸運彈珠 / 三重彩金輪 / 狂熱倍數 / 購買寶珠鎖定重轉 — play money only */
(function(){
if(typeof CZM==='undefined')return;
const ID=CZM.id,NF=new Intl.NumberFormat('zh-TW'),RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const MP={"love": 0.013999, "matsuri": 0.01386, "caishen": 0.015235, "samurai": 0.015248, "pirate": 0.014087, "neko": 0.013868, "sakura": 0.015022, "queen": 0.014767, "school": 0.013999, "jungle": 0.015235};                         // per-machine multiplier trigger prob (from math/m203.json)
const TW_N=60,TW_U=[.5,.75,1,1.25,1.5],TW_R=.02;               // eruption: 2.0% exact
const PL=[100,25,8,3,2,3,8,25,100],PL_P=0.015/(1524/256);        // plinko: 1.5% exact
const WH=[[5],[8],[10],[5],[15],[8],[30,'迷你'],[5],[10],[80,'小獎'],[8],[250,'大獎']],WH_P=0.015/(434/12); // wheel 1.5% exact
const MX=[[2,60],[3,30],[5,10]];                                  // multiplier: E[R]=2.6, 1.5% exact
const HS_BUY=48.2;                                                // 45.29/0.94
const $=i=>document.getElementById(i);
const tone=(f,t,d,ty,v,f2)=>window.AV&&AV.tone(f,t,d,ty,v,f2);
const sleep=ms=>new Promise(r=>setTimeout(r,RM?Math.min(ms,80):ms));
const KEY='czTW_'+ID;let tw;try{tw=JSON.parse(localStorage.getItem(KEY))}catch(e){}if(!tw||typeof tw.n!=='number')tw={n:0,pot:0};
let armed=0;const Qu=[];const TK='czTK_'+ID;let tk;try{tk=JSON.parse(localStorage.getItem(TK))}catch(e){}if(!tk||typeof tk.p!=='number')tk={p:0,w:0,m:0};const saveT=()=>localStorage.setItem(TK,JSON.stringify(tk));const emitT=(k,full)=>{try{dispatchEvent(new CustomEvent('czf',{detail:{k,full:!!full,tk:Object.assign({},tk),tw:Object.assign({},tw),TW_N,armed}}))}catch(e){}};let busy=false;
function idle(){return !(typeof spinning!=='undefined'&&spinning)&&!(typeof bwState!=='undefined'&&bwState)&&!(typeof FS!=='undefined'&&FS)&&!$('hsBox')&&!window.__hold&&!($('czMG')&&$('czMG').offsetParent)}
function pump(){if(busy||!Qu.length)return;if(!idle()){setTimeout(pump,500);return}busy=true;window.__hold=true;const [fn,bet]=Qu.shift();
 (window.F21?F21.pre(fn.t):Promise.resolve()).then(()=>fn(bet)).then(w=>{window.F21&&F21.back();award(w,bet)}).catch(e=>console.error(e)).finally(()=>{busy=false;window.__hold=false;['spinBtn','minus','plus','maxBtn','resetBtn'].forEach(i=>$(i)&&($(i).disabled=false));setTimeout(pump,800)})}
function queue(fn,bet){Qu.push([fn,bet]);setTimeout(pump,1200)}
function award(w,bet,lbl){w=Math.round(w);if(!(w>0))return;bal+=w;$('win').textContent=w;try{ui();saveLater&&saveLater()}catch(e){}const tot=bet*NL;if(w/tot>=10&&window.bigWin)setTimeout(()=>bigWin(w,tot),300);}
function pick(a){let s=a.reduce((x,y)=>x+y[1],0),r=Math.random()*s;for(const v of a){if((r-=v[1])<0)return v[0]}return a[0][0]}
function ov(title,inner){const o=document.createElement('div');o.className='fxOv';o.setAttribute('role','dialog');o.setAttribute('aria-label',title);o.innerHTML=`<div class="fxIn"><h2>${title}</h2>${inner}<p class="fxNote">僅供娛樂・虛擬籌碼・無真實金錢</p></div>`;document.body.appendChild(o);return o}
function finish(o,w,msg){return new Promise(res=>{const r=o.querySelector('.fxRes');r.innerHTML=`${msg}<b>${NF.format(Math.round(w))}</b>`;const b=document.createElement('button');b.textContent='收下';r.after(b);let done=false;const end=()=>{if(done)return;done=true;o.classList.add('out');setTimeout(()=>o.remove(),480);res(w)};b.onclick=end;setTimeout(end,5000)})}
/* ---- 旋風聚寶 widget ---- */
function twUI(){const h=$('czHero');if(!h)return;let e=$('twBox');if(!e){e=document.createElement('div');e.id='twBox';e.innerHTML='<div class="tr"><i>旋</i></div><div><b>旋風聚寶</b><span></span></div>';h.appendChild(e)}
 e.style.setProperty('--p',tw.n/TW_N*100);e.querySelector('span').textContent=NF.format(Math.round(tw.pot));e.classList.toggle('hot',tw.n>=TW_N*.85)}
function erupt(){const pot=tw.pot;tw={n:0,pot:0};localStorage.setItem(KEY,JSON.stringify(tw));twUI();
 const fn=async function(bet){const o=ov('旋風聚寶',`<div class="b22hud"><span>聚寶罐 <b class="twv">0</b></span></div><canvas class="b22tw" width="640" height="500" style="width:320px;height:250px"></canvas><p>金色旋風捲起累積的籌碼！</p><div class="fxRes"></div>`);const cv=o.querySelector('canvas'),x=cv.getContext('2d');x.scale(2,2);const tv=o.querySelector('.twv');
  const SP=window.B22&&B22.SPR;const gl=document.createElement('canvas');gl.width=gl.height=32;{const g=gl.getContext('2d'),r=g.createRadialGradient(16,16,0,16,16,16);r.addColorStop(0,'rgba(255,255,235,1)');r.addColorStop(.3,'rgba(255,214,90,.8)');r.addColorStop(1,'rgba(255,150,30,0)');g.fillStyle=r;g.fillRect(0,0,32,32)}
  const P=[];for(let i=0;i<140;i++)P.push({a:Math.random()*6.28,h:Math.random(),s:.6+Math.random()*1.4,z:Math.random()<.25});
  tone(160,0,2.4,'sawtooth',.03,900);tone(80,0,2.4,'sine',.08,160);const t0=performance.now(),D=RM?200:2600;
  await new Promise(res=>{(function fr(t){const k=Math.min(1,(t-t0)/D),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;x.clearRect(0,0,320,250);
   const bg=x.createRadialGradient(160,110,10,160,120,170);bg.addColorStop(0,`rgba(255,200,90,${.18+.25*e})`);bg.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=bg;x.fillRect(0,0,320,250);
   x.globalCompositeOperation='lighter';
   for(let j=0;j<14;j++){const y=24+j*14,rw=(16+j*j*0.9)*(1-e*.25),sw=(t/300+j*.5)%6.28;x.beginPath();x.ellipse(160+Math.sin(t/400+j*.6)*8*j/14,y,rw,4+j*.9,0,sw,sw+4.2);x.strokeStyle=`rgba(255,${190+j*4},${90+j*6},${.18+.035*j})`;x.lineWidth=2.4;x.stroke()}
   for(const p of P){p.a+=.04*p.s*(1+e*4);const y=22+p.h*196,rw=(16+Math.pow(p.h*14,2)*0.9)*(1-e*.25)*(p.z?1.15:1),px=160+Math.cos(p.a)*rw,py=y+Math.sin(p.a)*(4+p.h*12)-e*30*p.h;const sz=(p.z?14:8)*(0.6+p.h*.6);x.globalAlpha=.55+.45*Math.sin(p.a*2+1);x.drawImage(gl,px-sz/2,py-sz/2,sz,sz)}
   x.globalAlpha=1;x.globalCompositeOperation='source-over';tv.textContent=NF.format(Math.round(pot*e));
   if(k<1)requestAnimationFrame(fr);else res()})(t0)});
  window.W21&&(()=>{const r=cv.getBoundingClientRect();W21.burst(r.left+r.width/2,r.top+r.height*.3,24,320)})();
  tone(523,0,.3,'square',.05);tone(784,.12,.5,'square',.05);tone(1047,.24,.6,'triangle',.05);return finish(o,pot,'旋風聚寶獎金')};fn.t='旋風聚寶';return fn}
/* ---- 幸運彈珠 ---- */
async function plinko(bet){const tot=bet*NL,W=320,H=300,R=8;const o=ov('幸運彈珠',`<div class="b22hud"><span>彈珠 <b>1</b>／1</span><span>最高 <b>×100</b></span></div><canvas class="b22pl" width="${W*2}" height="${H*2}" style="width:${W}px;height:${H}px"></canvas><div class="fxRes"></div>`);const cv=o.querySelector('canvas'),x=cv.getContext('2d');x.scale(2,2);
 const SP=window.B22&&B22.SPR,img=s=>{const i=new Image();i.src=s;return i};const PEG=SP&&SP.peg,BALL=SP&&SP.ball;
 const sp=W/(R+2),gx=(r,i)=>W/2+(i-r/2)*sp,gy=r=>30+r*26,SY=gy(R)+4,SW=sp-4;let path=[0];for(let r=0;r<R;r++)path.push(path[r]+(Math.random()<.5?0:1));const slot=path[R];
 const slotCol=v=>v>=100?['#fff6cf','#ffd65a','#a8640c']:v>=25?['#ffd0e6','#ff6fae','#8a1048']:v>=8?['#d6fff0','#3fc69a','#0f5a46']:['#e8dcff','#8a6ad6','#3a1f6e'];
 const trail=[];let hl=-1,glow=0;
 function draw(bx,by,drop){x.clearRect(0,0,W,H);
  let g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'rgba(70,30,95,.85)');g.addColorStop(1,'rgba(20,6,32,.92)');x.fillStyle=g;x.beginPath();x.roundRect(4,4,W-8,H-8,14);x.fill();x.lineWidth=2;x.strokeStyle='#ffd65a';x.stroke();x.lineWidth=1;x.strokeStyle='rgba(255,240,200,.35)';x.beginPath();x.roundRect(9,9,W-18,H-18,10);x.stroke();
  for(let r=1;r<=R;r++)for(let i=0;i<=r;i++){const d=drop==null?1:Math.max(0,Math.min(1,(drop-(r*0.06+i*0.015))/0.35));const e=1-Math.pow(1-d,3);const px=gx(r,i),py=gy(r)-12-(1-e)*80;x.globalAlpha=e;if(PEG)x.drawImage(PEG,px-6,py-6,12,12);x.globalAlpha=1}
  PL.forEach((v,i)=>{const sx=gx(R,i)-SW/2,c=slotCol(v);const gg=x.createLinearGradient(0,SY,0,SY+30);gg.addColorStop(0,c[0]);gg.addColorStop(.45,c[1]);gg.addColorStop(1,c[2]);x.fillStyle=gg;x.beginPath();x.roundRect(sx,SY,SW,30,6);x.fill();x.lineWidth=1.5;x.strokeStyle=i===hl?'#fff':'#5a3200';x.stroke();
   if(i===hl){x.save();x.globalCompositeOperation='lighter';x.fillStyle=`rgba(255,240,180,${.35+.3*Math.sin(glow)})`;x.beginPath();x.roundRect(sx-2,SY-2,SW+4,34,7);x.fill();x.restore()}
   x.font='900 11px "Noto Sans TC",sans-serif';x.textAlign='center';x.lineWidth=3;x.strokeStyle='rgba(40,10,0,.85)';x.strokeText('×'+v,sx+SW/2,SY+19,SW-2);x.fillStyle='#fff';x.fillText('×'+v,sx+SW/2,SY+19,SW-2)});
  if(bx!=null){x.save();x.globalCompositeOperation='lighter';trail.forEach((p,i)=>{x.globalAlpha=(i+1)/trail.length*.35;x.beginPath();x.arc(p[0],p[1],6*(i+1)/trail.length+2,0,7);x.fillStyle='#ffd65a';x.fill()});x.restore();x.globalAlpha=1;x.shadowColor='rgba(255,220,140,.9)';x.shadowBlur=14;if(BALL)x.drawImage(BALL,bx-9,by-9,18,18);x.shadowBlur=0}}
 const toScr=(px,py)=>{const r=cv.getBoundingClientRect();return [r.left+px*r.width/W,r.top+py*r.height/H]};
 const t0=performance.now();await new Promise(res=>{(function f(t){const d=(t-t0)/700;draw(null,null,d);if(d<1.6&&!RM)requestAnimationFrame(f);else res()})(t0)});
 for(let r=0;r<R;r++){const ax=gx(r,path[r]),ay=gy(r)-8,bx=gx(r+1,path[r+1]),by=gy(r+1)-8;const steps=r>=R-2?16:11;
  for(let s=1;s<=steps;s++){const k=s/steps,ek=k*k*(3-2*k);const px=ax+(bx-ax)*ek,py=ay+(by-ay)*k-Math.sin(k*Math.PI)*11;trail.push([px,py]);if(trail.length>6)trail.shift();draw(px,py);await sleep(16)}
  const [sx,sy]=toScr(bx,by+4);window.W21&&W21.burst(sx,sy,6,130);tone(700+r*85+Math.random()*30,0,.07,'triangle',.06);tone(1800+r*60,0,.03,'square',.02)}
 const fx=gx(R,slot);for(let s=1;s<=10;s++){const k=s/10;const px=trail.length?trail[trail.length-1][0]:fx;draw(px+(fx-px)*k,gy(R)-8+(SY+12-(gy(R)-8))*k);await sleep(16)}
 hl=slot;for(let i=0;i<24;i++){glow+=.5;draw(fx,SY+12);await sleep(30)}
 {const [sx,sy]=toScr(fx,SY+15);window.W21&&W21.burst(sx,sy,18,260)}
 tone(523,0,.3,'triangle',.06);tone(1047,.1,.4,'triangle',.06);if(PL[slot]>=25&&window.AV)AV.celebrate(PL[slot]>=100?1:0);const w=PL[slot]*tot;return finish(o,w,`落入 ×${PL[slot]}`)}
plinko.t='幸運彈珠';
/* ---- 三重彩金輪 ---- */
async function wheel(bet){const tot=bet*NL,n=WH.length,S=280,c=S/2,R0=124;
 const segFill=s=>s[1]==='大獎'?'url(#wMaj)':s[1]==='小獎'?'url(#wMin)':s[1]==='迷你'?'url(#wMini)':'';
 let seg='';WH.forEach((s,i)=>{const a0=(i/n)*6.2832-1.5708,a1=((i+1)/n)*6.2832-1.5708,am=(a0+a1)/2;const p=a=>`${(c+Math.cos(a)*R0).toFixed(2)},${(c+Math.sin(a)*R0).toFixed(2)}`;const fill=segFill(s)||(i%2?'url(#wJade)':'url(#wPur)');const tx=c+Math.cos(am)*R0*.66,ty=c+Math.sin(am)*R0*.66;
  seg+=`<path d="M${c},${c} L${p(a0)} A${R0},${R0} 0 0 1 ${p(a1)} Z" fill="${fill}"/><line x1="${c}" y1="${c}" x2="${(c+Math.cos(a0)*R0).toFixed(2)}" y2="${(c+Math.sin(a0)*R0).toFixed(2)}" stroke="url(#wGold)" stroke-width="3"/><text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" transform="rotate(${(am*57.2958+90).toFixed(1)} ${tx.toFixed(1)} ${ty.toFixed(1)})" text-anchor="middle" dominant-baseline="middle" fill="#fff6cf" stroke="#2a0a00" stroke-width="3" paint-order="stroke" font-family="Noto Sans TC" font-weight="900" font-size="${s[1]?15:15}">${s[1]||'×'+s[0]}</text>`});
 let bulbs='';for(let i=0;i<24;i++){const a=i/24*6.2832;bulbs+=`<circle class="b22bulb${i%2?' o':''}" cx="${(c+Math.cos(a)*(R0+8)).toFixed(1)}" cy="${(c+Math.sin(a)*(R0+8)).toFixed(1)}" r="3.4" stroke="#5a3200" stroke-width="1"/>`}
 const defs=`<defs><linearGradient id="wGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6cf"/><stop offset=".45" stop-color="#ffd65a"/><stop offset=".55" stop-color="#b87810"/><stop offset="1" stop-color="#ffe39a"/></linearGradient>
 <radialGradient id="wJade" cx="50%" cy="50%" r="60%"><stop offset=".2" stop-color="#2fa07a"/><stop offset="1" stop-color="#0a3a2a"/></radialGradient><radialGradient id="wPur" cx="50%" cy="50%" r="60%"><stop offset=".2" stop-color="#6a3a9a"/><stop offset="1" stop-color="#22103a"/></radialGradient>
 <radialGradient id="wMini" r="60%"><stop offset=".2" stop-color="#6fb6ff"/><stop offset="1" stop-color="#123a78"/></radialGradient><radialGradient id="wMin" r="60%"><stop offset=".2" stop-color="#5be0a6"/><stop offset="1" stop-color="#0d4a32"/></radialGradient><radialGradient id="wMaj" r="60%"><stop offset=".2" stop-color="#ff7ab8"/><stop offset="1" stop-color="#6a0a36"/></radialGradient>
 <radialGradient id="wHub" cx=".35" cy=".3"><stop offset="0" stop-color="#fffbe6"/><stop offset=".5" stop-color="#ffd65a"/><stop offset="1" stop-color="#8a5208"/></radialGradient></defs>`;
 const PTR=`<svg class="b22ptr" viewBox="0 0 44 56"><defs><linearGradient id="pG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6cf"/><stop offset=".5" stop-color="#ffd65a"/><stop offset="1" stop-color="#9a5a08"/></linearGradient></defs><path d="M6 6 Q22 -4 38 6 L32 20 L22 54 L12 20 Z" fill="url(#pG)" stroke="#4a2200" stroke-width="3" stroke-linejoin="round"/><path d="M10 6 L4 -2 M34 6 L40 -2" stroke="#ffd65a" stroke-width="3"/><circle cx="22" cy="16" r="5.5" fill="#c2185b" stroke="#fff3c4" stroke-width="1.5"/><circle cx="16" cy="9" r="1.8" fill="#4a2200"/><circle cx="28" cy="9" r="1.8" fill="#4a2200"/></svg>`;
 const o=ov('三重彩金輪',`<div class="b22hud"><span>迷你 <b>×30</b></span><span>小獎 <b>×80</b></span><span>大獎 <b>×250</b></span></div><div class="b22wh">${PTR}<svg class="w" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">${defs}<circle cx="${c}" cy="${c}" r="${R0+16}" fill="url(#wGold)" stroke="#4a2200" stroke-width="3"/><circle cx="${c}" cy="${c}" r="${R0+2}" fill="#1a0a24"/>${bulbs}<g id="whG" style="transform-origin:${c}px ${c}px">${seg}<circle cx="${c}" cy="${c}" r="${R0}" fill="none" stroke="url(#wGold)" stroke-width="3"/></g><circle cx="${c}" cy="${c}" r="34" fill="url(#wHub)" stroke="#4a2200" stroke-width="3"/><circle cx="${c}" cy="${c}" r="26" fill="#2a0f3a" stroke="#ffd65a" stroke-width="1.5"/><text x="${c}" y="${c+2}" text-anchor="middle" dominant-baseline="middle" fill="#ffe680" stroke="#3a0800" stroke-width="2" paint-order="stroke" font-family="TCDisp,Noto Serif TC,serif" font-weight="900" font-size="26">龍</text></svg></div><p>（× 總押注）</p><div class="fxRes"></div>`);
 await sleep(650);const k=Math.random()*n|0,g=o.querySelector('#whG'),ptr=o.querySelector('.b22ptr'),wh=o.querySelector('.b22wh'),deg=360*6-(k+.5)*(360/n),T=RM?0:4600;wh.classList.add('go');g.style.transition=`transform ${T}ms cubic-bezier(.15,.55,.08,1)`;await sleep(60);g.style.transform=`rotate(${deg}deg)`;
 let last=-1,fc=0;const t0=performance.now();await new Promise(res=>{(function f(){const el=performance.now()-t0;if(fc++%2===0){const m=new DOMMatrix(getComputedStyle(g).transform);const a=Math.floor(((Math.atan2(m.b,m.a)*57.2958+360)%360)/(360/n));if(a!==last){last=a;const sl=Math.min(1,el/T);tone(1500-sl*700,0,.03,'square',.03);ptr.classList.remove('flex');void ptr.offsetWidth;ptr.classList.add('flex')}}if(el<T+100)requestAnimationFrame(f);else res()})()});
 wh.classList.remove('go');const s=WH[k];if(s[1]&&window.AV)AV.celebrate(s[1]==='大獎'?2:s[1]==='小獎'?1:0);else{tone(659,0,.3,'triangle',.06);tone(988,.1,.4,'triangle',.06)}
 {const r=wh.getBoundingClientRect();window.W21&&W21.burst(r.left+r.width/2,r.top+30,16,240)}return finish(o,s[0]*tot,s[1]?`${s[1]}！`:`× ${s[0]}`)}
wheel.t='三重彩金輪';
/* ---- 狂熱倍數 ---- */
function mxUI(){const h=$('czHero');let e=$('mxBadge');if(!armed){e&&e.remove();return}if(!h)return;if(!e){e=document.createElement('div');e.id='mxBadge';h.appendChild(e)}e.innerHTML=`<i class="b22med">×${armed}</i><span>狂熱倍數<small>下一局獎金 ×${armed}</small></span>`;if(!e._roll){e._roll=1;const md=e.querySelector('.b22med'),seq=[2,3,5,2,3,5,2,3];let q=0;const R=armed;const iv=setInterval(()=>{if(q>=seq.length){clearInterval(iv);md.textContent='×'+R;tone(1320,0,.2,'square',.05);return}md.textContent='×'+seq[q++];tone(600+q*60,0,.04,'square',.03)},70)}}
/* ---- hook settle results ---- */
const CZo=window.CZ&&CZ.onSettle;if(CZo)CZ.onSettle=function(o){const r=CZo.apply(this,arguments);try{if(!o.free){const tot=o.total,bet=tot/NL;
 if(armed){const R=armed;armed=0;mxUI();if(o.won>0){const ex=o.won*(R-1);bal+=ex;$('win').textContent=o.won*R;try{ui();saveLater&&saveLater()}catch(e){}$('msg').textContent=`狂熱倍數 ×${R}！本局共贏得 ${NF.format(o.won*R)} 籌碼！`;window.AV&&AV.celebrate(0)}}
 else if(Math.random()<3*(MP[ID]||0)){tk.m++;if(tk.m>=3){tk.m=0;armed=pick(MX);mxUI();tone(660,0,.15,'square',.05);tone(990,.12,.3,'square',.05)}emitT('mult')}
 tw.n++;tw.pot+=tot*TW_R*TW_U[Math.random()*TW_U.length|0];if(tw.n>=TW_N)queue(erupt(),bet);localStorage.setItem(KEY,JSON.stringify(tw));twUI();
 if(Math.random()<5*PL_P){tk.p++;const full=tk.p>=5;if(full)tk.p=0;emitT('plinko',full);if(full)queue(plinko,bet)}if(Math.random()<12*WH_P){tk.w++;const full=tk.w>=12;if(full)tk.w=0;emitT('wheel',full);if(full)queue(wheel,bet)}saveT();emitT('tick')}}catch(e){console.error(e)}return r};
/* ---- buy 寶珠鎖定重轉 ---- */
function buyUI(){const m=$('menu16'),b0=$('czBuyBtn');if(!m||!b0||$('czBuyHS'))return;const b=document.createElement('button');b.id='czBuyHS';b.type='button';b.className='czbuyitem';b.innerHTML='<span class="ic" aria-hidden="true">🔮</span><span class="czbt"><b>寶珠鎖定重轉</b><small></small></span>';b0.after(b);
 const price=()=>Math.round(BETS[betIdx]*NL*HS_BUY);const lab=()=>{b.querySelector('small').textContent=`花 ${price().toLocaleString()} 籌碼開啟`};lab();new MutationObserver(lab).observe($('bet'),{childList:true,characterData:true,subtree:true});
 const d=document.createElement('dialog');d.id='czBuyHSd';d.innerHTML=`<h2>寶珠鎖定重轉</h2><p class="czbp"></p><p class="note">直接進入寶珠鎖定重轉（6 顆寶珠起始、3 次重轉）。<br>理論回收率約 94%（模擬）・僅使用虛擬籌碼・無真實金錢</p><div class="dact"><button class="claim" id="czBuyHSOk">確認購買</button><button id="czBuyHSNo">取消</button></div>`;document.body.appendChild(d);
 b.onclick=()=>{if(!idle()||!window.CZHS)return;d.querySelector('.czbp').innerHTML=`價格：<b>${price().toLocaleString()}</b> 籌碼（總押注 ${BETS[betIdx]*NL} × ${HS_BUY}）`;$('czBuyHSOk').disabled=bal<price();$('czBuyHSOk').textContent=bal<price()?'籌碼不足':'確認購買';try{$('menu16').classList.remove('open')}catch(e){}d.showModal()};
 $('czBuyHSNo').onclick=()=>d.close();$('czBuyHSOk').onclick=()=>{d.close();const p=price();if(bal<p||!idle())return;bal-=p;try{ui();saveLater&&saveLater()}catch(e){}CZHS.force(BETS[betIdx])}}
function boot(){twUI();buyUI()}
if(document.readyState==='complete')setTimeout(boot,300);else addEventListener('load',()=>setTimeout(boot,300));
window.CZF={tk:()=>tk,emit:()=>emitT('tick'),force:{plinko:()=>queue(plinko,BETS[betIdx]),wheel:()=>queue(wheel,BETS[betIdx]),erupt:()=>{tw.n=TW_N;tw.pot=Math.max(tw.pot,BETS[betIdx]*NL*1.2);queue(erupt(),BETS[betIdx])},mult:()=>{armed=pick(MX);mxUI()}},tw:()=>tw,MP,PL_P,WH_P};
})();
