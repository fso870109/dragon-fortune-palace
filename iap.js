/* 龍運金殿 Play Billing client wrapper.
   Feature flag DFP_IAP stays OFF. Even when later turned on, NT$ is App/Play only — never on the web. */
(function(){
  if(typeof window.DFP_IAP!=='boolean') window.DFP_IAP=false;
  function native(){
    try{
      return !!(window.Capacitor&&((Capacitor.isNativePlatform&&Capacitor.isNativePlatform())||Capacitor.isNative===true));
    }catch(e){return false}
  }
  function enabled(){return !!(window.DFP_IAP&&native())}
  function plugin(){
    try{
      var C=window.Capacitor;
      if(!C)return null;
      if(C.Plugins&&C.Plugins.PlayBilling)return C.Plugins.PlayBilling;
      if(typeof C.registerPlugin==='function')return C.registerPlugin('PlayBilling');
    }catch(e){}
    return null;
  }
  async function call(name, args){
    if(!enabled()) return {ok:false, reason:'off'};
    var p=plugin();
    if(!p||typeof p[name]!=='function') return {ok:false, reason:'no-plugin'};
    try{return await p[name](args||{})}
    catch(e){return {ok:false, reason:String(e&&e.message||e)}}
  }
  window.DFPiap={
    enabled:enabled,
    native:native,
    queryProducts:function(ids){return call('queryProducts',{productIds:ids||[]})},
    purchase:function(sku){return call('purchase',{productId:sku})},
    restore:function(){return call('restore',{})},
    acknowledge:function(token){return call('acknowledge',{purchaseToken:token})}
  };
})();
