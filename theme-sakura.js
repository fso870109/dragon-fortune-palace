/* 櫻花斬・夜宴庭. Cosmetic only; does not change RTP or math. Loaded only when equipped. */
(function(){
const KEY='dfp_theme_yan';
const BASE='assets/theme-sakura/';
const SYM=BASE+'sym/';
const ON=()=>document.body.classList.contains('theme-yan');

function mapUrl(u){
  if(!u) return u;
  const s=String(u);
  let m=s.match(/assets\/sakura\/(t_[A-Za-z0-9]+)\.webp/);
  if(m) return SYM+m[1]+'.webp';
  m=s.match(/assets\/sakura\/(p_[A-Za-z0-9]+)\.webp/);
  if(m){
    if(m[1]==='p_bigwin'||m[1]==='p_bigwin_bl') return BASE+m[1]+'.webp';
    if(m[1]==='p_idle'||m[1]==='p_special') return BASE+'hero.webp';
    return BASE+'p_bigwin.webp'; /* anticip / victory / bonus share banquet key art */
  }
  const plain={
    'assets/sakura/hero.webp':BASE+'hero.webp',
    'assets/sakura/bgp.webp':BASE+'bgp.webp',
    'assets/sakura/bg.webp':BASE+'bg.webp',
    'assets/sakura/cutin.webp':BASE+'cutin.webp',
    'assets/sakura/bigbonus.webp':BASE+'bigbonus.webp',
    'assets/sakura/p_bigwin.webp':BASE+'p_bigwin.webp',
    'assets/sakura/p_bigwin_bl.webp':BASE+'p_bigwin_bl.webp',
    'assets/sakura/base.webp':BASE+'base.webp',
    'assets/sakura/card.webp':BASE+'card.webp',
    'assets/reelbg/bg-sakura.webp':BASE+'reelbg.webp'
  };
  for(const [k,v] of Object.entries(plain)){
    if(s.indexOf(k)!==-1) return v;
  }
  return s;
}
function unmapUrl(u){
  if(!u) return u;
  const s=String(u);
  let m=s.match(/\/theme-sakura\/sym\/(t_[A-Za-z0-9]+)\.webp/);
  if(m) return 'assets/sakura/'+m[1]+'.webp?v=2847';
  const back={
    [BASE+'hero.webp']:'assets/sakura/hero.webp?v=239',
    [BASE+'bgp.webp']:'assets/sakura/bgp.webp?v=256',
    [BASE+'bg.webp']:'assets/sakura/bg.webp?v=256',
    [BASE+'cutin.webp']:'assets/sakura/cutin.webp?v=256',
    [BASE+'bigbonus.webp']:'assets/sakura/bigbonus.webp?v=256',
    [BASE+'p_bigwin.webp']:'assets/sakura/p_bigwin.webp?v=281',
    [BASE+'p_bigwin_bl.webp']:'assets/sakura/p_bigwin_bl.webp?v=281',
    [BASE+'base.webp']:'assets/sakura/base.webp?v=256',
    [BASE+'reelbg.webp']:'assets/reelbg/bg-sakura.webp?v=28130'
  };
  for(const [k,v] of Object.entries(back)){
    if(s.indexOf(k)!==-1) return v;
  }
  return s;
}

function swapImgs(on){
  document.querySelectorAll('img').forEach(img=>{
    const cur=img.getAttribute('src')||'';
    const next=on?mapUrl(cur):unmapUrl(cur);
    if(next && next!==cur) img.setAttribute('src',next);
  });
}

/* Hook future Image / attr sets while theme is on */
const desc=Object.getOwnPropertyDescriptor(HTMLImageElement.prototype,'src');
if(desc && desc.set){
  Object.defineProperty(HTMLImageElement.prototype,'src',{
    configurable:true,enumerable:desc.enumerable,
    get:desc.get,
    set:function(v){desc.set.call(this, ON()?mapUrl(v):v)}
  });
}

function ensureChrome(){
  const cab=document.getElementById('cabFrame');
  if(cab && !document.getElementById('themeAccent')){
    const a=document.createElement('div');a.id='themeAccent';a.setAttribute('aria-hidden','true');
    cab.appendChild(a);
    const L=document.createElement('div');L.id='themeLanterns';L.setAttribute('aria-hidden','true');
    L.innerHTML='<i class="ll"></i><i class="lr"></i>';
    cab.appendChild(L);
  }
  if(!document.getElementById('themeFx')){
    const fx=document.createElement('div');fx.id='themeFx';fx.setAttribute('aria-hidden','true');
    document.body.appendChild(fx);
  }
}

function setOn(v){
  document.body.classList.toggle('theme-yan', !!v);
  try{sessionStorage.setItem(KEY, v?'1':'0')}catch(e){}
  swapImgs(!!v);
  applyVars(!!v);
  mus(!!v);
}
function applyVars(on){
  const r=document.documentElement;
  if(on){
    r.style.setProperty('--czhero','url(assets/theme-sakura/hero.webp)');
    r.style.setProperty('--czbw','url(assets/theme-sakura/p_bigwin.webp)');
    r.style.setProperty('--czbwbl','url(assets/theme-sakura/p_bigwin_bl.webp)');
  }else{
    r.style.setProperty('--czhero','url(assets/sakura/hero.webp?v=239)');
    r.style.setProperty('--czbw','url(assets/sakura/p_bigwin.webp?v=281)');
    r.style.setProperty('--czbwbl','url(assets/sakura/p_bigwin_bl.webp?v=281)');
  }
  const pose=document.querySelector('#czHero .czpose');
  if(pose && pose.classList.contains('on')){
    const cur=pose.style.backgroundImage||'';
    const next=on?mapUrl(cur.replace(/^url\(["']?|["']?\)$/g,'')):unmapUrl(cur);
    if(next) pose.style.backgroundImage='url('+next+')';
  }
}

/* Music: remixed existing sakura beds (same loop points). SFX likewise. */
let musSrc=null, musGain=null, musBuf=null, musWant=false;
const LOOP=63.157895, PRE=.3, INTRO=6.315789, MG=1.8;
function ctx(){try{if(window.DFPctx)return window.DFPctx();if(typeof ac!=='undefined')return ac}catch(e){}return null}
function loadBuf(url){
  const c=ctx();if(!c)return Promise.resolve(null);
  return fetch(url).then(r=>r.arrayBuffer()).then(ab=>c.decodeAudioData(ab.slice(0))).catch(()=>null);
}
const BUF={};
function mus(on){
  musWant=on;
  const c=ctx();
  if(!c){if(on) addEventListener('pointerdown',()=>mus(true),{once:true});return}
  if(!on){
    if(musSrc){try{musSrc.stop()}catch(e){} musSrc=null}
    try{if(window.CZA&&CZA.mus)CZA.mus(!!(window.DFPvol?DFPvol.musOn():true))}catch(e){}
    return;
  }
  try{if(window.CZA&&CZA.mus)CZA.mus(false)}catch(e){}
  const go=buf=>{
    if(!buf||!musWant)return;
    if(musSrc){try{musSrc.stop()}catch(e){}}
    const s=c.createBufferSource();s.buffer=buf;s.loop=true;s.loopStart=PRE+INTRO;s.loopEnd=PRE+INTRO+LOOP;
    const g=c.createGain();g.gain.value=MG;s.connect(g);
    const dest=(window.AM&&AM.mus)||c.destination;
    g.connect(dest);s.start(c.currentTime+.02, PRE);
    musSrc=s;musGain=g;
  };
  if(BUF.bgm) go(BUF.bgm);
  else loadBuf(BASE+'audio/bgm_yan.mp3').then(b=>{BUF.bgm=b;go(b)});
}
function playSfx(name,g){
  const c=ctx();if(!c)return;
  const kick=buf=>{
    if(!buf)return;
    const s=c.createBufferSource();s.buffer=buf;
    const G=c.createGain();G.gain.value=g||1;
    s.connect(G);
    try{s.connect(G).connect((window.AM&&AM.sfxG)||c.destination)}catch(e){s.connect(G).connect(c.destination)}
    s.start();
  };
  if(BUF[name]) kick(BUF[name]);
  else loadBuf(BASE+'audio/'+name+'.mp3').then(b=>{BUF[name]=b;kick(b)});
}
function hookSfx(){
  if(typeof sfx==='undefined') return setTimeout(hookSfx,250);
  const O={win:sfx.win,big:sfx.big,coin:sfx.coin,chime:sfx.chime,collect:sfx.collect,bonus:sfx.bonus,suspense:sfx.suspense};
  sfx.win=function(t){if(ON()){playSfx('sfx_win'+Math.max(0,Math.min(4,t|0)),1);return}return O.win&&O.win.apply(this,arguments)};
  sfx.big=function(){if(ON()){playSfx('sfx_win2',1);return}return O.big&&O.big.apply(this,arguments)};
  ['coin','chime','collect'].forEach(n=>{
    const orig=sfx[n];
    sfx[n]=function(){if(ON()){playSfx('sfx_'+n,.9);return}return orig&&orig.apply(this,arguments)};
  });
  const ob=window.fsIntro;
  if(ob && !ob.__yan){window.fsIntro=function(re){if(!re&&ON())playSfx('sfx_bonus',1);return ob.apply(this,arguments)};window.fsIntro.__yan=1}
}

/* 花吹雪 + warm lanterns */
function blizzard(kind){
  if(!ON())return;
  const layer=document.getElementById('themeFx');if(!layer)return;
  if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  const n=kind==='big'?40:18;
  for(let i=0;i<n;i++){
    const el=document.createElement('i');
    const lantern=kind!=='win' && i%7===0;
    el.className=lantern?'L':'p';
    const x=Math.random()*100, s=lantern?(0.45+Math.random()*0.5):(0.35+Math.random()*0.8);
    el.style.cssText=`left:${x}%;width:${lantern?28+Math.random()*22:16+Math.random()*22}px;height:${lantern?46+Math.random()*28:16+Math.random()*22}px;`+
      `--x:0px;--dx:${(-40+Math.random()*80).toFixed(1)}px;--s:${s.toFixed(2)};--r:${(120+Math.random()*280).toFixed(0)}deg;`+
      `animation:${lantern?'yanFloat':'yanFall'} ${lantern?5.5+Math.random()*3:3.6+Math.random()*3.4}s linear forwards;`+
      `animation-delay:${(Math.random()*0.6).toFixed(2)}s`;
    layer.appendChild(el);
    setTimeout(()=>el.remove(), 9000);
  }
}
function watchWins(){
  const h=document.getElementById('czHero');
  if(h){
    new MutationObserver(()=>{
      if(!ON())return;
      if(h.classList.contains('l21big')) blizzard('big');
      else if(h.classList.contains('l21win')) blizzard('win');
    }).observe(h,{attributes:true,attributeFilter:['class']});
  }
  const bw=document.getElementById('bw');
  if(bw){
    let was=false;
    new MutationObserver(()=>{
      const on=bw.classList.contains('show');
      if(on&&!was&&ON()) blizzard('big');
      was=on;
    }).observe(bw,{attributes:true,attributeFilter:['class']});
  }
  const watchAt=()=>{
    const at=document.getElementById('czAtari');
    if(!at) return setTimeout(watchAt,300);
    if(at.__yan) return; at.__yan=1;
    let was=false;
    new MutationObserver(()=>{
      const on=at.classList.contains('on');
      if(on&&!was&&ON()) blizzard('big');
      was=on;
    }).observe(at,{attributes:true,attributeFilter:['class']});
  };
  watchAt();
}

function hookDom(){
  if(hookDom.ok) return; hookDom.ok=1;
  const sa=Element.prototype.setAttribute;
  Element.prototype.setAttribute=function(n,v){
    if(ON() && String(n).toLowerCase()==='src') v=mapUrl(v);
    return sa.call(this,n,v);
  };
  new MutationObserver(muts=>{
    if(!ON())return;
    muts.forEach(m=>{
      m.addedNodes&&m.addedNodes.forEach(n=>{
        const imgs=(n.tagName==='IMG')?[n]:(n.querySelectorAll?n.querySelectorAll('img'):[]);
        imgs.forEach(img=>{
          const cur=img.getAttribute('src')||img.src||'';
          const next=mapUrl(cur);
          if(next && next!==cur) img.setAttribute('src',next);
        });
      });
    });
  }).observe(document.documentElement,{subtree:true,childList:true});
}
function hookPose(){
  if(!window.CZPOSE) return setTimeout(hookPose,200);
  if(window.CZPOSE.__yan) return;
  const orig=window.CZPOSE.show;
  window.CZPOSE.show=function(name,ms,pri){
    const r=orig.apply(this,arguments);
    if(!ON()) return r;
    const apply=()=>{
      const e=document.querySelector('#czHero .czpose');
      if(!e) return;
      const mapped=mapUrl('assets/sakura/p_'+(name||'idle')+'.webp');
      e.style.backgroundImage='url('+mapped+')';
    };
    apply();
    setTimeout(apply,30); setTimeout(apply,200); setTimeout(apply,600);
    return r;
  };
  window.CZPOSE.__yan=1;
}

function boot(){
  hookDom(); hookPose();
  ensureChrome();
  setOn(true);
  hookSfx();watchWins();
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot);
else boot();
addEventListener('load',()=>{ensureChrome();swapImgs(ON());setTimeout(()=>{ensureChrome();swapImgs(ON())},800)});

window.YAN={set:setOn,on:ON,blizzard,mapUrl};
})();
