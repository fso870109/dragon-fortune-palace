/* v20.3 extra events: 旋風聚寶 / 幸運彈珠 / 三重彩金輪 / 狂熱倍數 / 購買寶珠鎖定重轉 — play money only */
(function(){
if(typeof CZM==='undefined')return;
const ID=CZM.id,NF=new Intl.NumberFormat('zh-TW'),RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const MP={"matsuri": 0.004588, "samurai": 0.005093, "neko": 0.004590, "sakura": 0.004311};  // v22.2: multiplier now waits for the next WIN (never wasted, never ×0); trigger prob = old×hit-rate keeps the 1.5% share exact                         // per-machine multiplier trigger prob (from math/m203.json)
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
function idle(){return !(typeof spinning!=='undefined'&&spinning)&&!(typeof bwState!=='undefined'&&bwState)&&!(typeof FS!=='undefined'&&FS)&&!$('hsBox')&&!document.querySelector('.rfx')&&!window.__hold&&!($('czMG')&&$('czMG').offsetParent)}
function pump(){if(busy||!Qu.length)return;if(!idle()){setTimeout(pump,500);return}busy=true;window.__hold=true;const [fn,bet]=Qu.shift();
 (window.F21?F21.pre(fn.t):Promise.resolve()).then(()=>fn(bet)).then(w=>{window.F21&&F21.back();award(w,bet)}).catch(e=>console.error(e)).finally(()=>{busy=false;window.__hold=false;['spinBtn','minus','plus','maxBtn','resetBtn'].forEach(i=>$(i)&&($(i).disabled=false));setTimeout(pump,800)})}
function queue(fn,bet){Qu.push([fn,bet]);setTimeout(pump,1200)}
function award(w,bet,lbl){w=Math.round(w);if(!(w>0))return;bal+=w;$('win').textContent=w;try{ui();saveLater&&saveLater()}catch(e){}const tot=bet*NL;if(w/tot>=10&&window.bigWin)setTimeout(()=>bigWin(w,tot),300);}
function pick(a){let s=a.reduce((x,y)=>x+y[1],0),r=Math.random()*s;for(const v of a){if((r-=v[1])<0)return v[0]}return a[0][0]}
function stage(title){const b=$('board');const L=document.createElement('div');L.className='rfx';L.setAttribute('role','dialog');L.setAttribute('aria-label',title);const p=b.offsetParent;Object.assign(L.style,{left:b.offsetLeft+'px',top:b.offsetTop+'px',width:b.offsetWidth+'px',height:b.offsetHeight+'px'});L.innerHTML=`<p class="rfxN">僅供娛樂・虛擬籌碼・純虛擬・無兌現</p>`;p.appendChild(L);b.classList.add('rfxOn');return L}
function finish(L,w,msg,noAmt){return new Promise(res=>{const r=document.createElement('div');r.className='rfxRes';r.innerHTML=`<small>${msg}</small>${noAmt?'':`<b>${NF.format(Math.round(w))}</b>`}`;L.appendChild(r);let done=0;const end=()=>{if(done)return;done=1;L.classList.add('out');$('board').classList.remove('rfxOn','rfxSuck');setTimeout(()=>L.remove(),380);res(w)};L.onclick=end;setTimeout(end,RM?400:1800)})}
const cvs=(L,W,H)=>{const c=document.createElement('canvas'),d=Math.min(1.5,devicePixelRatio||1);c.width=W*d;c.height=H*d;c.style.cssText=`position:absolute;left:0;top:0;width:${W}px;height:${H}px`;L.prepend(c);const x=c.getContext('2d');x.scale(d,d);return [c,x]};
function twUI(){const h=$('czHero');if(!h)return;let e=$('twBox');if(!e){e=document.createElement('div');e.id='twBox';e.innerHTML='<div class="tr"><i>旋</i></div><div><b>旋風聚寶</b><span></span></div>';h.appendChild(e)}
 e.style.setProperty('--p',tw.n/TW_N*100);e.querySelector('span').textContent=NF.format(Math.round(tw.pot));e.classList.toggle('hot',tw.n>=TW_N*.85)}
function erupt(){const pot=tw.pot;tw={n:0,pot:0};localStorage.setItem(KEY,JSON.stringify(tw));twUI();
 const fn=async function(bet){const L=stage('旋風聚寶'),W=L.clientWidth,H=L.clientHeight;const [cv,x]=cvs(L,W,H);L.insertAdjacentHTML('beforeend',`<div class="rvPot"><small>聚寶罐</small><b>0</b></div>`);const tv=L.querySelector('.rvPot b');$('board').classList.add('rfxSuck');
  const gl=document.createElement('canvas');gl.width=gl.height=32;{const g=gl.getContext('2d'),r=g.createRadialGradient(16,16,0,16,16,16);r.addColorStop(0,'rgba(255,255,235,1)');r.addColorStop(.3,'rgba(255,214,90,.8)');r.addColorStop(1,'rgba(255,150,30,0)');g.fillStyle=r;g.fillRect(0,0,32,32)}
  const P=[];for(let i=0;i<120;i++)P.push({a:Math.random()*6.28,r:.15+Math.random()*.85,s:.6+Math.random()*1.4,z:Math.random()<.25});
  tone(160,0,2.4,'sawtooth',.03,900);tone(80,0,2.4,'sine',.08,160);const t0=performance.now(),D=RM?200:2600,cx=W/2,cy=H/2,RX=W*.52,RY=H*.55;
  await new Promise(res=>{(function fr(t){const k=Math.min(1,(t-t0)/D),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;x.clearRect(0,0,W,H);
   const bg=x.createRadialGradient(cx,cy,4,cx,cy,Math.max(W,H)*.6);bg.addColorStop(0,`rgba(255,200,90,${.2+.3*e})`);bg.addColorStop(1,'rgba(20,6,32,.55)');x.fillStyle=bg;x.fillRect(0,0,W,H);
   x.globalCompositeOperation='lighter';
   for(let j=0;j<8;j++){const rr=(1-j/8),sw=(t/260+j*.8)%6.28;x.beginPath();x.ellipse(cx,cy,RX*rr*(1-e*.3),RY*rr*(1-e*.3),0,sw,sw+3.6);x.strokeStyle=`rgba(255,${200+j*6},${100+j*15},${.16+.05*j})`;x.lineWidth=2.4;x.stroke()}
   for(const p of P){p.a+=.035*p.s*(1+e*4)/(p.r+.3);const rr=p.r*(1-e*.85),px=cx+Math.cos(p.a)*RX*rr,py=cy+Math.sin(p.a)*RY*rr;const sz=(p.z?14:8)*(0.5+p.r*.6);x.globalAlpha=.55+.45*Math.sin(p.a*2+1);x.drawImage(gl,px-sz/2,py-sz/2,sz,sz)}
   x.globalAlpha=1;x.globalCompositeOperation='source-over';tv.textContent=NF.format(Math.round(pot*e));
   if(k<1)requestAnimationFrame(fr);else res()})(t0)});
  window.W21&&(()=>{const r=L.getBoundingClientRect();W21.burst(r.left+r.width/2,r.top+r.height/2,24,300)})();
  tone(523,0,.3,'square',.05);tone(784,.12,.5,'square',.05);tone(1047,.24,.6,'triangle',.05);return finish(L,pot,'旋風聚寶獎金')};fn.t='旋風聚寶';return fn}
/* ---- 幸運彈珠 ---- */
async function plinko(bet){const tot=bet*NL,R=8;const L=stage('幸運彈珠'),W=L.clientWidth,H=L.clientHeight;const [cv,x]=cvs(L,W,H);
 const SP=window.B22&&B22.SPR,img=s=>{const i=new Image();i.src=s;return i};const PEG=SP&&SP.peg,BALL=SP&&SP.ball;
 const SH=Math.max(22,Math.min(30,H*.15)),sp=W/(R+2),gx=(r,i)=>W/2+(i-r/2)*sp,gy=r=>10+r*(H-SH-22)/R,SY=H-SH-4,SW=sp-3;let path=[0];for(let r=0;r<R;r++)path.push(path[r]+(Math.random()<.5?0:1));const slot=path[R];
 const slotCol=v=>v>=100?['#fff6cf','#ffd65a','#a8640c']:v>=25?['#ffd0e6','#ff6fae','#8a1048']:v>=8?['#d6fff0','#3fc69a','#0f5a46']:['#e8dcff','#8a6ad6','#3a1f6e'];
 const trail=[];let hl=-1,glow=0;
 function draw(bx,by,drop){x.clearRect(0,0,W,H);x.fillStyle='rgba(14,4,24,.42)';x.fillRect(0,0,W,H);
  for(let r=1;r<=R;r++)for(let i=0;i<=r;i++){const d=drop==null?1:Math.max(0,Math.min(1,(drop-(r*0.06+i*0.015))/0.35));const e=1-Math.pow(1-d,3);const px=gx(r,i),py=gy(r)-6-(1-e)*40;x.globalAlpha=e;if(PEG)x.drawImage(PEG,px-6,py-6,12,12);else{x.fillStyle='#ffd65a';x.beginPath();x.arc(px,py,4,0,7);x.fill()}x.globalAlpha=1}
  PL.forEach((v,i)=>{const sx=gx(R,i)-SW/2,c=slotCol(v);const gg=x.createLinearGradient(0,SY,0,SY+SH);gg.addColorStop(0,c[0]);gg.addColorStop(.45,c[1]);gg.addColorStop(1,c[2]);x.fillStyle=gg;x.beginPath();x.roundRect(sx,SY,SW,SH,6);x.fill();x.lineWidth=1.5;x.strokeStyle=i===hl?'#fff':'#5a3200';x.stroke();
   if(i===hl){x.save();x.globalCompositeOperation='lighter';x.fillStyle=`rgba(255,240,180,${.35+.3*Math.sin(glow)})`;x.beginPath();x.roundRect(sx-2,SY-2,SW+4,SH+4,7);x.fill();x.restore()}
   x.font='900 11px "Noto Sans TC",sans-serif';x.textAlign='center';x.lineWidth=3;x.strokeStyle='rgba(40,10,0,.85)';x.strokeText('×'+v,sx+SW/2,SY+SH/2+4,SW-2);x.fillStyle='#fff';x.fillText('×'+v,sx+SW/2,SY+SH/2+4,SW-2)});
  if(bx!=null){x.save();x.globalCompositeOperation='lighter';trail.forEach((p,i)=>{x.globalAlpha=(i+1)/trail.length*.35;x.beginPath();x.arc(p[0],p[1],6*(i+1)/trail.length+2,0,7);x.fillStyle='#ffd65a';x.fill()});x.restore();x.globalAlpha=1;if(BALL)x.drawImage(BALL,bx-9,by-9,18,18);else{x.fillStyle='#fff';x.beginPath();x.arc(bx,by,8,0,7);x.fill()}}}
 const toScr=(px,py)=>{const r=cv.getBoundingClientRect();return [r.left+px,r.top+py]};
 const t0=performance.now();await new Promise(res=>{(function f(t){const d=(t-t0)/700;draw(null,null,d);if(d<1.6&&!RM)requestAnimationFrame(f);else res()})(t0)});
 for(let r=0;r<R;r++){const ax=gx(r,path[r]),ay=gy(r)-6,bx=gx(r+1,path[r+1]),by=gy(r+1)-6;const steps=r>=R-2?14:10;
  for(let s=1;s<=steps;s++){const k=s/steps,ek=k*k*(3-2*k);const px=ax+(bx-ax)*ek,py=ay+(by-ay)*k-Math.sin(k*Math.PI)*8;trail.push([px,py]);if(trail.length>6)trail.shift();draw(px,py);await sleep(16)}
  const [sx,sy]=toScr(bx,by+4);window.W21&&W21.burst(sx,sy,5,110);tone(700+r*85+Math.random()*30,0,.07,'triangle',.06);tone(1800+r*60,0,.03,'square',.02)}
 const fx=gx(R,slot);for(let s=1;s<=8;s++){const k=s/8;const px=trail.length?trail[trail.length-1][0]:fx;draw(px+(fx-px)*k,gy(R)-6+(SY+SH/2-(gy(R)-6))*k);await sleep(16)}
 hl=slot;for(let i=0;i<20;i++){glow+=.5;draw(fx,SY+SH/2);await sleep(30)}
 {const [sx,sy]=toScr(fx,SY+SH/2);window.W21&&W21.burst(sx,sy,16,240)}
 tone(523,0,.3,'triangle',.06);tone(1047,.1,.4,'triangle',.06);if(PL[slot]>=25&&window.AV)AV.celebrate(PL[slot]>=100?1:0);const w=PL[slot]*tot;return finish(L,w,`落入 ×${PL[slot]}`)}
plinko.t='幸運彈珠';
/* ---- 三重彩金輪 ---- */
async function wheel(bet){const tot=bet*NL,n=WH.length,L=stage('三重彩金輪'),W=L.clientWidth,H=L.clientHeight,cw=W/5,REP=7;
 const lab=s=>s[1]||('×'+s[0]),cls=s=>s[1]==='大獎'?'maj':s[1]==='小獎'?'min':s[1]==='迷你'?'mini':'';const k=Math.random()*n|0;
 let tiles='';for(let r=0;r<REP;r++)WH.forEach((s,i)=>tiles+=`<i class="${cls(s)} ${i%2?'a':'b'}" style="width:${cw}px">${lab(s)}</i>`);
 let bulbs='';for(let i=0;i<20;i++)bulbs+=`<u class="${i%2?'o':''}"></u>`;
 L.insertAdjacentHTML('beforeend',`<div class="rwBul t" style="top:${H/3-7}px">${bulbs}</div><div class="rwRing" style="top:${H/3}px;height:${H/3}px"><div class="rwStrip">${tiles}</div></div><div class="rwBul b" style="top:${H*2/3-7}px">${bulbs}</div><div class="rwPtr" style="left:${2*cw}px;width:${cw}px;top:${H/3}px;height:${H/3}px"></div>`);
 const st=L.querySelector('.rwStrip'),ring=L.querySelector('.rwRing');await sleep(650);const target=(REP-2)*n+k,X=-(target-2)*cw,T=RM?0:4200;
 st.style.transition=`transform ${T}ms cubic-bezier(.12,.6,.1,1)`;await sleep(40);st.style.transform=`translateX(${X}px)`;L.classList.add('go');
 let last=-1,fc=0;const t0=performance.now();await new Promise(res=>{(function f(){const el=performance.now()-t0;if(fc++%2===0){const m=new DOMMatrix(getComputedStyle(st).transform);const a=Math.floor(-m.e/cw);if(a!==last){last=a;tone(1500-Math.min(1,el/T)*700,0,.03,'square',.03)}}if(el<T+100)requestAnimationFrame(f);else res()})()});
 L.classList.remove('go');st.children[target].classList.add('win');const s=WH[k];if(s[1]&&window.AV)AV.celebrate(s[1]==='大獎'?2:s[1]==='小獎'?1:0);else{tone(659,0,.3,'triangle',.06);tone(988,.1,.4,'triangle',.06)}
 {const r=ring.getBoundingClientRect();window.W21&&W21.burst(r.left+r.width/2,r.top+r.height/2,16,240)}return finish(L,s[0]*tot,s[1]?`${s[1]}！ ×${s[0]}`:`× ${s[0]}`)}
wheel.t='三重彩金輪';
/* ---- 狂熱倍數 ---- */
function mxUI(){const wb=$('win')&&$('win').parentElement;let e=$('mxBadge');if(!armed){if(e){e.parentElement&&e.parentElement.classList.remove('mxHost');e.remove()}return}if(!wb)return;if(!e){e=document.createElement('div');e.id='mxBadge';e.className='rmx';wb.classList.add('mxHost');wb.appendChild(e)}e.textContent='×'+armed}
let mxR=2;async function mxShow(){const R=Math.max(2,armed||mxR);const L=stage('狂熱倍數'),W=L.clientWidth,H=L.clientHeight,cw=W/5,ch=H/3;const seq=[];for(let i=0;i<18;i++)seq.push([2,3,5][i%3]);seq.push(R,2,3);
 L.insertAdjacentHTML('beforeend',`<div class="rmCol" style="left:${2*cw}px;width:${cw}px"><div class="rmStrip">${seq.map(v=>`<i style="height:${ch}px">×${v}</i>`).join('')}</div></div>`);const st=L.querySelector('.rmStrip');await sleep(350);
 const T=RM?0:2000;st.style.transition=`transform ${T}ms cubic-bezier(.15,.6,.15,1)`;await sleep(40);st.style.transform=`translateY(${-(seq.length-3-1+1-1)*ch+0}px)`;
 for(let i=0;i<10;i++)tone(600+i*60,i*T/10000,.04,'square',.03);await sleep(T+100);const tile=st.children[seq.length-3];tile.classList.add('win');L.querySelector('.rmCol').classList.add('exp');tone(660,0,.15,'square',.05);tone(990,.12,.3,'square',.05);
 {const r=tile.getBoundingClientRect();window.W21&&W21.burst(r.left+r.width/2,r.top+r.height/2,18,240)}await sleep(500);mxUI();return finish(L,0,`下次中獎 ×${R} 加倍！`,true)}
mxShow.t='狂熱倍數';
/* ---- hook settle results ---- */
let PR=null;addEventListener('load',()=>{const b=$('board');b&&new MutationObserver(()=>{if(b.getAttribute('aria-busy')==='true')PR=(typeof FS!=='undefined'&&FS)?null:{m:Math.random(),p:Math.random(),w:Math.random()}}).observe(b,{attributes:true,attributeFilter:['aria-busy']})});
const CZo=window.CZ&&CZ.onSettle;if(CZo)CZ.onSettle=function(o){const r=CZo.apply(this,arguments);const Rr=PR||{m:Math.random(),p:Math.random(),w:Math.random()};PR=null;try{if(!o.free){const tot=o.total,bet=tot/NL;
 if(armed&&!o.free&&!(o.won>0)){$('msg')&&($('msg').textContent=`狂熱倍數 ×${armed} 保留中・下次中獎就加倍！`)}else if(armed&&o.won>0){const R=armed;armed=0;mxUI();{const ex=o.won*(R-1);bal+=ex;$('win').textContent=o.won*R;try{ui();saveLater&&saveLater()}catch(e){}$('msg').textContent=`狂熱倍數 ×${R}！本局共贏得 ${NF.format(o.won*R)} 籌碼！`;window.AV&&AV.celebrate(0)}}
 else if(Rr.m<3*(MP[ID]||0)){tk.m++;if(tk.m>=3){tk.m=0;armed=mxR=pick(MX);queue(mxShow,bet)}emitT('mult')}
 tw.n++;tw.pot+=tot*TW_R*TW_U[Math.random()*TW_U.length|0];if(tw.n>=TW_N)queue(erupt(),bet);localStorage.setItem(KEY,JSON.stringify(tw));twUI();
 if(Rr.p<5*PL_P){tk.p++;const full=tk.p>=5;if(full)tk.p=0;emitT('plinko',full);if(full)queue(plinko,bet)}if(Rr.w<12*WH_P){tk.w++;const full=tk.w>=12;if(full)tk.w=0;emitT('wheel',full);if(full)queue(wheel,bet)}saveT();emitT('tick')}}catch(e){console.error(e)}return r};
/* ---- buy 寶珠鎖定重轉 ---- */
function buyUI(){const m=$('menu16'),b0=$('czBuyBtn');if(!m||!b0||$('czBuyHS'))return;const b=document.createElement('button');b.id='czBuyHS';b.type='button';b.className='czbuyitem';b.innerHTML='<span class="ic" aria-hidden="true">🔮</span><span class="czbt"><b>寶珠鎖定重轉</b><small></small></span>';b0.after(b);
 const price=()=>Math.round(BETS[betIdx]*NL*HS_BUY);const lab=()=>{b.querySelector('small').textContent=`花 ${price().toLocaleString()} 籌碼開啟`};lab();new MutationObserver(lab).observe($('bet'),{childList:true,characterData:true,subtree:true});
 const d=document.createElement('dialog');d.id='czBuyHSd';d.innerHTML=`<h2>寶珠鎖定重轉</h2><p class="czbp"></p><p class="note">直接進入寶珠鎖定重轉（6 顆寶珠起始、3 次重轉）。<br>理論回收率約 94%（模擬）・僅使用虛擬籌碼・純虛擬・無兌現</p><div class="dact"><button class="claim" id="czBuyHSOk">確認購買</button><button id="czBuyHSNo">取消</button></div>`;document.body.appendChild(d);
 b.onclick=()=>{if(!idle()||!window.CZHS)return;d.querySelector('.czbp').innerHTML=`價格：<b>${price().toLocaleString()}</b> 籌碼（總押注 ${BETS[betIdx]*NL} × ${HS_BUY}）`;$('czBuyHSOk').disabled=bal<price();$('czBuyHSOk').textContent=bal<price()?'籌碼不足':'確認購買';try{$('menu16').classList.remove('open')}catch(e){}d.showModal()};
 $('czBuyHSNo').onclick=()=>d.close();$('czBuyHSOk').onclick=()=>{d.close();const p=price();if(bal<p||!idle())return;bal-=p;try{ui();saveLater&&saveLater()}catch(e){}CZHS.force(BETS[betIdx])}}
function boot(){twUI();buyUI()}
if(document.readyState==='complete')setTimeout(boot,300);else addEventListener('load',()=>setTimeout(boot,300));
window.CZF={tk:()=>tk,emit:()=>emitT('tick'),force:{plinko:()=>queue(plinko,BETS[betIdx]),wheel:()=>queue(wheel,BETS[betIdx]),erupt:()=>{tw.n=TW_N;tw.pot=Math.max(tw.pot,BETS[betIdx]*NL*1.2);queue(erupt(),BETS[betIdx])},mult:()=>{armed=mxR=pick(MX);queue(mxShow,BETS[betIdx])}},pending:()=>!!PR&&!armed&&((PR.p<5*PL_P&&tk.p+1>=5)||(PR.w<12*WH_P&&tk.w+1>=12)||(PR.m<3*(MP[ID]||0)&&tk.m+1>=3)||tw.n+1>=TW_N),tw:()=>tw,MP,PL_P,WH_P};
})();
