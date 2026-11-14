/* v28.116 motion & juice — shared game AudioContext / AM.sfxG */
(function(){
const RMj=matchMedia('(prefers-reduced-motion: reduce)').matches;
const ID=(window.CZM&&CZM.id)||(location.pathname.split('/').pop()||'').replace('.html','');
const AMB={love:['bokeh','255,120,190'],matsuri:['ember','255,170,80'],caishen:['dust','255,215,110'],samurai:['ember','255,90,50'],pirate:['bubble','160,220,255'],neko:['dust','255,220,140'],sakura:['petal','255,185,215'],queen:['bokeh','255,90,140'],school:['petal','255,200,225'],jungle:['leaf','150,220,110']};
let AC=null;
function ac(){try{if(window.DFPctx){const c=DFPctx();if(c)return c}if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();return AC}catch(e){return AC}}
function sfxOut(a){try{if(window.DFPsfxOut){const d=DFPsfxOut(a);if(d)return d}}catch(e){}return a&&a.destination}
function sVol(){try{if(typeof AM!=='undefined'&&AM&&AM.sfxG)return 1;if(window.DFPvol)return DFPvol.sfx()}catch(e){}return 1}
function muted(){try{if(window.DFPvol)return !DFPvol.sfxOn();return typeof sound!=='undefined'&&!sound}catch(e){return false}}
function blip(f,d,type,vol,f2){const a=ac();if(!a||muted())return;const t=a.currentTime,o=a.createOscillator(),g=a.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime((vol||.08)*sVol(),t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(sfxOut(a));o.start(t);o.stop(t+d+.02)}
window.JUICE={blip};
// 1) reel landing: thunk with rising pitch + shake on last reel when anticipation
let landN=0;
const _land=window.landFX;
if(_land){window.landFX=function(c){landN++;blip(140+c*22,.09,'triangle',.07,70);if(c===4&&document.querySelector('.reel.jant')&&window.shake)shake(1);document.querySelectorAll('.reel')[c]&&document.querySelectorAll('.reel')[c].classList.remove('jant');return _land.apply(this,arguments)}}
// 2) anticipation: glow frame on remaining reels + riser
let riser=null;
function antOn(){const rs=[...document.querySelectorAll('.reel')];rs.slice(3).forEach(r=>r.classList.add('jant'));
 const a=ac();if(!a||muted()||RMj)return;const t=a.currentTime,o=a.createOscillator(),g=a.createGain(),o2=a.createOscillator();o.type='sawtooth';o2.type='sine';o.frequency.setValueAtTime(180,t);o.frequency.exponentialRampToValueAtTime(720,t+2.2);o2.frequency.setValueAtTime(360,t);o2.frequency.exponentialRampToValueAtTime(1440,t+2.2);
 const lp=a.createBiquadFilter();lp.type='lowpass';lp.frequency.setValueAtTime(600,t);lp.frequency.linearRampToValueAtTime(3200,t+2.2);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.045*sVol(),t+1.8);g.gain.linearRampToValueAtTime(0,t+2.4);o.connect(lp);o2.connect(lp);lp.connect(g).connect(sfxOut(a));o.start(t);o2.start(t);o.stop(t+2.5);o2.stop(t+2.5);riser={o,o2,g}}
function antOff(){document.querySelectorAll('.reel.jant').forEach(r=>r.classList.remove('jant'));if(riser&&AC){try{riser.g.gain.cancelScheduledValues(AC.currentTime);riser.g.gain.setTargetAtTime(0,AC.currentTime,.05)}catch(e){}}riser=null}
const _tc=window.teaseCheck;if(_tc){window.teaseCheck=function(res){const r=_tc.apply(this,arguments);if(r)setTimeout(antOn,0);return r}}
const _st=window.settle;if(_st){window.settle=function(){antOff();landN=0;const r=_st.apply(this,arguments);setTimeout(lineLen,0);return r}}
// 3) paylines draw-in length
function lineLen(){document.querySelectorAll('svg.lines polyline').forEach(p=>{try{p.style.setProperty('--jl',Math.ceil(p.getTotalLength()+4))}catch(e){}})}
// 4) win count-up with ticks
function countUp(){const A=document.getElementById('win'),B=document.getElementById('czWin');if(!A||!B)return;let last=0,anim=0;
 new MutationObserver(()=>{const v=parseInt((A.textContent||'').replace(/[^0-9]/g,''))||0;if(v<=last||RMj||v<1){last=v;return}const from=last;last=v;const id=++anim,dur=Math.min(1600,350+Math.log10(v+1)*350),t0=performance.now();let tk=0;
  B.classList.remove('jpop');
  const st=()=>{if(id!==anim)return;const k=Math.min(1,(performance.now()-t0)/dur),e=1-Math.pow(1-k,3),n=Math.round(from+(v-from)*e);B.textContent=n.toLocaleString('en-US');if(performance.now()-tk>60){tk=performance.now();blip(1400+e*900,.035,'square',.025)}if(k<1)requestAnimationFrame(st);else{B.textContent=A.textContent;void B.offsetWidth;B.classList.add('jpop');blip(1760,.18,'sine',.06);blip(2640,.22,'sine',.035)}};requestAnimationFrame(st)}).observe(A,{childList:true,characterData:true,subtree:true})}
// 5) ambient particles + light rays in hero
function ambient(){if(RMj)return;const h=document.getElementById('czHero');if(!h||document.getElementById('jRays'))return;
 const rays=document.createElement('div');rays.id='jRays';h.appendChild(rays);
 if(window.DFPamb)DFPamb.mount(h,ID)}
function boot(){countUp();setTimeout(ambient,600)}
if(document.readyState==='complete')boot();else addEventListener('load',boot);
})();
