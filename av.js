/* v20.2 layered audio-visual feedback (play-money only) */
(function(){
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
let AC=null;function ac(){try{if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume()}catch(e){}return AC}
function muted(){return typeof sound!=='undefined'&&!sound}
function tone(f,t0,d,type,vol,f2){const a=ac();if(!a||muted())return;const t=a.currentTime+t0,o=a.createOscillator(),g=a.createGain();o.type=type||'triangle';o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol||.07,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(a.destination);o.start(t);o.stop(t+d+.05)}
function noise(t0,d,vol,hp){const a=ac();if(!a||muted())return;const n=a.sampleRate*d,b=a.createBuffer(1,n,a.sampleRate),c=b.getChannelData(0);for(let i=0;i<n;i++)c[i]=(Math.random()*2-1)*(1-i/n);const s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();s.buffer=b;f.type='highpass';f.frequency.value=hp||2000;g.gain.value=vol||.05;s.connect(f).connect(g).connect(a.destination);s.start(a.currentTime+t0)}
const ST=[[523,659,784,1047],[523,659,784,1047,1319,1568],[392,523,659,784,1047,1319,1568,2093]];
function stinger(tier){const n=ST[tier];n.forEach((f,i)=>tone(f,i*.085,.5,'triangle',.07));const end=n.length*.085;[n[0]/2,n[1],n[2],n[n.length-1]].forEach(f=>tone(f,end,1.2+tier*.4,'sawtooth',.025));tone(n[0]/4,end,1.4,'sine',.12);noise(end,.6+tier*.3,.04+tier*.02,3000);if(tier>=1)for(let i=0;i<8+tier*6;i++)tone(2000+Math.random()*2500,end+.1+i*.07,.12,'sine',.03)}
function el(id,tag){let e=document.getElementById(id);if(!e){e=document.createElement(tag||'div');e.id=id;document.body.appendChild(e)}return e}
const COL=['rgba(255,215,90,.85)','rgba(255,120,210,.85)','rgba(170,200,255,.95)'];
function flash(tier){const f=el('avFlash');f.style.background=`radial-gradient(circle at 50% 40%,#fff,${COL[tier]} 45%,transparent 80%)`;f.classList.remove('go');void f.offsetWidth;f.classList.add('go')}
function callout(tier){const c=el('avCall');c.className='t'+(tier+1);c.innerHTML='<b>'+['大獎！','超級大獎！','傳說大獎！'][tier]+'</b>';void c.offsetWidth;c.classList.add('go');setTimeout(()=>c.classList.remove('go'),2000)}
let raf=0;function coins(tier){if(RM)return;const cv=el('avCoin','canvas'),W=cv.width=innerWidth,H=cv.height=innerHeight,x=cv.getContext('2d');const N=[50,120,220][tier],P=[];for(let i=0;i<N;i++)P.push({x:Math.random()*W,y:-20-Math.random()*H*.8,vy:2+Math.random()*4,vx:(Math.random()-.5)*1.5,r:5+Math.random()*6,a:Math.random()*6,va:.1+Math.random()*.2,h:tier==2&&i%3==0});const t0=performance.now();cancelAnimationFrame(raf);
 (function fr(t){x.clearRect(0,0,W,H);let live=0;for(const p of P){p.vy+=.08;p.y+=p.vy;p.x+=p.vx;p.a+=p.va;if(p.y<H+20)live++;const s=Math.abs(Math.cos(p.a));x.save();x.translate(p.x,p.y);x.scale(s,1);x.beginPath();x.arc(0,0,p.r,0,7);x.fillStyle=p.h?'#cfe0ff':'#ffcc33';x.fill();x.lineWidth=1.5;x.strokeStyle=p.h?'#5a6aff':'#a86a00';x.stroke();x.fillStyle='rgba(255,255,255,.7)';x.fillRect(-p.r*.3,-p.r*.5,p.r*.25,p.r*.6);x.restore()}
 if(live&&t-t0<6000)raf=requestAnimationFrame(fr);else x.clearRect(0,0,W,H)})(t0)}
function tierOf(x){return x>=50?2:x>=25?1:0}
function celebrate(tier){stinger(tier);flash(tier);callout(tier);coins(tier);if(tier>=1&&window.shake)try{shake()}catch(e){}}
window.AV={celebrate,stinger,tone};
const _bw=window.bigWin;if(_bw)window.bigWin=function(won,total,o){const r=_bw.apply(this,arguments);try{if(total>0&&won/total>=10){const tr=tierOf(won/total),t0=Date.now();(function w(){const b=document.getElementById('bw');const vis=b&&getComputedStyle(b).display!=='none'&&+getComputedStyle(b).opacity>.5&&b.getBoundingClientRect().height>0;if(vis||Date.now()-t0>9000)celebrate(tr);else setTimeout(w,120)})()}}catch(e){}return r};
/* small-win chime layer */
const _st=window.settle;if(_st)window.settle=function(bet){const b0=typeof bal!=='undefined'?bal:0;const r=_st.apply(this,arguments);try{const d=bal-b0,tot=bet*(typeof NL!=='undefined'?NL:20);if(d>0&&d<tot*10){const k=d>=tot*3?3:d>=tot?2:1;for(let i=0;i<k+1;i++)tone([784,988,1175,1568][i],i*.07,.25,'sine',.05)}}catch(e){}return r};
/* hold & spin layer: fanfare, music bed, lock/collect sounds, grand */
let mus=0,step=0;const BASS=[131,131,175,196],ARP=[523,659,784,659];
function musOn(){if(mus)return;step=0;mus=setInterval(()=>{if(step%4==0)tone(BASS[(step/4|0)%4]/2,0,.42,'sine',.09);tone(ARP[step%4]*((step/4|0)%4==2?1.335:1),0,.14,'square',.018);if(step%2)noise(0,.04,.02,6000);step++},150)}
function musOff(){clearInterval(mus);mus=0}
function fanfare(){[392,523,659,784].forEach((f,i)=>tone(f,i*.11,.3,'square',.04));[523,659,784,1047].forEach(f=>tone(f,.5,1,'sawtooth',.03));noise(.45,.5,.05,2500)}
const seen=new WeakSet();
new MutationObserver(ms=>{for(const m of ms){if(m.type==='childList'){m.addedNodes.forEach(n=>{if(n.id==='hsBox'){fanfare();flash(0);setTimeout(musOn,900)}});m.removedNodes.forEach(n=>{if(n.id==='hsBox')musOff()})}
 else if(m.type==='attributes'){const t=m.target;if(t.id==='hsBox'&&t.classList.contains('full')&&!seen.has(t)){seen.add(t);celebrate(2)}else if(t.tagName==='I'&&t.closest&&t.closest('#hsBox')){if(t.classList.contains('on')&&!seen.has(t)){seen.add(t);const c=t.classList;if(c.contains('col')){tone(300,0,.5,'sawtooth',.05,1500);noise(0,.4,.05,1500)}else if(c.contains('mini')||c.contains('minor')||c.contains('major')){[880,1175,1568].forEach((f,i)=>tone(f*(c.contains('major')?1.26:1),i*.06,.3,'triangle',.06))}else{tone(220,0,.12,'square',.05,110);tone(1320,0,.18,'sine',.05)}}}}}
}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
/* meter heat */
setInterval(()=>{const m=document.getElementById('hsMeter');if(m&&window.CZHS){const hot=(typeof CZHS.meter==="function"?CZHS.meter():CZHS.meter)/CZHS.M>=.85;m.classList.toggle('avHot',hot)}},1000);
})();
