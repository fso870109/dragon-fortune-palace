
function galNote(a,n){try{if(window.CZ&&CZ.toast){CZ.toast('圖鑑解鎖','assets/lx/scroll.webp?v=2848',{detail:'可至大廳圖鑑欣賞',progress:[a,n]});return}}catch(e){}}
/* v17.9 heroine gallery: art unlocks by playing each machine (localStorage cz_gal) */
(function(){
const MS=[['matsuri','夏祭花火'],['samurai','天下布武'],['neko','招財大作戰'],['sakura','櫻花斬']];
const ART=[['p_idle','待機',s=>s.spins>=1,'玩 1 次'],['p_anticip','蓄勢',s=>s.spins>=30,'玩 30 次'],['p_victory','勝利',s=>(s.win||0)>=1,'贏 1 次'],['p_special','絕技',s=>s.spins>=100,'玩 100 次'],['p_bonus','BONUS',s=>s.fs>=1,'觸發免費次數'],['p_bigwin','大獎',s=>(s.big||0)>=1,'贏 10 倍以上']];
const V='?v=256',K='cz_gal';
const load=()=>{try{return JSON.parse(localStorage.getItem(K)||'{}')}catch(e){return{}}};const save=g=>localStorage.setItem(K,JSON.stringify(g));
const st=(g,id)=>g[id]||(g[id]={spins:0,fs:0});
function count(){const g=load();let n=0;MS.forEach(([id])=>ART.forEach(a=>{if(a[2](st(g,id)))n++}));return n}
window.CZGAL={count,total:MS.length*ART.length,open,got(){const g=load(),r=[];MS.forEach(([id])=>ART.forEach(a=>{if(a[2](st(g,id)))r.push('assets/'+id+'/'+a[0]+'.webp')}));return r}};
if(window.CZM&&window.CZ&&CZ.onSettle){const _s=CZ.onSettle.bind(CZ);CZ.onSettle=function(o){const r=_s(o);try{const g=load(),s=st(g,CZM.id),b=count();if(!o.free)s.spins++;if(o.sc>=3)s.fs++;if(o.won>0)s.win=(s.win||0)+1;if((o.xr||0)>=10)s.big=(s.big||0)+1;save(g);const a=count();
  if(a>b&&window.CZEN)CZEN.say('圖鑑新增了一張插圖喔♡',3,2600);if(a>b){galNote(a,MS.length*ART.length)}}catch(e){}return r}}
function open(){const g=load();let d=document.getElementById('czGal');if(d)d.remove();d=document.createElement('dialog');d.id='czGal';
 d.innerHTML=`<h3>🖼 角色圖鑑 <small>${count()}/${MS.length*ART.length}</small></h3><p class="gn">僅供娛樂</p>`+MS.map(([id,nm])=>{const s=st(g,id);return `<div class="gm"><b>${nm}</b><div class="gr">${ART.map(a=>{const ok=a[2](s);return `<button class="gi${ok?'':' lk'}" data-src="assets/${id}/${a[0]}.webp${V}" ${ok?'':'disabled'}>${ok?`<img loading="lazy" src="assets/${id}/${a[0]}.webp${V}" alt="">`:'<i>？</i>'}</button>`}).join('')}</div></div>`}).join('')+`<div class="gv" hidden><img alt=""></div><button class="gx">關閉</button>`;
 document.body.appendChild(d);d.showModal();d.querySelector('.gx').onclick=()=>d.close();d.addEventListener('close',()=>d.remove());
 const gv=d.querySelector('.gv');d.querySelectorAll('.gi:not(.lk)').forEach(b=>b.onclick=()=>{gv.querySelector('img').src=b.dataset.src;gv.hidden=false});gv.onclick=()=>gv.hidden=true}
})();
