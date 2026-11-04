/* v22.0 character pose crossfade over hero art (presentation only, no RTP effect) */
try{document.documentElement.dataset.th=window.CZM&&CZM.id||""}catch(e){}
(function(){if(!window.CZM)return;const id=CZM.id,V='?v=226',RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
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
