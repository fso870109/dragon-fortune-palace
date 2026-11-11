/* 龍運金殿 v28.68: 好友每日互送虛擬籌碼（Firebase 連線；規則未發布或無設定時回退本機示範；純虛擬・無兌現・不可交易） */
(function(){if(!window.CZ)return;var LS=localStorage,K='dfp_fr',KL='dfp_fr_live',$=function(i){return document.getElementById(i)};
var IV='?v=2850';function ic(id){return '<img src="assets/lx/ev_'+id+'.webp'+IV+'" alt="" width="128" height="128">'}
function face(f){return (f&&f.av)?'<img src="assets/lx/'+f.av+'.webp'+IV+'" alt="">':((f&&f.n)||'?').slice(0,1)}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
var FR=[{id:'a',n:'阿明',av:'av_a',t:'夏祭花火常客'},{id:'b',n:'小美',av:'av_b',t:'櫻花斬愛好者'},{id:'c',n:'阿傑',av:'av_c',t:'天下布武玩家'},{id:'d',n:'佳佳',av:'av_d',t:'招財大作戰粉絲'},{id:'e',n:'老王',av:'av_e',t:'金殿老會員'}];
var GIFT=50,BONUS=100,AVS=['av_a','av_b','av_c','av_d','av_e'];
function dk(){var d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()}
function st(){var s;try{s=JSON.parse(LS.getItem(K)||'{}')}catch(e){s={}}if(!s||s.d!==dk())s={d:dk(),got:0,sent:[],bon:0};if(!Array.isArray(s.sent))s.sent=[];return s}
function sv(s){try{LS.setItem(K,JSON.stringify(s))}catch(e){}}
function liveDay(){return (window.DFPfb&&DFPfb.dayId)?DFPfb.dayId():dk()}
function lst(){var s;try{s=JSON.parse(LS.getItem(KL)||'{}')}catch(e){s={}}var d=liveDay();if(!s||s.d!==d)s={d:d,got:[],sent:[],bon:0};if(!Array.isArray(s.got))s.got=[];if(!Array.isArray(s.sent))s.sent=[];return s}
function lsv(s){try{LS.setItem(KL,JSON.stringify(s))}catch(e){}}
function snd(n){try{window.sfx&&window.sfx(n)}catch(e){}}
function faceAv(av,n){if(window.DFPface)return DFPface(av,n);return face({av:av,n:n})}
window.DFPface=window.DFPface||function(av,n){return AVS.indexOf(av)>=0?'<img src="assets/lx/'+av+'.webp'+IV+'" alt="">':String(n||'?').slice(0,1)};
var live=false,friends=[],busy=0;
var top=document.querySelector('.top'),bg=$('bBgm');if(!top)return;
var b=document.createElement('button');b.className='ib';b.id='bFr';b.setAttribute('aria-label','好友互送');b.innerHTML='👥<span class="dot"></span>';top.insertBefore(b,bg||null);
var d=document.createElement('dialog');d.id='dFr';d.setAttribute('aria-labelledby','frT');
d.innerHTML='<h3 id="frT">好友互送</h3><span class="frw" id="frW">示範好友：本機示範，連線好友準備中</span>'+
'<div class="frme" id="frMe">'+
 '<span class="fav" id="frMeAv" aria-hidden="true"></span>'+
 '<div class="n"><label class="sr" for="frNm">顯示名稱</label><input id="frNm" maxlength="12" autocomplete="off" spellcheck="false">'+
 '<small>好友碼 <b id="frCode"></b> <button type="button" class="btn frcp" id="frCopy">複製</button></small></div></div>'+
'<div class="fravs" id="frAvs" hidden></div>'+
'<div class="fradd" id="frAdd"><label class="sr" for="frIn">好友碼</label>'+
 '<input id="frIn" maxlength="12" autocomplete="off" spellcheck="false" placeholder="輸入好友碼 DF-······">'+
 '<button type="button" class="btn hot" id="frAddB">加入</button></div>'+
'<p class="frmsg" id="frMsg" role="status"></p>'+
'<div class="frg" id="frG"><span class="gb" aria-hidden="true">'+ic('packet')+'</span><div class="x"><b id="frGt"></b><small id="frGs"></small></div><button class="btn hot" id="frGet">一鍵全收</button></div>'+
'<div class="frl" id="frL"></div><p class="frb" id="frB"></p>'+
'<p class="note">每日 0 點重置・送禮免費，不扣你的籌碼<br>虛擬籌碼僅供娛樂・純虛擬・無兌現・不可轉讓或交易</p><div class="frs"><button class="btn close" id="frX">關閉</button></div>';
document.body.appendChild(d);
function msg(t){var e=$('frMsg');if(e)e.textContent=t||''}
function paintMe(){
  var p=window.DFPfb&&DFPfb.profile;if(!p)return;
  $('frMeAv').innerHTML=faceAv(p.avatar,p.displayName);
  $('frNm').value=p.displayName||'';
  $('frCode').textContent=p.friendCode||'';
  $('frAvs').innerHTML=AVS.map(function(a){return '<button type="button" class="'+(a===p.avatar?'on':'')+'" data-av="'+a+'" aria-label="頭像 '+a+'">'+faceAv(a,'')+'</button>'}).join('');
  $('frAvs').hidden=false;
  var img=document.querySelector('#lxMe .lxAv img');
  if(img)img.src='assets/lx/'+p.avatar+'.webp'+IV;
}
function renderDemo(){var s=st(),n=FR.length;
 $('frGt').textContent=s.got?'今日禮物已領取':('好友送你 '+n+' 份紅包');
 $('frGs').textContent=s.got?'明天還有新的紅包喔':('每份 '+GIFT+'，共 ＋'+(GIFT*n)+' 虛擬籌碼');
 $('frGet').disabled=!!s.got;$('frGet').textContent=s.got?'已領取':'一鍵全收';$('frG').classList.toggle('on',!s.got);
 $('frL').innerHTML=FR.map(function(f){var done=s.sent.indexOf(f.id)>=0;return '<div class="fri"><span class="fav" aria-hidden="true">'+face(f)+'</span><div class="n"><b>'+f.n+'</b><small>'+f.t+'</small></div><button class="btn'+(done?'':' hot')+'" data-fr="'+f.id+'"'+(done?' disabled':'')+'>'+(done?'已送出':'回送紅包')+'</button></div>'}).join('');
 var c=s.sent.length;$('frB').innerHTML=(s.bon?'今日回送全滿，已獲得好友獎勵 ＋'+BONUS:'回送 '+c+' / '+n+' 位好友，全送出再得 ＋'+BONUS)+'<i><u style="width:'+(c/n*100)+'%"></u></i>';
 b.classList.toggle('has',!s.got||c<n)}
function renderLive(){var s=lst(),n=friends.length,inbox=0;
 try{/* claimed ids already in s.got */}catch(e){}
 var rec=window.__dfpRec||[];inbox=rec.filter(function(g){return s.got.indexOf(g.id)<0}).length;
 $('frGt').textContent=inbox?('好友送你 '+inbox+' 份紅包'):(s.got.length?'今日禮物已領取':'還沒有新的好友紅包');
 $('frGs').textContent=inbox?('每份 '+GIFT+'，共 ＋'+(GIFT*inbox)+' 虛擬籌碼'):(n?'等好友回送紅包給你':'先用好友碼加一位好友');
 $('frGet').disabled=!inbox;$('frGet').textContent=inbox?'一鍵全收':'已領取';$('frG').classList.toggle('on',!!inbox);
 if(!n)$('frL').innerHTML='<p class="fre">還沒有好友。請輸入對方的好友碼。</p>';
 else $('frL').innerHTML=friends.map(function(f){var done=s.sent.indexOf(f.uid)>=0;return '<div class="fri"><span class="fav" aria-hidden="true">'+faceAv(f.avatar,f.displayName)+'</span><div class="n"><b>'+esc(f.displayName)+'</b><small>Lv.'+(f.level||1)+' · '+esc(f.friendCode)+'</small></div><button class="btn'+(done?'':' hot')+'" data-fr="'+esc(f.uid)+'"'+(done?' disabled':'')+'>'+(done?'已送出':'回送紅包')+'</button></div>'}).join('');
 var c=s.sent.length;
 if(!n)$('frB').innerHTML='加好友之後，每日可互送紅包，全送出再得 ＋'+BONUS;
 else $('frB').innerHTML=(s.bon?'今日回送全滿，已獲得好友獎勵 ＋'+BONUS:'回送 '+c+' / '+n+' 位好友，全送出再得 ＋'+BONUS)+'<i><u style="width:'+(n?c/n*100:0)+'%"></u></i>';
 b.classList.toggle('has',!!inbox||(n>0&&c<n));
 paintMe()}
function render(){if(live)renderLive();else renderDemo()}
function refreshLive(){
  if(!live||!window.DFPfb)return Promise.resolve();
  return Promise.all([DFPfb.listFriends(),DFPfb.listReceived(),DFPfb.listSent()]).then(function(x){
    friends=x[0]||[];window.__dfpRec=x[1]||[];
    var s=lst();
    (x[2]||[]).forEach(function(g){if(s.sent.indexOf(g.to)<0)s.sent.push(g.to)});
    lsv(s);renderLive();
  }).catch(function(){renderLive()})}
$('frGet').onclick=function(){
  if(live){
    if(busy)return;var s=lst(),rec=(window.__dfpRec||[]).filter(function(g){return s.got.indexOf(g.id)<0});
    if(!rec.length)return;
    var v=GIFT*rec.length;rec.forEach(function(g){s.got.push(g.id)});lsv(s);
    CZ.addChips(v);CZ.vib(20);CZ.toast('收到好友紅包 ＋'+v,'assets/lx/ev_packet.webp'+IV);snd(2);renderLive();return;
  }
  var s=st();if(s.got)return;s.got=1;sv(s);var v=GIFT*FR.length;CZ.addChips(v);CZ.vib(20);CZ.toast('收到好友紅包 ＋'+v,'assets/lx/ev_packet.webp'+IV);snd(2);render()};
$('frL').onclick=function(e){
  var t=e.target.closest('[data-fr]');if(!t)return;
  if(live){
    if(busy)return;var id=t.getAttribute('data-fr'),s=lst();if(s.sent.indexOf(id)>=0)return;
    var f=friends.filter(function(x){return x.uid===id})[0];
    busy=1;t.disabled=true;
    DFPfb.sendGift(id).then(function(){
      s=lst();if(s.sent.indexOf(id)<0)s.sent.push(id);
      if(friends.length&&s.sent.length>=friends.length&&!s.bon){s.bon=1;lsv(s);CZ.addChips(BONUS);CZ.toast('好友全回送 ＋'+BONUS,'assets/lx/ev_friends.webp'+IV);snd(2)}
      else{lsv(s);CZ.toast('已回送紅包給 '+(f?f.displayName:'好友'),'assets/lx/ev_packet.webp'+IV);snd(1)}
      CZ.vib(10);busy=0;renderLive();
    }).catch(function(){busy=0;msg('送禮沒有成功，請稍後再試');renderLive()});
    return;
  }
  var s=st(),id=t.getAttribute('data-fr');if(s.sent.indexOf(id)>=0)return;s.sent.push(id);var f=FR.filter(function(x){return x.id===id})[0];
  if(s.sent.length>=FR.length&&!s.bon){s.bon=1;sv(s);CZ.addChips(BONUS);CZ.toast('好友全回送 ＋'+BONUS,'assets/lx/ev_friends.webp'+IV);snd(2)}else{sv(s);CZ.toast('已回送紅包給 '+(f?f.n:'好友'),'assets/lx/ev_packet.webp'+IV);snd(1)}CZ.vib(10);render()};
$('frAddB').onclick=function(){
  if(!live||busy)return;var code=$('frIn').value;msg('正在加入…');busy=1;
  DFPfb.addFriend(code).then(function(f){
    $('frIn').value='';msg('已加入好友 '+(f.displayName||''));busy=0;snd(2);CZ.vib(10);refreshLive();
  }).catch(function(e){
    busy=0;var k=e&&e.message;
    msg(k==='self'?'不能加自己的好友碼':k==='already'?'已經是好友了':k==='bad-code'?'好友碼格式不對':k==='not-found'?'找不到這個好友碼':'加好友沒有成功，請稍後再試');
  })};
$('frCopy').onclick=async function(){
  var c=$('frCode').textContent||'';if(!c)return;
  try{await navigator.clipboard.writeText(c);msg('已複製好友碼 '+c)}catch(e){msg('請長按好友碼手動複製')}
};
$('frNm').onchange=function(){
  if(!live)return;var v=$('frNm').value.trim().slice(0,12);if(!v)return;
  DFPfb.updateProfile({displayName:v}).then(function(){paintMe();msg('已更新顯示名稱')}).catch(function(){msg('名稱沒有更新成功')});
};
$('frAvs').onclick=function(e){
  var t=e.target.closest('[data-av]');if(!t||!live)return;
  DFPfb.updateProfile({avatar:t.getAttribute('data-av')}).then(function(){paintMe();refreshLive();msg('已更新頭像')}).catch(function(){msg('頭像沒有更新成功')});
};
b.onclick=function(){snd(1);CZ.vib(8);render();d.showModal();if(live)refreshLive()};
$('frX').onclick=function(){snd(1);d.close()};
render();
function goLive(){
  if(!window.DFPfb||!DFPfb.ready)return false;
  DFPfb.ready.then(function(ok){
    if(!ok||!DFPfb.live)return;
    live=true;d.classList.add('fb');
    $('frW').textContent='連線好友：用好友碼互相加好友，每日互送紅包';
    paintMe();refreshLive();
  }).catch(function(){});
  return true;
}
if(!goLive()){var n=0,iv=setInterval(function(){if(goLive()||++n>80)clearInterval(iv)},50)}
window.DFPfr={render:render,refresh:refreshLive}})();
