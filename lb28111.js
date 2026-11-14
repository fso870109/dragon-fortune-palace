/* v28.114 — 金殿排行榜
   系統角色只在本機畫面合併，絕不寫入 Firestore。 */
(function(){
  var AVQ='?v=2878';
  var NPCS=[
    {id:'npc-jinlong',  n:'金龍貴賓', av:'av_a', won:2680000, sp:162},
    {id:'npc-jinyi',    n:'錦衣公子', av:'av_b', won:2210000, sp:148},
    {id:'npc-fengque',  n:'鳳闕佳賓', av:'av_c', won:1875000, sp:136},
    {id:'npc-dianqian', n:'殿前花使', av:'av_d', won:1640000, sp:128},
    {id:'npc-jinluan',  n:'金鑾貴人', av:'av_e', won:1428000, sp:118},
    {id:'npc-honglou',  n:'紅樓嘉賓', av:'av_f', won:1260000, sp:109},
    {id:'npc-qionglou', n:'瓊樓貴客', av:'av_g', won:1095000, sp:98},
    {id:'npc-huatang',  n:'華堂君子', av:'av_h', won:942000,  sp:88},
    {id:'npc-zhumen',   n:'朱門雅士', av:'av_i', won:815000,  sp:79},
    {id:'npc-mensheng', n:'金殿門生', av:'av_j', won:698000,  sp:71},
    {id:'npc-yujie',    n:'御街訪客', av:'av_k', won:584000,  sp:63},
    {id:'npc-xiangyun', n:'祥雲客',   av:'av_l', won:486000,  sp:55},
    {id:'npc-yujie2',   n:'玉階客',   av:'av_a', won:392000,  sp:47},
    {id:'npc-danchi',   n:'丹墀旅人', av:'av_c', won:318000,  sp:41},
    {id:'npc-longmen',  n:'龍門過客', av:'av_e', won:246000,  sp:34},
    {id:'npc-jinjie',   n:'金階仕女', av:'av_g', won:188000,  sp:28},
    {id:'npc-yuelang',  n:'月廊旅人', av:'av_i', won:136000,  sp:22},
    {id:'npc-gongdeng', n:'宮燈客',   av:'av_k', won:92000,   sp:16}
  ];

  function $(id){return document.getElementById(id)}
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function fmt(n){return Math.round(Number(n)||0).toLocaleString('zh-Hant-TW')}
  function avSrc(id){
    if(/^https:/.test(id||'')) return id;
    var k=/^av_[a-l]$/.test(id||'')?id:'av_a';
    return 'assets/lx/'+k+'.webp'+AVQ;
  }
  function myName(){
    try{if(window.DFPname&&typeof DFPname.get==='function'){var n=DFPname.get();if(n)return String(n).slice(0,12)}}catch(e){}
    try{if(window.DFPfb&&DFPfb.profile&&DFPfb.profile.displayName)return String(DFPfb.profile.displayName).slice(0,12)}catch(e){}
    try{var st=JSON.parse(localStorage.getItem('fs_stats')||'{}');if(st.name)return String(st.name).slice(0,12)}catch(e){}
    return '你';
  }
  function myAvatar(){
    try{if(window.DFPfb&&typeof DFPfb.currentAvatar==='function'){var a=DFPfb.currentAvatar();if(a)return a}}catch(e){}
    try{if(window.DFPav&&typeof DFPav.current==='function'){var a=DFPav.current();if(a)return a}}catch(e){}
    try{var s=JSON.parse(localStorage.getItem('dfp_profile')||'{}');if(s&&s.avatar)return s.avatar}catch(e){}
    return 'av_a';
  }
  function myWon(){try{return (window.CZ&&CZ.st&&CZ.st.won)||0}catch(e){return 0}}
  function weekMine(){
    try{
      var a=0,b=0;
      try{a=(JSON.parse(localStorage.getItem('fs_stats')||'{}').spins)|0}catch(e){}
      try{b=(window.CZ&&CZ.st&&CZ.st.spins)|0}catch(e){}
      var sp=Math.max(a,b,0), base=0;
      try{var kl=JSON.parse(localStorage.getItem('dfp_gd_live')||'{}');base=(kl&&kl.b)|0}catch(e){}
      return Math.max(0,sp-base);
    }catch(e){return 0}
  }

  var MEDQ='?v=28114';
  function medal(rank){
    if(rank===1||rank===2||rank===3){
      return '<img class="lbMedal" src="assets/lx/medal'+rank+'.webp'+MEDQ+'" alt="'+rank+'" width="80" height="80">';
    }
    return '<span>'+rank+'</span>';
  }
  function face(av){
    var src='';
    try{if(window.DFPfb&&typeof DFPfb.avatarSrc==='function')src=DFPfb.avatarSrc(av)}catch(e){}
    if(!src) src=avSrc(av);
    var extra=/^https:/.test(src)?' referrerpolicy="no-referrer"':'';
    return '<img src="'+esc(src)+'" alt="" width="44" height="44"'+extra+' onerror="this.onerror=null;this.src=\'assets/lx/av_a.webp'+AVQ+'\'">';
  }
  function emptySvg(){
    return '<svg viewBox="0 0 72 72" aria-hidden="true"><rect x="10" y="18" width="52" height="40" rx="6" fill="#2a1020" stroke="#d9a441" stroke-width="1.6"/><path d="M16 18c4 8 16 8 20 0 4 8 16 8 20 0" fill="none" stroke="#e8c56a" stroke-width="1.6"/><path d="M24 40h24M28 46h16" stroke="#cbb7c9" stroke-width="1.6" stroke-linecap="round"/><path d="M36 8l3 7 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1z" fill="#e8c56a" stroke="#8a5a18" stroke-width="1"/></svg>';
  }

  function rowHtml(r, i){
    var rank=i+1;
    var cls='lbRow'+(rank===1?' top1':rank===2?' top2':rank===3?' top3':'')+(r.me?' me':'');
    var badge=r.npc?'<span class="lbBadge">金殿貴賓</span>':'';
    var unit=r.unit?('<span class="lbUnit">'+esc(r.unit)+'</span>'):'';
    var av=r.av||'av_a';
    var img=face(av);
    var shown=r.n;
    try{if(window.DFPname&&typeof DFPname.display==='function')shown=DFPname.display(r.n)}catch(e){}
    return '<li class="'+cls+'"'+(r.npc?' data-npc="1"':'')+'>'+
      '<span class="lbRank">'+medal(rank)+'</span>'+
      '<span class="lbAv">'+img+'</span>'+
      '<span class="lbWho"><strong>'+esc(shown)+(r.me&&shown!=='你'?'（你）':'')+'</strong>'+badge+'</span>'+
      '<span class="lbScore">'+esc(r.scoreLabel)+unit+'</span>'+
    '</li>';
  }

  function decorate(){
    var d=$('dLb'); if(!d) return;
    d.classList.add('lbDlg');
    var h=d.querySelector('h3');
    if(h && !h.querySelector('.lbCrest')){
      h.insertAdjacentHTML('afterbegin','<i class="lbCrest" aria-hidden="true"></i>');
    }
    var warn=d.querySelector('.warn');
    if(warn) warn.classList.add('lbSub');
    var note=d.querySelector('.note');
    if(note) note.classList.add('lbFoot');
  }

  function paint(rows, meta){
    decorate();
    var d=$('dLb'), box=$('lbt');
    if(!d||!box) return;
    var warn=d.querySelector('.warn, .lbSub');
    var note=d.querySelector('.note, .lbFoot');
    if(warn) warn.textContent=meta.sub;
    if(note) note.innerHTML='<b>標示金殿貴賓者為系統角色</b><br>'+esc(meta.note)+'・僅供娛樂・純虛擬・無兌現';
    if(box.tagName==='TABLE'){
      var div=document.createElement('div');
      div.id='lbt';
      box.parentNode.replaceChild(div, box);
      box=div;
    }
    box.className='lbList';
    if(!rows.length){
      box.innerHTML='<div class="lbEmpty">'+emptySvg()+'<span>金殿榜上尚無旅人</span><small>轉動幾回再來看看・純虛擬・無兌現</small></div>';
      return;
    }
    box.innerHTML='<ol class="lbList" style="overflow:visible;flex:none;padding:0;margin:0">'+rows.map(rowHtml).join('')+'</ol>';
    // keep scroll on the outer #lbt
    box.querySelector('ol').classList.remove('lbList');
    box.querySelector('ol').style.cssText='list-style:none;margin:0;padding:0';
  }

  function paintLocal(){
    var me={id:'me', n:myName(), av:myAvatar(), score:myWon(), scoreLabel:fmt(myWon()), unit:'籌碼', me:1, npc:0};
    var rows=NPCS.map(function(p){return {id:p.id,n:p.n,av:p.av,score:p.won,scoreLabel:fmt(p.won),unit:'籌碼',me:0,npc:1}});
    rows.push(me);
    rows.sort(function(a,b){return b.score-a.score || (a.me?1:0)-(b.me?1:0)});
    paint(rows,{
      sub:'本機榜・依累積贏得虛擬籌碼排序',
      note:'依累積贏得虛擬籌碼排序'
    });
  }

  function paintLive(serverRows){
    var uid=(window.DFPfb&&DFPfb.user&&DFPfb.user.uid)||'';
    var seen={};
    var rows=[];
    (serverRows||[]).forEach(function(r){
      if(!r||!r.uid||String(r.uid).indexOf('npc-')===0)return;
      if(seen[r.uid])return; seen[r.uid]=1;
      var me=r.uid===uid;
      rows.push({
        id:r.uid, n:r.displayName|| (me?myName():'旅人'), av:r.avatar||'av_a',
        score:r.weekSpins|0,
        scoreLabel:String(r.weekSpins|0),
        unit:'轉', me:me?1:0, npc:0,
        xr:Number(r.bestXr)
      });
    });
    if(uid && !seen[uid]){
      rows.push({id:uid,n:myName(),av:myAvatar(),score:weekMine(),scoreLabel:String(weekMine()),unit:'轉',me:1,npc:0});
    }
    NPCS.forEach(function(p){
      rows.push({id:p.id,n:p.n,av:p.av,score:p.sp,scoreLabel:String(p.sp),unit:'轉',me:0,npc:1});
    });
    rows.sort(function(a,b){return b.score-a.score || (a.me?1:0)-(b.me?1:0)});
    paint(rows,{
      sub:'本週全服榜・依轉動次數排序，不含籌碼',
      note:'本週轉動次數（台北週一 0 點重置）'
    });
  }

  function wrapLive(){
    if(!window.DFPlb||typeof DFPlb.renderLive!=='function'||DFPlb._p28111)return;
    DFPlb._p28111=1;
    DFPlb.renderLive=function(){
      if(!window.DFPfb||!DFPfb.guildsOk)return false;
      decorate();
      var box=$('lbt');
      if(box){if(box.tagName==='TABLE'){var div=document.createElement('div');div.id='lbt';box.parentNode.replaceChild(div,box);box=div}box.className='lbList';box.innerHTML='<div class="lbEmpty"><span>讀取全服榜…</span></div>'}
      var xr=(window.DFPstat&&DFPstat._best)||0;
      var payload={bestXr:xr};
      try{payload.weekSpins=weekMine()}catch(e){}
      DFPfb.reportStats(payload).catch(function(){})
        .then(function(){return DFPfb.listPlayerBoard()})
        .then(function(rows){paintLive(rows||[])})
        .catch(function(){paintLocal()});
      return true;
    };
  }

  function onOpen(){
    wrapLive();
    decorate();
    var usedLive=false;
    try{if(window.DFPlb&&DFPlb.renderLive)usedLive=!!DFPlb.renderLive()}catch(e){}
    if(!usedLive)paintLocal();
  }

  function hook(){
    wrapLive();
    decorate();
    var btn=$('bLb');
    if(btn && !btn.dataset.p28111){
      btn.dataset.p28111='1';
      btn.addEventListener('click',function(){setTimeout(onOpen,0)});
    }
    var d=$('dLb');
    if(d && !d.dataset.p28111t){
      d.dataset.p28111t='1';
      d.addEventListener('toggle',function(){if(d.open)onOpen()});
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',hook);
  else hook();
  addEventListener('load',function(){wrapLive();hook()});
})();
