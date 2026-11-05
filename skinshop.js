/* v28.34 機台外觀商店 2.0 — cosmetic only, virtual chips only, odds untouched */
(()=>{if(typeof SKINS==='undefined')return;
const X={gold:{tier:'常見',t:'c',name:'金殿',tag:'御用金漆',fx:'金箔浮雕框・暖金招牌',copy:'龍運金殿的原廠金漆機台，一切傳奇的起點。'},
neon:{tier:'稀有',t:'r',name:'真夜中',tag:'深藍夜行',fx:'霓藍流光邊框・中獎藍閃',copy:'午夜霓虹在漆框上流動，深夜開台的人專屬的冷冽氣場。'},
jade:{tier:'稀有',t:'r',name:'櫻色',tag:'千本櫻',fx:'櫻瓣飄落・粉金招牌',copy:'整台換上櫻吹雪，每一轉都像在花見席上開獎。'},
crystal:{tier:'傳說',t:'l',name:'月光',tag:'銀月水晶',fx:'銀白水晶框・月暈脈動',copy:'以月光鍛成的水晶機殼，冷光在邊框緩緩呼吸。'},
royal:{tier:'傳說',t:'l',name:'小堇',tag:'紫堇御殿',fx:'紫金雙層框・星屑環繞',copy:'皇族紫堇與金線刺繡，坐上這台就是殿上貴賓。'},
obsidian:{tier:'神話',t:'m',name:'夕陽',tag:'焰金黑曜',fx:'黑曜焰紋框・烈陽火花・專屬金牌',copy:'黑曜石機身燃著夕陽焰紋，金殿最頂級的收藏機台。'}};
SKINS.forEach(k=>Object.assign(k,X[k.id]||{}));
const B=document.body;let tryT=0,tryId=null,prevSkin;
// live FX layer
function fxLayer(){const inn=document.querySelector('.board')||document.querySelector('.inner');if(!inn||document.getElementById('skFx'))return;const d=document.createElement('div');d.id='skFx';d.setAttribute('aria-hidden','true');
d.innerHTML='<i class="c1"></i><i class="c2"></i><i class="c3"></i><i class="c4"></i><b class="plq"></b><span class="pt">'+'<em></em>'.repeat(12)+'</span>';inn.appendChild(d)}
const _ap=skApply;skApply=function(){_ap();fxLayer();const k=SKINS.find(s=>s.id===(B.dataset.skin||'gold'));const p=document.querySelector('#skFx .plq');if(p&&k)p.textContent=k.name+'・'+k.tag;B.dataset.skt=k?k.t:'c'};
function pv(k){return `<div class="pv2 s-${k.id}" aria-hidden="true"><div class="cab"><div class="crest"></div><div class="mq">${k.name}</div><div class="rl"><i></i><i></i><i></i><i></i><i></i></div><div class="base"></div></div><div class="sp"><em></em><em></em><em></em></div></div>`}
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
