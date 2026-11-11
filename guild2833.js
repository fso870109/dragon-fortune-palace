/* 龍運金殿 v28.69: 公會共同任務＋公會排行榜（連線公會；規則未發布時回退本機示範；純虛擬・無兌現） */
(function(){if(!window.CZ)return;var LS=localStorage,K='dfp_gd',KL='dfp_gd_live',$=function(i){return document.getElementById(i)};
var GN='金殿龍門會',MB=[['阿明',.9],['小美',.7],['阿傑',1.1],['佳佳',.6],['老王',.8]],GOAL=[300,600,1000],RW=[100,200,300];
var OG=[['招財進寶會',1.25],['夜市不打烊',1.05],['桃園金龍幫',.85],['櫻花斬一族',.7]];
function wk(){var d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-((d.getDay()+6)%7));return d}
function wkey(){var d=wk();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()}
function spins(){try{return (JSON.parse(LS.getItem('fs_stats')||'{}').spins)|0}catch(e){return 0}}
function st(){var s;try{s=JSON.parse(LS.getItem(K)||'{}')}catch(e){s={}}if(!s||s.w!==wkey()){s={w:wkey(),b:spins(),c:[0,0,0],j:s&&s.j?1:0};sv(s)}return s}
function sv(s){try{LS.setItem(K,JSON.stringify(s))}catch(e){}}
function lspins(){var a=spins(),b=0;try{b=(window.CZ&&CZ.st&&CZ.st.spins)|0}catch(e){}return Math.max(a,b,0)}
function lst(){var s;try{s=JSON.parse(LS.getItem(KL)||'{}')}catch(e){s={}}var w=(window.DFPfb&&DFPfb.weekKey)?DFPfb.weekKey():wkey();if(!s||s.w!==w){s={w:w,b:lspins(),c:[0,0,0]};lsv(s)}if(!Array.isArray(s.c))s.c=[0,0,0];return s}
function lsv(s){try{LS.setItem(KL,JSON.stringify(s))}catch(e){}}
function lmine(){return Math.max(0,lspins()-lst().b)}
function snd(n){try{window.sfx&&window.sfx(n)}catch(e){}}
function hrs(){return Math.max(0,(Date.now()-wk().getTime())/3600000)}
function mine(s){return Math.max(0,spins()-s.b)}
function demo(r){return Math.floor(Math.min(hrs(),168)*r*.5)}
function total(s){var t=mine(s);MB.forEach(function(m){t+=demo(m[1])});return t}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function faceAv(av,n){return window.DFPface?DFPface(av,n):((n||'?').slice(0,1))}
var anc=$('rdB')||$('ivB')||document.querySelector('.wk')||document.querySelector('.top');if(!anc)return;
var bn=document.createElement('button');bn.className='ivb gdb';bn.id='gdB';bn.innerHTML='<span class="ive" aria-hidden="true"><img src="assets/lx/ev_castle.webp?v=2848" alt="" width="128" height="128"></span><span class="ivt"><b>公會任務</b><small id="gdBs"></small></span><span class="ivg">共闖</span>';
anc.parentNode.insertBefore(bn,anc.nextSibling);
var d=document.createElement('dialog');d.id='dGd';d.setAttribute('aria-labelledby','gdT');
d.innerHTML='<h3 id="gdT">公會・'+GN+'</h3><p class="gdx" id="gdW">目前離線，顯示本機示範資料</p>'+
'<div class="gdme" id="gdMe"><span class="gdfav" id="gdMeAv" aria-hidden="true"></span><div class="n"><b id="gdGName"></b><small>公會碼 <b id="gdCode"></b> <button type="button" class="btn gdcp" id="gdCopy">複製</button> <button type="button" class="btn" id="gdLeave">退出公會</button></small></div></div>'+
'<div class="gdjoin" id="gdJoin"><label class="sr" for="gdName">公會名稱</label><input id="gdName" maxlength="12" autocomplete="off" spellcheck="false" placeholder="替公會取個名字">'+
'<button type="button" class="btn hot" id="gdCreate">建立公會</button>'+
'<label class="sr" for="gdIn">公會碼</label><input id="gdIn" maxlength="12" autocomplete="off" spellcheck="false" placeholder="輸入公會碼 GD-······">'+
'<button type="button" class="btn hot" id="gdJoinB">加入</button></div>'+
'<div class="gdq"><div class="gdqt"><b>本週共同任務：全會轉動</b><span id="gdN"></span></div><div class="gdbar"><i id="gdF"></i>'+GOAL.map(function(g,i){return '<em style="left:'+(g/GOAL[2]*100)+'%"></em>'}).join('')+'</div><div class="gdtr" id="gdR"></div></div>'+
'<div class="gdtab"><button class="btn hot" data-tb="0">會員貢獻</button><button class="btn" data-tb="1">公會排行</button></div><ol class="gdl" id="gdL"></ol><p class="ivm" id="gdM" role="status"></p>'+
'<p class="note">在任一機台轉動都會累積你的貢獻，每週一 0 點重置<br>共同任務只計轉動次數，不影響機台機率<br>虛擬籌碼僅供娛樂・純虛擬・無兌現・不可轉讓或交易</p><div class="frs"><button class="btn" id="gdP">去轉動</button><button class="btn close" id="gdX">關閉</button></div>';
document.body.appendChild(d);var tab=0,live=false,busy=0,guild=null,members=[],gBoard=[];
function renderDemo(){var s=st(),t=total(s),me=mine(s),can=0;
 $('gdN').textContent=Math.min(t,GOAL[2])+' / '+GOAL[2]+' 轉';$('gdF').style.width=Math.min(100,t/GOAL[2]*100)+'%';
 $('gdR').innerHTML=GOAL.map(function(g,i){var ok=t>=g,got=s.c[i];if(ok&&!got)can++;return '<button class="btn'+(ok&&!got?' hot':'')+'" data-cl="'+i+'"'+(ok&&!got?'':' disabled')+'><small>'+g+' 轉</small>'+(got?'已領取':'＋'+RW[i])+'</button>'}).join('');
 var rows;if(!tab){rows=MB.map(function(m){return [m[0],demo(m[1]),0]});rows.push(['我',me,1])}else{rows=OG.map(function(g){return [g[0],Math.floor(Math.min(hrs(),168)*g[1]*3),0]});rows.push([GN,t,1])}
 rows.sort(function(a,b){return b[1]-a[1]});
 $('gdL').innerHTML=rows.map(function(r,i){return '<li class="'+(r[2]?'me':'')+'"><span class="gdk'+(i<3?' rk'+(i+1):'')+'">'+(i+1)+'</span><b>'+r[0]+'</b><span>'+r[1]+' 轉</span></li>'}).join('');
 d.querySelectorAll('[data-tb]').forEach(function(b){b.classList.toggle('hot',+b.getAttribute('data-tb')===tab)});
 $('gdBs').textContent=can?('共同任務達標，'+can+' 份獎勵可領！'):('全會 '+Math.min(t,GOAL[2])+'／'+GOAL[2]+' 轉・我貢獻 '+me);
 bn.classList.toggle('has',can>0)}
function paintGuild(){
  d.classList.toggle('in',!!(live&&guild));
  d.classList.toggle('out',!!(live&&!guild));
  if(!live)return;
  if(guild){
    $('gdT').textContent='公會・'+guild.name;
    $('gdGName').textContent=guild.name||'';
    $('gdCode').textContent=guild.code||guild.id||'';
    var me=window.DFPfb&&DFPfb.profile;
    $('gdMeAv').innerHTML=me?faceAv(me.avatar,me.displayName):'';
  }else{
    $('gdT').textContent='公會';
  }
}
function renderLive(){
  var s=lst(),me=lmine(),t=0,can=0,uid=window.DFPfb&&DFPfb.user&&DFPfb.user.uid;
  if(guild&&members.length){members.forEach(function(m){if(m.weekKey===s.w)t+=(m.weekSpins|0)})}
  $('gdN').textContent=guild?(Math.min(t,GOAL[2])+' / '+GOAL[2]+' 轉'):'加入公會後一起累積';
  $('gdF').style.width=guild?Math.min(100,t/GOAL[2]*100)+'%':'0%';
  $('gdR').innerHTML=GOAL.map(function(g,i){var ok=!!guild&&t>=g,got=s.c[i];if(ok&&!got)can++;return '<button class="btn'+(ok&&!got?' hot':'')+'" data-cl="'+i+'"'+(ok&&!got?'':' disabled')+'><small>'+g+' 轉</small>'+(got?'已領取':'＋'+RW[i])+'</button>'}).join('');
  var rows,html;
  if(!tab){
    if(!guild) html='<li class="gde">還沒有加入公會。建立一個，或輸入朋友的公會碼。</li>';
    else if(!members.length) html='<li class="gde">還沒有會員資料</li>';
    else{
      rows=members.map(function(m){return {n:m.displayName||'旅人',av:m.avatar,sp:m.weekKey===s.w?(m.weekSpins|0):0,me:m.uid===uid}});
      rows.sort(function(a,b){return b.sp-a.sp});
      html=rows.map(function(r,i){return '<li class="'+(r.me?'me':'')+'"><span class="gdk'+(i<3?' rk'+(i+1):'')+'">'+(i+1)+'</span><span class="gav">'+faceAv(r.av,r.n)+'</span><b>'+esc(r.n)+(r.me?'（你）':'')+'</b><span>'+r.sp+' 轉</span></li>'}).join('');
    }
  }else{
    if(!gBoard.length) html='<li class="gde">本週尚無公會上榜，和夥伴多轉幾手再來看。</li>';
    else html=gBoard.map(function(g,i){var meG=guild&&(g.gid===guild.id||g.gid===guild.code);return '<li class="'+(meG?'me':'')+'"><span class="gdk'+(i<3?' rk'+(i+1):'')+'">'+(i+1)+'</span><b>'+esc(g.name||'公會')+(meG?'（我的公會）':'')+'</b><span>'+(g.spins|0)+' 轉</span></li>'}).join('');
  }
  $('gdL').innerHTML=html;
  d.querySelectorAll('[data-tb]').forEach(function(b){b.classList.toggle('hot',+b.getAttribute('data-tb')===tab)});
  if(!guild)$('gdBs').textContent='連線公會・建立或加入後可一起衝任務';
  else $('gdBs').textContent=can?('共同任務達標，'+can+' 份獎勵可領！'):('全會 '+Math.min(t,GOAL[2])+'／'+GOAL[2]+' 轉・我貢獻 '+me);
  bn.classList.toggle('has',can>0);
  paintGuild();
}
function render(){if(live)renderLive();else renderDemo()}
function refreshLive(){
  if(!live||!window.DFPfb||!DFPfb.guildsOk)return Promise.resolve();
  var xr=(window.DFPstat&&DFPstat._best)||0;
  return DFPfb.reportStats({weekSpins:lmine(),bestXr:xr}).catch(function(){})
    .then(function(){return Promise.all([
      DFPfb.getGuild().catch(function(){return null}),
      DFPfb.listMembers().catch(function(){return []}),
      DFPfb.listGuildBoard().catch(function(){return []})
    ])})
    .then(function(x){
      guild=x[0];members=x[1]||[];gBoard=x[2]||[];
      if(window.DFPfb&&DFPfb.profile&&!DFPfb.profile.guildId)guild=null;
      renderLive();
    }).catch(function(){renderLive()});
}
function gmsg(t){var e=$('gdM');if(e)e.textContent=t||''}
$('gdR').onclick=function(e){var b=e.target.closest('[data-cl]');if(!b||b.disabled)return;
  if(live){
    var s=lst(),i=+b.getAttribute('data-cl'),t=0;
    if(guild&&members.length)members.forEach(function(m){if(m.weekKey===s.w)t+=(m.weekSpins|0)});
    if(s.c[i]||t<GOAL[i])return;s.c[i]=1;lsv(s);CZ.addChips(RW[i]);CZ.vib(25);snd(2);
    gmsg('公會任務 '+GOAL[i]+' 轉達標！＋'+RW[i]);CZ.toast('公會獎勵 ＋'+RW[i],'assets/lx/ev_castle.webp?v=2848');try{CZ.track&&CZ.track('gd')}catch(e){}renderLive();return;
  }
  var s=st(),i=+b.getAttribute('data-cl');if(s.c[i]||total(s)<GOAL[i])return;s.c[i]=1;sv(s);CZ.addChips(RW[i]);CZ.vib(25);snd(2);$('gdM').textContent='公會任務 '+GOAL[i]+' 轉達標！＋'+RW[i];CZ.toast('公會獎勵 ＋'+RW[i],'assets/lx/ev_castle.webp?v=2848');try{CZ.track&&CZ.track('gd')}catch(e){}render()};
d.querySelector('.gdtab').onclick=function(e){var b=e.target.closest('[data-tb]');if(!b)return;tab=+b.getAttribute('data-tb');snd(1);render()};
$('gdCreate').onclick=function(){
  if(!live||busy)return;var name=$('gdName').value.trim().slice(0,12);if(!name){gmsg('請先替公會取個名字');return}
  busy=1;gmsg('正在建立…');
  DFPfb.createGuild(name).then(function(g){
    busy=0;$('gdName').value='';gmsg('已建立公會 '+g.name);snd(2);CZ.vib(10);refreshLive();
  }).catch(function(e){busy=0;var k=e&&e.message;gmsg(k==='already-in'?'你已經在公會裡了':k==='bad-name'?'名稱請在 1～12 字以內':'建立沒有成功，請稍後再試')})};
$('gdJoinB').onclick=function(){
  if(!live||busy)return;var code=$('gdIn').value;if(!code){gmsg('請輸入公會碼');return}
  busy=1;gmsg('正在加入…');
  DFPfb.joinGuild(code).then(function(g){
    busy=0;$('gdIn').value='';gmsg('已加入 '+(g.name||'公會'));snd(2);CZ.vib(10);refreshLive();
  }).catch(function(e){busy=0;var k=e&&e.message;gmsg(k==='already-in'?'你已經在公會裡了':k==='bad-code'?'公會碼格式不對':k==='not-found'?'找不到這個公會碼':k==='full'?'這個公會已經滿了':'加入沒有成功，請稍後再試')})};
$('gdLeave').onclick=function(){
  if(!live||busy||!guild)return;busy=1;gmsg('正在退出…');
  DFPfb.leaveGuild().then(function(){
    busy=0;guild=null;members=[];gmsg('已退出公會');snd(1);refreshLive();
  }).catch(function(){busy=0;gmsg('退出沒有成功，請稍後再試')})};
$('gdCopy').onclick=async function(){
  var c=$('gdCode').textContent||'';if(!c)return;
  try{await navigator.clipboard.writeText(c);gmsg('已複製公會碼 '+c)}catch(e){gmsg('請長按公會碼手動複製')}
};
bn.onclick=function(){snd(1);CZ.vib(8);render();d.showModal();if(live)refreshLive()};$('gdX').onclick=function(){snd(1);d.close()};
$('gdP').onclick=function(){var m=['matsuri','samurai','neko','sakura'];location.href=(m[(new Date().getDay()+3)%4])+'.html'};
render();
function goLive(){
  if(!window.DFPfb||!DFPfb.ready)return false;
  DFPfb.ready.then(function(ok){
    if(!ok||!DFPfb.guildsOk)return;
    live=true;d.classList.add('fb');
    $('gdW').textContent='連線公會：和夥伴一起累積轉動，達標獎勵只進本機';
    paintGuild();refreshLive();
  }).catch(function(){});
  return true;
}
if(!goLive()){var n=0,iv=setInterval(function(){if(goLive()||++n>80)clearInterval(iv)},50)}
window.DFPgd={render:render,refresh:refreshLive,total:function(){return live?(function(){var t=0,w=lst().w;members.forEach(function(m){if(m.weekKey===w)t+=(m.weekSpins|0)});return t})():total(st())}};
window.DFPlb={
  renderLive:function(){
    if(!window.DFPfb||!DFPfb.guildsOk)return false;
    var box=$('lbt'),warn=document.querySelector('#dLb .warn'),note=document.querySelector('#dLb .note');
    if(!box)return false;
    if(warn)warn.textContent='本週全服榜：依轉動次數排序，不含籌碼';
    if(note)note.textContent='展示用數據，每週一 0 點（台北）重置・純虛擬・無兌現';
    box.innerHTML='<tr><td colspan="3">讀取中…</td></tr>';
    var xr=(window.DFPstat&&DFPstat._best)||0;
    DFPfb.reportStats({weekSpins:lmine(),bestXr:xr}).catch(function(){})
      .then(function(){return DFPfb.listPlayerBoard()})
      .then(function(rows){
        if(!rows||!rows.length){box.innerHTML='<tr><td colspan="3">本週尚無榜上玩家，玩幾轉後再來看。</td></tr>';return}
        var uid=DFPfb.user&&DFPfb.user.uid;
        box.innerHTML=rows.map(function(r,i){
          var me=r.uid===uid;
          var nm=esc(r.displayName||'旅人')+(me?'（你）':'');
          var av=faceAv(r.avatar,r.displayName);
          var x=Number(r.bestXr);if(!isFinite(x)||x<=0)x=0;
          var xs=x?(' · 最高 '+(Math.round(x*10)/10)+'×'):'';
          return '<tr class="'+(me?'me':'')+'"><td>'+(i+1)+'</td><td><span class="fav">'+av+'</span> '+nm+'</td><td>'+((r.weekSpins)|0)+' 轉'+xs+'</td></tr>';
        }).join('');
      }).catch(function(){box.innerHTML='<tr><td colspan="3">榜單暫時讀不到</td></tr>'});
    return true;
  }
};
})();
