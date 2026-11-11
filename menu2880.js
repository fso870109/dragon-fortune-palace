/* v28.80 金殿選單 header / themed icons / strip purchase tiles */
(function(){
if(window.DFPmenu)return;
var FILM='<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><rect x="4" y="8" width="40" height="32" rx="6" fill="#3a0a0a" stroke="#e2b34f" stroke-width="2"/><rect x="8" y="12" width="22" height="24" rx="3" fill="#1a0404" stroke="#c99a3a" stroke-width="1.2"/><path d="M14 18h10M14 24h10M16 30h8" stroke="#e2b34f" stroke-width="1.6" stroke-linecap="round"/><path d="M34 17.5l9 6.5-9 6.5z" fill="#f0c45a" stroke="#8a5200" stroke-width="1.2" stroke-linejoin="round"/></svg>';
var BOOK='<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M10 8h20c6 0 8 3 8 7v25c0-3.5-2-6-8-6H10V8z" fill="#5a1810" stroke="#e2b34f" stroke-width="2"/><path d="M10 8h18c4.5 0 6 2 6 5.5V37" stroke="#c99a3a" stroke-width="1.2"/><path d="M16 17h14M16 23h12M16 29h10" stroke="#f0c45a" stroke-width="1.6" stroke-linecap="round"/></svg>';
function img(src){return '<img class="m16ic" src="'+src+'" alt="">'}
function svg(s){return '<span class="m16ic m16svg" aria-hidden="true">'+s+'</span>'}
function stripBuys(){
  ['czBuyBtn','czBuyHS'].forEach(function(id){
    var el=document.getElementById(id);
    if(el&&el.parentNode)el.parentNode.removeChild(el);
  });
}
function tile(id,ic,label,sub){
  var b=document.getElementById(id);if(!b)return;
  var extra=sub?'<small class="m16sub">'+sub+'</small>':'';
  b.innerHTML=ic+'<span class="m16tx"><span class="m16lb">'+label+'</span>'+extra+'</span>';
}
function enhance(){
  var m=document.getElementById('menu16');if(!m)return;
  m.classList.add('m16panel');
  if(!m.querySelector('.m16hd')){
    var hd=document.createElement('div');
    hd.className='m16hd';
    hd.innerHTML='<h2 id="m16T">選單</h2><button type="button" class="m16x" id="m16x" aria-label="關閉選單">關閉</button>';
    m.insertBefore(hd,m.firstChild);
    document.getElementById('m16x').addEventListener('click',function(e){
      e.preventDefault();e.stopPropagation();
      document.body.classList.remove('menu16');
      var mb=document.getElementById('menuBtn');
      if(mb)mb.setAttribute('aria-expanded','false');
    });
  }
  tile('adBtn',svg(FILM),'看廣告','領 200 籌碼');
  tile('dailyBtn',img('assets/lx/i_cal.webp'),'每日簽到');
  tile('lbBtn',img('assets/lx/i_rank.webp'),'排行榜');
  tile('invBtn',img('assets/lx/ev_packet.webp'),'邀請好友');
  tile('payBtn',svg(BOOK),'說明');
  stripBuys();
}
function boot(){
  enhance();
  stripBuys();
  setTimeout(stripBuys,400);
  setTimeout(stripBuys,900);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);
else boot();
addEventListener('load',function(){enhance();stripBuys()});
window.DFPmenu={enhance:enhance,stripBuys:stripBuys};
})();
