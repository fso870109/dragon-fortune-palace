/* v18.3 pre-rendered BGM/SFX (play-money casino). Falls back to synth until buffers decode. */
(function(){
const V='?v=239',LOOP={matsuri:64,samurai:68.571429,neko:65.084739,sakura:61.935465},PRE=.3,MG=1.8,D='assets/audio/';const B={};let ld=false,src=null,want=false,cur=null;
const NAMES=['click','blip','spin','stop','tick','reach','coin','win0','win1','win2','win3','win4','bonus','collect','chime','buy','lose','door_close','door_open'];
function ctx(){return (typeof aInit==='function'&&aInit())?ac:null}
function dec(c,buf){return new Promise((ok,no)=>{const p=c.decodeAudioData(buf,ok,no);if(p&&p.then)p.then(ok,no)})}
function trim(b){const d=b.getChannelData(0);let i=0;while(i<d.length&&Math.abs(d[i])<.002)i++;b.__off=Math.max(0,i-32)/b.sampleRate;return b}
function load(n){const c=ctx();if(!c||B[n])return Promise.resolve(B[n]);B[n]=fetch(D+n+'.mp3'+V).then(r=>r.arrayBuffer()).then(a=>dec(c,a)).then(b=>B[n]=trim(b)).catch(()=>{B[n]=null});return B[n]}
function boot(){if(ld)return;if(!ctx())return;ld=true;
 const id=(window.CZM&&CZM.id)||'love';load('bgm_'+id).then(()=>{if(typeof MUS!=='undefined'&&MUS.T){clearInterval(MUS.T);MUS.T=null}if(sound&&AS.music&&AM)mus(true)});
 if(LOOP[id])setTimeout(()=>load('bgm_'+id+'_sting'),3000);NAMES.forEach((n,i)=>setTimeout(()=>load('sfx_'+n),40*i))}
addEventListener('pointerdown',boot,{capture:true});addEventListener('keydown',boot,{capture:true});
function play(n,g=1,o={}){const c=ctx(),b=B['sfx_'+n];if(!c||!b||!(b instanceof AudioBuffer)||!AM)return null;if(c.state==='suspended')c.resume();
 const s=c.createBufferSource();s.buffer=b;if(o.rate)s.playbackRate.value=o.rate;const G=c.createGain();G.gain.value=g;s.connect(G).connect(AM.sfxG);s.start(c.currentTime+(o.t||0),b.__off||0);return {s,G}}
let fsSrc=null,t0=0,fsOn=false,duck=null;
function mk(c,b,g0){const s=c.createBufferSource();s.buffer=b;s.loop=true;const L=LOOP[CID()];if(L){s.loopStart=PRE;s.loopEnd=PRE+L}else{s.loopStart=0;s.loopEnd=b.duration}const g=c.createGain();g.gain.value=0;s.connect(g).connect(duck);s.__g=g;s.__L=L;return s}
function CID(){return (window.CZM&&CZM.id)||'love'}
function pos(c,L){return L?PRE+((c.currentTime-t0)%L+L)%L:0}
function startFs(c){const b=B['bgm_'+CID()+'_fs'];if(!src||fsSrc||!(b instanceof AudioBuffer))return;fsSrc=mk(c,b);fsSrc.start(c.currentTime+.02,pos(c,fsSrc.__L)+.02);xf(c,.01)}
function xf(c,tc){if(!src)return;const t=c.currentTime,fs=fsOn&&fsSrc;src.__g.gain.setTargetAtTime(fs?0:MG,t,tc);if(fsSrc)fsSrc.__g.gain.setTargetAtTime(fs?MG:0,t,tc)}
function mus(on){want=on;const c=ctx();if(!c||!AM)return;const id=CID(),b=B['bgm_'+id];
 if(!duck){duck=c.createGain();duck.connect(AM.mus)}
 if(on&&!src&&b instanceof AudioBuffer){src=mk(c,b);t0=c.currentTime+.02;src.start(t0,LOOP[id]?PRE:(b.__off||0));t0-=0;xf(c,.4);
  if(LOOP[id])load('bgm_'+id+'_fs').then(()=>startFs(c))}
 else if(!on&&src){[src,fsSrc].forEach(s=>{if(!s)return;try{s.__g.gain.setTargetAtTime(0,c.currentTime,.15);s.stop(c.currentTime+.6)}catch(e){}});src=null;fsSrc=null}}
function setFs(v){if(v===fsOn)return;fsOn=v;const c=ctx();if(c)xf(c,.5)}
function sting(){const c=ctx(),id=CID();if(!c||!duck||!src||!(sound&&AS.music))return;load('bgm_'+id+'_sting').then(b=>{if(!(b instanceof AudioBuffer))return;const t=c.currentTime;duck.gain.cancelScheduledValues(t);duck.gain.setTargetAtTime(.3,t,.05);duck.gain.setTargetAtTime(1,t+3.2,.6);const s=c.createBufferSource();s.buffer=b;const g=c.createGain();g.gain.value=1.3;s.connect(g).connect(AM.mus);s.start(t+.03)})}
function watch(){const bd=document.body,bw=document.getElementById('bw');if(!bd)return setTimeout(watch,300);
 new MutationObserver(()=>setFs(bd.classList.contains('fs-mode'))).observe(bd,{attributes:true,attributeFilter:['class']});
 if(bw){let was=false;new MutationObserver(()=>{const on=bw.classList.contains('show');if(on&&!was&&!bw.classList.contains('fsi'))sting();if(on&&!was&&bw.classList.contains('fsi'))setFs(true);was=on}).observe(bw,{attributes:true,attributeFilter:['class']})}}
watch();
window.CZA={play,mus,load,setFs,sting,_s:()=>({base:src&&+src.__g.gain.value.toFixed(2),fs:fsSrc&&+fsSrc.__g.gain.value.toFixed(2),duck:duck&&+duck.gain.value.toFixed(2)})};
function hook(){if(typeof sfx==='undefined'||typeof musSync!=='function')return setTimeout(hook,200);
 const O=Object.assign({},sfx),has=n=>B['sfx_'+n] instanceof AudioBuffer;
 const W=(n,fb,g)=>function(){if(has(n)&&sound&&!document.hidden){play(n,g);return}return fb&&fb.apply(this,arguments)};
 sfx.click=W('click',O.click,.9);sfx.blip=W('blip',O.blip,.8);sfx.spinStart=W('spin',O.spinStart,.9);sfx.coin=W('coin',O.coin,.5);
 let lt=0;sfx.tick=function(c,v){const n=performance.now();if(has('tick')){if(sound&&n-lt>45){lt=n;play('tick',.35,{rate:.9+Math.min(.5,(v||1)*.08)})}return}return O.tick&&O.tick(c,v)};
 sfx.stop=function(c){if(has('stop')&&sound){play('stop',1,{rate:[1,.96,.92][c]||1});return}return O.stop(c)};
 sfx.suspense=function(d){if(has('reach')&&sound&&!document.hidden){const p=play('reach',.9);if(p){const t=ac.currentTime;p.G.gain.setValueAtTime(.9,t+Math.max(.2,d));p.G.gain.linearRampToValueAtTime(0,t+d+.35);p.s.stop(t+d+.4)}return}return O.suspense(d)};
 sfx.win=function(t){const n='win'+Math.max(0,Math.min(4,t|0));if(has(n)&&sound){play(n,1);return}return O.win(t)};
 sfx.big=()=>sfx.win(2);
 ['collect','chime','buy','lose'].forEach(n=>sfx[n]=W(n,O[n],.9));sfx.ad=W('chime',O.ad,.9);
 const oms=musSync;window.musSync=musSync=function(){const on=!!(sound&&AS.music&&AM);if(B['bgm_'+((window.CZM&&CZM.id)||'love')] instanceof AudioBuffer||ld){if(typeof MUS!=='undefined'&&MUS.T){clearInterval(MUS.T);MUS.T=null}mus(on);return}return oms()};
 document.addEventListener('visibilitychange',()=>{if(document.hidden)mus(false);else if(sound&&AS.music&&AM)mus(true)});
 const ofi=window.fsIntro;if(ofi)window.fsIntro=function(re){if(!re)play('bonus',1);return ofi.apply(this,arguments)};
}
hook();
})();
