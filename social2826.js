/* 龍運金殿 v28.26: 好友每日互送虛擬籌碼（本機示範好友；純虛擬・無兌現・不可交易） */
(function(){if(!window.CZ)return;var LS=localStorage,K='dfp_fr',$=function(i){return document.getElementById(i)};
var IV='?v=2850';function ic(id){return '<img src="assets/lx/ev_'+id+'.webp'+IV+'" alt="" width="128" height="128">'}
function face(f){return (f&&f.av)?'<img src="assets/lx/'+f.av+'.webp'+IV+'" alt="">':((f&&f.n)||'?').slice(0,1)}
var FR=[{id:'a',n:'阿明',av:'av_a',t:'夏祭花火常客'},{id:'b',n:'小美',av:'av_b',t:'櫻花斬愛好者'},{id:'c',n:'阿傑',av:'av_c',t:'天下布武玩家'},{id:'d',n:'佳佳',av:'av_d',t:'招財大作戰粉絲'},{id:'e',n:'老王',av:'av_e',t:'金殿老會員'}];
var GIFT=50,BONUS=100;
function dk(){var d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()}
function st(){var s;try{s=JSON.parse(LS.getItem(K)||'{}')}catch(e){s={}}if(!s||s.d!==dk())s={d:dk(),got:0,sent:[],bon:0};if(!Array.isArray(s.sent))s.sent=[];return s}
function sv(s){try{LS.setItem(K,JSON.stringify(s))}catch(e){}}
function snd(n){try{window.sfx&&window.sfx(n)}catch(e){}}
var top=document.querySelector('.top'),bg=$('bBgm');if(!top)return;
var b=document.createElement('button');b.className='ib';b.id='bFr';b.setAttribute('aria-label','好友互送');b.innerHTML='👥<span class="dot"></span>';top.insertBefore(b,bg||null);
var d=document.createElement('dialog');d.id='dFr';d.setAttribute('aria-labelledby','frT');
d.innerHTML='<h3 id="frT">好友互送</h3><span class="frw">示範好友：本機示範，連線好友準備中</span>'+
'<div class="frg" id="frG"><span class="gb" aria-hidden="true">'+ic('packet')+'</span><div class="x"><b id="frGt"></b><small id="frGs"></small></div><button class="btn hot" id="frGet">一鍵全收</button></div>'+
'<div class="frl" id="frL"></div><p class="frb" id="frB"></p>'+
'<p class="note">每日 0 點重置・送禮免費，不扣你的籌碼<br>虛擬籌碼僅供娛樂・純虛擬・無兌現・不可轉讓或交易</p><div class="frs"><button class="btn close" id="frX">關閉</button></div>';
document.body.appendChild(d);
function render(){var s=st(),n=FR.length;
 $('frGt').textContent=s.got?'今日禮物已領取':('好友送你 '+n+' 份紅包');
 $('frGs').textContent=s.got?'明天還有新的紅包喔':('每份 '+GIFT+'，共 ＋'+(GIFT*n)+' 虛擬籌碼');
 $('frGet').disabled=!!s.got;$('frGet').textContent=s.got?'已領取':'一鍵全收';$('frG').classList.toggle('on',!s.got);
 $('frL').innerHTML=FR.map(function(f){var done=s.sent.indexOf(f.id)>=0;return '<div class="fri"><span class="fav" aria-hidden="true">'+face(f)+'</span><div class="n"><b>'+f.n+'</b><small>'+f.t+'</small></div><button class="btn'+(done?'':' hot')+'" data-fr="'+f.id+'"'+(done?' disabled':'')+'>'+(done?'已送出':'回送紅包')+'</button></div>'}).join('');
 var c=s.sent.length;$('frB').innerHTML=(s.bon?'今日回送全滿，已獲得好友獎勵 ＋'+BONUS:'回送 '+c+' / '+n+' 位好友，全送出再得 ＋'+BONUS)+'<i><u style="width:'+(c/n*100)+'%"></u></i>';
 b.classList.toggle('has',!s.got||c<n)}
$('frGet').onclick=function(){var s=st();if(s.got)return;s.got=1;sv(s);var v=GIFT*FR.length;CZ.addChips(v);CZ.vib(20);CZ.toast('收到好友紅包 ＋'+v,'assets/lx/ev_packet.webp'+IV);snd(2);render()};
$('frL').onclick=function(e){var t=e.target.closest('[data-fr]');if(!t)return;var s=st(),id=t.getAttribute('data-fr');if(s.sent.indexOf(id)>=0)return;s.sent.push(id);var f=FR.filter(function(x){return x.id===id})[0];
 if(s.sent.length>=FR.length&&!s.bon){s.bon=1;sv(s);CZ.addChips(BONUS);CZ.toast('好友全回送 ＋'+BONUS,'assets/lx/ev_friends.webp'+IV);snd(2)}else{sv(s);CZ.toast('已回送紅包給 '+(f?f.n:'好友'),'assets/lx/ev_packet.webp'+IV);snd(1)}CZ.vib(10);render()};
b.onclick=function(){snd(1);CZ.vib(8);render();d.showModal()};$('frX').onclick=function(){snd(1);d.close()};
render();window.DFPfr={render:render}})();
