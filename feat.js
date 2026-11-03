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
let armed=0;const Qu=[];let busy=false;
function idle(){return !(typeof spinning!=='undefined'&&spinning)&&!(typeof bwState!=='undefined'&&bwState)&&!(typeof FS!=='undefined'&&FS)&&!$('hsBox')&&!window.__hold&&!($('czMG')&&$('czMG').offsetParent)}
function pump(){if(busy||!Qu.length)return;if(!idle()){setTimeout(pump,500);return}busy=true;window.__hold=true;const [fn,bet]=Qu.shift();
 (window.F21?F21.pre():Promise.resolve()).then(()=>fn(bet)).then(w=>{window.F21&&F21.back();award(w,bet)}).catch(e=>console.error(e)).finally(()=>{busy=false;window.__hold=false;['spinBtn','minus','plus','maxBtn','resetBtn'].forEach(i=>$(i)&&($(i).disabled=false));setTimeout(pump,800)})}
function queue(fn,bet){Qu.push([fn,bet]);setTimeout(pump,1200)}
function award(w,bet,lbl){w=Math.round(w);if(!(w>0))return;bal+=w;$('win').textContent=w;try{ui();saveLater&&saveLater()}catch(e){}const tot=bet*NL;if(w/tot>=10&&window.bigWin)setTimeout(()=>bigWin(w,tot),300);}
function pick(a){let s=a.reduce((x,y)=>x+y[1],0),r=Math.random()*s;for(const v of a){if((r-=v[1])<0)return v[0]}return a[0][0]}
function ov(title,inner){const o=document.createElement('div');o.className='fxOv';o.setAttribute('role','dialog');o.setAttribute('aria-label',title);o.innerHTML=`<div class="fxIn"><h2>${title}</h2>${inner}<p class="fxNote">僅供娛樂・虛擬籌碼・無真實金錢</p></div>`;document.body.appendChild(o);return o}
function finish(o,w,msg){return new Promise(res=>{const r=o.querySelector('.fxRes');r.innerHTML=`${msg}<b>${NF.format(Math.round(w))}</b>`;const b=document.createElement('button');b.textContent='收下';r.after(b);let done=false;const end=()=>{if(done)return;done=true;o.classList.add('out');setTimeout(()=>o.remove(),480);res(w)};b.onclick=end;setTimeout(end,5000)})}
/* ---- 旋風聚寶 widget ---- */
function twUI(){const h=$('czHero');if(!h)return;let e=$('twBox');if(!e){e=document.createElement('div');e.id='twBox';e.innerHTML='<div class="tr"><i>旋</i></div><div><b>旋風聚寶</b><span></span></div>';h.appendChild(e)}
 e.style.setProperty('--p',tw.n/TW_N*100);e.querySelector('span').textContent=NF.format(Math.round(tw.pot));e.classList.toggle('hot',tw.n>=TW_N*.85)}
function erupt(){const pot=tw.pot;tw={n:0,pot:0};localStorage.setItem(KEY,JSON.stringify(tw));twUI();
 return async function(bet){const o=ov('旋風聚寶',`<canvas width="300" height="230"></canvas><p>旋風捲起累積的籌碼！</p><div class="fxRes"></div>`);const cv=o.querySelector('canvas'),x=cv.getContext('2d');const P=[];for(let i=0;i<90;i++)P.push({a:Math.random()*6.28,r:60+Math.random()*120,y:Math.random()*230,s:.03+Math.random()*.05});
  tone(200,0,2.2,'sawtooth',.03,900);const t0=performance.now();await new Promise(res=>{(function f(t){const k=Math.min(1,(t-t0)/2200);x.clearRect(0,0,300,230);
   for(let j=0;j<10;j++){x.beginPath();x.ellipse(150,40+j*19,20+j*9*(1-k*.3),5+j,0,0,6.28);x.strokeStyle=`rgba(255,214,90,${.12+.05*j})`;x.lineWidth=2;x.stroke()}
   for(const p of P){p.a+=p.s*(1+k*3);p.r*=1-.012*k;const px=150+Math.cos(p.a)*p.r*(.3+p.y/330),py=p.y-k*60;x.beginPath();x.arc(px,py,4,0,6.28);x.fillStyle='#ffcc33';x.fill()}
   if(k<1&&!RM)requestAnimationFrame(f);else res()})(t0)});
  tone(523,0,.3,'square',.05);tone(784,.12,.5,'square',.05);return finish(o,pot,'旋風聚寶獎金')}}
