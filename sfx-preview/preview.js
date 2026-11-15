/* 龍運金殿 小遊戲音效試聽 v2 — real CC0 recordings, layered */
(function(){
"use strict";

const STYLES = [
  {id:"A", name:"金鑼戰鼓", desc:"真實銅鑼、戰鼓與鈸的重擊，低頻扎實，像廟會開場。"},
  {id:"B", name:"金幣雨爆", desc:"真實金幣與籌碼灑落，再疊上鐘鈴與風鈴，贏的時候金光四濺。"},
  {id:"C", name:"龍吼雷霆", desc:"真實雷聲、爆炸與龍吼錄音，氣勢最足、最有壓迫感。"},
  {id:"D", name:"霓虹電子", desc:"真實彈珠台、拉霸轉輪、電子鼓與爆裂聲，節奏明亮、收尾乾脆。"}
];

const GAMES = [
  {id:"plinko", name:"幸運彈珠", moments:[
    {id:"open", label:"開場"},
    {id:"shot", label:"發射"},
    {id:"hit", label:"碰撞"},
    {id:"land", label:"落袋"},
    {id:"jackpot", label:"大獎"}
  ]},
  {id:"twister", name:"旋風聚寶", moments:[
    {id:"open", label:"開場"},
    {id:"spin", label:"旋轉"},
    {id:"stop", label:"停止"},
    {id:"collect", label:"聚寶"},
    {id:"jackpot", label:"大獎"}
  ]},
  {id:"jewels", name:"寶珠對碰", moments:[
    {id:"lock", label:"鎖定"},
    {id:"respin", label:"重轉"},
    {id:"miss", label:"未中"},
    {id:"collect", label:"聚寶"},
    {id:"last", label:"最後一次"},
    {id:"grand", label:"巨獎"}
  ]},
  {id:"wheel", name:"三重彩金輪", moments:[
    {id:"spin", label:"旋轉"},
    {id:"stop", label:"停止"},
    {id:"minor", label:"小獎"},
    {id:"jackpot", label:"大獎"}
  ]},
  {id:"mult", name:"狂熱倍數", moments:[
    {id:"roll", label:"滾動"},
    {id:"lock", label:"鎖定"},
    {id:"burst", label:"加倍爆發"}
  ]}
];

const SFX = {
  gongBig:"sfx/gong-big.mp3?v=2", gongMid:"sfx/gong-mid.mp3?v=2", gongSweet:"sfx/gong-sweet.mp3?v=2",
  taikoA:"sfx/taiko-a.mp3?v=2", taikoB:"sfx/taiko-b.mp3?v=2", taikoC:"sfx/taiko-c.mp3?v=2",
  bassTom:"sfx/bass-tom.mp3?v=2", tomMid:"sfx/tom-mid.mp3?v=2", snare:"sfx/snare.mp3?v=2",
  cymbal:"sfx/cymbal.mp3?v=2", cymbalTemple:"sfx/cymbal-temple.mp3?v=2",
  thunder:"sfx/thunder.mp3?v=2", thunderLow:"sfx/thunder-low.mp3?v=2",
  boom:"sfx/boom.mp3?v=2", boomFar:"sfx/boom-far.mp3?v=2", cracker:"sfx/cracker.mp3?v=2",
  coins:"sfx/coins.mp3?v=2", coinsB:"sfx/coins-b.mp3?v=2", coin:"sfx/coin.mp3?v=2", coinB:"sfx/coin-b.mp3?v=2",
  chips:"sfx/chips.mp3?v=2", chipsB:"sfx/chips-b.mp3?v=2",
  bellChurch:"sfx/bell-church.mp3?v=2", bellBox:"sfx/bell-box.mp3?v=2", bellSmall:"sfx/bell-small.mp3?v=2",
  chime:"sfx/chime.mp3?v=2", chimePend:"sfx/chime-pend.mp3?v=2", counterBell:"sfx/counter-bell.mp3?v=2",
  whoosh:"sfx/whoosh.mp3?v=2", whooshB:"sfx/whoosh-b.mp3?v=2", whooshAir:"sfx/whoosh-air.mp3?v=2",
  ballA:"sfx/ball-a.mp3?v=2", ballB:"sfx/ball-b.mp3?v=2", ballC:"sfx/ball-c.mp3?v=2",
  flipper:"sfx/flipper.mp3?v=2", flipperB:"sfx/flipper-b.mp3?v=2", knocker:"sfx/knocker.mp3?v=2",
  reel:"sfx/reel.mp3?v=2", reelStop:"sfx/reel-stop.mp3?v=2", ratchet:"sfx/ratchet.mp3?v=2", reelMech:"sfx/reel-mech.mp3?v=2",
  roar:"sfx/roar.mp3?v=2", roarB:"sfx/roar-b.mp3?v=2", growl:"sfx/growl.mp3?v=2",
  anvil:"sfx/anvil.mp3?v=2", gavel:"sfx/gavel.mp3?v=2", theater:"sfx/theater.mp3?v=2",
  edrum:"sfx/edrum.mp3?v=2", chimesCluster:"sfx/chimes-cluster.mp3?v=2", bumper:"sfx/bumper.mp3?v=2"
};

const errors=[];
function noteErr(e){try{errors.push(String(e&&e.message||e));console.error(e)}catch(_){}}

let live=null, buffers=null, playing=[], meterTimer=0, hitSeq=0;

function makeSoftClip(n){
  const c=new Float32Array(n||2048);
  for(let i=0;i<c.length;i++){const x=i/(c.length-1)*2-1;c[i]=Math.tanh(x*1.12)}
  return c;
}
function makeIR(ctx,t,decay){
  const n=Math.max(1,Math.ceil(ctx.sampleRate*(t||1.15)));
  const b=ctx.createBuffer(2,n,ctx.sampleRate);
  for(let ch=0;ch<2;ch++){
    const d=b.getChannelData(ch);
    for(let i=0;i<n;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/n, decay||3.4);
  }
  return b;
}
function buildGraph(ctx){
  const input=ctx.createGain();input.gain.value=1;
  const dry=ctx.createGain();dry.gain.value=1;
  const revSend=ctx.createGain();revSend.gain.value=.22;
  const conv=ctx.createConvolver();conv.buffer=makeIR(ctx,1.2,3.3);
  const master=ctx.createGain();master.gain.value=.78;
  const comp=ctx.createDynamicsCompressor();
  comp.threshold.value=-18;comp.knee.value=10;comp.ratio.value=3.2;comp.attack.value=.004;comp.release.value=.14;
  const limit=ctx.createDynamicsCompressor();
  limit.threshold.value=-2.2;limit.knee.value=0;limit.ratio.value=18;limit.attack.value=.001;limit.release.value=.08;
  const clip=ctx.createWaveShaper();clip.curve=makeSoftClip(2048);clip.oversample="2x";
  const outGain=ctx.createGain();outGain.gain.value=.9;
  const analyser=ctx.createAnalyser();analyser.fftSize=1024;analyser.smoothingTimeConstant=.5;
  input.connect(dry);input.connect(revSend);revSend.connect(conv);
  dry.connect(master);conv.connect(master);
  master.connect(comp);comp.connect(limit);limit.connect(clip);clip.connect(outGain);
  outGain.connect(analyser);
  if(ctx.destination) outGain.connect(ctx.destination);
  return {ctx,input,master,revSend,analyser,outGain};
}
function track(node,stopAt){
  playing.push({node,stopAt});
  try{if(node.stop) node.stop(stopAt)}catch(e){}
}

function hit(graph,name,t,opt){
  opt=opt||{};
  const buf=graph.buffers[name];
  if(!buf){noteErr("missing sample "+name);return}
  const c=graph.ctx, src=c.createBufferSource();
  src.buffer=buf;
  const rate=opt.rate||1;
  src.playbackRate.setValueAtTime(rate,t);
  if(opt.rate2) src.playbackRate.exponentialRampToValueAtTime(Math.max(.25,opt.rate2),t+Math.max(.05,opt.dur||buf.duration/rate));
  const g=c.createGain();
  const v=opt.gain==null?.8:opt.gain;
  const a=opt.a||.003;
  const dur=(opt.dur!=null?opt.dur:(buf.duration/rate));
  const fade=opt.fade==null?Math.min(.08,dur*.2):opt.fade;
  g.gain.setValueAtTime(0,t);
  g.gain.linearRampToValueAtTime(v,t+a);
  const rel=t+Math.max(a+.02, dur-fade);
  g.gain.setValueAtTime(v,rel);
  g.gain.exponentialRampToValueAtTime(.0008,t+dur+.01);
  let node=src;
  if(opt.lp||opt.hp){
    const fl=c.createBiquadFilter();
    fl.type=opt.hp?"highpass":"lowpass";
    fl.frequency.value=opt.hp||opt.lp;
    fl.Q.value=opt.q||.7;
    src.connect(fl);node=fl;
  }
  node.connect(g);g.connect(graph.input);
  try{
    src.start(t, opt.off||0, opt.slice);
    track(src, t+dur+.08);
  }catch(e){noteErr(e)}
}
function sub(graph,t,v,f,f2,d){
  const c=graph.ctx,o=c.createOscillator(),g=c.createGain(),fl=c.createBiquadFilter();
  o.type="sine";o.frequency.setValueAtTime(f||58,t);o.frequency.exponentialRampToValueAtTime(Math.max(20,f2||28),t+(d||.5));
  fl.type="lowpass";fl.frequency.value=220;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v||.22,t+.006);
  g.gain.exponentialRampToValueAtTime(.0008,t+(d||.5));
  o.connect(fl);fl.connect(g);g.connect(graph.input);
  o.start(t);track(o,t+(d||.5)+.05);
}

const BALLS=["ballA","ballB","ballC"];
const COINS=["coin","coinB","chips","chipsB"];

const PLAY={
  A:{
    open(g,t){ hit(g,"taikoA",t,{gain:.9}); hit(g,"gongBig",t,{gain:.72,rate:.98}); hit(g,"bassTom",t,{gain:.7,rate:.92}); hit(g,"cymbalTemple",t+.02,{gain:.35}); hit(g,"anvil",t,{gain:.28,lp:1800}); sub(g,t,.28,62,26,.55); },
    shot(g,t){ hit(g,"whooshAir",t,{gain:.7}); hit(g,"whoosh",t+.02,{gain:.55,rate:1.05}); hit(g,"gongSweet",t+.12,{gain:.28,rate:1.15,lp:4000}); },
    hit(g,t,k){ const i=(k||0)%3; hit(g,BALLS[i],t,{gain:.85,rate:1+(i*.04)}); hit(g,"knocker",t,{gain:.28,rate:1.15+((k||0)%4)*.04}); hit(g,"snare",t,{gain:.18,rate:1.2,hp:800}); },
    land(g,t){ hit(g,"taikoB",t,{gain:.9}); hit(g,"gongMid",t,{gain:.6}); hit(g,"theater",t,{gain:.4}); hit(g,"coin",t+.04,{gain:.45}); sub(g,t,.3,64,26,.55); },
    jackpot(g,t){ hit(g,"gongBig",t,{gain:.8}); hit(g,"taikoA",t,{gain:.85}); hit(g,"cymbal",t,{gain:.45}); hit(g,"bellChurch",t+.04,{gain:.55}); hit(g,"coins",t+.06,{gain:.7}); hit(g,"chimesCluster",t+.1,{gain:.4}); sub(g,t,.32,52,24,.7); },
    spin(g,t){ hit(g,"ratchet",t,{gain:.55}); hit(g,"reelMech",t,{gain:.4,rate:1.05}); hit(g,"snare",t+.15,{gain:.12,rate:1.1}); hit(g,"snare",t+.45,{gain:.1,rate:1.2}); hit(g,"snare",t+.75,{gain:.1,rate:1.3}); hit(g,"cymbalTemple",t,{gain:.18,off:.05}); },
    stop(g,t){ hit(g,"taikoC",t,{gain:.9}); hit(g,"gongMid",t,{gain:.65}); hit(g,"anvil",t,{gain:.4}); sub(g,t,.28,70,28,.45); },
    collect(g,t){ for(let i=0;i<7;i++){ hit(g,i%2?"counterBell":"coin",t+i*.07,{gain:.32,rate:1+i*.03,dur:.35}); } },
    lock(g,t){ hit(g,"counterBell",t,{gain:.7}); hit(g,"gongSweet",t,{gain:.3,rate:1.2,dur:.6}); },
    respin(g,t){ hit(g,"ratchet",t,{gain:.55}); hit(g,"whoosh",t,{gain:.4}); },
    miss(g,t){ hit(g,"gavel",t,{gain:.55,rate:.9,lp:1600}); hit(g,"tomMid",t,{gain:.25,rate:.85,lp:800}); },
    last(g,t){ hit(g,"taikoB",t,{gain:.55,rate:.95}); hit(g,"bellBox",t,{gain:.35}); hit(g,"theater",t,{gain:.35}); },
    grand(g,t){ hit(g,"gongBig",t,{gain:.85}); hit(g,"taikoA",t,{gain:.9}); hit(g,"taikoC",t+.12,{gain:.55,rate:.92}); hit(g,"cymbal",t,{gain:.5}); hit(g,"bellChurch",t+.05,{gain:.6}); hit(g,"coins",t+.08,{gain:.65}); hit(g,"chimesCluster",t+.1,{gain:.45}); sub(g,t,.34,50,22,.8); },
    minor(g,t){ hit(g,"gongSweet",t,{gain:.65}); hit(g,"coinsB",t,{gain:.55}); hit(g,"bellSmall",t,{gain:.5}); hit(g,"taikoC",t,{gain:.4,rate:1.05}); },
    roll(g,t){ hit(g,"ratchet",t,{gain:.5}); for(let i=0;i<8;i++) hit(g,"tomMid",t+i*.1,{gain:.22,rate:.95+i*.04,dur:.2}); },
    burst(g,t){ hit(g,"taikoA",t,{gain:.9}); hit(g,"gongMid",t,{gain:.7}); hit(g,"cymbal",t,{gain:.45}); hit(g,"coinsB",t+.05,{gain:.4}); sub(g,t,.3,60,26,.55); }
  },
  B:{
    open(g,t){ hit(g,"coins",t,{gain:.8}); hit(g,"chips",t,{gain:.5}); hit(g,"chime",t,{gain:.45}); hit(g,"bellSmall",t,{gain:.4}); hit(g,"taikoC",t,{gain:.35,lp:900}); sub(g,t,.16,70,32,.4); },
    shot(g,t){ hit(g,"whoosh",t,{gain:.5,hp:400}); hit(g,"coinsB",t,{gain:.45}); hit(g,"coin",t+.08,{gain:.55,rate:1.1}); },
    hit(g,t,k){ const n=COINS[(k||0)%4]; hit(g,n,t,{gain:.8,rate:.96+((k||0)%5)*.05}); hit(g,BALLS[(k||0)%3],t,{gain:.25}); },
    land(g,t){ hit(g,"coins",t,{gain:.85}); hit(g,"coinB",t,{gain:.55}); hit(g,"bellSmall",t,{gain:.5}); hit(g,"tomMid",t,{gain:.4}); sub(g,t,.18,64,30,.45); },
    jackpot(g,t){ hit(g,"coins",t,{gain:.9}); hit(g,"coinsB",t+.08,{gain:.7}); hit(g,"chimesCluster",t,{gain:.55}); hit(g,"bellChurch",t+.04,{gain:.5}); hit(g,"chime",t+.06,{gain:.45}); hit(g,"chipsB",t,{gain:.4}); hit(g,"gongSweet",t,{gain:.3}); sub(g,t,.22,55,26,.6); },
    spin(g,t){ hit(g,"coinsB",t,{gain:.45}); hit(g,"reelMech",t,{gain:.3}); for(let i=0;i<8;i++) hit(g,COINS[i%4],t+i*.16,{gain:.35,rate:1+i*.03,dur:.3}); },
    stop(g,t){ hit(g,"chime",t,{gain:.55}); hit(g,"coins",t,{gain:.7}); hit(g,"bellSmall",t,{gain:.45}); hit(g,"bassTom",t,{gain:.35}); },
    collect(g,t){ for(let i=0;i<8;i++) hit(g,COINS[i%4],t+i*.06,{gain:.5,rate:1+i*.04,dur:.28}); },
    lock(g,t){ hit(g,"coinB",t,{gain:.8,rate:1.08}); hit(g,"bellSmall",t,{gain:.5}); hit(g,"chimePend",t,{gain:.3,dur:.5}); },
    respin(g,t){ hit(g,"coinsB",t,{gain:.5}); hit(g,"whooshB",t,{gain:.4}); },
    miss(g,t){ hit(g,"coin",t,{gain:.3,rate:.8,lp:2500}); },
    last(g,t){ hit(g,"chimePend",t,{gain:.45}); hit(g,"coinB",t,{gain:.5}); hit(g,"bellSmall",t+.05,{gain:.4}); },
    grand(g,t){ hit(g,"coins",t,{gain:.9}); hit(g,"coinsB",t+.1,{gain:.8}); hit(g,"chimesCluster",t,{gain:.6}); hit(g,"bellChurch",t,{gain:.55}); hit(g,"chime",t+.05,{gain:.5}); hit(g,"gongSweet",t,{gain:.4}); hit(g,"chipsB",t,{gain:.45}); sub(g,t,.24,50,24,.7); },
    minor(g,t){ hit(g,"coinsB",t,{gain:.7}); hit(g,"chime",t,{gain:.45}); hit(g,"bellSmall",t,{gain:.5}); },
    roll(g,t){ for(let i=0;i<9;i++) hit(g,COINS[i%4],t+i*.09,{gain:.4,rate:.95+i*.04,dur:.22}); },
    burst(g,t){ hit(g,"coins",t,{gain:.85}); hit(g,"chime",t,{gain:.5}); hit(g,"bellBox",t,{gain:.3}); hit(g,"chips",t,{gain:.45}); sub(g,t,.18,70,30,.45); }
  },
  C:{
    open(g,t){ hit(g,"roar",t,{gain:.85}); hit(g,"thunder",t,{gain:.7}); hit(g,"boom",t,{gain:.7}); hit(g,"taikoA",t,{gain:.45,lp:600}); sub(g,t,.32,48,22,.7); },
    shot(g,t){ hit(g,"whooshAir",t,{gain:.7}); hit(g,"whoosh",t,{gain:.45}); hit(g,"growl",t,{gain:.4,dur:.6,rate:1.05}); },
    hit(g,t,k){ hit(g,(k||0)%2?"cracker":"boomFar",t,{gain:.55,rate:.95+((k||0)%3)*.06}); hit(g,"flipper",t,{gain:.35}); hit(g,"ballA",t,{gain:.4,rate:1.1}); },
    land(g,t){ hit(g,"thunderLow",t,{gain:.8}); hit(g,"roarB",t,{gain:.7,dur:1.4}); hit(g,"boom",t,{gain:.7}); hit(g,"taikoB",t,{gain:.5}); sub(g,t,.34,58,24,.65); },
    jackpot(g,t){ hit(g,"roar",t,{gain:.9}); hit(g,"thunder",t,{gain:.75}); hit(g,"boom",t,{gain:.7}); hit(g,"gongBig",t,{gain:.45,lp:2500}); hit(g,"cymbal",t,{gain:.3}); hit(g,"taikoA",t,{gain:.5}); sub(g,t,.36,46,22,.85); },
    spin(g,t){ hit(g,"growl",t,{gain:.45,rate:.92}); hit(g,"thunderLow",t,{gain:.35,off:.2}); hit(g,"whooshAir",t,{gain:.35}); hit(g,"reelMech",t,{gain:.2,lp:800}); },
    stop(g,t){ hit(g,"thunder",t,{gain:.8}); hit(g,"boom",t,{gain:.75}); hit(g,"anvil",t,{gain:.4}); sub(g,t,.32,66,24,.55); },
    collect(g,t){ for(let i=0;i<7;i++) hit(g,i%2?"boomFar":"theater",t+i*.08,{gain:.3,rate:.9+i*.04,dur:.28}); },
    lock(g,t){ hit(g,"growl",t,{gain:.45,dur:.55,rate:1.1}); hit(g,"knocker",t,{gain:.4}); },
    respin(g,t){ hit(g,"whooshAir",t,{gain:.55}); hit(g,"growl",t,{gain:.4,dur:.7}); },
    miss(g,t){ hit(g,"boomFar",t,{gain:.4,rate:.85,lp:900}); },
    last(g,t){ hit(g,"growl",t,{gain:.55}); hit(g,"thunder",t,{gain:.4,dur:1}); },
    grand(g,t){ hit(g,"roar",t,{gain:.9}); hit(g,"roarB",t+.15,{gain:.5,rate:.95}); hit(g,"thunder",t,{gain:.75}); hit(g,"thunderLow",t+.08,{gain:.55}); hit(g,"boom",t,{gain:.75}); hit(g,"taikoA",t,{gain:.55}); hit(g,"gongBig",t,{gain:.4}); sub(g,t,.38,44,20,.95); },
    minor(g,t){ hit(g,"roarB",t,{gain:.65,dur:1.3}); hit(g,"thunder",t,{gain:.5}); hit(g,"coinsB",t,{gain:.25}); },
    roll(g,t){ hit(g,"growl",t,{gain:.4,rate:.9}); for(let i=0;i<8;i++) hit(g,"boomFar",t+i*.11,{gain:.22,rate:.9+i*.03,dur:.2}); },
    burst(g,t){ hit(g,"roar",t,{gain:.85}); hit(g,"thunder",t,{gain:.7}); hit(g,"boom",t,{gain:.75}); hit(g,"taikoB",t,{gain:.5}); sub(g,t,.34,55,22,.7); }
  },
  D:{
    open(g,t){ hit(g,"edrum",t,{gain:.85}); hit(g,"knocker",t,{gain:.55}); hit(g,"boom",t,{gain:.55}); hit(g,"bumper",t+.02,{gain:.4}); sub(g,t,.22,80,30,.4); },
    shot(g,t){ hit(g,"whoosh",t,{gain:.6,rate:1.15}); hit(g,"whooshB",t,{gain:.4}); hit(g,"bumper",t+.12,{gain:.45,rate:1.1}); },
    hit(g,t,k){ const n=["knocker","bumper","flipper","edrum"][(k||0)%4]; hit(g,n,t,{gain:.75,rate:1+((k||0)%5)*.05}); hit(g,BALLS[(k||0)%3],t,{gain:.3,rate:1.15}); },
    land(g,t){ hit(g,"reelStop",t,{gain:.7,off:.15,dur:.7}); hit(g,"edrum",t,{gain:.8}); hit(g,"boom",t,{gain:.55}); hit(g,"knocker",t,{gain:.45}); sub(g,t,.24,80,30,.45); },
    jackpot(g,t){ hit(g,"reelStop",t,{gain:.75}); hit(g,"edrum",t,{gain:.8}); hit(g,"knocker",t,{gain:.5}); hit(g,"cracker",t,{gain:.55}); hit(g,"boom",t,{gain:.5}); hit(g,"chime",t+.08,{gain:.3}); sub(g,t,.26,70,28,.55); },
    spin(g,t){ hit(g,"reel",t,{gain:.75}); hit(g,"ratchet",t,{gain:.25,lp:4000}); },
    stop(g,t){ hit(g,"reelStop",t,{gain:.85}); hit(g,"knocker",t,{gain:.6}); hit(g,"edrum",t,{gain:.5}); sub(g,t,.2,90,32,.4); },
    collect(g,t){ for(let i=0;i<8;i++) hit(g,i%2?"knocker":"flipper",t+i*.06,{gain:.45,rate:1+i*.04,dur:.22}); },
    lock(g,t){ hit(g,"bumper",t,{gain:.7,rate:1.08}); hit(g,"knocker",t,{gain:.5}); },
    respin(g,t){ hit(g,"reel",t,{gain:.6,dur:1.1}); hit(g,"whooshB",t,{gain:.4}); },
    miss(g,t){ hit(g,"flipperB",t,{gain:.4,rate:.9,lp:2000}); },
    last(g,t){ hit(g,"edrum",t,{gain:.6}); hit(g,"knocker",t,{gain:.5,rate:.92}); },
    grand(g,t){ hit(g,"reelStop",t,{gain:.8}); hit(g,"edrum",t,{gain:.85}); hit(g,"boom",t,{gain:.65}); hit(g,"knocker",t,{gain:.55}); hit(g,"cracker",t+.05,{gain:.5}); hit(g,"chime",t+.08,{gain:.35}); hit(g,"bumper",t,{gain:.4}); sub(g,t,.28,65,26,.6); },
    minor(g,t){ hit(g,"knocker",t,{gain:.6}); hit(g,"edrum",t,{gain:.55}); hit(g,"coin",t,{gain:.35}); },
    roll(g,t){ hit(g,"reel",t,{gain:.55,dur:1.2}); for(let i=0;i<8;i++) hit(g,i%2?"knocker":"bumper",t+i*.1,{gain:.28,rate:1+i*.03,dur:.18}); },
    burst(g,t){ hit(g,"edrum",t,{gain:.85}); hit(g,"boom",t,{gain:.6}); hit(g,"reelStop",t,{gain:.55}); hit(g,"knocker",t,{gain:.5}); sub(g,t,.24,75,28,.45); }
  }
};

const DEMOS={
  plinko:[["open",0],["shot",.55],["hit",.88],["hit",1.04],["hit",1.2],["hit",1.36],["hit",1.52],["land",1.78],["jackpot",2.08]],
  twister:[["open",0],["spin",.5],["stop",2.2],["collect",2.5],["jackpot",3.15]],
  jewels:[["lock",0],["lock",.2],["lock",.4],["respin",.75],["miss",1.12],["lock",1.32],["collect",1.65],["last",2.25],["grand",2.75]],
  wheel:[["spin",0],["stop",1.85],["jackpot",2.15]],
  mult:[["roll",0],["lock",1.15],["burst",1.55]]
};
const DEMO_LEN={plinko:3.6, twister:4.8, jewels:4.7, wheel:3.5, mult:2.8};

function playMoment(graph,style,moment,when,extra){
  const pack=PLAY[style]; if(!pack||!pack[moment]) return 0;
  const t=when!=null?when:graph.ctx.currentTime+.03;
  try{pack[moment](graph,t,extra)}catch(e){noteErr(e)}
  return t;
}
function playDemo(graph,game,style,when){
  const seq=DEMOS[game]; if(!seq) return 0;
  const t0=when!=null?when:graph.ctx.currentTime+.04;
  seq.forEach(([m,off],i)=>playMoment(graph,style,m,t0+off,i));
  return DEMO_LEN[game]||2.5;
}

async function loadBuffers(ctx, onProg){
  const keys=Object.keys(SFX), out={};
  let done=0;
  await Promise.all(keys.map(async k=>{
    try{
      const res=await fetch(SFX[k]);
      if(!res.ok) throw new Error("HTTP "+res.status+" "+k);
      const arr=await res.arrayBuffer();
      out[k]=await ctx.decodeAudioData(arr.slice(0));
    }catch(e){noteErr(e)}
    done++; if(onProg) onProg(done,keys.length);
  }));
  return out;
}

async function unlock(onProg){
  try{
    if(!live){
      const AC=window.AudioContext||window.webkitAudioContext;
      const ctx=new AC();
      live=buildGraph(ctx);
      live.ctx=ctx;
    }
    if(live.ctx.state==="suspended") await live.ctx.resume();
    if(!buffers){
      buffers=await loadBuffers(live.ctx,onProg);
      live.buffers=buffers;
    }
    if(live.ctx.state==="suspended") await live.ctx.resume();
    return live.ctx.state!=="suspended" && !!buffers;
  }catch(e){noteErr(e);return false}
}
function stopLive(){
  if(!live)return;
  const t=live.ctx.currentTime;
  playing.slice().forEach(p=>{try{if(p.node.stop)p.node.stop(t+.02)}catch(e){}});
  playing=[];
  try{
    live.input.gain.cancelScheduledValues(t);
    live.input.gain.setValueAtTime(0,t);
    live.input.gain.setTargetAtTime(1,t+.08,.04);
  }catch(e){}
}
function meterTick(){
  if(!live||!live.analyser)return 0;
  const a=live.analyser, buf=meterTick._b||(meterTick._b=new Uint8Array(a.fftSize));
  a.getByteTimeDomainData(buf);
  let p=0; for(let i=0;i<buf.length;i++){const v=Math.abs(buf[i]-128)/128; if(v>p)p=v}
  return p;
}

async function runSelfTest(){
  const report={ok:true,cases:[],errors:[]};
  const AC=window.OfflineAudioContext||window.webkitOfflineAudioContext;
  if(!AC){report.ok=false;report.errors.push("no OfflineAudioContext");return report}
  try{
    const ctx=new AC(2, Math.ceil(44100*1.2), 44100);
    const bufs=await loadBuffers(ctx);
    const missing=Object.keys(SFX).filter(k=>!bufs[k]);
    if(missing.length){report.ok=false;report.errors.push("missing "+missing.join(","))}
    report.loaded=Object.keys(bufs).length;
    const styles=["A","B","C","D"], moments=["open","shot","hit","land","jackpot","spin","stop","collect","lock","respin","miss","last","grand","minor","roll","burst"];
    for(const st of styles){
      for(const m of moments){
        try{
          const oc=new AC(2, Math.ceil(44100*2.6), 44100);
          const graph=buildGraph(oc); graph.buffers=bufs;
          PLAY[st][m](graph, 0.05, 2);
          const rendered=await oc.startRendering();
          let peak=0,nan=0,rms=0,n=rendered.length,ch=rendered.numberOfChannels;
          for(let c=0;c<ch;c++){
            const d=rendered.getChannelData(c);
            for(let i=0;i<d.length;i++){
              const x=d[i]; if(!Number.isFinite(x)) nan++;
              const a=Math.abs(x); if(a>peak) peak=a; rms+=x*x;
            }
          }
          rms=Math.sqrt(rms/(n*ch));
          const rec={st,m,peak:+peak.toFixed(4),rms:+rms.toFixed(4),nan,clip:peak>1};
          if(nan||peak>1||peak<.02){rec.fail=true;report.ok=false}
          report.cases.push(rec);
        }catch(e){report.ok=false;report.errors.push(st+"."+m+": "+(e&&e.message||e))}
      }
    }
  }catch(e){report.ok=false;report.errors.push(String(e&&e.message||e))}
  report.errorLog=errors.slice();
  return report;
}

/* ---------- UI ---------- */
let curGame="plinko", unlocked=false, activeBtn=null, stopTimer=0;
const $=id=>document.getElementById(id);
function setStatus(s){const e=$("status"); if(e) e.textContent=s}
function mark(btn,on){
  if(activeBtn) activeBtn.classList.remove("play");
  activeBtn=on?btn:null;
  if(activeBtn) activeBtn.classList.add("play");
}
function renderGames(){
  const nav=$("games");
  nav.innerHTML=GAMES.map(g=>'<button type="button" data-game="'+g.id+'" aria-selected="'+(g.id===curGame)+'">'+g.name+"</button>").join("");
  nav.querySelectorAll("button").forEach(b=>b.addEventListener("click",async()=>{
    curGame=b.getAttribute("data-game"); renderGames(); renderPanel();
    if(!unlocked) await tryUnlock();
  }));
}
function renderLegend(){
  $("legend").innerHTML=STYLES.map(s=>"<li><b>"+s.id+" "+s.name+"</b>　"+s.desc+"</li>").join("");
}
function renderPanel(){
  const game=GAMES.find(g=>g.id===curGame);
  $("panel").innerHTML=STYLES.map(s=>{
    const btns=game.moments.map(m=>'<button type="button" data-style="'+s.id+'" data-moment="'+m.id+'">'+m.label+"</button>").join("")
      +'<button type="button" class="demo" data-style="'+s.id+'" data-moment="demo">連續示範</button>';
    return '<article class="card" data-style="'+s.id+'"><div class="hd"><span class="badge">'+s.id+'</span><div><h2>'+s.name+'</h2><p class="desc">'+s.desc+"</p></div></div><div class=\"moments\">"+btns+"</div></article>";
  }).join("");
  $("panel").querySelectorAll("button").forEach(btn=>btn.addEventListener("click",()=>onPlay(btn)));
}
async function tryUnlock(){
  setStatus("正在載入真實音效…");
  const ok=await unlock((d,n)=>setStatus("正在載入真實音效（"+d+"／"+n+"）…"));
  unlocked=!!ok;
  const b=$("btnUnlock"), st=$("btnStop"), mt=$("meter");
  if(unlocked){
    b.classList.add("on"); b.textContent="音效已開啟";
    st.hidden=false; mt.hidden=false;
    setStatus("音效已開啟。點時機或「連續示範」試聽。");
    startMeter();
  }else{
    setStatus("無法開啟或載入音效，請再點一次，或檢查網路與靜音開關。");
  }
  return unlocked;
}
function startMeter(){
  if(meterTimer) cancelAnimationFrame(meterTimer);
  const bar=$("meter").querySelector("i");
  const step=()=>{
    const p=meterTick();
    if(bar) bar.style.width=Math.min(100,Math.round(p*140))+"%";
    meterTimer=requestAnimationFrame(step);
  };
  step();
}
async function onPlay(btn){
  if(!unlocked){const ok=await tryUnlock(); if(!ok) return}
  else if(live&&live.ctx.state==="suspended") await live.ctx.resume();
  stopLive();
  const style=btn.getAttribute("data-style");
  const moment=btn.getAttribute("data-moment");
  const game=GAMES.find(g=>g.id===curGame);
  const st=STYLES.find(s=>s.id===style);
  mark(btn,true);
  let dur=.9;
  try{
    if(moment==="demo"){
      dur=playDemo(live,curGame,style);
      setStatus("連續示範："+game.name+"・"+st.id+" "+st.name);
    }else{
      const extra=moment==="hit"?(hitSeq++%6):0;
      playMoment(live,style,moment,null,extra);
      const lab=(game.moments.find(m=>m.id===moment)||{}).label||moment;
      setStatus("播放中："+game.name+"・"+st.id+" "+st.name+"・"+lab);
      dur=(moment==="jackpot"||moment==="grand"||moment==="spin")?2.3:(moment==="open"||moment==="burst"||moment==="land"?1.6:.8);
    }
  }catch(e){noteErr(e);setStatus("播放時發生錯誤，請再試一次。");mark(btn,false);return}
  clearTimeout(stopTimer);
  stopTimer=setTimeout(()=>{mark(btn,false);setStatus("音效已開啟。點時機或「連續示範」試聽。")},dur*1000+80);
}
function bindDock(){
  $("btnUnlock").addEventListener("click",()=>tryUnlock());
  $("btnStop").addEventListener("click",()=>{
    stopLive();mark(null,false);clearTimeout(stopTimer);
    setStatus("已停止。可再點時機繼續試聽。");
  });
  document.addEventListener("visibilitychange",()=>{
    if(document.hidden){stopLive();mark(null,false)}
  });
}
function boot(){renderGames();renderPanel();renderLegend();bindDock()}
window.__sfxPreview={unlock,stop:stopLive,playMoment,playDemo,runSelfTest,STYLES,GAMES,errors,getLive:()=>live,meterTick};
if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",boot);
else boot();
})();
