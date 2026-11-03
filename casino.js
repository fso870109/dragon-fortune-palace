/* 龍運金殿 shared layer — PLAY MONEY ONLY (僅供娛樂・虛擬籌碼・無真實金錢) */
(()=>{
const LS=localStorage,J=(k,d)=>{try{const v=JSON.parse(LS.getItem(k));return v==null?d:v}catch(e){return d}},S=(k,v)=>{try{LS.setItem(k,JSON.stringify(v))}catch(e){}};
const IN_M=!!window.CZM,RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const JP={seed:[500,5000,50000],name:['MINI','MAJOR','GRAND'],c:0.008,split:[.3,.3,.4],w:[.70,.25,.05],d:200000};
const VIP=[[1,'一般會員','#c9c3d6'],[5,'銅卡會員','#e0915a'],[10,'銀卡會員','#dfe6f2'],[20,'金卡會員','#ffd27a'],[35,'白金會員','#bff4ff'],[50,'鑽石會員','#ff9de0']];
const MACH={love:'夜色戀曲♡',matsuri:'夏祭戀花火',caishen:'財神降臨'};
const need=l=>Math.round(400*Math.pow(l,1.45));
const today=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
const MISS=[{id:'spin',t:'今日旋轉 50 次',g:50,r:300},{id:'won',t:'今日累積贏得 2,000 籌碼',g:2000,r:400},{id:'fs',t:'觸發 1 次免費旋轉',g:1,r:500},{id:'mach',t:'今日玩過 2 台不同機台',g:2,r:300},{id:'big',t:'達成 1 次 BIG WIN 以上',g:1,r:600}];
const ACH=[{id:'first',t:'初次中獎',d:'第一次贏得籌碼',r:100},{id:'s100',t:'常客',d:'累計旋轉 100 次',r:300},{id:'s1000',t:'夜之常駐',d:'累計旋轉 1,000 次',r:1500},{id:'big',t:'BIG WIN!',d:'首次 BIG WIN',r:500},{id:'epic',t:'EPIC 傳說',d:'單次贏得總押注 80 倍以上',r:2000},{id:'jp',t:'彩金得主',d:'首次抽中彩金',r:1000},{id:'lv10',t:'銀卡晉升',d:'達到 Lv.10',r:1000},{id:'all',t:'全館制霸',d:'三台機台都玩過',r:800},{id:'buy',t:'直通 BONUS',d:'首次購買免費旋轉',r:200}];
let st=J('cz_st',null);if(!st||typeof st!=='object')st={xp:0,lv:1,spins:0,won:0,ach:{},mach:{},free:0,feed:[]};
st.ach=st.ach||{};st.mach=st.mach||{};st.feed=st.feed||[];
function day(){if(!st.d||st.d.date!==today())st.d={date:today(),spin:0,won:0,fs:0,mach:[],big:0,cl:{}};return st.d}
let svT=0;const save=()=>{if(svT)return;svT=setTimeout(()=>{svT=0;S('cz_st',st)},400)};addEventListener('pagehide',()=>S('cz_st',st));
function pools(){let p=J('cz_jp',null);if(!Array.isArray(p)||p.length!==3)p=JP.seed.slice();return p}
let P=pools(),pT=0;const saveP=()=>{if(pT)return;pT=setTimeout(()=>{pT=0;S('cz_jp',P)},500)};addEventListener('pagehide',()=>S('cz_jp',P));
const getBal=()=>typeof bal==='number'?bal:(+(LS.getItem('fs_bal')??1000)||0);
function addChips(v){if(typeof bal==='number'){bal+=v;ui()}else S('fs_bal',getBal()+v);emit()}
const vipOf=l=>{let r=VIP[0];for(const v of VIP)if(l>=v[0])r=v;return r};
const ls=new Set();function emit(){ls.forEach(f=>{try{f()}catch(e){}})}
const vib=p=>{try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}};
function toast(t){let w=document.getElementById('czToast');if(!w){w=document.createElement('div');w.id='czToast';w.setAttribute('role','status');document.body.appendChild(w)}
 const e=document.createElement('div');e.className='czt';e.textContent=t;w.appendChild(e);setTimeout(()=>e.remove(),3200)}
function feed(t){st.feed.unshift({t,ts:Date.now()});st.feed.length=Math.min(st.feed.length,12);save()}
function ach(id){if(st.ach[id])return;const a=ACH.find(x=>x.id===id);if(!a)return;st.ach[id]=Date.now();addChips(a.r);toast(`🏆 成就達成「${a.t}」＋${a.r} 籌碼`);feed(`成就「${a.t}」`);save()}
function addXP(x){st.xp+=x;let up=0;while(st.xp>=need(st.lv)){st.xp-=need(st.lv);st.lv++;up++;const r=100*st.lv;addChips(r);toast(`⬆️ 升級！Lv.${st.lv}（${vipOf(st.lv)[1]}）＋${r} 籌碼`);vib([20,40,20])}
 if(st.lv>=10)ach('lv10');if(up)feed(`升級到 Lv.${st.lv}`);save();emit()}
const FREE_MS=3*3600e3,freeAmt=()=>300+50*VIP.indexOf(vipOf(st.lv));
const freeLeft=()=>Math.max(0,(st.free||0)+FREE_MS-Date.now());
function claimFree(){if(freeLeft()>0)return false;st.free=Date.now();const v=freeAmt();addChips(v);toast(`🎁 免費籌碼 ＋${v}`);vib(15);save();return true}
function claimMission(id){const d=day(),m=MISS.find(x=>x.id===id);if(!m||d.cl[id])return;const v=id==='mach'?d.mach.length:d[id];if(v<m.g)return;d.cl[id]=1;addChips(m.r);toast(`✅ 任務完成「${m.t}」＋${m.r}`);save();emit()}
// sample leaderboard — fake players, clearly labelled
const SAMPLE=[['夜櫻美香',2860400],['Kaito★',1980300],['財神使者',1544800],['最愛煙火',1203000],['LuckyNeko',986500],['賞月兔',742000],['紅包王',530900],['Yuki_88',401200]];
window.CZ={st,JP,VIP,MISS,ACH,MACH,need,vipOf,pools:()=>P,getBal,addChips,claimFree,freeLeft,freeAmt,claimMission,day,on:f=>ls.add(f),sample:SAMPLE,toast,vib,feed,save,
 onBet(total){for(let i=0;i<3;i++)P[i]+=total*JP.c*JP.split[i];saveP();if(Math.random()<total/JP.d)pend=total},
 onSettle(o){if(window.CZAUTO&&CZAUTO.on&&(o.sc>=3||o.xr>=10||(pend&&!o.free)))CZAUTO.stop();const d=day();st.spins++;d.spin++;if(o.won>0){st.won+=o.won;d.won+=o.won;ach('first')}
  if(o.sc>=3){d.fs++}if(o.big){d.big++;ach('big')}if(o.xr>=80)ach('epic');
  if(IN_M){st.mach[CZM.id]=1;if(!d.mach.includes(CZM.id))d.mach.push(CZM.id);if(Object.keys(st.mach).length>=3)ach('all')}
  if(st.spins>=100)ach('s100');if(st.spins>=1000)ach('s1000');
  if(o.xr>=10)feed(`${IN_M?CZM.name:''} ${o.xr>=80?'EPIC':o.xr>=30?'MEGA':'BIG'} WIN ${Math.round(o.won).toLocaleString()}`);
  if(!o.free)addXP(Math.max(1,Math.round(o.total/4)));else save();
  if(pend&&!o.free){const t=pend;pend=0;waitIdle(()=>CZ.wheel(t))}emit()}};
let pend=0;
function idle(){return typeof spinning!=='undefined'&&!spinning&&!bwState&&!FS&&!document.querySelector('dialog[open]')}
function waitIdle(f){const k=()=>{if(idle())f();else setTimeout(k,300)};setTimeout(k,600)}
// ===== jackpot wheel =====
const SEG=[0,1,0,0,1,0,0,2,0,0,1,0,0,1,0,0,1,0,0,0];// 14 MINI, 5 MAJOR, 1 GRAND (matches 70/25/5)
function wheelEl(){let w=document.getElementById('czWheel');if(w)return w;w=document.createElement('div');w.id='czWheel';w.setAttribute('role','dialog');w.setAttribute('aria-label','彩金轉盤');
 const cols=['#3a0a2c','#8a1a5c','#d9a441'];const g=SEG.map((s,i)=>`${cols[s]} ${i*18}deg ${(i+1)*18}deg`).join(',');
 w.innerHTML=`<img class="czframe" src="assets/lobby/frame_s.webp?v=212" alt=""><div class="czwbox"><div class="czwt">JACKPOT CHANCE!!</div><div class="czwsub">彩金轉盤</div><div class="czwheel"><div class="czwd" style="background:conic-gradient(${g})">${SEG.map((s,i)=>`<span style="transform:rotate(${i*18+9}deg)"><b class="s${s}">${JP.name[s]}</b></span>`).join('')}</div><div class="czwhub">JP</div><div class="czwptr"></div></div><div class="czwres" aria-live="assertive"></div><button class="czwgo">旋轉轉盤</button></div>`;
 document.body.appendChild(w);return w}
function wheel(total){window.__hold=true;const w=wheelEl(),d=w.querySelector('.czwd'),btn=w.querySelector('.czwgo'),res=w.querySelector('.czwres');
 res.textContent='';d.style.transition='none';d.style.transform='rotate(0deg)';w.classList.add('on');btn.disabled=false;btn.textContent='旋轉轉盤';vib([30,40,30]);
 try{sfx.chime&&sfx.chime()}catch(e){}
 btn.onclick=()=>{btn.disabled=true;const r=Math.random();const k=r<JP.w[0]?0:r<JP.w[0]+JP.w[1]?1:2;
  const idx=SEG.map((s,i)=>s===k?i:-1).filter(i=>i>=0);const i=idx[Math.random()*idx.length|0];
  const rot=(RM?360:360*6)+(360-(i*18+9))+(Math.random()*10-5);
  requestAnimationFrame(()=>{d.style.transition=`transform ${RM?.6:4.6}s cubic-bezier(.12,.7,.1,1)`;d.style.transform=`rotate(${rot}deg)`});
  setTimeout(()=>{const amt=Math.floor(P[k]);P[k]=JP.seed[k];S('cz_jp',P);res.innerHTML=`<b>${JP.name[k]} JACKPOT</b> ＋${amt.toLocaleString()}`;vib([80,50,80,50,200]);
   ach('jp');feed(`${JP.name[k]} JACKPOT ${amt.toLocaleString()}`);
   setTimeout(()=>{w.classList.remove('on');bal+=amt;ui();$('win').textContent=amt;window.__hold=false;
    bigWin(amt,total,{tier:['epic',JP.name[k]+' JACKPOT','彩金大獎!! 恭喜'],lbl:'彩金池・虛擬籌碼',noStamp:1});emit()},1400)},RM?700:4800)}}
window.CZ.wheel=wheel;
// ===== machine-only UI =====
function machineUI(){const $=id=>document.getElementById(id),mach=$('machine');
 // 大獎 cutscene (user art) before big wins / bonus / jackpot
 const at=document.createElement('div');at.id='czAtari';at.setAttribute('role','dialog');at.setAttribute('aria-label','大獎');
 at.innerHTML='<div class="ab"></div><div class="ai"></div><div class="asw"></div><div class="apt"></div><img class="afr" src="assets/lobby/frame_s.webp?v=212" alt=""><div class="atx"><b></b><i></i></div><div class="askip">點擊略過</div>';
 document.body.appendChild(at);const pt=at.querySelector('.apt');for(let i=0;i<16;i++){const e=document.createElement('u');e.style.left=(Math.random()*100)+'%';e.style.animationDelay=(-Math.random()*2.4)+'s';e.style.animationDuration=(2+Math.random()*1.6)+'s';e.style.setProperty('--dx',(Math.random()*120-60)+'px');pt.appendChild(e)}
 function sting(){try{if(typeof ac==='undefined'||!ac)return;const t=ac.currentTime,g=ac.createGain();g.gain.value=.5;g.connect(ac.destination);
  [[523,0],[659,.08],[784,.16],[1047,.24],[1568,.36]].forEach(([f,d])=>{const o=ac.createOscillator(),e=ac.createGain();o.type='triangle';o.frequency.value=f;e.gain.setValueAtTime(0,t+d);e.gain.linearRampToValueAtTime(.18,t+d+.02);e.gain.exponentialRampToValueAtTime(.001,t+d+.9);o.connect(e).connect(g);o.start(t+d);o.stop(t+d+1)});
  const n=ac.createBufferSource(),b=ac.createBuffer(1,ac.sampleRate*.6,ac.sampleRate),c=b.getChannelData(0);for(let i=0;i<c.length;i++)c[i]=(Math.random()*2-1)*Math.pow(1-i/c.length,3);n.buffer=b;const ng=ac.createGain();ng.gain.value=.25;n.connect(ng).connect(g);n.start(t)}catch(e){}}
 let atCb=null,atT=0;
 function atari(txt,sub,cb){window.__hold=true;atCb=cb;at.querySelector('.atx b').textContent=txt;at.querySelector('.atx i').textContent=sub||'';
  at.className='';void at.offsetWidth;at.className='on'+(RM?' rm':'');vib([40,40,80]);sting();clearTimeout(atT);atT=setTimeout(atEnd,RM?1000:2300)}
 function atEnd(){if(!at.classList.contains('on'))return;clearTimeout(atT);at.className='';window.__hold=false;const f=atCb;atCb=null;f&&f()}
 at.addEventListener('pointerdown',atEnd);addEventListener('keydown',e=>{if(at.classList.contains('on')&&(e.key===' '||e.key==='Enter'||e.key==='Escape')){e.preventDefault();e.stopPropagation();atEnd()}},true);
 CZ.atari=atari;
 (window.requestIdleCallback||setTimeout)(()=>{const w=innerWidth>900;['assets/lobby/'+(w?'atari':'atari_s')+'.webp?v=212','assets/lobby/atari_bl.webp?v=212','assets/lobby/frame_s.webp?v=212',`assets/${CZM.id}/bigbonus.webp?v=212`,`assets/${CZM.id}/hero.webp?v=212`,`assets/${CZM.id}/cutin.webp?v=212`].forEach(u=>{const i=new Image();i.src=u;i.decode&&i.decode().catch(()=>{})})},{timeout:2500});
 const _bw=window.bigWin;window.bigWin=function(won,total,o={}){if(o.noStamp)return _bw(won,total,o);const x=won/total;
  atari(x>=50?'傳說大獎':x>=25?'超級大獎':'大獎',x>=50?'龍運降臨!!':x>=25?'金殿狂歡!!':'好運降臨!!',()=>_bw(won,total,o))};
 const _fi=window.fsIntro;window.fsIntro=function(re){if(re)return _fi(re);atari('BONUS!!','免費遊戲 開始',()=>_fi(re))};
 const _wh=CZ.wheel;CZ.wheel=function(t){atari('彩金','大獎機會!!',()=>_wh(t))};
 // gold-sakura frame on win tiers
 const bwEl=$('bw');if(bwEl){const f=document.createElement('img');f.className='czframe';f.src='assets/lobby/frame_s.webp?v=212';f.alt='';bwEl.appendChild(f)}
 const sp=$('spinBtn');sp.addEventListener('pointerdown',()=>vib(12),{passive:true});
 // control bar: move existing controls into one flex bar
 const bar=document.createElement('div');bar.className='czbar';
 const L=document.createElement('div');L.className='czL';L.innerHTML=`<a class="czbtn" id="czLobby" href="index.html" aria-label="回到大廳">🏠<span>大廳</span></a><div class="czlv" id="czLv"><b></b><i><u></u></i></div>`;
 const C=document.createElement('div');C.className='czC';
 const Rr=document.createElement('div');Rr.className='czR';
 const mC=document.createElement('div');mC.className='czm czmC';mC.innerHTML='<small>CREDIT</small><b id="czCred">0</b>';
 const mW=document.createElement('div');mW.className='czm czmW';mW.innerHTML='<small>WIN</small><b id="czWin">0</b>';
 const ob=document.querySelector('.info .box:nth-child(2)');ob.style.visibility='hidden';const betBox=document.createElement('div');betBox.className='box czbet';betBox.innerHTML='<small>BET ×20</small><b id="czBet">0</b>';
 C.append(mC,betBox,document.querySelector('.controls'),mW);
 const buy=document.createElement('button');buy.id='czBuyBtn';buy.type='button';buy.className='czbuyitem';buy.innerHTML='<span class="ic" aria-hidden="true">💘</span><span class="czbt"><b>✨ 觸發特殊事件 ✨</b><small></small></span>';
 Rr.append($('max16'),$('menuBtn'));{const m16=$('menu16');if(m16)m16.insertBefore(buy,m16.firstChild)}bar.append(L,C,Rr);
 const note=document.querySelector('.sub');const nb=document.createElement('div');nb.className='cznote';nb.textContent=note?note.textContent:'僅供娛樂・虛擬籌碼・無真實金錢';if(note)note.remove();
 mach.append(bar,nb);
 {// v18.1 AUTO spin (play-money)
 const ab=document.createElement('button');ab.id='czAuto';ab.className='czauto';ab.type='button';ab.setAttribute('aria-label','自動旋轉');ab.innerHTML='<b>AUTO</b><i></i>';
 document.querySelector('.czbar .controls').appendChild(ab);
 const pk=document.createElement('div');pk.id='czAutoPk';pk.hidden=true;pk.innerHTML='<p>自動旋轉次數</p>'+[10,25,50,100,'∞'].map(n=>`<button type="button" data-n="${n}">${n}</button>`).join('');document.body.appendChild(pk);
 const AU=window.CZAUTO={n:0,on:false,stop(){AU.on=false;AU.n=0;document.body.classList.remove('czau');ab.classList.remove('run');ab.lastChild.textContent=''},
  start(n){AU.on=true;AU.n=n;document.body.classList.add('czau');ab.classList.add('run');lab();tick()}};
 const lab=()=>{ab.lastChild.textContent=AU.n===Infinity?'∞':AU.n};
 ab.addEventListener('click',e=>{e.stopPropagation();vib(10);if(AU.on){AU.stop();return}pk.hidden=!pk.hidden;if(!pk.hidden){const r=ab.getBoundingClientRect();pk.style.left=Math.max(6,Math.min(innerWidth-pk.offsetWidth-6,r.right-pk.offsetWidth))+'px';pk.style.top=Math.max(6,r.top-pk.offsetHeight-8)+'px'}});
 pk.addEventListener('click',e=>{const n=e.target.dataset&&e.target.dataset.n;if(!n)return;pk.hidden=true;AU.start(n==='∞'?Infinity:+n)});
 addEventListener('pointerdown',e=>{if(!pk.hidden&&!pk.contains(e.target)&&e.target!==ab)pk.hidden=true},true);
 const cv=document.createElement('div');cv.id='czAuStop';cv.setAttribute('aria-label','停止自動旋轉');document.body.appendChild(cv);const pos=()=>{const r=sp.getBoundingClientRect();Object.assign(cv.style,{left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px'})};addEventListener('resize',pos);cv.addEventListener('click',e=>{e.stopPropagation();vib(10);AU.stop()});
 const ovl=()=>['czWheel','czAtari','czMG','bw'].some(i=>{const e=document.getElementById(i);return e&&getComputedStyle(e).display!=='none'&&getComputedStyle(e).visibility!=='hidden'&&(e.classList.contains('on')||e.classList.contains('show')||e.open||e.style.display==='flex'||e.style.display==='block')});
 function tick(){if(!AU.on)return;pos();if(spinning||bwState||window.__hold||(typeof FS!=='undefined'&&FS&&FS.left>0)||ovl()){setTimeout(tick,300);return}
  if(bal<BETS[betIdx]*NL){AU.stop();toast&&toast('籌碼不足，自動旋轉已停止');return}
  if(AU.n<=0){AU.stop();return}AU.n--;lab();spin();setTimeout(tick,500)}
 AU.tick=tick}
 const mir=(a,b)=>{const A=$(a),B=$(b);const f=()=>{B.textContent=A.textContent};f();new MutationObserver(f).observe(A,{childList:true,characterData:true,subtree:true})};mir('bal','czCred');mir('bet','czBet');mir('win','czWin');
 const lvR=()=>{const v=vipOf(st.lv);const e=$('czLv');e.querySelector('b').textContent=`Lv.${st.lv} ${v[1]}`;e.querySelector('b').style.color=v[2];e.querySelector('u').style.width=Math.min(100,st.xp/need(st.lv)*100)+'%'};lvR();CZ.on(lvR);
 // buy feature dialog
 const dlg=document.createElement('dialog');dlg.id='czBuy';dlg.innerHTML=`<h2>✨ 觸發特殊事件 ✨</h2><p class="czbp"></p><p class="note">直接進入 BONUS：10 次免費旋轉（獎金 ×${CZM.fsm}，可再觸發）。<br>理論回收率 ${CZM.buyRtp}%・僅使用虛擬籌碼・無真實金錢</p><div class="dact"><button class="claim" id="czBuyOk">確認購買</button><button id="czBuyNo">取消</button></div>`;document.body.appendChild(dlg);
 const price=()=>Math.round(BETS[betIdx]*NL*CZM.buy);
 const buyLab=()=>{buy.querySelector('small').textContent=`花 ${price().toLocaleString()} 籌碼開啟`};buyLab();new MutationObserver(buyLab).observe($('bet'),{childList:true,characterData:true,subtree:true});
 buy.onclick=()=>{if(spinning||FS||bwState||window.__hold)return;dlg.querySelector('.czbp').innerHTML=`價格：<b>${price().toLocaleString()}</b> 籌碼（總押注 ${BETS[betIdx]*NL} × ${CZM.buy}）`;$('czBuyOk').disabled=bal<price();$('czBuyOk').textContent=bal<price()?'籌碼不足':'確認購買';dlg.showModal()};
 $('czBuyNo').onclick=()=>dlg.close();
 $('czBuyOk').onclick=()=>{dlg.close();const p=price();if(bal<p||spinning||FS)return;bal-=p;ui();ach('buy');vib([20,30,20]);
  ['spinBtn','minus','plus','maxBtn','resetBtn'].forEach(i=>$(i)&&($(i).disabled=true));FS={left:FS_N,tot:FS_N,n:0,won:0,bet:BETS[betIdx]};day().fs++;save();setTimeout(()=>fsIntro(false),250)};
 // loading screen
 let ld=document.getElementById('czLoad');if(!ld){ld=document.createElement('div');ld.id='czLoad';ld.innerHTML=`<div class="czlt">${CZM.name}</div><div class="czlbar"><i></i></div><div class="czls">LOADING…</div><div class="cznote2">僅供娛樂・虛擬籌碼・無真實金錢</div>`;document.body.appendChild(ld)}
 const imgs=[...document.images];let n=0;const tot=Math.max(1,imgs.length);const prog=()=>{n=imgs.filter(i=>i.complete).length;ld.querySelector('i').style.width=(20+80*n/tot)+'%'};
 const t0=performance.now();const iv=setInterval(prog,120);
 const done=()=>{clearInterval(iv);ld.querySelector('i').style.width='100%';setTimeout(()=>{ld.classList.add('out');setTimeout(()=>ld.remove(),500)},Math.max(0,450-(performance.now()-t0)))};
 if(document.readyState==='complete')done();else addEventListener('load',done,{once:true});
}
function czPreSym(){try{const pre=document.querySelector('.cell img.sym');if(!pre)return;const base=pre.getAttribute('src').replace(/t_[^/]*$/,'');const ids=new Set();(typeof SYM!=='undefined'?SYM:[]).forEach(s=>ids.add(s.id));if(typeof VAR!=='undefined')Object.values(VAR).flat().forEach(v=>ids.add(v));window.__symImg=[...ids].map(v=>{const i=new Image();i.src=base+'t_'+v+'.webp';i.decode&&i.decode().catch(()=>{});return i})}catch(e){}}
if(IN_M)addEventListener('load',czPreSym);
function czMenuFix(){const m=document.getElementById('menu16');if(m&&m.parentNode!==document.body)document.body.appendChild(m);const b=document.querySelector('.czbar');const set=()=>b&&document.documentElement.style.setProperty('--czbarH',Math.round(b.getBoundingClientRect().height)+'px');set();addEventListener('resize',set);document.getElementById('menuBtn')?.addEventListener('click',set)}
if(IN_M)addEventListener('load',czMenuFix);
function czHero(){const mach=document.getElementById('machine'),inn=mach&&mach.querySelector('.inner');if(!inn||document.getElementById('czHero'))return;
 const id=(location.pathname.split('/').pop()||'').replace('.html','');const V='?v=212';document.documentElement.style.setProperty('--czhero',`url(assets/${id}/hero.webp${V})`);
 const h=document.createElement('div');h.id='czHero';h.setAttribute('aria-hidden','true');
 h.innerHTML=`<div class="czhi" style="background-image:url(assets/${id}/hero.webp${V})"></div><div class="czhs"></div><i class="czhp"></i><i class="czhp b"></i><img class="czhl" src="assets/${id}/logo.webp${V}" alt=""><div class="czhf"></div>`;
 mach.insertBefore(h,inn);let F=null;const mq=matchMedia('(max-width:620px) and (orientation:portrait)');
 const fit=()=>{const R=document.documentElement.style;if(!mq.matches){R.removeProperty('--W');inn.style.cssText='';return}
  if(!F){const i=inn.getBoundingClientRect(),b=document.getElementById('board').getBoundingClientRect(),m=document.getElementById('msg').getBoundingClientRect();if(!i.width)return;F={l:(b.left-i.left)/i.width,w:b.width/i.width,t:(b.top-i.top)/i.height,bt:(m.bottom-i.top)/i.height,ar:i.height/i.width}}
  const vw=innerWidth,W=Math.round(vw*.97/F.w),H=W*F.ar,top=Math.max(0,F.t*H-W*.022),bot=Math.max(0,H-(F.bt*H+W*.008));R.setProperty('--W',W+'px');
  inn.style.cssText=`margin-left:${Math.round(vw*.015-F.l*W)}px!important;margin-top:${-Math.round(top)}px!important;margin-bottom:${-Math.round(bot)}px!important;clip-path:inset(${Math.round(top)}px 0 ${Math.round(bot)}px 0)`};
 requestAnimationFrame(()=>requestAnimationFrame(fit));addEventListener('resize',()=>{fit()});mq.addEventListener&&mq.addEventListener('change',()=>{F=null;R0();fit()});function R0(){document.documentElement.style.removeProperty('--W');inn.style.cssText=''}}
if(IN_M){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',czHero);else czHero()}
if(IN_M){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',machineUI);else machineUI()}
})();
/* v18.0 cross-tab / cross-page credit sync (play-money balance in fs_bal) */
(function(){const sync=()=>{try{const r=localStorage.getItem('fs_bal');if(r===null||r==='')return;const v=+r;if(!isFinite(v)||v<0)return;
 if(typeof bal==='number'&&typeof spinning!=='undefined'){if(spinning||(typeof FS!=='undefined'&&FS)||(typeof bwState!=='undefined'&&bwState))return;if(v!==bal){bal=v;typeof ui==='function'&&ui()}}
 else if(typeof refresh==='function')refresh()}catch(e){}};
 addEventListener('storage',e=>{if(e.key==='fs_bal'||e.key==='cz_st')sync()});document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync()});addEventListener('pageshow',sync)})();
