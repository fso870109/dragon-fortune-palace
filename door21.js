/* v22.8 palace-door transition */
(function(){const H=document.documentElement,RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const TH=(location.pathname.match(/(matsuri|samurai|neko|sakura)\.html/)||[])[1]||'lobby';
let D=null,done=null;['door_l','door_r','plaque'].forEach(n=>{const i=new Image();i.src='assets/lobby/'+n+'.webp?v=235'});
function build(cls){if(D)return D;D=document.createElement('div');D.id='czDoor';D.setAttribute('aria-hidden','true');
 let du='';for(let i=0;i<26;i++)du+=`<i style="left:${Math.random()*100}%;--s:${2+Math.random()*4}px;--t:${1.6+Math.random()*1.6}s;--dl:${-Math.random()*2}s;--x:${(Math.random()-.5)*60}px"></i>`;
 D.innerHTML='<div class="gap"></div><div class="d l"></div><div class="d r"></div><div class="shine"></div><div class="dust">'+du+'</div><div class="plq"><b>龍運金殿</b></div><div class="acc '+TH+'"></div>';
 if(cls)D.className=cls;(document.body||document.documentElement).appendChild(D);return D}
function acc(){const a=D.querySelector('.acc');let h='';const C=['#ffd27a','#ff6fae','#7fd6ff','#fff','#ffb347'];
 const n={matsuri:28,samurai:1,neko:16,sakura:18,lobby:0}[TH];
 for(let i=0;i<n;i++){const s=TH==='matsuri'?`--a:${i*360/n}deg;--d:${90+Math.random()*90}px;--c:${C[i%5]};--dl:${(i%2)*.06}s`:
  TH==='samurai'?'--dl:.05s':`left:${3+Math.random()*94}%;top:${-30-Math.random()*120}px;--x:${(Math.random()-.5)*40}px;--a:${200+Math.random()*300}deg;--dl:${.15+Math.random()*.45}s`;h+=`<i style="${s}"></i>`}a.innerHTML=h}
function prefetch(url){fetch(url,{credentials:'same-origin'}).then(r=>r.text()).then(t=>{const s=new Set();(t.match(/assets\/[a-z0-9_\/-]+\.(webp|png|jpg)/g)||[]).slice(0,40).forEach(u=>{if(s.has(u))return;s.add(u);const i=new Image();i.decoding='async';i.src=u})}).catch(()=>{})}
// close doors, then cb
function close(cb,href){if(RM){cb();return}build();H.classList.add('czDoorOn');D.className='';void D.offsetWidth;D.className='cls anim';snd('door_close');setTimeout(()=>D&&D.classList.add('lit'),560);if(href)prefetch(href);setTimeout(cb,820)}
function snd(n){try{if(TH!=='lobby'&&window.CZA&&typeof sound!=='undefined'&&sound)CZA.play(n,1.1)}catch(e){}}
// opening on arrival
function open0(){build('cls hold')}
function open(){build('cls hold');H.classList.remove('czIn');acc();
 const imgs=[...document.querySelectorAll('#machine img,#czHero img,.card img')].slice(0,40);
 H.classList.add('czDoorOn');const ldw=new Promise(r=>{const c=()=>{const l=document.getElementById('czLoad');if(!l||l.classList.contains('out'))r();else setTimeout(c,60)};setTimeout(c,30)});
 const ready=Promise.race([Promise.all([ldw,...imgs.map(i=>i.decode?i.decode().catch(()=>{}):0)]),new Promise(r=>setTimeout(r,2500))]);
 const t0=performance.now();
 ready.then(()=>{const w=Math.max(0,260-(performance.now()-t0));setTimeout(go,w)});
 let gone=false;function go(){if(gone)return;gone=true;H.classList.add('czRev');D.classList.add('opn');D.classList.remove('cls','hold');snd('door_open');
  done=setTimeout(fin,1400)}
 function fin(){clearTimeout(done);H.classList.remove('czRev','czDoorOn');D&&D.remove();D=null}
 D.classList.add('skip');D.addEventListener('pointerdown',()=>{gone=true;fin()},{once:true});
 setTimeout(()=>D&&D.classList.remove('skip'),900);addEventListener('pointerdown',()=>{if(D&&D.classList.contains('opn'))fin()},{once:true,capture:true})}
window.CZDoor={close,prefetch};
const k=TH==='lobby'?'l21back':'l21zoom';
if(sessionStorage.getItem(k)&&!RM){sessionStorage.removeItem(k);H.classList.add('czIn');open0();
 if(document.readyState==='loading')addEventListener('DOMContentLoaded',open);else open()}
addEventListener('pageshow',e=>{if(e.persisted&&D){D.remove();D=null;H.classList.remove('czIn','czRev')}});
})();
