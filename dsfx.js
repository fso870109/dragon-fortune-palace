/* v269 reliable palace-door SFX on lobby + themes: own tiny AudioContext, buffers fetched+decoded at load,
   resumed inside the tap gesture, HTMLAudio fallback if the context is still locked. Respects fs_sound / fs_sv. */
(function(){if(window.DFPds)return;var V='?v=269',N=['door_close','door_open'],B={},A={},c=null,log=window.__dsLog=[];
function ok(){try{if(window.DFPvol)return DFPvol.sfxOn();return localStorage.getItem('fs_sound')!=='0'}catch(e){return true}}
function vol(){try{if(window.DFPvol)return DFPvol.sfx()}catch(e){}var v=1;try{var s=localStorage.getItem('fs_sv');if(s!=null&&s!=='')v=+s}catch(e){}return isFinite(v)?Math.max(0,Math.min(1,v)):1}
function ctx(){if(c)return c;try{var C=window.AudioContext||window.webkitAudioContext;if(C)c=new C({latencyHint:'interactive'})}catch(e){}return c}
function dec(n,ab){var x=ctx();if(!x)return;try{var p=x.decodeAudioData(ab.slice(0),function(b){B[n]=b},function(){});if(p&&p.then)p.then(function(b){B[n]=b},function(){})}catch(e){}}
N.forEach(function(n){fetch('assets/audio/sfx_'+n+'.mp3'+V).then(function(r){return r.arrayBuffer()}).then(function(ab){dec(n,ab)}).catch(function(){});
 try{var a=new Audio('assets/audio/sfx_'+n+'.mp3'+V);a.preload='auto';A[n]=a}catch(e){}});
function unlock(){var x=ctx();if(x&&x.state!=='running')try{x.resume()}catch(e){}}
['pointerdown','touchstart','keydown','click'].forEach(function(t){addEventListener(t,unlock,{capture:true,passive:true})});
function html(n,g){var a=A[n];if(!a)return false;try{a.currentTime=0;a.volume=Math.min(1,g);var p=a.play();if(p&&p.catch)p.catch(function(){log.push(['blocked',n])});log.push(['html',n]);return true}catch(e){return false}}
function play(n,g){if(!ok()||document.hidden)return;g=(g||1)*vol();var x=ctx();
 if(x&&x.state!=='running')try{x.resume()}catch(e){}
 var go=function(){var b=B[n];if(x&&b&&x.state==='running'){var s=x.createBufferSource(),G=x.createGain();G.gain.value=g;s.buffer=b;s.connect(G).connect(x.destination);s.start();log.push(['wa',n,performance.now()|0]);return true}return false};
 if(go())return;var t=performance.now();(function w(){if(go())return;if(performance.now()-t<350){setTimeout(w,25);return}html(n,g)})()}
window.DFPds={play:play,unlock:unlock,_c:function(){return c&&c.state}};})();