/* ---- 幸運彈珠 ---- */
async function plinko(bet){const tot=bet*NL,W=300,H=270,R=8;const o=ov('幸運彈珠',`<canvas width="${W}" height="${H}"></canvas><p>彈珠落入的格子決定獎金（× 總押注）</p><div class="fxRes"></div>`);const x=o.querySelector('canvas').getContext('2d');
 const gx=(row,i)=>W/2+(i-row/2)*32,gy=row=>22+row*25;let path=[0];for(let r=0;r<R;r++)path.push(path[r]+(Math.random()<.5?0:1));const slot=path[R];
 function draw(bx,by,hl){x.clearRect(0,0,W,H);for(let r=1;r<=R;r++)for(let i=0;i<=r;i++){x.beginPath();x.arc(gx(r,i)-16+16,gy(r)-12,3,0,6.28);x.fillStyle='#ffd65a';x.shadowColor='rgba(255,200,90,.8)';x.shadowBlur=5;x.fill();x.shadowBlur=0}
  PL.forEach((v,i)=>{const sx=gx(R,i)-15,sy=gy(R)+6;x.fillStyle=i===hl?'#ffe680':(v>=25?'#7a1840':v>=8?'#4a1a6a':'#2a1440');x.strokeStyle='#ffd65a';x.lineWidth=1.5;x.strokeRect(sx+.5,sy+.5,29,25);x.fillRect(sx,sy,30,26);x.fillStyle=i===hl?'#3a1600':'#fff';x.font='900 10px "Noto Sans TC",sans-serif';x.textAlign='center';x.fillText('×'+v,sx+15,sy+17,29)});
  if(bx!=null){x.beginPath();x.arc(bx,by,7,0,6.28);x.fillStyle='#fff';x.shadowColor='#ffd65a';x.shadowBlur=12;x.fill();x.shadowBlur=0}}
 draw();await sleep(400);for(let r=0;r<R;r++){const ax=gx(r,path[r]),ay=gy(r)-6,bx=gx(r+1,path[r+1]),by=gy(r+1)-6;for(let s=0;s<=10;s++){const k=s/10;draw(ax+(bx-ax)*k,ay+(by-ay)*k-Math.sin(k*3.14)*10);await sleep(22)}tone(900+r*80,0,.06,'sine',.05)}
 draw(gx(R,slot),gy(R)+12,slot);tone(523,0,.3,'triangle',.06);tone(1047,.1,.4,'triangle',.06);const w=PL[slot]*tot;return finish(o,w,`落入 ×${PL[slot]}`)}
/* ---- 三重彩金輪 ---- */
async function wheel(bet){const tot=bet*NL,n=WH.length,S=260,c=S/2;const col=['#4a1a6a','#7a1840','#3a1f6e','#68204e'];let seg='';
 WH.forEach((s,i)=>{const a0=(i/n)*6.2832-1.5708,a1=((i+1)/n)*6.2832-1.5708,am=(a0+a1)/2,r=c-6;const p=(a)=>`${c+Math.cos(a)*r},${c+Math.sin(a)*r}`;const fill=s[1]==='大獎'?'#d23a7c':s[1]==='小獎'?'#2f8f6a':s[1]==='迷你'?'#2f6fb0':col[i%4];
  seg+=`<path d="M${c},${c} L${p(a0)} A${r},${r} 0 0 1 ${p(a1)} Z" fill="${fill}" stroke="#ffd65a" stroke-width="2.5"/><text x="${c+Math.cos(am)*r*.68}" y="${c+Math.sin(am)*r*.68}" transform="rotate(${am*57.2958+90} ${c+Math.cos(am)*r*.68} ${c+Math.sin(am)*r*.68})" text-anchor="middle" dominant-baseline="middle" fill="#fff" font-family="Noto Sans TC" font-weight="900" font-size="${s[1]?13:14}">${s[1]||'×'+s[0]}</text>`});
 const o=ov('三重彩金輪',`<div style="position:relative;width:${S}px;margin:0 auto"><svg width="${S}" height="${S}" viewBox="0 0 ${S} ${S}"><g id="whG" style="transform-origin:${c}px ${c}px">${seg}</g><circle cx="${c}" cy="${c}" r="24" fill="#2a0f3a" stroke="#e8be64" stroke-width="3"/><text x="${c}" y="${c+1}" text-anchor="middle" dominant-baseline="middle" fill="#ffe680" font-weight="900" font-size="13" font-family="Noto Sans TC">彩金</text></svg><div style="position:absolute;left:50%;top:-4px;transform:translateX(-50%);width:0;height:0;border-left:12px solid transparent;border-right:12px solid transparent;border-top:22px solid #ffe680;filter:drop-shadow(0 2px 2px #000)"></div></div><p>迷你 ×30・小獎 ×80・大獎 ×250（× 總押注）</p><div class="fxRes"></div>`);
 const k=Math.random()*n|0,g=o.querySelector('#whG'),deg=360*6-(k+.5)*(360/n),T=RM?0:4200;g.style.transition=`transform ${T}ms cubic-bezier(.12,.6,.1,1)`;await sleep(60);g.style.transform=`rotate(${deg}deg)`;
 let last=-1;const t0=performance.now();await new Promise(res=>{let fc=0;(function f(){if(fc++%3){if(performance.now()-t0<T+100)return requestAnimationFrame(f);return res()}const m=new DOMMatrix(getComputedStyle(g).transform);const a=Math.floor(((Math.atan2(m.b,m.a)*57.2958+360)%360)/(360/n));if(a!==last){last=a;tone(1400,0,.03,'square',.03)}if(performance.now()-t0<T+100)requestAnimationFrame(f);else res()})()});
 const s=WH[k];if(s[1]&&window.AV)AV.celebrate(s[1]==='大獎'?2:s[1]==='小獎'?1:0);else{tone(659,0,.3,'triangle',.06);tone(988,.1,.4,'triangle',.06)}return finish(o,s[0]*tot,s[1]?`${s[1]}！`:`× ${s[0]}`)}
