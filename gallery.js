/* v17.9 heroine gallery: art unlocks by playing each machine (localStorage cz_gal) */
(function(){
const MS=[['love','戀夜拉霸♡'],['matsuri','夏祭戀花火'],['caishen','財神降臨'],['samurai','天下布武'],['pirate','海賊寶藏'],['neko','招財大作戰'],['sakura','櫻花斬'],['queen','女王逆襲']];
const ART=[['card','機台畫',s=>s.spins>=1,'玩 1 次'],['cutin','插畫演出',s=>s.spins>=50,'玩 50 次'],['hero','主視覺',s=>s.spins>=150,'玩 150 次'],['bigbonus','大獎',s=>s.fs>=1,'觸發 1 次 BONUS']];
const V='?v=188',K='cz_gal';
const load=()=>{try{return JSON.parse(localStorage.getItem(K)||'{}')}catch(e){return{}}};const save=g=>localStorage.setItem(K,JSON.stringify(g));
const st=(g,id)=>g[id]||(g[id]={spins:0,fs:0});
function count(){const g=load();let n=0;MS.forEach(([id])=>ART.forEach(a=>{if(a[2](st(g,id)))n++}));return n}
window.CZGAL={count,total:MS.length*ART.length,open};
if(window.CZM&&window.CZ&&CZ.onSettle){const _s=CZ.onSettle.bind(CZ);CZ.onSettle=function(o){const r=_s(o);try{const g=load(),s=st(g,CZM.id),b=count();if(!o.free)s.spins++;if(o.sc>=3)s.fs++;save(g);const a=count();
  if(a>b&&window.CZEN)CZEN.say('圖鑑新增了一張插圖喔♡',3,2600);if(a>b){const t=document.getElementById('czToast');if(t){t.textContent='🖼 圖鑑解鎖新圖！（'+a+'/'+(MS.length*ART.length)+'）';t.classList.add('on');setTimeout(()=>t.classList.remove('on'),2600)}}}catch(e){}return r}}
function open(){const g=load();let d=document.getElementById('czGal');if(d)d.remove();d=document.createElement('dialog');d.id='czGal';
 d.innerHTML=`<h3>🖼 女主角圖鑑 <small>${count()}/${MS.length*ART.length}</small></h3><p class="gn">在各機台遊玩即可解鎖插圖・僅供娛樂</p>`+MS.map(([id,nm])=>{const s=st(g,id);return `<div class="gm"><b>${nm}</b><span>已玩 ${s.spins} 次</span><div class="gr">${ART.map(a=>{const ok=a[2](s);return `<button class="gi${ok?'':' lk'}" data-src="assets/${id}/${a[0]}.webp${V}" ${ok?'':'disabled'}><img loading="lazy" src="assets/${id}/${a[0]==='hero'?'hero':a[0]}.webp${V}" alt=""><i>${ok?a[1]:'🔒 '+a[3]}</i></button>`}).join('')}</div></div>`}).join('')+`<div class="gv" hidden><img alt=""></div><button class="gx">關閉</button>`;
 document.body.appendChild(d);d.showModal();d.querySelector('.gx').onclick=()=>d.close();d.addEventListener('close',()=>d.remove());
 const gv=d.querySelector('.gv');d.querySelectorAll('.gi:not(.lk)').forEach(b=>b.onclick=()=>{gv.querySelector('img').src=b.dataset.src;gv.hidden=false});gv.onclick=()=>gv.hidden=true}
})();
