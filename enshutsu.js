/* v17.7 pachinko-style 演出: 予告 / 期待度 colors / reach variants / voice bubbles (presentation only, no RTP effect) */
(function(){
if(!window.CZM)return;
const RMQ=matchMedia('(prefers-reduced-motion:reduce)').matches,PM=matchMedia('(max-width:620px) and (orientation:portrait)');
const COL=[['青','#3fa0ff','期待度 ★'],['綠','#3fdc7a','期待度 ★★'],['赤','#ff3b4f','期待度 ★★★ 超熱!'],['金','#ffd24a','期待度 ★★★★ 超激熱!!'],['虹','rainbow','確定!!']];
const V=(window.CZM.voice)||{};
const VO={yokoku:V.yokoku||['…吶，好像要來了？','這感覺…難道！','機會來了♡','心跳加速了…'],
 reach:V.reach||['機會來了！拜託，連成線！','就差一個…！','就在這裡決勝負！'],
 hot:V.hot||['超熱喔！！','這是…要來了！','我相信你！'],
 win:V.win||['成功了！','好厲害！','漂亮♡','就是這樣！'],
 lose:V.lose||['下次一定…！','差一點呢','好戲才剛開始！'],
 kakutei:V.kakutei||['確定了！恭喜！！','大獎〜！']};
const pick=a=>a[Math.random()*a.length|0];
let layer,bub,gem,banner,lvl=-1,hideT=0;
function host(){return (PM.matches&&document.getElementById('czHero'))||document.querySelector('#machine .inner')}
function ensure(){const h=host();if(!h)return null;if(layer&&layer.parentNode===h)return layer;
 layer=layer||document.createElement('div');layer.id='czEn';layer.innerHTML='<div class="czbub"><b></b><span></span></div><div class="czgem"><i></i><small></small></div><div class="czban"></div><div class="czcut"></div>';
 h.appendChild(layer);bub=layer.querySelector('.czbub');gem=layer.querySelector('.czgem');banner=layer.querySelector('.czban');return layer}
function color(i){return i<0?'':COL[i][1]}
function say(txt,ci,ms=2200){if(!ensure())return;bub.querySelector('b').textContent=(window.CZM.who||window.CZM.name);bub.querySelector('span').textContent=txt;
 bub.dataset.c=ci>=0?COL[ci][0]:'';bub.classList.remove('on');void bub.offsetWidth;bub.classList.add('on');clearTimeout(bub._t);bub._t=setTimeout(()=>bub.classList.remove('on'),ms)}
function showGem(i){if(!ensure())return;lvl=i;gem.dataset.c=COL[i][0];gem.querySelector('small').textContent=COL[i][2];gem.classList.remove('on');void gem.offsetWidth;gem.classList.add('on')}
function ban(txt,cls,ms=1400){if(!ensure())return;banner.className='czban '+cls;banner.textContent=txt;void banner.offsetWidth;banner.classList.add('on');clearTimeout(banner._t);banner._t=setTimeout(()=>banner.classList.remove('on'),ms)}
function cutin(){if(!ensure()||RMQ)return;const c=layer.querySelector('.czcut');c.style.backgroundImage=`url(assets/${window.CZM.id}/${window.CZM.cutImg||"hero"}.webp?v=198)`;c.classList.remove('on');void c.offsetWidth;c.classList.add('on');CZ.vib&&CZ.vib([20,40,20])}
function gimmick(){if(!ensure())return;{const bd=document.getElementById('board')||document.querySelector('.board');if(bd){let g=document.getElementById('czGeki');if(!g){g=document.createElement('div');g.id='czGeki';g.setAttribute('aria-hidden','true');g.innerHTML='<img src="assets/lobby/geki.webp?v=198" alt="" decoding="async"><i></i>';}if(g.parentNode!==document.body)document.body.appendChild(g);{const r=bd.getBoundingClientRect();g.style.top=r.top+'px';g.style.left=(r.left+r.width/2)+'px'}g.classList.remove('go');void g.offsetWidth;g.classList.add('go');clearTimeout(g._t);g._t=setTimeout(()=>g.classList.remove('go'),1500)}}document.getElementById('machine')?.classList.add('czshake');setTimeout(()=>document.getElementById('machine')?.classList.remove('czshake'),500);CZ.vib&&CZ.vib(60)}
function wpick(w){let r=Math.random()*w.reduce((a,b)=>a+b,0);for(let i=0;i<w.length;i++){if((r-=w[i])<0)return i}return 0}
let cur=null;
const _spin=window.lcdSpin,_reach=window.lcdReach,_res=window.lcdResult;
if(typeof _spin==='function')window.lcdSpin=function(pay,tease,bonus){_spin.apply(this,arguments);
 const big=bonus||pay>=10,mid=pay>=3;let p=big?.85:tease?.55:mid?.2:.06;cur={big,tease,bonus,lv:-1};
 const w=big?[5,15,35,30,15]:tease?[45,35,17,3,0]:mid?[60,35,5,0,0]:[80,20,0,0,0];
 if(Math.random()<p){const i=wpick(w);cur.lv=i;setTimeout(()=>{showGem(i);say(i>=4?pick(VO.kakutei):i>=2?pick(VO.hot):pick(VO.yokoku),i,1800);if(i>=4)ban('確定','rain',1600)},RMQ?0:260)}};
if(typeof _reach==='function')window.lcdReach=function(){_reach.apply(this,arguments);if(!cur)return;
 let lv=cur.lv;const w=cur.big?[5,15,35,30,15]:[45,35,17,3,0];if(lv<0)lv=wpick(w);lv=Math.max(lv,wpick(w));cur.lv=lv;showGem(lv);
 const v=lv>=3?2:lv>=2?(Math.random()<.6?1:2):lv>=1&&Math.random()<.4?1:0;
 if(v===0){ban('大獎機會','n')}else if(v===1){ban('好運降臨','c');cutin()}else{ban(lv>=4?'全回転…確定!!':'機關發動！','g',1800);gimmick()}
 say(lv>=2?pick(VO.hot):pick(VO.reach),lv,2000)};
if(typeof _res==='function')window.lcdResult=function(xr,bonus){_res.apply(this,arguments);
 if(xr>=3||bonus)say(pick(VO.win),cur&&cur.lv>=0?cur.lv:-1,2000);else if(cur&&cur.lv>=1&&!xr)say(pick(VO.lose),-1,1800);else if(!xr&&Math.random()<.08)say(pick(VO.lose),-1,1500);
 setTimeout(()=>gem&&gem.classList.remove('on'),1200);cur=null};
window.CZEN={say,showGem,ban,cutin,gimmick};
})();
