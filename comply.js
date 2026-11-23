/* 龍運金殿 合規標示：自繪限制級標識（非官方圖檔）＋遊戲軟體分級辦法 §13 警語；入口、大廳、設定共用 */
(function(){if(window.DFPcmp)return;
var RT='限制級｜牌類及益智娛樂',W1='請注意使用時間，避免沉迷；遊戲虛擬情節請勿模仿',W2='請勿利用本遊戲從事賭博或任何違法行為';
function mark(px){px=px||56;return '<svg class="dfpRateM" viewBox="0 0 100 100" width="'+px+'" height="'+px+'" role="img" aria-label="限制級，18 歲以上"><polygon points="29.3,1 70.7,1 99,29.3 99,70.7 70.7,99 29.3,99 1,70.7 1,29.3" fill="#d4121c"/><polygon points="31.8,7 68.2,7 93,31.8 93,68.2 68.2,93 31.8,93 7,68.2 7,31.8" fill="none" stroke="#fff" stroke-width="3.5"/><text x="50" y="57" text-anchor="middle" font-family="Noto Sans TC,PingFang TC,Microsoft JhengHei,sans-serif" font-size="40" font-weight="900" fill="#fff">限</text><text x="50" y="83" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="21" font-weight="900" fill="#fff">18+</text></svg>'}
function block(cls){return '<div class="dfpRate'+(cls?' '+cls:'')+'">'+mark(56)+'<div class="dfpRateT"><b>'+RT+'</b><small>'+W1+'</small><small>'+W2+'</small></div></div>'}
var css='.dfpRate{display:flex;align-items:center;gap:10px;box-sizing:border-box;width:100%;max-width:380px;margin:10px auto;padding:8px 10px;border-radius:12px;background:rgba(0,0,0,.38);border:1px solid rgba(226,179,79,.38);text-align:left;color:#f5dcb6;font-family:"Noto Sans TC","PingFang TC","Microsoft JhengHei",sans-serif}'+
'.dfpRate .dfpRateM{flex:0 0 56px;width:56px;height:56px;min-width:56px;display:block}'+
'.dfpRateT{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:2px}'+
'.dfpRateT b{font-size:13px;line-height:1.35;font-weight:800;color:#ffe3a0;letter-spacing:.03em}'+
'.dfpRateT small{display:block;font-size:11.5px;line-height:1.45;font-weight:400;color:#f0d5ad;overflow-wrap:anywhere;word-break:normal}'+
'.foot .dfpRate{margin:0 auto 12px}';
try{var st=document.createElement('style');st.id='dfpCmpCss';st.textContent=css;(document.head||document.documentElement).appendChild(st)}catch(e){}
function foot(){var f=document.querySelector('.foot');if(f&&!f.querySelector('.dfpRate'))f.insertAdjacentHTML('afterbegin',block('dfpRate--foot'))}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',foot);else foot();
window.DFPcmp={RT:RT,W1:W1,W2:W2,mark:mark,block:block};
})();
