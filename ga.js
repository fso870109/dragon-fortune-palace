/* v28.157 web-only GA4. Never loads gtag inside the Capacitor Android app. */
(function(){
try{
  if(window.__dfpGaInit)return;
  function isNative(){
    try{
      var C=window.Capacitor;
      if(!C)return false;
      if(typeof C.isNativePlatform==='function'&&C.isNativePlatform())return true;
      if(C.isNative===true)return true;
    }catch(e){}
    return false;
  }
  if(isNative())return;
  window.__dfpGaInit=1;

  var MID='G-JQYWLGJR3F';
  var MACH={matsuri:'夏祭花火',sakura:'櫻花斬',samurai:'天下布武',neko:'招財大作戰'};
  var queued=[];
  function send(name,params){
    try{
      if(typeof window.gtag==='function'){window.gtag('event',name,params||{});return;}
      queued.push([name,params||{}]);
    }catch(e){}
  }
  window.DFPga=function(name,params){send(name,params);};

  function boot(){
    try{
      if(isNative())return;
      window.dataLayer=window.dataLayer||[];
      function gtag(){dataLayer.push(arguments);}
      window.gtag=gtag;
      var s=document.createElement('script');
      s.async=true;
      s.src='https://www.googletagmanager.com/gtag/js?id='+MID;
      s.onerror=function(){};
      (document.head||document.documentElement).appendChild(s);
      gtag('js',new Date());
      gtag('config',MID,{send_page_view:true,allow_google_signals:false,allow_ad_personalization_signals:false});
      for(var i=0;i<queued.length;i++){try{gtag('event',queued[i][0],queued[i][1]);}catch(e){}}
      queued=[];
    }catch(e){}
  }
  if(typeof requestIdleCallback==='function')requestIdleCallback(boot,{timeout:3000});
  else setTimeout(boot,1);

  var path=(location.pathname||'').split('/').pop()||'';
  var mid=path.replace(/\.html$/,'');
  if(mid==='index'||mid===''||mid==='.')mid='';
  if(MACH[mid])send('select_machine',{machine_name:MACH[mid],machine_id:mid});

  var spinN=0,spinSent=0,spinT=0;
  function reportSpin(){
    spinN++;
    var now=Date.now();
    if(spinT&&now-spinT<8000)return;
    var n=spinN-spinSent;
    if(n<=0)return;
    spinSent=spinN;spinT=now;
    var p={value:n};
    if(MACH[mid])p.machine_name=MACH[mid];
    send('spin',p);
  }
  function hookSpin(){
    try{
      if(typeof window.spin==='function'&&!window.spin.__dfpGa){
        var orig=window.spin;
        var w=function(){try{reportSpin();}catch(e){}return orig.apply(this,arguments);};
        w.__dfpGa=1;
        window.spin=w;
      }
    }catch(e){}
  }

  function reportSign(){
    send('daily_check_in',MACH[mid]?{machine_name:MACH[mid]}:{});
  }
  function hookSign(){
    try{
      if(window.CZ&&typeof CZ.trackSign==='function'&&!CZ.trackSign.__dfpGa){
        var ts=CZ.trackSign;
        var w=function(){try{reportSign();}catch(e){}return ts.apply(this,arguments);};
        w.__dfpGa=1;
        CZ.trackSign=w;
      }
      if(typeof window.dClaim==='function'&&!window.dClaim.__dfpGa){
        var dc=window.dClaim;
        var w2=function(){
          var claimed=false;
          try{var d=typeof dState==='function'&&dState();claimed=!!(d&&d.claimed);}catch(e){}
          var r=dc.apply(this,arguments);
          if(!claimed)try{reportSign();}catch(e){}
          return r;
        };
        w2.__dfpGa=1;
        window.dClaim=w2;
        var btn=document.getElementById('dClaim');
        if(btn&&btn.onclick===dc)btn.onclick=w2;
      }
    }catch(e){}
  }

  function hook(){hookSpin();hookSign();}
  hook();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',hook);
  addEventListener('load',hook);
  var n=0,iv=setInterval(function(){hook();if(++n>=20)clearInterval(iv);},500);
}catch(e){}
})();
