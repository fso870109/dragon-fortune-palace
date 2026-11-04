/* 龍運金殿 18+ age gate & entertainment notice — shown once on first launch (v238) */
(function(){var K='dfp_age18',ok=false;try{ok=localStorage.getItem(K)==='1'}catch(e){}
if(ok)return;var H=document.documentElement;H.classList.add('agOn');
var css='html.agOn body{visibility:hidden}html.agOn #ageGate{visibility:visible}'+
'#ageGate{position:fixed;inset:0;width:100%;height:100%;max-width:none;max-height:none;margin:0;border:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:max(16px,env(safe-area-inset-top)) 16px max(16px,env(safe-area-inset-bottom));box-sizing:border-box;'+
'background:radial-gradient(120% 80% at 50% 20%,#4a0d0d 0%,#1d0505 55%,#090202 100%);font-family:"Noto Sans TC","PingFang TC","Microsoft JhengHei",sans-serif;color:#ffeccb;opacity:1;transition:opacity .45s cubic-bezier(.4,0,.2,1)}'+
'#ageGate::backdrop{background:#090202}#ageGate:not([open]){display:none}#ageGate.out{opacity:0;pointer-events:none}'+
'#ageGate .agC{position:relative;width:min(100%,400px);max-height:100%;overflow:auto;box-sizing:border-box;padding:22px 20px 18px;border-radius:20px;text-align:center;'+
'background:linear-gradient(180deg,#3a0a0a,#1a0404);border:2px solid #e2b34f;box-shadow:0 0 0 1px #6b4410 inset,0 0 0 5px rgba(226,179,79,.18),0 18px 50px rgba(0,0,0,.7),0 0 40px rgba(255,190,70,.25);'+
'transform:translateY(0) scale(1);transition:transform .45s cubic-bezier(.4,0,.2,1)}'+
'#ageGate.out .agC{transform:translateY(10px) scale(.97)}'+
'#ageGate img{width:min(62vw,230px);height:auto;filter:drop-shadow(0 0 14px rgba(255,190,60,.45))}'+
'#ageGate .ag18{display:inline-flex;align-items:center;justify-content:center;width:62px;height:62px;margin:6px auto 8px;border-radius:50%;font:900 26px/1 sans-serif;color:#2a0505;'+
'background:radial-gradient(circle at 35% 30%,#fff6cf,#f2c75a 45%,#a8701a 100%);box-shadow:0 0 0 3px #7a4c10,0 0 18px rgba(255,200,80,.6)}'+
'#ageGate h2{margin:4px 0 8px;font-size:19px;letter-spacing:.06em;color:#ffd77a;text-shadow:0 1px 0 #000}'+
'#ageGate p{margin:6px 0;font-size:13.5px;line-height:1.6;color:#f5dcb6}'+
'#ageGate .agN{display:inline-block;margin:8px 0 4px;padding:5px 12px;border-radius:14px;border:1px solid #c99a3a;background:rgba(0,0,0,.35);font-size:12.5px;font-weight:700;color:#ffe3a0;letter-spacing:.04em}'+
'#ageGate .agB{display:flex;flex-direction:column;gap:10px;margin-top:14px}'+
'#ageGate button{font:inherit;font-weight:800;font-size:16px;padding:12px 14px;border-radius:26px;cursor:pointer;-webkit-tap-highlight-color:transparent}'+
'#ageGate .agY{color:#2a0505;border:0;background:linear-gradient(180deg,#fff2bf,#f0c45a 50%,#b8801f);box-shadow:0 3px 0 #6b420c,0 0 18px rgba(255,200,80,.45)}'+
'#ageGate .agY:active{transform:translateY(2px);box-shadow:0 1px 0 #6b420c}'+
'#ageGate .agX{color:#e9c98f;background:transparent;border:1px solid #8a6326;font-size:14px;padding:9px 14px}'+
'#ageGate a{color:#ffd77a}#ageGate .agS{font-size:11.5px;color:#c9a97a;margin-top:12px}'+
'#ageGate .agNo{display:none}#ageGate.no .agYes{display:none}#ageGate.no .agNo{display:block}';
var st=document.createElement('style');st.textContent=css;(document.head||H).appendChild(st);
function build(){if(document.getElementById('ageGate'))return;var d=document.createElement('dialog');d.id='ageGate';d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');d.setAttribute('aria-label','年齡確認');
d.innerHTML='<div class="agC"><img src="assets/lobby/logo22.webp?v=248" alt="龍運金殿"><div class="ag18">18+</div>'+
'<div class="agYes"><h2>年齡確認</h2><p>本遊戲內容含模擬賭博，僅適合 <b>18 歲以上</b>玩家。</p>'+
'<span class="agN">僅供娛樂・虛擬籌碼・無真實金錢</span>'+
'<p>遊戲中的籌碼皆為虛擬點數，無法儲值、兌換現金或任何獎品。在本遊戲中的表現，不代表在真實賭博中會獲勝。</p>'+
'<div class="agB"><button class="agY" type="button">我已滿 18 歲，進入遊戲</button><button class="agX" type="button">我未滿 18 歲</button></div>'+
'<p class="agS">進入即表示您同意<a href="privacy.html">隱私權政策與使用條款</a></p></div>'+
'<div class="agNo"><h2>很抱歉</h2><p>本遊戲僅開放 18 歲以上玩家遊玩。</p><span class="agN">僅供娛樂・虛擬籌碼・無真實金錢</span>'+
'<div class="agB"><button class="agX agBack" type="button">返回</button></div></div></div>';
document.body.appendChild(d);var DP=window.HTMLDialogElement&&HTMLDialogElement.prototype,orig=DP&&DP.showModal,Q=[];if(orig){DP.showModal=function(){if(this!==d&&document.getElementById('ageGate')){if(Q.indexOf(this)<0)Q.push(this);return}return orig.apply(this,arguments)};try{orig.call(d)}catch(e){d.setAttribute('open','')}}else d.setAttribute('open','');d.addEventListener('cancel',function(e){e.preventDefault()});
d.querySelector('.agY').onclick=function(){try{localStorage.setItem(K,'1')}catch(e){}H.classList.remove('agOn');d.classList.add('out');setTimeout(function(){try{d.close()}catch(e){}d.remove();if(orig){DP.showModal=orig;Q.forEach(function(x){try{if(x.isConnected&&!x.open)orig.call(x)}catch(e){}})}},500)};
d.querySelector('.agYes .agX').onclick=function(){d.classList.add('no')};
d.querySelector('.agBack').onclick=function(){d.classList.remove('no')};
d.addEventListener('pointerdown',function(e){e.stopPropagation()},true);d.addEventListener('click',function(e){e.stopPropagation()},false);}
if(document.body)build();else document.addEventListener('DOMContentLoaded',build);})();
