/* v28.13 寶珠鎖定重轉 (hold & respin) + 寶珠能量 meter — RTP slice 7% (see math/hs.py, hsim.py); staggered cell reveal */
(function(){
const P=0.0009453061745544524,M=1000,Q=0.075,START=6,CELLS=15,GRAND=400;
const VAL=[[1,30],[2,22],[3,15],[5,10],[8,6],[10,4],[15,2.5]],JP=[['迷你',15,2.0,'mini'],['小獎',40,.6,'minor'],['大獎',120,.15,'major']],COL=1.2;
const TOT=VAL.reduce((a,v)=>a+v[1],0)+JP.reduce((a,j)=>a+j[2],0)+COL;
const RMh=matchMedia('(prefers-reduced-motion: reduce)').matches;
const ID=(window.CZM&&CZM.id)||(location.pathname.split('/').pop()||'').replace('.html','');
const KEY='czHS_'+ID;let meter=+(localStorage.getItem(KEY)||0),pending=false,running=false;
const NFh=new Intl.NumberFormat('zh-TW');
function draw(){let x=Math.random()*TOT;for(const[v,w]of VAL){if(x<w)return{k:'v',v};x-=w}for(const j of JP){if(x<j[2])return{k:'j',v:j[1],n:j[0],c:j[3]};x-=j[2]}return{k:'c',v:0}}
const B=(f,d,t,v,f2)=>window.JUICE&&JUICE.blip(f,d,t,v,f2);
function mUI(){const e=document.getElementById('hsMeter');if(!e)return;const p=Math.min(100,meter/M*100);e.querySelector('i').style.width=p+'%';e.querySelector('em').textContent=Math.floor(p)+'%';e.classList.toggle('hot',p>=80)}
function mount(){const h=document.getElementById('czHero');if(!h||document.getElementById('hsMeter'))return;const d=document.createElement('div');d.id='hsMeter';d.innerHTML='<b>寶珠能量</b><span><i></i></span><em>0%</em>';d.title='每次押注累積能量，滿格必定觸發「寶珠鎖定重轉」';h.appendChild(d);mUI()}
const _st=window.settle;let PRo=null;addEventListener('load',()=>{const b=document.getElementById('board');b&&new MutationObserver(()=>{if(b.getAttribute('aria-busy')==='true')PRo=(typeof FS!=='undefined'&&FS)?null:Math.random()}).observe(b,{attributes:true,attributeFilter:['aria-busy']})});
const QO=0.008962293385220414,KO='czHC_'+ID;try{localStorage.removeItem('czHO_'+ID)}catch(e){}let orbs=[];{const n=Math.min(5,parseInt(localStorage.getItem(KO))||0);for(let i=0;i<n;i++)orbs.push(i)}
const emit=(added,forced)=>{try{dispatchEvent(new CustomEvent('czhs',{detail:{n:orbs.length,added:-1,forced,meter,M}}))}catch(e){}};
if(_st)window.settle=function(bet,free){const r=_st.apply(this,arguments);if(!free&&!running&&!pending){meter++;let added=-1;
 const ro=PRo!=null?PRo:Math.random();PRo=null;if(ro<QO){const freeC=[...Array(CELLS).keys()].filter(i=>!orbs.includes(i));added=freeC[Math.random()*freeC.length|0];orbs.push(added)}
 let forced=false;if(orbs.length<START&&meter>=M){forced=true;while(orbs.length<START){const freeC=[...Array(CELLS).keys()].filter(i=>!orbs.includes(i));orbs.push(freeC[Math.random()*freeC.length|0])}}
 emit(added,forced);
 if(orbs.length>=START){{const all=[...Array(CELLS).keys()];window.__hsStart=[];while(window.__hsStart.length<START)window.__hsStart.push(all.splice(Math.random()*all.length|0,1)[0])}orbs=[];meter=0;pending=true;setTimeout(()=>run(bet),900)}
 localStorage.setItem(KEY,meter);localStorage.setItem(KO,orbs.length);mUI()}return r};
function run(bet){if(running)return;if(typeof spinning!=='undefined'&&spinning||typeof bwState!=='undefined'&&bwState||typeof FS!=='undefined'&&FS||document.getElementById('czMG')&&document.getElementById('czMG').offsetParent){setTimeout(()=>run(bet),500);return}
 running=true;pending=false;window.__hold=true;(window.F21?F21.pre('寶珠鎖定重轉'):Promise.resolve()).then(()=>play(bet)).then(won=>{window.F21&&F21.back();running=false;window.__hold=false;
  if(won>0){bal+=won;const w=document.getElementById('win');w.textContent=won;try{ui();saveLater&&saveLater()}catch(e){}const total=bet*NL;if(won/total>=10&&window.bigWin)setTimeout(()=>bigWin(won,total),300);document.getElementById('msg').textContent=`寶珠鎖定重轉結束，贏得 ${NFh.format(won)} 籌碼！`}
  try{['spinBtn','minus','plus','maxBtn','resetBtn'].forEach(i=>{const e=document.getElementById(i);if(e)e.disabled=false})}catch(e){}})}
function play(bet){return new Promise(res=>{const total=bet*NL;const o=document.createElement('div');o.id='hsBox';o.setAttribute('role','dialog');o.setAttribute('aria-label','寶珠鎖定重轉');
 o.innerHTML=`<div class="hsIn"><h2>寶珠鎖定重轉</h2><div class="hsJp">${JP.map(j=>`<div class="${j[3]}"><b>${j[0]}</b><span>${NFh.format(j[1]*total)}</span></div>`).join('')}<div class="grand"><b>巨獎</b><span>${NFh.format(GRAND*total)}</span></div></div><div class="hsG">${'<i></i>'.repeat(CELLS)}</div><div class="hsF"><span>剩餘重轉 <b id="hsL">3</b></span><span>累計 <b id="hsT">0</b></span></div><p class="hsTip">寶珠會鎖定在原位，出現新寶珠即重置為 3 次・集滿 15 格得「巨獎」</p></div>`;
 document.body.appendChild(o);const cells=[...o.querySelectorAll('.hsG i')];const g=Array(CELLS).fill(null);const T=()=>g.reduce((a,c)=>a+(c?c.v:0),0);
 const put=(i,c,coll)=>{g[i]=c;const e=cells[i];e.className='on land '+(c.c||'');e.innerHTML=c.n?`<b>${c.n}</b>`:`<span>${NFh.format(c.v*total)}</span>`;if(coll){e.classList.add('col');e.innerHTML=`<small>聚寶</small><span>${NFh.format(c.v*total)}</span>`};requestAnimationFrame(()=>setTimeout(()=>e.classList.remove('land'),420))
  B(880+i*25,.12,'triangle',.06);B(1320+i*25,.16,'sine',.04);document.getElementById('hsT').textContent=NFh.format(T()*total)};
 const sleep=ms=>new Promise(r=>setTimeout(r,RMh?ms/3:ms));
 (async()=>{await sleep(500);const first=(window.__hsStart&&window.__hsStart.length===START)?window.__hsStart:[...Array(CELLS).keys()].sort(()=>Math.random()-.5).slice(0,START);window.__hsStart=null;
  for(const i of first){let c=draw();if(c.k==='c')c={k:'v',v:1};put(i,c);await sleep(160)}
  let left=3;await sleep(500);
  while(left>0&&g.includes(null)){document.getElementById('hsL').textContent=left;
   const empties=[];for(let i=0;i<CELLS;i++)if(!g[i])empties.push(i);
   empties.forEach(i=>{cells[i].className='spin';cells[i].innerHTML='<u class="hsReel" aria-hidden="true"></u>'});
   B(300,.25,'sawtooth',.02,500);
   /* Fisher–Yates: 邊轉邊逐格開出（機率仍每格獨立 Q） */
   for(let i=empties.length-1;i>0;i--){const j=Math.random()*(i+1)|0;const t=empties[i];empties[i]=empties[j];empties[j]=t}
   await sleep(left===1?420:260);
   let nw=false;
   for(const i of empties){await sleep(left===1?170:105);cells[i].className='';cells[i].innerHTML='';
    if(Math.random()<Q){let c=draw();if(c.k==='c'){const s=g.reduce((a,x)=>a+(x&&!x.n?x.v:0),0);put(i,{k:'v',v:s},true);cells.forEach((e,k)=>{if(g[k]&&!g[k].n&&k!==i)e.classList.add('suck')});B(520,.5,'sine',.07,1560);await sleep(700);cells.forEach(e=>e.classList.remove('suck'))}else put(i,c);nw=true;await sleep(150)}
    else{cells[i].classList.add('miss');B(180,.06,'triangle',.015);await sleep(90);cells[i].classList.remove('miss')}}
   left=nw?3:left-1;document.getElementById('hsL').textContent=left;await sleep(nw?280:180)}
  let won=T();const full=!g.includes(null);if(full){won+=GRAND;o.classList.add('full');B(523,.4,'sine',.08);B(659,.5,'sine',.07);B(784,.7,'sine',.07)}
  const W=won*total;const f=document.createElement('div');f.className='hsEnd';f.innerHTML=`<small>${full?'集滿 15 格！巨獎':'寶珠總獎金'}</small><b>${NFh.format(W)}</b><button type="button">收下</button>`;o.querySelector('.hsIn').appendChild(f);
  const done=()=>{o.classList.add('out');setTimeout(()=>o.remove(),480);res(W)};f.querySelector('button').onclick=done;setTimeout(()=>{if(o.isConnected)done()},6000)})()})}
window.CZHS={pending:()=>PRo!=null&&!running&&!pending&&((PRo<QO&&orbs.length+1>=START)||(meter+1>=M&&orbs.length<START)),orbs:()=>orbs.slice(),QO,emit:()=>emit(-1,false),meter:()=>meter,force:b=>run(b||((typeof BETS!=='undefined'&&typeof betIdx!=='undefined')?BETS[betIdx]:1)),P,M};
if(document.readyState==='complete')mount();else addEventListener('load',()=>setTimeout(mount,300));
})();
