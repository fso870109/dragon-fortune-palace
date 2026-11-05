/* 龍運金殿 v252: 籌碼不足 / 重置籌碼 luxury dialog (replaces native confirm(); offered when chips < minimum bet) */
(function(){var D,cb;
function css(t){var e=document.createElement('style');e.textContent=t;document.head.appendChild(e)}
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
 '#czChipDlg .cNo{color:#f0d6a8;background:rgba(0,0,0,.25);border:1px solid rgba(226,179,79,.55)}'+
 '#czChipDlg small{display:block;margin-top:12px;font-size:11px;color:#c9a978;letter-spacing:.04em}');
 D=document.createElement('dialog');D.id='czChipDlg';D.setAttribute('aria-labelledby','czChipT');
 D.innerHTML='<div class="cC"><div class="cI" aria-hidden="true">🪙</div><h3 id="czChipT"></h3><p id="czChipP"></p><div class="cB"><button type="button" class="cOk" id="czChipOk"></button><button type="button" class="cNo" id="czChipNo"></button></div><small>僅供娛樂・虛擬籌碼・純虛擬・無兌現</small></div>';
 document.body.appendChild(D);
 D.querySelector('#czChipOk').onclick=function(){var f=cb;cb=null;D.close();try{f&&f()}catch(e){}};
 D.querySelector('#czChipNo').onclick=function(){cb=null;D.close()};
 D.addEventListener('click',function(e){if(e.target===D){cb=null;D.close()}});
 return D}
window.czChipDlg=function(mode,onOk){var d=build();if(d.open)return;cb=onOk;
 var low=mode==='low';
 d.querySelector('#czChipT').textContent=low?'籌碼不足':'重置籌碼';
 d.querySelector('#czChipP').textContent=low?'目前的虛擬籌碼不夠最低押注。可以免費重置為 1,000 籌碼繼續遊戲，也可以回大廳領取每日簽到。':'確定要將籌碼重置為 1,000 嗎？目前的籌碼數量會被取代。';
 d.querySelector('#czChipOk').textContent=low?'免費重置為 1,000 籌碼':'確定重置';
 d.querySelector('#czChipNo').textContent=low?'稍後再說':'取消';
 try{d.showModal()}catch(e){d.setAttribute('open','')}};
})();
