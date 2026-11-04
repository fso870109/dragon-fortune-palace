/* v25.3 app lifecycle (Google Play quality): while the page/app is in the background (visibilitychange hidden,
   pagehide, freeze, or Capacitor/Android onPause via window.dfpLife(false)) every AudioContext is suspended,
   any playing <audio>/<video> is paused, no new one-shot sounds are queued and navigator.vibrate is a no-op.
   On return only what we suspended is resumed; mute/BGM settings stay in each page's own gain/mus logic.
   Load right after rm.js, before any script that creates audio or listens to visibilitychange. */
(function(){
if(window.dfpLife)return;
var NP=false,FZ=false,BG=false,doc=document,DP=Document.prototype;
var DH=Object.getOwnPropertyDescriptor(DP,'hidden'),DV=Object.getOwnPropertyDescriptor(DP,'visibilityState');
function raw(){try{return !!(DH&&DH.get&&DH.get.call(doc))}catch(e){return false}}
/* native pause also counts as hidden for every existing document.hidden check */
try{if(DH&&DH.get&&DV&&DV.get){Object.defineProperty(doc,'hidden',{configurable:true,get:function(){return NP||raw()}});
 Object.defineProperty(doc,'visibilityState',{configurable:true,get:function(){return NP?'hidden':DV.get.call(doc)}})}}catch(e){}
function bg(){return NP||FZ||raw()}
var CT=[],MD=[],A=window.AudioContext||window.webkitAudioContext,R=A&&A.prototype.resume,SU=A&&A.prototype.suspend;
function hush(c){try{if(c.state!=='closed'&&c.state!=='suspended'){c.__dfpS=1;SU.call(c)}}catch(e){}}
if(A){try{var X=class extends A{constructor(a){super(a);CT.push(this);if(BG)hush(this)}};
 window.AudioContext=X;if(window.webkitAudioContext)window.webkitAudioContext=X;
 A.prototype.resume=function(){if(BG){if(this.state!=='closed')this.__dfpS=1;return Promise.resolve()}return R.apply(this,arguments)};
 var SN=window.AudioScheduledSourceNode&&AudioScheduledSourceNode.prototype;
 if(SN){var ST=SN.start,SP=SN.stop;
  /* one-shot SFX fired by timers while hidden would otherwise queue up and burst on return; loops (BGM) may start */
  SN.start=function(){if(BG&&!this.loop){this.__dfpX=1;return}return ST.apply(this,arguments)};
  SN.stop=function(){if(this.__dfpX)return;return SP.apply(this,arguments)}}}catch(e){}}
var MP=HTMLMediaElement.prototype.play;
HTMLMediaElement.prototype.play=function(){if(MD.indexOf(this)<0)MD.push(this);if(BG){this.__dfpS=1;return Promise.resolve()}return MP.apply(this,arguments)};
var NV=window.Navigator&&Navigator.prototype.vibrate;
if(NV)Navigator.prototype.vibrate=function(p){if(BG||bg())return false;return NV.apply(this,arguments)};
function hide(){if(BG)return;BG=true;CT.forEach(hush);
 var m=MD.concat([].slice.call(doc.querySelectorAll('audio,video')));m.forEach(function(e){try{if(!e.paused){e.__dfpS=1;e.pause()}}catch(x){}});
 try{NV&&NV.call(navigator,0)}catch(e){}}
function show(){if(!BG||bg())return;BG=false;
 CT.forEach(function(c){if(c.__dfpS){c.__dfpS=0;try{if(c.state==='suspended'){var p=R.call(c);p&&p.catch&&p.catch(function(){})}}catch(e){}}});
 MD.forEach(function(e){if(e.__dfpS){e.__dfpS=0;try{var p=MP.call(e);p&&p.catch&&p.catch(function(){})}catch(x){}}})}
function sync(){bg()?hide():show()}
var last=bg();
function fire(){var h=bg();if(h===last)return;last=h;try{doc.dispatchEvent(new Event('visibilitychange'))}catch(e){}}
doc.addEventListener('visibilitychange',function(){last=bg();sync()},true);
addEventListener('pagehide',hide,true);
addEventListener('pageshow',function(){FZ=false;sync()},true);
doc.addEventListener('freeze',function(){FZ=true;hide()},true);
doc.addEventListener('resume',function(){FZ=false;sync()},true);
/* called by MainActivity.onPause/onResume (Capacitor); lets page handlers run as if visibility changed */
window.dfpLife=function(on){NP=!on;sync();fire();return true};
})();
