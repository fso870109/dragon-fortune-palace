/* v20.3 extra events: 旋風聚寶 / 幸運彈珠 / 三重彩金輪 / 狂熱倍數 / 購買寶珠對碰 — play money only */
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
/* v28.59 jackpot SFX — layered WebAudio on AM.sfxG; skip cuts layers, then finale plays */
let jpG=null;
function jpBus(){const c=(typeof aInit==='function'&&aInit());if(!c||typeof AM==='undefined'||!AM)return null;if(!jpG||jpG.context!==c){jpG=c.createGain();jpG.gain.value=1;jpG.connect(AM.sfxG)}return c}
function jpCut(){const c=jpBus();if(!c||!jpG)return;try{const old=jpG;old.gain.cancelScheduledValues(c.currentTime);old.gain.setTargetAtTime(0,c.currentTime,.018);setTimeout(()=>{try{old.disconnect()}catch(e){}},90);jpG=c.createGain();jpG.gain.value=1;jpG.connect(AM.sfxG)}catch(e){}}
function bgmDuck(on){try{if(window.CZA&&CZA.duck)CZA.duck(on?.22:1,on?.08:.32);if(on&&window.F21&&F21.bedOff)F21.bedOff()}catch(e){}}
function jpOsc(f,t,d,ty,v,f2){const c=jpBus();if(!c||!jpG)return;const o=c.createOscillator(),fl=c.createBiquadFilter(),g=c.createGain();o.type=ty||'sawtooth';o.frequency.setValueAtTime(f,c.currentTime+t);if(f2)o.frequency.exponentialRampToValueAtTime(Math.max(20,f2),c.currentTime+t+Math.max(.03,d));fl.type='lowpass';fl.frequency.value=4800;g.gain.setValueAtTime(0,c.currentTime+t);g.gain.linearRampToValueAtTime(v,c.currentTime+t+.01);g.gain.exponentialRampToValueAtTime(.0008,c.currentTime+t+d);o.connect(fl);fl.connect(g);g.connect(jpG);o.start(c.currentTime+t);o.stop(c.currentTime+t+d+.04)}
function jpNoise(t,d,v,opts){const c=jpBus();if(!c||!jpG)return;opts=opts||{};const n=Math.max(1,Math.ceil(c.sampleRate*d)),b=c.createBuffer(1,n,c.sampleRate),a=b.getChannelData(0);for(let i=0;i<n;i++)a[i]=(Math.random()*2-1)*(1-i/n);const s=c.createBufferSource();s.buffer=b;const fl=c.createBiquadFilter();fl.type=opts.ft||'bandpass';fl.frequency.value=opts.f||1800;fl.Q.value=opts.q||.8;const g=c.createGain();g.gain.setValueAtTime(0,c.currentTime+t);g.gain.linearRampToValueAtTime(v,c.currentTime+t+.008);g.gain.exponentialRampToValueAtTime(.0008,c.currentTime+t+d);s.connect(fl);fl.connect(g);g.connect(jpG);s.start(c.currentTime+t);s.stop(c.currentTime+t+d+.02)}
function jpSlam(){jpOsc(52,0,.62,'sine',.52,34);jpOsc(86,0,.42,'sine',.26,40);jpOsc(176,0,.2,'triangle',.2,88);jpOsc(220,0,.72,'sawtooth',.11,78);jpOsc(330,.02,.58,'triangle',.13,130);jpOsc(880,.012,.14,'square',.075,210);jpOsc(1320,.03,.2,'triangle',.065,420);jpNoise(0,.18,.3,{ft:'bandpass',f:2300,q:1.1});jpNoise(.02,.55,.12,{ft:'lowpass',f:880,q:.55});[523,659,784,1047].forEach((f,i)=>jpOsc(f,.07+i*.05,.38,'triangle',.085))}
function jpRiser(dur){dur=dur||2.2;jpOsc(78,0,dur,'sawtooth',.085,740);jpOsc(118,0,dur,'sawtooth',.055,1120);jpOsc(46,0,dur,'sine',.15,190);jpNoise(0,dur,.1,{ft:'highpass',f:380,q:.35});jpNoise(dur*.38,dur*.62,.15,{ft:'bandpass',f:1700,q:.7})}
function jpBurst(){jpOsc(88,0,.38,'sine',.42,48);jpOsc(240,0,.24,'triangle',.2,118);jpOsc(640,0,.2,'sawtooth',.13,1900);jpOsc(1280,0,.13,'square',.055,380);jpNoise(0,.24,.34,{ft:'highpass',f:1700,q:.45});jpNoise(0,.13,.22,{ft:'bandpass',f:3400,q:1})}
function jpShimmer(){[1047,1319,1568,2093].forEach((f,i)=>jpOsc(f,.02+i*.045,.3,'sine',.075,f*1.98));jpOsc(2637,.12,.36,'triangle',.04,4100);jpNoise(.02,.2,.08,{ft:'highpass',f:5200,q:.4})}
function jpTick(k){const f=980+k*700;jpOsc(f,0,.055,'square',.058);jpOsc(f*2,0,.032,'sine',.028)}
function jpFanfare(){jpOsc(62,0,.95,'sine',.48,38);jpOsc(98,0,.72,'sine',.22,48);jpNoise(0,.2,.3,{ft:'lowpass',f:420,q:.8});[[196,0],[246.94,.025],[293.66,.05],[392,.07],[493.88,.09],[587.33,.11]].forEach(([f,off])=>{jpOsc(f,off,.92,'sawtooth',.075);jpOsc(f*1.004,off,.88,'triangle',.048);jpOsc(f*2,off+.04,.55,'square',.016)});jpNoise(.08,.95,.17,{ft:'highpass',f:4300,q:.32});jpNoise(.1,.52,.12,{ft:'bandpass',f:7800,q:.55});[523,659,784,1047].forEach((f,i)=>jpOsc(f,.16+i*.06,.72,'triangle',.082))}
function jpCoins(n){n=Math.min(n||10,14);for(let i=0;i<n;i++){const off=.05+i*(.065+.035*Math.random()),f=1380+Math.random()*920;jpOsc(f,off,.1,'sine',.072);jpOsc(f*1.48,off,.065,'triangle',.038);jpOsc(860+Math.random()*420,off+.014,.045,'square',.022)}}
/* v28.64 幸運彈珠 SFX — same AM.sfxG bus as 旋風聚寶 (respects dfp_vol) */
function plWhoosh(){jpOsc(220,0,.42,'sawtooth',.11,70);jpOsc(520,0,.28,'triangle',.07,160);jpOsc(90,0,.5,'sine',.14,48);jpNoise(0,.32,.15,{ft:'highpass',f:480,q:.35});jpNoise(.04,.22,.08,{ft:'bandpass',f:1800,q:.6})}
function plPeg(r){const f=640+r*110+Math.random()*70;jpOsc(f,0,.09,'triangle',.068);jpOsc(f*2.05,0,.05,'sine',.032);jpOsc(2100+r*90+Math.random()*200,0,.035,'square',.02);jpNoise(0,.045,.045,{ft:'bandpass',f:3200+r*140,q:1.15})}
function plLand(tier){tier=tier||0;jpOsc(46,0,.58,'sine',.46+.08*tier,26);jpOsc(88,0,.38,'sine',.24,38);jpOsc(170,0,.22,'triangle',.16,70);jpNoise(0,.24,.3,{ft:'lowpass',f:460,q:.65});jpNoise(.02,.16,.12,{ft:'bandpass',f:2200,q:.9});jpOsc(780,0,.2,'triangle',.07,320);[1047,1319,1568].forEach((f,i)=>jpOsc(f,.05+i*.045,.32,'sine',.055+tier*.018));if(tier>=1)jpShimmer()}
function plStinger(tier){tier=tier||0;if(tier>=2){jpOsc(52,0,.7,'sine',.38,32);[[392,0],[523,.05],[659,.1],[784,.15],[1047,.2]].forEach(([f,off])=>{jpOsc(f,off,.55,'triangle',.085);jpOsc(f*2,off+.03,.32,'sine',.03)})}else if(tier>=1){[523,659,784,1047].forEach((f,i)=>jpOsc(f,i*.06,.42,'triangle',.078));jpOsc(196,0,.55,'sawtooth',.055,90)}else{[523,659,784].forEach((f,i)=>jpOsc(f,i*.05,.3,'triangle',.06))}}
const sleep=ms=>new Promise(r=>setTimeout(r,RM?Math.min(ms,80):ms));
const KEY='czTW_'+ID;let tw;try{tw=JSON.parse(localStorage.getItem(KEY))}catch(e){}if(!tw||typeof tw.n!=='number')tw={n:0,pot:0};
let armed=0;const Qu=[];const TK='czTK_'+ID;let tk;try{tk=JSON.parse(localStorage.getItem(TK))}catch(e){}if(!tk||typeof tk.p!=='number')tk={p:0,w:0,m:0};const saveT=()=>localStorage.setItem(TK,JSON.stringify(tk));const emitT=(k,full)=>{try{dispatchEvent(new CustomEvent('czf',{detail:{k,full:!!full,tk:Object.assign({},tk),tw:Object.assign({},tw),TW_N,armed}}))}catch(e){}};let busy=false;
function idle(){return !(typeof spinning!=='undefined'&&spinning)&&!(typeof bwState!=='undefined'&&bwState)&&!(typeof FS!=='undefined'&&FS)&&!$('hsBox')&&!document.querySelector('.rfx')&&!window.__hold&&!($('czMG')&&$('czMG').offsetParent)}
function pump(){if(busy||!Qu.length)return;if(!idle()){setTimeout(pump,500);return}busy=true;window.__hold=true;const [fn,bet]=Qu.shift();try{if(window.CZ&&CZ.trackFeat)CZ.trackFeat(fn&&fn.t)}catch(e){}
 (window.F21?F21.pre(fn.t):Promise.resolve()).then(()=>fn(bet)).then(w=>{window.F21&&F21.back();award(w,bet)}).catch(e=>console.error(e)).finally(()=>{busy=false;window.__hold=false;['spinBtn','minus','plus','maxBtn','max16','resetBtn'].forEach(i=>$(i)&&($(i).disabled=false));setTimeout(pump,800)})}
