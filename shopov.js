/* v28.149: open shop.html as a same-origin iframe overlay on the lobby
   so lobby AudioContext / BGM never stops. Direct visits to shop.html stay standalone. */
(function(){
if(window.DFPshopOv) return;
var ov=null, fr=null, open=false, pushed=0, prevTab='home';

function shopPath(u){
  try{ return /(?:^|\/)shop\.html$/i.test(new URL(u, location.href).pathname); }
  catch(e){ return false; }
}
function tabOf(u){
  try{
    var t=new URL(u, location.href).searchParams.get('tab')||'';
    if(['frames','themes','noads','owned'].indexOf(t)<0){
      var h=(location.hash||'');
      if(h.indexOf('#shop/')===0) t=h.slice(6);
    }
    return ['frames','themes','noads','owned'].indexOf(t)>=0?t:'frames';
  }catch(e){ return 'frames'; }
}
function hashFor(tab){ return '#shop'+(tab && tab!=='frames' ? '/'+tab : ''); }
function srcFor(tab){
  var q='shop.html?embed=1&v=28149';
  if(tab && tab!=='frames') q+='&tab='+encodeURIComponent(tab);
  return q;
}

function css(){
  if(document.getElementById('dfpShopOvCss')) return;
  var s=document.createElement('style');
  s.id='dfpShopOvCss';
  s.textContent=
    '#dfpShopOv{position:fixed;inset:0;z-index:20000;background:#140204;}'+
    '#dfpShopOv[hidden]{display:none!important;}'+
    '#dfpShopOv iframe{position:absolute;inset:0;width:100%;height:100%;border:0;background:#140204;}'+
    'body.shop-ov,html.shop-ov{overflow:hidden!important;}';
  document.head.appendChild(s);
}

function ensure(){
  if(ov) return;
  css();
  ov=document.createElement('div');
  ov.id='dfpShopOv';
  ov.hidden=true;
  ov.setAttribute('aria-label','商城');
  fr=document.createElement('iframe');
  fr.id='dfpShopFr';
  fr.title='商城';
  fr.setAttribute('src','about:blank');
  ov.appendChild(fr);
  document.body.appendChild(ov);
}

function emb(){
  try{ return fr && fr.contentWindow && fr.contentWindow.DFPshopEmb; }
  catch(e){ return null; }
}

function show(tab, opts){
  opts=opts||{};
  ensure();
  tab=tab||'frames';
  if(!open){
    try{ prevTab=(window.DFPlx && document.getElementById('lx') && document.getElementById('lx').getAttribute('data-cur'))|| (sessionStorage.getItem('lxTab'))||'home'; }
    catch(e){ prevTab='home'; }
    if(!/^(home|games|events|me)$/.test(prevTab)) prevTab='home';
  }
  open=true;
  document.documentElement.classList.add('shop-ov');
  document.body.classList.add('shop-ov');
  ov.hidden=false;
  var api=emb();
  if(api && typeof api.showTab==='function'){
    try{ api.showTab(tab); }catch(e){ fr.src=srcFor(tab); }
  }else{
    var next=srcFor(tab);
    if((fr.getAttribute('src')||'')!==next) fr.src=next;
  }
  if(!opts.noHist){
    try{
      var h=hashFor(tab);
      if(!pushed){
        history.pushState({dfpShop:1, tab:tab}, '', h);
        pushed=1;
      }else{
        history.replaceState({dfpShop:1, tab:tab}, '', h);
      }
    }catch(e){}
  }
}

function hide(opts){
  opts=opts||{};
  if(!open) return;
  open=false;
  if(ov) ov.hidden=true;
  document.documentElement.classList.remove('shop-ov');
  document.body.classList.remove('shop-ov');
  if(opts.fromPop){ pushed=0; }
  else if(pushed){
    pushed=0;
    try{ history.back(); }catch(e){}
  }else{
    try{
      if((location.hash||'').indexOf('#shop')===0)
        history.replaceState({}, '', location.pathname+location.search);
    }catch(e){}
  }
  var t=opts.tab;
  if(!t) t=prevTab||'home';
  if(/^(home|games|events|me)$/.test(t) && window.DFPlx && typeof DFPlx.tab==='function'){
    try{ DFPlx.tab(t); }catch(e){}
  }
  syncLobby();
}

function syncLobby(){
  try{ if(window.DFPlx && DFPlx.sync) DFPlx.sync(); }catch(e){}
  try{ if(window.DFPtheme && DFPtheme.applyLobby) DFPtheme.applyLobby(); }catch(e){}
  try{ if(window.DFPshop && DFPshop.thumb) DFPshop.thumb(); }catch(e){}
}

function goMachine(href){
  try{ if(window.DFPbgm) DFPbgm.leaveToMachine(); }catch(e){}
  location.href=href;
}

function onBack(){
  if(!open) return false;
  var api=emb();
  if(api && typeof api.back==='function'){
    try{ if(api.back()) return true; }catch(e){}
  }
  hide({tab:prevTab});
  return true;
}

document.addEventListener('click', function(e){
  var a=e.target.closest && e.target.closest('a[href]');
  if(!a) return;
  var href=a.getAttribute('href')||'';
  if(!shopPath(href) && !shopPath(a.href)) return;
  if(a.target && a.target!=='_self') return;
  e.preventDefault();
  e.stopPropagation();
  show(tabOf(a.href||href));
}, true);

addEventListener('message', function(e){
  if(e.origin!==location.origin) return;
  var d=e.data||{};
  if(!d || d.type!=='dfp-shop') return;
  if(d.cmd==='close') hide({tab:d.tab||prevTab});
  else if(d.cmd==='state') syncLobby();
  else if(d.cmd==='tab'){
    if(open && pushed){
      try{ history.replaceState({dfpShop:1, tab:d.tab||'frames'}, '', hashFor(d.tab||'frames')); }catch(err){}
    }
  }else if(d.cmd==='go' && d.href) goMachine(d.href);
});

addEventListener('popstate', function(){
  var st=history.state||{};
  var hash=(location.hash||'');
  var want=!!st.dfpShop || hash.indexOf('#shop')===0;
  if(want){
    pushed=1;
    show(st.tab || tabOf(location.href), {noHist:1});
  }else if(open){
    hide({fromPop:1, tab:prevTab});
  }
});

addEventListener('storage', function(e){
  if(!e.key || e.key==='fs_skin' || e.key==='dfp_theme' || e.key==='fs_bal' || e.key==='cz_bal')
    syncLobby();
});

function wrapBack(){
  var ob=window.dfpBack;
  window.dfpBack=function(){
    if(onBack()) return true;
    return typeof ob==='function' ? ob.apply(this, arguments) : false;
  };
}
function wrapOpen(){
  if(!window.DFPshop || DFPshop.__ov) return;
  var old=DFPshop.open;
  DFPshop.open=function(){ show('frames'); };
  DFPshop.__ov=1;
}

function boot(){
  wrapBack();
  wrapOpen();
  var openFlag=false;
  try{ openFlag=sessionStorage.getItem('lxOpenShop')==='1'; sessionStorage.removeItem('lxOpenShop'); }catch(e){}
  var hash=(location.hash||'');
  if(openFlag || hash.indexOf('#shop')===0){
    var landing=(!openFlag && hash.indexOf('#shop')===0);
    show(tabOf(location.href), {noHist:landing});
    if(landing){
      try{ history.replaceState({dfpShop:1, tab:tabOf(location.href)}, '', hash); }catch(e){}
      pushed=0;
    }
  }
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot);
else boot();

window.DFPshopOv={open:show, close:hide, isOpen:function(){return open}, back:onBack};
})();
