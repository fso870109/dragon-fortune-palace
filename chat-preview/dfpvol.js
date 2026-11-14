/* v28.54 shared 音效／音樂 volume buses (dfp_vol). Migrates fs_sound/fs_music/fs_sv/fs_mv/cz_bgm. */
(function(){
if(window.DFPvol)return;
var LS=window.localStorage;
function g(k){try{return LS.getItem(k)}catch(e){return null}}
function s(k,v){try{LS.setItem(k,v)}catch(e){}}
function clamp(n,a,b){n=+n;if(!isFinite(n))return a;return Math.max(a,Math.min(b,n))}
function pct(n){return Math.round(clamp(n,0,100))}
var cbs=[],lastBlip=0,st=read();

function read(){
  var raw=g('dfp_vol');
  if(raw){
    try{
      var o=JSON.parse(raw);
      if(o&&typeof o==='object'&&!Array.isArray(o)){
        var s0=pct(o.s!=null?o.s:80),m0=pct(o.m!=null?o.m:50);
        return {s:s0,m:m0,sl:pct(o.sl!=null?o.sl:(s0||80))||80,ml:pct(o.ml!=null?o.ml:(m0||50))||50};
      }
    }catch(e){}
  }
  var soundOn=g('fs_sound')!=='0';
  var musicOn=g('fs_music')!=='0'&&g('cz_bgm')!=='0';
  var sv=g('fs_sv'),mv=g('fs_mv');
  sv=(sv==null||sv==='')?0.8:+sv;if(!isFinite(sv))sv=0.8;
  mv=(mv==null||mv==='')?0.5:+mv;if(!isFinite(mv))mv=0.5;
  sv=clamp(sv,0,1);mv=clamp(mv,0,1);
  var sp=Math.round(sv*100),mp=Math.round(mv*100);
  return {s:soundOn?(sp||80):0,m:musicOn?(mp||50):0,sl:sp||80,ml:mp||50};
}
function persist(){
  s('dfp_vol',JSON.stringify(st));
  s('fs_sound',st.s>0?'1':'0');
  s('fs_music',st.m>0?'1':'0');
  s('cz_bgm',st.m>0?'1':'0');
  s('fs_sv',String((st.s>0?st.s:st.sl)/100));
  s('fs_mv',String((st.m>0?st.m:st.ml)/100));
  try{
    if(typeof sound!=='undefined')sound=st.s>0;
    if(typeof AS!=='undefined'&&AS){AS.music=st.m>0;AS.sv=st.s/100;AS.mv=st.m/100}
  }catch(e){}
}
function applyGains(){
  var sg=st.s/100,mg=st.m/100;
  try{
    if(typeof aInit==='function')aInit();
    if(typeof AM!=='undefined'&&AM&&typeof ac!=='undefined'&&ac){
      var t=ac.currentTime;
      if(AM.m)AM.m.gain.setTargetAtTime(1,t,.02);
      if(AM.mus)AM.mus.gain.setTargetAtTime(mg*.55,t,.05);
      if(AM.sfxG)AM.sfxG.gain.setTargetAtTime(sg,t,.02);
    }
    if(typeof musSync==='function')musSync();
  }catch(e){}
}
function emit(){
  persist();applyGains();
  var snap=api.get();
  cbs.forEach(function(fn){try{fn(snap)}catch(e){}});
  try{document.dispatchEvent(new CustomEvent('dfp-vol',{detail:snap}))}catch(e){}
  syncUI();
}
function setS(p){p=pct(p);st.s=p;if(p>0)st.sl=p;emit()}
function setM(p){p=pct(p);st.m=p;if(p>0)st.ml=p;emit()}
function toggleS(){if(st.s>0){st.sl=st.s;st.s=0}else st.s=st.sl||80;emit()}
function toggleM(){if(st.m>0){st.ml=st.m;st.m=0}else st.m=st.ml||50;emit()}
function preview(){
  if(st.s<=0)return;
  var now=performance.now();if(now-lastBlip<90)return;lastBlip=now;
  try{if(typeof sfx==='object'&&sfx&&sfx.click){sfx.click();return}if(typeof sfx==='function'){sfx(0);return}}catch(e){}
  try{
    var C=window.AudioContext||window.webkitAudioContext;if(!C)return;
    if(!preview.ac)preview.ac=new C();
    var a=preview.ac;if(a.state==='suspended')a.resume();
    var t=a.currentTime,o=a.createOscillator(),gn=a.createGain();
    o.type='square';o.frequency.value=1200;
    gn.gain.setValueAtTime(0,t);
    gn.gain.linearRampToValueAtTime(.05*(st.s/100),t+.005);
    gn.gain.exponentialRampToValueAtTime(.0008,t+.08);
    o.connect(gn).connect(a.destination);o.start(t);o.stop(t+.1);
  }catch(e){}
}
function rowHTML(kind,label){
  var p=kind==='s'?st.s:st.m,on=p>0;
  return '<div class="dfpVR" data-k="'+kind+'">'+
    '<div class="dfpVH"><span class="dfpVL">'+label+'</span><span class="dfpVP" aria-live="polite">'+p+'%</span></div>'+
    '<input type="range" min="0" max="100" step="1" value="'+p+'" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+p+'" aria-label="'+label+'音量">'+
    '<button type="button" class="dfpVM" aria-pressed="'+(on?'false':'true')+'">'+(on?'靜音':'開啟')+'</button></div>';
}
function bind(el){
  el.querySelectorAll('.dfpVR').forEach(function(row){
    var k=row.getAttribute('data-k');
    var sl=row.querySelector('input'),btn=row.querySelector('.dfpVM');
    sl.addEventListener('input',function(){
      if(k==='s'){setS(+sl.value);preview()}else setM(+sl.value);
    });
    btn.addEventListener('click',function(e){
      e.preventDefault();e.stopPropagation();
      if(k==='s'){toggleS();if(st.s>0)preview()}else toggleM();
    });
  });
}
function paint(el){el.innerHTML='<div class="dfpVB">'+rowHTML('s','音效')+rowHTML('m','音樂')+'</div>';bind(el)}
function syncUI(){
  document.querySelectorAll('.dfpVol .dfpVR').forEach(function(row){
    var k=row.getAttribute('data-k'),p=k==='s'?st.s:st.m;
    var sl=row.querySelector('input'),vp=row.querySelector('.dfpVP'),btn=row.querySelector('.dfpVM');
    if(sl&&document.activeElement!==sl)sl.value=p;
    if(sl){sl.setAttribute('aria-valuenow',p);sl.setAttribute('aria-label',(k==='s'?'音效':'音樂')+'音量')}
    if(vp)vp.textContent=p+'%';
    if(btn){
      var on=p>0;
      btn.setAttribute('aria-pressed',on?'false':'true');
      btn.textContent=on?'靜音':'開啟';
      btn.setAttribute('aria-label',(on?'靜音':'取消靜音')+(k==='s'?'音效':'音樂'));
    }
  });
  try{
    var b=document.getElementById('soundBtn');
    if(b){
      var on=st.s>0;
      if(b.firstElementChild)b.firstElementChild.textContent=on?'🔊':'🔇';
      if(b.lastElementChild&&b.lastElementChild!==b.firstElementChild)b.lastElementChild.textContent=on?'音效：開':'音效：關';
      b.setAttribute('aria-pressed',on);
    }
  }catch(e){}
}
function mount(el){if(!el)return;el.classList.add('dfpVol');paint(el)}
function boot(){
  persist();
  var menu=document.getElementById('menu16');
  if(menu&&!document.getElementById('dfpVolMenu')){
    var box=document.createElement('div');
    box.id='dfpVolMenu';box.className='dfpVol dfpVol--menu';
    menu.insertBefore(box,menu.firstChild);
    mount(box);
  }
  var pop=document.getElementById('audioPop');
  if(pop&&!document.getElementById('dfpVolPop')){
    pop.querySelectorAll('#musBtn, label').forEach(function(n){n.hidden=true});
    var box2=document.createElement('div');
    box2.id='dfpVolPop';box2.className='dfpVol dfpVol--pop';
    pop.insertBefore(box2,pop.firstChild);
    mount(box2);
  }
  syncUI();
}
function hookSoundBtn(){
  var sb=document.getElementById('soundBtn');
  if(!sb)return;
  sb.onclick=function(e){if(e)e.stopPropagation();toggleS();if(st.s>0)preview()};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);
else boot();
addEventListener('load',function(){hookSoundBtn();applyGains();syncUI()});

var api=window.DFPvol={
  get:function(){return {s:st.s,m:st.m,sfx:st.s/100,mus:st.m/100,sfxOn:st.s>0,musOn:st.m>0}},
  sfx:function(){return st.s/100},
  mus:function(){return st.m/100},
  sfxOn:function(){return st.s>0},
  musOn:function(){return st.m>0},
  setS:setS,setM:setM,toggleS:toggleS,toggleM:toggleM,
  mount:mount,apply:applyGains,sync:syncUI,preview:preview,
  onChange:function(fn){if(typeof fn==='function')cbs.push(fn)}
};
persist();
})();
