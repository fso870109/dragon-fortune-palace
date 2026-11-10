/* v28.51 ambient particles: random cubic Bézier paths */
(function(){
const RM0=matchMedia('(prefers-reduced-motion: reduce)').matches;
function reduced(){return RM0||document.documentElement.classList.contains('dfpRM')}
const TH={
  matsuri:{k:'ember',n:26,pal:[[255,196,90],[255,140,48],[255,230,150],[255,88,42],[255,170,70]]},
  sakura:{k:'petal',n:18,pal:[[255,186,214],[255,150,186],[255,220,230],[255,124,164],[255,200,210]]},
  samurai:{k:'spark',n:22,pal:[[255,226,130],[255,204,74],[255,242,186],[255,186,56],[255,214,110]]},
  neko:{k:'dust',n:26,pal:[[255,222,142],[255,204,96],[255,236,186],[255,186,78],[255,214,120]]},
  lobby:{k:'spark',n:22,pal:[[255,232,164],[255,212,104],[255,244,200],[255,192,80]]}
};
function pick(a){return a[Math.random()*a.length|0]}
function bez(a,b,c,d,t){
  const u=1-t,uu=u*u,tt=t*t;
  return {x:uu*u*a.x+3*uu*t*b.x+3*u*tt*c.x+tt*t*d.x,y:uu*u*a.y+3*uu*t*b.y+3*u*tt*c.y+tt*t*d.y};
}
function path(W,H,k){
  const p0={x:Math.random()*W,y:Math.random()*H};
  let ang=Math.random()*Math.PI*2;
  if(k==='ember') ang=-Math.PI/2+(Math.random()-.5)*1.55;
  if(k==='petal') ang=Math.PI/2+(Math.random()-.5)*1.75;
  const dist=70+Math.random()*180;
  const p3={x:p0.x+Math.cos(ang)*dist,y:p0.y+Math.sin(ang)*dist};
  const nx=-(p3.y-p0.y),ny=p3.x-p0.x,nl=Math.hypot(nx,ny)||1;
  const s1=(Math.random()<.5?-1:1)*(36+Math.random()*96);
  const s2=(Math.random()<.5?-1:1)*(36+Math.random()*96);
  return {p0:p0,p1:{x:p0.x+(p3.x-p0.x)*.33+nx/nl*s1,y:p0.y+(p3.y-p0.y)*.33+ny/nl*s1},
    p2:{x:p0.x+(p3.x-p0.x)*.66+nx/nl*s2,y:p0.y+(p3.y-p0.y)*.66+ny/nl*s2},p3:p3};
}
function glow(rgb){
  const c=document.createElement('canvas');c.width=c.height=48;
  const g=c.getContext('2d'),grd=g.createRadialGradient(24,24,0,24,24,22);
  grd.addColorStop(0,'rgba(255,255,240,.95)');
  grd.addColorStop(.22,'rgba('+rgb[0]+','+rgb[1]+','+rgb[2]+',.9)');
  grd.addColorStop(.55,'rgba('+rgb[0]+','+rgb[1]+','+rgb[2]+',.35)');
  grd.addColorStop(1,'rgba('+rgb[0]+','+rgb[1]+','+rgb[2]+',0)');
  g.fillStyle=grd;g.beginPath();g.arc(24,24,22,0,7);g.fill();
  return c;
}
function star(rgb){
  const c=glow(rgb),g=c.getContext('2d');
  g.globalCompositeOperation='lighter';
  g.strokeStyle='rgba(255,248,220,.8)';g.lineWidth=1.15;
  g.beginPath();g.moveTo(24,9);g.lineTo(24,39);g.moveTo(9,24);g.lineTo(39,24);g.stroke();
  return c;
}
function env(t){return t<.1?t/.1:t>.84?(1-t)/.16:1}

function mount(host,id){
  if(!host||host.querySelector('#dfpAmb'))return null;
  [].forEach.call(host.querySelectorAll('.czhp,.lgp'),function(el){el.remove()});
  const cfg=TH[id]||TH[window.CZM&&CZM.id]||TH.lobby;
  const cv=document.createElement('canvas');
  cv.id='dfpAmb';cv.className='dfpAmb';cv.setAttribute('aria-hidden','true');
  const logo=host.querySelector('.czhl');
  if(logo)host.insertBefore(cv,logo);else host.appendChild(cv);
  const x=cv.getContext('2d');
  let W=0,H=0,D=1,raf=0,P=[],last=0,tries=0;
  const sprites=cfg.pal.map(function(c){return cfg.k==='spark'?star(c):glow(c)});
  function resize(){
    const r=host.getBoundingClientRect();W=r.width;H=r.height;
    D=Math.min(1.5,devicePixelRatio||1);
    cv.width=Math.max(1,Math.round(W*D));cv.height=Math.max(1,Math.round(H*D));
    x.setTransform(D,0,0,D,0,0);
  }
  function mk(init){
    const pal=pick(cfg.pal),si=Math.max(0,cfg.pal.indexOf(pal));
    return Object.assign(path(W,H,cfg.k),{
      t:init?Math.random():0,life:2800+Math.random()*4200,
      r:cfg.k==='petal'?5+Math.random()*5.2:cfg.k==='dust'?1.5+Math.random()*2.3:1.9+Math.random()*2.8,
      o:.42+Math.random()*.4,tw:Math.random()*6.3,tws:.0016+Math.random()*.004,
      rot:Math.random()*6.3,sp:(Math.random()-.5)*.045,rgb:pal,spr:sprites[si]
    });
  }
  function seed(){P.length=0;for(let i=0;i<cfg.n;i++)P.push(mk(true))}
  function draw(p,pt,a){
    const o=p.o*a*env(p.t)*(.55+.45*Math.sin(p.tw));
    if(o<=.02)return;
    if(cfg.k==='petal'){
      x.save();x.translate(pt.x,pt.y);x.rotate(p.rot);x.globalAlpha=o;
      x.fillStyle='rgba('+p.rgb[0]+','+p.rgb[1]+','+p.rgb[2]+',.92)';
      x.beginPath();x.moveTo(0,-p.r);
      x.bezierCurveTo(p.r*1.25,-p.r,p.r*1.15,p.r*.35,0,p.r*1.25);
      x.bezierCurveTo(-p.r*1.15,p.r*.35,-p.r*1.25,-p.r,0,-p.r);x.fill();
      x.fillStyle='rgba(255,255,255,.3)';
      x.beginPath();x.ellipse(-p.r*.2,-p.r*.15,p.r*.45,p.r*.2,0,0,7);x.fill();
      x.restore();return;
    }
    x.globalCompositeOperation='lighter';x.globalAlpha=o;
    const s=p.r*(cfg.k==='dust'?3.4:4.15);
    x.drawImage(p.spr,pt.x-s,pt.y-s,s*2,s*2);
    x.globalCompositeOperation='source-over';x.globalAlpha=1;
  }
  function frame(now){
    if(document.hidden||reduced()){raf=0;return}
    raf=requestAnimationFrame(frame);
    if(now-last<28)return;
    const dt=Math.min(48,now-(last||now));last=now;
    x.clearRect(0,0,W,H);
    for(let i=0;i<P.length;i++){
      const p=P[i];
      p.t+=dt/p.life;p.tw+=p.tws*dt;p.rot+=p.sp*dt*.06;
      if(p.t>=1){P[i]=mk(false);continue}
      if(cfg.k!=='petal'){
        draw(p,bez(p.p0,p.p1,p.p2,p.p3,Math.max(0,p.t-.14)),.22);
        draw(p,bez(p.p0,p.p1,p.p2,p.p3,Math.max(0,p.t-.09)),.38);
        draw(p,bez(p.p0,p.p1,p.p2,p.p3,Math.max(0,p.t-.045)),.62);
      }
      draw(p,bez(p.p0,p.p1,p.p2,p.p3,p.t),1);
    }
    x.globalAlpha=1;x.globalCompositeOperation='source-over';
  }
  function start(){
    resize();if(!W||!H){if(tries++<24)setTimeout(start,120);return}tries=0;if(!P.length)seed();
    if(reduced()){
      if(raf){cancelAnimationFrame(raf);raf=0}
      x.clearRect(0,0,W,H);
      P.forEach(function(p){draw(p,bez(p.p0,p.p1,p.p2,p.p3,p.t),1)});
      return;
    }
    if(!raf){last=0;raf=requestAnimationFrame(frame)}
  }
  addEventListener('resize',function(){resize()},{passive:true});
  document.addEventListener('visibilitychange',function(){if(!document.hidden)start()});
  try{new MutationObserver(start).observe(document.documentElement,{attributes:true,attributeFilter:['class']})}catch(e){}
  start();
  return cv;
}
function boot(){
  const h=document.getElementById('czHero');
  if(h){mount(h,window.CZM&&CZM.id);return}
  const lg=document.querySelector('.lgbg');
  if(lg)mount(lg,'lobby');
}
window.DFPamb={mount:mount,boot:boot};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);
else boot();
addEventListener('load',boot);
})();
