/* v28.119 feature hall SFX — styles B/C recorded samples on shared ac / AM.sfxG */
(function(){
"use strict";
const V='?v=28119', D='assets/sfx/';
const MAP={plinko:'C', jewels:'C', twister:'B', wheel:'B', mult:'B'};
const FILES=["b-fanfare","b-sparkle","b-alarm","c-ding","c-rapid","c-fanfare","chime","bell-small","bell-box","chimes-cluster","whoosh","whoosh-b","coin","coin-b","coins","coins-b","chips","tray","payout","reel","reel-stop","reel-mech","ratchet","knocker","flipper","flipper-b","bumper","ball-a","ball-b","ball-c","cheer","applause"];
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
const bufs={};
const log=[];
const playing=[];
let booted=false, curGame='', jackpotPlayed={};

function note(e){try{console.warn('featsfx',e)}catch(_){}}
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
function loadOne(file){
  const key=KEY[file];
  if(bufs[key] instanceof AudioBuffer)return Promise.resolve(bufs[key]);
  if(bufs[key]&&typeof bufs[key].then==='function')return bufs[key];
  bufs[key]=fetch(D+file+'.mp3'+V).then(r=>{if(!r.ok)throw new Error('HTTP '+r.status+' '+file);return r.arrayBuffer()}).then(ab=>{
    const c=ctx(); if(!c)throw new Error('no ctx');
    return dec(c,ab.slice(0));
  }).then(b=>{bufs[key]=b;return b}).catch(e=>{bufs[key]=null;note(e);return null});
  return bufs[key];
}
function boot(){
  if(booted)return;
  const c=ctx(); if(!c)return;
  booted=true;
  if(c.state==='suspended')try{c.resume()}catch(e){}
  FILES.forEach((f,i)=>setTimeout(()=>loadOne(f),25*i));
}
addEventListener('pointerdown',boot,{capture:true});
addEventListener('keydown',boot,{capture:true});

function track(node,stopAt){
  playing.push(node);
  try{if(node.stop&&stopAt!=null)node.stop(stopAt)}catch(e){}
}
function cut(){
  const c=ctx(), t=c?c.currentTime:0;
  playing.splice(0).forEach(n=>{try{if(n.stop)n.stop(t+.02)}catch(e){}});
}
function hit(name,when,opt){
  opt=opt||{};
  const b=bufs[name];
  if(!(b instanceof AudioBuffer))return null;
  const c=ctx(), out=dest(c);
  if(!c||!out)return null;
  if(c.state==='suspended')try{c.resume()}catch(e){}
  const t=when!=null?when:c.currentTime+.01;
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
    track(src, t+dur+.08);
  }catch(e){note(e);return null}
  return src;
}

const BALLS=["ballA","ballB","ballC"];
function cascade(t,n,gap,gain){
  let ok=0;
  for(let i=0;i<(n||5);i++) if(hit(BALLS[i%3],t+i*(gap||.07),{gain:(gain||.55)*(1-i*.06),rate:.95+(i%5)*.06,dur:.35})) ok++;
  return ok;
}
function hopper(t,gain){
  let n=0;
  if(hit("payout",t,{gain:gain==null?.7:gain})) n++;
  if(hit("tray",t,{gain:.45})) n++;
  if(hit("coins",t+.04,{gain:.5})) n++;
  return n;
}

function played(){let n=0; for(let i=0;i<arguments.length;i++) if(arguments[i]) n++; return n}
const PLAY={
  B:{
    open(t){return played(hit("chime",t,{gain:.45}),hit("bSparkle",t,{gain:.55}),hit("bellSmall",t,{gain:.3}))>0},
    shot(t){return played(hit("whoosh",t,{gain:.5,hp:350}),hit("bSparkle",t+.08,{gain:.35,dur:.6}))>0},
    hit(t,k){return played(hit(["coin","coinB","chips"][(k||0)%3],t,{gain:.7,rate:.97+((k||0)%5)*.05}),hit(BALLS[(k||0)%3],t,{gain:.28}))>0},
    land(t){return played(hit("bSparkle",t,{gain:.7}),hit("coin",t,{gain:.55}),hit("chime",t,{gain:.35}),hit("tray",t,{gain:.3}))>0},
    jackpot(t){return played(hit("bFanfare",t,{gain:.75}),hit("bAlarm",t+.12,{gain:.55}),hopper(t+.08,.6),hit("chimesCluster",t,{gain:.4}),hit("cheer",t+.2,{gain:.32}))>0},
    spin(t){return played(hit("reel",t,{gain:.62}),hit("chime",t,{gain:.18,dur:1.2}))>0},
    stop(t){return played(hit("reelStop",t,{gain:.7}),hit("chime",t,{gain:.45}),hit("coinB",t,{gain:.4}))>0},
    collect(t){return hopper(t,.65)+played(hit("bSparkle",t,{gain:.55}),hit("coinsB",t+.15,{gain:.4}))>0},
    tick(t,k){return !!hit(["coin","coinB","chips"][(k||0)%3],t,{gain:.32,rate:.96+((k||0)%6)*.04,dur:.22})},
    lock(t){return played(hit("bellSmall",t,{gain:.55}),hit("bSparkle",t,{gain:.4,dur:.6}))>0},
    respin(t){return played(hit("reel",t,{gain:.55,dur:1.1}),hit("whooshB",t,{gain:.32}))>0},
    miss(t){return played(hit("coin",t,{gain:.35,rate:.82,lp:2400}),hit("knocker",t,{gain:.22,rate:.85}))>0},
    last(t){return played(hit("bellBox",t,{gain:.42}),hit("chime",t,{gain:.4}))>0},
    grand(t){return played(hit("bFanfare",t,{gain:.78}),hit("bAlarm",t+.1,{gain:.6}),hopper(t+.05,.65),hit("chimesCluster",t,{gain:.48}),hit("cheer",t+.15,{gain:.38}),hit("applause",t+.2,{gain:.28}))>0},
    minor(t){return played(hit("bSparkle",t,{gain:.65}),hit("coinsB",t,{gain:.5}),hit("bellSmall",t,{gain:.4}))>0},
    roll(t){let n=hit("reel",t,{gain:.5,dur:1.2})?1:0;for(let i=0;i<7;i++) if(hit(["coin","coinB","chips"][i%3],t+i*.12,{gain:.28,rate:.98+i*.03,dur:.22})) n++; return n>0},
    burst(t){return played(hit("bFanfare",t,{gain:.72}),hopper(t,.5),hit("bSparkle",t,{gain:.45}),hit("cheer",t+.15,{gain:.25}))>0}
  },
  C:{
    open(t){return cascade(t,7,.06,.55)+played(hit("cRapid",t+.08,{gain:.55}))>0},
    shot(t){return played(hit("whoosh",t,{gain:.65,rate:1.2}),hit("flipper",t+.08,{gain:.5,rate:1.15}))>0},
    hit(t,k){return played(hit(BALLS[(k||0)%3],t,{gain:.85,rate:1+((k||0)%5)*.06}),hit("bumper",t,{gain:.4,rate:1.05+((k||0)%3)*.05}))>0},
    land(t){return played(hit("cDing",t,{gain:.85}),hit("ballA",t,{gain:.5}),hit("knocker",t,{gain:.28}))>0},
    jackpot(t){return played(hit("cFanfare",t,{gain:.78}),hit("cRapid",t+.05,{gain:.55}),cascade(t,10,.05,.5),hopper(t+.15,.5))>0},
    spin(t){return cascade(t,8,.08,.48)+played(hit("reelMech",t,{gain:.28,lp:3500}),hit("cRapid",t,{gain:.3,dur:1.0}))>0},
    stop(t){return played(hit("knocker",t,{gain:.55}),hit("cDing",t,{gain:.7}),hit("ballB",t,{gain:.45}))>0},
    collect(t){return cascade(t,8,.06,.5)+played(hit("coins",t,{gain:.45}),hit("cRapid",t,{gain:.5}))>0},
    tick(t,k){return !!hit(BALLS[(k||0)%3],t,{gain:.4,rate:1+((k||0)%4)*.05,dur:.22})},
    lock(t){return played(hit("cDing",t,{gain:.8}),hit("ballC",t,{gain:.4}))>0},
    respin(t){return played(hit("whooshB",t,{gain:.45,rate:1.1}),cascade(t,4,.07,.45))>0},
    miss(t){return played(hit("flipperB",t,{gain:.42,rate:.92,lp:2200}),hit("ballA",t,{gain:.28,rate:.85}))>0},
    last(t){return played(hit("cRapid",t,{gain:.45,dur:.7}),hit("bellSmall",t,{gain:.35}))>0},
    grand(t){return played(hit("cFanfare",t,{gain:.8}),hit("cRapid",t,{gain:.55}),cascade(t,12,.045,.52),hopper(t+.1,.55),hit("cheer",t+.25,{gain:.22}))>0},
    minor(t){return played(hit("cDing",t,{gain:.75}),hit("coinsB",t,{gain:.5}),hit("ballB",t,{gain:.35}))>0},
    roll(t){return cascade(t,9,.09,.45)+played(hit("ratchet",t,{gain:.28}))>0},
    burst(t){return played(hit("cFanfare",t,{gain:.75}),cascade(t,8,.05,.5),hit("coins",t,{gain:.45}))>0}
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
    boot();
    const c=ctx(), out=dest(c);
    if(!c||!out){rec(g,moment,false,'no-bus');return false}
    if(c.state==='suspended')try{c.resume()}catch(e){}
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
function resetFlags(game){if(game)jackpotPlayed[game]=0;else jackpotPlayed={}}
function readyCount(){return Object.keys(KEY).filter(f=>has(KEY[f])).length}

window.FEATSX={play,cut,boot,setGame,reset:resetFlags,MAP,log,ready:readyCount,has,bufs};
})();
