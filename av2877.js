/* 龍運金殿 v28.78：大廳大頭貼選擇與帳號連結（FB_LOGIN 可重開 Facebook） */
(function(){
var $=function(i){return document.getElementById(i)};
var AVS=['av_a','av_b','av_c','av_d','av_e','av_f','av_g','av_h','av_i','av_j','av_k','av_l'];
var Q='?v=2878';
var FALL='assets/lx/av_a.webp'+Q;
var blocked={google:false,facebook:false};
var busy=0;
function fbOn(){return window.FB_LOGIN===true}
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
  return (window.DFPfb&&typeof DFPfb.linkedProviders==='function')?DFPfb.linkedProviders():{google:null,facebook:null};
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
function ensure(){
  if($('dAv'))return $('dAv');
  var d=document.createElement('dialog');
  d.id='dAv';
  d.setAttribute('aria-labelledby','avT');
  d.innerHTML='<h3 id="avT">選擇大頭貼</h3>'+
    '<p class="avLead">選一張金殿旅人像，或連結帳號使用自己的照片</p>'+
    '<div class="avGrid" id="avGrid"></div>'+
    '<div class="avProv" id="avProv"></div>'+
    '<p class="avMsg" id="avMsg" role="status"></p>'+
    '<div class="avLink">'+
      '<small class="avLkT">連結帳號</small>'+
      '<div class="avBtns">'+
        '<button type="button" class="btn" id="avG">連結 Google</button>'+
        (fbOn()?'<button type="button" class="btn" id="avF">連結 Facebook</button>':'')+
      '</div>'+
      '<small class="avNote">虛擬籌碼只留在這部裝置，連結不會改到你的籌碼<br>連結後仍是同一個旅人，進度會保留</small>'+
    '</div>'+
    '<div class="frs"><button type="button" class="btn close" id="avX">關閉</button></div>';
  document.body.appendChild(d);
  $('avGrid').addEventListener('click',onPick);
  $('avProv').addEventListener('click',onPick);
  $('avG').onclick=function(){doLink('google')};
  if($('avF')) $('avF').onclick=function(){doLink('facebook')};
  $('avX').onclick=function(){snd(1);d.close()};
  return d;
}
function say(t){var e=$('avMsg');if(e)e.textContent=t||''}
function tileHtml(id,on,label){
  var src=built(id);
  return '<button type="button" class="avCell'+(on?' on':'')+'" data-av="'+id+'" aria-label="'+(label||'金殿旅人像')+'">'+
    '<img src="'+src+'" alt="" onerror="this.onerror=null;this.src=\''+FALL+'\'"></button>';
}
function photoTile(av,on,label){
  var src=String(av||FALL);
  var safe=src.replace(/&/g,'&amp;').replace(/"/g,'&quot;');
  return '<button type="button" class="avPhoto'+(on?' on':'')+'" data-av="'+safe+'">'+
    '<span class="ring"><img src="'+safe+'" alt="" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src=\''+FALL+'\'"></span>'+
    '<small>'+label+'</small></button>';
}
function gLabel(have){
  if(have) return '已連結 Google';
  if(blocked.google) return 'Google 登入即將開放';
  return '連結 Google';
}
function fLabel(have){
  if(have) return '已連結 Facebook';
  if(blocked.facebook) return 'FB 登入即將開放';
  return '連結 Facebook';
}
function paint(){
  ensure();
  var list=ids(), now=cur(), lk=linked();
  $('avGrid').innerHTML=list.map(function(id,i){
    return tileHtml(id, now===id, '金殿旅人 '+(i+1));
  }).join('');
  var bits=[];
  if(lk.google&&lk.google.photoURL) bits.push(photoTile(lk.google.photoURL, now===lk.google.photoURL, '使用 Google 大頭貼'));
  if(fbOn()&&lk.facebook&&lk.facebook.photoURL) bits.push(photoTile(lk.facebook.photoURL, now===lk.facebook.photoURL, '使用 FB 大頭貼'));
  $('avProv').innerHTML=bits.join('');
  $('avProv').hidden=!bits.length;
  var g=$('avG'), f=$('avF');
  g.textContent=gLabel(!!lk.google);
  g.disabled=!!lk.google;
  if(f){ f.hidden=false; f.textContent=fLabel(!!lk.facebook); f.disabled=!!lk.facebook; }
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
function doLink(which){
  if(busy)return;
  if(!window.DFPfb||!DFPfb.live||!DFPfb.linkAccount){
    say(fbOn()?'連線後才能連結 Google 或 Facebook':'連線後才能連結 Google');
    return;
  }
  busy=1;say(which==='facebook'?'正在連結 Facebook…':'正在連結 Google…');
  DFPfb.linkAccount(which).then(function(r){
    busy=0;
    if(r&&r.redirect){say('正在改用頁面跳轉，請稍候');return}
    say('已連結，旅人資料會留在同一個身分');
    paint();
    toast(which==='facebook'?'已連結 Facebook':'已連結 Google');
    snd(2);
  }).catch(function(e){
    busy=0;
    var msg;
    if(window.DFPfb&&typeof DFPfb.linkError==='function') msg=DFPfb.linkError(e, which);
    else msg='連結沒有成功，請稍後再試';
    if(/operation-not-allowed/i.test((e&&(e.code||e.message))||'')) blocked[which]=true;
    say(msg);
    paint();
    if(msg==='已取消連結') return;
    if(blocked[which]) return;
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