/* ---- 狂熱倍數 ---- */
function mxUI(){const h=$('czHero');let e=$('mxBadge');if(!armed){e&&e.remove();return}if(!h)return;if(!e){e=document.createElement('div');e.id='mxBadge';h.appendChild(e)}e.innerHTML=`狂熱倍數 ×${armed}<small>下一局獎金加倍</small>`}
/* ---- hook settle results ---- */
const CZo=window.CZ&&CZ.onSettle;if(CZo)CZ.onSettle=function(o){const r=CZo.apply(this,arguments);try{if(!o.free){const tot=o.total,bet=tot/NL;
 if(armed){const R=armed;armed=0;mxUI();if(o.won>0){const ex=o.won*(R-1);bal+=ex;$('win').textContent=o.won*R;try{ui();saveLater&&saveLater()}catch(e){}$('msg').textContent=`狂熱倍數 ×${R}！本局共贏得 ${NF.format(o.won*R)} 籌碼！`;window.AV&&AV.celebrate(0)}}
 else if(Math.random()<(MP[ID]||0)){armed=pick(MX);mxUI();tone(660,0,.15,'square',.05);tone(990,.12,.3,'square',.05)}
 tw.n++;tw.pot+=tot*TW_R*TW_U[Math.random()*TW_U.length|0];if(tw.n>=TW_N)queue(erupt(),bet);localStorage.setItem(KEY,JSON.stringify(tw));twUI();
 if(Math.random()<PL_P)queue(plinko,bet);if(Math.random()<WH_P)queue(wheel,bet)}}catch(e){console.error(e)}return r};
/* ---- buy 寶珠鎖定重轉 ---- */
function buyUI(){const m=$('menu16'),b0=$('czBuyBtn');if(!m||!b0||$('czBuyHS'))return;const b=document.createElement('button');b.id='czBuyHS';b.type='button';b.className='czbuyitem';b.innerHTML='<span class="ic" aria-hidden="true">🔮</span><span class="czbt"><b>寶珠鎖定重轉</b><small></small></span>';b0.after(b);
 const price=()=>Math.round(BETS[betIdx]*NL*HS_BUY);const lab=()=>{b.querySelector('small').textContent=`花 ${price().toLocaleString()} 籌碼開啟`};lab();new MutationObserver(lab).observe($('bet'),{childList:true,characterData:true,subtree:true});
 const d=document.createElement('dialog');d.id='czBuyHSd';d.innerHTML=`<h2>寶珠鎖定重轉</h2><p class="czbp"></p><p class="note">直接進入寶珠鎖定重轉（6 顆寶珠起始、3 次重轉）。<br>理論回收率約 94%（模擬）・僅使用虛擬籌碼・無真實金錢</p><div class="dact"><button class="claim" id="czBuyHSOk">確認購買</button><button id="czBuyHSNo">取消</button></div>`;document.body.appendChild(d);
 b.onclick=()=>{if(!idle()||!window.CZHS)return;d.querySelector('.czbp').innerHTML=`價格：<b>${price().toLocaleString()}</b> 籌碼（總押注 ${BETS[betIdx]*NL} × ${HS_BUY}）`;$('czBuyHSOk').disabled=bal<price();$('czBuyHSOk').textContent=bal<price()?'籌碼不足':'確認購買';try{$('menu16').classList.remove('open')}catch(e){}d.showModal()};
 $('czBuyHSNo').onclick=()=>d.close();$('czBuyHSOk').onclick=()=>{d.close();const p=price();if(bal<p||!idle())return;bal-=p;try{ui();saveLater&&saveLater()}catch(e){}CZHS.force(BETS[betIdx])}}
function boot(){twUI();buyUI()}
if(document.readyState==='complete')setTimeout(boot,300);else addEventListener('load',()=>setTimeout(boot,300));
window.CZF={force:{plinko:()=>queue(plinko,BETS[betIdx]),wheel:()=>queue(wheel,BETS[betIdx]),erupt:()=>{tw.n=TW_N;tw.pot=Math.max(tw.pot,BETS[betIdx]*NL*1.2);queue(erupt(),BETS[betIdx])},mult:()=>{armed=pick(MX);mxUI()}},tw:()=>tw,MP,PL_P,WH_P};
})();
