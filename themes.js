/* v28.148 machine themes. Cosmetic only. 夜宴庭 is free to equip; others stay 即將推出.
   Equip state is saved locally (like frames). Theme assets load only when equipped. */
(function(){
if(window.DFPtheme)return;
var KEY='dfp_theme', V='?v=28149';
var FREE=['theme_sakura'];
var CAT=[
  {id:'sakura-default', mach:'sakura', name:'櫻花斬・月夜', copy:'預設外觀。冷紫月夜與刀光身影。', def:true, soon:false, card:'assets/sakura/card.webp?v=256'},
  {id:'theme_sakura', mach:'sakura', name:'櫻花斬・夜宴庭', copy:'夜宴庭金燈籠與花吹雪。免費開放，純裝飾，不影響機率與 RTP。', free:true, soon:false, card:'assets/theme-sakura/shop_card.webp'+V},
  {id:'theme_samurai', mach:'samurai', name:'天下布武・陣幕', copy:'夜間本陣與金紋陣幕。即將推出。', soon:true},
  {id:'theme_neko', mach:'neko', name:'招財・金鋪', copy:'黃昏金鋪與店招。即將推出。', soon:true},
  {id:'theme_matsuri', mach:'matsuri', name:'夏祭・宵燈', copy:'宵燈與祭市夜色。即將推出。', soon:true}
];

function read(){
  var st; try{st=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){st={}}
  if(!st||typeof st!=='object') st={};
  if(!Array.isArray(st.own)) st.own=[];
  FREE.forEach(function(id){ if(st.own.indexOf(id)<0) st.own.push(id); });
  if(!st.eq || typeof st.eq!=='object' || Array.isArray(st.eq)) st.eq={};
  return st;
}
function save(st){ try{localStorage.setItem(KEY, JSON.stringify(st))}catch(e){} }
function equipped(mach){ var id=read().eq[mach]||''; return id; }
function setEq(mach, id){
  var st=read();
  if(!id || id.indexOf('-default')>=0) delete st.eq[mach];
  else {
    if(st.own.indexOf(id)<0) return false;
    st.eq[mach]=id;
  }
  save(st);
  return true;
}

function inject(rel, kind){
  var href=rel+(rel.indexOf('?')>=0?'':'') ;
  if(kind==='css'){
    if(document.querySelector('link[data-dfp-theme="'+rel+'"]')) return;
    var l=document.createElement('link'); l.rel='stylesheet'; l.href=rel; l.setAttribute('data-dfp-theme',rel);
    document.head.appendChild(l);
  }else{
    if(document.querySelector('script[data-dfp-theme="'+rel+'"]')) return;
    var s=document.createElement('script'); s.src=rel; s.async=false; s.setAttribute('data-dfp-theme',rel);
    document.head.appendChild(s);
  }
}

function machineId(){
  try{ if(window.CZM&&CZM.id) return CZM.id; }catch(e){}
  var p=(location.pathname.split('/').pop()||'').replace('.html','');
  return p;
}

function applyMachine(){
  var id=machineId();
  if(id==='sakura' && equipped('sakura')==='theme_sakura'){
    inject('theme-sakura.css'+V, 'css');
    inject('theme-sakura.js'+V, 'js');
  }
}

function applyLobby(){
  var eq=equipped('sakura')==='theme_sakura';
  var on='assets/theme-sakura/card.webp'+V;
  var off='assets/sakura/card.webp?v=256';
  document.querySelectorAll('a.card[data-id="sakura"] img, a.card[href="sakura.html"] img').forEach(function(img){
    var cur=img.getAttribute('src')||'';
    var want=eq?on:off;
    if(eq && cur.indexOf('theme-sakura/card')<0) img.setAttribute('src', want);
    if(!eq && cur.indexOf('theme-sakura/card')>=0) img.setAttribute('src', want);
  });
}

function boot(){
  applyMachine();
  applyLobby();
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
addEventListener('load', applyLobby);

addEventListener('storage', function(e){
  if(!e.key || e.key==='dfp_theme') applyLobby();
});
window.DFPtheme={read:read, save:save, equipped:equipped, setEq:setEq, catalog:function(){return CAT.slice()}, apply:boot, applyLobby:applyLobby};
})();
