/* v28.120 feature hall SFX — idle prefetch/decode, cached buffers, voice cap; never decode at play */
(function(){
"use strict";
const V='?v=28120', D='assets/sfx/';
const MAP={plinko:'C', jewels:'C', twister:'B', wheel:'B', mult:'B'};
const FILES=["c-fanfare","c-rapid","c-ding","b-fanfare","b-sparkle","b-alarm","chime","bell-small","coin","coin-b","chips","coins","ball-a","ball-b","ball-c","whoosh","coins-b","tray","payout","whoosh-b","bumper","knocker","reel","reel-stop","flipper","bell-box","chimes-cluster","reel-mech","cheer","applause","ratchet","flipper-b"];
const KEY={
  "b-fanfare":"bFanfare","b-sparkle":"bSparkle","b-alarm":"bAlarm",
  "c-ding":"cDing","c-rapid":"cRapid","c-fanfare":"cFanfare",
  "chime":"chime","bell-small":"bellSmall","bell-box":"bellBox","chimes-cluster":"chimesCluster",
  "whoosh":"whoosh","whoosh-b":"whooshB",
  "coin":"coin","coin-b":"coinB","coins":"coins","coins-b":"coinsB","chips":"chips","tray":"tray","payout":"payout",
  "reel":"reel","reel-stop":"reelStop","reel-mech":"reelMech","ratchet":"ratchet",
  "knocker":"knocker","flipper":"flipper","flipper-b":"flipperB","bumper":"bumper",
  "ball-a":"ballA","ball-b":"ballB","ball-c":"ballC","cheer":"cheer","applause":"applause"
};
const MAXV=8;
const bufs={};
const raw={};
const log=[];
const playing=[];
let booted=false, curGame='', jackpotPlayed={}, prefetching=false, decoding=false, tickI=0;

function note(e){try{console.warn('featsfx',e)}catch(_){}}
function ric(fn,to){try{if(typeof requestIdleCallback==='function')return requestIdleCallback(fn,{timeout:to||800})}catch(e){}return setTimeout(()=>fn({timeRemaining:()=>8,didTimeout:true}),Math.min(to||80,160))}
function ctx(){try{if(window.DFPctx){const c=DFPctx();if(c)return c}if(typeof aInit==='function')aInit();if(typeof ac!=='undefined'&&ac){if(ac.state==='suspended')ac.resume();return ac}}catch(e){}return null}
function sOn(){try{if(window.DFPvol)return DFPvol.sfxOn();return typeof sound==='undefined'||!!sound}catch(e){return true}}
function dest(c){try{if(typeof AM!=='undefined'&&AM&&AM.sfxG&&(!c||AM.sfxG.context===c))return AM.sfxG}catch(e){}return null}
function has(n){return bufs[n] instanceof AudioBuffer}
function rec(game,moment,ok,why){
  const row={t:Date.now(),game,moment,ok:!!ok,style:MAP[game]||'',why:why||''};
  log.push(row); if(log.length>240)log.shift();
  return row;
}
function dec(c,ab){return new Promise((ok,no)=>{try{const p=c.decodeAudioData(ab,ok,no);if(p&&p.then)p.then(ok,no)}catch(e){no(e)}})}

function prefetchOne(file){
  if(raw[file] || has(KEY[file])) return Promise.resolve(raw[file]);
  const p=fetch(D+file+'.mp3'+V).then(r=>{if(!r.ok)throw new Error('HTTP '+r.status+' '+file);return r.arrayBuffer()}).then(ab=>{raw[file]=ab;return ab}).catch(e=>{raw[file]=0;note(e);return null});
  raw[file]=p;
  return p;
}
function decodeOne(file){
  const key=KEY[file];
  if(has(key)) return Promise.resolve(bufs[key]);
  if(bufs[key]&&typeof bufs[key].then==='function') return bufs[key];
  const c=ctx(); if(!c) return Promise.resolve(null);
  const ab=raw[file];
  if(!(ab instanceof ArrayBuffer)) return Promise.resolve(null);
  let src=ab;
  try{src=ab.slice(0)}catch(e){src=ab}
  const p=dec(c,src).then(b=>{bufs[key]=b;return b}).catch(e=>{bufs[key]=null;note(e);return null});
  bufs[key]=p;
  return p;
}
function afterIdle(fn,loose,tight){ric(fn, booted?(tight||80):(loose||700))}
function idlePrefetch(){
  if(prefetching) return;
  prefetching=true;
  let i=0;
  function step(){
    let n=0, cap=booted?4:1;
    while(i<FILES.length && n<cap){
      const f=FILES[i++];
      if(!raw[f] && !has(KEY[f])){prefetchOne(f);n++}
    }
    if(i<FILES.length) afterIdle(step,800,120);
    else kickDecode();
  }
  afterIdle(step,400,40);
}
function featBusy(){try{return !!(document.querySelector('.rfx,#hsBox,#twCard,.plPop'))}catch(e){return false}}
function kickDecode(){
  const c=ctx(); if(!c) return;
  if(c.state==='suspended')try{c.resume()}catch(e){}
  if(decoding) return;
  decoding=true;
  function step(){
    if(featBusy()){decoding=false;ric(kickDecode,400);return}
    const next=FILES.find(f=>raw[f] instanceof ArrayBuffer && !has(KEY[f]) && !(bufs[KEY[f]]&&typeof bufs[KEY[f]].then==='function'));
    if(!next){
      const waiting=FILES.some(f=>raw[f]&&typeof raw[f].then==='function');
      const remain=FILES.some(f=>!has(KEY[f]) && raw[f]!==0);
      decoding=false;
      if(waiting||remain) afterIdle(kickDecode,500,120);
      return;
    }
    decodeOne(next).then(()=>afterIdle(step,500,50));
  }
  afterIdle(step,400,20);
}
function boot(){
  const c=ctx();
  if(c && c.state==='suspended')try{c.resume()}catch(e){}
  if(c) booted=true;
  idlePrefetch();
  kickDecode();
}
if(document.readyState==='complete') ric(idlePrefetch,400);
else addEventListener('load',()=>ric(idlePrefetch,500));
addEventListener('pointerdown',boot,{capture:true});
addEventListener('keydown',boot,{capture:true});

function prune(t){
  let w=0;
  for(let i=0;i<playing.length;i++){
    const p=playing[i];
    if(!p || p._dead || (p._stopAt!=null && t>=p._stopAt)) continue;
    playing[w++]=p;
  }
  playing.length=w;
}
function steal(t){
  prune(t);
  while(playing.length>=MAXV){
    const old=playing.shift();
    try{if(old&&old.stop)old.stop(t)}catch(e){}
    if(old) old._dead=1;
  }
}
function track(node,stopAt,flag){
  node._stopAt=stopAt;
  if(flag) node[flag]=1;
  try{node.onended=()=>{node._dead=1}}catch(e){}
  playing.push(node);
  try{if(node.stop&&stopAt!=null)node.stop(stopAt)}catch(e){}
}
function tickBusy(t){
  prune(t);
  let n=0; for(let i=0;i<playing.length;i++) if(playing[i]&&playing[i]._tick) n++;
  return n>=2;
}
function hit(name,when,opt){
  opt=opt||{};
  const b=bufs[name];
  if(!(b instanceof AudioBuffer))return null;
  const c=ctx(), out=dest(c);
  if(!c||!out)return null;
  if(c.state==='suspended')try{c.resume()}catch(e){}
  const t=when!=null?when:c.currentTime+.01;
  steal(t);
  const src=c.createBufferSource();
  src.buffer=b;
  const rate=opt.rate||1;
  src.playbackRate.setValueAtTime(rate,t);
  const g=c.createGain();
  const v=opt.gain==null?.8:opt.gain;
  const a=opt.a||.003;
  const dur=(opt.dur!=null?opt.dur:(b.duration/rate));
  const fade=opt.fade==null?Math.min(.08,dur*.2):opt.fade;
  g.gain.setValueAtTime(0,t);
  g.gain.linearRampToValueAtTime(v,t+a);
  const rel=t+Math.max(a+.02, dur-fade);
  g.gain.setValueAtTime(v,rel);
  g.gain.exponentialRampToValueAtTime(.0008,t+dur+.01);
  let node=src;
  if(opt.lp||opt.hp){
    const fl=c.createBiquadFilter();
    fl.type=opt.hp?'highpass':'lowpass';
    fl.frequency.value=opt.hp||opt.lp;
    fl.Q.value=opt.q||.7;
    src.connect(fl);node=fl;
  }
  node.connect(g);g.connect(out);
  try{
    src.start(t, opt.off||0, opt.slice);
    track(src, t+dur+.08, opt.tick?'_tick':null);
  }catch(e){note(e);return null}
  return src;
}

const BALLS=["ballA","ballB","ballC"];
function cascade(t,n,gap,gain){
  let ok=0;
  const m=Math.min(n||4,4);
  for(let i=0;i<m;i++) if(hit(BALLS[i%3],t+i*(gap||.08),{gain:(gain||.55)*(1-i*.06),rate:.95+(i%5)*.06,dur:.28})) ok++;
  return ok;
}
function hopper(t,gain){
  let n=0;
  if(hit("payout",t,{gain:gain==null?.7:gain})) n++;
  if(hit("coins",t+.04,{gain:.5})) n++;
  return n;
}
function tickIdx(k){
  if(typeof k==='number' && k===((k|0)) && Math.abs(k)>=1) return (k|0);
  return tickI++;
}

function played(){let n=0; for(let i=0;i<arguments.length;i++) if(arguments[i]) n++; return n}
const PLAY={
  B:{
    open(t){return played(hit("chime",t,{gain:.45}),hit("bSparkle",t,{gain:.55}),hit("bellSmall",t,{gain:.3}))>0},
    shot(t){return played(hit("whoosh",t,{gain:.5,hp:350}),hit("bSparkle",t+.08,{gain:.35,dur:.6}))>0},
    hit(t,k){return played(hit(["coin","coinB","chips"][(k||0)%3],t,{gain:.7,rate:.97+((k||0)%5)*.05}),hit(BALLS[(k||0)%3],t,{gain:.28}))>0},
    land(t){return played(hit("bSparkle",t,{gain:.7}),hit("coin",t,{gain:.55}),hit("chime",t,{gain:.35}))>0},
    jackpot(t){return played(hit("bFanfare",t,{gain:.75}),hit("bAlarm",t+.12,{gain:.55}),hopper(t+.08,.6),hit("chimesCluster",t,{gain:.4}))>0},
    spin(t){return played(hit("reel",t,{gain:.62}),hit("chime",t,{gain:.18,dur:1.2}))>0},
    stop(t){return played(hit("reelStop",t,{gain:.7}),hit("chime",t,{gain:.45}),hit("coinB",t,{gain:.4}))>0},
    collect(t){return hopper(t,.65)+played(hit("bSparkle",t,{gain:.55}),hit("coinsB",t+.15,{gain:.4}))>0},
    tick(t,k){if(tickBusy(t))return true;const i=tickIdx(k);return !!hit(["coin","coinB","chips"][i%3],t,{gain:.32,rate:.96+(i%6)*.04,dur:.16,tick:1})},
    lock(t){return played(hit("bellSmall",t,{gain:.55}),hit("bSparkle",t,{gain:.4,dur:.6}))>0},
    respin(t){return played(hit("reel",t,{gain:.55,dur:1.1}),hit("whooshB",t,{gain:.32}))>0},
    miss(t){return played(hit("coin",t,{gain:.35,rate:.82,lp:2400}))>0},
    last(t){return played(hit("bellBox",t,{gain:.42}),hit("chime",t,{gain:.4}))>0},
    grand(t){return played(hit("bFanfare",t,{gain:.78}),hit("bAlarm",t+.1,{gain:.6}),hopper(t+.05,.65),hit("chimesCluster",t,{gain:.48}))>0},
    minor(t){return played(hit("bSparkle",t,{gain:.65}),hit("coinsB",t,{gain:.5}),hit("bellSmall",t,{gain:.4}))>0},
    roll(t){let n=hit("reel",t,{gain:.5,dur:1.2})?1:0;for(let i=0;i<3;i++) if(hit(["coin","coinB","chips"][i%3],t+i*.12,{gain:.28,rate:.98+i*.03,dur:.18})) n++; return n>0},
    burst(t){return played(hit("bFanfare",t,{gain:.72}),hopper(t,.5),hit("bSparkle",t,{gain:.45}))>0}
  },
  C:{
    open(t){return cascade(t,4,.07,.55)+played(hit("cRapid",t+.08,{gain:.55}))>0},
    shot(t){return played(hit("whoosh",t,{gain:.65,rate:1.2}),hit("flipper",t+.08,{gain:.5,rate:1.15}))>0},
    hit(t,k){return played(hit(BALLS[(k||0)%3],t,{gain:.85,rate:1+((k||0)%5)*.06}),hit("bumper",t,{gain:.4,rate:1.05+((k||0)%3)*.05}))>0},
    land(t){return played(hit("cDing",t,{gain:.85}),hit("ballA",t,{gain:.5}))>0},
    jackpot(t){return played(hit("cFanfare",t,{gain:.78}),hit("cRapid",t+.05,{gain:.55}),cascade(t,4,.06,.5),hopper(t+.15,.5))>0},
    spin(t){return cascade(t,4,.09,.48)+played(hit("reelMech",t,{gain:.28,lp:3500}))>0},
    stop(t){return played(hit("knocker",t,{gain:.55}),hit("cDing",t,{gain:.7}),hit("ballB",t,{gain:.45}))>0},
    collect(t){return cascade(t,4,.07,.5)+played(hit("coins",t,{gain:.45}))>0},
    tick(t,k){if(tickBusy(t))return true;const i=tickIdx(k);return !!hit(BALLS[i%3],t,{gain:.4,rate:1+(i%4)*.05,dur:.16,tick:1})},
    lock(t){return played(hit("cDing",t,{gain:.8}),hit("ballC",t,{gain:.4}))>0},
    respin(t){return played(hit("whooshB",t,{gain:.45,rate:1.1}),cascade(t,2,.08,.45))>0},
    miss(t){return played(hit("flipperB",t,{gain:.42,rate:.92,lp:2200}))>0},
    last(t){return played(hit("cRapid",t,{gain:.45,dur:.7}),hit("bellSmall",t,{gain:.35}))>0},
    grand(t){return played(hit("cFanfare",t,{gain:.8}),hit("cRapid",t,{gain:.55}),cascade(t,4,.06,.52),hopper(t+.1,.55))>0},
    minor(t){return played(hit("cDing",t,{gain:.75}),hit("coinsB",t,{gain:.5}),hit("ballB",t,{gain:.35}))>0},
    roll(t){return cascade(t,4,.1,.45)+played(hit("ratchet",t,{gain:.28}))>0},
    burst(t){return played(hit("cFanfare",t,{gain:.75}),cascade(t,4,.06,.5),hit("coins",t,{gain:.45}))>0}
  }
};

function styleOf(game){return MAP[game]||MAP[curGame]}
function setGame(id){if(id)curGame=id}
function play(game,moment,extra){
  try{
    if(game)curGame=game;
    const g=game||curGame;
    const st=styleOf(g);
    if(!st){rec(g,moment,false,'no-style');return false}
    if(!sOn()||document.hidden){rec(g,moment,true,'muted');return true}
    const c=ctx(), out=dest(c);
    if(!c||!out){rec(g,moment,false,'no-bus');return false}
    if(c.state==='suspended')try{c.resume()}catch(e){}
    if(!booted) booted=true;
    const pack=PLAY[st];
    let m=moment;
    if(m==='finale'){
      if(jackpotPlayed[g]){rec(g,'finale',true,'skip-dup');return true}
      m=(extra&&extra.noAmt)?'burst':(extra&&extra.w>0?'jackpot':'burst');
    }
    if(!pack||typeof pack[m]!=='function'){rec(g,m,false,'no-recipe');return false}
    const t=c.currentTime+.02;
    const ok=!!pack[m](t,extra);
    if(ok&&(m==='jackpot'||m==='grand'||m==='burst')) jackpotPlayed[g]=1;
    rec(g,m,ok,ok?'':'missing-samples');
    return ok;
  }catch(e){note(e);rec(game,moment,false,String(e&&e.message||e));return false}
}
function resetFlags(game){if(game)jackpotPlayed[game]=0;else jackpotPlayed={};tickI=0}
function readyCount(){return Object.keys(KEY).filter(f=>has(KEY[f])).length}
function cut(){
  const c=ctx(), t=c?c.currentTime:0;
  playing.splice(0).forEach(n=>{try{if(n.stop)n.stop(t+.02)}catch(e){};if(n)n._dead=1});
}

window.FEATSX={play,cut,boot,setGame,reset:resetFlags,MAP,log,ready:readyCount,has,bufs,preload:idlePrefetch};
})();
