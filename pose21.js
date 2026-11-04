/* v22.0 character pose crossfade over hero art (presentation only, no RTP effect) */
try{document.documentElement.dataset.th=window.CZM&&CZM.id||""}catch(e){}
(function(){if(!window.CZM)return;const id=CZM.id,V='?v=237',RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
let el=null,t=0,idleT=0,lock=0;
function host(){const h=document.querySelector('#czHero');if(!h)return null;if(!el){el=document.createElement('div');el.className='czpose';el.setAttribute('aria-hidden','1');const hi=h.querySelector('.czhi');hi?hi.after(el):h.prepend(el)}return el}
const pre={};function load(p){if(!pre[p]){const i=new Image();i.src='assets/'+id+'/p_'+p+'.webp'+V;pre[p]=i.decode?i.decode().catch(()=>{}):Promise.resolve()}return pre[p]}
function show(p,ms,pri){pri=pri||1;if(pri<lock)return;const e=host();if(!e)return;lock=pri;load(p).then(()=>{e.style.backgroundImage='url(assets/'+id+'/p_'+p+'.webp'+V+')';e.classList.add('on')});clearTimeout(t);t=setTimeout(hide,ms||2600)}
function hide(){lock=0;el&&el.classList.remove('on');armIdle()}
function armIdle(){clearTimeout(idleT);idleT=setTimeout(()=>{if(document.hidden||document.querySelector('#board[aria-busy=true]'))return armIdle();show(Math.random()<.5?'idle':'special',4000,1)},20000)}
window.CZPOSE={show,hide};
['idle','victory','anticip'].forEach(p=>setTimeout(()=>load(p),3000));
const CZo=window.CZ&&CZ.onSettle;if(CZo)CZ.onSettle=function(o){const r=CZo.apply(this,arguments);try{if((o.xr||0)>=10)show('bigwin',3600,3);else if(o.won>0&&!o.free)show('victory',2400,2)}catch(e){}armIdle();return r};
if(window.F21&&F21.pre){const _p=F21.pre;F21.pre=function(){show('bonus',3200,4);return _p.apply(this,arguments)}}
if(typeof window.lcdReach==='function'){const _r=window.lcdReach;window.lcdReach=function(){show('anticip',2200,2);return _r.apply(this,arguments)}}
const _bw=window.bigWin;if(_bw)window.bigWin=function(){show('bigwin',3600,3);return _bw.apply(this,arguments)};
document.addEventListener('pointerdown',()=>{if(lock===1)hide();else armIdle()},{passive:true});armIdle();
})();
(function(){const f=()=>{const i=document.querySelector('#machine .inner'),b=document.getElementById('board');if(!i||!b||!document.getElementById('czHero'))return;i.style.setProperty('--bt22',b.offsetTop+'px');i.classList.add('sm22')};f();addEventListener('resize',f);addEventListener('load',f);setTimeout(f,800);if(window.ResizeObserver){const b=document.getElementById('board');b&&new ResizeObserver(f).observe(b)}})();
(function(){const mk=(p)=>{const L=27.5,R=72.5,H=`<line x1="${L}" y1="50" x2="${R}" y2="50"/>`,V=`<line x1="50" y1="${L}" x2="50" y2="${R}"/>`,k=p?'p':'m';
 const st=(a,b)=>`<stop offset="0" stop-color="#fff6d2"/><stop offset=".45" stop-color="#f4cd6a"/><stop offset="1" stop-color="#b47a1e"/>`;
 const lay=(g,grad)=>`<g stroke="#3a1a00" stroke-width="16">${g}</g><g stroke="url(#${grad})" stroke-width="12">${g}</g>`;
 return `<svg class="pm" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><defs><linearGradient id="pmH${k}" gradientUnits="userSpaceOnUse" x1="0" y1="44" x2="0" y2="56">${st()}</linearGradient><linearGradient id="pmV${k}" gradientUnits="userSpaceOnUse" x1="0" y1="${L-6}" x2="0" y2="${R+6}">${st()}</linearGradient></defs><g stroke-linecap="round" fill="none">${p?lay(V,'pmV'+k):''}${lay(H,'pmH'+k)}${p?`<g stroke="#f4cd6a" stroke-width="12">${V.replace(/y1="[^"]*"/,'y1="44"').replace(/y2="[^"]*"/,'y2="56"')}</g>`:''}<g stroke="rgba(255,255,255,.6)" stroke-width="2.4"><line x1="${L+3}" y1="47.4" x2="${R-3}" y2="47.4"/>${p?`<line x1="47.4" y1="${L+3}" x2="47.4" y2="${R-3}"/>`:''}</g></g></svg>`};
 const run=()=>{[['minus',0],['plus',1]].forEach(([id,p])=>{const b=document.getElementById(id);if(b&&!b.querySelector('svg.pm'))b.insertAdjacentHTML('beforeend',mk(p))})};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run()})();
