/* v18.5 fit display titles inside screen/frame safe area (skew + stroke + glow included) */
(function(){
const SEL='.bw .tier,.bw .lbl,#bwJp,#czWheel .czwt,#czWheel .czwres,#czAtari .atx b,#czAtari .atx i,#czMG .mgt,#czMG h2,#czMG h3,#czEn .czban';
function safeW(el){const fr=el.closest('#czWheel,#czAtari,#bw,#czMG');let w=innerWidth;
 const f=fr&&fr.querySelector('.czframe,.afr');if(f){const r=f.getBoundingClientRect();if(r.width>0)w=Math.min(w,r.width*.78)}
 return Math.min(w,innerWidth)-28}
function fit(el){if(!el.offsetParent&&getComputedStyle(el).position!=='fixed')return;
 el.style.fontSize='';el.style.whiteSpace='';el.style.maxWidth='';
 const max=safeW(el);el.style.maxWidth=max+'px';el.style.marginLeft='auto';el.style.marginRight='auto';
 let fs=parseFloat(getComputedStyle(el).fontSize),n=0;
 const over=()=>{const g=document.createRange();g.selectNodeContents(el);const r=g.getBoundingClientRect();const pad=Math.max(6,fs*.12);const sk=el.offsetHeight*.2;return r.width+pad*2+sk>max+28||r.left-sk/2<8||r.right+sk/2>innerWidth-8};
 if(over()&&/\s/.test(el.textContent.trim()))el.style.whiteSpace='normal';
 while(over()&&fs>14&&n++<30){fs*=.92;el.style.setProperty('font-size',fs+'px','important')}}
function fitAll(){document.querySelectorAll(SEL).forEach(e=>{try{fit(e)}catch(_){}})}
let t=0;const sch=()=>{cancelAnimationFrame(t);t=requestAnimationFrame(()=>requestAnimationFrame(fitAll))};
new MutationObserver(m=>{for(const x of m){const n=x.target.nodeType===1?x.target:x.target.parentNode;if(n&&n.closest&&n.closest('#bw,#czWheel,#czAtari,#czMG,#czEn')){sch();return}}}).observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class','open','style','hidden']});
addEventListener('resize',sch);window.CZFIT=fitAll;
})();
/* v18.5b: fit-to-box for subtitle bar, voice bubbles, stats, buttons (shrink, never clip) */
(function(){
const BOX='#msg,.msg,#czEn .czbub span,.czm b,.czbar .box b,.czbtn:not(#czLobby) span,#max16,#czBuyBtn span,.czlv b';
function clipBox(el){let b=el.getBoundingClientRect(),L=b.left,R=b.right,c=el.parentElement;
 while(c&&c!==document.body){const cs=getComputedStyle(c);if(cs.overflow!=='visible'||cs.clipPath!=='none'){const q=c.getBoundingClientRect();L=Math.max(L,q.left);R=Math.min(R,q.right);break}c=c.parentElement}
 return [Math.max(L,0),Math.min(R,innerWidth)]}
function fitBox(el){if(!el.isConnected||!el.clientWidth)return;el.style.removeProperty('font-size');
 let fs=parseFloat(getComputedStyle(el).fontSize),n=0;const min=Math.max(9,fs*.62);el.classList.remove('czmq');
 const over=()=>{const g=document.createRange();g.selectNodeContents(el);const r=g.getBoundingClientRect();if(!r.width)return false;const [L,R]=clipBox(el);const sk=fs*.2;
  return el.scrollWidth>el.clientWidth+1||r.left<L+2||r.right+sk>R-2};
 while(over()&&fs>min&&n++<30){fs*=.93;el.style.setProperty('font-size',fs+'px','important')}
 if(over()&&el.matches('#msg,.msg')){const t=el.textContent;const sp=document.createElement('span');sp.textContent=t;el.__mq=1;el.textContent='';el.appendChild(sp);el.classList.add('czmq');
  const [L,R]=clipBox(el);const d=sp.getBoundingClientRect().width-(R-L)+fs*.8;el.style.setProperty('--mqd',(-Math.max(0,d))+'px');el.style.setProperty('--mqt',Math.max(3,d/28)+'s');
  const sh=sp.getBoundingClientRect().left-L-fs*.3;if(sh)sp.style.marginLeft=(-sh)+'px'}}
function all(){document.querySelectorAll(BOX).forEach(e=>{if(e.__mq){e.__mq=0;return}try{fitBox(e)}catch(_){}})}
let t=0;const sch=()=>{cancelAnimationFrame(t);t=requestAnimationFrame(all)};
const obs=new MutationObserver(sch);
function hook(){document.querySelectorAll(BOX).forEach(e=>obs.observe(e,{childList:true,characterData:true,subtree:true}));
 const en=document.getElementById('czEn');if(en)obs.observe(en,{childList:true,subtree:true,characterData:true})}
addEventListener('load',()=>{hook();sch();setTimeout(()=>{hook();sch()},1500)});addEventListener('resize',sch);window.CZFITBOX=all;
})();
