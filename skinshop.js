/* v28.39 frame previews; v28.34 機台外觀商店 2.0 — cosmetic only, virtual chips only, odds untouched */
(()=>{if(typeof SKINS==='undefined')return;
const X={gold:{tier:'常見',t:'c',name:'金殿',tag:'御用金漆',fx:'金漆宮簷繪框・雙鳳、蓮花寶石、粉燈',copy:'宮簷金漆收住輪盤與說明，雙鳳與蓮花寶石停在框冠，一切傳奇的起點。'},
neon:{tier:'稀有',t:'r',name:'真夜中',tag:'深藍夜行',fx:'深藍銀雲繪框・新月星鑽、藍燈、銀雲',copy:'新月與星鑽升在框冠，銀雲與藍燈守在兩側，深夜開台的冷冽氣場。'},
jade:{tier:'稀有',t:'r',name:'花火夜祭',tag:'櫻扇鳥居',fx:'紺青金繪框・菊紋、雙扇、紅燈、鳥居',copy:'紺青與金線收住輪盤和中獎說明，櫻、扇、紅燈與鳥居都停在框上。'},
crystal:{tier:'傳說',t:'l',name:'月光',tag:'銀月水晶',fx:'銀白珠光繪框・滿月玉兔、白梅、水晶',copy:'以月光鍛成的珠光機殼，滿月玉兔與白梅停在框冠，冷光繞著輪盤。'},
royal:{tier:'傳說',t:'l',name:'極夜霓虹',tag:'粉藍霓虹',fx:'粉青霓虹繪框・扇面、紫藍燈、鳥居',copy:'極夜的粉與青沿著同一套框位流動，說明文字留在框內。'},
obsidian:{tier:'史詩',t:'m',name:'金龍祭典',tag:'赤漆金龍',fx:'赤漆金繪框・金龍、玉、紅燈、浪',copy:'赤漆金框把輪盤和中獎說明收在同一面祭典裡，龍與玉停在框冠。'}};
SKINS.forEach(k=>Object.assign(k,X[k.id]||{}));
const B=document.body;let tryT=0,tryId=null,prevSkin;
// live FX layer
function fxLayer(){const inn=document.querySelector('.board')||document.querySelector('.inner');if(!inn||document.getElementById('skFx'))return;const d=document.createElement('div');d.id='skFx';d.setAttribute('aria-hidden','true');
d.innerHTML='<i class="c1"></i><i class="c2"></i><i class="c3"></i><i class="c4"></i><b class="plq"></b><span class="pt">'+'<em></em>'.repeat(12)+'</span>';inn.appendChild(d)}
const _ap=skApply;skApply=function(){_ap();fxLayer();const k=SKINS.find(s=>s.id===(B.dataset.skin||'gold'));const p=document.querySelector('#skFx .plq');if(p&&k)p.textContent=k.name+'・'+k.tag;B.dataset.skt=k?k.t:'c'};
const FRM={gold:'gold',neon:'midnight',jade:'hanabi',crystal:'moon',royal:'neon',obsidian:'dragon'},THM=(location.pathname.split('/').pop()||'').replace('.html','');
let PVT=THM;window.__skPv=v=>{PVT=v};window.__skPvGet=()=>PVT;
function pv(k){const f=FRM[k.id];if(f&&/^(neko|sakura|samurai|matsuri)$/.test(PVT))return `<div class="pv2 pvimg s-${k.id}" aria-hidden="true" style="background-image:url(assets/skins/shop/${PVT}-${f}.webp?v=2839)"></div>`;return `<div class="pv2 s-${k.id}" aria-hidden="true"><div class="cab"><div class="crest"></div><div class="mq">${k.name}</div><div class="rl"><i></i><i></i><i></i><i></i><i></i></div><div class="base"></div></div><div class="sp"><em></em><em></em><em></em></div></div>`}
shRender=function(){const st=skGet();$('shBal').textContent=fmt(bal);
$('skins').innerHTML=SKINS.map(k=>{const own=st.own.includes(k.id),eq=st.eq===k.id;let btn,state;
const away=PVT&&PVT!==THM&&/^(neko|sakura|samurai|matsuri)$/.test(PVT);
if(eq){btn=away?`<button class="use go" data-act="go" data-id="${k.id}">使用中・前往機台 ›</button>`:`<button disabled>✓ 使用中</button>`;state='使用中'}
else if(own){btn=away?`<button class="use go" data-act="usego" data-id="${k.id}">套用並前往機台 ›</button>`:`<button class="use" data-act="use" data-id="${k.id}">套用</button>`;state='已擁有'}
else{state=fmt(k.price);btn=shConfirm===k.id?`<button class="cf" data-act="buy" data-id="${k.id}">確認兌換 ${fmt(k.price)}？</button>`:`<div class="b2"><button class="try" data-act="try" data-id="${k.id}">試穿</button><button class="buy" data-act="ask" data-id="${k.id}" ${bal<k.price?'aria-disabled="true"':''} aria-label="以 ${fmt(k.price)} 虛擬籌碼兌換${k.name}"><span class="coin" aria-hidden="true"></span>${fmt(k.price)}</button></div>`}
return `<li class="skin t-${k.t}${eq?' eq':''}${own?' own':''}"><span class="tier">${k.tier}</span>${eq?'<span class="eqtag">使用中</span>':own?'<span class="eqtag ow">已擁有</span>':''}${pv(k)}<b>${k.name}<small class="tg">${k.tag}</small></b><p class="cp">${k.copy}</p><p class="fxl">✦ ${k.fx}</p>${btn}</li>`}).join('')};
function endTry(keep){clearTimeout(tryT);const bar=document.getElementById('skTry');bar&&bar.remove();if(tryId&&!keep){if(prevSkin)B.dataset.skin=prevSkin;else delete B.dataset.skin;skApply()}tryId=null}
$('skins').addEventListener('click',e=>{const b=e.target.closest('button[data-act="try"]');if(!b)return;e.stopImmediatePropagation();const k=SKINS.find(x=>x.id===b.dataset.id);if(!k)return;
endTry();prevSkin=B.dataset.skin;tryId=k.id;B.dataset.skin=k.id;const p=document.querySelector('#skFx .plq');B.dataset.skt=k.t;if(p)p.textContent=k.name+'・'+k.tag;$('shop').close();
const bar=document.createElement('div');bar.id='skTry';bar.setAttribute('role','status');bar.innerHTML=`<span>試穿中「${k.name}」</span><button class="buy">兌換 ${fmt(k.price)}</button><button class="x">結束</button>`;document.body.appendChild(bar);
bar.querySelector('.x').onclick=()=>endTry();bar.querySelector('.buy').onclick=()=>{endTry();shConfirm=k.id;shMsg(`再按一次確認，以 ${fmt(k.price)} 虛擬籌碼兌換「${k.name}」`);shRender();$('shop').showModal()};
tryT=setTimeout(()=>endTry(),15000)},true);
$('shopBtn').addEventListener('click',()=>endTry(),true);
const t=document.getElementById('shTitle');if(t)t.insertAdjacentHTML('beforebegin','<div class="shk">龍運金殿・御用工房</div>');
const s=document.querySelector('#shop .shsub');if(s)s.innerHTML='挑一款外框・可先試穿 15 秒<span class="chip"><span class="coin" aria-hidden="true"></span><b id="shBal">0</b></span><em>外觀只改變樣式，不影響機率・純虛擬・無兌現</em>';
skApply();})();

