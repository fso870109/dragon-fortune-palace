/* 龍運金殿 lobby first-run hint (v256). Shown once (localStorage fs_hint=1) after the splash and age gate:
   step 1 spotlights 🎁 免費籌碼 / 📅 每日簽到, step 2 the first machine card. Uses a top-layer <dialog>
   so Android back / Escape close it (counts as seen). No effect on returning players. */
(function(){
var LS=localStorage,K='fs_hint';try{if(LS.getItem(K)==='1')return}catch(e){return}
function $(i){return document.getElementById(i)}
var css=document.createElement('style');css.textContent=
'#dHint{position:fixed;inset:0;width:100vw;height:100dvh;max-width:none;max-height:none;margin:0;padding:0;border:0;background:transparent;overflow:hidden;color:#fff4dc}'+
'#dHint::backdrop{background:transparent}'+
'#dHint .hh{position:absolute;border-radius:16px;box-shadow:0 0 0 200vmax rgba(6,1,8,.72),0 0 0 2px #f6d27a,0 0 18px 4px rgba(255,200,90,.65),inset 0 0 14px rgba(255,210,120,.35);pointer-events:none;transition:all .45s cubic-bezier(.22,.8,.24,1)}'+
'#dHint .hh::after{content:"";position:absolute;inset:-7px;border-radius:21px;border:1.5px solid rgba(255,214,120,.7);animation:hhP 1.6s cubic-bezier(.4,0,.2,1) infinite}'+
'@keyframes hhP{0%{opacity:.9;transform:scale(.97)}100%{opacity:0;transform:scale(1.08)}}'+
'#dHint .hb{position:absolute;left:50%;width:min(320px,88vw);transform:translateX(-50%);padding:14px 16px 12px;border-radius:16px;text-align:center;'+
'background:linear-gradient(#2b0c22,#0e0410);border:1.5px solid #d9a441;box-shadow:0 0 0 1px #000,0 0 0 4px rgba(217,164,65,.18),inset 0 1px 0 rgba(255,230,170,.35),0 10px 30px rgba(0,0,0,.6);transition:top .45s cubic-bezier(.22,.8,.24,1);animation:hbIn .5s cubic-bezier(.22,.8,.24,1)}'+
'@keyframes hbIn{from{opacity:0;transform:translate(-50%,8px)}to{opacity:1;transform:translate(-50%,0)}}'+
'#dHint .hb b{display:block;font:900 18px/1.35 "TCDisp","Noto Serif TC",serif;letter-spacing:.06em;background:linear-gradient(#fff8d8,#ffd56a 55%,#d08a1a);-webkit-background-clip:text;background-clip:text;color:transparent}'+
'#dHint .hb p{margin:6px 0 12px;font:500 13.5px/1.6 "Noto Sans TC",sans-serif;color:#efdcc4}'+
'#dHint .hr{display:flex;gap:10px;justify-content:center;align-items:center}'+
'#dHint .hr button{font:700 14px "Noto Sans TC",sans-serif;border-radius:20px;padding:8px 18px;cursor:pointer}'+
'#dHint .hs{background:transparent;border:1px solid rgba(217,164,65,.5);color:#cdb59a}'+
'#dHint .hn{border:1px solid #ffe3a0;color:#3a1000;background:linear-gradient(#fff2c0,#f3c24f 55%,#c4841c);box-shadow:0 2px 0 #6b3a06,0 0 12px rgba(255,200,90,.5)}'+
'#dHint .hd{margin-top:9px;font-size:11px;color:#a98fa6;letter-spacing:.1em}'+
'@media (prefers-reduced-motion:reduce){#dHint .hh,#dHint .hb{transition:none;animation:none}#dHint .hh::after{animation:none;opacity:0}}';
document.head.appendChild(css);
var STEPS=[
 {t:function(){return [$('bFree'),$('bDaily')]},h:'免費籌碼・每日簽到',p:'每 3 小時可領免費籌碼，每天簽到再領更多。<br>籌碼皆為虛擬點數，僅供娛樂。'},
 {t:function(){var c=document.querySelector('.lxHc[href],.card[href]');return c?[c]:[]},h:'點選機台開始遊戲',p:'金碧輝煌的機台等你挑戰，點選卡片即可進入。<br>祝你鴻運當頭！',scroll:1}
];
var d,hh,hb,i=0,shown=0;
function rectOf(els){var r=null;els.forEach(function(e){if(!e)return;var b=e.getBoundingClientRect();if(!b.width)return;
 r=r?{l:Math.min(r.l,b.left),t:Math.min(r.t,b.top),r:Math.max(r.r,b.right),b:Math.max(r.b,b.bottom)}:{l:b.left,t:b.top,r:b.right,b:b.bottom}});return r}
function place(){if(!d||!d.open)return;var s=STEPS[i],r=rectOf(s.t());if(!r){finish();return}
 var pad=6,vh=innerHeight,l=Math.max(4,r.l-pad),t=Math.max(4,r.t-pad),R=Math.min(innerWidth-4,r.r+pad),B=Math.min(vh-4,r.b+pad);
 hh.style.left=l+'px';hh.style.top=t+'px';hh.style.width=(R-l)+'px';hh.style.height=(B-t)+'px';
 var bh=hb.offsetHeight||150,below=vh-B,y=below>=bh+20?B+14:Math.max(8,t-bh-14);
 if(y+bh>vh-8&&t<bh+20)y=Math.max(8,vh-bh-8);hb.style.top=y+'px'}
function render(){var s=STEPS[i],last=i===STEPS.length-1;
 hb.innerHTML='<b>'+s.h+'</b><p>'+s.p+'</p><div class="hr"><button class="hs" type="button">略過</button><button class="hn" type="button">'+(last?'開始遊戲':'下一步')+'</button></div><div class="hd">'+(i+1)+' / '+STEPS.length+'</div>';
 hb.style.animation='none';void hb.offsetWidth;hb.style.animation='';
 hb.querySelector('.hs').onclick=function(){snd(1);finish()};
 hb.querySelector('.hn').onclick=function(){snd(last?2:1);if(last){var c=STEPS[i].t()[0];finish();c&&setTimeout(function(){c.click()},60)}else{i++;go()}};}
function snd(k){try{window.sfx&&window.sfx(k);window.CZ&&CZ.vib&&CZ.vib(8)}catch(e){}}
function go(){var s=STEPS[i];if(s.scroll){var e=s.t()[0];if(e){e.scrollIntoView({block:'center',behavior:'instant'});}}
 render();requestAnimationFrame(place)}
function finish(){try{LS.setItem(K,'1')}catch(e){}if(d&&d.open)d.close()}
function show(){if(shown)return;shown=1;try{LS.setItem(K,'1')}catch(e){}
 d=document.createElement('dialog');d.id='dHint';d.setAttribute('aria-label','新手提示');d.innerHTML='<div class="hh"></div><div class="hb" role="status"></div>';
 document.body.appendChild(d);hh=d.firstChild;hb=d.lastChild;
 d.addEventListener('close',function(){removeEventListener('resize',place);setTimeout(function(){d.remove()},50)});
 d.addEventListener('click',function(e){if(e.target===d){var n=hb.querySelector('.hn');n&&n.click()}});
 addEventListener('resize',place);
 try{d.showModal()}catch(e){d.setAttribute('open','')}
 go()}
function ready(){if($('load'))return false;if(document.querySelector('dialog[open]'))return false;try{if(LS.getItem('dfp_age18')!=='1')return false}catch(e){}
 if(document.visibilityState==='hidden')return false;return !!$('bFree')&&!!document.querySelector('.lxHc[href],.card[href]')}
var n=0,tm=setInterval(function(){if(ready()){if(++n>=3){clearInterval(tm);show()}}else n=0},250);
})();
