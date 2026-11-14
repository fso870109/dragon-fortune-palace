/* v28.116 pre-rendered BGM/SFX + shared DFPctx for feature/juice/AV. Theme beds only — the old synth fallback is gone. */
(function(){
const V='?v=2859',LOOP={matsuri:64,samurai:60,neko:68.571429,sakura:63.157895},PRE=.3,INTRO={matsuri:12,samurai:7.5,neko:5.714286,sakura:6.315789},MG=1.8,D='assets/audio/';
const B={};const RAW={};let ld=false,src=null,want=false;
const NAMES=['click','blip','spin','stop','tick','reach','coin','win0','win1','win2','win3','win4','bonus','collect','chime','buy','lose','door_close','door_open'];
function CID(){return (window.CZM&&CZM.id)||'sakura'}
function ctx(){try{if(typeof aInit==='function')aInit();if(typeof ac==='undefined'||!ac)return null;if(ac.state==='suspended')ac.resume();return ac}catch(e){return null}}
window.DFPctx=ctx;
window.DFPsfxOut=function(c){try{if(typeof AM!=='undefined'&&AM&&AM.sfxG&&(!c||AM.sfxG.context===c))return AM.sfxG}catch(e){}return c&&c.destination||null}
function dec(c,buf){return new Promise((ok,no)=>{const p=c.decodeAudioData(buf,ok,no);if(p&&p.then)p.then(ok,no)})}
function trim(b){const d=b.getChannelData(0);let i=0;while(i<d.length&&Math.abs(d[i])<.002)i++;b.__off=Math.max(0,i-32)/b.sampleRate;return b}
function prefetch(n){if(RAW[n]||B[n] instanceof AudioBuffer)return RAW[n]||B[n];RAW[n]=fetch(D+n+'.mp3'+V).then(r=>{if(!r.ok)throw 0;return r.arrayBuffer()}).then(ab=>{RAW[n]=ab;return ab}).catch(()=>{RAW[n]=null;return null});return RAW[n]}
function load(n){if(B[n] instanceof AudioBuffer)return Promise.resolve(B[n]);if(B[n]&&typeof B[n].then==='function')return B[n];const c=ctx();const raw=(RAW[n] instanceof ArrayBuffer)?Promise.resolve(RAW[n]):prefetch(n);if(!c)return raw;B[n]=Promise.resolve(raw).then(ab=>{if(!ab)throw 0;return dec(c,ab)}).then(b=>B[n]=trim(b)).catch(()=>{B[n]=null;return null});return B[n]}
function musOn(){return !!(window.DFPvol?DFPvol.musOn():(typeof AS!=='undefined'&&AS&&AS.music))}
function boot(){if(ld)return;if(!ctx())return;ld=true;const id=CID();load('bgm_'+id).then(b=>{if(typeof MUS!=='undefined'&&MUS.T){clearInterval(MUS.T);MUS.T=null}if(musOn()&&typeof AM!=='undefined'&&AM&&b)mus(true)});if(LOOP[id])setTimeout(()=>load('bgm_'+id+'_sting'),3000);NAMES.forEach((n,i)=>setTimeout(()=>load('sfx_'+n),40*i))}
try{prefetch('bgm_'+CID())}catch(e){}
addEventListener('pointerdown',boot,{capture:true});addEventListener('keydown',boot,{capture:true});
function play(n,g=1,o={}){const c=ctx(),b=B['sfx_'+n];if(!c||!b||!(b instanceof AudioBuffer)||typeof AM==='undefined'||!AM)return null;if(c.state==='suspended')c.resume();const s=c.createBufferSource();s.buffer=b;if(o.rate)s.playbackRate.value=o.rate;const G=c.createGain();G.gain.value=g;s.connect(G).connect(AM.sfxG);s.start(c.currentTime+(o.t||0),b.__off||0);return {s,G}}
let fsSrc=null,t0=0,fsOn=false,duck=null;
function mk(c,b){const s=c.createBufferSource();s.buffer=b;s.loop=true;const L=LOOP[CID()];if(L){const I=INTRO[CID()]||0;s.loopStart=PRE+I;s.loopEnd=PRE+I+L}else{s.loopStart=0;s.loopEnd=b.duration}const g=c.createGain();g.gain.value=0;s.connect(g).connect(duck);s.__g=g;s.__L=L;return s}
function pos(c,L){if(!L)return 0;const I=INTRO[CID()]||0,e=Math.max(0,c.currentTime-t0);return e<I?PRE+e:PRE+I+((e-I)%L)}
function startFs(c){const b=B['bgm_'+CID()+'_fs'];if(!src||fsSrc||!(b instanceof AudioBuffer))return;fsSrc=mk(c,b);fsSrc.start(c.currentTime+.02,pos(c,fsSrc.__L)+.02);xf(c,.01)}
function xf(c,tc){if(!src)return;const t=c.currentTime,fs=fsOn&&fsSrc;src.__g.gain.setTargetAtTime(fs?0:MG,t,tc);if(fsSrc)fsSrc.__g.gain.setTargetAtTime(fs?MG:0,t,tc)}
function ensureDuck(c){if(!duck&&AM){duck=c.createGain();duck.gain.value=1;duck.connect(AM.mus)}return duck}
function mus(on){want=on;const c=ctx();if(!c||typeof AM==='undefined'||!AM)return;const id=CID(),b=B['bgm_'+id];ensureDuck(c);if(on&&!src&&b instanceof AudioBuffer){src=mk(c,b);t0=c.currentTime+.02;src.start(t0,LOOP[id]?PRE:(b.__off||0));xf(c,.4);if(LOOP[id])load('bgm_'+id+'_fs').then(()=>startFs(c))}else if(!on&&src){[src,fsSrc].forEach(s=>{if(!s)return;try{s.__g.gain.setTargetAtTime(0,c.currentTime,.15);s.stop(c.currentTime+.6)}catch(e){}});src=null;fsSrc=null}}
function setFs(v){if(v===fsOn)return;fsOn=v;const c=ctx();if(c)xf(c,.5)}
function sting(){const c=ctx(),id=CID();if(!c||!duck||!src||!musOn())return;load('bgm_'+id+'_sting').then(b=>{if(!(b instanceof AudioBuffer))return;const t=c.currentTime;duck.gain.cancelScheduledValues(t);duck.gain.setTargetAtTime(.3,t,.05);duck.gain.setTargetAtTime(1,t+3.2,.6);const s=c.createBufferSource();s.buffer=b;const g=c.createGain();g.gain.value=1.3;s.connect(g).connect(AM.mus);s.start(t+.03)})}
function duckTo(amt,tc){const c=ctx();if(!c||typeof AM==='undefined'||!AM)return;ensureDuck(c);const t=c.currentTime;duck.gain.cancelScheduledValues(t);duck.gain.setTargetAtTime(Math.max(0,Math.min(1,+amt||0)),t,tc||.12)}
function watch(){const bd=document.body,bw=document.getElementById('bw');if(!bd)return setTimeout(watch,300);new MutationObserver(()=>setFs(bd.classList.contains('fs-mode'))).observe(bd,{attributes:true,attributeFilter:['class']});if(bw){let was=false;new MutationObserver(()=>{const on=bw.classList.contains('show');if(on&&!was&&!bw.classList.contains('fsi'))sting();if(on&&!was&&bw.classList.contains('fsi'))setFs(true);was=on}).observe(bw,{attributes:true,attributeFilter:['class']})}}
watch();
addEventListener('pagehide',()=>{try{mus(false)}catch(e){}});
window.CZA={play,mus,load,setFs,sting,duck:duckTo,_s:()=>({base:src&&+src.__g.gain.value.toFixed(2),fs:fsSrc&&+fsSrc.__g.gain.value.toFixed(2),duck:duck&&+duck.gain.value.toFixed(2)}),_dbg:()=>({id:CID(),src:!!src,buf:B['bgm_'+CID()] instanceof AudioBuffer,synth:typeof MUS!=='undefined'&&!!MUS.T,ld})};
function hook(){if(typeof sfx==='undefined'||typeof musSync!=='function')return setTimeout(hook,200);
 const O=Object.assign({},sfx),has=n=>B['sfx_'+n] instanceof AudioBuffer;
 const sOn=()=>window.DFPvol?DFPvol.sfxOn():sound;const W=(n,fb,g)=>function(){if(has(n)&&sOn()&&!document.hidden){play(n,g);return}return fb&&fb.apply(this,arguments)};
 sfx.click=W('click',O.click,.9);sfx.blip=W('blip',O.blip,.8);sfx.spinStart=W('spin',O.spinStart,.9);sfx.coin=W('coin',O.coin,.5);
 let lt=0;sfx.tick=function(c,v){const n=performance.now();if(has('tick')){if(sOn()&&n-lt>45){lt=n;play('tick',.35,{rate:.9+Math.min(.5,(v||1)*.08)})}return}return O.tick&&O.tick(c,v)};
 sfx.stop=function(c){if(has('stop')&&sOn()){play('stop',1,{rate:[1,.96,.92][c]||1});return}return O.stop(c)};
 sfx.suspense=function(d){if(has('reach')&&sOn()&&!document.hidden){const p=play('reach',.9);if(p){const t=ac.currentTime;p.G.gain.setValueAtTime(.9,t+Math.max(.2,d));p.G.gain.linearRampToValueAtTime(0,t+d+.35);p.s.stop(t+d+.4)}return}return O.suspense(d)};
 sfx.win=function(t){const n='win'+Math.max(0,Math.min(4,t|0));if(has(n)&&sOn()){play(n,1);return}return O.win(t)};
 sfx.big=()=>sfx.win(2);
 ['collect','chime','buy','lose'].forEach(n=>sfx[n]=W(n,O[n],.9));sfx.ad=W('chime',O.ad,.9);
 window.musSync=musSync=function(){if(typeof MUS!=='undefined'&&MUS.T){clearInterval(MUS.T);MUS.T=null}const on=!!(musOn()&&typeof AM!=='undefined'&&AM);if(!ld)boot();mus(on)};
 document.addEventListener('visibilitychange',()=>{if(document.hidden)mus(false);else if(musOn()&&typeof AM!=='undefined'&&AM)mus(true)});
 const ofi=window.fsIntro;if(ofi)window.fsIntro=function(re){if(!re)play('bonus',1);return ofi.apply(this,arguments)};
}
hook();
})();
