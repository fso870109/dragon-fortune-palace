/* 龍運金殿 v28.80: 籌碼不足（看廣告／簽到／好友） / 清除排行榜 — no free chip reset */
(function(){var D,cb;
function css(t){var e=document.createElement('style');e.textContent=t;document.head.appendChild(e)}
function $(id){return document.getElementById(id)}
function dailyOk(){var b=$('dailyBtn');if(b&&b.classList.contains('dot'))return true;var c=$('dClaim');return !!(c&&!c.disabled)}
function go(id){cb=null;if(D)try{D.close()}catch(e){}
 var b=$(id);if(b){try{b.click()}catch(e){return}if(id==='adBtn')return}
 var map={dailyBtn:'daily',invBtn:'inv'};var dlg=$(map[id]||'');if(dlg&&dlg.showModal)try{dlg.showModal()}catch(e){}}
function build(){if(D)return D;
 css('#czChipDlg{border:0!important;padding:0!important;width:auto!important;box-shadow:none!important;border-radius:0!important;outline:0!important;background:transparent!important;max-width:none!important;max-height:none!important;overflow:visible!important;color:#ffeccb;font-family:"Noto Sans TC","PingFang TC","Microsoft JhengHei",sans-serif}'+
 '#czChipDlg::before,#czChipDlg::after{display:none!important}#czChipDlg::backdrop{background:rgba(6,2,2,.74)}'+
 '#czChipDlg .cC{margin:0 auto;width:min(88vw,340px);box-sizing:border-box;padding:20px 16px 14px;border-radius:18px;text-align:center;background:radial-gradient(120% 70% at 50% 0,#5a1410,#260606 60%,#140303);border:2px solid #e2b34f;box-shadow:0 0 0 1px #6b4a12,0 0 0 4px rgba(226,179,79,.18),0 14px 40px rgba(0,0,0,.7),inset 0 1px 0 rgba(255,230,160,.35)}'+
 '#czChipDlg .cI{font-size:44px;line-height:1;filter:drop-shadow(0 3px 6px rgba(0,0,0,.6))}'+
 '#czChipDlg h3{margin:8px 0 6px;font-size:21px;letter-spacing:.12em;background:linear-gradient(180deg,#fff4c8,#f0c45a 55%,#b47a1c);-webkit-background-clip:text;background-clip:text;color:transparent}'+
 '#czChipDlg p{margin:0 0 14px;font-size:14px;line-height:1.6;color:#f3dcb4}'+
 '#czChipDlg .cB{display:flex;flex-direction:column;gap:8px}'+
 '#czChipDlg button{font:inherit;font-weight:700;font-size:16px;border-radius:999px;padding:11px 12px;cursor:pointer;min-height:44px}'+
 '#czChipDlg .cOk{color:#3a1500;border:1px solid #fff0b0;background:linear-gradient(180deg,#fff1b3,#f2c14e 45%,#c98a1c);box-shadow:0 3px 0 #7a4b08,0 6px 14px rgba(0,0,0,.45)}'+
 '#czChipDlg .cAlt{color:#fff4e4;border:1px solid rgba(255,210,122,.7);background:linear-gradient(180deg,#7a2418,#4a0c0c);box-shadow:0 3px 0 #2a0606,0 6px 14px rgba(0,0,0,.35)}'+
 '#czChipDlg .cNo{color:#f0d6a8;background:rgba(0,0,0,.25);border:1px solid rgba(226,179,79,.55)}'+
 '#czChipDlg button[hidden]{display:none!important}'+
 '#czChipDlg small{display:block;margin-top:12px;font-size:11px;color:#c9a978;letter-spacing:.04em}');
 D=document.createElement('dialog');D.id='czChipDlg';D.setAttribute('aria-labelledby','czChipT');
 D.innerHTML='<div class="cC"><h3 id="czChipT"></h3><p id="czChipP"></p><div class="cB">'+
  '<button type="button" class="cOk" id="czChipAd">看廣告領籌碼</button>'+
  '<button type="button" class="cAlt" id="czChipDaily">每日簽到</button>'+
  '<button type="button" class="cAlt" id="czChipInv">邀請好友</button>'+
  '<button type="button" class="cOk" id="czChipOk"></button>'+
  '<button type="button" class="cNo" id="czChipNo"></button></div>'+
  '<small>僅供娛樂・虛擬籌碼・純虛擬・無兌現</small></div>';
 document.body.appendChild(D);
 D.querySelector('#czChipOk').onclick=function(){var f=cb;cb=null;D.close();try{f&&f()}catch(e){}};
 D.querySelector('#czChipNo').onclick=function(){cb=null;D.close()};
 D.querySelector('#czChipAd').onclick=function(){go('adBtn')};
 D.querySelector('#czChipDaily').onclick=function(){go('dailyBtn')};
 D.querySelector('#czChipInv').onclick=function(){go('invBtn')};
 D.addEventListener('click',function(e){if(e.target===D){cb=null;D.close()}});
 return D}
window.czChipDlg=function(mode,onOk){var d=build();if(d.open)return;cb=onOk;
 var lb=mode==='lbclear',short=mode==='short';
 var ad=d.querySelector('#czChipAd'),daily=d.querySelector('#czChipDaily'),inv=d.querySelector('#czChipInv'),ok=d.querySelector('#czChipOk');
 if(lb){
  d.querySelector('#czChipT').textContent='清除排行榜';
  d.querySelector('#czChipP').textContent='確定要清除本機排行榜與統計嗎？暱稱會保留，紀錄會重設。';
  ok.textContent='確定清除';ok.hidden=false;
  ad.hidden=true;daily.hidden=true;inv.hidden=true;
  d.querySelector('#czChipNo').textContent='取消';
 }else{
  /* 'low', 'short', and leftover 'reset' all route to 看廣告／簽到／好友 — never a free chip refill */
  ok.hidden=true;ad.hidden=false;
  daily.hidden=!dailyOk();
  inv.hidden=!!short;
  if(short){
   d.querySelector('#czChipT').textContent='籌碼不足目前押注';
   d.querySelector('#czChipP').textContent=daily.hidden?'目前的虛擬籌碼不夠這次押注，已先幫你調低。也可以看廣告領籌碼。':'目前的虛擬籌碼不夠這次押注，已先幫你調低。也可以看廣告領籌碼，或領取每日簽到。';
  }else{
   d.querySelector('#czChipT').textContent='籌碼不足';
   d.querySelector('#czChipP').textContent=daily.hidden?'目前的虛擬籌碼不夠最低押注。可以看廣告領籌碼，或邀請好友獲得籌碼。':'目前的虛擬籌碼不夠最低押注。可以看廣告領籌碼、領取每日簽到，或邀請好友獲得籌碼。';
  }
  d.querySelector('#czChipNo').textContent='稍後再說';
 }
 try{d.showModal()}catch(e){d.setAttribute('open','')}};
})();
