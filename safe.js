/* Preview only — not shipped.
   Reads env(safe-area-inset-top); if it is 0 (common in the immersive Android WebView),
   accepts a CSS-pixel inset from the app via window.DFPsetSafeInset(top). */
(function(){
  if(window.DFPsafe) return;
  var root=document.documentElement;
  var p=(location.pathname.split('/').pop()||'');
  if(/^(sakura|neko|samurai|matsuri)\.html$/i.test(p)) root.classList.add('dfp-game');

  function apply(px){
    var n=Math.max(0, Math.round(Number(px)||0));
    root.style.setProperty('--dfp-sat', n+'px');
  }
  function envPx(){
    try{
      var d=document.createElement('div');
      d.style.cssText='position:absolute;visibility:hidden;pointer-events:none;padding-top:env(safe-area-inset-top,0px)';
      (document.body||root).appendChild(d);
      var v=parseFloat(getComputedStyle(d).paddingTop)||0;
      d.remove();
      return v;
    }catch(e){ return 0; }
  }
  window.DFPsetSafeInset=function(top){
    apply(top);
    try{ sessionStorage.setItem('dfp_sat', String(Math.max(0, Math.round(Number(top)||0)))); }catch(e){}
  };
  // Restore a value the Android bridge already posted before this script ran
  try{
    if(typeof window.__dfpSat==='number') apply(window.__dfpSat);
    else {
      var s=sessionStorage.getItem('dfp_sat');
      if(s!=null) apply(s);
    }
  }catch(e){}
  window.DFPsafe={env:envPx, set:window.DFPsetSafeInset, apply:apply};
})();
