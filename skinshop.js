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
function pv(k){const f=FRM[k.id];if(f&&/^(neko|sakura|samurai|matsuri)$/.test(THM))return `<div class="pv2 pvimg s-${k.id}" aria-hidden="true" style="background-image:url(assets/skins/shop/${THM}-${f}.webp?v=2839)"></div>`;return `<div class="pv2 s-${k.id}" aria-hidden="true"><div class="cab"><div class="crest"></div><div class="mq">${k.name}</div><div class="rl"><i></i><i></i><i></i><i></i><i></i></div><div class="base"></div></div><div class="sp"><em></em><em></em><em></em></div></div>`}
shRender=function(){const st=skGet();$('shBal').textContent=fmt(bal);
$('skins').innerHTML=SKINS.map(k=>{const own=st.own.includes(k.id),eq=st.eq===k.id;let btn,state;
if(eq){btn=`<button disabled>✓ 使用中</button>`;state='使用中'}
else if(own){btn=`<button class="use" data-act="use" data-id="${k.id}">套用</button>`;state='已擁有'}
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
const s=document.querySelector('#shop .shsub');if(s)s.innerHTML='挑一台屬於你的機台・可先試穿 15 秒<span class="chip"><span class="coin" aria-hidden="true"></span><b id="shBal">0</b></span><em>外觀只改變樣式，不影響機率・純虛擬・無兌現</em>';
skApply();})();
