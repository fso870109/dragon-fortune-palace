/* v28.112 — 修改暱稱
   本機與（若已連線）雲端顯示名稱統一；絕不改 RTP／經濟。 */
(function(){
  var LS=window.localStorage;
  var KEY='dfp_name';
  var PEND='dfp_name_pending';
  var PEN='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.2 4.4l4.4 4.4-11.5 11.5H3.8v-4.3L15.2 4.4z" fill="#f3d789" stroke="#8a5a18" stroke-width="1.2" stroke-linejoin="round"/><path d="M14 5.6l4.4 4.4" stroke="#8a5a18" stroke-width="1.15"/><path d="M5.2 19.4l2.8-.7" stroke="#8a5a18" stroke-width="1.1" stroke-linecap="round"/></svg>';

  function $(id){return document.getElementById(id)}
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}

  function sanitize(raw){
    var s=String(raw==null?'':raw);
    s=s.replace(/[<>]/g,'');
    s=s.replace(/\s+/g,' ').trim();
    var chars=Array.from(s);
    if(chars.length>12)s=chars.slice(0,12).join('');
    return s;
  }

  var MSG_BLOCK='這個名稱不能使用，請換一個';
  var FALLBACK='旅人';
  var S2T={'\u5e72':'\u5e79','\u5988':'\u5abd','\u9a6c':'\u99ac','\u9e21':'\u96de','\u673a':'\u6a5f','\u8111':'\u8166','\u6b8b':'\u6b98','\u5458':'\u54e1','\u8d35':'\u8cb4','\u5bbe':'\u8cd3','\u4f53':'\u9ad4','\u8282':'\u7bc0','\u6811':'\u6a39','\u52b2':'\u52c1','\u7edf':'\u7d71','\u7ecf':'\u7d93','\u9634':'\u9670','\u830e':'\u8396','\u5934':'\u982d','\u9f9f':'\u9f9c','\u4e71':'\u4e82','\u7ebf':'\u7dda','\u7ec3':'\u7df4','\u76d8':'\u76e4','\u573a':'\u5834','\u52b3':'\u52de','\u739b':'\u746a','\u5417':'\u55ce','\u75f4':'\u7661','\u517d':'\u7378','\u4e9a':'\u4e9e','\u5362':'\u76e7'};
  var ALLOW=['class','classic','classy','assassin','scunthorpe','assemble','assist','associate','assessment','cocktail','grass','glass','\u5e79\u90e8','\u5e79\u52c1','\u80fd\u5e79','\u6a39\u5e79','\u5e79\u4e8b','\u5e79\u7df4','\u624d\u5e79','\u5e79\u7dda','\u5e79\u9053','\u64cd\u4f5c','\u9ad4\u64cd','\u7bc0\u64cd','\u64cd\u52de','\u64cd\u5fc3','\u64cd\u5b88','\u64cd\u7df4','\u64cd\u5834','\u64cd\u76e4','\u64cd\u6301'];
  var BLOCK_SUB=['\u5e79\u4f60\u5a18','\u5e79\u59b3\u5a18','\u5e79\u60a8\u5a18','\u5e79\u4f60\u5abd','\u5e79\u59b3\u5abd','\u5e79\u62ce\u5a18','\u5e79\u62ce','\u5e79\u4f60','\u64cd\u4f60\u5abd','\u64cd\u4f60\u5a18','\u64cd\u4f60\u5abd','\u808f\u4f60\u5abd','\u808f\u4f60\u5a18','\u9760\u5317','\u9760\u592d','\u9760\u8170','\u6a5f\u63b0','\u96de\u63b0','\u767d\u7661','\u767d\u75f4','\u667a\u969c','\u8166\u6b98','\u4e09\u5c0f','\u53bb\u6b7b','\u50bb\u903c','\u50bbb','\u715e\u7b46','\u8349\u6ce5\u99ac','\u5abd\u7684','\u5c3c\u746a','\u4f60\u5abd\u7684','\u59b3\u5abd\u7684','\u4ed6\u5abd\u7684','\u59b3\u5abd','\u4f60\u5abd','\u4ed6\u5abd','\u5a4a\u5b50','\u5a4a','\u5c4c','\u6b7b\u5168\u5bb6','\u5168\u5bb6\u6b7b','\u5403\u5c4e','\u72d7\u5c4e','\u8ce4\u4eba','\u5f37\u59e6','\u63d2\u4f60','\u9f9c\u982d','\u9670\u8396','\u9670\u9053','\u5b98\u65b9','\u5ba2\u670d','\u7ba1\u7406\u54e1','\u91d1\u6bbf\u8cb4\u8cd3','\u7cfb\u7d71','fuck','fuk','fck','fvck','fucc','phuck','motherfucker','shit','bitch','cunt','asshole','arsehole','pussy','penis','vagina','porn','whore','slut','bastard','wanker','twat','nigger','nigga','faggot','retard','rapist','admin','administrator'];
  var BLOCK_SHORT=['ass','dick','cock','cum','fag','tit','tits','gm','sex','piss','rape'];
  var BLOCK_EXACT=['\u64cd','\u5e79','87','\u516b\u4e03','admin','gm','staff','official','moderator','\u7248\u4e3b','\u7ad9\u9577'];

  function fold(s){
    s=String(s==null?'':s).normalize('NFKC').toLowerCase();
    s=s.replace(/[\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff\u00ad\u180e]/g,'');
    var out='';
    for(var i=0;i<s.length;i++){
      var ch=s.charAt(i);
      if(S2T[ch])ch=S2T[ch];
      if(/[0-9a-z\u3400-\u9fff\u3040-\u30ff]/.test(ch))out+=ch;
    }
    return out;
  }
  function leet(s){
    return String(s).replace(/[013457@$!]/g,function(c){return {'0':'o','1':'i','3':'e','4':'a','5':'s','7':'t','@':'a','$':'s','!':'i'}[c]||c});
  }
  function spans(hay, terms){
    var out=[];
    for(var t=0;t<terms.length;t++){
      var n=terms[t]; if(!n)continue;
      var i=0;
      while((i=hay.indexOf(n,i))>=0){out.push([i,i+n.length]);i+=1}
    }
    return out;
  }
  function covered(a,b,safe){
    for(var i=0;i<safe.length;i++){if(safe[i][0]<=a&&b<=safe[i][1])return true}
    return false;
  }
  function hasUncovered(hay, needle, safe){
    if(!needle||!hay)return false;
    var i=0,hit=false;
    while((i=hay.indexOf(needle,i))>=0){
      if(!covered(i,i+needle.length,safe)){hit=true;break}
      i+=1;
    }
    return hit;
  }
  function tokensOf(raw){
    var s=String(raw==null?'':raw).normalize('NFKC').toLowerCase();
    return s.split(/[^0-9a-z\u3400-\u9fff]+/).filter(Boolean);
  }
  var ALLOW_F=ALLOW.map(function(w){return fold(w)}).filter(Boolean);
  var ALLOW_L=ALLOW_F.map(leet);
  var SUB_F=BLOCK_SUB.map(function(w){return fold(w)}).filter(Boolean);
  var SHORT_F=BLOCK_SHORT.map(function(w){return fold(w)});
  var EXACT_F=BLOCK_EXACT.map(function(w){return fold(w)});

  function isBlocked(raw){
    var f=fold(raw);
    if(!f)return false;
    var fl=leet(f);
    if(ALLOW_F.indexOf(f)>=0||ALLOW_L.indexOf(fl)>=0)return false;
    if(EXACT_F.indexOf(f)>=0||EXACT_F.indexOf(fl)>=0)return true;
    var safe=spans(f,ALLOW_F), safel=spans(fl,ALLOW_L);
    var i,t,tl;
    for(i=0;i<SUB_F.length;i++){
      t=SUB_F[i]; tl=leet(t);
      if(hasUncovered(f,t,safe))return true;
      if(tl && /[a-z]/.test(tl) && hasUncovered(fl,tl,safel))return true;
    }
    if(SHORT_F.indexOf(f)>=0||SHORT_F.indexOf(fl)>=0)return true;
    var toks=tokensOf(raw),k,tk,tlk;
    for(k=0;k<toks.length;k++){
      tk=fold(toks[k]); tlk=leet(tk);
      if(ALLOW_F.indexOf(tk)>=0||ALLOW_L.indexOf(tlk)>=0)continue;
      if(SHORT_F.indexOf(tk)>=0||SHORT_F.indexOf(tlk)>=0)return true;
      if(EXACT_F.indexOf(tk)>=0||EXACT_F.indexOf(tlk)>=0)return true;
    }
    return false;
  }
  function displayName(n, fb){
    n=sanitize(n);
    if(!n||isBlocked(n))return fb||FALLBACK;
    return n;
  }

  function validate(s){
    if(!s)return '請輸入暱稱';
    if(Array.from(s).length<1)return '請輸入暱稱';
    if(Array.from(s).length>12)return '暱稱最多 12 個字';
    if(isBlocked(s))return MSG_BLOCK;
    return '';
  }

  function readLocal(){
    try{
      var n=LS.getItem(KEY);
      if(n){n=sanitize(n);if(n)return n}
    }catch(e){}
    try{
      var p=JSON.parse(LS.getItem('dfp_profile')||'{}');
      if(p&&p.displayName){var a=sanitize(p.displayName);if(a)return a}
    }catch(e){}
    try{
      var st=JSON.parse(LS.getItem('fs_stats')||'{}');
      if(st&&st.name){var b=sanitize(st.name);if(b)return b}
    }catch(e){}
    try{
      if(window.DFPfb&&DFPfb.profile&&DFPfb.profile.displayName){
        var c=sanitize(DFPfb.profile.displayName);if(c)return c
      }
    }catch(e){}
    return '';
  }
  function getName(){var n=readLocal();if(!n||isBlocked(n))return FALLBACK;return n}

  function writeLocal(name){
    try{LS.setItem(KEY,name)}catch(e){}
    try{
      var p={};
      try{p=JSON.parse(LS.getItem('dfp_profile')||'{}')||{}}catch(e){p={}}
      p.displayName=name;
      LS.setItem('dfp_profile',JSON.stringify(p));
    }catch(e){}
    try{
      var st={};
      try{st=JSON.parse(LS.getItem('fs_stats')||'{}')||{}}catch(e){st={}}
      st.name=name;
      if(Array.isArray(st.wins))st.wins.forEach(function(w){if(w)w.n=name});
      LS.setItem('fs_stats',JSON.stringify(st));
    }catch(e){}
  }

  function canSync(){
    try{
      return !!(window.DFPfb&&DFPfb.live&&DFPfb.user&&DFPfb.writesEnabled&&typeof DFPfb.updateProfile==='function');
    }catch(e){return false}
  }
  function setPending(on){
    try{if(on)LS.setItem(PEND,'1');else LS.removeItem(PEND)}catch(e){}
  }
  function isPending(){
    try{return LS.getItem(PEND)==='1'}catch(e){return false}
  }

  function paint(){
    var n=getName();
    var nm=$('lxNm');
    if(nm)nm.textContent=n;
    var nick=$('lxNick');
    if(nick)nick.setAttribute('aria-label','修改暱稱，目前為'+n);
    var fr=$('frNm');
    if(fr&&document.activeElement!==fr)fr.value=n;
    var lb=$('lbName');
    if(lb&&document.activeElement!==lb)lb.value=n;
    var now=$('nickNowName');
    if(now)now.textContent=n;
    try{dispatchEvent(new CustomEvent('dfpname',{detail:{name:n}}))}catch(e){}
  }

  function apply(name, opts){
    opts=opts||{};
    if(isBlocked(name)||!name)return Promise.resolve({ok:0,blocked:1});
    writeLocal(name);
    paint();
    if(canSync()){
      return DFPfb.updateProfile({displayName:name}).then(function(){
        setPending(false);
        return {ok:1, synced:1};
      }).catch(function(){
        setPending(true);
        return {ok:1, synced:0, fail:1};
      });
    }
    setPending(true);
    return Promise.resolve({ok:1, synced:0, offline:1});
  }

  function flushPending(){
    if(!isPending()||!canSync())return;
    var n=readLocal();
    if(!n||isBlocked(n))return;
    DFPfb.updateProfile({displayName:n}).then(function(){setPending(false);paint()}).catch(function(){});
  }

  function ensureChip(){
    var me=$('lxMe'); if(!me)return;
    var t=me.querySelector('.lxMeT'); if(!t)return;
    if(!$('lxNick')){
      var nick=document.createElement('span');
      nick.className='lxNick';
      nick.id='lxNick';
      nick.setAttribute('role','button');
      nick.innerHTML='<b id="lxNm"></b><i class="lxPen" aria-hidden="true">'+PEN+'</i>';
      t.insertBefore(nick, t.firstChild);
    }
    var lv=$('lxLv'), bal=t.querySelector('.lxBal');
    if(lv&&bal&&!t.querySelector('.lxMeSub')){
      var sub=document.createElement('span');
      sub.className='lxMeSub';
      t.insertBefore(sub, lv);
      sub.appendChild(lv);
      sub.appendChild(bal);
    }
    me.classList.add('nickOn');
    document.getElementById('lx')&&document.getElementById('lx').classList.add('nickOn');
    paint();
  }
  function syncStoredWins(){
    var n=readLocal(); if(!n||isBlocked(n))return;
    try{
      var st=JSON.parse(LS.getItem('fs_stats')||'{}')||{};
      var dirty=st.name!==n;
      if(Array.isArray(st.wins))st.wins.forEach(function(w){if(w&&w.n!==n){w.n=n;dirty=1}});
      if(dirty){st.name=n;LS.setItem('fs_stats',JSON.stringify(st))}
    }catch(e){}
  }

  function ensureDialog(){
    if($('dNick'))return $('dNick');
    var d=document.createElement('dialog');
    d.id='dNick';
    d.className='nickDlg';
    d.setAttribute('aria-labelledby','nickT');
    d.innerHTML=
      '<h3 id="nickT">修改暱稱</h3>'+
      '<p class="nickNow">目前名稱：<b id="nickNowName"></b></p>'+
      '<label class="sr nickField" for="nickIn">新暱稱</label>'+
      '<input id="nickIn" maxlength="12" autocomplete="off" spellcheck="false" enterkeyhint="done">'+
      '<p class="nickHint">1 至 12 個字，空白會被忽略</p>'+
      '<p class="nickMsg" id="nickMsg" role="status"></p>'+
      '<div class="nickBtns">'+
        '<button type="button" class="btn" id="nickSave">儲存</button>'+
        '<button type="button" class="btn close" id="nickCancel">取消</button>'+
      '</div>'+
      '<p class="nickNote">僅供娛樂顯示・純虛擬・無兌現</p>';
    document.body.appendChild(d);
    if(!$('nickSrStyle')){
      var st=document.createElement('style');
      st.id='nickSrStyle';
      st.textContent='#dNick .sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}';
      document.head.appendChild(st);
    }
    return d;
  }

  function say(t, bad){
    var m=$('nickMsg'); if(!m)return;
    m.textContent=t||'';
    m.classList.toggle('bad',!!bad);
  }

  function openDlg(e){
    if(e){e.preventDefault();e.stopPropagation()}
    ensureChip();
    var d=ensureDialog();
    var cur=getName();
    $('nickNowName').textContent=cur;
    $('nickIn').value=cur==='旅人'&&!readLocal()?'':cur;
    say('');
    try{if(window.sfx)sfx(1)}catch(err){}
    try{if(window.CZ)CZ.vib(8)}catch(err){}
    if(d.open)try{d.close()}catch(err){}
    d.showModal();
    setTimeout(function(){try{$('nickIn').focus();$('nickIn').select()}catch(err){}},40);
  }
  function closeDlg(){
    var d=$('dNick'); if(d&&d.open)try{d.close()}catch(e){}
  }

  function save(){
    var v=sanitize($('nickIn')?$('nickIn').value:'');
    var err=validate(v);
    if(err){say(err,1);if($('nickIn'))$('nickIn').focus();return}
    $('nickIn').value=v;
    apply(v).then(function(r){
      if(r&&r.synced)say('已更新暱稱');
      else if(r&&r.fail)say('已存在本機。雲端尚未同步，登入後會再試一次。');
      else say('已存在本機。登入後會再同步到雲端。');
      setTimeout(closeDlg, r&&r.synced?280:720);
    });
  }

  function hookFr(){
    var fr=$('frNm'); if(!fr||fr.dataset.n28112)return;
    fr.dataset.n28112='1';
    if(!fr.parentNode.querySelector('#frNmHint')){
      var row=document.createElement('div');
      row.className='frNmRow';
      fr.parentNode.insertBefore(row, fr);
      row.appendChild(fr);
      var hint=document.createElement('button');
      hint.type='button';
      hint.id='frNmHint';
      hint.className='frNmHint';
      hint.textContent='修改';
      hint.setAttribute('aria-label','修改暱稱');
      hint.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();openDlg(e)});
      row.appendChild(hint);
    }
    fr.onchange=function(){
      var v=sanitize(fr.value);
      var err=validate(v);
      if(err){
        fr.value=getName();
        var m=$('frMsg'); if(m)m.textContent=err;
        return;
      }
      fr.value=v;
      apply(v);
    };
  }

  function hookLb(){
    var lb=$('lbName'); if(!lb||lb.dataset.n28112)return;
    lb.dataset.n28112='1';
    if(!lb.value||isBlocked(lb.value))lb.value=getName();
    lb.onchange=function(){
      var v=sanitize(lb.value);
      var err=validate(v);
      if(err){
        lb.value=getName();
        try{if(window.CZ&&CZ.toast)CZ.toast(err)}catch(e){}
        lb.setAttribute('title',err);
        return;
      }
      lb.value=v;
      apply(v).then(function(){
        try{if(typeof lbRender==='function')lbRender()}catch(e){}
      });
    };
  }

  function hookLbScrub(){
    var d=$('lb'); if(!d||d.dataset.n28112s)return;
    d.dataset.n28112s='1';
    function scrub(){
      d.querySelectorAll('.who').forEach(function(el){
        var n=el.firstChild;
        if(!n||n.nodeType!==3)return;
        var shown=displayName(n.textContent);
        if(n.textContent!==shown)n.textContent=shown;
      });
    }
    d.addEventListener('toggle',function(){if(d.open)setTimeout(scrub,0)});
  }

  function hookMe(){
    var me=$('lxMe'); if(!me||me.dataset.n28112)return;
    me.dataset.n28112='1';
    me.addEventListener('click',function(e){
      if(e.target.closest('#lxNick, .lxNick, .lxPen, #lxNm')){openDlg(e)}
    }, true);
  }

  function hookDlg(){
    var d=ensureDialog();
    if(d.dataset.n28112)return;
    d.dataset.n28112='1';
    $('nickSave').addEventListener('click',function(){save()});
    $('nickCancel').addEventListener('click',function(){
      try{if(window.sfx)sfx(1)}catch(e){}
      closeDlg();
    });
    $('nickIn').addEventListener('keydown',function(e){
      if(e.key==='Enter'){e.preventDefault();save()}
      if(e.key==='Escape'){e.preventDefault();closeDlg()}
    });
    d.addEventListener('click',function(e){if(e.target===d)closeDlg()});
  }

  function hookReady(){
    if(!window.DFPfb||!DFPfb.ready||DFPfb._n28112r)return;
    DFPfb._n28112r=1;
    DFPfb.ready.then(function(){flushPending();paint();hookFr()}).catch(function(){});
  }

  function boot(){
    ensureChip();
    hookMe();
    hookDlg();
    hookFr();
    hookLb();
    hookLbScrub();
    hookReady();
    syncStoredWins();
    paint();
  }

  window.DFPname={
    get:getName,
    set:function(n){n=sanitize(n);if(validate(n))return Promise.resolve({ok:0});return apply(n)},
    sanitize:sanitize,
    paint:paint,
    open:openDlg,
    blocked:isBlocked,
    display:displayName,
    validate:validate,
    MSG_BLOCK:MSG_BLOCK
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);
  else boot();
  addEventListener('load',function(){boot();hookReady();flushPending()});
  addEventListener('dfpav',function(){paint();hookFr()});
})();
