/* v18.5 fit display titles inside screen/frame safe area (skew + stroke + glow included) */
(function(){
const SEL='.bw .tier,.bw .lbl,#bwJp,#czWheel .czwt,#czWheel .czwres,#czAtari .atx b,#czAtari .atx i,#czMG .mgt,#czMG h2,#czMG h3,#czEn .czban';
function safeW(el){const fr=el.closest('#czWheel,#czAtari,#bw,#czMG');let w=innerWidth;
 const f=fr&&fr.querySelector('.czframe,.afr');if(f){const r=f.getBoundingClientRect();if(r.width>0)w=Math.min(w,r.width*.78)}
 return Math.min(w,innerWidth)-28}
function fit(el){if(!el.offsetParent&&getComputedStyle(el).position!=='fixed')return;
 if(!el.textContent.trim()||getComputedStyle(el).visibility==='hidden')return; /* v23.9: skip empty/hidden titles (was a fit<->observer loop) */
 const tf0=el.style.getPropertyValue('transform'),tp0=el.style.getPropertyPriority('transform');el.style.setProperty('transform','none','important'); /* v23.9: measure untransformed (entrance zoom no longer shrinks text) */
 try{fit0(el)}finally{if(tf0)el.style.setProperty('transform',tf0,tp0);else el.style.removeProperty('transform')}}
function fit0(el){
 el.style.fontSize='';el.style.whiteSpace='';el.style.maxWidth='';
 const max=safeW(el);el.style.maxWidth=max+'px';el.style.marginLeft='auto';el.style.marginRight='auto';
 let fs=parseFloat(getComputedStyle(el).fontSize),n=0;
 const over=()=>{const g=document.createRange();g.selectNodeContents(el);const r=g.getBoundingClientRect();const pad=Math.max(6,fs*.12);const sk=el.offsetHeight*.2;return r.width+pad*2+sk>max+28||r.left-sk/2<8||r.right+sk/2>innerWidth-8};
 if(over()&&/\s/.test(el.textContent.trim()))el.style.whiteSpace='normal';
 while(over()&&fs>14&&n++<30){fs*=.92;el.style.setProperty('font-size',fs+'px','important')}}
let MO=null;function fitAll(){document.querySelectorAll(SEL).forEach(e=>{try{fit(e)}catch(_){}});if(MO)MO.takeRecords() /* v23.9: drop self-caused style mutations */}
let t=0;const sch=()=>{cancelAnimationFrame(t);t=requestAnimationFrame(()=>requestAnimationFrame(fitAll))};
/* v28.87: count-up digits (#bwAmt) and inline style writes on non-title children no longer refit every title each frame */
const ROOTS='#bw,#czWheel,#czAtari,#czMG,#czEn',SKIP='#bwAmt,#bwAmt *';
MO=new MutationObserver(m=>{for(const x of m){const n=x.target.nodeType===1?x.target:x.target.parentNode;if(!n||!n.closest||!n.closest(ROOTS))continue;if(n.matches(SKIP))continue;
 if(x.type==='attributes'&&(x.attributeName==='style'||x.attributeName==='class')&&!n.matches(ROOTS)&&!n.matches(SEL))continue; /* v28.88: effect-class toggles inside an overlay no longer refit every title */sch();return}});MO.observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class','open','style','hidden']});
addEventListener('resize',sch);window.CZFIT=fitAll;
})();
/* v18.5b: fit-to-box for subtitle bar, voice bubbles, stats, buttons (shrink, never clip) */
(function(){
const BOX='#msg,.msg,.czm b,.czbar .box b,.czbtn:not(#czLobby) span,#max16,#czBuyBtn span,.czlv b';
function clipBox(el){let b=el.getBoundingClientRect(),L=b.left,R=b.right,c=el.parentElement;
 while(c&&c!==document.body){const cs=getComputedStyle(c);if(cs.overflow!=='visible'||cs.clipPath!=='none'){const q=c.getBoundingClientRect();L=Math.max(L,q.left);R=Math.min(R,q.right);break}c=c.parentElement}
 return [Math.max(L,0),Math.min(R,innerWidth)]}
function fitBox(el){if(document.body.classList.contains('cab-on')&&el.matches('#msg,.msg'))return;if(!el.isConnected||!el.clientWidth)return;el.style.removeProperty('font-size');
 let fs=parseFloat(getComputedStyle(el).fontSize),n=0;const min=Math.max(9,fs*.62);el.classList.remove('czmq');
 const over=()=>{const g=document.createRange();g.selectNodeContents(el);const r=g.getBoundingClientRect();if(!r.width)return false;const [L,R]=clipBox(el);const sk=fs*.2;
  return r.width>el.clientWidth+1||r.left<L+2||r.right+sk>R-2};
 while(over()&&fs>min&&n++<30){fs*=.93;el.style.setProperty('font-size',fs+'px','important')}
 if(over()&&el.matches('#msg,.msg')){const t=el.textContent;const sp=document.createElement('span');sp.textContent=t;el.__mq=1;el.textContent='';el.appendChild(sp);el.classList.add('czmq');
  const [L,R]=clipBox(el);const d=sp.getBoundingClientRect().width-(R-L)+fs*.8;el.style.setProperty('--mqd',(-Math.max(0,d))+'px');el.style.setProperty('--mqt',Math.max(3,d/28)+'s');
  const sh=sp.getBoundingClientRect().left-L-fs*.3;if(sh)sp.style.marginLeft=(-sh)+'px'}}
// v18.8: centre the subtitle glyph ink (not the font line box) vertically: device fonts differ in ascent/descent
const CV=document.createElement('canvas').getContext('2d');
function vcenter(el){if(document.body.classList.contains('cab-on'))return;if(!el.matches('#msg,.msg'))return;el.style.removeProperty('padding-top');el.style.removeProperty('padding-bottom');
 const cs=getComputedStyle(el);const t=(el.textContent||'').trim()||'財';CV.font=cs.font;const m=CV.measureText(t);
 const fs=parseFloat(cs.fontSize);let lh=parseFloat(cs.lineHeight);if(!lh)lh=(m.fontBoundingBoxAscent+m.fontBoundingBoxDescent);
 const fa=m.fontBoundingBoxAscent,fd=m.fontBoundingBoxDescent,base=(lh-(fa+fd))/2+fa,ink=base-(m.actualBoundingBoxAscent-m.actualBoundingBoxDescent)/2,off=ink-lh/2;
 el.style.setProperty('box-sizing','border-box','important');const p=Math.min(Math.abs(off)*2,fs*.6).toFixed(2)+'px';
 if(off>.25)el.style.setProperty('padding-bottom',p,'important');else if(off<-.25)el.style.setProperty('padding-top',p,'important');el.dataset.vo=off.toFixed(2)}
function all(){document.querySelectorAll('#msg,.msg').forEach(e=>{try{vcenter(e)}catch(_){}});document.querySelectorAll(BOX).forEach(e=>{if(e.__mq){e.__mq=0;return}try{fitBox(e)}catch(_){}})}
/* v28.87: refit only the boxes whose text changed; skip same-length updates that already fit with room (WIN/CREDIT count-ups) */
function fitOne(e){if(e.__mq){e.__mq=0;return}const L=(e.textContent||'').length;if(e.__fl===L&&e.__ok&&!e.matches('#msg,.msg'))return;try{fitBox(e)}catch(_){}
 e.__fl=L;try{const g=document.createRange();g.selectNodeContents(e);const w=g.getBoundingClientRect().width;e.__ok=!e.style.fontSize&&e.clientWidth>0&&w<e.clientWidth*.86}catch(_){e.__ok=false}}
let t=0,full=true;const P=new Set();
function run(){if(full){full=false;P.clear();all();document.querySelectorAll(BOX).forEach(e=>{e.__fl=-1});return}const L=[...P];P.clear();
 L.forEach(e=>{if(!e.isConnected)return;if(e.matches('#msg,.msg'))try{vcenter(e)}catch(_){}fitOne(e)})}
const sch=()=>{full=true;cancelAnimationFrame(t);t=requestAnimationFrame(run)};
const obs=new MutationObserver(ms=>{for(const m of ms){const n=m.target.nodeType===1?m.target:m.target.parentNode;const b=n&&n.closest&&n.closest(BOX);if(b)P.add(b);else full=true}cancelAnimationFrame(t);t=requestAnimationFrame(run)});
function hook(){document.querySelectorAll(BOX).forEach(e=>obs.observe(e,{childList:true,characterData:true,subtree:true}));
 const en=document.getElementById('czEn');if(en)obs.observe(en,{childList:true,subtree:true,characterData:true})}
addEventListener('load',()=>{hook();sch();setTimeout(()=>{hook();sch()},1500)});addEventListener('resize',sch);window.CZFITBOX=all;
})();