function queue(fn,bet){Qu.push([fn,bet]);setTimeout(pump,1200)}
function award(w,bet,lbl){w=Math.round(w);if(!(w>0))return;bal+=w;$('win').textContent=w;try{ui();saveLater&&saveLater()}catch(e){}const tot=bet*NL;if(w/tot>=10&&window.bigWin)setTimeout(()=>bigWin(w,tot),300);}
function pick(a){let s=a.reduce((x,y)=>x+y[1],0),r=Math.random()*s;for(const v of a){if((r-=v[1])<0)return v[0]}return a[0][0]}
function stage(title){const b=$('board');const L=document.createElement('div');L.className='rfx';L.setAttribute('role','dialog');L.setAttribute('aria-label',title);const p=b.offsetParent;Object.assign(L.style,{left:b.offsetLeft+'px',top:b.offsetTop+'px',width:b.offsetWidth+'px',height:b.offsetHeight+'px'});L.innerHTML=`<p class="rfxN">僅供娛樂・虛擬籌碼・純虛擬・無兌現</p>`;p.appendChild(L);b.classList.add('rfxOn');return L}
function goldHTML(s){return Array.from(String(s)).map((ch,i)=>'<i style="--i:'+i+'">'+(ch===' '?'&nbsp;':ch)+'</i>').join('')}
function fxWorld(){let w=$('twWorld');if(w)return w;w=document.createElement('div');w.id='twWorld';w.setAttribute('aria-hidden','true');w.innerHTML='<div class="twWflash"></div><div class="twWvig"></div><div class="twWbloom"></div><div class="twWrings"></div><div class="twWstreaks"></div><div class="twWrain"></div>';document.body.appendChild(w);document.documentElement.classList.add('twFx');document.body.classList.add('twFx');return w}
function fxKill(){document.body.classList.remove('twFx','twShake','twPunch');document.documentElement.classList.remove('twFx');const w=$('twWorld');if(w)w.remove()}
function fxImpact(){if(RM)return;const w=fxWorld(),fl=w.querySelector('.twWflash'),rg=w.querySelector('.twWrings');document.body.classList.remove('twShake');void document.body.offsetWidth;document.body.classList.add('twShake');fl.classList.remove('go');void fl.offsetWidth;fl.classList.add('go');const b=$('board');let top='42%',left='50%';if(b){const r=b.getBoundingClientRect();left=(r.left+r.width/2)+'px';top=(r.top+r.height/2)+'px'}rg.style.left=left;rg.style.top=top;rg.innerHTML='<i></i><i></i><i></i>';setTimeout(()=>document.body.classList.remove('twShake'),560)}
function fxStreaks(){if(RM)return;const box=fxWorld().querySelector('.twWstreaks'),n=innerWidth<=360?6:10;for(let i=0;i<n;i++){const s=document.createElement('i');s.style.cssText='--a:'+(Math.random()*150-75)+'deg;left:'+(15+Math.random()*70)+'%;top:'+(22+Math.random()*50)+'%;animation-delay:'+(Math.random()*90)+'ms';box.appendChild(s);setTimeout(()=>s.remove(),720)}}
function fxRain(n){if(RM)return;const box=fxWorld().querySelector('.twWrain'),cap=innerWidth<=360?Math.min(n,36):Math.min(n,60),frag=document.createDocumentFragment();for(let i=0;i<cap;i++){const s=document.createElement('i');if(Math.random()<.18)s.className='gem';s.style.cssText='left:'+(Math.random()*100)+'%;--fall:'+(880+Math.random()*900)+'ms;--dx:'+((Math.random()-.5)*48)+'px;--sz:'+(8+Math.random()*9)+'px;animation-delay:'+(Math.random()*320)+'ms';frag.appendChild(s)}box.appendChild(frag)}
function fxSpark(host,n){if(RM||!host)return;for(let i=0;i<n;i++){const s=document.createElement('i');s.className='twSpark';s.style.left=(28+Math.random()*44)+'%';s.style.top=(38+Math.random()*36)+'%';host.appendChild(s);setTimeout(()=>s.remove(),480)}}
const PLAQUE_SRC='assets/fx/tw-plaque.webp?v=2858';
try{(new Image()).src=PLAQUE_SRC}catch(e){}
function placeCard(el){
  const board=$('board');
  const r=board?board.getBoundingClientRect():{left:innerWidth/2,top:innerHeight*.42,width:0,height:0};
  const apply=()=>{
    const w=el.offsetWidth,h=el.offsetHeight;
    let x=r.left+r.width/2, y=r.top+r.height/2-8;
    const ctl=[...document.querySelectorAll('.czbar,#spinBtn,#bal')].map(e=>e.getBoundingClientRect().top).filter(v=>v>80);
    const maxB=ctl.length?Math.min(...ctl)-14:innerHeight-8;
    let top=y-h/2, left=x-w/2;
    if(top+h>maxB) top=maxB-h;
    if(top<6) top=6;
    if(left<4) left=4;
    if(left+w>innerWidth-4) left=innerWidth-4-w;
    el.style.left=(left+w/2)+'px';
    el.style.top=(top+h/2)+'px';
  };
  apply();
  const img=el.querySelector('img');
  if(img&&!img.complete) img.addEventListener('load',apply,{once:true});
  else requestAnimationFrame(apply);
}
function mountCard(title,opts){
  opts=opts||{};
  fxWorld();
  const prev=$('twCard'); if(prev) prev.remove();
  const tier=opts.tier||'';
  const el=document.createElement('div');
  el.id='twCard'; el.className='twCard'+(opts.noAmt?' noAmt':'')+(RM?' inRM':' in');
  el.setAttribute('role','dialog'); el.setAttribute('aria-label',title);
  el.innerHTML='<img class="twCardArt" src="'+PLAQUE_SRC+'" alt="" draggable="false">'+
    '<i class="twShineBar" aria-hidden="true"></i>'+
    '<div class="twCardTitle twGold twShine">'+goldHTML(title)+'</div>'+
    '<em class="twTier'+(tier?' twGold twShine':'')+'"'+(tier?'':' hidden')+'>'+(tier?goldHTML(tier):'')+'</em>'+
    (opts.noAmt?'':'<div class="twCardAmt"><b class="twAmt twGold">0</b></div>')+
    '<div class="twCardSum"><span class="twSum" hidden></span></div>';
  document.body.appendChild(el);
  placeCard(el);
  return el;
}
function clearBoardFX(){try{jpCut();bgmDuck(false)}catch(e){}fxKill();const c=$('twCard');if(c)c.remove();const b=$('board');if(!b)return;b.classList.remove('rfxOn','rfxSuck');b.classList.add('rfxClear');setTimeout(()=>b.classList.remove('rfxClear'),180)}
function finish(L,w,msg,noAmt){return new Promise(res=>{try{bgmDuck(true)}catch(e){}const card=mountCard(msg,{noAmt:!!noAmt});const amt=card.querySelector('.twAmt');if(amt){amt.textContent=NF.format(Math.round(w));amt.classList.add('tick','pulse')}const sum=card.querySelector('.twSum');if(!noAmt&&sum){sum.hidden=false;sum.className='twSum twGold twShine in';sum.innerHTML=goldHTML('合計獎金')}if(!RM){fxImpact();fxStreaks();fxRain(innerWidth<=360?28:48)}try{jpShimmer();jpFanfare();if(w>0&&!noAmt)jpCoins(innerWidth<=360?8:12)}catch(e){}let done=0;const end=()=>{if(done)return;done=1;card.classList.add('out');L.classList.add('out');setTimeout(()=>{clearBoardFX();if(card.parentNode)card.remove();if(L.parentNode)L.remove();res(w)},RM?80:420)};L.onclick=end;card.addEventListener('pointerdown',end);setTimeout(end,RM?400:1800)})}
const cvs=(L,W,H)=>{const c=document.createElement('canvas'),d=Math.min(innerWidth<620?1:1.5,devicePixelRatio||1);c.width=W*d;c.height=H*d;c.style.cssText=`position:absolute;left:0;top:0;width:${W}px;height:${H}px`;L.prepend(c);const x=c.getContext('2d');x.scale(d,d);return [c,x]};
function twUI(){const h=$('czHero');if(!h)return;let e=$('twBox');if(!e){e=document.createElement('div');e.id='twBox';e.innerHTML='<div class="tr"><i>旋</i></div><div><b>旋風聚寶</b><span></span></div>';h.appendChild(e)}
 e.style.setProperty('--p',tw.n/TW_N*100);e.querySelector('span').textContent=NF.format(Math.round(tw.pot));e.classList.toggle('hot',tw.n>=TW_N*.85)}
