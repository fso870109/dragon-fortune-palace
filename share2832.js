/* 龍運金殿 v28.32: 大獎一鍵分享文案／短圖（純虛擬・無兌現；不影響 RTP） */
(function(){
 if(!window.CZM)return;
 var LIVE='https://fso870109.github.io/dragon-fortune-palace/';
 var last={won:0,lbl:''}, busy=0;
 function $(i){return document.getElementById(i)}
 function fmt(n){n=+n||0;try{return n.toLocaleString('zh-TW')}catch(e){return String(n)}}
 function theme(){return (window.CZM&&CZM.name)||'龍運金殿'}
 function parseAmt(){var el=$('bwAmt');if(!el)return 0;return parseInt(String(el.textContent).replace(/[^\d]/g,''),10)||0}
 function amount(){return last.won>0?last.won:parseAmt()}
 function shareText(){
  var n=amount(), t=theme();
  return '我在龍運金殿・'+t+'剛開出 '+fmt(n)+' 籌碼！金碧輝煌・閃電連線｜18+・僅供娛樂・純虛擬・無兌現 '+LIVE;
 }
 function snd(){try{window.sfx&&(sfx.click?sfx.click():sfx(1))}catch(e){}}
 function toast(m){
  try{if(window.CZ&&CZ.toast){CZ.toast(m);return}}catch(e){}
  var el=$('dfpShToast');if(!el){el=document.createElement('div');el.id='dfpShToast';el.setAttribute('role','status');
   el.style.cssText='position:fixed;left:50%;top:max(56px,calc(env(safe-area-inset-top)+48px));transform:translateX(-50%);z-index:120;padding:8px 14px;border-radius:999px;background:linear-gradient(180deg,#3a0a14,#1a0508);border:1px solid #d9a441;color:#ffe08a;font:700 13px/1.3 "Noto Sans TC",sans-serif;box-shadow:0 4px 16px rgba(0,0,0,.45);pointer-events:none;opacity:0;transition:opacity .2s;max-width:90vw;text-align:center';document.body.appendChild(el)}
  el.textContent=m;el.style.opacity='1';clearTimeout(el._t);el._t=setTimeout(function(){el.style.opacity='0'},2200);
 }
 function mkBtn(id){
  var b=document.createElement('button');b.type='button';b.id=id;b.className='dfpSh';b.textContent='分享戰績';
  b.setAttribute('aria-label','分享戰績');
  function stop(e){e.stopPropagation()}
  b.addEventListener('pointerdown',stop);b.addEventListener('touchstart',stop,{passive:true});
  b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();doShare()});
  return b;
 }
 function loadImg(src){return new Promise(function(res){var i=new Image();i.onload=function(){res(i)};i.onerror=function(){res(null)};i.crossOrigin='anonymous';i.src=src})}
 async function makeCard(){
  try{
   var c=document.createElement('canvas');c.width=720;c.height=404;var x=c.getContext('2d');if(!x)return null;
   var g=x.createLinearGradient(0,0,720,404);g.addColorStop(0,'#4a0a18');g.addColorStop(.45,'#1a0508');g.addColorStop(1,'#3a1208');
   x.fillStyle=g;x.fillRect(0,0,720,404);
   x.strokeStyle='#d9a441';x.lineWidth=6;x.strokeRect(14,14,692,376);
   x.strokeStyle='rgba(255,220,140,.35)';x.lineWidth=2;x.strokeRect(24,24,672,356);
   var logo=await loadImg('assets/lobby/logo22.webp?v=256');
   if(logo){var lw=210,lh=lw*(logo.height/logo.width);x.globalAlpha=.95;x.drawImage(logo,36,36,lw,lh);x.globalAlpha=1}
   x.fillStyle='#ffe08a';x.font='900 28px "Noto Serif TC","Noto Sans TC",serif';x.textAlign='right';x.fillText(theme(),684,70);
   x.fillStyle='#fff3c4';x.font='900 22px "Noto Sans TC",sans-serif';x.fillText('戰績分享',684,104);
   x.textAlign='center';x.fillStyle='#ffe9a0';x.font='900 64px "Noto Sans TC",Impact,sans-serif';
   x.fillText(fmt(amount()),360,230);
   x.fillStyle='#e8cfa0';x.font='700 20px "Noto Sans TC",sans-serif';x.fillText('虛擬籌碼',360,268);
   x.fillStyle='#ffd27a';x.font='700 18px "Noto Sans TC",sans-serif';x.fillText('金碧輝煌・閃電連線',360,318);
   x.fillStyle='#d9c2cf';x.font='600 15px "Noto Sans TC",sans-serif';x.fillText('18+・僅供娛樂・純虛擬・無兌現',360,352);
   var blob=await new Promise(function(r){try{c.toBlob(r,'image/png')}catch(e){r(null)}});
   if(!blob)return null;
   return new File([blob],'dragon-fortune-share.png',{type:'image/png'});
  }catch(e){return null}
 }
 async function doShare(){
  if(busy)return;busy=1;snd();
  var t=shareText(), title='龍運金殿', file=null;
  try{file=await makeCard()}catch(e){}
  try{
   if(navigator.share){
    var data={title:title,text:t,url:LIVE};
    try{
     if(file&&navigator.canShare&&navigator.canShare({files:[file]})){
      data={title:title,text:t,files:[file]};
     }
    }catch(e){}
    try{await navigator.share(data);toast('已分享戰績');busy=0;return}
    catch(e){if(e&&e.name==='AbortError'){busy=0;return}}
   }
   try{await navigator.clipboard.writeText(t);toast('已複製分享文案')}
   catch(e){toast('請手動複製分享文案')}
  }finally{busy=0}
 }
 function inject(){
  var bw=$('bw');
  if(bw&&!$('dfpShBw')){
   var btn=mkBtn('dfpShBw');
   var hint=bw.querySelector('.hint');
   if(hint)bw.insertBefore(btn,hint);else bw.appendChild(btn);
  }
  var at=$('czAtari');
  if(at&&!$('dfpShAt'))at.appendChild(mkBtn('dfpShAt'));
 }
 function sync(){
  var bw=$('bw'), b=$('dfpShBw');
  if(bw&&b){
   var ready=bw.classList.contains('show')&&bw.classList.contains('ready');
   var bb=$('bwBtn'), collect=bb&&/收下/.test(bb.textContent||'');
   var n=amount();
   b.classList.toggle('on',!!(ready&&collect&&n>0));
  }
  var at=$('czAtari'), a=$('dfpShAt');
  if(at&&a){
   var on=at.classList.contains('on')&&!at.classList.contains('out');
   var tit=(at.querySelector('.atx b')||{}).textContent||'';
   var skip=/^免費次數!!|免費次數 開始|彩金$|大獎機會/.test(tit.trim());
   a.classList.toggle('on',!!(on&&!skip&&amount()>0));
  }
 }
 // Outermost wrap so mid/big win + 免費次數結束 all set last.won
 var _bw=window.bigWin;
 if(_bw&&!_bw.__dfpSh){
  window.bigWin=function(won,total,o){
   o=o||{};last.won=+won||0;last.lbl=(o.tier&&o.tier[1])||o.lbl||'';
   var r=_bw.apply(this,arguments);try{sync()}catch(e){}return r};
  window.bigWin.__dfpSh=1;
 }
 inject();
 var mo=new MutationObserver(function(){sync()});
 ['bw','czAtari'].forEach(function(id){var e=$(id);if(e)mo.observe(e,{attributes:true,attributeFilter:['class'],subtree:false})});
 var bb=$('bwBtn');if(bb)mo.observe(bb,{characterData:true,childList:true,subtree:true});
 var amt=$('bwAmt');if(amt)mo.observe(amt,{characterData:true,childList:true,subtree:true});
 // czAtari is created by casino.js before this script; reinject if missing
 if(!$('czAtari')){var t0=Date.now();(function wait(){if($('czAtari')||Date.now()-t0>4000){inject();var e=$('czAtari');if(e)mo.observe(e,{attributes:true,attributeFilter:['class']});sync();return}setTimeout(wait,50)})()}
 sync();
 window.DFPshare={sync:sync,text:shareText,share:doShare};
})();
