/* 龍運金殿 v28.33: 公會共同任務＋公會排行榜（本機示範；純虛擬・無兌現） */
(function(){if(!window.CZ)return;var LS=localStorage,K='dfp_gd',$=function(i){return document.getElementById(i)};
var GN='金殿龍門會',MB=[['阿明',.9],['小美',.7],['阿傑',1.1],['佳佳',.6],['老王',.8]],GOAL=[300,600,1000],RW=[100,200,300];
var OG=[['招財進寶會',1.25],['夜市不打烊',1.05],['桃園金龍幫',.85],['櫻花斬一族',.7]];
function wk(){var d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-((d.getDay()+6)%7));return d}
function wkey(){var d=wk();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()}
function spins(){try{return (JSON.parse(LS.getItem('fs_stats')||'{}').spins)|0}catch(e){return 0}}
function st(){var s;try{s=JSON.parse(LS.getItem(K)||'{}')}catch(e){s={}}if(!s||s.w!==wkey()){s={w:wkey(),b:spins(),c:[0,0,0],j:s&&s.j?1:0};sv(s)}return s}
function sv(s){try{LS.setItem(K,JSON.stringify(s))}catch(e){}}
function snd(n){try{window.sfx&&window.sfx(n)}catch(e){}}
function hrs(){return Math.max(0,(Date.now()-wk().getTime())/3600000)}
function mine(s){return Math.max(0,spins()-s.b)}
function demo(r){return Math.floor(Math.min(hrs(),168)*r*.5)}
function total(s){var t=mine(s);MB.forEach(function(m){t+=demo(m[1])});return t}
var anc=$('rdB')||$('ivB')||document.querySelector('.wk')||document.querySelector('.top');if(!anc)return;
var bn=document.createElement('button');bn.className='ivb gdb';bn.id='gdB';bn.innerHTML='<span class="ive" aria-hidden="true">🏯</span><span class="ivt"><b>公會任務</b><small id="gdBs"></small></span><span class="ivg">共闖</span>';
anc.parentNode.insertBefore(bn,anc.nextSibling);
var d=document.createElement('dialog');d.id='dGd';d.setAttribute('aria-labelledby','gdT');
d.innerHTML='<h3 id="gdT">公會・'+GN+'</h3><p class="gdx">示範公會：本機示範，連線公會準備中</p>'+
'<div class="gdq"><div class="gdqt"><b>本週共同任務：全會轉動</b><span id="gdN"></span></div><div class="gdbar"><i id="gdF"></i>'+GOAL.map(function(g,i){return '<em style="left:'+(g/GOAL[2]*100)+'%"></em>'}).join('')+'</div><div class="gdtr" id="gdR"></div></div>'+
'<div class="gdtab"><button class="btn hot" data-tb="0">會員貢獻</button><button class="btn" data-tb="1">公會排行</button></div><ol class="gdl" id="gdL"></ol><p class="ivm" id="gdM" role="status"></p>'+
'<p class="note">在任一機台轉動都會累積你的貢獻，每週一 0 點重置<br>共同任務只計轉動次數，不影響機台機率<br>虛擬籌碼僅供娛樂・純虛擬・無兌現・不可轉讓或交易</p><div class="frs"><button class="btn" id="gdP">去轉動</button><button class="btn close" id="gdX">關閉</button></div>';
document.body.appendChild(d);var tab=0;
function render(){var s=st(),t=total(s),me=mine(s),can=0;
 $('gdN').textContent=Math.min(t,GOAL[2])+' / '+GOAL[2]+' 轉';$('gdF').style.width=Math.min(100,t/GOAL[2]*100)+'%';
 $('gdR').innerHTML=GOAL.map(function(g,i){var ok=t>=g,got=s.c[i];if(ok&&!got)can++;return '<button class="btn'+(ok&&!got?' hot':'')+'" data-cl="'+i+'"'+(ok&&!got?'':' disabled')+'><small>'+g+' 轉</small>'+(got?'已領取':'＋'+RW[i])+'</button>'}).join('');
 var rows;if(!tab){rows=MB.map(function(m){return [m[0],demo(m[1]),0]});rows.push(['我',me,1])}else{rows=OG.map(function(g){return [g[0],Math.floor(Math.min(hrs(),168)*g[1]*3),0]});rows.push([GN,t,1])}
 rows.sort(function(a,b){return b[1]-a[1]});
 $('gdL').innerHTML=rows.map(function(r,i){return '<li class="'+(r[2]?'me':'')+'"><span class="gdk">'+(i<3?['🥇','🥈','🥉'][i]:(i+1))+'</span><b>'+r[0]+'</b><span>'+r[1]+' 轉</span></li>'}).join('');
 d.querySelectorAll('[data-tb]').forEach(function(b){b.classList.toggle('hot',+b.getAttribute('data-tb')===tab)});
 $('gdBs').textContent=can?('共同任務達標，'+can+' 份獎勵可領！'):('全會 '+Math.min(t,GOAL[2])+'／'+GOAL[2]+' 轉・我貢獻 '+me);
 bn.classList.toggle('has',can>0)}
$('gdR').onclick=function(e){var b=e.target.closest('[data-cl]');if(!b||b.disabled)return;var s=st(),i=+b.getAttribute('data-cl');if(s.c[i]||total(s)<GOAL[i])return;s.c[i]=1;sv(s);CZ.addChips(RW[i]);CZ.vib(25);snd(2);$('gdM').textContent='🏯 公會任務 '+GOAL[i]+' 轉達標！＋'+RW[i];CZ.toast('🏯 公會獎勵 ＋'+RW[i]);render()};
d.querySelector('.gdtab').onclick=function(e){var b=e.target.closest('[data-tb]');if(!b)return;tab=+b.getAttribute('data-tb');snd(1);render()};
bn.onclick=function(){snd(1);CZ.vib(8);render();d.showModal()};$('gdX').onclick=function(){snd(1);d.close()};
$('gdP').onclick=function(){var m=['matsuri','samurai','neko','sakura'];location.href=(m[(new Date().getDay()+3)%4])+'.html'};
render();window.DFPgd={render:render,total:function(){return total(st())}}})();
