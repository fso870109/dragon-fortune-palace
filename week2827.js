/* 龍運金殿 v28.27: 每週活動日曆（骨架）— 每天一個主題日，當日可領一次活動紅包（純虛擬・無兌現；不改機率） */
(function(){if(!window.CZ)return;var LS=localStorage,K='dfp_wk',$=function(i){return document.getElementById(i)};
var IV='?v=2849';function ic(id){return '<img src="assets/lx/ev_'+id+'.webp'+IV+'" alt="" width="128" height="128">'}
var DAYS=[ /* index = getDay(): 0=日 */
 {w:'日',n:'燈之日',ic:'km_lantern',t:'週末團圓，和好友互送紅包',r:150,go:'',gt:'好友互送'},
 {w:'一',n:'梅之日',ic:'km_ume',t:'新的一週，好運開工',r:100,go:'',gt:''},
 {w:'二',n:'蘭之日',ic:'km_ran',t:'武士出陣，今日主打機台',r:100,go:'samurai.html',gt:'前往天下布武'},
 {w:'三',n:'竹之日',ic:'km_take',t:'櫻吹雪，週間療癒一下',r:100,go:'sakura.html',gt:'前往櫻花斬'},
 {w:'四',n:'菊之日',ic:'km_kiku',t:'招財萌貓，週四招好運',r:100,go:'neko.html',gt:'前往招財大作戰'},
 {w:'五',n:'松之日',ic:'km_matsu',t:'小週末花火大會',r:120,go:'matsuri.html',gt:'前往夏祭花火'},
 {w:'六',n:'柏之日',ic:'km_haku',t:'週末狂歡，排行榜衝一波',r:150,go:'',gt:''}];
function dk(){var d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()}
function got(){try{return LS.getItem(K)===dk()}catch(e){return false}}
function snd(n){try{window.sfx&&window.sfx(n)}catch(e){}}
var sec=document.querySelector('h2.sec');if(!sec)return;
var s=document.createElement('section');s.className='wk';s.setAttribute('aria-label','本週活動');
var order=[1,2,3,4,5,6,0];
s.innerHTML='<div class="wkh"><b>本週活動</b><small id="wkTd"></small></div><div class="wkr" id="wkR">'+order.map(function(i){var d=DAYS[i];return '<button class="wkc" data-wd="'+i+'" aria-label="週'+d.w+' '+d.n+'"><small>週'+d.w+'</small><span aria-hidden="true">'+ic(d.ic)+'</span></button>'}).join('')+'</div>';
sec.parentNode.insertBefore(s,sec);
var dl=document.createElement('dialog');dl.id='dWk';dl.setAttribute('aria-labelledby','wkT');
dl.innerHTML='<h3 id="wkT">本週活動</h3><div class="wkx" id="wkX"></div><div class="wkl" id="wkL"></div>'+
'<p class="note">活動紅包每日一次・0 點重置・不影響機台機率<br>虛擬籌碼僅供娛樂・純虛擬・無兌現・不可轉讓或交易</p><div class="frs"><button class="btn close" id="wkC">關閉</button></div>';
document.body.appendChild(dl);
function render(sel){var td=new Date().getDay();if(sel==null)sel=td;var d=DAYS[sel],isT=sel===td,g=got();
 $('wkTd').textContent='今日：'+DAYS[td].n+(g?'・已領':'・紅包可領');
 [].forEach.call(document.querySelectorAll('#wkR .wkc'),function(b){var i=+b.getAttribute('data-wd');b.classList.toggle('td',i===td);b.classList.toggle('has',i===td&&!g)});
 var h='<span class="wke" aria-hidden="true">'+ic(d.ic)+'</span><div class="x"><b>週'+d.w+'・'+d.n+'</b><small>'+d.t+'・活動紅包 ＋'+d.r+'</small></div>';
 if(isT)h+='<div class="wka"><button class="btn'+(g?'':' hot')+'" id="wkGet"'+(g?' disabled':'')+'>'+(g?'今日已領':'領取 ＋'+d.r)+'</button>'+(d.go?'<a class="btn" href="'+d.go+'">'+d.gt+'</a>':(d.gt?'<button class="btn" id="wkFr">'+d.gt+'</button>':''))+'</div>';
 else h+='<div class="wka"><span class="wkn">'+(((sel-td+7)%7)?'還有 '+((sel-td+7)%7)+' 天開放':'')+'</span></div>';
 $('wkX').className='wkx'+(isT?' on':'');$('wkX').innerHTML=h;
 $('wkL').innerHTML=order.map(function(i){var x=DAYS[i];return '<button class="wki'+(i===td?' td':'')+(i===sel?' sel':'')+'" data-wd="'+i+'"><small>週'+x.w+'</small><span aria-hidden="true">'+ic(x.ic)+'</span></button>'}).join('');
 var gb=$('wkGet');if(gb)gb.onclick=function(){if(got())return;try{LS.setItem(K,dk())}catch(e){}CZ.addChips(d.r);CZ.vib(20);CZ.toast(d.n+'・活動紅包 ＋'+d.r,'assets/lx/ev_'+d.ic+'.webp'+IV);try{CZ.track&&CZ.track('wk');CZ.track('wkd',sel)}catch(e){}snd(2);render(sel)};
 var fb=$('wkFr');if(fb)fb.onclick=function(){dl.close();var b=$('bFr');b&&b.click()}}
function open(i){snd(1);CZ.vib(8);render(i);if(!dl.open)dl.showModal()}
$('wkR').onclick=function(e){var t=e.target.closest('[data-wd]');if(t)open(+t.getAttribute('data-wd'))};
s.querySelector('.wkh').onclick=function(){open()};
$('wkL').onclick=function(e){var t=e.target.closest('[data-wd]');if(t)render(+t.getAttribute('data-wd'))};
$('wkC').onclick=function(){snd(1);dl.close()};
render();window.DFPwk={render:render}})();
