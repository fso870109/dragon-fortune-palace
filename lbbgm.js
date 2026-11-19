/* v28.149 shared lobby BGM for index.html + standalone shop.html.
   Same track and loop as the lobby bed. Honors DFPvol on/off and volume.
   When shop.html is embedded in the lobby iframe, do not start a second bed —
   the lobby AudioContext must keep playing without a gap.
   Autoplay: try on load; if the browser blocks, resume on first pointerdown.
   Does not change machine or lobby SFX. */
(function(){
if(window.DFPbgm)return;
function isEmbed(){
  try{
    if(new URLSearchParams(location.search).get('embed')==='1') return true;
    if(window.self!==window.top) return true;
  }catch(e){ return true; }
  return false;
}
if(isEmbed()){
  var nop=function(){};
  window.DFPbgm={start:nop,stop:nop,fade:nop,save:nop,pos:function(){return 0},leaveToMachine:nop,leaveToShopOrLobby:nop,embed:true};
  return;
}
var SRC='assets/audio/bgm_lobby.mp3?v=256';
var PRE=.3, LOOP=62.950816, GAIN=.85, KEY='dfp_lbbgm_pos';
var ac=null, mg=null, buf=null, src=null, t0=0, off=PRE, want=false, leaving=false, loading=null, tried=false;

function musOn(){
  try{if(window.DFPvol)return DFPvol.musOn()}catch(e){}
  try{return localStorage.getItem('cz_bgm')!=='0'&&localStorage.getItem('fs_music')!=='0'}catch(e){return true}
}
function musLevel(){
  try{if(window.DFPvol)return DFPvol.mus()}catch(e){}
  return musOn()?1:0;
}
function wrap(p){
  p=+p; if(!isFinite(p)||p<0) p=PRE;
  if(p<PRE) p=PRE;
  var span=LOOP; if(span<=0) return PRE;
  return PRE+(((p-PRE)%span)+span)%span;
}
function loadPos(){
  try{return wrap(parseFloat(sessionStorage.getItem(KEY)||''))}catch(e){return PRE}
}
function nowPos(){
  if(!ac||!src) return loadPos();
  return wrap(off+Math.max(0, ac.currentTime-t0));
}
function savePos(){
  try{sessionStorage.setItem(KEY, String(nowPos()))}catch(e){}
}

function aInit(){
  if(ac) return ac;
  try{
    if(window.__dfpAC){ac=window.__dfpAC}
    else{
      var C=window.AudioContext||window.webkitAudioContext; if(!C) return null;
      ac=new C(); window.__dfpAC=ac;
    }
    mg=ac.createGain(); mg.gain.value=0; mg.connect(ac.destination);
    window.__dfpMusGain=mg;
  }catch(e){return null}
  return ac;
}

function loadBuf(){
  if(buf) return Promise.resolve(buf);
  if(loading) return loading;
  if(!aInit()) return Promise.resolve(null);
  loading=fetch(SRC).then(function(r){if(!r.ok)throw 0;return r.arrayBuffer()}).then(function(ab){
    return new Promise(function(ok,no){var p=ac.decodeAudioData(ab,ok,no); if(p&&p.then)p.then(ok,no)});
  }).then(function(b){buf=b; loading=null; return b}).catch(function(){loading=null; return null});
  return loading;
}

function stopSrc(){
  if(!src)return;
  try{src.stop()}catch(e){}
  try{src.disconnect()}catch(e){}
  src=null;
}
function fadeTo(v,sec){
  if(!mg||!ac)return;
  var t=ac.currentTime;
  try{
    mg.gain.cancelScheduledValues(t);
    mg.gain.setValueAtTime(mg.gain.value,t);
    mg.gain.linearRampToValueAtTime(Math.max(0,v), t+(sec||.25));
  }catch(e){}
}

function start(fromPos){
  if(leaving) return;
  want=true;
  if(!musOn()||musLevel()<=0){ if(mg) fadeTo(0,.2); return; }
  if(!aInit()) return;
  var go=function(){
    if(leaving||!want||!buf) return;
    var after=function(){
      if(leaving||!want) return;
      if(!src){
        src=ac.createBufferSource();
        src.buffer=buf; src.loop=true;
        src.loopStart=PRE; src.loopEnd=PRE+LOOP;
        src.connect(mg);
        off=(fromPos!=null && isFinite(+fromPos))?wrap(fromPos):loadPos();
        t0=ac.currentTime;
        try{src.start(t0, off)}catch(e){try{src.start(0, off)}catch(e2){}}
      }
      fadeTo(GAIN*musLevel(), 1.0);
    };
    try{
      var p=ac.resume&&ac.resume();
      if(p&&p.then) p.then(after, after); else after();
    }catch(e){ after(); }
  };
  if(buf) go(); else loadBuf().then(function(b){ if(b) go(); });
}

function stop(fade){
  savePos();
  if(!ac||!mg){ stopSrc(); return; }
  fadeTo(0, fade?0.25:0.04);
  if(fade) setTimeout(stopSrc, 280); else stopSrc();
}

function lobbyGate(){
  var L=document.getElementById('load');
  if(L && !L.classList.contains('out') && !L.dataset.go) return false;
  return true;
}

function boot(){
  if(tried) return; tried=true;
  if(!musOn()) return;
  if(!lobbyGate()) return;
  start();
}

function onVol(){
  if(musOn()&&musLevel()>0){ if(!src) start(); else fadeTo(GAIN*musLevel(), .08); }
  else fadeTo(0, .08);
}

if(window.DFPvol) DFPvol.onChange(onVol);
document.addEventListener('dfp-vol', onVol);

addEventListener('pagehide', function(){ savePos(); stop(false); });
addEventListener('beforeunload', function(){ savePos(); });
document.addEventListener('visibilitychange', function(){
  if(document.hidden){ savePos(); stop(false); }
  else if(!leaving && musOn() && lobbyGate()) setTimeout(function(){ if(!document.hidden && !leaving) start(); }, 120);
});
addEventListener('pageshow', function(){ leaving=false; if(musOn()&&lobbyGate()) start(); });
addEventListener('pointerdown', function(){
  if(leaving||!musOn()||!lobbyGate()) return;
  if(!src) start();
  else if(ac && ac.state==='suspended') start();
}, {capture:true});

if(document.readyState==='complete') setTimeout(boot, 200);
else addEventListener('load', function(){ setTimeout(boot, 200); });

window.DFPbgm={
  start:function(){ leaving=false; start(); },
  stop:function(){ stop(true); },
  fade:function(){ fadeTo(0,.25); },
  save:savePos,
  pos:nowPos,
  leaveToMachine:function(){ leaving=true; savePos(); stop(true); },
  leaveToShopOrLobby:function(){ savePos(); }
};
})();