function erupt(){const pot=tw.pot;tw={n:0,pot:0};localStorage.setItem(KEY,JSON.stringify(tw));twUI();
 const fn=async function(bet){
  const L=stage('旋風聚寶'),W=L.clientWidth,H=L.clientHeight;
  L.classList.add('twStage');
  const [cv,x]=cvs(L,W,H);cv.className='twVx';
  L.insertAdjacentHTML('beforeend',
    '<div class="twRays" aria-hidden="true"></div>'+
    '<div class="twFlash" aria-hidden="true"></div>'+
    '<div class="twSlam"><div class="twPlate"><i class="twShineBar" aria-hidden="true"></i><span class="twFlour l" aria-hidden="true"></span><b class="twGold twShine">'+goldHTML('旋風聚寶')+'</b><span class="twFlour r" aria-hidden="true"></span></div></div>');
  const board=$('board');if(board)board.classList.add('rfxSuck');
  const slam=L.querySelector('.twSlam');
  const tot=(typeof NL==='number'?bet*NL:bet);
  const ratio=tot>0?pot/tot:0;
  const tierTxt=ratio>=5?'超級大獎！':ratio>=2.5?'大獎！':'';
  const kind=(window.CZM&&CZM.id==='sakura')?'petal':(window.CZM&&CZM.id==='neko')?'coin':'spark';
  let skip=0,raf=0,phase='intro';
  const onSkip=()=>{skip++;if(phase==='intro'||phase==='vortex'||phase==='prize'){try{jpCut()}catch(e){}}};
  L.addEventListener('pointerdown',onSkip);
  try{bgmDuck(true)}catch(e){}
  const wait=ms=>new Promise(res=>{
    if(RM){setTimeout(res,Math.min(ms,80));return}
    const t0=performance.now();
    (function tick(){
      if(phase==='outro'&&skip>=2)return res();
      if(phase!=='outro'&&phase!=='prize'&&skip>=1)return res();
      if(skip>=2)return res();
      if(performance.now()-t0>=ms)return res();
      requestAnimationFrame(tick)
    })()
  });

  L.classList.add('twIntro');
  fxWorld();fxImpact();fxStreaks();
  if(!RM){document.body.classList.add('twPunch');setTimeout(()=>document.body.classList.remove('twPunch'),480)}
  try{jpSlam()}catch(e){}
  if(!RM){L.classList.add('twBoom');await wait(900);L.classList.remove('twBoom')}
  else await wait(80);
  slam.classList.add('out');

  phase='vortex';L.classList.add('twVortex');
  const nP=W<=360?52:80;
  const P=[];for(let i=0;i<nP;i++)P.push({a:Math.random()*6.28,r:.22+Math.random()*.85,s:.55+Math.random()*1.5,k:Math.random(),sp:Math.random()*6.28,spin:.04+Math.random()*.08,loot:Math.random()<.4});
  const cx=W/2,cy=H/2,RX=W*.52,RY=H*.56,Rmax=Math.max(W,H);
  try{if(RM)jpSlam();else if(skip<1)jpRiser(2.2)}catch(e){}
  if(!RM && skip<1){
    const t0=performance.now(),D=2400;
    await new Promise(res=>{(function fr(t){
      if(skip>=1){res();return}
      const k=Math.min(1,(t-t0)/D),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
      x.clearRect(0,0,W,H);
      const bg=x.createRadialGradient(cx,cy,4,cx,cy,Rmax*.72);
      bg.addColorStop(0,'rgba(255,224,140,'+(0.42+0.4*e)+')');
      bg.addColorStop(.38,'rgba(92,22,58,.88)');
      bg.addColorStop(1,'rgba(10,3,18,.96)');
      x.fillStyle=bg;x.fillRect(0,0,W,H);
      x.save();x.translate(cx,cy);x.rotate(t/1600);x.globalCompositeOperation='lighter';
      for(let i=0;i<16;i++){const a=i/16*Math.PI*2;x.beginPath();x.moveTo(0,0);x.arc(0,0,Rmax*.7,a,a+.09);x.closePath();x.fillStyle='rgba(255,226,150,'+(0.07+0.05*e)+')';x.fill()}
      const bloom=x.createRadialGradient(0,0,2,0,0,Rmax*.24);
      bloom.addColorStop(0,'rgba(255,242,200,'+(0.55+0.3*e)+')');bloom.addColorStop(1,'rgba(255,180,80,0)');
      x.fillStyle=bloom;x.beginPath();x.arc(0,0,Rmax*.24,0,7);x.fill();
      x.restore();
      x.save();x.translate(cx,cy);x.rotate(t/680);x.globalCompositeOperation='lighter';
      for(let arm=0;arm<6;arm++){
        x.rotate(Math.PI/3);
        x.beginPath();
        for(let i=0;i<40;i++){const u=i/40,rr=Rmax*.52*(1-e*.18)*(1-u*.1),ang=u*4.8,px=Math.cos(ang)*rr,py=Math.sin(ang)*rr*.68;if(i)x.lineTo(px,py);else x.moveTo(px,py)}
        x.strokeStyle='rgba(255,'+(214+arm*6)+','+(130+arm*10)+','+(0.32+0.1*Math.sin(t/220+arm))+')';
        x.lineWidth=8.4-arm*.5;x.stroke();
      }
      x.restore();
      x.globalCompositeOperation='lighter';
      for(const p of P){
        p.a+=.038*p.s*(1+e*3.4)/(p.r+.28);p.sp+=p.spin;
        const rr=p.r*(1-e*.9),px=cx+Math.cos(p.a)*RX*rr,py=cy+Math.sin(p.a)*RY*rr,sz=(p.k>.7?13:8)*(0.45+p.r*.65)*(1-e*.15);
        x.globalAlpha=.58+.42*Math.sin(p.a*2+1);
        if(p.loot){
          if(p.k>.55){
            x.fillStyle='#ffe08a';x.beginPath();x.arc(px,py,sz*.55,0,7);x.fill();
            x.fillStyle='rgba(255,255,230,.75)';x.beginPath();x.arc(px-sz*.15,py-sz*.15,sz*.2,0,7);x.fill();
          }else{
            x.save();x.translate(px,py);x.rotate(p.sp);
            x.fillStyle='#8ce8ff';x.beginPath();x.moveTo(0,-sz);x.lineTo(sz*.55,0);x.lineTo(0,sz);x.lineTo(-sz*.55,0);x.closePath();x.fill();
            x.restore();
          }
        }else if(kind==='petal'){
          x.save();x.translate(px,py);x.rotate(p.sp);
          x.fillStyle=p.k>.5?'#ffd0e4':'#ff9ab8';
          x.beginPath();x.ellipse(0,0,sz*.5,sz,0,0,7);x.fill();
          x.restore();
        }else if(kind==='coin'){
          x.fillStyle='#ffe08a';x.beginPath();x.arc(px,py,sz*.55,0,7);x.fill();
          x.fillStyle='rgba(255,255,230,.7)';x.beginPath();x.arc(px-sz*.15,py-sz*.15,sz*.2,0,7);x.fill();
        }else{
          x.strokeStyle='#ffe9a0';x.lineWidth=1.6;x.beginPath();
          x.moveTo(px,py);x.lineTo(px+Math.cos(p.sp)*sz,py+Math.sin(p.sp)*sz);x.stroke();
          x.fillStyle='#ffd65a';x.beginPath();x.arc(px,py,sz*.3,0,7);x.fill();
        }
      }
      x.globalAlpha=1;x.globalCompositeOperation='source-over';
      if(k<1)raf=requestAnimationFrame(fr);else res();
    })(t0)});
  }
  if(raf){cancelAnimationFrame(raf);raf=0}

  phase='prize';
  if(slam&&slam.parentNode)slam.remove();
  if(!RM&&skip<1){L.classList.add('twCollapse');fxImpact();fxStreaks();try{jpBurst()}catch(e){};await wait(340)}
  else fxImpact();
  L.classList.add('twPrize');L.classList.remove('twVortex','twIntro');
  const card=mountCard('旋風聚寶',{tier:tierTxt});
  try{jpShimmer()}catch(e){}
  card.addEventListener('pointerdown',onSkip);
  const amtEl=card.querySelector('.twAmt'),sumEl=card.querySelector('.twSum');
  const dur=RM||skip>=2?0:980;const c0=performance.now();let lastTick=0;
  await new Promise(res=>{
    (function step(t){
      if(skip>=2){if(amtEl)amtEl.textContent=NF.format(Math.round(pot));res();return}
      const k=dur?Math.min(1,(t-c0)/dur):1;
      const e=1-Math.pow(1-k,3);
      if(amtEl)amtEl.textContent=NF.format(Math.round(pot*e));
      if(t-lastTick>70){lastTick=t;try{jpTick(k)}catch(e){};if(amtEl){amtEl.classList.remove('tick');void amtEl.offsetWidth;amtEl.classList.add('tick')}fxSpark(card.querySelector('.twCardAmt')||card,2)}
      if(k<1)requestAnimationFrame(step);else res();
    })(c0)
  });
  if(amtEl){amtEl.textContent=NF.format(Math.round(pot));amtEl.classList.add('pulse','tick')}
  fxImpact();fxStreaks();fxRain(innerWidth<=360?32:56);
  if(!RM){document.body.classList.add('twPunch');setTimeout(()=>document.body.classList.remove('twPunch'),480)}
  window.W21&&(()=>{const r=card.getBoundingClientRect();W21.burst(r.left+r.width/2,r.top+r.height/2,24,300)})();
  try{jpFanfare();jpCoins(innerWidth<=360?8:12)}catch(e){}

  phase='outro';
  if(sumEl){sumEl.hidden=false;sumEl.className='twSum twGold twShine in';sumEl.innerHTML=goldHTML('合計獎金')}
  await wait(RM?220:1400);

  L.removeEventListener('pointerdown',onSkip);
  card.classList.add('out');L.classList.add('out');
  await new Promise(r=>setTimeout(r,RM?80:420));
  clearBoardFX();
  if(card.parentNode)card.remove();
  if(L.parentNode)L.remove();
  return pot;
 };fn.t='旋風聚寶';return fn}
