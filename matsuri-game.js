const SYM=[
{id:'fan',name:'風車',pay:[10, 29, 96]},
{id:'lantern',name:'提燈',pay:[13, 36, 119]},
{id:'sake',name:'清酒',pay:[14, 41, 142]},
{id:'taiko',name:'太鼓',pay:[17, 53, 179]},
{id:'goldfish',name:'金魚',pay:[21, 66, 213]},
{id:'kitsune',name:'風鈴',pay:[29, 96, 309]},
{id:'daruma',name:'達摩',pay:[47, 142, 475]},
{id:'bowl',name:'刨冰',pay:[71, 237, 831]},
{id:'fireworks',name:'花火',pay:[119, 475, 1781]},
{id:'woman',name:'浴衣美人',pay:[237, 1186, 5935]},
{id:'wild',name:'WILD 家紋',pay:[297, 1424, 9496]},
{id:'scatter',name:'免費次數 浴衣美人',pay:[0, 0, 0]}];
const WI=10,SI=11,NR=5,NL=20,SCATP={3:6,4:25,5:125},FS_N=10,FS_M=2;
// per-reel symbol weights (RTP 93.80% exact incl. free spins + jackpot; see math/final.py)
const REELW=[[22,20,17,14,11,8,6,4,3,2,0,3],[22,20,17,14,11,8,6,4,3,2,3,3],[22,20,17,14,11,8,6,4,3,2,3,3],[22,20,17,14,11,8,6,4,3,2,3,3],[22,20,17,14,11,8,6,4,3,2,0,3]];
const LINES=[[1,1,1,1,1],[0,0,0,0,0],[2,2,2,2,2],[0,1,2,1,0],[2,1,0,1,2],[0,0,1,2,2],[2,2,1,0,0],[1,0,0,0,1],[1,2,2,2,1],[1,0,1,2,1],[1,2,1,0,1],[0,1,1,1,0],[2,1,1,1,2],[0,1,0,1,0],[2,1,2,1,2],[1,1,0,1,1],[1,1,2,1,1],[0,0,2,0,0],[2,2,0,2,2],[0,2,0,2,0]];
const COLORS=LINES.map((_,i)=>`hsl(${(i*137)%360},95%,60%)`);
const BETS=[1,2,5,10,20,50];
const POOLS=REELW.map(w=>{const p=[];w.forEach((n,i)=>{for(let k=0;k<n;k++)p.push(i)});return p});
const rnd=(c=0)=>{const p=POOLS[c]||POOLS[0];return p[Math.floor(Math.random()*p.length)]};
const rndGrid=()=>Array.from({length:NR},(_,c)=>[rnd(c),rnd(c),rnd(c)]);
function lineWin(s){if(s[0]===SI)return null;let best=null;const cands=s[0]===WI?[...Array(WI+1).keys()]:[s[0]];
for(const t of cands){let n=0;for(const x of s){if(x===t||(x===WI&&t!==SI))n++;else break}
if(n>=3){const p=SYM[t].pay[n-3];if(!best||p>best.m)best={t,n,m:p}}}return best}
function evalGrid(g){let line=0;const hits=[];LINES.forEach((ln,li)=>{const w=lineWin(ln.map((r,c)=>g[c][r]));if(w){line+=w.m;hits.push({li,cnt:w.n,m:w.m,t:w.t})}});
const scPos=[];g.forEach((col,c)=>col.forEach((v,r)=>{if(v===SI)scPos.push([c,r])}));const sc=scPos.length;
return {line,hits,sc,scPos,scPay:sc>=3?SCATP[Math.min(sc,5)]:0}}
['matsuri/bigbonus','matsuri/cutin'].forEach(n=>{const i=new Image();i.src=`assets/${n}.webp`;i.decode&&i.decode().catch(()=>{})});const rAF2=f=>requestAnimationFrame(()=>requestAnimationFrame(f));const LOVE_L=["一起看煙火吧。", "浴衣，適合我嗎…？", "夏夜，還沒結束", "撈金魚，來比賽吧！", "聽得到祭典的聲音呢", "與你共度的特別夏天"];
setInterval(()=>{if(spinning||bwState||FS||document.hidden)return;const m=$('msg');if(Date.now()-(m._t||0)<7000)return;m._t=Date.now();m.textContent=LOVE_L[Math.random()*LOVE_L.length|0]},7000);
let FS=null;const LPTS=LINES.map(ln=>ln.map((r,c)=>`${50+c*100},${50+r*100}`).join(' '));
const $=id=>document.getElementById(id);
let bal=+(localStorage.getItem('fs_bal')??1000);if(isNaN(bal))bal=1000;
let betIdx=+(localStorage.getItem('fs_bet')??1)||0;if(betIdx>=BETS.length)betIdx=0;
let sound=localStorage.getItem('fs_sound')!=='0',spinning=false,grid=[[0,8,0],[1,3,1],[7,2,4],[6,9,5],[5,10,3]];window.__IQ=["fan", "fireworks", "fan2", "lantern", "taiko", "lantern2", "bowl", "sake", "goldfish", "daruma", "woman", "kitsune2", "kitsune", "wild", "taiko2"];
const reels=[...document.querySelectorAll('.reel')];
const icon=(id,sz='')=>`<img class="sym" src="assets/sym_${id}.webp" alt="" draggable="false" decoding="sync" data-f="${id}" ${sz}>`;
const IMGF=new Set();document.addEventListener('error',e=>{const t=e.target;if(t&&t.tagName==='IMG'&&t.dataset.f){IMGF.add(t.dataset.f);t.outerHTML=`<svg class="sym" aria-hidden="true"><use href="#s-${t.dataset.f}"/></svg>`}},true);
const IMGS=["fan", "fan2", "lantern", "lantern2", "bowl", "daruma", "kitsune", "kitsune2", "fireworks", "taiko", "taiko2", "sake", "woman", "wild", "goldfish", "scatter"].flatMap(id=>[id,id+'_b']).map(id=>{const i=new Image();i.src=`assets/matsuri/t_${id}.webp?v=2847`;i.decode&&i.decode().catch(()=>IMGF.add(id));return i});
const icon2=icon;
const VAR={};
function symHTML(id,sz=''){if(!IMGF.has(id)){let v=id;const IQ=window.__IQ;if(IQ&&IQ.length&&!sz)v=IQ.shift();else if(VAR[id]&&!sz)v=VAR[id][Math.random()*VAR[id].length|0];return `<img class="sym" src="assets/matsuri/t_${v}.webp?v=2847" alt="" draggable="false" decoding="sync" data-f="${id}" data-v="${v}" ${sz}>`}if(id==='heroine'&&!IMGF.has(id)&&!sz){const k=Math.random()*3|0;return `<img class="sym" src="assets/heroine${k}.webp" alt="" draggable="false" data-f="heroine">`}return IMGF.has(id)?`<svg class="sym" ${sz} aria-hidden="true"><use href="#s-${id}"/></svg>`:icon(id,sz)}
function cellHTML(i){const s=SYM[i];return `<div class="cell" data-s="${s.id}" aria-label="${s.name}">${symHTML(s.id)}</div>`}
function boardLabel(){const rows=['上排','中排','下排'].map((n,r)=>n+'：'+grid.map(c=>SYM[c[r]].name).join('、'));$('board').setAttribute('aria-label','轉輪結果。'+rows.join('；'))}
function render(){boardLabel();reels.forEach((r,c)=>{const st=r.firstElementChild;st.style.transition='none';st.style.transform='translateY(0)';st.innerHTML=grid[c].map(cellHTML).join('')})}
function ui(){$('bal').textContent=bal;$('bet').textContent=BETS[betIdx]+'×'+NL;saveLater();{const b=$('soundBtn');b.firstElementChild.textContent=sound?'🔊':'🔇';b.lastElementChild.textContent=sound?'音效：開':'音效：關';b.setAttribute('aria-pressed',sound)}}
// deferred storage (keeps localStorage writes off the win frame)
const ric=window.requestIdleCallback||(f=>setTimeout(f,200));let svQ=0;function saveLater(){if(svQ)return;svQ=1;ric(()=>{svQ=0;try{localStorage.setItem('fs_bal',bal);localStorage.setItem('fs_bet',betIdx)}catch(e){}},{timeout:1500})}
addEventListener('pagehide',()=>{try{localStorage.setItem('fs_bal',bal);localStorage.setItem('fs_bet',betIdx)}catch(e){}});
// ===== v11 audio engine (WebAudio synthesis, no files) =====
let ac,AM=null;const AS={music:localStorage.getItem('fs_music')!=='0',mv:+(localStorage.getItem('fs_mv')??.5),sv:+(localStorage.getItem('fs_sv')??.8)};
function aInit(){if(AM)return AM;try{ac=new (window.AudioContext||window.webkitAudioContext)()}catch(e){return null}
const m=ac.createGain(),comp=ac.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=4;m.connect(comp).connect(ac.destination);
const mus=ac.createGain(),sfxG=ac.createGain();mus.connect(m);sfxG.connect(m);
const rv=ac.createConvolver(),len=ac.sampleRate*1.8,buf=ac.createBuffer(2,len,ac.sampleRate);
{let ch=0,i=0;const st=()=>{const d=buf.getChannelData(ch),e=Math.min(len,i+12000);for(;i<e;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.6);if(i>=len){i=0;ch++}if(ch<2)setTimeout(st,16);else try{rv.buffer=buf}catch(_){}};setTimeout(st,0)}
const rvG=ac.createGain();rvG.gain.value=.32;rv.connect(rvG).connect(m);
const dl=ac.createDelay(1),fb=ac.createGain(),dlG=ac.createGain();dl.delayTime.value=.23;fb.gain.value=.33;dlG.gain.value=.22;dl.connect(fb).connect(dl);dl.connect(dlG).connect(m);
const send=ac.createGain();send.connect(rv);send.connect(dl);sfxG.connect(send);const msend=ac.createGain();msend.gain.value=.35;mus.connect(msend).connect(rv);
const nb=ac.createBuffer(1,ac.sampleRate,ac.sampleRate),nd=nb.getChannelData(0);for(let i=0;i<nd.length;i++)nd[i]=Math.random()*2-1;
AM={m,mus,sfxG,noise:nb};aVol();return AM}
function aVol(){if(window.DFPvol){const v=DFPvol.get();sound=v.sfxOn;AS.music=v.musOn;AS.sv=v.sfx;AS.mv=v.mus}if(!AM)return;const t=ac.currentTime;AM.m.gain.setTargetAtTime(1,t,.02);AM.mus.gain.setTargetAtTime(AS.music?AS.mv*.55:0,t,.05);AM.sfxG.gain.setTargetAtTime(sound?AS.sv:0,t,.02)}
function aOK(){const on=window.DFPvol?DFPvol.sfxOn():sound;if(!on||document.hidden)return false;if(!aInit())return false;if(ac.state==='suspended')ac.resume();return true}
function osc(f,d,type='square',v=.08,t0=0,o={}){if(!aOK()||!isFinite(f)||!isFinite(t0))return;try{const t=ac.currentTime+t0,O=ac.createOscillator(),g=ac.createGain();O.type=type;O.frequency.setValueAtTime(f,t);
if(o.to)O.frequency.exponentialRampToValueAtTime(o.to,t+d);if(o.det)O.detune.value=o.det;const a=o.a||.005;
g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+a);g.gain.exponentialRampToValueAtTime(.0008,t+d);
let n=O;if(o.lp){const F=ac.createBiquadFilter();F.frequency.value=o.lp;n.connect(F);n=F}n.connect(g).connect(o.bus||AM.sfxG);O.start(t);O.stop(t+d+.05)}catch(e){}}
function tone(f,d,type='square',v=.08,t0=0){osc(f,d,type,v,t0)}
function noise(d,v=.1,t0=0,o={}){if(!aOK())return;const t=ac.currentTime+t0,s=ac.createBufferSource(),F=ac.createBiquadFilter(),g=ac.createGain();s.buffer=AM.noise;
F.type=o.ft||'bandpass';F.frequency.setValueAtTime(o.f||2000,t);if(o.to)F.frequency.exponentialRampToValueAtTime(o.to,t+d);F.Q.value=o.q||1;
g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+(o.a||.005));g.gain.exponentialRampToValueAtTime(.0008,t+d);s.connect(F).connect(g).connect(o.bus||AM.sfxG);s.start(t,Math.random()*.5);s.stop(t+d+.05)}
const mtof=n=>440*Math.pow(2,(n-69)/12);
function chord(ns,d,t0=0,type='sawtooth',v=.035){ns.forEach(n=>{osc(mtof(n),d,type,v,t0,{det:-7,lp:3200,a:.02});osc(mtof(n),d,type,v*.7,t0,{det:7,lp:3200,a:.02})})}
function arp(ns,step,t0=0,type='square',v=.05,d=.16){ns.forEach((n,i)=>{osc(mtof(n),d,type,v,t0+i*step);osc(mtof(n+12),d*.8,'triangle',v*.5,t0+i*step)})}
function coinClink(t0=0,p=1){osc(2093*p,.18,'square',.03,t0);osc(2637*p,.25,'triangle',.05,t0+.03);osc(3520*p,.12,'sine',.03,t0+.05)}
function drumRoll(dur,t0=0){for(let t=0;t<dur;t+=.045)noise(.06,.04+.12*(t/dur),t0+t,{f:1800,q:.7});noise(.6,.35,t0+dur,{ft:'lowpass',f:3000,to:200});osc(70,.5,'sine',.5,t0+dur,{to:40})}
const sfx={
click:()=>{osc(1200,.04,'square',.035);noise(.03,.05,0,{f:4000,q:3})},
blip:up=>{osc(up?660:520,.09,'square',.05,0,{to:up?990:350});osc(up?1320:700,.06,'triangle',.03,.04)},
spinStart:()=>{noise(.55,.22,0,{f:400,to:4000,q:1.2,a:.15});osc(180,.5,'sawtooth',.06,0,{to:720,lp:1500});arp([72,76,79,84],.04,0,'square',.035,.1);noise(.1,.15,0,{ft:'lowpass',f:900})},
tick:(c,v)=>{if(!isFinite(v))v=1;const p=.6+Math.min(1.4,v*.35);osc(1400*p+c*120,.025,'square',.022);noise(.02,.04,0,{f:5000*p,q:4})},
stop:c=>{const f=[150,130,110][c]||130;osc(f,.25,'triangle',.35,0,{to:f*.55});noise(.12,.25,0,{f:1200+c*500,q:2});osc(f*6.1,.18,'square',.03,.01);osc(f*8.3,.3,'sine',.04,.02)},
suspense:dur=>{if(!aOK())return;const t=ac.currentTime,O=ac.createOscillator(),O2=ac.createOscillator(),g=ac.createGain(),L=ac.createOscillator(),Lg=ac.createGain();
O.type='sawtooth';O2.type='square';O.frequency.setValueAtTime(220,t);O.frequency.exponentialRampToValueAtTime(880,t+dur);O2.frequency.setValueAtTime(221.5,t);O2.frequency.exponentialRampToValueAtTime(882,t+dur);
L.frequency.setValueAtTime(5,t);L.frequency.linearRampToValueAtTime(16,t+dur);Lg.gain.value=.025;L.connect(Lg).connect(g.gain);
g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.05,t+dur*.9);g.gain.linearRampToValueAtTime(0,t+dur+.1);[O,O2].forEach(o=>{o.connect(g);o.start(t);o.stop(t+dur+.15)});L.start(t);L.stop(t+dur+.15);g.connect(AM.sfxG);
for(let i=0;i<dur;i+=.25)osc(80,.12,'sine',.25,i,{to:45})},
win:tier=>{ // 0 small 1 medium 2 big 3 super 4 mega
if(tier===0){arp([72,76,79,84],.07,0,'square',.05);coinClink(.3)}
else if(tier===1){arp([72,76,79,84,88,91],.06,0,'square',.05);chord([60,64,67,72],.6,.36);for(let i=0;i<4;i++)coinClink(.4+i*.08,1+i*.05)}
else{const base=[0,2,5][tier-2];drumRoll(.9);const r=60+base;
[[r,r+4,r+7],[r+5,r+9,r+12],[r+7,r+11,r+14],[r+12,r+16,r+19]].forEach((c,i)=>chord(c,.5+(i===3?1.2:0),1+i*.28,'sawtooth',.04));
arp([r+12,r+16,r+19,r+24,r+28,r+31,r+36],.055,1,'square',.04,.2);osc(mtof(r-12),1.8,'sawtooth',.08,1.84,{lp:800});
if(tier>=3)arp([r+24,r+28,r+31,r+36,r+31,r+28,r+24,r+28,r+31,r+36],.07,2.1,'triangle',.05);
if(tier>=4){for(let i=0;i<6;i++)noise(.3,.12,2.4+i*.35,{ft:'lowpass',f:2500,to:300});osc(55,2,'sine',.4,1.84,{to:30})}}},
coin:u=>{coinClink(0,.9+u*.5+Math.random()*.08)},
collect:()=>{chord([72,76,79,84],1.2,0,'triangle',.06);arp([84,88,91,96],.05,0,'square',.04);for(let i=0;i<6;i++)coinClink(.1+i*.06,1+Math.random()*.3)},
chime:()=>{[76,79,84,88,91].forEach((n,i)=>{osc(mtof(n),1.2,'sine',.08,i*.09);osc(mtof(n)*2.01,.6,'sine',.03,i*.09)});chord([72,76,79],1.4,.45,'triangle',.04)},
buy:()=>{noise(.15,.15,0,{f:3000,q:2});osc(1568,.08,'square',.05,.02);osc(2093,.4,'triangle',.07,.1);arp([79,83,86,91],.05,.15,'square',.04);for(let i=0;i<3;i++)coinClink(.2+i*.07)},
ad:()=>{arp([67,71,74,79,83,86],.06,0,'triangle',.06,.25);chord([67,71,74,79],1,.38,'sawtooth',.03);coinClink(.5);coinClink(.6,1.2)},
lose:()=>{osc(330,.18,'triangle',.05,0,{to:250});osc(247,.3,'triangle',.05,.16,{to:180})},
big:()=>sfx.win(2)};
// v28.59: recorded theme BGM via czaudio.js — old 128bpm C-Am-F-G synth sequencer retired
const MUS={on:false,step:0,next:0,T:null};
function musSync(){if(MUS.T){clearInterval(MUS.T);MUS.T=null}if(window.CZA&&CZA.mus){const on=!!((window.DFPvol?DFPvol.musOn():!!AS.music)&&AM);CZA.mus(on)}}
addEventListener('pointerdown',()=>{if((window.DFPvol?(DFPvol.sfxOn()||DFPvol.musOn()):sound)&&aInit()){if(ac.state==='suspended')ac.resume();aVol();musSync()}},{capture:true});
addEventListener('keydown',()=>{if((window.DFPvol?(DFPvol.sfxOn()||DFPvol.musOn()):sound)&&aInit()){aVol();musSync()}},{capture:true});
function clearWin(){$('lines').innerHTML='';document.querySelectorAll('.hit').forEach(e=>e.classList.remove('hit'));$('machine').classList.remove('win-mode')}
const easeOut=t=>1-Math.pow(1-t,3);
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
function teaseCheck(res){ // reach on reels 4-5: big line or scatter bonus still possible after reel 3
let sc=0;for(let c=0;c<3;c++)res[c].forEach(v=>{if(v===SI)sc++});if(sc>=2)return true;
return LINES.some(ln=>{const s=[0,1,2].map(c=>res[c][ln[c]]);if(s[0]===SI)return false;const t=s[0];return t>=6&&s.every(x=>x===t||x===WI)});}
function animateReel(r,c,seq,dur,onDone){
const st=r.firstElementChild,h=r.clientHeight/3,dist=(seq.length-3)*h;
r.classList.remove('land');st.classList.remove('mb');st._mb=false;
{const old=[...st.children].slice(0,3);st.innerHTML=seq.slice(0,-3).map(cellHTML).join('');if(old.length===3&&old.every((n,k)=>n.dataset.s===SYM[seq[seq.length-3+k]].id))old.forEach(n=>st.appendChild(n));else st.insertAdjacentHTML('beforeend',seq.slice(-3).map(cellHTML).join(''))}st.style.transition='none';st.style.transform=`translate3d(0,${-dist}px,0)`;
const wind=RM?0:h*.18,over=RM?0:h*.22,W=RM?0:140,B=RM?0:320,D=dur*1000;
const t0=performance.now();let lastY=-dist,lastT=t0,ticked=0;
function frame(now){const t=now-t0;let y;
if(t<W){y=-dist-wind*Math.sin(Math.PI/2*t/W)}
else if(t<W+D){const u=(t-W)/D;y=-dist-wind+(dist+wind+over)*easeOut(u)}
else if(t<W+D+B){const u=(t-W-D)/B;y=over*Math.exp(-5*u)*Math.cos(u*Math.PI*2.5)}
else{st.style.transform='translate3d(0,0,0)';st._mb=false;st.classList.remove('mb');onDone();return}
const v=Math.abs(y-lastY)/Math.max(1,now-lastT);lastY=y;lastT=now;
st.style.transform=`translate3d(0,${y.toFixed(1)}px,0)`;{const mb=v>1.1&&!RM&&t<W+D;if(mb!==st._mb){st._mb=mb;st.classList.toggle('mb',mb)}}
const idx=Math.floor((y+dist)/h);if(idx!==ticked&&t>W&&t<W+D){ticked=idx;const nw=performance.now();if(nw-(r._tk||0)>(v>3?70:25)){r._tk=nw;sfx.tick(c,v)}}
requestAnimationFrame(frame)}
requestAnimationFrame(frame);}
function spin(){
if(spinning||bwState||window.__hold)return;const free=!!(FS&&FS.left>0);const bet=free?FS.bet:BETS[betIdx],total=bet*NL;
if(!free&&bal<total){if(bal>=BETS[0]*NL){let i=betIdx;while(i>0&&BETS[i]*NL>bal)i--;betIdx=i;ui();const t='籌碼不足，押注已調整為 '+BETS[i]+'×'+NL;$('msg').textContent=t;typeof toast==='function'&&toast(t)}else{$('msg').textContent=adLeft()>0?'籌碼不足！可「看廣告領籌碼」或「重置籌碼」':'籌碼不足！可「重置籌碼」';window.czChipDlg&&czChipDlg('low',()=>$('resetBtn').__doReset())}sfx.lose();return}
BRc=null;boardR();spinning=true;if(free){FS.left--;FS.n++;fsUI()}else{bal-=total;window.CZ&&CZ.onBet(total)}ui();clearWin();$('win').textContent=0;$('msg').textContent=free?`免費次數 ${FS.n}／${FS.tot}（獎金 ×${FS_M}）`:'旋轉中…';$('board').setAttribute('aria-busy','true');
['spinBtn','minus','plus','maxBtn','resetBtn'].forEach(i=>$(i).disabled=true);
const res=(window.__force&&window.__force.shift())||rndGrid();const tease=teaseCheck(res);
const ev=evalGrid(res),mult=free?FS_M:1;
sfx.spinStart();$('machine').classList.add('spinning');lcdSpin((ev.line/NL+ev.scPay)*mult,tease,ev.sc>=3);let done=0;
reels.forEach((r,c)=>{const ext=tease?(c===3?16:c===4?34:0):0,n=12+c*5+ext;
const seq=[...res[c]];for(let k=0;k<n;k++)seq.push(rnd(c));seq.push(...grid[c]);
const dur=(RM?.45:.85)+c*.24+(tease?(c===3?1.1:c===4?2.3:0):0);
animateReel(r,c,seq,dur,()=>{sfx.stop(c%3);landFX(c);r.classList.remove('tease','land');rAF2(()=>r.classList.add('land'));
const st=r.firstElementChild;while(st.children.length>3)st.lastElementChild.remove();st.querySelectorAll('img.sym').forEach(i=>{if(i.complete&&!i.naturalWidth){const u=i.getAttribute('src');i.src=u+(u.includes('?')?'&r=1':'?r=1')}});
if(c===2&&tease){r.parentNode.classList.add('teasing');reels[3].classList.add('tease');reels[4].classList.add('tease');$('msg').textContent='大獎機會!! 心跳停不下來…！（第 4、5 輪）';lcdReach();sfx.suspense(RM?.5:1.4)}
if(c===3&&tease){r.classList.remove('tease');sfx.suspense(RM?.4:1.1)}
if(++done===NR){$('machine').classList.remove('spinning');r.parentNode.classList.remove('teasing');grid=res;settle(bet,free)}});});
}
function settle(bet,free){
boardLabel();$('board').removeAttribute('aria-busy');const total=bet*NL,mult=free?FS_M:1,ev=evalGrid(grid),hits=ev.hits;
const MGd=(window.CZMG&&ev.sc>=3)?CZMG.draw(ev.sc):null,scP=MGd?MGd.sum:ev.scPay;const won=(ev.line*bet+scP*total)*mult,xr=won/total;
const svg=$('lines');let sh='';HITC=[];const hset=new Set();document.querySelectorAll('.led .pl.on').forEach(e=>e.classList.remove('on'));
hits.forEach((h,hi)=>{const ln=LINES[h.li];const pts=LPTS[h.li];sh+=`<polyline class="glow" stroke="${COLORS[h.li]}" points="${pts}"/><polyline class="core" stroke="${COLORS[h.li]}" points="${pts}"/>`+(hi<5?`<polyline class="beam" points="${pts}"/>`:'');
const pl=document.querySelector(`.led .pl[data-l="${h.li}"]`);if(pl)pl.classList.add('on');
for(let c=0;c<h.cnt;c++){const k=c*3+ln[c];if(!hset.has(k)){hset.add(k);HITC.push([c,ln[c]])}}});HITC.forEach(([c,r])=>reels[c].firstElementChild.children[r].classList.add('hit'));
if(ev.sc>=3)ev.scPos.forEach(([c,r])=>reels[c].firstElementChild.children[r].classList.add('sc'));
svg.innerHTML=sh;lcdResult(xr,ev.sc>=3);
if(free)FS.won+=won;
if(won){bal+=won;$('win').textContent=won;$('machine').classList.add('win-mode');
$('msg').textContent=`恭喜！${hits.length} 條連線${ev.sc>=3?'＋分散':''}${free?'（×2）':''}，贏得 ${fmt(won)} 籌碼！`;
const big=xr>=(free?30:10)&&ev.sc<3;
winFX();winVFX(xr);if(big){setTimeout(()=>bigWin(won,total),1100)}else{sfx.win(winTier(xr));if(xr>=3)rain(1.2,1)}}
else{$('msg').textContent=free?`免費次數 ${FS.n}／${FS.tot}`:LOVE_L[Math.random()*LOVE_L.length|0];if(!free)sfx.lose()}
ric(()=>{const rk=lbRecord(free?0:total,won,bet,total);if(won&&rk===0&&lbGet().wins.length>1)$('msg').textContent+=' 🏆 新紀錄！'},{timeout:2000});
ui();spinning=false;window.CZ&&CZ.onSettle({total,won,xr,free,sc:ev.sc,big:xr>=(free?30:10)&&ev.sc<3});
if(ev.sc>=3){if(FS){FS.left+=FS_N;FS.tot+=FS_N;fsUI();setTimeout(()=>fsIntro(true),900)}else{FS={left:FS_N,tot:FS_N,n:0,won:0,bet};setTimeout(()=>fsIntro(false),900)}}
else fsNext();
if(!FS)['spinBtn','minus','plus','maxBtn','resetBtn'].forEach(i=>$(i).disabled=false);
}
// ===== free spins =====
function fsUI(){document.body.classList.toggle('fs-mode',!!FS);if(FS){$('fsN').textContent=FS.n;$('fsT').textContent=FS.tot}}
let fsTimer=0;
function fsNext(){if(!FS)return;clearTimeout(fsTimer);
if(FS.left>0){fsTimer=setTimeout(function go(){if(bwState||spinning||window.__hold){fsTimer=setTimeout(go,400);return}spin()},1300);return}
const f=FS;fsTimer=setTimeout(function end(){if(bwState||spinning||window.__hold){fsTimer=setTimeout(end,400);return}
FS=null;fsUI();['spinBtn','minus','plus','maxBtn','resetBtn'].forEach(i=>$(i).disabled=false);
$('msg').textContent=`免費次數結束！共贏得 ${fmt(f.won)} 虛擬籌碼`;if(f.won>0)bigWin(f.won,f.bet*NL,{tier:['mega','免費次數結束','合計獎金'],lbl:'合計獎金'});else lcdReset()},1300)}
function fsIntro(re){const bw=$('bw');fsUI();lcdBonusFS();
bw.className='bw show epic fsi';$('bwTier').textContent='超級獎勵';$('bwJp').textContent=re?'謝謝你…♡ +10次':'機會來了!! 一直在等你';
bw.querySelector('.lbl').textContent=re?'免費次數追加':'免費次數（獎金 ×2）';$('bwAmt').textContent=(re?'+':'')+FS_N+' 回';$('bwBtn').textContent='開始！';
bwState={won:0,done:true,fin:true,intro:true};sfx.win(3);lastFlash=0;flash(.45);fountain();megaBorder(2.5);bw.classList.add('ready');setTimeout(()=>$('bwBtn').focus(),50);
if(window.__fsAuto)setTimeout(bwClose,window.__fsAuto)}
// ===== particle FX (canvas) =====
const fx=$('fx'),cx=fx.getContext('2d');let P=[],fxRun=false,DPR=1;
function fxSize(){DPR=Math.min(1.25,window.devicePixelRatio||1);fx.width=innerWidth*DPR;fx.height=innerHeight*DPR;cx.setTransform(DPR,0,0,DPR,0,0)}
requestAnimationFrame(fxSize);/* v246: first size in rAF (no forced layout mid-parse) */{let rz;addEventListener('resize',()=>{clearTimeout(rz);rz=setTimeout(fxSize,120)},{passive:true})}
document.addEventListener('visibilitychange',()=>{const h=document.hidden;document.body.classList.toggle('bg-paused',h);if(h){P.length=0;megaT=0;clearInterval(rainT);if(ac&&ac.state==='running')ac.suspend()}else if(ac&&ac.state==='suspended')ac.resume()});
const CONF=['#ff4fa3','#ffb3d6','#ffd27a','#ffffff','#ff7ec0','#e8b4ff'];
const PQ=[];const PMAX=matchMedia('(max-width:620px)').matches?90:200;function addP(o){if(PQ.length<600)PQ.push(o)}
function spr(r,draw){const c=document.createElement('canvas');c.width=c.height=r*2;draw(c.getContext('2d'),r);return c}
const SP_COIN=spr(32,(g,r)=>{const gr=g.createLinearGradient(0,0,r*2,r*2);gr.addColorStop(0,'#fff6b0');gr.addColorStop(.4,'#ffcc33');gr.addColorStop(1,'#a86400');g.fillStyle=gr;g.beginPath();g.arc(r,r,r-2,0,7);g.fill();g.lineWidth=2.5;g.strokeStyle='#7a4a00';g.stroke();g.strokeStyle='rgba(122,74,0,.6)';g.beginPath();g.arc(r,r,r*.62,0,7);g.stroke();g.fillStyle='rgba(255,255,255,.7)';g.beginPath();g.ellipse(r*.65,r*.55,r*.25,r*.14,-.6,0,7);g.fill()});
const SP_GLOW=spr(32,(g,r)=>{const gr=g.createRadialGradient(r,r,0,r,r,r);gr.addColorStop(0,'rgba(255,255,240,1)');gr.addColorStop(.25,'rgba(255,210,80,.9)');gr.addColorStop(1,'rgba(255,120,0,0)');g.fillStyle=gr;g.fillRect(0,0,r*2,r*2)});
const SP_EMB=spr(32,(g,r)=>{const gr=g.createRadialGradient(r,r,0,r,r,r);gr.addColorStop(0,'rgba(255,240,180,1)');gr.addColorStop(.4,'rgba(255,120,0,.8)');gr.addColorStop(1,'rgba(255,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,r*2,r*2)});
function coinP(x,y,sp){const a=-Math.PI/2+(Math.random()-.5)*2.2,v=sp*(.5+Math.random());
addP({k:'coin',x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,r:7+Math.random()*7,rot:Math.random()*6,vr:.15+Math.random()*.25,life:0,max:140+Math.random()*60,g:.32})}
function sparkP(x,y){const a=Math.random()*Math.PI*2,v=1+Math.random()*5;
addP({k:'spark',x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,r:1.5+Math.random()*2.5,life:0,max:40+Math.random()*30,g:.03,c:Math.random()<.5?'#fff6b0':'#ffcc33'})}
function confP(x,y,sp){const a=-Math.PI/2+(Math.random()-.5)*2.6,v=sp*(.4+Math.random());
addP({k:'conf',x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,w:6+Math.random()*6,h:3+Math.random()*4,rot:Math.random()*6,vr:(Math.random()-.5)*.4,life:0,max:180+Math.random()*80,g:.12,c:CONF[Math.random()*CONF.length|0]})}
function drawCoin(p){const sx=Math.abs(Math.cos(p.rot))*p.r+.8;cx.drawImage(SP_COIN,p.x-sx,p.y-p.r,sx*2,p.r*2)}
function drawCoinOld(p){const sx=Math.abs(Math.cos(p.rot))*p.r+.8;cx.save();cx.translate(p.x,p.y);
const gr=cx.createLinearGradient(-sx,-p.r,sx,p.r);gr.addColorStop(0,'#fff6b0');gr.addColorStop(.4,'#ffcc33');gr.addColorStop(1,'#a86400');
cx.fillStyle=gr;cx.beginPath();cx.ellipse(0,0,sx,p.r,0,0,7);cx.fill();cx.strokeStyle='#7a4a00';cx.lineWidth=1.2;cx.stroke();
if(sx>p.r*.45){cx.strokeStyle='rgba(122,74,0,.6)';cx.beginPath();cx.ellipse(0,0,sx*.62,p.r*.62,0,0,7);cx.stroke();cx.fillStyle='rgba(255,255,255,.65)';cx.beginPath();cx.ellipse(-sx*.35,-p.r*.4,sx*.22,p.r*.14,-.6,0,7);cx.fill()}
cx.restore()}
function fxLoop(){cx.clearRect(0,0,innerWidth,innerHeight);{let n=Math.min(PQ.length,28,PMAX-P.length);if(n>0)P.push(...PQ.splice(0,n))}
for(let i=P.length-1;i>=0;i--){const p=P[i];p.life++;p.vy+=p.g;p.x+=p.vx;p.y+=p.vy;
if(p.k==='conf'){p.vx*=.985;p.vy=Math.min(p.vy,2.6);p.x+=Math.sin(p.life*.1+p.rot)*.6}
if(p.rot!==undefined)p.rot+=p.vr;
if(p.life>p.max||p.y>innerHeight+40){P[i]=P[P.length-1];P.pop();continue}
const al=Math.min(1,(p.max-p.life)/25);cx.globalAlpha=al;
if(p.k==='coin')drawCoin(p);
else if(p.k==='spark'){cx.globalCompositeOperation='lighter';const s=p.r*3.2;cx.drawImage(SP_GLOW,p.x-s,p.y-s,s*2,s*2);cx.globalCompositeOperation='source-over'}
else if(p.k==='conf'){cx.save();cx.translate(p.x,p.y);cx.rotate(p.rot);cx.fillStyle=p.c;cx.fillRect(-p.w/2,-p.h/2*Math.abs(Math.cos(p.rot*1.7)),p.w,p.h*Math.abs(Math.cos(p.rot*1.7))+.5);cx.restore()}else drawExtra(p)}
cx.globalAlpha=1;let hk=false;if(!document.hidden)FXH.forEach(f=>{if(f())hk=true});if(P.length||PQ.length||hk)requestAnimationFrame(fxLoop);else{fxRun=false;cx.clearRect(0,0,innerWidth,innerHeight)}}
function fxStart(){if(!fxRun){fxRun=true;requestAnimationFrame(fxLoop)}}
function burstAt(el,n){const b=el.getBoundingClientRect(),x=b.left+b.width/2,y=b.top+b.height/2;
const k=RM?Math.ceil(n/3):n;for(let i=0;i<k;i++)sparkP(x,y);for(let i=0;i<k/3;i++)coinP(x,y,7);fxStart()}
let HITC=[],BRc=null;addEventListener('resize',()=>BRc=null,{passive:true});addEventListener('scroll',()=>BRc=null,{passive:true});function boardR(){return BRc||(BRc=$('board').getBoundingClientRect())}
function cellPts(){const b=boardR(),w=(b.width-10)/NR,h=(b.height-10)/3;return HITC.map(([c,r])=>[b.left+5+(c+.5)*w,b.top+5+(r+.5)*h])}
const WIN_PBUDGET=110;
function winFX(){const pts=cellPts().slice(0,10);if(!pts.length)return;const per=Math.max(3,Math.floor((RM?30:WIN_PBUDGET*.6)/pts.length));
pts.forEach(([x,y],i)=>setTimeout(()=>{for(let k=0;k<per;k++)sparkP(x,y);for(let k=0;k<per/3;k++)coinP(x,y,7);fxStart()},i*28))}
let rainT=null;
function rain(sec,dens){clearInterval(rainT);const end=performance.now()+sec*1000;
rainT=setInterval(()=>{if(performance.now()>end){clearInterval(rainT);return}
const nn=RM?1:Math.max(1,Math.round(dens*Math.min(1,innerWidth/700)));for(let i=0;i<nn;i++){addP({k:'coin',x:Math.random()*innerWidth,y:-20,vx:(Math.random()-.5)*1.5,vy:2+Math.random()*3,r:8+Math.random()*8,rot:Math.random()*6,vr:.15+Math.random()*.2,life:0,max:400,g:.18})}
fxStart()},60)}
function fountain(){const x=innerWidth/2,y=innerHeight*.95;for(let i=0;i<(RM?12:36);i++){coinP(x,y,14);confP(x,y,13)}fxStart()}
// ===== v11 VFX extras =====
const FXH=[];let fxHold=0;
document.querySelectorAll('.lights i').forEach((e,i)=>e.style.setProperty('--i',i));
{const lt=document.querySelector('.lights');if(lt&&lt.children.length<16)for(let i=lt.children.length;i<16;i++){const e=document.createElement('i');e.style.setProperty('--i',i);lt.appendChild(e)}}
{const bd=$('board'),sw=document.createElement('div');sw.className='sweep';bd.appendChild(sw);
if(false){const a=document.createElement('div');a.className='amb';a.setAttribute('aria-hidden','true');for(let i=0;i<12;i++){const b=document.createElement('b');b.style.left=(Math.random()*95)+'%';b.style.top=(20+Math.random()*75)+'%';b.style.animationDelay=(-Math.random()*6)+'s';b.style.animationDuration=(4+Math.random()*4)+'s';a.appendChild(b)}bd.appendChild(a)}
const f=document.createElement('div');f.id='flash';f.setAttribute('aria-hidden','true');document.body.appendChild(f)}
let lastFlash=0;function flash(o){if(RM)return;const nw=performance.now();if(nw-lastFlash<360)return;lastFlash=nw;const f=$('flash');f.style.setProperty('--fo',o);f.classList.remove('go');rAF2(()=>f.classList.add('go'))}
function sweep(){const s=document.querySelector('.board .sweep');s.classList.remove('go');rAF2(()=>s.classList.add('go'))}
function shake(l){const m=$('machine');m.classList.remove('sh1','sh2','sh3','sh4','shake');if(RM||!l)return;rAF2(()=>m.classList.add('sh'+l));setTimeout(()=>m.classList.remove('sh'+l),1300)}
function starP(x,y,sp=6){const a=Math.random()*Math.PI*2,v=sp*(.3+Math.random());addP({k:'star',x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-2,r:4+Math.random()*6,rot:Math.random()*6,vr:(Math.random()-.5)*.3,life:0,max:70+Math.random()*40,g:.08,c:Math.random()<.35?'#ffd27a':(Math.random()<.5?'#ff6fb5':'#ffb3d6')})}
function twinkP(x,y){addP({k:'twink',x:x+(Math.random()-.5)*60,y:y+(Math.random()-.5)*60,vx:0,vy:-.3,r:6+Math.random()*8,life:0,max:30+Math.random()*20,g:0})}
function puffP(x,y){for(let i=0;i<(RM?2:7);i++){const a=Math.PI+Math.random()*Math.PI,v=1+Math.random()*2.5;addP({k:'puff',x:x+(Math.random()-.5)*40,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v*.5,r:6+Math.random()*6,life:0,max:30+Math.random()*15,g:-.02})}}
function emberP(){addP({k:'ember',x:Math.random()*innerWidth,y:innerHeight+5,vx:(Math.random()-.5)*1.2,vy:-(3+Math.random()*4),r:2+Math.random()*4,life:0,max:90+Math.random()*60,g:-.02})}
function drawStar(p){cx.save();cx.translate(p.x,p.y);cx.rotate(p.rot*.3);const r=p.r;cx.fillStyle=p.c;cx.beginPath();cx.moveTo(0,r*.35);cx.bezierCurveTo(0,0,-r,0,-r,r*.35);cx.bezierCurveTo(-r,r*.85,0,r*1.05,0,r*1.4);cx.bezierCurveTo(0,r*1.05,r,r*.85,r,r*.35);cx.bezierCurveTo(r,0,0,0,0,r*.35);cx.fill();cx.restore()}
function drawExtra(p){const u=p.life/p.max;
if(p.k==='star')drawStar(p);
else if(p.k==='twink'){const s=p.r*Math.sin(Math.PI*u);cx.save();cx.globalCompositeOperation='lighter';cx.translate(p.x,p.y);cx.fillStyle='#fffbe0';
cx.beginPath();cx.moveTo(0,-s);cx.lineTo(s*.18,0);cx.lineTo(0,s);cx.lineTo(-s*.18,0);cx.closePath();cx.moveTo(-s,0);cx.lineTo(0,s*.18);cx.lineTo(s,0);cx.lineTo(0,-s*.18);cx.fill();cx.restore()}
else if(p.k==='puff'){}
else if(p.k==='ember'){cx.globalCompositeOperation='lighter';const s=p.r*3;cx.drawImage(SP_EMB,p.x-s,p.y-s,s*2,s*2);cx.globalCompositeOperation='source-over'}}
let megaT=0;
function bolt(x1,y1,x2,y2,dsp){const pts=[[x1,y1]];const n=10;for(let i=1;i<n;i++){const t=i/n;pts.push([x1+(x2-x1)*t+(Math.random()-.5)*dsp,y1+(y2-y1)*t+(Math.random()-.5)*dsp])}pts.push([x2,y2]);
cx.save();cx.globalCompositeOperation='lighter';const rgb=(typeof getComputedStyle==='function'&&(getComputedStyle(document.documentElement).getPropertyValue('--fx-glow').trim()||getComputedStyle(document.body).getPropertyValue('--fx-glow').trim()))||'255,176,48';cx.strokeStyle='rgba('+rgb+',.4)';cx.lineWidth=9;cx.beginPath();pts.forEach((p,i)=>i?cx.lineTo(p[0],p[1]):cx.moveTo(p[0],p[1]));cx.stroke();cx.strokeStyle='rgba('+rgb+',.95)';cx.lineWidth=3;cx.beginPath();pts.forEach((p,i)=>i?cx.lineTo(p[0],p[1]):cx.moveTo(p[0],p[1]));cx.stroke();cx.strokeStyle='#fff6d2';cx.lineWidth=1.2;cx.stroke();cx.restore()}
FXH.push(()=>{if(performance.now()<megaT){if(Math.random()<.5)emberP();if(Math.random()<.18){const W=innerWidth,H=innerHeight,e=Math.random()*4|0,d=Math.min(W,H)*.08;
if(e===0)bolt(Math.random()*W,0,Math.random()*W,d*1.5,d);else if(e===1)bolt(Math.random()*W,H,Math.random()*W,H-d*1.5,d);else if(e===2)bolt(0,Math.random()*H,d*1.5,Math.random()*H,d);else bolt(W,Math.random()*H,W-d*1.5,Math.random()*H,d)}return true}return false});
function megaBorder(sec){if(RM)return;megaT=performance.now()+sec*1000;fxStart()}
function landFX(c){const B=boardR(),w=(B.width-10)/NR,r={left:B.left+5+c*w,width:w,bottom:B.bottom-5};puffP(r.left+r.width/2,r.bottom-6);if(!RM)for(let i=0;i<4;i++)sparkP(r.left+Math.random()*r.width,r.bottom-4);fxStart()}
function winTier(x){return x>=80?4:x>=30?3:x>=10?2:x>=2?1:0}
function winVFX(x){const t=winTier(x);flash([.12,.2,.3,.4,.5][t]);sweep();shake([1,1,2,3,4][t]);
const pts=cellPts().slice(0,10);const per=Math.max(1,Math.floor((RM?10:WIN_PBUDGET*.4)/Math.max(1,pts.length)/2));pts.forEach(([x,y],i)=>setTimeout(()=>{for(let k=0;k<per;k++){starP(x,y);twinkP(x,y)}fxStart()},40+i*28))}
// ===== big-win celebration =====
let bwState=null;
const NF=new Intl.NumberFormat('zh-TW');const fmt=n=>NF.format(n);
function bigWin(won,total,o={}){const bw=$('bw'),x=won/total;$('bwBtn').textContent='收下籌碼';bw.querySelector('.lbl').textContent=o.lbl||'大獎・贏得虛擬籌碼';
const tier=o.tier||(x>=80?['epic','傳說大獎','氣勢全開!! 巨額大獎']:x>=30?['mega','超級大獎','大獎預感!! 超級大獎']:['big','大獎','大獎降臨!!']);
bw.className='bw show '+tier[0];$('bwTier').textContent=tier[1];$('bwTier').dataset.t=tier[1];$('bwJp').textContent=tier[2];$('bwAmt').textContent='0';
$('machine').classList.remove('shake');
const dur=RM?600:Math.min(6500,2200+x*45),t0=performance.now();let last=0,lastTick=0,lastTxt=0,bumpT=0;const aEl=$('bwAmt');
bwState={won,done:false};sfx.win(winTier(x));if(tier[0]==='epic')megaBorder(dur/1000+2);fountain();rain(dur/1000+1.5,tier[0]==='big'?2:4);
const fan=setInterval(()=>{if(!bwState||bwState.done){clearInterval(fan);return}fountain()},1400);
(function step(now){if(!bwState)return;const u=Math.min(1,(now-t0)/dur),v=bwState.done?won:Math.floor(won*(1-Math.pow(1-u,2.2)));
if(v!==last&&now-lastTxt>=48){aEl.textContent=fmt(v);last=v;lastTxt=now;if(now-lastTick>90){lastTick=now;sfx.coin(u);bumpT=now}}
{const k=Math.max(0,1-(now-bumpT)/120);aEl.style.transform=RM?'':`scale(${(1+.06*k).toFixed(3)})`}
if(u>=1||bwState.done){bwFinish();return}requestAnimationFrame(step)})(t0);
setTimeout(()=>$('bwBtn').focus(),50)}
function bwFinish(){if(!bwState||bwState.fin)return;bwState.done=bwState.fin=true;$('bwAmt').textContent=fmt(bwState.won);$('bw').classList.add('ready');
$('bwAmt').style.transform='';sfx.collect();lastFlash=0;flash(.4);for(let i=0;i<(RM?6:24);i++)starP(innerWidth/2,innerHeight/2,9);fxStart()}
function bwClose(){if(!bwState)return;if(!bwState.fin){bwFinish();return}
const wasIntro=bwState.intro;bwState=null;$('bw').className='bw';clearInterval(rainT);if(!FS)lcdReset();$('spinBtn').focus();if(FS)fsNext()}
$('bw').addEventListener('click',bwClose);
$('spinBtn').onclick=spin;
$('minus').onclick=()=>{if(betIdx>0)betIdx--;sfx.blip(false);ui()};
$('plus').onclick=()=>{if(betIdx<BETS.length-1)betIdx++;sfx.blip(true);ui()};
$('maxBtn').onclick=()=>{let i=BETS.length-1;while(i>0&&BETS[i]*NL>bal)i--;betIdx=i;sfx.click();ui()};
$('soundBtn').onclick=()=>{sound=!sound;localStorage.setItem('fs_sound',sound?'1':'0');ui();if(sound)aInit();aVol();musSync();sfx.click()};
$('resetBtn').__doReset=()=>{bal=1000;ui();clearWin();$('win').textContent=0;$('msg').textContent='籌碼已重置為 1000'};$('resetBtn').onclick=()=>{const f=$('resetBtn').__doReset;if(window.czChipDlg)czChipDlg('reset',f);else if(confirm('確定要將籌碼重置為 1000 嗎？'))f()};
$('payBtn').onclick=()=>{sfx.click();$('pay').showModal()};
document.addEventListener('keydown',e=>{if(bwState&&(e.code==='Space'||e.code==='Enter'||e.code==='Escape')){e.preventDefault();bwClose();return}if(document.querySelector('dialog[open]')||bwState)return;const tg=e.target.tagName;if(tg==='INPUT'||tg==='TEXTAREA')return;
if(e.code==='Space'){if(tg==='BUTTON'&&e.target.id!=='spinBtn')return;e.preventDefault();spin()}
else if(!spinning&&(e.key==='+'||e.key==='='||e.code==='NumpadAdd'))$('plus').click();
else if(!spinning&&(e.key==='-'||e.code==='NumpadSubtract'))$('minus').click();
else if((e.key==='m'||e.key==='M')&&!e.ctrlKey&&!e.metaKey)$('soundBtn').click()});
const pt=$('payTable');[...SYM].reverse().forEach(s=>pt.insertAdjacentHTML('beforeend',s.id==='scatter'?`<tr class="payfs"><td class="pname">${symHTML(s.id,'width="34" height="34"')} 分散</td><td>總押注×6</td><td>×25</td><td>×125</td></tr><tr class="payfs"><td colspan="4">3 個以上（任意位置）＝ 10 次免費旋轉・獎金 ×2</td></tr>`:`<tr><td class="pname">${symHTML(s.id,'width="34" height="34"')} ${s.name}</td><td>×${s.pay[0]}</td><td>×${s.pay[1]}</td><td>×${s.pay[2]}</td></tr>`));
render();ui();
// ---- Daily check-in (play-money only) ----
const DAILY=[100,150,200,300,400,500,1000];
const dkey=d=>d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
function dState(){let st;try{st=JSON.parse(localStorage.getItem('fs_daily')||'{}')}catch(e){st={}}
const today=new Date(),y=new Date(today);y.setDate(y.getDate()-1);
const claimed=st.last===dkey(today);let streak=st.streak||0;
if(!claimed&&st.last!==dkey(y))streak=0; // missed a day: reset
if(!claimed&&streak>=7)streak=0; // completed a cycle
return {claimed,streak,idx:claimed?streak-1:streak}}
function dRender(){const d=dState();$('days').innerHTML=DAILY.map((v,i)=>{const got=i<d.streak,today=!d.claimed&&i===d.streak;
return `<li class="day${got?' got':''}${today?' today':''}" aria-label="第 ${i+1} 天 ${v} 籌碼${got?'，已領取':today?'，今日可領':''}"><div class="dn">第 ${i+1} 天</div><div class="coin">$</div><b>+${v}</b></li>`}).join('');
$('dClaim').disabled=d.claimed;$('dClaim').textContent=d.claimed?'今日已簽到':'立即簽到 +'+DAILY[d.streak];
$('dSub').textContent=d.claimed?`已連續簽到 ${d.streak} 天，明天再來喔！`:`目前連續 ${d.streak} 天・今天可領 ${DAILY[d.streak]} 虛擬籌碼`;
$('dailyBtn').classList.toggle('dot',!d.claimed)}
function dClaim(){const d=dState();if(d.claimed)return;const v=DAILY[d.streak],n=d.streak+1;
localStorage.setItem('fs_daily',JSON.stringify({last:dkey(new Date()),streak:n}));bal+=v;ui();
sfx.chime();
const b=$('dClaim').getBoundingClientRect();for(let i=0;i<(RM?12:40);i++){coinP(b.left+b.width/2,b.top,11);if(i%2)sparkP(b.left+b.width/2,b.top)}fxStart();
$('msg').textContent=`簽到成功！獲得 ${v} 虛擬籌碼（連續 ${n} 天）`;dRender()}
$('dailyBtn').onclick=()=>{sfx.click();dRender();$('daily').showModal()};
$('dClaim').onclick=dClaim;$('dClose').onclick=()=>$('daily').close();
dRender();if(!dState().claimed&&!window.__noDaily)setTimeout(()=>{if(!document.querySelector('dialog[open]')&&!bwState)$('daily').showModal()},600);
// ---- Local leaderboard (play-money only, this device) ----
function lbGet(){let st;try{st=JSON.parse(localStorage.getItem('fs_stats')||'{}')}catch(e){st={}}
if(st.v!==13){st={name:typeof st.name==='string'?st.name:'玩家',v:13}} // v13: 5x3 / 20 lines; old 3x3 records are not comparable
return Object.assign({name:'玩家',spins:0,bet:0,won:0,peak:bal,big:0,streakBest:0,wins:[]},st)}
function lbSave(st){st.v=13;localStorage.setItem('fs_stats',JSON.stringify(st))}
let lbTab='top',lbNew=-1;
const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fdate=t=>{const d=new Date(t);return `${d.getMonth()+1}/${d.getDate()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`};
function lbRecord(total,won,bet,tb){tb=tb||total||bet*NL;const st=lbGet();st.spins++;st.bet+=total;st.won+=won;if(bal>st.peak)st.peak=bal;
let rank=-1;if(won>0){if(won>=tb*10)st.big++;const e={a:won,x:Math.round(won/tb*10)/10,b:bet,t:Date.now(),n:st.name};
st.wins.push(e);st.wins.sort((p,q)=>q.a-p.a||p.t-q.t);st.wins=st.wins.slice(0,10);rank=st.wins.indexOf(e)}
lbSave(st);lbNew=rank;return rank}
function lbRender(){const st=lbGet(),P=$('lbPanel');$('tabTop').setAttribute('aria-selected',lbTab==='top');$('tabMe').setAttribute('aria-selected',lbTab==='me');
if(lbTab==='top'){P.innerHTML=st.wins.length?'<ol class="lbl-list">'+st.wins.map((w,i)=>`<li class="r${i+1}${i===lbNew?' new':''}"><span class="rk">${i+1}</span><span class="who">${esc(w.n||st.name)}<small>${fdate(w.t)}・每線 ${w.b}・總押注×${w.x}</small></span><span class="amt2">${fmt(w.a)}</span></li>`).join('')+'</ol>':'<div class="empty">還沒有中獎紀錄，快去轉一把！</div>'}
else{const rtp=st.bet?Math.round(st.won/st.bet*100):0;
P.innerHTML=`<div class="stats"><div><small>總旋轉次數</small><b>${fmt(st.spins)}</b></div><div><small>最高籌碼</small><b>${fmt(Math.max(st.peak,bal))}</b></div><div><small>單次最大獎</small><b>${fmt(st.wins[0]?.a||0)}</b></div><div><small>大獎次數</small><b>${fmt(st.big)}</b></div><div><small>累計押注</small><b>${fmt(st.bet)}</b></div><div><small>累計贏得</small><b>${fmt(st.won)}</b></div><div style="grid-column:span 2"><small>回收率（贏得 ÷ 押注）</small><b>${rtp}%</b></div></div>`}}
$('lbBtn').onclick=()=>{sfx.click();const st=lbGet();$('lbName').value=st.name;lbRender();$('lb').showModal()};
$('lbName').onchange=()=>{const st=lbGet(),v=$('lbName').value.trim().slice(0,12)||'玩家';st.name=v;st.wins.forEach(w=>w.n=v);lbSave(st);$('lbName').value=v;lbRender()};
$('tabTop').onclick=()=>{lbTab='top';sfx.click();lbRender()};$('tabMe').onclick=()=>{lbTab='me';sfx.click();lbRender()};
$('lbReset').onclick=()=>{const f=()=>{const n=lbGet().name;lbSave({name:n,peak:bal});lbNew=-1;lbRender()};if(window.czChipDlg)czChipDlg('lbclear',f);else if(confirm('確定清除本機排行榜與統計嗎？'))f()};
$('lbClose').onclick=()=>$('lb').close();
// ---- Rewarded "watch ad" placeholder (no real ad network; play-money only) ----
const AD_REWARD=200,AD_MAX=5,AD_SEC=window.__adSec||15;
function adGet(){let st;try{st=JSON.parse(localStorage.getItem('fs_ad')||'{}')}catch(e){st={}}return st.d===dkey(new Date())?st:{d:dkey(new Date()),n:0}}
const adLeft=()=>AD_MAX-adGet().n;
let adT=null,adState='idle';
function adRender(){const left=adLeft(),n=AD_MAX-left;
$('adPips').innerHTML=Array.from({length:AD_MAX},(_,i)=>`<i class="${i<n?'on':''}"></i>`).join('');
$('adPips').setAttribute('aria-label',`今日已觀看 ${n} / ${AD_MAX} 次`);
$('adBtn').classList.toggle('dot',left>0&&bal<BETS[0]*NL);$('adBtn').disabled=false;
if(adState==='idle'){$('adScreen').classList.remove('done');$('adRing').style.strokeDashoffset=201;$('adCount').textContent=AD_SEC;
$('adPh').textContent=left>0?'準備播放…':'今日次數已用完，明天再來！';
$('adGo').textContent=left>0?'開始觀看':'今日已達上限';$('adGo').disabled=left<=0;
$('adSub').textContent=`看完 ${AD_SEC} 秒示意廣告，即可領取 ${AD_REWARD} 虛擬籌碼（今日剩 ${left} 次）`}}
function adStop(){clearInterval(adT);adT=null;adState='idle'}
function adStart(){if(adLeft()<=0||adState!=='idle')return;adState='play';sfx.click();
const t0=performance.now();$('adGo').disabled=true;$('adGo').textContent='播放中…';$('adPh').textContent='示意廣告播放中…';
adT=setInterval(()=>{const e=(performance.now()-t0)/1000,r=Math.max(0,AD_SEC-e);
$('adCount').textContent=Math.ceil(r);$('adRing').style.strokeDashoffset=201*(r/AD_SEC);
if(r<=0){clearInterval(adT);adT=null;adState='done';$('adScreen').classList.add('done');$('adCount').textContent='✓';
$('adPh').textContent='觀看完成！';$('adGo').disabled=false;$('adGo').textContent='領取 +'+AD_REWARD;tone(880,.15,'triangle',.07)}},100)}
function adClaim(){if(adState!=='done')return;const st=adGet();st.n++;localStorage.setItem('fs_ad',JSON.stringify(st));
bal+=AD_REWARD;ui();adState='idle';
sfx.ad();
const b=$('adGo').getBoundingClientRect();for(let i=0;i<(RM?12:36);i++){coinP(b.left+b.width/2,b.top,11);if(i%2)sparkP(b.left+b.width/2,b.top)}fxStart();
$('msg').textContent=`獲得 ${AD_REWARD} 虛擬籌碼！（今日剩 ${adLeft()} 次）`;adRender()}
$('adGo').onclick=()=>adState==='done'?adClaim():adStart();
$('adBtn').onclick=()=>{sfx.click();adRender();$('ad').showModal()};
$('adClose').onclick=()=>$('ad').close();
$('ad').addEventListener('close',()=>{if(adState==='play'){adStop();$('msg').textContent='廣告未看完，未發放籌碼'}adRender()});
const _ui=ui;ui=function(){_ui();if(typeof adRender==='function'&&$('adPips'))adRender()};
adRender();
// ---- Invite code placeholder (local only, no server; chips never transfer between players) ----
const INV_REWARD=300,INV_AL='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function invGet(){let st;try{st=JSON.parse(localStorage.getItem('fs_inv')||'{}')}catch(e){st={}}
if(!/^FS-[A-Z2-9]{6}$/.test(st.code||'')){let c='';const r=new Uint32Array(6);(crypto.getRandomValues?crypto.getRandomValues(r):r.forEach((_,i)=>r[i]=Math.random()*1e9));r.forEach(v=>c+=INV_AL[v%INV_AL.length]);st.code='FS-'+c;localStorage.setItem('fs_inv',JSON.stringify(st))}
return st}
function invMsg(t,k){const m=$('invMsg');m.textContent=t;m.className='invmsg'+(k?' '+k:'')}
function invRender(){const st=invGet();$('invCode').textContent=st.code;
const used=!!st.used;$('invInput').disabled=used;$('invRedeem').disabled=used;$('invRedeem').textContent=used?'已兌換':'兌換';
if(used){$('invInput').value=st.used;invMsg(`已使用好友邀請碼 ${st.used}，獲得 ${INV_REWARD} 虛擬籌碼`,'ok')}
$('invBtn').classList.toggle('dot',!used)}
function invNorm(v){v=v.toUpperCase().replace(/[^A-Z0-9]/g,'');if(v.startsWith('FS'))v=v.slice(2);return v?'FS-'+v.slice(0,6):''}
function invRedeem(){const st=invGet();if(st.used)return;const c=invNorm($('invInput').value);$('invInput').value=c;
const bad=t=>{$('invInput').setAttribute('aria-invalid','true');invMsg(t,'err');tone(200,.15,'square',.05)};
if(!/^FS-[A-Z0-9]{6}$/.test(c))return bad('邀請碼格式不正確（例：FS-AB23CD）');
if(c===st.code)return bad('不能輸入自己的邀請碼喔');
$('invInput').removeAttribute('aria-invalid');st.used=c;localStorage.setItem('fs_inv',JSON.stringify(st));bal+=INV_REWARD;ui();
[587,740,880,1175].forEach((f,i)=>tone(f,.22,'triangle',.08,i*.08));
const b=$('invRedeem').getBoundingClientRect();for(let i=0;i<(RM?12:36);i++){coinP(b.left+b.width/2,b.top,11);if(i%2)sparkP(b.left+b.width/2,b.top)}fxStart();
$('msg').textContent=`邀請碼兌換成功！獲得 ${INV_REWARD} 虛擬籌碼`;invRender()}
async function invCopy(){const c=invGet().code;let ok=false;try{await navigator.clipboard.writeText(c);ok=true}catch(e){}
if(!ok){const r=document.createRange();r.selectNodeContents($('invCode'));const se=getSelection();se.removeAllRanges();se.addRange(r);try{ok=document.execCommand('copy')}catch(e){}}
invMsg(ok?'已複製邀請碼 '+c:'請長按邀請碼手動複製',ok?'ok':'err');sfx.click()}
async function invShare(){const c=invGet().code,t=`來玩龍運金殿！輸入我的邀請碼 ${c} 可領 ${INV_REWARD} 虛擬籌碼（僅供娛樂・虛擬籌碼・純虛擬・無兌現）`;
if(navigator.share){try{await navigator.share({title:'龍運金殿',text:t});return}catch(e){if(e.name==='AbortError')return}}
try{await navigator.clipboard.writeText(t);invMsg('已複製分享文字','ok')}catch(e){invMsg('目前裝置不支援分享，請複製邀請碼','err')}}
$('invBtn').onclick=()=>{sfx.click();invMsg('');invRender();$('inv').showModal()};
$('invRedeem').onclick=invRedeem;$('invInput').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();invRedeem()}});
$('invInput').addEventListener('input',()=>{$('invInput').removeAttribute('aria-invalid');if(!invGet().used)invMsg('')});
$('invCopy').onclick=invCopy;$('invShare').onclick=invShare;$('invClose').onclick=()=>$('inv').close();
invRender();
// ---- Cosmetic skins shop (virtual chips only; no real-money purchase; cosmetic only) ----
const SKINS=[
{id:'gold',name:'金殿',desc:'預設・夜粉金',price:0,fr:'linear-gradient(135deg,#fff0c2,#d9a441 25%,#7a5418 50%,#fff0c2 60%,#d9a441)',in:'radial-gradient(ellipse at 50% 110%,#ff4fa3aa,#0c0618 70%)',sym:'love'},
{id:'neon',name:'真夜中',desc:'深藍月光',price:2000,fr:'linear-gradient(135deg,#fff0c2,#d9a441 25%,#7a5418 50%,#fff0c2 60%,#d9a441)',in:'radial-gradient(ellipse at 50% 110%,#6fa8ffaa,#0c0618 70%)',sym:'ring'},
{id:'jade',name:'櫻色',desc:'櫻花粉',price:3000,fr:'linear-gradient(135deg,#fff0c2,#d9a441 25%,#7a5418 50%,#fff0c2 60%,#d9a441)',in:'radial-gradient(ellipse at 50% 110%,#ff9cc8aa,#0c0618 70%)',sym:'rose'},
{id:'crystal',name:'月光',desc:'銀白冷光',price:5000,fr:'linear-gradient(135deg,#fff0c2,#d9a441 25%,#7a5418 50%,#fff0c2 60%,#d9a441)',in:'radial-gradient(ellipse at 50% 110%,#9fd8ffaa,#0c0618 70%)',sym:'perfume'},
{id:'royal',name:'小堇',desc:'紫羅蘭',price:8000,fr:'linear-gradient(135deg,#fff0c2,#d9a441 25%,#7a5418 50%,#fff0c2 60%,#d9a441)',in:'radial-gradient(ellipse at 50% 110%,#c07cffaa,#0c0618 70%)',sym:'ribbon'},
{id:'obsidian',name:'夕陽',desc:'夕陽橘金',price:12000,fr:'linear-gradient(135deg,#fff0c2,#d9a441 25%,#7a5418 50%,#fff0c2 60%,#d9a441)',in:'radial-gradient(ellipse at 50% 110%,#ff8a4aaa,#0c0618 70%)',sym:'letter'},
{id:'blossom',name:'櫻花之舞',desc:'櫻社狐燈',price:15000,fr:'linear-gradient(135deg,#fff0c2,#d9a441 25%,#7a5418 50%,#fff0c2 60%,#d9a441)',in:'radial-gradient(ellipse at 50% 110%,#ff9cc8aa,#0c0618 70%)',sym:'rose'},
{id:'beach',name:'夏日海灘',desc:'棕櫚浪花',price:15000,fr:'linear-gradient(135deg,#fff0c2,#d9a441 25%,#7a5418 50%,#fff0c2 60%,#d9a441)',in:'radial-gradient(ellipse at 50% 110%,#4fd0eaaa,#0c0618 70%)',sym:'love'},
{id:'tsukiyo',name:'月下幻境',desc:'紫藤滿月',price:20000,fr:'linear-gradient(135deg,#fff0c2,#d9a441 25%,#7a5418 50%,#fff0c2 60%,#d9a441)',in:'radial-gradient(ellipse at 50% 110%,#b48cffaa,#0c0618 70%)',sym:'perfume'},
{id:'kitsune',name:'狐之祕境',desc:'白繩狐面',price:25000,fr:'linear-gradient(135deg,#fff0c2,#d9a441 25%,#7a5418 50%,#fff0c2 60%,#d9a441)',in:'radial-gradient(ellipse at 50% 110%,#ffd0c0aa,#0c0618 70%)',sym:'letter'},
{id:'kabuto',name:'武將之魂',desc:'甲胄刀旗',price:30000,fr:'linear-gradient(135deg,#fff0c2,#d9a441 25%,#7a5418 50%,#fff0c2 60%,#d9a441)',in:'radial-gradient(ellipse at 50% 110%,#e05030aa,#0c0618 70%)',sym:'ribbon'},
{id:'feast',name:'皇宮盛宴',desc:'雙龍金殿',price:50000,fr:'linear-gradient(135deg,#fff0c2,#d9a441 25%,#7a5418 50%,#fff0c2 60%,#d9a441)',in:'radial-gradient(ellipse at 50% 110%,#ffd36aaa,#0c0618 70%)',sym:'love'}];
let shConfirm=null;
function skGet(){let st;try{st=JSON.parse(localStorage.getItem('fs_skin')||'{}')}catch(e){st={}}
if(!Array.isArray(st.own))st.own=[];if(!st.own.includes('gold'))st.own.unshift('gold');
st.own=st.own.filter(id=>SKINS.some(k=>k.id===id));if(!st.own.includes(st.eq))st.eq='gold';return st}
function skSave(st){localStorage.setItem('fs_skin',JSON.stringify(st))}
function skApply(){const st=skGet();if(st.eq==='gold')delete document.body.dataset.skin;else document.body.dataset.skin=st.eq}
function shMsg(t,k){const m=$('shMsg');m.textContent=t;m.className='shmsg'+(k?' '+k:'')}
function shRender(){const st=skGet();$('shBal').textContent=fmt(bal);
$('skins').innerHTML=SKINS.map(k=>{const own=st.own.includes(k.id),eq=st.eq===k.id;let btn;
if(eq)btn=`<button disabled>使用中</button>`;
else if(own)btn=`<button class="use" data-act="use" data-id="${k.id}">套用</button>`;
else if(shConfirm===k.id)btn=`<button class="cf" data-act="buy" data-id="${k.id}">確認兌換？</button>`;
else btn=`<button class="buy" data-act="ask" data-id="${k.id}" ${bal<k.price?'aria-disabled="true"':''} aria-label="以 ${fmt(k.price)} 虛擬籌碼兌換${k.name}"><span class="coin" aria-hidden="true"></span>${fmt(k.price)}</button>`;
return `<li class="skin${eq?' eq':''}">${eq?'<span class="eqtag">使用中</span>':''}<div class="pv" style="background:${k.fr}" aria-hidden="true"><div style="background:${k.in}"><i>${icon(k.sym)}</i><i>${icon('heroine')}</i><i>${icon(k.sym)}</i></div></div><b>${k.name}</b><small>${own&&!eq?'已擁有':k.desc}</small>${btn}</li>`}).join('')}
function shAct(e){const b=e.target.closest('button[data-act]');if(!b)return;const k=SKINS.find(x=>x.id===b.dataset.id);if(!k)return;const st=skGet();
if(b.dataset.act==='use'){st.eq=k.id;skSave(st);skApply();shConfirm=null;sfx.click();shMsg(`已套用「${k.name}」`,'ok');shRender();return}
if(b.dataset.act==='ask'){if(spinning){shMsg('請等待本次旋轉結束','err');return}
if(bal<k.price){shMsg(`虛擬籌碼不足，還差 ${fmt(k.price-bal)}（可透過遊戲、每日簽到或看廣告取得）`,'err');tone(200,.15,'square',.05);return}
shConfirm=k.id;sfx.click();shMsg(`再按一次確認，以 ${fmt(k.price)} 虛擬籌碼兌換「${k.name}」`);shRender();$('skins').querySelector('.cf')?.focus();return}
if(b.dataset.act==='buy'){if(spinning||bal<k.price||st.own.includes(k.id)){shConfirm=null;shRender();return}
bal-=k.price;st.own.push(k.id);st.eq=k.id;skSave(st);ui();skApply();shConfirm=null;
sfx.buy();
const r=b.getBoundingClientRect();for(let i=0;i<(RM?10:30);i++){sparkP(r.left+r.width/2,r.top);if(i%3===0)confP(r.left+r.width/2,r.top,9)}fxStart();
shMsg(`兌換成功！已套用「${k.name}」`,'ok');$('msg').textContent=`已換上「${k.name}」機台外觀！`;shRender()}}
$('skins').addEventListener('click',shAct);
$('shopBtn').onclick=()=>{sfx.click();shConfirm=null;shMsg('');shRender();$('shop').showModal()};
$('shClose').onclick=()=>$('shop').close();
$('shop').addEventListener('close',()=>{shConfirm=null;$('shopBtn').classList.toggle('dot',SKINS.some(k=>!skGet().own.includes(k.id)&&bal>=k.price))});
{const _u=ui;ui=function(){_u();if($('shopBtn'))$('shopBtn').classList.toggle('dot',SKINS.some(k=>!skGet().own.includes(k.id)&&bal>=k.price))}}
skApply();ui();
{const mb=$('musBtn'),mr=()=>{mb.textContent=AS.music?'🎵 音樂：開':'🎵 音樂：關';mb.setAttribute('aria-pressed',AS.music)};mr();$('mvol').value=AS.mv;$('svol').value=AS.sv;
mb.onclick=()=>{AS.music=!AS.music;localStorage.setItem('fs_music',AS.music?'1':'0');mr();aInit();aVol();musSync();sfx.click()};
$('mvol').oninput=e=>{AS.mv=+e.target.value;localStorage.setItem('fs_mv',AS.mv);aVol()};
$('svol').oninput=e=>{AS.sv=+e.target.value;localStorage.setItem('fs_sv',AS.sv);aVol()};
$('svol').onchange=()=>sfx.click();}
// ===== v12 LCD 演出 (pachislot-style presentation; cosmetic only, outcome already decided) =====
const KITAI=[['#3a8bff','期待度 青'],['#19e08a','期待度 綠'],['#ff2240','期待度 赤'],['#ffc400','期待度 金'],['#fff','期待度 虹']];
let lcdT=[];const lcd=$('lcd'),slamEl=$('slam');
function lcdClear(){lcdT.forEach(clearTimeout);lcdT=[]}
function lcdLater(f,ms){lcdT.push(setTimeout(f,ms))}
function slam(t,k,sub){slamEl.style.setProperty('--k',k||'#ff2240');slamEl.innerHTML=t+(sub?`<small>${sub}</small>`:'');slamEl.classList.remove('go');requestAnimationFrame(()=>requestAnimationFrame(()=>slamEl.classList.add('go')))}
function setKitai(i){const k=$('kitai');if(i<0){k.classList.remove('on');return}k.style.setProperty('--k',KITAI[i][0]);$('kitaiT').textContent=KITAI[i][1];k.classList.toggle('rainbow',i===4);k.classList.add('on')}
function lcdReset(){lcdClear();lcd.classList.remove('reach','bonus');slamEl.classList.remove('go');setKitai(-1);$('lcdIdle').style.opacity=1;$('lcdNavi').textContent='PUSH';$('spinBtn').classList.remove('push')}
function lcdSpin(x,tease,bon){lcdReset();$('lcdIdle').style.opacity=.25;$('lcdNavi').textContent='旋轉中…';
let k=-1;const r=Math.random();
if(bon||x>=80)k=r<.5?4:3;else if(x>=10)k=r<.6?3:2;else if(x>=3)k=r<.7?2:1;else if(x>0)k=r<.5?1:(r<.8?0:-1);else if(tease)k=r<.6?1:2;else k=r<.22?0:(r<.27?1:-1);
lcd._k=k;if(k>=0)lcdLater(()=>{setKitai(k);if(k>=2)slam(k>=3?'大獎預感!!':'機會!','#ff4fa3')},350)}
function lcdReach(){lcd.classList.add('reach');$('lcdIdle').style.opacity=0;$('lcdNavi').textContent='大獎機會演出中';$('spinBtn').classList.add('push');const k=Math.max(1,lcd._k|0);slam('機會!!','#ff4fa3','心跳…♡');sfx.blip&&sfx.blip(true)}
function lcdBonusFS(){lcdClear();lcd.classList.add('bonus');$('lcdIdle').style.opacity=0;$('lcdNavi').textContent='免費次數 開始!!';slam('超級獎勵','#ff4fa3','免費次數 ×10');lcdLater(()=>lcd.classList.remove('bonus'),2200)}
function lcdResult(x,bon){$('spinBtn').classList.remove('push');lcd.classList.remove('reach');if(bon)return;
if(x>=10){lcd.classList.add('bonus');$('lcdIdle').style.opacity=0;$('lcdNavi').textContent='獎勵確定!!';slam('7',x>=80?'#fff':'#ffc400',x>=30?'超級大獎':'大獎');lcdLater(()=>slam(x>=80?'大獎!!':'大獎','#ff2240','確定'),550)}
else if(x>=2){slam('小獎','#19e08a','總押注 ×'+(Math.round(x*10)/10));$('lcdNavi').textContent='一般中獎';lcdLater(lcdReset,2600)}
else if(x>0){slam('贏','#3a8bff','×'+(Math.round(x*10)/10));$('lcdNavi').textContent='小役 中獎';lcdLater(lcdReset,1800)}
else{lcdLater(lcdReset,700)}}
{const mk=(el,a)=>{a.forEach((li,i)=>{const e=document.createElement('b');e.className='pl';e.dataset.l=li;e.textContent=li+1;e.style.setProperty('--lc',COLORS[li]);e.style.setProperty('--i',i);el.appendChild(e)})};mk($('ledL'),[0,1,2,3,4,5,6,7,8,9]);mk($('ledR'),[10,11,12,13,14,15,16,17,18,19])}
fsUI();{const b=$('setBtn');if(b)b.onclick=e=>{e.stopPropagation();sfx.click();document.body.classList.add('menu16');const mb=$('menuBtn');if(mb)mb.setAttribute('aria-expanded','true');const sl=document.querySelector('#dfpVolMenu input');if(sl)try{sl.focus({preventScroll:true})}catch(x){}}}
