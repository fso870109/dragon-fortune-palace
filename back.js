/* 龍運金殿 Android back-button handling (v242). The native app calls window.dfpBack(); returns true if handled in-page,
   false to let the app run its 「再按一次離開」 exit. Also bound to Escape on desktop browsers for parity. */
(function(){
function topDialog(){var a=document.querySelectorAll('dialog[open]');return a.length?a[a.length-1]:null}
function isLobby(){var p=location.pathname.split('/').pop();return p===''||p==='index.html'}
window.dfpBack=function(){
 try{
  var d=topDialog();
  if(d){
   if(d.id==='ageGate'){ // first-run age gate: 「返回」 from the under-18 screen, otherwise let the app exit
    if(d.classList.contains('no')){d.classList.remove('no');return true}return false}
   var ev=new Event('cancel',{cancelable:true});d.dispatchEvent(ev);
   if(!ev.defaultPrevented){try{d.close()}catch(e){d.removeAttribute('open')}}
   return true}
  // full-screen win/atari overlays already listen for Escape (skip / continue)
  var k=new KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true});window.dispatchEvent(k);
  if(k.defaultPrevented)return true;
  if(isLobby())return false;
  var L=document.getElementById('czLobby');
  if(L){L.click();return true}
  location.href='index.html';return true
 }catch(e){return false}
};
})();
