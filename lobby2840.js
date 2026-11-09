/* 龍運金殿 v28.40 大廳 2.0 — 參考稿版面：頂欄・功能列・輪播・彩金資訊・熱門機台・任務/限時活動・精品收藏館・底部導覽
   只重排既有功能（搬移原本的按鈕與區塊，保留原事件與真實狀態），不改任何機率、彩金、獎勵或經濟數值。 */
(function(){
if(!window.CZ||document.getElementById('lx'))return;
var $=function(i){return document.getElementById(i)},D=document,LS=localStorage,SS=sessionStorage;
var fmt=function(n){return Math.floor(n).toLocaleString('en-US')};
var V='?v=2840';
function el(tag,cls,html){var e=D.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e}
function snd(n){try{window.sfx&&window.sfx(n)}catch(e){}}
function tap(){snd(1);try{CZ.vib(8)}catch(e){}}
var GAMES=[
 {id:'matsuri',n:'夏祭花火',sub:'夏夜祭典・花火綻放',pos:'50% 18%'},
 {id:'samurai',n:'天下布武',sub:'戰國霸者・高波動',pos:'48% 14%'},
 {id:'neko',n:'招財大作戰',sub:'招財萌貓・好運連連',pos:'50% 20%'},
 {id:'sakura',n:'櫻花斬',sub:'櫻吹雪・劍舞登場',pos:'46% 10%'}];
function wallCard(id){return D.querySelector('#wall .card[data-id="'+id+'"]')}
function play(id){var c=wallCard(id);if(c){c.click();return}location.href=id+'.html'}
/* ---------- skeleton ---------- */
var R=el('div');R.id='lx';
R.innerHTML=
'<header class="lxTop">'+
 '<div class="lxLogo"><img src="assets/lx/dragon.webp'+V+'" alt="" width="160" height="181"><span><b>龍運金殿</b><small>DRAGON FORTUNE PALACE</small></span></div>'+
 '<button class="lxMe" id="lxMe" type="button" aria-label="我的會員資料"><span class="lxAv"><img src="assets/lx/avatar.webp'+V+'" alt="" width="128" height="128"></span><span class="lxMeT"><small id="lxLv">Lv.1</small><span class="lxBal"><i class="lxCoin" aria-hidden="true"></i><span id="lxBalSlot"></span></span></span></button>'+
 '<button class="lxPlus" id="lxPlus" type="button" aria-label="領取免費籌碼"><span aria-hidden="true">+</span></button>'+
 '<span id="lxGearSlot"></span>'+
'</header>'+
'<nav class="lxIco" id="lxIco" aria-label="快捷功能"></nav>'+
'<main class="lxMain">'+
 '<section class="lxTab on" data-tab="home" aria-label="首頁">'+
  '<div class="lxHero" id="lxHero"><div class="lxSl" id="lxSl"></div><div class="lxDots" id="lxDots"></div></div>'+
  '<section class="lxJp" aria-label="彩金資訊"><i class="cn tl"></i><i class="cn tr"></i><i class="cn bl"></i><i class="cn br"></i><div class="lxJpH"><span>彩金資訊</span></div><div class="lxJpR">'+
   '<div class="lxJpC"><small><i class="jpi gift" aria-hidden="true"></i>小獎</small><span id="lxJp0"></span></div>'+
   '<div class="lxJpC"><small><i class="jpi crown" aria-hidden="true"></i>大獎</small><span id="lxJp1"></span></div>'+
   '<div class="lxJpC big"><small><i class="jpi crown" aria-hidden="true"></i>頭獎</small><span id="lxJp2"></span></div>'+
  '</div></section>'+
  '<div class="lxSec"><h2><i class="lxSak" aria-hidden="true"></i>熱門機台</h2><button type="button" class="lxMore" data-go="games">更多遊戲<i aria-hidden="true">›</i></button></div>'+
  '<div class="lxHot" id="lxHot"></div>'+
  '<div class="lxDuo">'+
   '<button type="button" class="lxCard lxMis" id="lxMis"><img class="art" src="assets/lx/scroll.webp'+V+'" alt="" width="200" height="243"><span class="tx"><b>每日任務</b><small>完成任務領取獎勵</small><span class="lxPr"><i><u id="lxMisBar"></u><em id="lxMisN">0 / 5</em></i></span></span><span class="go" aria-hidden="true">›</span><span class="bdg" id="lxMisB"></span></button>'+
   '<button type="button" class="lxCard lxEv" id="lxEv"><span class="tx"><b>限時活動</b><small id="lxEvN">本週活動</small><span class="lxCd"><i aria-hidden="true">⏱</i><span id="lxEvT">--:--:--</span></span></span><span class="go" aria-hidden="true">›</span><span class="bdg" id="lxEvB"></span></button>'+
  '</div>'+
  '<button type="button" class="lxCol" id="lxCol"><i class="cn tl"></i><i class="cn tr"></i><i class="cn bl"></i><i class="cn br"></i><img class="art" src="assets/lx/chest.webp'+V+'" alt="" width="420" height="295"><span class="tx"><b>精品收藏館</b><small>收集限定轉盤框・頭像框・稱號</small></span><span class="lxGo">前往<i aria-hidden="true">›</i></span></button>'+
 '</section>'+
 '<section class="lxTab" data-tab="games" aria-label="機台"><div class="lxSec"><h2><i class="lxSak" aria-hidden="true"></i>全部機台</h2></div><div id="lxWallSlot"></div></section>'+
 '<section class="lxTab" data-tab="events" aria-label="活動"><div class="lxSec"><h2><i class="lxSak" aria-hidden="true"></i>活動中心</h2></div><div id="lxEvSlot" class="lxStack"></div></section>'+
 '<section class="lxTab" data-tab="collect" aria-label="收藏"><div class="lxSec"><h2><i class="lxSak" aria-hidden="true"></i>精品收藏館</h2></div><div id="lxColSlot" class="lxStack"></div></section>'+
 '<section class="lxTab" data-tab="me" aria-label="我的"><div class="lxSec"><h2><i class="lxSak" aria-hidden="true"></i>我的金殿</h2></div><div id="lxMeSlot" class="lxStack"></div></section>'+
'</main>'+
'<div class="lxBot"><nav class="lxNav" id="lxNav" aria-label="主選單">'+
 [['home','首頁','n_home'],['games','機台','n_game'],['events','活動','n_gift'],['collect','收藏','n_star'],['me','我的','n_me']].map(function(t){return '<button type="button" data-tab="'+t[0]+'"'+(t[0]==='home'?' class="on" aria-current="page"':'')+'><img src="assets/lx/'+t[2]+'.webp'+V+'" alt="" width="96" height="96"><span>'+t[1]+'</span><i class="nd" aria-hidden="true"></i></button>'}).join('')+
'</nav><p class="lxFoot"><b>18+</b><span>僅供娛樂・虛擬籌碼・無兌現</span></p></div>';
var wrap=D.querySelector('.wrap');D.body.insertBefore(R,wrap?wrap.nextSibling:null);
D.documentElement.classList.add('lx');
/* ---------- move existing live elements ---------- */
function mv(node,slot){if(node&&slot)slot.appendChild(node);return node}
var bal=$('bal');if(bal){$('lxBalSlot').replaceWith(bal);var bl=function(){var n=bal.textContent.length;bal.setAttribute('data-l',n>9?'l':n>7?'m':'s')};bl();new MutationObserver(bl).observe(bal,{childList:true,characterData:true,subtree:true})}
var gear=$('bBgm');if(gear){gear.className='lxGear';$('lxGearSlot').replaceWith(gear)}
var ICO=[['bFree','免費領取','i_gift'],['bDaily','每日簽到','i_cal'],['bMiss','任務','i_task'],['lxAch','成就','i_trophy'],['bLb','排行榜','i_rank'],['lxGd','公會','i_guild']];
ICO.forEach(function(x){var b=$(x[0]);if(!b){b=el('button');b.id=x[0];b.type='button'}
 b.className='lxI'+(b.classList&&b.classList.contains('has')?' has':'');b.innerHTML='<img src="assets/lx/'+x[2]+'.webp'+V+'" alt="" width="112" height="112"><span>'+x[1]+'</span><i class="dot" aria-hidden="true"></i>';b.setAttribute('aria-label',x[1]);$('lxIco').appendChild(b)});
/* 成就 → 任務與成就面板（捲到成就） */
$('lxAch').onclick=function(){var m=$('bMiss');if(m)m.click();setTimeout(function(){var a=$('ach');if(a&&a.previousElementSibling)a.previousElementSibling.scrollIntoView({block:'start'})},60)};
/* 公會 → 原公會任務 */
$('lxGd').onclick=function(){var g=$('gdB');if(g)g.click()};
/* + → 免費籌碼 */
$('lxPlus').onclick=function(){var f=$('bFree');if(f)f.click()};
/* games tab: original wall (incl. 角色圖鑑 card) */
mv($('wall'),$('lxWallSlot'));
/* events tab: weekly calendar + banners + friends + marquee */
var ev=$('lxEvSlot');
mv(D.querySelector('.mqf'),ev);mv(D.querySelector('.wk'),ev);mv($('ivB'),ev);mv($('rdB'),ev);mv($('gdB'),ev);
var fr=$('bFr');
function proxyRow(slot,id,ico,t,s,go,target){var b=el('button','ivb lxRow');b.type='button';b.id=id;b.innerHTML='<span class="ive" aria-hidden="true">'+ico+'</span><span class="ivt"><b>'+t+'</b><small>'+s+'</small></span><span class="ivg">'+go+'</span>';
 b.onclick=function(){var x=typeof target==='function'?null:$(target);if(typeof target==='function')target();else if(x)x.click()};slot.appendChild(b);return b}
if(fr){proxyRow(ev,'lxFr','👥','好友互送','每天互送紅包・全回送再加碼','前往','bFr');fr.hidden=true;D.body.appendChild(fr)}
/* collect tab */
var col=$('lxColSlot');
var shopRow=el('div','lxShop');
shopRow.innerHTML='<div class="lxShopH"><img src="assets/lx/chest.webp'+V+'" alt="" width="420" height="295"><div><b>機台外觀商店</b><small id="lxSkN">以虛擬籌碼兌換限定機台外框・純裝飾，不影響機率</small></div></div><p class="lxShopP">選一台機台進入外觀商店（外觀全機台共用）：</p><div class="lxShopG">'+
 GAMES.map(function(g){return '<button type="button" data-shop="'+g.id+'" style="--bg:url(assets/'+g.id+'/p_idle.webp?v=256);--pos:'+g.pos+'"><span>'+g.n+'</span></button>'}).join('')+'</div>';
col.appendChild(shopRow);
shopRow.addEventListener('click',function(e){var b=e.target.closest('[data-shop]');if(!b)return;tap();try{SS.setItem('dfpOpenShop','1')}catch(_){}play(b.getAttribute('data-shop'))});
proxyRow(col,'lxGal','🎴','角色圖鑑','<span id="lxGalN"></span>','查看',function(){if(window.CZGAL)CZGAL.open()});
/* me tab */
var me=$('lxMeSlot');
mv($('lv'),me);
var st=el('div','lxStat');st.innerHTML='<div><small>虛擬籌碼</small><b id="lxSB">0</b></div><div><small>累積贏得</small><b id="lxSW">0</b></div><div><small>成就</small><b id="lxSA">0</b></div>';me.appendChild(st);
proxyRow(me,'lxMeLb','🏆','排行榜','依累積贏得虛擬籌碼排序','查看','bLb');
proxyRow(me,'lxMeAch','🎖️','任務與成就','每日任務・成就收藏','查看','bMiss');
proxyRow(me,'lxMeSet','⚙️','設定','音樂・音效・震動・減少動態效果','開啟','bBgm');
var ft=D.querySelector('.wrap .foot');mv(ft,me);
/* hide legacy shell (all live nodes we need were moved out) */
if(wrap)wrap.classList.add('lxOld');
/* ---------- carousel ---------- */
var sl=$('lxSl'),dots=$('lxDots');
sl.innerHTML=GAMES.map(function(g,i){return '<div class="lxS s-'+g.id+'" role="group" aria-roledescription="輪播" aria-label="'+(i+1)+' / 4：'+g.n+'"><div class="ph" style="background-image:url(assets/'+g.id+'/p_idle.webp?v=256)"></div><div class="rt"><b class="tt'+(g.n.length>4?' l5':'')+'">'+g.n+'</b><small>'+g.sub+'</small><button type="button" class="lxPlay" data-play="'+g.id+'">立即遊玩<i aria-hidden="true">▶</i></button></div></div>'}).join('');
dots.innerHTML=GAMES.map(function(g,i){return '<button type="button" aria-label="第 '+(i+1)+' 張：'+g.n+'"'+(i?'':' class="on"')+'></button>'}).join('');
var cur=0,auto=null,RMQ=matchMedia('(prefers-reduced-motion: reduce)').matches||D.documentElement.classList.contains('dfpRM');
function goS(i,sm){cur=(i+GAMES.length)%GAMES.length;sl.scrollTo({left:cur*sl.clientWidth,behavior:sm&&!RMQ?'smooth':'auto'});mark()}
function mark(){[].forEach.call(dots.children,function(d,k){d.classList.toggle('on',k===cur)})}
var stT;sl.addEventListener('scroll',function(){clearTimeout(stT);stT=setTimeout(function(){var i=Math.round(sl.scrollLeft/Math.max(1,sl.clientWidth));if(i!==cur){cur=i;mark()}},80)},{passive:true});
dots.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;goS([].indexOf.call(dots.children,b),1);restart()});
function restart(){clearInterval(auto);if(RMQ)return;auto=setInterval(function(){if(D.hidden||!$('lxHero').offsetParent)return;goS(cur+1,1)},5200)}
sl.addEventListener('pointerdown',function(){clearInterval(auto)},{passive:true});sl.addEventListener('pointerup',restart,{passive:true});
addEventListener('resize',function(){goS(cur,0)});
restart();
R.addEventListener('click',function(e){var p=e.target.closest('[data-play]');if(p){e.preventDefault();play(p.getAttribute('data-play'))}});
/* ---------- hot machines ---------- */
$('lxHot').innerHTML=GAMES.map(function(g){return '<a class="lxHc" href="'+g.id+'.html" data-play="'+g.id+'"><span class="ph" style="background-image:url(assets/'+g.id+'/p_idle.webp?v=256);background-position:'+g.pos+'"></span><b>'+g.n+'</b></a>'}).join('');
/* ---------- jackpot mirror (real pools; odometer already animates #jp0..2) ---------- */
function jpM(i){var s=$('jp'+i),t=$('lxJp'+i);if(!s||!t)return;var f=function(){t.textContent=s.textContent};f();new MutationObserver(f).observe(s,{childList:true,characterData:true,subtree:true})}
[0,1,2].forEach(jpM);
/* ---------- tabs ---------- */
var nav=$('lxNav');
function tab(t,noScroll){[].forEach.call(R.querySelectorAll('.lxTab'),function(s){s.classList.toggle('on',s.getAttribute('data-tab')===t)});
 [].forEach.call(nav.children,function(b){var on=b.getAttribute('data-tab')===t;b.classList.toggle('on',on);if(on)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
 try{SS.setItem('lxTab',t)}catch(e){}R.setAttribute('data-cur',t);if(!noScroll)scrollTo(0,0);if(t==='home'){goS(cur,0);setTimeout(fit,0)}sync()}
nav.addEventListener('click',function(e){var b=e.target.closest('button[data-tab]');if(!b)return;tap();tab(b.getAttribute('data-tab'))});
R.addEventListener('click',function(e){var b=e.target.closest('[data-go]');if(b){tap();tab(b.getAttribute('data-go'))}});
$('lxCol').onclick=function(){tap();tab('collect')};
$('lxMe').onclick=function(){tap();tab('me')};
$('lxMis').onclick=function(){var m=$('bMiss');if(m)m.click()};
$('lxEv').onclick=function(){var w=D.querySelector('.wkc[data-wd="'+new Date().getDay()+'"]');if(w)w.click();else tab('events')};
/* Android back: non-home tab → 首頁 */
var ob=window.dfpBack;if(typeof ob==='function')window.dfpBack=function(){if(!D.querySelector('dialog[open]')&&R.getAttribute('data-cur')!=='home'){tab('home');return true}return ob.apply(this,arguments)};
/* ---------- live state: badges, level, missions, countdown ---------- */
function has(id){var e=$(id);return !!(e&&e.classList.contains('has'))}
function setB(id,on,n){var e=$(id);if(!e)return;e.classList.toggle('on',!!on);e.textContent=on&&n?String(n):''}
function wkOpen(){try{return LS.getItem('dfp_wk')!==(function(){var d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()})()}catch(e){return false}}
function sync(){
 var s=CZ.st,v=CZ.vipOf(s.lv);$('lxLv').textContent='Lv.'+s.lv+' '+v[1];
 $('lxGd').classList.toggle('has',has('gdB'));
 var d=CZ.day(),M=CZ.MISS,cl=0,ready=0;M.forEach(function(m){if(d.cl[m.id])cl++;else if((m.id==='mach'?d.mach.length:d[m.id])>=m.g)ready++});
 $('lxMisN').textContent=cl+' / '+M.length;$('lxMisBar').style.width=(cl/M.length*100)+'%';setB('lxMisB',ready,ready);
 var w=$('wkTd');$('lxEvN').textContent=w&&w.textContent?w.textContent.replace(/・.*$/,''):'本週活動';setB('lxEvB',wkOpen(),0);
 var evHas=wkOpen()||has('ivB')||has('rdB')||has('gdB')||has('bFr');
 var nb=nav.querySelector('[data-tab="events"]');if(nb)nb.classList.toggle('has',evHas);
 $('lxSB').textContent=fmt(CZ.getBal());$('lxSW').textContent=fmt(s.won||0);
 var ac=0;for(var k in s.ach)if(s.ach[k])ac++;$('lxSA').textContent=ac+' / '+CZ.ACH.length;
 if(window.CZGAL&&$('lxGalN'))$('lxGalN').textContent='已收集 '+CZGAL.count()+' / '+CZGAL.total;
 var sk;try{sk=JSON.parse(LS.getItem('fs_skin')||'{}')}catch(e){sk={}}var own=Array.isArray(sk.own)?sk.own.filter(function(x){return x!=='gold'}).length:0;
 $('lxSkN').textContent=own?('已收藏 '+own+' 款限定外框・以虛擬籌碼兌換，純裝飾不影響機率'):'以虛擬籌碼兌換限定機台外框・純裝飾，不影響機率';
}
CZ.on(sync);
['bFree','bDaily','bMiss','gdB','ivB','rdB','bFr'].forEach(function(id){var e=$(id);if(e)new MutationObserver(sync).observe(e,{attributes:true,attributeFilter:['class']})});
function cd(){var n=new Date(),m=new Date(n);m.setHours(24,0,0,0);var l=Math.max(0,m-n),h=Math.floor(l/36e5),mi=Math.floor(l/6e4)%60,se=Math.floor(l/1e3)%60;
 $('lxEvT').textContent='剩餘 '+String(h).padStart(2,'0')+':'+String(mi).padStart(2,'0')+':'+String(se).padStart(2,'0')}
cd();setInterval(function(){if(!D.hidden){cd()}},1000);setInterval(function(){if(!D.hidden)sync()},15000);
D.addEventListener('close',function(){setTimeout(sync,30)},true);
addEventListener('pageshow',function(e){if(e.persisted)sync()});
var t0='home';try{t0=SS.getItem('lxTab')||'home'}catch(e){}tab(/^(home|games|events|collect|me)$/.test(t0)?t0:'home',1);
sync();

/* ---------- fit home to tall screens: give spare height to the hero & spacing ---------- */
function fit(){var h=R.querySelector('.lxTab[data-tab="home"]');if(!h||!h.classList.contains('on'))return;
 R.style.setProperty('--xh','0px');R.style.setProperty('--xg','0px');
 var nb=$('lxNav').getBoundingClientRect().top,last=$('lxCol').getBoundingClientRect().bottom+scrollY-scrollY;
 var spare=nb-last-10;if(spare<=0)return;
 var xh=Math.min(spare*.7,innerWidth*.42),xg=Math.min((spare-xh)/5,14);
 R.style.setProperty('--xh',Math.round(xh)+'px');R.style.setProperty('--xg',Math.max(0,Math.round(xg))+'px');goS(cur,0)}
addEventListener('resize',fit);addEventListener('load',fit);setTimeout(fit,0);
window.DFPlx={tab:tab,sync:sync,fit:fit};
})();
