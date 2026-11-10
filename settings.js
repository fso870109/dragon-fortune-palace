/* 龍運金殿 settings & haptics (v241, 減少動態效果 v245): lobby 設定 sheet + 震動回饋 toggle in every theme */
/* v259: version line in 設定 (APPV filled in by app/build.sh) */
var DFP_WEBV='28.61',DFP_APPV='';
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
 function r(){var on=vibOn();b.textContent=CAN?('📳 震動：'+(on?'開':'關')):'📳 震動：此裝置不支援';b.setAttribute('aria-pressed',on);b.disabled=!CAN}
 r();b.onclick=function(){s('fs_vib',vibOn()?'0':'1');r();if(vibOn())hap(25);try{sfx.click()}catch(e){}};
 var host=$('dfpVolMenu')||pop;var mb=$('musBtn');if(host)host.appendChild(b);else if(mb&&mb.nextSibling)pop.insertBefore(b,mb.nextSibling);else pop.appendChild(b);
 var RMx=window.DFPrm;if(RMx){var m=document.createElement('button');m.id='rmBtn';m.type='button';
  function rr(){var on=RMx.on||RMx.sys;m.textContent='🎞️ 減少動態：'+(on?'開':'關')+(RMx.sys?'（系統）':'');m.setAttribute('aria-pressed',on);m.disabled=RMx.sys}
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
 '#setDlg .sN{margin:10px 0 0;text-align:center;font-size:11.5px;color:#d9b98a}'+
 '#setDlg .sV{margin:8px 0 0;text-align:center;font-size:11px;letter-spacing:.06em;color:rgba(217,185,138,.72);font-variant-numeric:tabular-nums}'+
 '#setDlg .sX{display:block;width:100%;margin-top:12px;font:inherit;font-weight:800;font-size:15px;padding:10px;border-radius:24px;border:0;color:#2a0505;cursor:pointer;background:linear-gradient(180deg,#fff2bf,#f0c45a 50%,#b8801f);box-shadow:0 3px 0 #6b420c}');
 var d=document.createElement('dialog');d.id='setDlg';d.setAttribute('aria-labelledby','setT');
 d.innerHTML='<div class="sC"><h2 id="setT">設定</h2>'+
 '<div id="sgVol" class="dfpVol dfpVol--dlg"></div>'+
 '<div class="sR"><span>震動回饋<small>'+(CAN?'旋轉、停輪與中獎時輕微震動':'此裝置不支援震動')+'</small></span><button class="tg" id="sgVib" type="button" aria-label="震動回饋"></button></div>'+
 '<div class="sR"><span>減少動態效果<small id="sgRmN">減少閃光、震動畫面與開關門動畫，適合低階手機・省電</small></span><button class="tg" id="sgRm" type="button" aria-label="減少動態效果"></button></div>'+
 '<a class="sL" href="privacy.html">隱私權政策與使用條款・清除資料</a>'+
 '<a class="sL" href="privacy.html#wipe" id="sgWipe">清除本裝置遊戲資料</a>'+
 '<p class="sN">僅供娛樂・虛擬籌碼・純虛擬・無兌現</p>'+
 '<p class="sV" id="sgVer">'+(DFP_APPV?('版本 '+DFP_APPV+'・內容 '+DFP_WEBV):('網頁版 '+DFP_WEBV))+'</p>'+
 '<button class="sX" id="sgClose" type="button">關閉</button></div>';
 document.body.appendChild(d);
 function r(){if(window.DFPvol)DFPvol.sync();$('sgVib').setAttribute('aria-pressed',vibOn());$('sgVib').disabled=!CAN;var R=window.DFPrm;if(R){$('sgRm').setAttribute('aria-pressed',R.on||R.sys);$('sgRm').disabled=R.sys;if(R.sys)$('sgRmN').textContent='已依系統設定開啟'}else $('sgRm').parentNode.style.display='none'}
 if(window.DFPvol)DFPvol.mount($('sgVol'));
 $('sgVib').onclick=function(){s('fs_vib',vibOn()?'0':'1');r();if(vibOn())hap(25)};
 $('sgRm').onclick=function(){var R=window.DFPrm;if(!R||R.sys)return;R.set(!R.on);r()};
 $('sgClose').onclick=function(){d.close()};
 d.addEventListener('click',function(e){if(e.target===d)d.close()});
 bb.textContent='⚙️';bb.setAttribute('aria-label','設定');bb.removeAttribute('aria-pressed');bb.setAttribute('aria-haspopup','dialog');bb.style.opacity=1;
 bb.onclick=function(){r();if(window.czPinScroll)window.czPinScroll(function(){try{d.showModal()}catch(e){d.setAttribute('open','')}});else{try{d.showModal()}catch(e){d.setAttribute('open','')}}};
}
function pinScroll(fn){var y=window.scrollY||document.documentElement.scrollTop||0,x=window.scrollX||0,ret;try{ret=fn&&fn()}catch(e){window.scrollTo(x,y);throw e}var pin=function(){if((window.scrollY||0)!==y||(window.scrollX||0)!==x)window.scrollTo(x,y)};pin();if(typeof requestAnimationFrame==='function')requestAnimationFrame(function(){pin();requestAnimationFrame(pin)});setTimeout(pin,50);return ret}
window.czPinScroll=pinScroll;
function wrapShowModal(){var DP=window.HTMLDialogElement&&HTMLDialogElement.prototype;if(!DP||!DP.showModal||DP.showModal.__czPin)return;var orig=DP.showModal;DP.showModal=function(){var self=this,args=arguments;return pinScroll(function(){return orig.apply(self,args)})};DP.showModal.__czPin=1}
function boot(){wrapShowModal();if(document.getElementById('ageGate')){var mo=new MutationObserver(function(){if(!document.getElementById('ageGate')){wrapShowModal();mo.disconnect()}});mo.observe(document.documentElement,{childList:true,subtree:true})}theme();lobby()}
if(document.readyState==='complete')boot();else addEventListener('load',boot);
})();
