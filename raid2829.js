/* 龍運金殿 v28.29: 金殿掠奪／回擊＋被打推播（本機示範；只得不失；純虛擬・無兌現） */
(function(){if(!window.CZ)return;var LS=localStorage,K='dfp_rd',$=function(i){return document.getElementById(i)};
var FR=['阿明','小美','阿傑','佳佳','老王'],AT=3,RW=[30,50,80],RV=80,GAP=7200000;
function dk(){var d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()}
function st(){var s;try{s=JSON.parse(LS.getItem(K)||'{}')}catch(e){s={}}if(!s||s.d!==dk())s={d:dk(),a:0,h:[],g:0};if(!Array.isArray(s.h))s.h=[];return s}
function sv(s){try{LS.setItem(K,JSON.stringify(s))}catch(e){}}
function snd(n){try{window.sfx&&window.sfx(n)}catch(e){}}
function pick(a){return a[Math.floor(Math.random()*a.length)]}
function hm(t){var d=new Date(t);return ('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2)}
var anc=$('ivB')||document.querySelector('.wk')||document.querySelector('.top');if(!anc)return;
var bn=document.createElement('button');bn.className='ivb rdb';bn.id='rdB';bn.innerHTML='<span class="ive" aria-hidden="true"><img src="assets/lx/ev_raid.webp?v=2848" alt="" width="128" height="128"></span><span class="ivt"><b>金殿掠奪</b><small id="rdBs"></small></span><span class="ivg">出擊</span>';
anc.parentNode.insertBefore(bn,anc.nextSibling);
var d=document.createElement('dialog');d.id='dRd';d.setAttribute('aria-labelledby','rdT');
d.innerHTML='<h3 id="rdT">金殿掠奪</h3><p class="rdx">示範好友：本機示範，連線對戰準備中</p><div class="rdk"><span id="rdN"></span><span class="rdsh"><img src="assets/lx/ev_shield.webp?v=2848" alt="" width="128" height="128"> 金殿護盾：被掠奪不扣籌碼</span></div>'+
'<div class="rdl" id="rdL"></div><h4 class="rdh">被掠奪紀錄</h4><div class="rdi" id="rdI"></div><p class="ivm" id="rdM" role="status"></p>'+
'<p class="note">每日可掠奪 3 次（每次 ＋30～80），被好友掠奪可「回擊」領 ＋80，0 點重置<br>掠奪只得不失，不會扣任何籌碼<br>虛擬籌碼僅供娛樂・純虛擬・無兌現・不可轉讓或交易</p><div class="frs"><button class="btn close" id="rdX">關閉</button></div>';
document.body.appendChild(d);
var pu=document.createElement('div');pu.className='rdp';pu.id='rdP';pu.setAttribute('role','status');document.body.appendChild(pu);
function incoming(){var s=st(),now=Date.now();if(s.g<2&&now-(s.lt||0)>=GAP){s.g++;s.lt=now;s.h.unshift({f:pick(FR),t:now,r:0,sn:0});sv(s)}return s}
function render(){var s=st(),left=AT-s.a,rv=s.h.filter(function(x){return !x.r}).length;
 $('rdN').textContent='今日掠奪 '+s.a+' / '+AT+' 次';
 $('rdL').innerHTML=FR.map(function(f,i){return '<div class="rdf"><span class="rda">'+f.slice(0,1)+'</span><b>'+f+'</b><button class="btn'+(left>0?' hot':'')+'" data-at="'+i+'"'+(left>0?'':' disabled')+'>'+(left>0?'掠奪':'明日')+'</button></div>'}).join('');
 $('rdI').innerHTML=s.h.length?s.h.map(function(x,i){return '<div class="rdr'+(x.r?' got':'')+'"><span>'+hm(x.t)+'</span><b>'+x.f+' 掠奪了你的金殿！</b><button class="btn'+(x.r?'':' hot')+'" data-rv="'+i+'"'+(x.r?' disabled':'')+'>'+(x.r?'已回擊':'回擊 ＋'+RV)+'</button></div>'}).join(''):'<p class="rde">今天還沒有人來掠奪，金殿平安～</p>';
 $('rdBs').textContent=rv?(rv+' 位好友掠奪了你，快回擊！'):(left>0?('今日還能掠奪 '+left+' 次'):'今日掠奪已用完');
 bn.classList.toggle('has',rv>0||left>0)}
function push(){var s=st(),x=s.h[0];if(!x||x.sn)return;x.sn=1;sv(s);
 pu.innerHTML='<span class="rdpi"><img src="assets/lx/ev_raid.webp?v=2848" alt="" width="128" height="128"></span><span class="rdpt"><b>'+x.f+' 掠奪了你的金殿！</b><small>護盾已擋下・點此回擊領 ＋'+RV+'</small></span>';
 pu.classList.add('on');try{CZ.vib([30,40,30])}catch(e){}snd(1);clearTimeout(pu._t);pu._t=setTimeout(function(){pu.classList.remove('on')},5200)}
pu.onclick=function(){pu.classList.remove('on');render();d.open||d.showModal()};
$('rdL').onclick=function(e){var b=e.target.closest('[data-at]');if(!b||b.disabled)return;var s=st();if(s.a>=AT)return;var f=FR[+b.getAttribute('data-at')],r=pick(RW);s.a++;sv(s);CZ.addChips(r);CZ.vib(25);snd(2);$('rdM').textContent='掠奪 '+f+' 的金殿成功！搶回 ＋'+r+'（對方有護盾，不會損失）';CZ.toast('掠奪成功 ＋'+r,'assets/lx/ev_raid.webp?v=2848');render()};
$('rdI').onclick=function(e){var b=e.target.closest('[data-rv]');if(!b||b.disabled)return;var s=st(),x=s.h[+b.getAttribute('data-rv')];if(!x||x.r)return;x.r=1;sv(s);CZ.addChips(RV);CZ.vib(25);snd(2);$('rdM').textContent='回擊 '+x.f+' 成功！＋'+RV;CZ.toast('回擊成功 ＋'+RV,'assets/lx/ev_counter.webp?v=2848');render()};
bn.onclick=function(){snd(1);CZ.vib(8);render();d.showModal()};$('rdX').onclick=function(){snd(1);d.close()};
incoming();render();
/* v28.43: only after the player is on the lobby main screen (splash/door/age gate gone, no dialog), then a slim pill above the nav */
function rdy(){if(document.getElementById('load')||document.getElementById('czDoor')&&document.getElementById('czDoor').offsetParent)return false;if(document.querySelector('dialog[open],.agOn,#h21'))return false;var H=document.documentElement;if(H.classList.contains('lx')){var lx=document.getElementById('lx');if(!lx||lx.getAttribute('data-cur')&&lx.getAttribute('data-cur')!=='home')return false}if(document.hidden)return false;return true}
var _push=push;push=function(){if(!rdy()){setTimeout(function(){w2(0)},1500);return}var bb=document.querySelector('#lx .lxBot');pu.style.bottom=bb&&bb.offsetParent?(Math.ceil(innerHeight-bb.getBoundingClientRect().top)+4)+'px':'';_push();clearTimeout(pu._t);pu._t=setTimeout(function(){pu.classList.remove('on')},4200)};
function w2(n){var ok=rdy();if(ok){setTimeout(function(){rdy()?_ok():w2(n+1)},1500);return}if(n<300)setTimeout(function(){w2(n+1)},800)}
function _ok(){push()}
w2(0);window.DFPrd={render:render,push:push,incoming:incoming}})();
