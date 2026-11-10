/* v28.55 skin shop — recaptured previews with full crowns; distinct 套用/使用中; one scrolling page */
(function(){
const D=document;
const $=id=>D.getElementById(id);
const FRM={gold:'gold',neon:'midnight',jade:'hanabi',crystal:'moon',royal:'neon',obsidian:'dragon',blossom:'blossom',beach:'beach',tsukiyo:'tsukiyo',kitsune:'kitsune',kabuto:'kabuto',feast:'feast'};
const PVT='samurai';
const X={
gold:{name:'金殿',tag:'DEFAULT',copy:'夜櫻金粉，金殿初見的第一印象。',tier:'n',fx:''},
neon:{name:'真夜中',tag:'MOONLIT',copy:'深夜的藍金對比，如月下刀光。',tier:'n',fx:'冷藍月光沿框流動'},
jade:{name:'花火夜祭',tag:'HANABI',copy:'夜櫻花火，粉金交融的夏夜祭典。',tier:'r',fx:'櫻吹雪沿框緩緩飄落'},
crystal:{name:'月光',tag:'LUNAR',copy:'銀白冷光，如薄紙上的月光。',tier:'r',fx:'銀白冷輝緩緩呼吸'},
royal:{name:'極夜霓虹',tag:'NEON',copy:'極夜霓虹，紫金輝映的不夜城。',tier:'l',fx:'霓虹沿框奔跑、紫金輝光'},
obsidian:{name:'金龍祭典',tag:'DRAGON',copy:'金龍盤框，祭典花火映紅天際。',tier:'m',fx:'金龍磷光巡游、花火綻放'},
blossom:{name:'櫻花之舞',tag:'SAKURA',copy:'櫻社鳥居與狐狸燈籠，花吹雪中的夜宴。',tier:'l',fx:'櫻吹雪沿框旋轉飄落'},
beach:{name:'夏日海灘',tag:'NAGISA',copy:'黃昏棕櫚與浪花，金箔夕照灑在機台邊。',tier:'l',fx:'浪花泡沫沿框湧上退去'},
tsukiyo:{name:'月下幻境',tag:'TSUKIYO',copy:'紫藤花棚與一輪滿月，月華如水傾瀉而下。',tier:'m',fx:'月華光斑緩緩流轉'},
kitsune:{name:'狐之祕境',tag:'KITSUNE',copy:'朱鳥居與白狐面，稻荷的祕徑只在夜間開啟。',tier:'m',fx:'狐火點點沿鳥居遊走'},
kabuto:{name:'武將之魂',tag:'KABUTO',copy:'甲胄與刀旗，戰場金箔如雨、鐵與火的氣息。',tier:'m',fx:'金箔劍氣沿甲胄閃爍'},
feast:{name:'皇宮盛宴',tag:'MIYABI',copy:'雙龍盤柱、金殿華筵，皇家儀仗環繞四周。',tier:'m',fx:'雙龍金輝巡游、華筵燈火'}
};
const FALLBACK=[
{id:'gold',name:'金殿',desc:'預設・夜粉金',price:0},
{id:'neon',name:'真夜中',desc:'深藍月光',price:2000},
{id:'jade',name:'櫻色',desc:'櫻花粉',price:3000},
{id:'crystal',name:'月光',desc:'銀白冷光',price:5000},
{id:'royal',name:'小堇',desc:'紫羅蘭',price:8000},
{id:'obsidian',name:'夕陽',desc:'夕陽橘金',price:12000},
{id:'blossom',name:'櫻花之舞',desc:'櫻社狐燈',price:15000},
{id:'beach',name:'夏日海灘',desc:'棕櫚浪花',price:15000},
{id:'tsukiyo',name:'月下幻境',desc:'紫藤滿月',price:20000},
{id:'kitsune',name:'狐之祕境',desc:'白繩狐面',price:25000},
{id:'kabuto',name:'武將之魂',desc:'甲胄刀旗',price:30000},
{id:'feast',name:'皇宮盛宴',desc:'雙龍金殿',price:50000}];

function catalog(){return (typeof SKINS!=='undefined')?SKINS:(window.__dfpSkins||(window.__dfpSkins=FALLBACK.map(k=>Object.assign({},k))))}
const HAS_GAME_SKIN=(typeof skGet==='function');
const HAS_GAME_SAVE=(typeof skSave==='function');
const HAS_GAME_APPLY=(typeof skApply==='function');
function fmtN(n){if(typeof fmt==='function')return fmt(n);try{return Math.floor(+n||0).toLocaleString('zh-TW')}catch(e){return String(n)}}
function chips(){return (typeof bal==='number')?bal:(window.CZ&&typeof CZ.getBal==='function'?CZ.getBal():0)}
function pay(n){if(typeof bal==='number'){bal-=n;if(typeof ui==='function')ui()}else if(window.CZ&&CZ.addChips)CZ.addChips(-n)}
function getC(){return (typeof shConfirm!=='undefined')?shConfirm:(window.__dfpShC||null)}
function setC(v){if(typeof shConfirm!=='undefined')shConfirm=v;else window.__dfpShC=v}
function readSkin(){
  let st;try{st=JSON.parse(localStorage.getItem('fs_skin')||'{}')}catch(e){st={}}
  if(!Array.isArray(st.own))st.own=[];
  if(!st.own.includes('gold'))st.own.unshift('gold');
  const C=catalog();
  st.own=st.own.filter(id=>C.some(k=>k.id===id));
  if(!st.own.includes(st.eq))st.eq='gold';
  return st;
}
function getSkin(){return HAS_GAME_SKIN?skGet():readSkin()}
function saveSkin(st){if(HAS_GAME_SAVE)return skSave(st);try{localStorage.setItem('fs_skin',JSON.stringify(st))}catch(e){}}
function applySkin(){if(HAS_GAME_APPLY)return skApply()}
function onMach(){return !!window.CZM}
function click(){try{if(window.sfx&&sfx.click)sfx.click()}catch(e){}}
function pvUrl(id){return 'assets/skins/shop/'+PVT+'-'+(FRM[id]||id)+'.webp?v=2855'}
function pv(k){return '<div class="pv2 pvimg s-'+k.id+'" aria-hidden="true" style="background-image:url('+pvUrl(k.id)+')"></div>'}
function msg(t,k){
  if(typeof shMsg==='function'&&onMach()){shMsg(t,k);return}
  const m=$('shMsg');if(!m)return;
  m.textContent=t||'';m.className='shmsg'+(k?' '+k:'');
}

catalog().forEach(k=>{if(X[k.id])Object.assign(k,X[k.id])});

/* live cabinet FX (machines only) */
if(HAS_GAME_APPLY&&onMach()){
  const _skA=skApply;
  function fx(){
    const mach=D.getElementById('machine');if(!mach)return;
    let el=D.getElementById('skFx');
    if(!el){el=D.createElement('div');el.id='skFx';el.innerHTML='<i class="c1"></i><i class="c2"></i><i class="c3"></i><i class="c4"></i><b class="plq"></b><span class="pt">'+(Array.from({length:12},()=>'<em></em>').join(''))+'</span>';
      const bd=D.getElementById('board');(bd||mach).appendChild(el)}
    const st=getSkin(),k=catalog().find(x=>x.id===st.eq);
    const plq=el.querySelector('.plq');if(plq)plq.textContent=k?k.name:'';
    D.body.dataset.skt=k&&k.tier||'';
  }
  skApply=function(){_skA();fx()};
  fx();
}

function ensureShop(){
  if($('shop'))return;
  const d=D.createElement('dialog');
  d.id='shop';d.setAttribute('aria-labelledby','shTitle');
  d.innerHTML='<div class="shTop"><button type="button" class="shX" id="shX" aria-label="關閉">✕</button></div>'+
    '<h2 id="shTitle">機台外觀商店</h2>'+
    '<div class="shsub">用遊戲中贏得的虛擬籌碼兌換機台外觀・目前籌碼 <b id="shBal">0</b></div>'+
    '<ul class="skins" id="skins"></ul>'+
    '<div class="shmsg" id="shMsg" role="status" aria-live="polite"></div>'+
    '<div class="dact"><button type="button" id="shClose">關閉</button></div>'+
    '<p class="note">外觀僅改變機台樣式，不影響中獎機率・只能用虛擬籌碼兌換，無法以真實金錢購買・僅供娛樂・虛擬籌碼不可兌換或轉讓・純虛擬・無兌現・外框全機台共用</p>';
  D.body.appendChild(d);
}
ensureShop();

function ensureFeat(){
  if($('shFeat')||!$('shop')||!$('skins'))return;
  const feat=D.createElement('div');
  feat.id='shFeat';feat.className='shfeat';
  feat.innerHTML='<div class="shfimg"><div class="pv2 pvimg" id="shFeatPv" aria-hidden="true"></div></div>'+
    '<div class="shfmeta"><span class="tier" id="shFeatTier"></span>'+
    '<b><span id="shFeatName"></span> <small class="tg" id="shFeatTag"></small></b>'+
    '<p class="cp" id="shFeatCp"></p><p class="fxl" id="shFeatFx"></p><p class="shfpr" id="shFeatPrice"></p><div class="shfact" id="shFeatAct"></div></div>';
  const note=$('shThm');
  $('skins').parentNode.insertBefore(feat, $('skins'));
}
function ensureNote(){
  let w=$('shThm');
  if(!w){
    w=D.createElement('div');w.id='shThm';w.className='shthm';
    const feat=$('shFeat'),sk=$('skins');
    (feat||sk).parentNode.insertBefore(w, feat||sk);
  }
  w.innerHTML='<p class="shall">✦ 外框全機台通用：套用後 4 台機台都會換上同一款外框</p>';
}
ensureFeat();
ensureNote();

let sel=null;
function paintFeat(id){
  const C=catalog();
  const k=C.find(x=>x.id===id)||C[0];if(!k)return;
  const pvEl=$('shFeatPv');
  if(pvEl){pvEl.className='pv2 pvimg s-'+k.id;pvEl.style.backgroundImage='url('+pvUrl(k.id)+')'}
  const st=getSkin(),own=st.own.includes(k.id)||k.id==='gold',eq=st.eq===k.id;
  const tier=$('shFeatTier');if(tier){tier.textContent={n:'普通',r:'稀有',l:'傳說',m:'神話'}[k.tier]||'普通';tier.className='tier t-'+(k.tier||'n')}
  const nm=$('shFeatName');if(nm)nm.textContent=k.name;
  const tg=$('shFeatTag');if(tg)tg.textContent=k.tag||'';
  const cp=$('shFeatCp');if(cp)cp.textContent=k.copy||k.desc||'';
  const fx=$('shFeatFx');if(fx)fx.textContent=k.fx||'';
  const pr=$('shFeatPrice');
  const act=$('shFeatAct');
  if(eq){if(pr)pr.textContent='';if(act)act.innerHTML='<span class="shOn" aria-current="true">✓ 使用中</span>'}
  else if(own){if(pr)pr.textContent='';if(act)act.innerHTML='<button type="button" class="use" data-act="use" data-id="'+k.id+'">套用</button>'}
  else {if(pr)pr.textContent='價格 '+fmtN(k.price)+' 虛擬籌碼';if(act)act.innerHTML=''}
  const feat=$('shFeat');if(feat)feat.dataset.id=k.id;
}
function selectSkin(id){
  sel=id;
  D.querySelectorAll('#skins .skin').forEach(el=>el.classList.toggle('sel',el.dataset.id===id));
  paintFeat(id);
}
function syncLobbyThumb(){
  const el=$('lxShopPv');if(!el)return;
  el.style.backgroundImage='url("'+pvUrl(getSkin().eq||'gold')+'")';
}

function render(){
  const st=getSkin(),C=catalog(),balNow=chips();
  const hb=$('shBal');if(hb)hb.textContent=fmtN(balNow);
  if(!sel||!C.some(k=>k.id===sel))sel=st.eq||'gold';
  const box=$('skins');if(!box)return;
  box.innerHTML=C.map(k=>{
    const own=st.own.includes(k.id)||k.id==='gold',eq=st.eq===k.id;
    let btn,state;
    if(eq){btn='<span class="shOn" aria-current="true">✓ 使用中</span>';state='使用中'}
    else if(own){btn='<button type="button" class="use" data-act="use" data-id="'+k.id+'">套用</button>';state='已擁有'}
    else{
      state=fmtN(k.price);
      if(getC()===k.id) btn='<button type="button" class="cf" data-act="buy" data-id="'+k.id+'">確認兌換 '+fmtN(k.price)+'？</button>';
      else{
        const buy='<button type="button" class="buy" data-act="ask" data-id="'+k.id+'" '+(balNow<k.price?'disabled':'')+' aria-label="以 '+fmtN(k.price)+' 虛擬籌碼兌換'+k.name+'">購買 · '+fmtN(k.price)+'</button>';
        btn=onMach()?'<div class="b2"><button type="button" class="try" data-act="try" data-id="'+k.id+'">試穿</button>'+buy+'</div>':buy;
      }
    }
    return '<li class="skin t-'+(k.tier||'n')+(eq?' eq':'')+(sel===k.id?' sel':'')+'" data-id="'+k.id+'">'+
      (eq?'<span class="eqtag">使用中</span>':own?'<span class="eqtag ow">已擁有</span>':'')+
      '<span class="tier">'+({n:'普通',r:'稀有',l:'傳說',m:'神話'}[k.tier]||'')+'</span>'+
      pv(k)+'<b>'+k.name+' <small class="tg">'+(k.tag||'')+'</small></b><p class="cp">'+(k.copy||k.desc||'')+'</p>'+
      (k.fx?'<p class="fxl">'+k.fx+'</p>':'')+btn+'</li>';
  }).join('');
  paintFeat(sel);
  syncLobbyThumb();
}

try{shRender=render}catch(e){}
window.shRender=render;

function lobbyAct(act,id){
  const k=catalog().find(x=>x.id===id);if(!k)return;
  const st=getSkin();
  if(act==='use'){
    st.eq=k.id;saveSkin(st);applySkin();setC(null);
    click();msg('已套用「'+k.name+'」','ok');
    sel=k.id;render();
    requestAnimationFrame(function(){
      document.querySelectorAll('#shop .shOn').forEach(function(el){el.classList.add('flash')});
    });
    return;
  }
  if(act==='ask'){
    const c=chips();
    if(c<k.price){msg('虛擬籌碼不足，還差 '+fmtN(k.price-c)+'（可透過遊戲、每日簽到或看廣告取得）','err');return}
    setC(k.id);click();msg('再按一次確認，以 '+fmtN(k.price)+' 虛擬籌碼兌換「'+k.name+'」');
    sel=k.id;render();return;
  }
  if(act==='buy'){
    const c=chips();
    if(c<k.price||st.own.includes(k.id)){setC(null);render();return}
    pay(k.price);
    if(!st.own.includes(k.id))st.own.push(k.id);
    st.eq=k.id;saveSkin(st);applySkin();setC(null);
    click();msg('兌換成功！已套用「'+k.name+'」','ok');
    sel=k.id;render();
  }
}

const skinsEl=$('skins');
if(skinsEl&&!skinsEl.dataset.dfp2852){
  skinsEl.dataset.dfp2852='1';
  skinsEl.addEventListener('click',function(e){
    const card=e.target.closest('.skin[data-id]');
    if(card)selectSkin(card.dataset.id);
    if(onMach())return;
    const b=e.target.closest('button[data-act]');
    if(!b)return;
    if(b.dataset.act==='use'){
      b.classList.add('flash');
      const id=b.dataset.id;
      setTimeout(function(){lobbyAct('use',id)},140);
      return;
    }
    lobbyAct(b.dataset.act,b.dataset.id);
  });
}

/* try-on: machine cabinet only — does not navigate */
if(onMach()&&$('shopBtn')){
  let tryT=0,tryId=null;
  function bar(){
    let el=$('skTry');
    if(!el){el=D.createElement('div');el.id='skTry';el.innerHTML='<span></span><button type="button" class="buy">購買</button><button type="button" class="x">結束試穿</button>';D.body.appendChild(el);
      el.querySelector('.x').onclick=end;
      el.querySelector('.buy').onclick=()=>{const id=tryId;end();setC(id);const shop=$('shop');if(shop&&shop.showModal){render();shop.showModal()}};}
    return el;
  }
  function end(){clearInterval(tryT);const el=$('skTry');if(el)el.remove();tryId=null;if(typeof skApply==='function')skApply()}
  function start(id){
    const k=catalog().find(x=>x.id===id);if(!k)return;
    tryId=id;D.body.dataset.skin=id==='gold'?'':id;
    const el=bar(),left={n:15};
    el.querySelector('span').textContent='試穿「'+k.name+'」 '+left.n+'s';
    el.querySelector('.buy').hidden=getSkin().own.includes(id);
    clearInterval(tryT);tryT=setInterval(()=>{left.n--;if(left.n<=0){end();return}el.querySelector('span').textContent='試穿「'+k.name+'」 '+left.n+'s'},1000);
    const shop=$('shop');if(shop)shop.close();
  }
  skinsEl.addEventListener('click',e=>{const b=e.target.closest('[data-act="try"]');if(b)start(b.dataset.id)});
}

/* 換框 — in-machine shortcut, close returns to that machine */
function injectFrm(){
  const bar=D.querySelector('.czbar .controls');if(!bar||$('czFrm'))return;
  const b=D.createElement('button');b.id='czFrm';b.type='button';b.setAttribute('aria-label','更換機台外框');b.innerHTML='<b>換框</b><i aria-hidden="true">🖼</i>';
  bar.appendChild(b);
  b.onclick=()=>{const sb=$('shopBtn');if(sb)sb.click();else if(window.DFPshop)DFPshop.open()};
}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',injectFrm);
else injectFrm();

/* arrival toast leftover is unused now (no lobby hop) */
if(sessionStorage.getItem('dfpFrmOk')){
  const n=sessionStorage.getItem('dfpFrmOk');sessionStorage.removeItem('dfpFrmOk');
  const t=D.createElement('div');t.className='ffly';t.textContent='已換上「'+n+'」外框';D.body.appendChild(t);setTimeout(()=>t.remove(),2400);
}
try{sessionStorage.removeItem('dfpOpenShop')}catch(e){}

function ensureX(){
  const shop=$('shop');if(!shop)return;
  let x=$('shX');
  if(!x){
    const wrap=D.createElement('div');wrap.className='shTop';
    x=D.createElement('button');x.type='button';x.id='shX';x.className='shX';x.setAttribute('aria-label','關閉');x.textContent='✕';
    wrap.appendChild(x);shop.insertBefore(wrap,shop.firstChild);
  }
  if(!x.dataset.dfp2854){
    x.dataset.dfp2854='1';
    x.addEventListener('click',()=>{try{$('shop').close()}catch(e){}});
  }
}
ensureX();
const shc=$('shClose'),shopEl=$('shop');
if(shc){
  if(!shc.textContent.trim())shc.textContent='關閉';
  if(D.documentElement.classList.contains('lx'))shc.classList.remove('gold');
  if(shopEl&&!shc.dataset.dfp2852){
    shc.dataset.dfp2852='1';
    shc.addEventListener('click',()=>{try{shopEl.close()}catch(e){}});
  }
}

function openShop(){
  ensureShop();ensureFeat();ensureNote();bindFeatAct();
  setC(null);msg('');
  sel=getSkin().eq||'gold';
  render();
  const shop=$('shop');
  if(shop&&shop.showModal)shop.showModal();
}
function bindFeatAct(){
  const feat=$('shFeat');if(!feat||feat.dataset.dfp2855)return;
  feat.dataset.dfp2855='1';
  feat.addEventListener('click',function(e){
    const b=e.target.closest('button[data-act]');
    if(!b)return;
    e.stopPropagation();
    if(b.dataset.act==='use'){
      b.classList.add('flash');
      const id=b.dataset.id;
      setTimeout(function(){lobbyAct('use',id)},140);
      return;
    }
    lobbyAct(b.dataset.act,b.dataset.id);
  });
}
bindFeatAct();

window.DFPshop={open:openShop,render:render,thumb:syncLobbyThumb};
syncLobbyThumb();
})();
