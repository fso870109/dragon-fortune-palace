/* v21 flow / win ladder / help cards — play money only */
(function(){
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches,$=i=>document.getElementById(i);
let AC,bus,bed=null;function ac(){try{if(!AC){AC=new (window.AudioContext||window.webkitAudioContext)();bus=AC.createGain();bus.gain.value=0;bus.connect(AC.destination)}if(AC.state==='suspended')AC.resume()}catch(e){}return AC}
const muted=()=>typeof sound!=='undefined'&&!sound;
function tone(f,t0,d,ty,v,f2,dest){const a=ac();if(!a||muted())return;const t=a.currentTime+t0,o=a.createOscillator(),g=a.createGain();o.type=ty||'sine';o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v||.06,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(dest||a.destination);o.start(t);o.stop(t+d+.05)}
/* music bed with crossfade */
const BASS=[131,131,175,196],ARP=[523,659,784,659];let step=0;
function bedOn(){const a=ac();if(!a)return;bus.gain.cancelScheduledValues(a.currentTime);bus.gain.setTargetAtTime(muted()?0:1,a.currentTime,.35);if(bed)return;step=0;bed=setInterval(()=>{if(muted())return;if(step%4==0)tone(BASS[(step/4|0)%4]/2,0,.42,'sine',.09,0,bus);tone(ARP[step%4]*((step/4|0)%4==2?1.335:1),0,.14,'square',.016,0,bus);step++},150)}
function bedOff(){const a=ac();if(!a||!bed)return;bus.gain.setTargetAtTime(0,a.currentTime,.3);const b=bed;setTimeout(()=>{if(bed===b&&bus.gain.value<.05){clearInterval(bed);bed=null}},1600)}
/* anticipation → transition */
function pre(){return new Promise(res=>{if(!$('f21Orb')){const o=document.createElement('div');o.id='f21Orb';document.body.appendChild(o)}document.body.classList.remove('f21pre');void document.body.offsetWidth;document.body.classList.add('f21pre');
 tone(180,0,.9,'sawtooth',.03,720);tone(360,.1,.8,'triangle',.03,1440);[523,659,784,1047].forEach((f,i)=>tone(f,.55+i*.07,.3,'triangle',.05));setTimeout(bedOn,500);setTimeout(res,RM?150:950)})}
function back(){bedOff();setTimeout(()=>document.body.classList.remove('f21pre'),250)}
/* win ladder beams */
function beams(tier){if(tier<1)return;let b=$('f21Beam');if(!b){b=document.createElement('div');b.id='f21Beam';document.body.appendChild(b)}const n=tier==1?8:14,c=tier==1?'255,214,90':'255,240,200';
 b.style.background=`repeating-conic-gradient(rgba(${c},.32) 0 ${360/n/3}deg,transparent ${360/n/3}deg ${360/n}deg)`;b.style.maskImage=b.style.webkitMaskImage='radial-gradient(circle,#000 10%,transparent 60%)';b.classList.remove('go');void b.offsetWidth;b.classList.add('go')}
window.F21={pre,back,beams,bedOn,bedOff};
/* help cards */
const G='stroke="#ffd65a" stroke-width="3"',T=(x,y,s,t,c='#ffe680')=>`<text x="${x}" y="${y}" font-family="Noto Sans TC" font-weight="900" font-size="${s}" fill="${c}" text-anchor="middle">${t}</text>`;
const orb=(x,y,r,c,t)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="url(#${c})" ${G}/>`+(t?T(x,y+5,13,t,'#3a1600'):'');
const DEF=`<defs><radialGradient id="og" cx=".35" cy=".3"><stop offset="0" stop-color="#fffbe6"/><stop offset=".45" stop-color="#ffd65a"/><stop offset="1" stop-color="#a8640c"/></radialGradient><radialGradient id="ob" cx=".35" cy=".3"><stop offset="0" stop-color="#f0f8ff"/><stop offset=".45" stop-color="#6fb6ff"/><stop offset="1" stop-color="#173a78"/></radialGradient><radialGradient id="op" cx=".35" cy=".3"><stop offset="0" stop-color="#fff0f8"/><stop offset=".45" stop-color="#ff6fae"/><stop offset="1" stop-color="#6a0f3c"/></radialGradient><linearGradient id="gb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6cf"/><stop offset=".5" stop-color="#ffd65a"/><stop offset="1" stop-color="#c98a1c"/></linearGradient></defs>`;
const V=[
`<svg viewBox="0 0 300 200">${DEF}${[0,1,2,3,4].map(i=>`<rect x="${18+i*54}" y="18" width="48" height="110" rx="8" fill="#241033" ${G}/>`).join('')}<path d="M30 74 H270" stroke="#ff4f9a" stroke-width="4" stroke-linecap="round"/>${[0,1,2].map(i=>`<circle cx="${42+i*54}" cy="74" r="15" fill="url(#op)" ${G}/>`).join('')}<circle cx="150" cy="166" r="28" fill="url(#gb)" stroke="#5a3200" stroke-width="3"/>${T(150,172,16,'旋轉','#2a1200')}</svg>`,
`<svg viewBox="0 0 300 200">${DEF}${Array.from({length:15},(_,i)=>{const x=36+(i%5)*57,y=34+(i/5|0)*62;return [0,2,3,6,9,11,13].includes(i)?orb(x,y,23,i==6?'ob':i==11?'op':'og',i==6?'迷你':i==11?'大獎':['×2','','×5','×3','','','','','','×8','','','','×1'][i]):`<circle cx="${x}" cy="${y}" r="23" fill="none" stroke="rgba(255,214,90,.35)" stroke-width="2"/>`}).join('')}</svg>`,
`<svg viewBox="0 0 300 200">${DEF}${[0,1,2,3,4,5,6].map(j=>`<ellipse cx="150" cy="${24+j*20}" rx="${22+j*14}" ry="${5+j*1.5}" fill="none" stroke="rgba(255,214,90,${.25+j*.1})" stroke-width="3"/>`).join('')}${[[80,60],[220,90],[110,120],[200,40],[170,140],[95,95]].map(([x,y])=>orb(x,y,9,'og')).join('')}<rect x="95" y="160" width="110" height="32" rx="10" fill="#241033" ${G}/>${T(150,182,15,'聚寶 12,800')}</svg>`,
`<svg viewBox="0 0 300 200">${DEF}${[['大獎',60,'#ffd65a',60],['超級大獎',105,'#ff6fae',150],['傳說大獎',150,'#fff6cf',240]].map(([t,h,c,x])=>`<rect x="${x-34}" y="${190-h}" width="68" height="${h}" rx="8" fill="url(#gb)" fill-opacity=".35" stroke="${c}" stroke-width="3"/>`+T(x,182-h,15,t,c)).join('')}</svg>`];
const CARDS=[['按下旋轉','三個以上相同符號從最左邊連成一線，就能贏得籌碼。'],['隱藏遊戲','隱藏遊戲隨機出現，觸發時會從轉輪中帶出，敬請期待！'],['獎金分級','獎金越大演出越華麗：大獎、超級大獎、傳說大獎！']];
function help(){if($('h21'))return;const o=document.createElement('div');o.className='h21';o.id='h21';o.setAttribute('role','dialog');o.setAttribute('aria-label','玩法說明');
 o.innerHTML=`<h2 class="h21T">玩法說明</h2><div class="h21S">${CARDS.map((c,i)=>`<section class="h21card">${V[i]}<h3>${c[0]}</h3><p>${c[1]}</p></section>`).join('')}</div><div class="h21D">${CARDS.map((_,i)=>`<i class="${i?'':'on'}"></i>`).join('')}</div><button type="button">下一張</button><div class="h21N">僅供娛樂・虛擬籌碼・無真實金錢</div>`;
 document.body.appendChild(o);const S=o.querySelector('.h21S'),dots=[...o.querySelectorAll('.h21D i')],btn=o.querySelector('button');const idx=()=>Math.round(S.scrollLeft/(S.clientWidth+12));
 const upd=()=>{const k=idx();dots.forEach((d,i)=>d.classList.toggle('on',i===k));btn.textContent=k>=CARDS.length-1?'開始遊戲':'下一張'};S.addEventListener('scroll',upd,{passive:true});
 btn.onclick=()=>{const k=idx();if(k>=CARDS.length-1){localStorage.setItem('czHelp21','1');o.classList.add('out');setTimeout(()=>o.remove(),400)}else S.scrollTo({left:(k+1)*(S.clientWidth+12),behavior:RM?'auto':'smooth'})};
 dots.forEach((d,i)=>d.onclick=()=>S.scrollTo({left:i*(S.clientWidth+12),behavior:'smooth'}))}
window.F21.help=help;
function menuItem(){const m=$('menu16');if(!m||$('h21Btn'))return;const ref=[...m.children].find(e=>e.tagName==='BUTTON'&&!e.classList.contains('czbuyitem'));const b=document.createElement('button');b.id='h21Btn';b.type='button';if(ref)b.className=ref.className;b.textContent='📖 玩法說明';b.onclick=()=>{document.body.classList.remove('menu16');help()};m.appendChild(b)}
function boot(){menuItem();if(!localStorage.getItem('czHelp21')){const t0=Date.now();(function w(){const busy=document.querySelector('dialog[open]')||($('czLoad')&&$('czLoad').offsetParent);if(busy&&Date.now()-t0<20000)return setTimeout(w,500);help()})()}}
if(document.readyState==='complete')setTimeout(boot,400);else addEventListener('load',()=>setTimeout(boot,400));
})();
/* ===== v21 life layer ===== */
(function(){const $=i=>document.getElementById(i);
function bump(e,dn){if(!e)return;e.classList.remove('l21bump','l21dn');void e.offsetWidth;e.classList.add(dn?'l21dn':'l21bump')}
function num(e){return +(e.textContent||'').replace(/[^\d.-]/g,'')||0}
function watch(id){const e=$(id);if(!e)return;let v=num(e);new MutationObserver(()=>{const n=num(e);if(n!==v){bump(e,n<v&&id!=='czBet');v=n}}).observe(e,{childList:true,characterData:true,subtree:true})}
function floatTxt(el,t){if(!el)return;const r=el.getBoundingClientRect(),f=document.createElement('div');f.className='l21fl';f.textContent=t;f.style.left=(r.left+r.width/2-8)+'px';f.style.top=(r.top-4)+'px';document.body.appendChild(f);setTimeout(()=>f.remove(),850)}
let idleT=0;function poke(){document.body.classList.remove('l21idle');clearTimeout(idleT);idleT=setTimeout(()=>{if(!window.__hold&&!(typeof bwState!=='undefined'&&bwState)&&!(typeof spinning!=='undefined'&&spinning)&&!(typeof FS!=='undefined'&&FS)&&!document.querySelector('dialog[open],.fxOv,#hsBox,#h21')){placeHint();document.body.classList.add('l21idle')}else poke()},7000)}
function placeHint(){const s=$('spinBtn'),h=$('l21Hint');if(!s||!h)return;const r=s.getBoundingClientRect();h.style.left=(r.left+r.width/2)+'px';h.style.top=(r.top-34)+'px'}
function react(o){const h=$('czHero');if(!h)return;const c=o.won<=0?'l21lose':o.xr>=10?'l21big':'l21win';h.classList.remove('l21win','l21big','l21lose');void h.offsetWidth;h.classList.add(c);setTimeout(()=>h.classList.remove(c),1700)}
function boot(){['czCred','czBet','czWin'].forEach(watch);
 const h=$('czHero');if(h&&!$('l21Sweep')){const s=document.createElement('div');s.id='l21Sweep';h.appendChild(s)}
 const bd=$('board'),par=bd&&bd.offsetParent;if(bd&&par&&!document.querySelector('.l21sp')){const P=[[0,0],[50,0],[100,0],[100,50],[100,100],[50,100],[0,100],[0,50]];P.forEach(([x,y],i)=>{const s=document.createElement('i');s.className='l21sp';s.style.left=`calc(${bd.offsetLeft}px + ${x}% * ${bd.offsetWidth/100})`;s.style.left=(bd.offsetLeft+bd.offsetWidth*x/100)+'px';s.style.top=(bd.offsetTop+bd.offsetHeight*y/100)+'px';s.style.animationDelay=(i*.35)+'s';par.appendChild(s)})}
 [['plus','+'],['minus','−']].forEach(([id,t])=>{const b=$(id);b&&b.addEventListener('click',()=>{if(!b.disabled)setTimeout(()=>floatTxt($('czBet'),t),0)})});
 const hint=document.createElement('div');hint.id='l21Hint';hint.textContent='點一下，好運轉起來！';document.body.appendChild(hint);
 ['pointerdown','keydown','touchstart'].forEach(e=>addEventListener(e,poke,{passive:true}));poke();
 const o=window.CZ&&CZ.onSettle;if(o)CZ.onSettle=function(r){const x=o.apply(this,arguments);try{react(r);poke()}catch(e){}return x}}
if(document.readyState==='complete')setTimeout(boot,500);else addEventListener('load',()=>setTimeout(boot,500));
})();
/* page transitions machine side */
(function(){if(sessionStorage.getItem('l21zoom')){sessionStorage.removeItem('l21zoom');document.documentElement.classList.add('l21enter');setTimeout(()=>document.documentElement.classList.remove('l21enter'),700)}
document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a[href]');if(!a)return;const h=a.getAttribute('href');if(!/index\.html|^\.\/?$|^\/?$/.test(h))return;e.preventDefault();e.stopPropagation();sessionStorage.setItem('l21back','1');try{window.CZA&&CZA.mus(false)}catch(_){};window.CZDoor?CZDoor.close(()=>location.href=a.href):(location.href=a.href)},true);
addEventListener('pageshow',e=>{if(e.persisted)document.documentElement.classList.remove('l21leave')})})();
(function(){const chk=()=>document.body.classList.toggle('f21ov',!!document.querySelector('.fxOv,#hsBox,#h21'));new MutationObserver(chk).observe(document.body,{childList:true})})();
