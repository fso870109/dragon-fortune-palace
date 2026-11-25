/* 龍運金殿 settings & haptics (v241, 減少動態效果 v245): lobby 設定 sheet + 震動回饋 toggle in every theme */
/* v259: version line in 設定 (APPV filled in by app/build.sh) */
var DFP_WEBV='28.162',DFP_APPV='';
var DFP_IAP=false;
var DFP_DEL=true; /* 刪除帳號按鈕：Firestore 刪除規則發布並測試後才改 true */
var DFP_NOADS=false; /* 去廣告分頁：false 時隱藏（網頁與 App 共用）；廣告與付款都準備好再改 true */
(function(){var LS=window.localStorage,g=function(k){try{return LS.getItem(k)}catch(e){return null}},s=function(k,v){try{LS.setItem(k,v)}catch(e){}};
var CAN=typeof navigator!=='undefined'&&typeof navigator.vibrate==='function';
function vibOn(){return CAN&&g('fs_vib')!=='0'}
var lastV=0;function hap(p){if(!vibOn()||document.hidden)return;var n=performance.now();if(typeof p==='number'&&n-lastV<40)return;lastV=n;try{navigator.vibrate(p)}catch(e){}}
window.DFPhap=hap;
var $=function(id){return document.getElementById(id)};
function css(t){var e=document.createElement('style');e.textContent=t;document.head.appendChild(e)}
/* ---------- theme pages ---------- */
function theme(){var pop=$('audioPop');if(!pop||$('vibBtn'))return;
 css('#audioPop{left:50%!important;right:auto!important;box-sizing:border-box;width:min(calc(100vw - 20px),560px);margin-left:calc(min(calc(100vw - 20px),560px) / -2)!important}');
 var b=document.createElement('button');b.id='vibBtn';b.type='button';
 function r(){var on=vibOn();b.textContent=CAN?('震動：'+(on?'開':'關')):'震動：此裝置不支援';b.setAttribute('aria-pressed',on);b.disabled=!CAN}
 r();b.onclick=function(){s('fs_vib',vibOn()?'0':'1');r();if(vibOn())hap(25);try{sfx.click()}catch(e){}};
 var host=$('dfpVolMenu')||pop;var mb=$('musBtn');if(host)host.appendChild(b);else if(mb&&mb.nextSibling)pop.insertBefore(b,mb.nextSibling);else pop.appendChild(b);
 var RMx=window.DFPrm;if(RMx){var m=document.createElement('button');m.id='rmBtn';m.type='button';
  function rr(){var on=RMx.on||RMx.sys;m.textContent='減少動態：'+(on?'開':'關')+(RMx.sys?'（系統）':'');m.setAttribute('aria-pressed',on);m.disabled=RMx.sys}
  rr();m.onclick=function(){RMx.set(!RMx.on);rr();try{sfx.click()}catch(e){}};b.parentNode.insertBefore(m,b.nextSibling)}
 try{if(typeof sfx==='object'&&sfx){var O={stop:sfx.stop,win:sfx.win,spinStart:sfx.spinStart};
  sfx.spinStart=function(){hap(12);return O.spinStart&&O.spinStart.apply(this,arguments)};
  sfx.stop=function(c){hap(8);return O.stop&&O.stop.apply(this,arguments)};
  sfx.win=function(t){t=t|0;hap(t>=4?[40,50,40,50,40,50,90]:t>=3?[35,45,35,45,70]:t>=2?[25,40,30]:18);return O.win&&O.win.apply(this,arguments)};}}catch(e){}
}
/* ---------- lobby ---------- */
function lobby(){var bb=$('bBgm');if(!bb||$('setDlg'))return;
 var orig=bb.onclick;
 css('#setDlg{border:0!important;padding:0!important;width:auto!important;box-shadow:none!important;border-radius:0!important;background:transparent!important;max-width:none!important;max-height:none;overflow:visible;color:#ffeccb;font-family:"Noto Sans TC","PingFang TC","Microsoft JhengHei",sans-serif}'+
 '#setDlg::backdrop{background:rgba(6,2,2,.72)}'+
 '#setDlg .sC{margin:0 auto;width:min(92vw,360px);box-sizing:border-box;padding:18px 16px 14px;border-radius:18px;background:linear-gradient(180deg,#3a0a0a,#1a0404);border:2px solid #e2b34f;box-shadow:0 0 0 1px #6b4410 inset,0 0 0 4px rgba(226,179,79,.16),0 16px 44px rgba(0,0,0,.75),0 0 34px rgba(255,190,70,.22)}'+
 '#setDlg h2{margin:0 0 12px;text-align:center;font-size:18px;letter-spacing:.12em;color:#ffd77a;text-shadow:0 1px 0 #000}'+
 '#setDlg .sR{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 4px;border-top:1px solid rgba(226,179,79,.22);font-size:15px;font-weight:700}'+
 '#setDlg .sR small{display:block;font-weight:400;font-size:11.5px;color:#d9b98a}'+
 '#setDlg .tg{flex:none;position:relative;width:54px;height:30px;border-radius:16px;border:1px solid #c99a3a;background:#2a0d0d;cursor:pointer;padding:0;-webkit-tap-highlight-color:transparent;transition:background .25s cubic-bezier(.4,0,.2,1)}'+
 '#setDlg .tg::after{content:"";position:absolute;top:3px;left:3px;width:22px;height:22px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,#bba 60%,#776);transition:transform .25s cubic-bezier(.4,0,.2,1)}'+
 '#setDlg .tg[aria-pressed="true"]{background:linear-gradient(180deg,#f7d36e,#b8801f)}#setDlg .tg[aria-pressed="true"]::after{transform:translateX(24px);background:radial-gradient(circle at 35% 30%,#fff8de,#ffe08a 55%,#c08a22)}'+
 '#setDlg .tg:disabled{opacity:.4;cursor:default}'+
 '#setDlg .sL{display:block;margin:12px 0 4px;text-align:center;font-size:13px;color:#ffd77a}#setDlg .sL+#sgWipe{margin-top:2px;font-size:12.5px;color:#ffe9b0;text-decoration:underline;text-underline-offset:2px}'+
 '#setDlg .sDel{margin:6px auto 0;padding:4px 10px;background:none;border:0;font:inherit;font-size:12.5px;color:#ff9d7a;text-decoration:underline;text-underline-offset:2px;cursor:pointer}#setDlg .dfpRate{margin:12px auto 2px}'+
 '#setDlg .sN{margin:10px 0 0;text-align:center;font-size:11.5px;color:#d9b98a}'+
 '#setDlg .sV{margin:4px 0 0;padding:12px 8px;display:block;width:100%;box-sizing:border-box;text-align:center;font-size:11px;letter-spacing:.06em;color:rgba(217,185,138,.72);font-variant-numeric:tabular-nums;-webkit-user-select:none;user-select:none;touch-action:manipulation;-webkit-tap-highlight-color:transparent}'+
 '#setDlg .sX{display:block;width:100%;margin-top:12px;font:inherit;font-weight:800;font-size:15px;padding:10px;border-radius:24px;border:0;color:#2a0505;cursor:pointer;background:linear-gradient(180deg,#fff2bf,#f0c45a 50%,#b8801f);box-shadow:0 3px 0 #6b420c}#setDlg .sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}#setDlg .sRedeem{display:none;margin:8px 0 0;padding:8px 0 0;border-top:1px solid rgba(226,179,79,.22)}#setDlg .sRedeem.is-on{display:block}#setDlg .sRedeemRow{display:flex;gap:8px;align-items:stretch}#setDlg #sgCode{flex:1;min-width:0;box-sizing:border-box;width:100%;height:36px;padding:0 10px;border-radius:10px;border:1px solid rgba(226,179,79,.45);background:#2a0d0d;color:#ffeccb;font:inherit;font-size:14px}#setDlg #sgCodeGo{flex:none;padding:0 14px;border:0;border-radius:10px;font:inherit;font-weight:800;font-size:14px;color:#2a0505;cursor:pointer;background:linear-gradient(180deg,#fff2bf,#f0c45a 50%,#b8801f)}#setDlg #sgCodeGo:disabled{opacity:.45;cursor:default}#setDlg #sgCodeMsg{margin:6px 0 0;text-align:center;font-size:12px;color:#ffd77a;min-height:1.2em}');
 var d=document.createElement('dialog');d.id='setDlg';d.setAttribute('aria-labelledby','setT');
 d.innerHTML='<div class="sC"><h2 id="setT">設定</h2>'+
 '<div id="sgVol" class="dfpVol dfpVol--dlg"></div>'+
 '<div class="sR"><span>震動回饋<small>'+(CAN?'旋轉、停輪與中獎時輕微震動':'此裝置不支援震動')+'</small></span><button class="tg" id="sgVib" type="button" aria-label="震動回饋"></button></div>'+
 '<div class="sR"><span>減少動態效果<small id="sgRmN">減少閃光、震動畫面與開關門動畫，適合低階手機・省電</small></span><button class="tg" id="sgRm" type="button" aria-label="減少動態效果"></button></div>'+
 '<a class="sL" href="privacy.html">隱私權政策與使用條款・清除資料</a>'+
 '<a class="sL" href="privacy.html#wipe" id="sgWipe">清除本裝置遊戲資料</a>'+
 (window.DFPcmp?DFPcmp.block('dfpRate--set'):'')+
 (window.DFP_DEL?'<button class="sL sDel" id="sgDel" type="button">刪除帳號與雲端資料</button>':'<a class="sL sDel" href="deletion.html">刪除帳號說明</a>')+
 '<p class="sN sCs" id="sgCs" role="status"></p>'+'<p class="sN">僅供娛樂・虛擬籌碼・純虛擬・無兌現</p>'+
 '<p class="sV" id="sgVer">'+(DFP_APPV?('版本 '+DFP_APPV+'・內容 '+DFP_WEBV):('網頁版 '+DFP_WEBV))+'</p>'+
 '<div class="sRedeem" id="sgRedeem" hidden><label class="sr" for="sgCode">序號</label><div class="sRedeemRow"><input id="sgCode" maxlength="24" autocomplete="off" spellcheck="false" placeholder="序號"><button type="button" id="sgCodeGo">確認</button></div><p id="sgCodeMsg" role="status"></p></div>'+
 '<button class="sX" id="sgClose" type="button">關閉</button></div>';
 document.body.appendChild(d);
 function r(){if(window.DFPvol)DFPvol.sync();$('sgVib').setAttribute('aria-pressed',vibOn());$('sgVib').disabled=!CAN;var R=window.DFPrm;if(R){$('sgRm').setAttribute('aria-pressed',R.on||R.sys);$('sgRm').disabled=R.sys;if(R.sys)$('sgRmN').textContent='已依系統設定開啟'}else $('sgRm').parentNode.style.display='none'}
 if(window.DFPvol)DFPvol.mount($('sgVol'));
 $('sgVib').onclick=function(){s('fs_vib',vibOn()?'0':'1');r();if(vibOn())hap(25)};
 $('sgRm').onclick=function(){var R=window.DFPrm;if(!R||R.sys)return;R.set(!R.on);r()};
 $('sgClose').onclick=function(){d.close()};
 if($('sgDel'))$('sgDel').onclick=function(){if(window.DFPdel){d.close();DFPdel.open()}else location.href='index.html?del=1'};
 d.addEventListener('click',function(e){if(e.target===d)d.close()});

 var rTaps=[],rLast=0,rKind='',H_FC='e32487b0ea529d74544753e3a367d5cf53e122a21a65404cd369e4f29b3dd4cc',H_INV='386c70e2586ebd5484950189adbd774bd11fdc3a9b823b62e5eba551853dd8ee',H_CODE='080b025c8d1773fdefa79c16a7a53b57bf22393e7f8d52862a3849d5b5ffcad1';
 function normIn(c){return String(c||'').trim().replace(/\s+/g,'').toUpperCase()}
 function ownFc(){
  var c='';
  try{if(window.DFPfb&&DFPfb.profile&&DFPfb.profile.friendCode)c=DFPfb.profile.friendCode}catch(e){}
  if(!c){try{c=(JSON.parse(g('dfp_profile')||'{}')||{}).friendCode||''}catch(e){}}
  return normIn(c);
 }
 function ownInv(){
  var c='';
  try{c=(JSON.parse(g('fs_inv')||'{}')||{}).code||''}catch(e){}
  return normIn(c);
 }
 function shaHex(s){
  if(!(crypto&&crypto.subtle&&window.TextEncoder))return Promise.resolve('');
  return crypto.subtle.digest('SHA-256',new TextEncoder().encode('dfp-r139|'+s)).then(function(buf){
   return Array.prototype.map.call(new Uint8Array(buf),function(b){return(b+256).toString(16).slice(-2)}).join('');
  });
 }
 function setMsg(x){var m=$('sgCodeMsg');if(m)m.textContent=x||''}
 function redeem(){
  var inp=$('sgCode'),go=$('sgCodeGo');
  if(!inp||!go||go.disabled)return;
  var code=normIn(inp.value);
  go.disabled=true;setMsg('');
  Promise.all([shaHex(ownFc()),shaHex(ownInv()),shaHex(code)]).then(function(hs){
   if((hs[0]!==H_FC&&hs[1]!==H_INV)||hs[2]!==H_CODE){setMsg('序號無效');go.disabled=false;return}
   if(g('dfp_r139')==='1'){setMsg('已經領過了');go.disabled=false;return}
   s('dfp_r139','1');
   try{
    if(window.CZ&&typeof CZ.addChips==='function')CZ.addChips(1000000);
    else{var cur=+(g('fs_bal')==null?1000:g('fs_bal'))||0;s('fs_bal',String(cur+1000000))}
   }catch(e){}
   try{if(window.CZ&&CZ.toast)CZ.toast('虛擬籌碼','',{title:'虛擬籌碼已入帳',detail:'僅供娛樂，無法兌現',amt:'＋1,000,000'})}catch(e){}
   setMsg('虛擬籌碼已入帳');
   go.disabled=false;
  }).catch(function(){setMsg('序號無效');go.disabled=false});
 }
 function revealCode(){
  var box=$('sgRedeem');
  if(!box)return;
  box.hidden=false;box.classList.add('is-on');
  try{$('sgCode').focus()}catch(e){}
 }
 function onVerTap(kind){
  var n=Date.now();
  if(kind==='click'&&rKind&&n-rLast<500)return;
  if(n-rLast<40)return;
  rLast=n;rKind=kind;
  rTaps.push(n);
  rTaps=rTaps.filter(function(t){return n-t<=4000});
  if(rTaps.length>=7){rTaps=[];revealCode()}
 }
 var ver=$('sgVer');
 ver.addEventListener('touchend',function(){onVerTap('touch')},{passive:true});
 ver.addEventListener('pointerup',function(e){onVerTap((e.pointerType==='mouse')?'mouse':'pointer')});
 ver.addEventListener('click',function(){onVerTap('click')});
  $('sgCodeGo').onclick=redeem;
 $('sgCode').addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();redeem()}});
 bb.textContent='';bb.setAttribute('aria-label','設定');bb.removeAttribute('aria-pressed');bb.setAttribute('aria-haspopup','dialog');bb.style.opacity=1;
 bb.onclick=function(){r();csPaint();if(window.czPinScroll)window.czPinScroll(function(){try{d.showModal()}catch(e){d.setAttribute('open','')}});else{try{d.showModal()}catch(e){d.setAttribute('open','')}}};
}
function csPaint(){var e=document.getElementById('sgCs');if(!e)return;var t='';try{t=window.DFPcs&&DFPcs.statusText?DFPcs.statusText():'雲端同步：登入 Google 後開啟（訪客進度只存在本裝置）'}catch(x){}e.textContent=t}
addEventListener('dfpcs',csPaint);
function pinScroll(fn){var y=window.scrollY||document.documentElement.scrollTop||0,x=window.scrollX||0,ret;try{ret=fn&&fn()}catch(e){window.scrollTo(x,y);throw e}var pin=function(){if((window.scrollY||0)!==y||(window.scrollX||0)!==x)window.scrollTo(x,y)};pin();if(typeof requestAnimationFrame==='function')requestAnimationFrame(function(){pin();requestAnimationFrame(pin)});setTimeout(pin,50);return ret}
window.czPinScroll=pinScroll;
function wrapShowModal(){var DP=window.HTMLDialogElement&&HTMLDialogElement.prototype;if(!DP||!DP.showModal||DP.showModal.__czPin)return;var orig=DP.showModal;DP.showModal=function(){var self=this,args=arguments;return pinScroll(function(){return orig.apply(self,args)})};DP.showModal.__czPin=1}
function boot(){wrapShowModal();if(document.getElementById('ageGate')){var mo=new MutationObserver(function(){if(!document.getElementById('ageGate')){wrapShowModal();mo.disconnect()}});mo.observe(document.documentElement,{childList:true,subtree:true})}theme();lobby()}
if(document.readyState==='complete')boot();else addEventListener('load',boot);
})();
