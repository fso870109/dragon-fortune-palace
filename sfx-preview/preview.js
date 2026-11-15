/* 龍運金殿 小遊戲音效試聽 — procedural WebAudio, no third-party samples */
(function(){
"use strict";

const STYLES = [
  {id:"A", name:"金鑼戰鼓", desc:"鑼鼓重擊、低頻衝擊，像廟會開場與戰鼓齊鳴。"},
  {id:"B", name:"金幣雨爆", desc:"大量金幣灑落與金屬閃音，贏的時候金光四濺。"},
  {id:"C", name:"龍吼雷霆", desc:"龍吟、雷聲與重低音爆炸，氣勢最足、最有壓迫感。"},
  {id:"D", name:"霓虹電子", desc:"合成器上升音與強力 drop，節奏明亮、收尾乾脆。"}
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

const errors = [];
function noteErr(e){try{errors.push(String(e&&e.message||e));console.error(e)}catch(_){}}

/* ---------- graph ---------- */
let live=null, playing=[], meterTimer=0, hitSeq=0;

function makeSoftClip(n){
  const c=new Float32Array(n||2048);
  for(let i=0;i<c.length;i++){const x=i/(c.length-1)*2-1;c[i]=Math.tanh(x*1.15)}
  return c;
}
function makeIR(ctx,t,decay){
  const n=Math.max(1,Math.ceil(ctx.sampleRate*(t||1.5)));
  const b=ctx.createBuffer(2,n,ctx.sampleRate);
  for(let ch=0;ch<2;ch++){
    const d=b.getChannelData(ch);
    for(let i=0;i<n;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/n, decay||3.1);
  }
  return b;
}
function makeNoise(ctx,dur,color){
  const n=Math.max(1,Math.ceil(ctx.sampleRate*Math.max(.02,dur||.4)));
  const b=ctx.createBuffer(1,n,ctx.sampleRate);
  const d=b.getChannelData(0);
  let b0=0,b1=0,b2=0;
  for(let i=0;i<n;i++){
    let w=Math.random()*2-1;
    if(color==="pink"){b0=.997*b0+.125*w;b1=.985*b1+.25*w;b2=.95*b2+.5*w;w=(b0+b1+b2)*.55}
    else if(color==="brown"){b0=(b0+.02*w)/1.02;w=b0*3.4}
    d[i]=w<-1?-1:w>1?1:w;
  }
  return b;
}
function buildGraph(ctx){
  const master=ctx.createGain();master.gain.value=.72;
  const comp=ctx.createDynamicsCompressor();
  comp.threshold.value=-16;comp.knee.value=10;comp.ratio.value=3.5;comp.attack.value=.003;comp.release.value=.16;
  const limit=ctx.createDynamicsCompressor();
  limit.threshold.value=-2.5;limit.knee.value=0;limit.ratio.value=18;limit.attack.value=.001;limit.release.value=.08;
  const clip=ctx.createWaveShaper();clip.curve=makeSoftClip(2048);clip.oversample="2x";
  const outGain=ctx.createGain();outGain.gain.value=.92;
  const analyser=ctx.createAnalyser();analyser.fftSize=1024;analyser.smoothingTimeConstant=.5;
  const conv=ctx.createConvolver();conv.buffer=makeIR(ctx,1.55,3.05);
  const revGain=ctx.createGain();revGain.gain.value=.28;
  const dry=ctx.createGain();dry.gain.value=1;
  const input=ctx.createGain();input.gain.value=1;
  const bus=ctx.createGain();bus.gain.value=1;
  input.connect(bus);
  bus.connect(dry);bus.connect(revGain);revGain.connect(conv);
  dry.connect(master);conv.connect(master);
  master.connect(comp);comp.connect(limit);limit.connect(clip);clip.connect(outGain);
  outGain.connect(analyser);
  if(ctx.destination) outGain.connect(ctx.destination);
  return {ctx,input,bus,master,revGain,analyser,outGain};
}
function env(g,t,a,h,d,v){
  const at=Math.max(.003,a||.008), hold=h||0, dec=Math.max(.03,d||.3), pk=Math.max(.0008,v||.2);
  g.gain.cancelScheduledValues(t);
  g.gain.setValueAtTime(0,t);
  g.gain.linearRampToValueAtTime(pk,t+at);
  if(hold>0) g.gain.setValueAtTime(pk,t+at+hold);
  g.gain.exponentialRampToValueAtTime(.0008,t+at+hold+dec);
}
function track(node,stopAt){
  playing.push({node,stopAt});
  try{if(node.stop) node.stop(stopAt)}catch(e){}
}
function osc(graph,type,f,t,dur,v,opt){
  opt=opt||{};
  const c=graph.ctx,o=c.createOscillator(),g=c.createGain(),fl=c.createBiquadFilter();
  o.type=type||"sine";
  o.frequency.setValueAtTime(Math.max(20,f),t);
  if(opt.f2) o.frequency.exponentialRampToValueAtTime(Math.max(20,opt.f2),t+Math.max(.03,dur));
  fl.type=opt.ft||"lowpass";
  fl.frequency.setValueAtTime(opt.ff||7200,t);
  if(opt.ff2) fl.frequency.exponentialRampToValueAtTime(Math.max(40,opt.ff2),t+dur);
  fl.Q.value=opt.q||.7;
  env(g,t,opt.a,opt.h,dur-(opt.a||.008)-(opt.h||0),v);
  o.connect(fl);fl.connect(g);g.connect(graph.input);
  o.start(t);track(o,t+dur+.05);
  return o;
}
function noise(graph,t,dur,v,opt){
  opt=opt||{};
  const c=graph.ctx,src=c.createBufferSource();
  src.buffer=makeNoise(c,Math.max(dur+.05,.08),opt.color||"white");
  const fl=c.createBiquadFilter(),g=c.createGain();
  fl.type=opt.ft||"bandpass";
  fl.frequency.setValueAtTime(opt.f||1800,t);
  if(opt.f2) fl.frequency.exponentialRampToValueAtTime(Math.max(40,opt.f2),t+dur);
  fl.Q.value=opt.q||.8;
  env(g,t,opt.a||.004,opt.h||0,dur-(opt.a||.004),v);
  src.connect(fl);fl.connect(g);g.connect(graph.input);
  src.start(t);track(src,t+dur+.04);
}
function sendRev(graph,amt,t,dur){
  const g=graph.revGain;
  if(!g||amt==null)return;
  try{
    const now=t, end=t+(dur||.4);
    const cur=g.gain.value;
    g.gain.setValueAtTime(cur,now);
    g.gain.linearRampToValueAtTime(amt,now+.02);
    g.gain.setValueAtTime(amt,end);
    g.gain.linearRampToValueAtTime(.28,end+.25);
  }catch(e){}
}

/* ---------- style voices ---------- */
function subBoom(g,t,v,f,f2,d){
  osc(g,"sine",f||62,t,d||.55,v||.46,{f2:f2||28,a:.005,ft:"lowpass",ff:240});
  osc(g,"sine",(f||62)*1.5,t,(d||.55)*.7,(v||.46)*.28,{f2:(f2||28)*1.2,a:.006,ft:"lowpass",ff:320});
}
function click(g,t,v,f){
  noise(g,t,.04,v||.22,{ft:"highpass",f:f||2800,q:.7,color:"white",a:.001});
  osc(g,"square",f||2200,t,.03,(v||.22)*.18,{f2:(f||2200)*.4,a:.001,ft:"highpass",ff:1200});
}

/* A 金鑼戰鼓 */
function gong(g,t,base,v,d){
  const parts=[1,1.49,2.01,2.74,3.13,4.27,5.33,6.71,8.12];
  parts.forEach((r,i)=>{
    const dec=(d||1.6)*(i<2?1:.55-i*.04);
    osc(g,i%2?"triangle":"sine",base*r,t,Math.max(.2,dec),(v||.22)*(i?(.22/Math.sqrt(i+1)):.55),{
      a:i? .008:.004, ft:"lowpass", ff:4200-i*280, f2:base*r*.985
    });
  });
  noise(g,t,.12,(v||.22)*.22,{ft:"bandpass",f:base*3.2,q:1.1,color:"pink",a:.002});
}
function taiko(g,t,v){
  osc(g,"sine",86,t,.42,(v||.5),{f2:36,a:.004,ft:"lowpass",ff:280});
  osc(g,"sine",52,t,.7,(v||.5)*.7,{f2:28,a:.006,ft:"lowpass",ff:180});
  osc(g,"triangle",118,t,.16,(v||.5)*.22,{f2:50,a:.003});
  noise(g,t,.09,(v||.5)*.28,{ft:"lowpass",f:420,q:.6,color:"brown",a:.002});
  click(g,t,(v||.5)*.35,1800);
}

/* B 金幣 */
function coin(g,t,v,f){
  const fq=f|| (1600+Math.random()*1400);
  osc(g,"sine",fq,t,.11,(v||.1),{a:.002,f2:fq*1.04,ft:"highpass",ff:700});
  osc(g,"triangle",fq*1.52,t,.07,(v||.1)*.55,{a:.002,f2:fq*.9});
  osc(g,"sine",fq*.5,t,.08,(v||.1)*.22,{a:.003});
}
function coins(g,t,n,v,span){
  const N=n||10, sp=span||.55;
  for(let i=0;i<N;i++){
    const off= (i/N)*sp + Math.random()*sp*.08;
    coin(g,t+off,(v||.09)*(0.75+Math.random()*.4), 1400+Math.random()*1800);
  }
}
function bell(g,t,f,v,d){
  [1,2.01,2.99,4.08,5.4].forEach((r,i)=>osc(g,"sine",f*r,t,d||.7,(v||.12)/(i+1),{a:.004,f2:f*r*.99,ft:"lowpass",ff:5000-i*400}));
}

/* C 龍吼雷霆 */
function rumble(g,t,d,v){
  osc(g,"sine",42,t,d||1,(v||.3),{f2:28,a:.04,ft:"lowpass",ff:140});
  osc(g,"sine",58,t,(d||1)*.85,(v||.3)*.4,{f2:34,a:.05,ft:"lowpass",ff:180});
  noise(g,t,d||1,(v||.3)*.35,{ft:"lowpass",f:160,q:.5,color:"brown",a:.03,h:.15});
}
function thunder(g,t,v){
  noise(g,t,.12,(v||.4)*.9,{ft:"highpass",f:800,q:.4,color:"white",a:.001});
  noise(g,t,.18,(v||.4)*.6,{ft:"bandpass",f:900,q:.7,color:"pink",a:.002});
  rumble(g,t,1.15,(v||.4)*.85);
  noise(g,t+.08,.7,(v||.4)*.28,{ft:"lowpass",f:220,f2:80,color:"brown",a:.02});
  subBoom(g,t,(v||.4)*.7,70,26,.7);
}
function roar(g,t,d,v){
  const dur=d||1.05;
  osc(g,"sawtooth",72,t,dur,(v||.22),{f2:46,a:.05,ft:"bandpass",ff:420,ff2:260,q:2.2});
  osc(g,"sawtooth",78.5,t,dur,(v||.22)*.7,{f2:52,a:.06,ft:"bandpass",ff:380,ff2:220,q:1.8});
  osc(g,"sawtooth",108,t,dur*.9,(v||.22)*.35,{f2:64,a:.07,ft:"lowpass",ff:700,ff2:280});
  noise(g,t,dur,(v||.22)*.55,{ft:"bandpass",f:620,f2:280,q:1.1,color:"pink",a:.04,h:.2});
  rumble(g,t,dur*.9,(v||.22)*.5);
}

/* D 霓虹電子 */
function supersaw(g,t,f,f2,d,v){
  const det=[-11,-7,-3,0,3,7,12];
  det.forEach((cents,i)=>{
    const k=Math.pow(2,cents/1200);
    osc(g,"sawtooth",f*k,t,d,(v||.08)*(i===3?.7:.38),{f2:(f2||f*4)*k,a:.04,ft:"lowpass",ff:600,ff2:4200,q:.8});
  });
}
function zap(g,t,v,f){
  osc(g,"square",f||1400,t,.09,(v||.12),{f2:220,a:.002,ft:"lowpass",ff:3800,ff2:800});
  click(g,t,(v||.12)*.6,3200);
}
function drop(g,t,v){
  osc(g,"sine",160,t,.42,(v||.4),{f2:32,a:.004,ft:"lowpass",ff:400});
  osc(g,"sawtooth",220,t,.28,(v||.4)*.22,{f2:50,a:.005,ft:"lowpass",ff:1800,ff2:300});
  noise(g,t,.1,(v||.4)*.3,{ft:"highpass",f:2000,color:"white",a:.001});
  subBoom(g,t,(v||.4)*.55,80,28,.5);
}

/* ---------- moments per style ---------- */
const PLAY = {
  A: {
    open(g,t){ sendRev(g,.42,t,1.1); taiko(g,t,.56); taiko(g,t+.09,.32); gong(g,t+.02,116,.32,1.7); subBoom(g,t,.4,58,26,.65); click(g,t,.3,2400); },
    shot(g,t){ noise(g,t,.38,.2,{ft:"highpass",f:400,f2:1800,color:"pink",a:.01,q:.5}); osc(g,"sine",240,t,.4,.16,{f2:70,ft:"lowpass",ff:900}); gong(g,t+.12,196,.12,.5); },
    hit(g,t,k){ const p=k||0; click(g,t,.28,2000+p*200); osc(g,"triangle",520+p*90,t,.1,.14,{f2:220}); gong(g,t,330+p*40,.08,.28); },
    land(g,t){ sendRev(g,.4,t,.9); taiko(g,t,.6); subBoom(g,t,.5,64,26,.7); gong(g,t,98,.34,1.5); coins(g,t+.08,5,.05,.2); },
    jackpot(g,t){ sendRev(g,.5,t,1.6); taiko(g,t,.62); taiko(g,t+.16,.4); gong(g,t,87,.42,2.1); gong(g,t+.05,130,.22,1.6); subBoom(g,t,.5,55,24,.9); [196,246,293,392,493].forEach((f,i)=>osc(g,"triangle",f,t+.12+i*.07,.7,.1)); },
    spin(g,t){ for(let i=0;i<14;i++){const off=i*.11; noise(g,t+off,.07,.1+i*.008,{ft:"bandpass",f:900+i*80,q:1.2,color:"pink"}); osc(g,"triangle",200+i*35,t+off,.08,.05);} rumble(g,t,1.6,.12); },
    stop(g,t){ taiko(g,t,.62); gong(g,t,110,.3,1.2); subBoom(g,t,.48,70,28,.55); click(g,t,.4,1600); },
    collect(g,t){ for(let i=0;i<8;i++){ osc(g,"square",700+i*90,t+i*.07,.05,.07); click(g,t+i*.07,.1,1800+i*80);} },
    lock(g,t){ gong(g,t,392,.14,.4); click(g,t,.22,2200); osc(g,"sine",880,t,.16,.1,{f2:1320}); },
    respin(g,t){ noise(g,t,.35,.16,{ft:"bandpass",f:500,f2:1600,q:.7,color:"pink"}); osc(g,"sawtooth",180,t,.4,.08,{f2:420,ft:"lowpass",ff:900}); },
    miss(g,t){ osc(g,"sine",180,t,.16,.1,{f2:90,ft:"lowpass",ff:400}); noise(g,t,.08,.08,{ft:"lowpass",f:400,color:"brown"}); },
    last(g,t){ taiko(g,t,.35); gong(g,t,146,.16,.6); osc(g,"triangle",196,t,.4,.1,{f2:140}); osc(g,"triangle",246,t+.12,.4,.08); },
    grand(g,t){ sendRev(g,.52,t,1.8); taiko(g,t,.64); taiko(g,t+.14,.48); taiko(g,t+.3,.3); gong(g,t,73,.48,2.3); gong(g,t,110,.28,1.8); subBoom(g,t,.55,50,22,1); [196,246,311,392,523].forEach((f,i)=>osc(g,"triangle",f,t+.1+i*.08,.85,.1)); },
    minor(g,t){ taiko(g,t,.36); gong(g,t,196,.24,.9); coins(g,t+.06,6,.06,.22); },
    roll(g,t){ for(let i=0;i<10;i++) osc(g,"square",500+i*70,t+i*.09,.05,.06); },
    burst(g,t){ taiko(g,t,.6); gong(g,t,98,.36,1.5); subBoom(g,t,.5,60,26,.7); [523,659,784,1047].forEach((f,i)=>osc(g,"triangle",f,t+.05+i*.06,.5,.1)); }
  },
  B: {
    open(g,t){ sendRev(g,.36,t,1); subBoom(g,t,.3,70,32,.45); bell(g,t,523,.16,1); coins(g,t,.16,.1,.45); click(g,t,.25,2600); },
    shot(g,t){ coins(g,t,7,.07,.22); osc(g,"sine",640,t,.32,.1,{f2:1400,ft:"highpass",ff:400}); noise(g,t,.3,.1,{ft:"highpass",f:2000,f2:5000,color:"white"}); },
    hit(g,t,k){ coin(g,t,.14,1800+(k||0)*120); coin(g,t+.02,.1,2400+(k||0)*80); },
    land(g,t){ sendRev(g,.38,t,.9); subBoom(g,t,.36,64,30,.5); bell(g,t,659,.14,.8); coins(g,t,14,.1,.4); },
    jackpot(g,t){ sendRev(g,.48,t,1.6); subBoom(g,t,.42,55,26,.7); bell(g,t,392,.18,1.4); bell(g,t+.05,523,.14,1.2); coins(g,t,22,.11,.85); [784,988,1175,1568].forEach((f,i)=>osc(g,"sine",f,t+.1+i*.07,.5,.08)); },
    spin(g,t){ for(let i=0;i<16;i++) coin(g,t+i*.09,.07,1400+i*40+(i%3)*200); osc(g,"sine",300,t,1.5,.08,{f2:900,ft:"lowpass",ff:2000}); },
    stop(g,t){ bell(g,t,523,.16,.8); coins(g,t,12,.1,.3); subBoom(g,t,.34,80,34,.4); },
    collect(g,t){ for(let i=0;i<8;i++){ coin(g,t+i*.06,.1,1600+i*140); osc(g,"sine",880+i*120,t+i*.06,.08,.06);} },
    lock(g,t){ coin(g,t,.14,2100); bell(g,t,880,.1,.35); osc(g,"sine",1320,t,.14,.08,{f2:1760}); },
    respin(g,t){ coins(g,t,8,.07,.28); osc(g,"triangle",400,t,.35,.07,{f2:900}); },
    miss(g,t){ coin(g,t,.06,900); osc(g,"sine",700,t,.12,.06,{f2:300}); },
    last(g,t){ bell(g,t,392,.12,.5); coin(g,t,.1,1600); coin(g,t+.08,.1,2000); },
    grand(g,t){ sendRev(g,.5,t,1.8); subBoom(g,t,.48,50,24,.8); bell(g,t,261,.2,1.8); bell(g,t,392,.16,1.5); coins(g,t,28,.12,1.0); [523,659,784,1047,1319].forEach((f,i)=>osc(g,"sine",f,t+.08+i*.06,.7,.09)); },
    minor(g,t){ bell(g,t,523,.13,.7); coins(g,t,10,.09,.32); },
    roll(g,t){ for(let i=0;i<10;i++) coin(g,t+i*.08,.08,1200+i*110); },
    burst(g,t){ subBoom(g,t,.4,70,30,.5); bell(g,t,659,.16,1); coins(g,t,18,.11,.55); }
  },
  C: {
    open(g,t){ sendRev(g,.46,t,1.3); thunder(g,t,.48); roar(g,t+.05,.7,.2); click(g,t,.3,1400); },
    shot(g,t){ noise(g,t,.45,.22,{ft:"bandpass",f:500,f2:1600,q:.6,color:"pink",a:.02}); osc(g,"sawtooth",140,t,.42,.12,{f2:60,ft:"lowpass",ff:700}); rumble(g,t,.5,.16); },
    hit(g,t,k){ noise(g,t,.07,.22,{ft:"highpass",f:1800+(k||0)*150,color:"white",a:.001}); osc(g,"sawtooth",180+(k||0)*40,t,.12,.12,{f2:80,ft:"lowpass",ff:900}); },
    land(g,t){ sendRev(g,.44,t,1); thunder(g,t,.5); subBoom(g,t,.52,58,24,.7); roar(g,t+.04,.5,.16); },
    jackpot(g,t){ sendRev(g,.55,t,1.8); thunder(g,t,.55); roar(g,t,.12,1.15,.28); subBoom(g,t,.55,48,22,.95); osc(g,"sawtooth",98,t,1.1,.1,{f2:48,ft:"lowpass",ff:500}); [130,196,261].forEach((f,i)=>osc(g,"triangle",f,t+.15+i*.08,.9,.08)); },
    spin(g,t){ rumble(g,t,1.7,.22); noise(g,t,1.6,.14,{ft:"bandpass",f:300,f2:900,q:.7,color:"pink",a:.08}); osc(g,"sawtooth",70,t,1.6,.1,{f2:140,ft:"lowpass",ff:400,ff2:900}); },
    stop(g,t){ thunder(g,t,.52); subBoom(g,t,.5,66,24,.65); click(g,t,.35,1200); },
    collect(g,t){ for(let i=0;i<8;i++){ osc(g,"sawtooth",140+i*30,t+i*.07,.08,.08,{f2:70,ft:"lowpass",ff:600}); noise(g,t+i*.07,.05,.08,{ft:"lowpass",f:400,color:"brown"}); } },
    lock(g,t){ osc(g,"sine",220,t,.2,.12,{f2:110}); noise(g,t,.1,.16,{ft:"bandpass",f:900,q:1,color:"pink"}); click(g,t,.2,1600); },
    respin(g,t){ rumble(g,t,.45,.18); noise(g,t,.4,.14,{ft:"highpass",f:400,f2:1400,color:"pink"}); },
    miss(g,t){ osc(g,"sine",90,t,.2,.1,{f2:50,ft:"lowpass",ff:200}); noise(g,t,.12,.08,{ft:"lowpass",f:200,color:"brown"}); },
    last(g,t){ rumble(g,t,.55,.22); osc(g,"sawtooth",98,t,.45,.1,{f2:60}); thunder(g,t,.22); },
    grand(g,t){ sendRev(g,.58,t,2); thunder(g,t,.6); roar(g,t,.08,1.35,.32); rumble(g,t,1.6,.3); subBoom(g,t,.6,44,20,1.1); [82,110,146,196].forEach((f,i)=>osc(g,"triangle",f,t+.12+i*.09,1,.09)); },
    minor(g,t){ thunder(g,t,.32); roar(g,t,.4,.14); subBoom(g,t,.3,70,30,.45); },
    roll(g,t){ for(let i=0;i<10;i++) osc(g,"sawtooth",80+i*18,t+i*.09,.1,.07,{f2:50,ft:"lowpass",ff:500}); rumble(g,t,.95,.12); },
    burst(g,t){ thunder(g,t,.5); roar(g,t,.8,.22); subBoom(g,t,.52,55,22,.75); }
  },
  D: {
    open(g,t){ sendRev(g,.3,t,.8); drop(g,t,.42); osc(g,"sawtooth",196,t,.45,.1,{f2:98,ft:"lowpass",ff:2000}); zap(g,t,.12,1800); [196,247,311].forEach((f,i)=>osc(g,"square",f,t+.04+i*.04,.35,.06,{ft:"lowpass",ff:2400})); },
    shot(g,t){ supersaw(g,t,80,420,.4,.05); noise(g,t,.32,.14,{ft:"highpass",f:600,f2:4000,color:"white",a:.01}); zap(g,t+.2,.1,2000); },
    hit(g,t,k){ zap(g,t,.14,1200+(k||0)*180); osc(g,"square",800+(k||0)*100,t,.06,.08,{f2:400,ft:"lowpass",ff:3000}); },
    land(g,t){ sendRev(g,.34,t,.8); drop(g,t,.48); zap(g,t,.12,1600); [523,659,784].forEach((f,i)=>osc(g,"square",f,t+.05+i*.05,.28,.07,{ft:"lowpass",ff:2800})); },
    jackpot(g,t){ sendRev(g,.4,t,1.4); supersaw(g,t,98,392,.55,.07); drop(g,t+.5,.5); [196,247,311,392,494].forEach((f,i)=>osc(g,"sawtooth",f,t+.08+i*.06,.7,.07,{ft:"lowpass",ff:3200})); noise(g,t,.2,.16,{ft:"highpass",f:4000,color:"white"}); },
    spin(g,t){ supersaw(g,t,70,640,1.55,.07); noise(g,t,1.55,.1,{ft:"highpass",f:300,f2:5000,color:"white",a:.08}); },
    stop(g,t){ drop(g,t,.5); zap(g,t,.14,900); click(g,t,.28,2400); },
    collect(g,t){ for(let i=0;i<8;i++){ osc(g,"square",660+i*110,t+i*.06,.06,.07,{ft:"lowpass",ff:3000}); zap(g,t+i*.06,.06,1400+i*80);} },
    lock(g,t){ zap(g,t,.12,1800); osc(g,"square",880,t,.14,.1,{f2:1320,ft:"lowpass",ff:3500}); },
    respin(g,t){ supersaw(g,t,90,360,.38,.05); noise(g,t,.35,.1,{ft:"bandpass",f:800,f2:2400,color:"white"}); },
    miss(g,t){ osc(g,"square",240,t,.12,.07,{f2:80,ft:"lowpass",ff:600}); },
    last(g,t){ osc(g,"sawtooth",196,t,.35,.1,{f2:98,ft:"lowpass",ff:1200}); zap(g,t,.1,700); osc(g,"square",311,t+.1,.25,.07); },
    grand(g,t){ sendRev(g,.45,t,1.6); supersaw(g,t,65,330,.7,.08); drop(g,t+.55,.55); [130,196,261,330,392].forEach((f,i)=>osc(g,"sawtooth",f,t+.1+i*.07,.85,.07,{ft:"lowpass",ff:3600})); noise(g,t+.55,.18,.2,{ft:"highpass",f:2500,color:"white"}); },
    minor(g,t){ drop(g,t,.36); [392,523,659].forEach((f,i)=>osc(g,"square",f,t+i*.05,.3,.07,{ft:"lowpass",ff:2600})); },
    roll(g,t){ for(let i=0;i<10;i++) osc(g,"square",420+i*80,t+i*.08,.05,.06,{ft:"lowpass",ff:2800}); },
    burst(g,t){ drop(g,t,.5); supersaw(g,t,98,392,.45,.06); [523,659,784,1047].forEach((f,i)=>osc(g,"square",f,t+.06+i*.05,.35,.07,{ft:"lowpass",ff:3000})); }
  }
};


const DEMOS = {
  plinko:[
    ["open",0],["shot",.55],["hit",.88],["hit",1.04],["hit",1.2],["hit",1.36],["hit",1.52],["land",1.78],["jackpot",2.08]
  ],
  twister:[
    ["open",0],["spin",.5],["stop",2.2],["collect",2.5],["jackpot",3.15]
  ],
  jewels:[
    ["lock",0],["lock",.2],["lock",.4],["respin",.75],["miss",1.12],["lock",1.32],["collect",1.65],["last",2.25],["grand",2.75]
  ],
  wheel:[
    ["spin",0],["stop",1.7],["jackpot",1.95]
  ],
  mult:[
    ["roll",0],["lock",1.05],["burst",1.45]
  ]
};
const DEMO_LEN = {plinko:3.4, twister:4.6, jewels:4.5, wheel:3.2, mult:2.6};

function playMoment(graph, style, moment, when, extra){
  const pack=PLAY[style];
  if(!pack||!pack[moment]) return 0;
  const t=when!=null?when:graph.ctx.currentTime+.02;
  try{pack[moment](graph,t,extra)}catch(e){noteErr(e)}
  return t;
}
function playDemo(graph, game, style, when){
  const seq=DEMOS[game];if(!seq)return 0;
  const t0=when!=null?when:graph.ctx.currentTime+.03;
  seq.forEach(([m,off],i)=>playMoment(graph,style,m,t0+off, i));
  return DEMO_LEN[game]||2.5;
}

/* ---------- live session ---------- */
async function unlock(){
  try{
    if(!live){
      const AC=window.AudioContext||window.webkitAudioContext;
      const ctx=new AC();
      live=buildGraph(ctx);
      live.ctx=ctx;
    }
    if(live.ctx.state==="suspended") await live.ctx.resume();
    return live.ctx.state!=="suspended";
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
  let p=0;for(let i=0;i<buf.length;i++){const v=Math.abs(buf[i]-128)/128;if(v>p)p=v}
  return p;
}

/* ---------- self test (OfflineAudioContext) ---------- */
async function runSelfTest(){
  const report={ok:true,cases:[],errors:[]};
  const AC=window.OfflineAudioContext||window.webkitOfflineAudioContext;
  if(!AC){report.ok=false;report.errors.push("no OfflineAudioContext");return report}
  const moments=["open","shot","hit","land","jackpot","spin","stop","collect","lock","respin","miss","last","grand","minor","roll","burst"];
  const styles=["A","B","C","D"];
  for(const st of styles){
    for(const m of moments){
      try{
        if(!PLAY[st][m]){report.ok=false;report.cases.push({st,m,error:"missing"});continue}
        const ctx=new AC(2, Math.ceil(44100*2.2), 44100);
        const graph=buildGraph(ctx);
        PLAY[st][m](graph, 0.05, 2);
        const buf=await ctx.startRendering();
        let peak=0,nan=0,rms=0,n=buf.length;
        for(let ch=0;ch<buf.numberOfChannels;ch++){
          const d=buf.getChannelData(ch);
          for(let i=0;i<d.length;i++){
            const x=d[i];
            if(!Number.isFinite(x)) nan++;
            const a=Math.abs(x);if(a>peak)peak=a;rms+=x*x;
          }
        }
        rms=Math.sqrt(rms/(n*buf.numberOfChannels));
        const rec={st,m,peak:+peak.toFixed(4),rms:+rms.toFixed(4),nan,clip:peak>1.0};
        if(nan||peak>1.0||peak<.02){rec.fail=true;report.ok=false}
        report.cases.push(rec);
      }catch(e){report.ok=false;report.errors.push(st+"."+m+": "+(e&&e.message||e));report.cases.push({st,m,error:String(e&&e.message||e)})}
    }
    try{
      const ctx=new AC(2, Math.ceil(44100*5), 44100);
      const graph=buildGraph(ctx);
      playDemo(graph,"plinko",st,0.05);
      const buf=await ctx.startRendering();
      let peak=0,nan=0;
      const d=buf.getChannelData(0);
      for(let i=0;i<d.length;i++){const x=d[i];if(!Number.isFinite(x))nan++;const a=Math.abs(x);if(a>peak)peak=a}
      const rec={st,m:"demo-plinko",peak:+peak.toFixed(4),nan,clip:peak>1};
      if(nan||peak>1||peak<.02){rec.fail=true;report.ok=false}
      report.cases.push(rec);
    }catch(e){report.ok=false;report.errors.push("demo "+st+": "+(e&&e.message||e))}
  }
  report.errorLog=errors.slice();
  return report;
}

/* ---------- UI ---------- */
let curGame="plinko", unlocked=false, activeBtn=null, stopTimer=0;

const $ = id=>document.getElementById(id);
function setStatus(s){const e=$("status");if(e)e.textContent=s}
function mark(btn,on){
  if(activeBtn) activeBtn.classList.remove("play");
  activeBtn=on?btn:null;
  if(activeBtn) activeBtn.classList.add("play");
}
function renderGames(){
  const nav=$("games");
  nav.innerHTML=GAMES.map(g=>'<button type="button" data-game="'+g.id+'" aria-selected="'+(g.id===curGame)+'">'+g.name+"</button>").join("");
  nav.querySelectorAll("button").forEach(b=>b.addEventListener("click",async()=>{
    curGame=b.getAttribute("data-game");
    renderGames();renderPanel();
    if(!unlocked) await tryUnlock(b);
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
  $("panel").querySelectorAll("button").forEach(btn=>{
    btn.addEventListener("click",()=>onPlay(btn));
  });
}
async function tryUnlock(from){
  const ok=await unlock();
  unlocked=!!ok;
  const b=$("btnUnlock"), st=$("btnStop"), mt=$("meter");
  if(unlocked){
    b.classList.add("on");b.textContent="音效已開啟";
    st.hidden=false;mt.hidden=false;
    setStatus("音效已開啟。點時機或「連續示範」試聽。");
    startMeter();
  }else{
    setStatus("無法開啟音效，請再點一次，或檢查手機是否靜音。");
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
  if(!unlocked){const ok=await tryUnlock(btn);if(!ok)return}
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
      const extra = moment==="hit" ? (hitSeq++%6) : 0;
      playMoment(live,style,moment,null,extra);
      const lab=(game.moments.find(m=>m.id===moment)||{}).label||moment;
      setStatus("播放中："+game.name+"・"+st.id+" "+st.name+"・"+lab);
      dur = moment==="jackpot"||moment==="grand"||moment==="spin"?2.1: (moment==="open"||moment==="burst"||moment==="land"?1.4:.7);
    }
  }catch(e){noteErr(e);setStatus("播放時發生錯誤，請再試一次。");mark(btn,false);return}
  clearTimeout(stopTimer);
  stopTimer=setTimeout(()=>{mark(btn,false);setStatus("音效已開啟。點時機或「連續示範」試聽。")}, dur*1000+80);
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

function boot(){
  renderGames();renderPanel();renderLegend();bindDock();
}

window.__sfxPreview={
  unlock, stop:stopLive, playMoment, playDemo, runSelfTest,
  STYLES, GAMES, errors, getLive:()=>live, meterTick
};

if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",boot);
else boot();
})();
