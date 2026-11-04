/* v22.2 lightning paylines: canvas overlay on #board, jagged gold/white bolts, sparks at symbol nodes, crackle (presentation only) */
(function(){const B=document.getElementById('board'),SV=document.getElementById('lines');if(!B||!SV)return;
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches,DPR=Math.min(1.5,devicePixelRatio||1);
const cv=document.createElement('canvas');cv.id='bolt22';cv.setAttribute('aria-hidden','1');B.appendChild(cv);const x=cv.getContext('2d');
let W=0,H=0,raf=0,lines=[],t0=0,cyc=0,last=0,jag=[],sparks=[],endT=0;
function size(){const r=B.getBoundingClientRect();W=r.width;H=r.height;cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR);x.setTransform(DPR,0,0,DPR,0,0)}
function pts(pl){const vb=SV.viewBox.baseVal,sr=SV.getBoundingClientRect(),br=B.getBoundingClientRect(),sx=sr.width/vb.width,sy=sr.height/vb.height,o=[];const P=pl.points;for(let i=0;i<P.numberOfItems;i++){const p=P.getItem(i);o.push([sr.left-br.left+p.x*sx,sr.top-br.top+p.y*sy])}return o}
function zig(P,amp){const o=[P[0]];for(let i=1;i<P.length;i++){const[a,b]=[P[i-1],P[i]],dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy),n=Math.max(4,L/14|0),nx=-dy/L,ny=dx/L;for(let k=1;k<n;k++){const f=k/n,j=(Math.random()*2-1)*amp*(1-Math.abs(f-.5)*.8);o.push([a[0]+dx*f+nx*j,a[1]+dy*f+ny*j])}o.push(b)}return o}
let AC=null;function crack(){try{if(typeof sound!=='undefined'&&!sound)return;const c=(typeof AM!=='undefined'&&AM.c)||(AC=AC||new(window.AudioContext||window.webkitAudioContext)());const dst=(typeof AM!=='undefined'&&AM.m)||c.destination;const n=c.sampleRate*.22|0,bf=c.createBuffer(1,n,c.sampleRate),d=bf.getChannelData(0);for(let i=0;i<n;i++){const e=Math.pow(1-i/n,3);d[i]=(Math.random()*2-1)*e*(Math.random()<.25?1:.35)}const s=c.createBufferSource();s.buffer=bf;const f=c.createBiquadFilter();f.type='highpass';f.frequency.value=1800;const g=c.createGain();g.gain.value=.22;s.connect(f).connect(g).connect(dst);s.start()}catch(e){}}
function draw(P,prog,al,wide){if(P.length<2)return;let L=0;const seg=[];for(let i=1;i<P.length;i++){const l=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);seg.push(l);L+=l}let lim=L*prog;
 const path=()=>{x.beginPath();x.moveTo(P[0][0],P[0][1]);let acc=0;for(let i=1;i<P.length;i++){if(acc+seg[i-1]>lim){const f=(lim-acc)/seg[i-1];x.lineTo(P[i-1][0]+(P[i][0]-P[i-1][0])*f,P[i-1][1]+(P[i][1]-P[i-1][1])*f);break}x.lineTo(P[i][0],P[i][1]);acc+=seg[i-1]}};
 x.lineJoin='round';x.lineCap='round';path();x.strokeStyle=`rgba(255,190,60,${.28*al})`;x.lineWidth=wide?16:12;x.stroke();path();x.strokeStyle=`rgba(255,220,110,${.55*al})`;x.lineWidth=wide?8:6;x.stroke();path();x.strokeStyle=`rgba(255,255,240,${.82*al})`;x.lineWidth=wide?3:2.4;x.stroke()}
function frame(t){raf=0;if(!lines.length)return;const now=t;if(now>endT||B.getAttribute('aria-busy')==='true'){stop();return}
 if(now-last<(RM?250:33)){raf=requestAnimationFrame(frame);return}last=now;x.clearRect(0,0,W,H);
 const el=now-t0,all=el<900,per=1100;let idx=all?-1:Math.floor((el-900)/per)%lines.length;const lt=all?el:(el-900)%per;
 if(!all&&idx!==cyc){cyc=idx;crack();lines[idx].nodes.forEach(n=>spark(n,6))}
 x.globalCompositeOperation='lighter';
 lines.forEach((ln,i)=>{const on=all||i===idx;const prog=on?Math.min(1,(all?el-i*90:lt)/180):1;if(prog<=0)return;if(Math.random()<.5||!ln.z)ln.z=zig(ln.p,on?7:4);const al=on?(.75+Math.random()*.25):.18;draw(ln.z,prog,al,on&&!all);if(on&&Math.random()<.35){draw(zig(ln.p,11),prog,.35,false)}});
 sparks=sparks.filter(s=>(s.l-=.06)>0);sparks.forEach(s=>{s.x+=s.vx;s.y+=s.vy;s.vy+=.15;x.fillStyle=`rgba(255,240,180,${s.l})`;x.fillRect(s.x-1.2,s.y-1.2,2.4,2.4)});
 lines.forEach((ln,i)=>{if(!(all||i===idx))return;ln.nodes.forEach(n=>{const r=5+Math.random()*4,g=x.createRadialGradient(n[0],n[1],0,n[0],n[1],r*2.2);g.addColorStop(0,'rgba(255,255,235,.9)');g.addColorStop(.4,'rgba(255,210,90,.45)');g.addColorStop(1,'rgba(255,180,40,0)');x.fillStyle=g;x.beginPath();x.arc(n[0],n[1],r*2.2,0,7);x.fill()})});
 x.globalCompositeOperation='source-over';raf=requestAnimationFrame(frame)}
function spark(n,k){if(RM)return;for(let i=0;i<k;i++)sparks.push({x:n[0],y:n[1],vx:(Math.random()*2-1)*2.4,vy:(Math.random()*2-1)*2.4-1,l:1})}
function stop(){lines=[];sparks=[];if(raf)cancelAnimationFrame(raf);raf=0;x.clearRect(0,0,W,H);B.classList.remove('bolt22')}
function start(){const pls=[...SV.querySelectorAll('polyline.core')].slice(0,8);if(!pls.length)return;size();
 lines=pls.map(pl=>{const p=pts(pl),cnt=document.querySelectorAll('#board .cell.hit').length;return{p,nodes:p,z:null}});
 // nodes only on hit cells
 const hits=[...B.querySelectorAll('.cell.hit')].map(c=>{const r=c.getBoundingClientRect(),br=B.getBoundingClientRect();return[r.left-br.left+r.width/2,r.top-br.top+r.height/2]});
 lines.forEach(l=>l.nodes=l.p.filter(p=>hits.some(h=>Math.hypot(h[0]-p[0],h[1]-p[1])<20)));
 B.classList.add('bolt22');t0=performance.now();last=0;cyc=-1;endT=t0+(lines.length>1?900+lines.length*1100*2:4200);crack();lines.forEach(l=>l.nodes.forEach(n=>spark(n,4)));if(!raf)raf=requestAnimationFrame(frame)}
new MutationObserver(()=>{if(B.getAttribute('aria-busy')==='true'){stop();return}}).observe(B,{attributes:true,attributeFilter:['aria-busy']});
new MutationObserver(()=>{if(SV.querySelector('polyline.core'))setTimeout(start,60);else stop()}).observe(SV,{childList:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});addEventListener('resize',()=>{if(lines.length)start()});
window.BOLT22={start,stop};})();
