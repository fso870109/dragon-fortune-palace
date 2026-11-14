/* 龍運金殿 Android back-button handling (v243). The native app calls window.dfpBack(); returns true if handled in-page,
   false to let the app run its 「再按一次離開」 exit. Also bound to Escape on desktop browsers for parity.
   v243: closes non-<dialog> panels (玩法說明, 選單, 音訊設定), skips the 大獎 overlay correctly, and never leaves a
   theme while a spin / free spins / feature is still running (so no win is lost). */
(function(){
function $(i){return document.getElementById(i)}
function topDialog(){var a=document.querySelectorAll('dialog[open]');return a.length?a[a.length-1]:null}
function isLobby(){var p=location.pathname.split('/').pop();return p===''||p==='index.html'}
function vis(e){return !!(e&&e.isConnected&&!e.hidden&&e.getClientRects().length)}
function g(n){try{return Function('return typeof '+n+'!=="undefined"?'+n+':null')()}catch(e){return null}}
function busy(){
 if(g('spinning')||g('FS'))return true;
 if(document.body.classList.contains('b22on'))return true;
 var hs=$('hsBox'),mg=$('czMG'),tw=$('twBox');
 return !!((hs&&vis(hs))||(mg&&mg.classList.contains('open'))||(tw&&vis(tw)));
}
var tt;function toast(t){var e=$('dfpToast');if(!e){e=document.createElement('div');e.id='dfpToast';e.setAttribute('role','status');
 e.style.cssText='position:fixed;left:50%;top:calc(env(safe-area-inset-top) + 64px);transform:translate(-50%,-8px);z-index:2147482000;max-width:94vw;white-space:nowrap;padding:9px 18px;border-radius:20px;'+
 'background:linear-gradient(180deg,rgba(58,10,10,.95),rgba(26,4,4,.95));border:1px solid #e2b34f;box-shadow:0 6px 20px rgba(0,0,0,.6),0 0 14px rgba(255,190,70,.25);color:#ffe3a0;'+
 'font:700 13.5px/1.4 "Noto Sans TC","PingFang TC",sans-serif;text-align:center;opacity:0;pointer-events:none;transition:opacity .25s cubic-bezier(.4,0,.2,1),transform .25s cubic-bezier(.4,0,.2,1)';
 document.body.appendChild(e)}
 e.textContent=t;requestAnimationFrame(function(){e.style.opacity='1';e.style.transform='translate(-50%,0)'});
 clearTimeout(tt);tt=setTimeout(function(){e.style.opacity='0';e.style.transform="translate(-50%,-8px)"},1800)}
window.dfpBack=function(){
 try{
  var d=topDialog();
  if(d){
   if(d.id==='ageGate'){ // first-run age gate: 「返回」 from the under-18 screen, otherwise let the app exit
    if(d.classList.contains('no')){d.classList.remove('no');return true}return false}
   var ev=new Event('cancel',{cancelable:true});d.dispatchEvent(ev);
   if(!ev.defaultPrevented){try{d.close()}catch(e){d.removeAttribute('open')}}
   return true}
  // 玩法說明 cards: back = finish the tutorial (same as 開始遊戲)
  var h=$('h21');if(h&&!h.classList.contains('out')){try{localStorage.setItem('czHelp21','1')}catch(e){}h.classList.add('out');setTimeout(function(){h.remove()},400);return true}
  // theme 音訊設定 popover and ☰ 選單
  var p=$('audioPop');if(p&&!p.hidden){p.hidden=true;var sb=$('setBtn');if(sb)sb.setAttribute('aria-expanded',false);return true}
  if(document.body.classList.contains('menu16')){document.body.classList.remove('menu16');var mb=$('menuBtn');if(mb)mb.setAttribute('aria-expanded',false);return true}
  // full-screen 大獎 / atari overlays listen for Escape on document or window (skip / continue)
  var k=new KeyboardEvent('keydown',{key:'Escape',code:'Escape',bubbles:true,cancelable:true});document.dispatchEvent(k);
  if(k.defaultPrevented)return true;
  if(isLobby())return false;
  if(g('bwState')||busy()){toast('遊戲進行中，結束後再返回大廳');return true}
  var L=$('czLobby');
  if(L){L.click();return true}
  location.href='index.html';return true
 }catch(e){return false}
};
})();
