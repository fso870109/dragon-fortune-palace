/* v28.117 chat preview: limited lobby chat (fixed phrase / sticker ids only, no free text)
   + lobby big-win marquee. NPC hosts are client-only, never written to Firestore, always labelled.
   Sticker packs are structured so the skin shop can sell more packs later. Play money only. */
(function(){
  'use strict';
  var D=document, Q='?v=28117', COOL=8, LS=localStorage;
  function $(id){return D.getElementById(id)}
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function fmt(n){return Math.round(Number(n)||0).toLocaleString('zh-Hant-TW')}
  function J(k,d){try{var v=JSON.parse(LS.getItem(k));return v==null?d:v}catch(e){return d}}
  function S(k,v){try{LS.setItem(k,JSON.stringify(v))}catch(e){}}
  function dayId(){try{return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}catch(e){var d=new Date(Date.now()+288e5);return d.toISOString().slice(0,10)}}
  function rm(){return D.documentElement.classList.contains('dfpRM')||(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)}

  /* ---------- fixed phrases and stickers ---------- */
  var PHRASES={
    p01:'大家好！',
    p02:'恭喜大獎！',
    p03:'一起衝！',
    p04:'手氣真旺',
    p05:'再來一把',
    p06:'謝謝送禮',
    p07:'歡迎光臨金殿',
    p08:'好運連連',
    p09:'祝你鴻運當頭',
    p10:'加入公會一起玩',
    p11:'休息一下',
    p12:'晚安各位'
  };
  var P_ORDER=['p01','p02','p03','p04','p05','p06','p07','p08','p09','p10','p11','p12'];
  /* sticker packs: shop can add {id,name,price,items}; packOwned() gates use */
  var PACKS=[
    {id:'base',name:'金殿基本組',price:0,items:[
      {id:'s01',n:'金龍賀喜'},{id:'s02',n:'招財貓'},{id:'s03',n:'元寶滿滿'},{id:'s04',n:'紅包讚'},
      {id:'s05',n:'花火綻放'},{id:'s06',n:'錦鯉好運'},{id:'s07',n:'金龍抱拳'},{id:'s08',n:'晚安月兒'}
    ]}
  ];
  var STK={};PACKS.forEach(function(p){p.items.forEach(function(it){STK[it.id]={n:it.n,pack:p.id}})});
  function packOwned(pid){var p=PACKS.filter(function(x){return x.id===pid})[0];if(!p)return false;if(!p.price)return true;var o=J('dfp_stk_own',{});return !!o[pid]}
  function stkSrc(id){return 'assets/chat/'+id+'.webp'+Q}

  /* ---------- NPC hosts (same set as leaderboard) ---------- */
  var NPCS=[
    {n:'金龍貴賓',av:'av_a'},{n:'錦衣公子',av:'av_b'},{n:'鳳闕佳賓',av:'av_c'},{n:'殿前花使',av:'av_d'},
    {n:'金鑾貴人',av:'av_e'},{n:'紅樓嘉賓',av:'av_f'},{n:'瓊樓貴客',av:'av_g'},{n:'華堂君子',av:'av_h'},
    {n:'朱門雅士',av:'av_i'},{n:'祥雲客',av:'av_l'}
  ];
  var MACH={matsuri:'夏祭花火',samurai:'天下布武',neko:'招財大作戰',sakura:'櫻花斬'};
  var MK=['matsuri','samurai','neko','sakura'];
  var JPN=['小獎','大獎','頭獎'];
  function seeded(seed){var s=0;for(var i=0;i<seed.length;i++)s=(s*31+seed.charCodeAt(i))>>>0;return function(){s=(s*1664525+1013904223)>>>0;return s/4294967296}}
  function npcWins(){
    var r=seeded('bw'+dayId()),out=[],used={};
    for(var i=0;i<4;i++){
      var k;do{k=r()*NPCS.length|0}while(used[k]);used[k]=1;
      var bet=[200,400,1000,1000][r()*4|0],x=[32,45,60,88,120][r()*5|0];
      out.push({npc:1,name:NPCS[k].n,av:NPCS[k].av,m:MK[r()*4|0],w:Math.round(bet*x/100)*100,jp:0});
    }
    return out;
  }
  function avSrc(av){
    try{if(window.DFPfb&&typeof DFPfb.avatarSrc==='function')return DFPfb.avatarSrc(av)}catch(e){}
    return 'assets/lx/'+(/^av_[a-l]$/.test(av||'')?av:'av_a')+'.webp?v=2878';
  }
  function shown(n){var s=String(n||'旅人').slice(0,12);try{if(window.DFPname&&typeof DFPname.display==='function')s=DFPname.display(s)}catch(e){}return s}
  function myName(){
    try{if(window.DFPname&&typeof DFPname.get==='function'){var n=DFPname.get();if(n)return String(n).slice(0,12)}}catch(e){}
    try{if(window.DFPfb&&DFPfb.profile&&DFPfb.profile.displayName)return DFPfb.profile.displayName}catch(e){}
    return '旅人';
  }
  function myAv(){
    try{if(window.DFPfb&&typeof DFPfb.currentAvatar==='function'){var a=DFPfb.currentAvatar();if(a)return a}}catch(e){}
    var s=J('dfp_profile',{});return (s&&s.avatar)||'av_a';
  }
  function live(k){return !!(window.DFPfb&&DFPfb.live&&DFPfb[k])}

  /* ---------- lobby big-win marquee ---------- */
  var realWins=[],mqEl=null,bwT=0;
  function winHtml(x){
    var who=x.npc
      ?'<span class="cpNpc">金殿貴賓</span><b>'+esc(x.name)+'</b><i class="cpSys">（系統角色）</i>'
      :'<b>'+esc(shown(x.name))+'</b>'+(x.me?'<i class="cpSys">（你）</i>':'');
    var where='在「'+esc(MACH[x.m]||'金殿')+'」';
    var what=x.jp?('抽中 <b class="cpAmt">'+JPN[x.jp]+'彩金 '+fmt(x.w)+'</b> 虛擬籌碼'):('贏得 <b class="cpAmt">'+fmt(x.w)+'</b> 虛擬籌碼');
    return '<span class="cpW">恭喜 '+who+' '+where+what+'</span>';
  }
  function localWins(){
    /* offline: only your own wins from today on this device */
    var today=dayId(),q=J('dfp_bw',[]),o=[];
    q.forEach(function(r){try{if(new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(r.ts))===today)o.push({name:myName(),av:myAv(),m:r.m,w:r.w,jp:r.jp|0,me:1})}catch(e){}});
    return o.slice(0,2);
  }
  function paintMarquee(){
    if(!mqEl)return;
    var real=realWins.length?realWins.slice(0,8):localWins();
    var items=[],npc=npcWins(),ni=0;
    /* real players first; at most one NPC per two real rows; NPCs fill when quiet */
    real.forEach(function(x,i){items.push(winHtml(x));if(i%2===1&&ni<npc.length)items.push(winHtml(npc[ni++]))});
    while(items.length<4&&ni<npc.length)items.push(winHtml(npc[ni++]));
    items.push('<span class="cpW cpNote">僅供娛樂・虛擬籌碼・純虛擬・無兌現</span>');
    var h=items.join('<i class="cpSep"></i>')+'<i class="cpSep"></i>';
    var t=mqEl.querySelector('.cpTrk');
    t.innerHTML='<span class="cpRun">'+h+'</span><span class="cpRun" aria-hidden="true">'+h+'</span>';
    requestAnimationFrame(function(){var w=t.firstChild.getBoundingClientRect().width;t.style.setProperty('--cpd',Math.max(18,w/38).toFixed(1)+'s')});
  }
  function buildStrip(){
    var hero=$('lxHero'),jp=D.querySelector('.lxJp');if(!hero||!jp||$('cpRow'))return;
    var s=D.createElement('div');s.id='cpStrip';s.className='cpStrip';
    s.innerHTML='<img class="cpHorn" src="assets/chat/ico_horn.webp'+Q+'" alt="" width="64" height="64">'+
      '<div class="cpMq" aria-label="大獎播報"><div class="cpTrk"></div></div>';
    var row=D.createElement('div');row.className='cpRow';row.id='cpRow';
    var bt=D.createElement('button');bt.type='button';bt.className='cpBtn';bt.id='cpOpen';bt.setAttribute('aria-label','開啟金殿廣場聊天');
    bt.innerHTML='<i class="cpRim"></i><img src="assets/chat/ico_chat.webp'+Q+'" alt="" width="64" height="64"><i class="cpGem"></i><i class="cpDot" hidden></i>';
    row.appendChild(s);row.appendChild(bt);
    jp.parentNode.insertBefore(row,jp.nextSibling);
    mqEl=s;paintMarquee();
    $('cpOpen').addEventListener('click',openChat);
  }
  async function refreshWins(){
    if(!live('bigWinsOk'))return paintMarquee();
    try{
      var c=J('dfp_bw_cache',null);
      if(c&&c.day===dayId()&&Date.now()-c.t<120000)realWins=c.rows;
      else{realWins=await DFPfb.listBigWins();S('dfp_bw_cache',{day:dayId(),t:Date.now(),rows:realWins})}
    }catch(e){}
    paintMarquee();
  }
  /* upload only a bigger win than today's posted one, max once per 5 min (rules enforce too) */
  async function uploadWin(){
    if(!live('bigWinsOk'))return;
    var today=dayId(),best=J('dfp_bw_best',{});if(best.day!==today)best={day:today,w:0,t:0};
    if(Date.now()-(best.t||0)<300000)return;
    var pick=null;
    J('dfp_bw',[]).forEach(function(r){
      var d='';try{d=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(r.ts))}catch(e){}
      if(d===today&&r.w>best.w&&(!pick||r.w>pick.w))pick=r;
    });
    if(!pick)return;
    try{await DFPfb.postBigWin(pick);S('dfp_bw_best',{day:today,w:pick.w,t:Date.now()});try{LS.removeItem('dfp_bw_cache')}catch(e){}}catch(e){}
  }

  /* ---------- chat panel ---------- */
  var dlg=null,unsub=null,rows=[],localRows=[],tab='p',coolUntil=0,coolT=0,idleT=0,sending=false;
  function npcChat(){
    var r=seeded('ch'+dayId()),now=Date.now(),o=[],ids=['p01','s01','p08','s05','p07','s02'];
    for(var i=0;i<3;i++){var k=r()*NPCS.length|0,id=ids[(r()*ids.length)|0];o.push({npc:1,name:NPCS[k].n,av:NPCS[k].av,id:id,t:now-(40-i*12)*60000})}
    return o;
  }
  function msgHtml(m){
    var body;
    if(m.id&&m.id.charAt(0)==='s'&&STK[m.id])body='<img class="cpStk" src="'+stkSrc(m.id)+'" alt="'+esc(STK[m.id].n)+'" width="192" height="192">';
    else if(PHRASES[m.id])body='<span class="cpTxt">'+esc(PHRASES[m.id])+'</span>';
    else return '';
    var name=m.npc?esc(m.name):esc(shown(m.name));
    var tag=m.npc?'<span class="cpNpc">金殿貴賓</span>':'';
    var t='';try{var d=new Date(m.t);t=('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2)}catch(e){}
    var src=avSrc(m.av),rp=/^https:/.test(src)?' referrerpolicy="no-referrer"':'';
    return '<li class="cpMsg'+(m.me?' me':'')+(m.npc?' npc':'')+(m.id.charAt(0)==='s'?' stk':'')+'"'+(m.npc?' data-npc="1"':'')+'>'+
      '<span class="cpAv"><img src="'+esc(src)+'" alt="" width="40" height="40"'+rp+' onerror="this.onerror=null;this.src=\'assets/lx/av_a.webp?v=2878\'"></span>'+
      '<div class="cpBody"><div class="cpWho">'+tag+'<b>'+name+'</b>'+(m.npc?'<i class="cpSys">（系統角色）</i>':'<time>'+t+'</time>')+'</div><div class="cpBub">'+body+'</div></div></li>';
  }
  function paintList(){
    if(!dlg)return;
    var L=dlg.querySelector('.cpList');
    var all=(live('chatOk')?rows:localRows).slice();
    var npc=all.length<6?npcChat():[];
    var merged=npc.concat(all).sort(function(a,b){return a.t-b.t});
    var atBottom=L.scrollHeight-L.scrollTop-L.clientHeight<40;
    L.innerHTML='<li class="cpSysMsg">歡迎來到金殿廣場・只能傳送固定訊息與貼圖</li>'+merged.map(msgHtml).join('');
    if(atBottom||L.__first!==1){if(dlg.open)L.__first=1;L.scrollTop=L.scrollHeight}
  }
  function trayHtml(){
    var ph=P_ORDER.map(function(id){return '<button type="button" class="cpPh" data-id="'+id+'">'+esc(PHRASES[id])+'</button>'}).join('');
    var st=PACKS.map(function(p){
      var own=packOwned(p.id);
      return p.items.map(function(it){return '<button type="button" class="cpSt'+(own?'':' lock')+'" data-id="'+it.id+'" aria-label="'+esc(it.n)+'"'+(own?'':' disabled')+'><img src="'+stkSrc(it.id)+'" alt="" width="192" height="192" loading="lazy"><span>'+esc(it.n)+'</span></button>'}).join('');
    }).join('');
    return '<div class="cpTabs" role="tablist"><button type="button" role="tab" class="cpTab on" data-t="p">快捷訊息</button><button type="button" role="tab" class="cpTab" data-t="s">金殿貼圖</button></div>'+
      '<div class="cpTray"><div class="cpPane cpPP on" data-t="p">'+ph+'</div><div class="cpPane cpPS" data-t="s">'+st+'</div>'+
      '<div class="cpCool" hidden><i></i><span></span></div></div>';
  }
  function build(){
    if(dlg)return dlg;
    dlg=D.createElement('dialog');dlg.id='dChat';dlg.className='cpDlg';
    dlg.innerHTML='<header class="cpHd"><img src="assets/chat/ico_chat.webp'+Q+'" alt="" width="64" height="64"><h3>金殿廣場</h3><button type="button" class="cpX" aria-label="關閉" data-close><i></i></button></header>'+
      '<span class="cpWarn" hidden>目前離線，訊息只會顯示在你的裝置上</span>'+
      '<ul class="cpList" aria-live="polite"></ul>'+trayHtml()+
      '<p class="cpFoot">標示金殿貴賓者為系統角色・僅供娛樂・純虛擬・無兌現</p>';
    D.body.appendChild(dlg);
    dlg.addEventListener('click',function(e){
      if(e.target===dlg||e.target.closest('[data-close]')){closeChat();return}
      var tb=e.target.closest('.cpTab');if(tb){setTab(tb.dataset.t);return}
      var b=e.target.closest('.cpPh,.cpSt');if(b&&!b.disabled)send(b.dataset.id);
    });
    dlg.addEventListener('cancel',function(e){e.preventDefault();closeChat()});
    return dlg;
  }
  function setTab(t){tab=t;dlg.querySelectorAll('.cpTab').forEach(function(b){b.classList.toggle('on',b.dataset.t===t);b.setAttribute('aria-selected',b.dataset.t===t)});dlg.querySelectorAll('.cpPane').forEach(function(p){p.classList.toggle('on',p.dataset.t===t)})}
  function cooling(){
    var left=Math.ceil((coolUntil-Date.now())/1000),box=dlg&&dlg.querySelector('.cpCool');if(!box)return;
    var on=left>0;dlg.classList.toggle('cpCooling',on);box.hidden=!on;
    if(on){box.querySelector('span').textContent=left+' 秒後可再傳送';box.style.setProperty('--cp',((coolUntil-Date.now())/(COOL*1000)).toFixed(3));clearTimeout(coolT);coolT=setTimeout(cooling,250)}
  }
  function toast(t){try{if(window.CZ&&CZ.toast)return CZ.toast(t)}catch(e){}}
  async function send(id){
    if(sending||Date.now()<coolUntil)return;
    if(!PHRASES[id]&&!(STK[id]&&packOwned(STK[id].pack)))return;
    sending=true;
    var me={me:1,name:myName(),av:myAv(),id:id,t:Date.now()};
    try{
      if(live('chatOk')){await DFPfb.sendChat(id)}
      else{localRows.push(me);if(localRows.length>30)localRows.shift();paintList()}
      coolUntil=Date.now()+COOL*1000;cooling();
    }catch(e){
      var m=String(e&&e.message||'');
      toast(m.indexOf('daily-cap')>=0?'今天的聊天次數已用完，明天再來':'傳送失敗，請稍後再試');
      coolUntil=Date.now()+3000;cooling();
    }finally{sending=false}
    bumpIdle();
  }
  function listen(){
    stop();
    if(!live('chatOk'))return;
    unsub=DFPfb.watchChat(function(r){rows=r;paintList()},function(){stop()});
  }
  function stop(){if(unsub){try{unsub()}catch(e){}unsub=null}}
  /* stop listening after 3 min idle to save reads; any tap resumes */
  function bumpIdle(){clearTimeout(idleT);if(!unsub&&dlg&&dlg.open&&live('chatOk'))listen();idleT=setTimeout(stop,180000)}
  function openChat(){
    build();
    dlg.querySelector('.cpWarn').hidden=live('chatOk');
    paintList();
    try{dlg.showModal()}catch(e){dlg.setAttribute('open','')}
    var L0=dlg.querySelector('.cpList');L0.scrollTop=L0.scrollHeight;
    D.documentElement.classList.add('cpLock');
    listen();bumpIdle();cooling();
    var dot=D.querySelector('#cpOpen .cpDot');if(dot)dot.hidden=true;
  }
  function closeChat(){if(!dlg)return;dlg.querySelector('.cpList').__first=0;stop();clearTimeout(idleT);try{dlg.close()}catch(e){dlg.removeAttribute('open')}D.documentElement.classList.remove('cpLock')}
  D.addEventListener('visibilitychange',function(){if(D.hidden)stop();else if(dlg&&dlg.open)bumpIdle()});

  var booted=0;
  function boot(){
    buildStrip();
    if(booted||!$('lxHero'))return;booted=1;
    if(window.DFPfb&&DFPfb.ready&&DFPfb.ready.then)DFPfb.ready.then(function(){uploadWin().then(refreshWins);clearInterval(bwT);bwT=setInterval(function(){if(!D.hidden)refreshWins()},180000)});
  }
  window.DFPchat={open:openChat,close:closeChat,send:send,tab:function(t){build();setTab(t)},PHRASES:PHRASES,PACKS:PACKS,refresh:refreshWins,paint:paintMarquee};
  if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',boot);else boot();
  addEventListener('load',boot);
})();