/* v28.40 大廳「精品收藏館」→ 進入機台後自動打開外觀商店（只開面板，不做任何兌換） */
(()=>{let k=null;try{k=sessionStorage.getItem('dfpOpenShop');if(k)sessionStorage.removeItem('dfpOpenShop')}catch(e){}if(!k)return;try{window.__noDaily=1}catch(e){}
let n=0;const t=()=>{const b=document.getElementById('shopBtn'),s=document.getElementById('shop');if(s&&s.open)return;const busy=document.querySelector('dialog[open]');if(b&&!busy){b.click();return}if(++n<480)setTimeout(t,250)};
setTimeout(t,30)})();

/* v28.43 外框動線：機台內「換框」入口、預覽機台選擇、套用並前往機台、套用後回到同一台機台（只改外觀，不動價格／機率） */
(()=>{if(typeof SKINS==='undefined'||!document.getElementById('shop'))return;
const $$=i=>document.getElementById(i),TH={matsuri:'夏祭花火',samurai:'天下布武',neko:'招財大作戰',sakura:'櫻花斬'},THM=(location.pathname.split('/').pop()||'').replace('.html','');
const say=t=>{try{window.CZ&&CZ.toast?CZ.toast(t):0}catch(e){}const m=$$('msg');if(m)m.textContent=t};
// 1) 機台內入口：控制列左側小圓鈕（與「自動」對稱，不蓋輪盤／文字）
(function mk(n){const ctl=document.querySelector('.czbar .controls');if(!ctl||!$$('czAuto')){if(n<80)setTimeout(()=>mk(n+1),150);return}
if(!$$('czFrm')){const b=document.createElement('button');b.type='button';b.id='czFrm';b.className='czauto czfrm';b.setAttribute('aria-label','更換機台外框');b.innerHTML='<b>換框</b><i aria-hidden="true">🖼</i>';ctl.appendChild(b);
 b.onclick=()=>{try{window.__skPv&&window.__skPv(THM)}catch(e){}const sb=$$('shopBtn');sb&&sb.click()}}})(0);
// 2) 商店：預覽機台選擇 + 通用說明
const sub=document.querySelector('#shop .shsub');
if(sub&&!$$('shThm')){const w=document.createElement('div');w.id='shThm';w.className='shthm';
 w.innerHTML='<p class="shall">✦ 外框全機台通用：套用後 4 台機台都會換上同一款外框</p><div class="shtl" role="group" aria-label="預覽機台"><span>預覽機台</span>'+Object.keys(TH).map(k=>`<button type="button" data-pv="${k}">${TH[k]}${k===THM?'<small>目前</small>':''}</button>`).join('')+'</div>';
 sub.insertAdjacentElement('afterend',w);
 const mark=()=>{const v=window.__skPvGet?window.__skPvGet():THM;w.querySelectorAll('[data-pv]').forEach(x=>{const on=x.dataset.pv===v;x.classList.toggle('on',on);x.setAttribute('aria-pressed',on)})};
 w.addEventListener('click',e=>{const x=e.target.closest('[data-pv]');if(!x)return;window.__skPv&&window.__skPv(x.dataset.pv);try{sfx.click()}catch(_){}shRender();mark()});
 $$('shop').addEventListener('close',()=>{window.__skPv&&window.__skPv(THM)});
 const so=$$('shopBtn');so&&so.addEventListener('click',()=>setTimeout(mark,0));
 new MutationObserver(mark).observe($$('skins'),{childList:true})}
// 3) 套用並前往機台 / 前往機台
$$('skins').addEventListener('click',e=>{const b=e.target.closest('button[data-act="go"],button[data-act="usego"]');if(!b)return;e.stopImmediatePropagation();
 const k=SKINS.find(x=>x.id===b.dataset.id),to=window.__skPvGet?window.__skPvGet():THM;if(!k||!TH[to])return;
 if(b.dataset.act==='usego'){const st=skGet();if(!st.own.includes(k.id))return;st.eq=k.id;skSave(st);skApply()}
 try{sessionStorage.setItem('dfpFrmOk',k.name);sessionStorage.setItem('cz_in','1')}catch(_){}try{sfx.click()}catch(_){}
 b.disabled=true;b.textContent='前往'+TH[to]+'…';setTimeout(()=>{location.href=to+'.html'},180)},true);
// 4) 在本機台套用／兌換成功 → 立即生效，關閉商店回到同一台機台
$$('skins').addEventListener('click',e=>{const b=e.target.closest('button[data-act="use"],button[data-act="buy"]');if(!b)return;const id=b.dataset.id;
 setTimeout(()=>{const st=skGet();if(st.eq!==id)return;const k=SKINS.find(x=>x.id===id);const d=$$('shop');setTimeout(()=>{if(d.open)d.close();say(`已換上「${k?k.name:''}」外框・4 台機台通用`)},900)},0)});
// 5) 從別的機台「套用並前往」抵達
let ok=null;try{ok=sessionStorage.getItem('dfpFrmOk');if(ok)sessionStorage.removeItem('dfpFrmOk')}catch(_){}
if(ok){try{window.__noDaily=1}catch(_){}setTimeout(()=>say(`已換上「${ok}」外框`),900)}
})();
