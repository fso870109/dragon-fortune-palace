/* v28.74 金殿成就殿堂 UI（資料與進度在 casino.js） */
(function(){
if(!window.CZ||!document.getElementById('dMiss'))return;
var $=function(i){return document.getElementById(i)};
var CATS=[['all','全部'],['spin','轉動'],['win','贏分'],['mach','機台'],['feat','特色'],['gal','圖鑑'],['sign','簽到'],['frame','外框'],['social','社群'],['lv','等級'],['week','週曆']];
var TIER=['','銅','銀','金','金殿傳說'];
var ICO={spin:'assets/lx/i_task.webp?v=2848',win:'assets/lx/i_trophy.webp?v=2848',mach:'assets/lx/dragon.webp?v=2848',feat:'assets/lx/ev_gift.webp?v=2848',gal:'assets/lx/scroll.webp?v=2848',sign:'assets/lx/i_cal.webp?v=2848',frame:'assets/lobby/medal.webp?v=256',social:'assets/lx/ev_friends.webp?v=2848',lv:'assets/lx/i_trophy.webp?v=2848',week:'assets/lx/ev_km_lantern.webp?v=2849'};
var cat='all';
function fmt(n){try{return Math.floor(+n||0).toLocaleString('zh-Hant')}catch(e){return String(n)}}
function pane(which){
  var on=which==='ach';
  if($('missPane'))$('missPane').hidden=on;
  if($('achPane'))$('achPane').hidden=!on;
  if($('tabMiss'))$('tabMiss').classList.toggle('on',!on);
  if($('tabAch'))$('tabAch').classList.toggle('on',on);
  if(on)render();
}
function render(){
  var list=CZ.ACH||[],done=list.filter(function(a){return CZ.st.ach[a.id]}).length;
  var wait=CZ.unclaimed?CZ.unclaimed():0;
  if($('achSum'))$('achSum').textContent='已解鎖 '+done+' / '+list.length+(wait?('・待領 '+wait):'');
  var bar=$('achAlli');if(bar)bar.style.width=(list.length?Math.round(done/list.length*100):0)+'%';
  if($('tabAchN')){if(wait){$('tabAchN').hidden=false;$('tabAchN').textContent=wait}else $('tabAchN').hidden=true}
  var cats=$('achCats');
  if(cats&&!cats.dataset.ok){
    cats.innerHTML=CATS.map(function(c){return '<button type="button" data-cat="'+c[0]+'">'+c[1]+'</button>'}).join('');
    cats.dataset.ok='1';
    cats.onclick=function(e){var b=e.target.closest('[data-cat]');if(!b)return;cat=b.getAttribute('data-cat');render()};
  }
  if(cats)[].forEach.call(cats.querySelectorAll('[data-cat]'),function(b){b.classList.toggle('on',b.getAttribute('data-cat')===cat)});
  var box=$('ach');if(!box)return;
  var rows=list.filter(function(a){return cat==='all'||a.c===cat});
  box.innerHTML=rows.map(card).join('')||'<p class="note">這個分類還沒有成就</p>';
}
function card(a){
  var un=!!(CZ.st.ach&&CZ.st.ach[a.id]);
  var cl=!!(CZ.st.acl&&CZ.st.acl[a.id]);
  var hide=a.tier===4&&!un;
  var v=hide?0:(CZ.prog?CZ.prog(a):0);
  var g=a.g||1;
  var pct=hide?0:Math.max(0,Math.min(100,v/g*100));
  var title=hide?'？？？':a.t;
  var desc=hide?'金殿傳說・達成後顯示':a.d;
  var ic=ICO[a.c]||ICO.win;
  var btn=hide?'<button class="btn" type="button" disabled>未解鎖</button>':
    cl?'<button class="btn" type="button" disabled>已領取</button>':
    un?'<button class="btn hot" type="button" data-a="'+a.id+'">領取</button>':
    '<button class="btn" type="button" disabled>進行中</button>';
  return '<div class="acr t'+a.tier+(un?' on':'')+(cl?' got':'')+(hide?' hid':'')+'">'+
    '<span class="acs" aria-hidden="true"><img src="'+ic+'" alt="" width="36" height="36"></span>'+
    '<div class="acx"><b>'+title+'<i class="atg">'+TIER[a.tier]+'</i></b>'+
    '<small>'+desc+(hide?'':'・獎勵 '+fmt(a.r))+'</small>'+
    (hide?'':'<em>'+fmt(Math.min(v,g))+' / '+fmt(g)+'</em><div class="bar"><i style="width:'+pct+'%"></i></div>')+
    (a.bd&&un?'<u class="acb">'+a.bd+'</u>':'')+
    '</div>'+btn+'</div>';
}
var box=$('ach');
if(box)box.addEventListener('click',function(e){
  var b=e.target.closest('[data-a]');if(!b||!CZ.claimAch)return;
  if(CZ.claimAch(b.getAttribute('data-a'))){try{window.sfx&&sfx(2)}catch(err){}render();try{if(window.refresh){}}catch(err){}}
});
if($('tabMiss'))$('tabMiss').onclick=function(){pane('miss')};
if($('tabAch'))$('tabAch').onclick=function(){pane('ach')};
window.DFPach={render:render,pane:pane};
})();