/* ---- 幸運彈珠 ---- */
async function plinko(bet){const tot=bet*NL,R=8;const L=stage('幸運彈珠'),W=L.clientWidth,H=L.clientHeight;
 L.classList.add('twStage','plStage');
 const FXC=(()=>{const s=getComputedStyle(document.documentElement),b=getComputedStyle(document.body);
  return{glow:(s.getPropertyValue('--fx-glow').trim()||b.getPropertyValue('--fx-glow').trim()||'255,176,48'),
   fx:s.getPropertyValue('--fx').trim()||'#ffd36a',fx2:s.getPropertyValue('--fx2').trim()||'#ff8a28'}})();
 L.insertAdjacentHTML('beforeend','<div class="twRays" aria-hidden="true"></div><div class="twFlash" aria-hidden="true"></div><div class="twSlam"><div class="twPlate"><i class="twShineBar" aria-hidden="true"></i><span class="twFlour l" aria-hidden="true"></span><b class="twGold twShine">'+goldHTML('幸運彈珠')+'</b><span class="twFlour r" aria-hidden="true"></span></div></div>');
 const [cv,x]=cvs(L,W,H);cv.className='b22pl';
 const SP=window.B22&&B22.SPR,PEG=SP&&SP.peg,BALL=SP&&SP.ball;
 const SH=Math.max(22,Math.min(30,H*.15)),sp=W/(R+2),gx=(r,i)=>W/2+(i-r/2)*sp,gy=r=>10+r*(H-SH-22)/R,SY=H-SH-4,SW=sp-3;
 let path=[0];for(let r=0;r<R;r++)path.push(path[r]+(Math.random()<.5?0:1));const slot=path[R];
 const slotCol=v=>v>=100?['#fff6cf','#ffd65a','#a8640c']:v>=25?['#ffd0e6','#ff6fae','#8a1048']:v>=8?['#d6fff0','#3fc69a','#0f5a46']:['#e8dcff','#8a6ad6','#3a1f6e'];
 const trail=[],hits=[],parts=[];let hl=-1,glow=0,ball=null,drop=null,raf=0,live=1;
 const pN=innerWidth<=360?3:6;
 function spawn(px,py,n){if(RM)return;for(let i=0;i<n;i++)parts.push({x0:px,y0:py,x1:px+(Math.random()-.5)*28,y1:py-(10+Math.random()*22),x2:px+(Math.random()-.5)*64,y2:py-(20+Math.random()*40),x3:px+(Math.random()-.5)*88,y3:py+(Math.random()-.5)*40,life:0,max:16+Math.random()*16|0,sz:1.8+Math.random()*2.8})}
 function bez(p,u){const t=u,s=1-t,ss=s*s,tt=t*t;return[ss*s*p.x0+3*ss*t*p.x1+3*s*tt*p.x2+tt*t*p.x3,ss*s*p.y0+3*ss*t*p.y1+3*s*tt*p.y2+tt*t*p.y3]}
 const toScr=(px,py)=>{const r=cv.getBoundingClientRect();return[r.left+px*(r.width/W),r.top+py*(r.height/H)]};
 function draw(){
  x.clearRect(0,0,W,H);
  const g=x.createRadialGradient(W/2,H*.4,8,W/2,H*.5,Math.max(W,H)*.72);
  g.addColorStop(0,'rgba('+FXC.glow+',.16)');g.addColorStop(.55,'rgba(18,6,28,.5)');g.addColorStop(1,'rgba(10,3,18,.72)');
  x.fillStyle=g;x.fillRect(0,0,W,H);
  const now=performance.now();
  for(let r=1;r<=R;r++)for(let i=0;i<=r;i++){
   const d=drop==null?1:Math.max(0,Math.min(1,(drop-(r*0.06+i*0.015))/0.35));const e=1-Math.pow(1-d,3);
   const px=gx(r,i),py=gy(r)-6-(1-e)*40;x.globalAlpha=e;
   if(PEG)x.drawImage(PEG,px-6,py-6,12,12);else{x.fillStyle=FXC.fx;x.beginPath();x.arc(px,py,4,0,7);x.fill()}
   x.globalAlpha=1}
  hits.forEach(h=>{const age=(now-h.t0)/300;if(age>1)return;const px=gx(h.r,h.i),py=gy(h.r)-6;
   x.save();x.globalCompositeOperation='lighter';x.beginPath();x.arc(px,py,5+age*16,0,7);
   x.strokeStyle='rgba('+FXC.glow+','+(1-age)+')';x.lineWidth=2.4*(1-age);x.stroke();
   x.beginPath();x.arc(px,py,4+age*6,0,7);x.fillStyle='rgba('+FXC.glow+','+(.42*(1-age))+')';x.fill();x.restore()});
  PL.forEach((v,i)=>{const sx=gx(R,i)-SW/2,c=slotCol(v);const gg=x.createLinearGradient(0,SY,0,SY+SH);gg.addColorStop(0,c[0]);gg.addColorStop(.45,c[1]);gg.addColorStop(1,c[2]);
   x.fillStyle=gg;x.beginPath();x.roundRect(sx,SY,SW,SH,6);x.fill();x.lineWidth=i===hl?2.4:1.5;x.strokeStyle=i===hl?FXC.fx:'#5a3200';x.stroke();
   if(i===hl){x.save();x.globalCompositeOperation='lighter';x.fillStyle='rgba('+FXC.glow+','+(.32+.28*Math.sin(glow))+')';x.beginPath();x.roundRect(sx-3,SY-3,SW+6,SH+6,8);x.fill();x.restore()}
   x.font='900 11px "Noto Sans TC",sans-serif';x.textAlign='center';x.lineWidth=3;x.strokeStyle='rgba(40,10,0,.85)';x.strokeText('×'+v,sx+SW/2,SY+SH/2+4,SW-2);x.fillStyle='#fff';x.fillText('×'+v,sx+SW/2,SY+SH/2+4,SW-2)});
  if(parts.length){x.save();x.globalCompositeOperation='lighter';
   for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.life++;const u=p.life/p.max;if(u>=1){parts.splice(i,1);continue}
    const q=bez(p,u);x.globalAlpha=(1-u)*.9;x.beginPath();x.arc(q[0],q[1],p.sz*(1-u*.35),0,7);x.fillStyle='rgba('+FXC.glow+',1)';x.fill()}
   x.restore();x.globalAlpha=1}
  if(ball){x.save();x.globalCompositeOperation='lighter';
   if(trail.length>1){x.beginPath();trail.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.strokeStyle='rgba('+FXC.glow+',.5)';x.lineWidth=7;x.lineCap='round';x.stroke();
    x.beginPath();trail.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.strokeStyle=FXC.fx;x.lineWidth=2.2;x.stroke()}
   trail.forEach((p,i)=>{const k=(i+1)/trail.length;x.beginPath();x.arc(p[0],p[1],2+7*k,0,7);x.fillStyle='rgba('+FXC.glow+','+(.1+.45*k)+')';x.fill()});
   x.restore();
   const bx=ball[0],by=ball[1];
   x.save();x.globalCompositeOperation='lighter';const halo=x.createRadialGradient(bx,by,1,bx,by,16);halo.addColorStop(0,'rgba('+FXC.glow+',.75)');halo.addColorStop(1,'rgba('+FXC.glow+',0)');x.fillStyle=halo;x.beginPath();x.arc(bx,by,16,0,7);x.fill();x.restore();
   if(BALL)x.drawImage(BALL,bx-9,by-9,18,18);else{x.fillStyle='#fff6cf';x.beginPath();x.arc(bx,by,8,0,7);x.fill();x.strokeStyle=FXC.fx;x.lineWidth=1.5;x.stroke()}}
 }
 function loop(){if(!live)return;glow+=.18;draw();raf=requestAnimationFrame(loop)}
 try{bgmDuck(true)}catch(e){}
 fxWorld();fxImpact();fxStreaks();
 if(!RM){document.body.classList.add('twPunch');setTimeout(()=>document.body.classList.remove('twPunch'),480)}
 try{jpSlam()}catch(e){}
 loop();
 if(!RM){L.classList.add('twBoom');await sleep(900);L.classList.remove('twBoom')}else await sleep(60);
 const slam=L.querySelector('.twSlam');if(slam){slam.classList.add('out');setTimeout(()=>slam.remove(),340)}
 const rays=L.querySelector('.twRays');if(rays)rays.classList.add('plDim');
 const t0=performance.now();await new Promise(res=>{(function f(t){drop=(t-t0)/700;if(drop<1.6&&!RM)requestAnimationFrame(f);else{drop=1;res()}})(t0)});
 try{plWhoosh()}catch(e){}
 for(let r=0;r<R;r++){const ax=gx(r,path[r]),ay=gy(r)-6,bx=gx(r+1,path[r+1]),by=gy(r+1)-6;const steps=RM?3:(r>=R-2?14:10);
  for(let s=1;s<=steps;s++){const k=s/steps,ek=k*k*(3-2*k);const px=ax+(bx-ax)*ek,py=ay+(by-ay)*k-Math.sin(k*Math.PI)*8;ball=[px,py];trail.push([px,py]);if(trail.length>14)trail.shift();await sleep(RM?8:16)}
  hits.push({r:r+1,i:path[r+1],t0:performance.now()});spawn(bx,by,pN);
  const xy=toScr(bx,by+4);window.W21&&W21.burst(xy[0],xy[1],5,110);
  try{plPeg(r)}catch(e){}}
 const destX=gx(R,slot),destY=SY+SH/2,[sx0,sy0]=ball||[destX,gy(R)-6];
 for(let s=1;s<=8;s++){const k=s/8;ball=[sx0+(destX-sx0)*k,sy0+(destY-sy0)*k];trail.push(ball.slice());if(trail.length>14)trail.shift();await sleep(RM?8:16)}
 hl=slot;const mult=PL[slot];const tier=mult>=100?2:mult>=25?1:0;
 try{plLand(tier)}catch(e){}
 fxImpact();
 if(tier>=1){fxStreaks();fxRain(tier>=2?(innerWidth<=360?36:58):(innerWidth<=360?22:40))}
 if(!RM){document.body.classList.add('twShake');if(tier>=1)document.body.classList.add('twPunch');setTimeout(()=>document.body.classList.remove('twShake','twPunch'),560)}
 {const xy=toScr(destX,destY);window.W21&&W21.burst(xy[0],xy[1],tier>=2?22:16,240+tier*50)}
 const pop=document.createElement('div');pop.className='plPop'+(tier?' t'+tier:'');pop.innerHTML='<b class="twGold twShine">'+goldHTML('×'+mult)+'</b>';L.appendChild(pop);
 try{plStinger(tier)}catch(e){}
 for(let i=0;i<(RM?4:18);i++){await sleep(RM?20:30)}
 live=0;if(raf)cancelAnimationFrame(raf);
 const w=PL[slot]*tot;return finish(L,w,`落入 ×${PL[slot]}`)}
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
/* ---- buy 寶珠對碰 ---- */
function buyUI(){/* v28.80: no menu purchase tile; 寶珠對碰 still triggers during normal play via CZHS */}
function boot(){twUI();buyUI()}
if(document.readyState==='complete')setTimeout(boot,300);else addEventListener('load',()=>setTimeout(boot,300));
window.CZF={tk:()=>tk,emit:()=>emitT('tick'),force:{plinko:()=>queue(plinko,BETS[betIdx]),wheel:()=>queue(wheel,BETS[betIdx]),erupt:()=>{tw.n=TW_N;tw.pot=Math.max(tw.pot,BETS[betIdx]*NL*1.2);queue(erupt(),BETS[betIdx])},mult:()=>{armed=mxR=pick(MX);queue(mxShow,BETS[betIdx])}},pending:()=>!!PR&&!armed&&((PR.p<5*PL_P&&tk.p+1>=5)||(PR.w<12*WH_P&&tk.w+1>=12)||(PR.m<3*(MP[ID]||0)&&tk.m+1>=3)||tw.n+1>=TW_N),tw:()=>tw,MP,PL_P,WH_P};
})();
