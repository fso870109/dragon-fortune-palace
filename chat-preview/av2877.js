/* 龍運金殿 v28.107：大廳大頭貼選擇與 Google 帳號連結（只用 Google 登入） */
(function(){
var $=function(i){return document.getElementById(i)};
var AVS=['av_a','av_b','av_c','av_d','av_e','av_f','av_g','av_h','av_i','av_j','av_k','av_l'];
var Q='?v=2878';
var FALL='assets/lx/av_a.webp'+Q;
var blocked=false;
var busy=0;
function ids(){return (window.DFPfb&&DFPfb.AVATARS)||AVS}
function qv(){return (window.DFPfb&&DFPfb.AVQ)||Q}
function built(id){return 'assets/lx/'+id+'.webp'+qv()}
function cur(){
  if(window.DFPfb&&typeof DFPfb.currentAvatar==='function') return DFPfb.currentAvatar();
  try{
    var s=JSON.parse(localStorage.getItem('dfp_profile')||'{}');
    if(s&&s.avatar) return s.avatar;
  }catch(e){}
  return 'av_a';
}
function linked(){
  return (window.DFPfb&&typeof DFPfb.linkedProviders==='function')?DFPfb.linkedProviders():{google:null};
}
function toast(t,src){try{if(window.CZ&&CZ.toast)CZ.toast(t,src||FALL)}catch(e){}}
function snd(n){try{window.sfx&&window.sfx(n)}catch(e){}}
function paintLobby(av){
  var src=(window.DFPfb&&typeof DFPfb.avatarSrc==='function')?DFPfb.avatarSrc(av):(/^https:/.test(av||'')?av:built(ids().indexOf(av)>=0?av:'av_a'));
  function set(img){
    if(!img)return;
    img.onerror=function(){this.onerror=null;this.src=FALL};
    if(img.getAttribute('src')!==src) img.src=src;
  }
  set(document.querySelector('#lxMe .lxAv img'));
  set(document.querySelector('#lxAvRow .ive img'));
}
var GMARK='<svg class="gG" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>';
var CHECK='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.2 8.4l3 3 6.6-6.8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function ensure(){
  if($('dAv'))return $('dAv');
  var d=document.createElement('dialog');
  d.id='dAv';
  d.setAttribute('aria-labelledby','avT');
  d.innerHTML='<h3 id="avT">選擇大頭貼</h3>'+
    '<section class="avAcct" id="avAcct" aria-label="Google 帳號"></section>'+
    '<p class="avMsg" id="avMsg" role="status"></p>'+
    '<div class="avSec"><span>金殿旅人像</span></div>'+
    '<div class="avGrid" id="avGrid"></div>'+
    '<small class="avNote">虛擬籌碼只留在這部裝置，連結 Google 不會改到籌碼與進度</small>'+
    '<div class="frs"><button type="button" class="btn close" id="avX">關閉</button></div>';
  document.body.appendChild(d);
  $('avGrid').addEventListener('click',onPick);
  $('avAcct').addEventListener('click',function(e){
    if(e.target.closest('#avG')){doLink();return}
    onPick(e);
  });
  $('avX').onclick=function(){snd(1);d.close()};
  return d;
}
function say(t){var e=$('avMsg');if(e){e.textContent=t||'';e.classList.toggle('on',!!t)}}
function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function tileHtml(id,on,label){
  var src=built(id);
  return '<button type="button" class="avCell'+(on?' on':'')+'" data-av="'+id+'" aria-label="'+(label||'金殿旅人像')+'"'+(on?' aria-pressed="true"':'')+'>'+
    '<img src="'+src+'" alt="" onerror="this.onerror=null;this.src=\''+FALL+'\'"></button>';
}
function acctHtml(g,now){
  if(g){
    var ph=String(g.photoURL||''), on=!!ph&&now===ph, name=esc(g.displayName||'');
    var face=ph?'<button type="button" class="avGPh'+(on?' on':'')+'" data-av="'+esc(ph)+'" aria-label="使用 Google 大頭貼">'+
        '<img src="'+esc(ph)+'" alt="" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src=\''+FALL+'\'"><i class="gB">'+GMARK+'</i></button>'
      :'<span class="avGPh none"><i class="gB">'+GMARK+'</i></span>';
    return '<div class="avAcRow">'+face+
      '<div class="avAcTx"><b>Google 帳號</b><span class="avSt ok">'+CHECK+'已連結</span>'+(name?'<em>'+name+'</em>':'')+'</div>'+
      (ph?'<button type="button" class="btn avUse'+(on?' on':'')+'" data-av="'+esc(ph)+'"'+(on?' disabled':'')+'>'+(on?'使用中':'使用照片')+'</button>':'')+
      '</div>';
  }
  return '<div class="avAcRow"><span class="avGDisc">'+GMARK+'</span>'+
    '<div class="avAcTx"><b>Google 帳號</b><span class="avSt">尚未連結</span><em>連結後可用自己的 Google 照片當大頭貼</em></div></div>'+
    '<button type="button" class="avGBtn" id="avG"'+(blocked?' disabled':'')+'><span class="gD">'+GMARK+'</span><span class="gT">'+(blocked?'Google 登入暫時無法使用':'連結 Google')+'</span></button>';
}
function paint(){
  ensure();
  var list=ids(), now=cur(), lk=linked();
  $('avGrid').innerHTML=list.map(function(id,i){
    return tileHtml(id, now===id, '金殿旅人 '+(i+1));
  }).join('');
  var a=$('avAcct');
  a.innerHTML=acctHtml(lk.google,now);
  a.classList.toggle('linked',!!lk.google);
  paintLobby(now);
  if(window.DFPfb&&DFPfb.linkNotice){
    say(DFPfb.linkNotice);
    DFPfb.linkNotice='';
  }
}
function onPick(e){
  var t=e.target.closest('[data-av]');
  if(!t||busy)return;
  var av=t.getAttribute('data-av');
  if(!av)return;
  busy=1;say('正在更新…');
  var run=window.DFPfb&&DFPfb.setAvatar?DFPfb.setAvatar(av):Promise.resolve().then(function(){
    try{
      var s=JSON.parse(localStorage.getItem('dfp_profile')||'{}');
      s.avatar=av;localStorage.setItem('dfp_profile',JSON.stringify(s));
    }catch(x){}
  });
  Promise.resolve(run).then(function(){
    busy=0;say('已更新大頭貼');paint();
    toast('已更新大頭貼', /^https:/.test(av)?FALL:built(av));
    snd(2);
    try{window.CZ&&CZ.vib&&CZ.vib(10)}catch(e){}
    if(window.DFPfr&&DFPfr.render)try{DFPfr.render()}catch(e){}
  }).catch(function(err){
    busy=0;
    var c=err&&(err.code||err.message)||'';
    if(c==='local-only'){
      say('已在這部裝置更換大頭貼。好友端同步稍後生效。');
      paint();
      toast('已更新大頭貼', FALL);
      return;
    }
    say('大頭貼沒有更新成功，請稍後再試');
  });
}
function doLink(){
  if(busy)return;
  if(!window.DFPfb||!DFPfb.live||!DFPfb.linkAccount){
    say('連線後才能連結 Google');
    return;
  }
  busy=1;say('正在連結 Google…');
  var b=$('avG');if(b)b.disabled=true;
  DFPfb.linkAccount('google').then(function(r){
    busy=0;
    if(r&&r.redirect){say('正在改用頁面跳轉，請稍候');return}
    if(r&&r.switched){say('已登入這個 Google 帳號');toast('已登入 Google')}
    else{say('已連結 Google，旅人資料會留在同一個身分');toast('已連結 Google')}
    paint();
    snd(2);
  }).catch(function(e){
    busy=0;
    var msg;
    if(window.DFPfb&&typeof DFPfb.linkError==='function') msg=DFPfb.linkError(e,'google');
    else msg='連結沒有成功，請稍後再試';
    if(/operation-not-allowed/i.test((e&&(e.code||e.message))||'')) blocked=true;
    say(msg);
    paint();
    if(msg==='已取消連結'||blocked) return;
    toast(msg);
  });
}
function open(){
  ensure();paint();
  try{snd(1);window.CZ&&CZ.vib&&CZ.vib(8)}catch(e){}
  $('dAv').showModal();
}
document.addEventListener('click',function(e){
  var av=e.target.closest('#lxMe .lxAv');
  if(!av)return;
  e.preventDefault();
  e.stopPropagation();
  open();
},true);
addEventListener('dfpav',function(){paintLobby(cur());if($('dAv')&&$('dAv').open)paint()});
if(window.DFPfb&&DFPfb.ready) DFPfb.ready.then(function(){paintLobby(cur());if(DFPfb.linkNotice&&$('dAv')){ensure();say(DFPfb.linkNotice)}}).catch(function(){});
paintLobby(cur());
window.DFPav={open:open,paint:paint};
})();
