/* 龍運金殿 standalone 商城 (v28.148) — 一次一張圖鑑、滿版點一下返回、外框按鈕對齊、大廳底部導覽。Unlock rules unchanged. IAP flag off. */
(function(){
  var D=document;
  var TIER={n:'普通',r:'稀有',l:'傳說',m:'神話'};
  var POSE_N=['其一','其二','其三','其四','其五','其六'];
  var EP={
    sakura:['櫻花劍舞','櫻花斬'],
    samurai:['戰國武士','天下布武'],
    neko:['招財萌貓','招財大作戰'],
    matsuri:['和風祭典','夏祭花火']
  };
  var CN='assets/lx/corner.webp';
  var LOCK='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 10V8a4 4 0 0 1 8 0v2" fill="none" stroke="#4a1a02" stroke-width="2.2" stroke-linecap="round"/><rect x="6" y="10" width="12" height="10" rx="2.2" fill="#4a1a02"/><circle cx="12" cy="15" r="1.4" fill="#f6d27a"/></svg>';
  var FOOT='<b>虛擬籌碼無法以真實金錢購買，亦不可兌現、轉讓或提領。</b>'+
    '<p>籌碼可經遊玩、每日簽到、免費領取或邀請好友取得。外框可用免費取得的虛擬籌碼兌換，純裝飾，不影響中獎機率與 RTP。</p>'+
    '<p>僅供娛樂・不提供真錢博彩。</p>';
  var AS='';
  var gState={h:0,p:0,bound:false};

  function $(id){return D.getElementById(id)}
  function shop(){return window.DFPshop||{}}
  function asset(u){
    if(!u)return '';
    if(/^(https?:|data:|\.\.\/)/.test(u)) return u;
    return AS+u.replace(/^\.\//,'');
  }
  function fmt(n){return shop().fmtN?shop().fmtN(n):Math.floor(+n||0).toLocaleString('zh-TW')}
  function state(){return (shop().state&&shop().state())||{own:['gold'],eq:'gold'}}
  function catalog(){return (shop().catalog&&shop().catalog())||[]}
  function chips(){return shop().chips?shop().chips():(window.CZ&&CZ.getBal?CZ.getBal():0)}
  function pv(id){return asset(shop().pvUrl?shop().pvUrl(id):'')}
  function msg(t,k){var m=$('shMsg');if(!m)return;m.textContent=t||'';m.className='shmsg'+(k?' '+k:'')}
  function foot(){
    ['shFootFrames','shFootThemes','shFootNoads','shFootOwned'].forEach(function(id){
      var e=$(id); if(e) e.innerHTML=FOOT;
    });
  }
  function bal(){var b=$('shBal'); if(b) b.textContent=fmt(chips())}
  function tabOf(){
    var q=new URLSearchParams(location.search);
    var tab=q.get('tab')||'frames';
    if(['frames','themes','noads','owned'].indexOf(tab)<0) tab='frames';
    return tab;
  }
  function showTab(tab){
    ['frames','themes','noads','owned'].forEach(function(id){
      var p=$('panel-'+id), t=$('tab-'+id);
      if(p) p.hidden=id!==tab;
      if(t) t.classList.toggle('on', id===tab);
    });
  }
  function epithet(id, fallback){
    return EP[id]||[fallback,fallback];
  }
  function coin(){return '<i class="coin" aria-hidden="true"></i>'}

  function buyBtn(k, short){
    var cls='buyChip'+(short?' short':'');
    var dis=short?' disabled':'';
    return '<button type="button" class="'+cls+'" data-act="ask" data-id="'+k.id+'"'+dis+'>'+
      coin()+'<span>'+fmt(k.price)+'</span></button>';
  }
  function useBtn(id){
    return '<button type="button" class="buyChip btnUse" data-act="use" data-id="'+id+'">使用</button>';
  }
  function onLbl(){return '<div class="btnOn" aria-current="true">使用中</div>'}

  function frameCard(k, st){
    var own=st.own&&st.own.indexOf(k.id)>=0;
    var eq=st.eq===k.id;
    var cls='skin t-'+(k.tier||'n')+(eq?' eq':'');
    var badge=eq?'<span class="badgeEq">使用中</span>':own?'<span class="badgeEq">已擁有</span>':'';
    var sub, act, short=false;
    if(k.price===0){
      sub='<div class="sub free">預設・免費</div>';
      act=eq?onLbl():useBtn(k.id);
    }else if(own){
      sub='<div class="sub own">已用虛擬籌碼兌換</div>';
      act=eq?onLbl():useBtn(k.id);
    }else{
      short=chips()<k.price;
      sub=short?'<div class="sub short">籌碼不足</div>':'<div class="sub" aria-hidden="true"></div>';
      act=buyBtn(k, short);
    }
    return '<article class="'+cls+'" data-id="'+k.id+'">'+badge+
      '<span class="tier">'+(TIER[k.tier]||'')+'</span>'+
      '<div class="pv" style="background-image:url('+pv(k.id)+')"></div>'+
      '<div class="meta"><div class="name gt">'+(k.name||'')+'</div>'+sub+
      '<div class="act">'+act+'</div></div></article>';
  }

  function renderFrames(){
    var box=$('shSkins'); if(!box)return;
    box.innerHTML=catalog().map(function(k){return frameCard(k,state())}).join('');
  }

  function themeState(){return window.DFPtheme?DFPtheme.read():{own:[],eq:{}}}
  function renderThemes(){
    var box=$('shThemes'); if(!box)return;
    if(!window.DFPtheme){box.innerHTML='';return}
    var st=themeState();
    var cards=DFPtheme.catalog().map(function(k){
      var eq=k.def? !st.eq[k.mach] : st.eq[k.mach]===k.id;
      if(k.soon){
        return '<article class="themeCard soon" data-id="'+k.id+'">'+
          '<div class="pv soonPv" aria-hidden="true"></div>'+
          '<div class="meta"><div class="name gt">'+k.name+'</div>'+
          '<div class="sub">即將推出</div>'+
          '<div class="act"><div class="btnOn soonLbl">即將推出</div></div></div></article>';
      }
      var badge=eq?'<span class="badgeEq">使用中</span>':(k.free?'<span class="badgeEq">已擁有</span>':'');
      var sub=k.def?'<div class="sub free">預設・免費</div>':'<div class="sub free">免費開放</div>';
      var act=eq?onLbl():'<button type="button" class="thmUse" data-act="theme-use" data-id="'+k.id+'" data-mach="'+k.mach+'">使用</button>';
      var pv=k.card?'<div class="pv" style="background-image:url('+asset(k.card)+')"></div>':'<div class="pv"></div>';
      return '<article class="themeCard'+(eq?' eq':'')+'" data-id="'+k.id+'">'+badge+pv+
        '<div class="meta"><div class="name gt">'+k.name+'</div>'+sub+'<p class="desc">'+k.copy+'</p>'+
        '<div class="act">'+act+'</div></div></article>';
    });
    box.innerHTML=cards.join('');
  }

  function renderOwned(){
    var box=$('shOwn'); if(!box)return;
    var st=state();
    var rows=catalog().filter(function(k){return st.own&&st.own.indexOf(k.id)>=0}).map(function(k){
      var eq=st.eq===k.id;
      var how=k.price===0?'機台外框・預設免費':'機台外框・以 '+fmt(k.price)+' 虛擬籌碼兌換';
      var act=eq?'<span class="st on">使用中</span>':useBtn(k.id).replace('buyChip btnUse','st btnUse');
      return '<div class="ownRow" data-id="'+k.id+'"><div class="th" style="background-image:url('+pv(k.id)+')"></div><div class="tx"><b class="gt">'+k.name+'</b><small>'+how+'</small></div>'+act+'</div>';
    });
    if(window.DFPtheme){
      var ts=themeState();
      DFPtheme.catalog().filter(function(k){return !k.soon && (k.def || (ts.own&&ts.own.indexOf(k.id)>=0))}).forEach(function(k){
        var eq=k.def? !ts.eq[k.mach] : ts.eq[k.mach]===k.id;
        var how=k.def?'機台主題・預設免費':'機台主題・免費開放';
        var act=eq?'<span class="st on">使用中</span>':'<button type="button" class="st btnUse" data-act="theme-use" data-id="'+k.id+'" data-mach="'+k.mach+'">使用</button>';
        rows.push('<div class="ownRow" data-id="'+k.id+'"><div class="th" style="background-image:url('+asset(k.card||'')+')"></div><div class="tx"><b class="gt">'+k.name+'</b><small>'+how+'</small></div>'+act+'</div>');
      });
    }
    box.innerHTML=rows.join('')||'<p class="skSec">尚無已擁有外框</p>';
  }

  function galList(){
    var G=window.CZGAL;
    if(!G||typeof G.inspect!=='function') return [];
    return G.inspect().map(function(m){
      m.cells=m.cells.map(function(c){c.src=asset(c.src);return c});
      return m;
    });
  }
  function pickDefault(list){
    var q=new URLSearchParams(location.search);
    var hero=q.get('hero'), pose=q.get('pose');
    var hi=0,pi=0,best=-1;
    list.forEach(function(m,i){
      if(hero && m.id===hero) hi=i;
      var n=m.cells.filter(function(c){return c.ok}).length;
      if(!hero && n>best){best=n;hi=i}
    });
    if(pose!=null && pose!=='' && !isNaN(+pose)){
      pi=Math.max(0,Math.min(list[hi].cells.length-1,+pose));
    }else{
      list[hi].cells.forEach(function(c,i){if(c.ok) pi=i});
    }
    return {h:hi,p:pi};
  }

  function renderGal(){
    var box=$('shGal'); if(!box)return;
    var G=window.CZGAL, list=galList();
    if(!G||!list.length){box.innerHTML='';return}
    if(!gState.ready){var d=pickDefault(list);gState.h=d.h;gState.p=d.p;gState.ready=1}
    if(gState.h>list.length-1) gState.h=0;
    var m=list[gState.h];
    if(gState.p>m.cells.length-1) gState.p=0;
    var c=m.cells[gState.p], got=m.cells.filter(function(x){return x.ok}).length;
    var ep=epithet(m.id,m.name);
    var n=G.count(), T=G.total;
    var tabs=list.map(function(x,i){
      return '<button type="button" data-hero="'+i+'" class="'+(i===gState.h?'on':'')+'">'+x.name+'</button>';
    }).join('');
    var thumbs=m.cells.map(function(x,i){
      return '<button type="button" data-pose="'+i+'" class="'+(i===gState.p?'on':'')+(x.ok?'':' locked')+'" aria-label="'+x.name+(x.ok?'':'（未解鎖）')+'">'+
        '<span><img src="'+x.src+'" alt="">'+(x.ok?'':'<i class="galThumbLock" aria-hidden="true">'+LOCK+'</i>')+'</span><em>'+x.name+'</em></button>';
    }).join('');
    var artCls=c.ok?'':' locked';
    var lock=c.ok?'':('<div class="galLock"><span class="galSeal">'+LOCK+'</span><em>未解鎖</em><small>'+esc(c.hint||'')+'</small></div>');
    var sheen=c.ok?'<i class="galSheen" aria-hidden="true"></i>':'';
    box.innerHTML=
      '<div class="galHead"><img class="sc" src="'+asset('assets/lx/scroll.webp')+'" alt="">'+
        '<div class="tx"><b class="gt">角色圖鑑</b><small>一次欣賞一張。點下方小圖或上一張、下一張即可切換。已解鎖可點開看大圖。</small></div>'+
        '<div class="n">'+n+' / '+T+'</div></div>'+
      '<nav class="galHeroes" aria-label="選擇機台角色">'+tabs+'</nav>'+
      '<div class="galStage">'+
        '<button type="button" class="galArr prev" data-step="-1" aria-label="上一張">‹</button>'+
        '<figure class="galFrame'+artCls+'" data-open="'+(c.ok?'1':'0')+'">'+
          '<img class="cn tl" src="'+CN+'" alt=""><img class="cn tr" src="'+CN+'" alt="">'+
          '<img class="cn bl" src="'+CN+'" alt=""><img class="cn br" src="'+CN+'" alt="">'+
          '<div class="galArt"><img src="'+c.src+'" alt="'+(c.ok?(ep[0]+' '+c.name):'未解鎖')+'"></div>'+
          sheen+lock+
        '</figure>'+
        '<button type="button" class="galArr next" data-step="1" aria-label="下一張">›</button>'+
      '</div>'+
      '<div class="galPlaque">'+
        '<div class="who gt">'+ep[0]+'</div>'+
        '<div class="mach">'+ep[1]+'</div>'+
        '<div class="pose">'+POSE_N[gState.p]+'　'+c.name+'</div>'+
        (c.ok?'':'<div class="hint">未解鎖・'+esc(c.hint||'')+'</div>')+
        '<div class="galProg"><b>'+got+' / '+m.cells.length+'</b><div class="bar" aria-hidden="true"><i style="width:'+(got/m.cells.length*100)+'%"></i></div></div>'+
      '</div>'+
      '<div class="galThumbs" aria-label="圖鑑小圖">'+thumbs+'</div>';
    bindGal(box,list);
  }
  function esc(s){return String(s||'').replace(/[&<>"]/g,function(c){return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])})}

  function step(list, dir){
    var m=list[gState.h], n=m.cells.length;
    var p=gState.p+dir;
    if(p<0){ gState.h=(gState.h+list.length-1)%list.length; gState.p=list[gState.h].cells.length-1; }
    else if(p>=n){ gState.h=(gState.h+1)%list.length; gState.p=0; }
    else gState.p=p;
    renderGal();
  }

  function bindGal(box,list){
    box.onclick=function(e){
      var hero=e.target.closest('[data-hero]');
      if(hero){gState.h=+hero.dataset.hero;gState.p=0;
        list[gState.h].cells.forEach(function(c,i){if(c.ok) gState.p=i;}); /* show last unlocked, or 0 */
        /* actually first pose if jumping heroine feels more like a catalog start: use first unlocked else 0 */
        var first=-1; list[gState.h].cells.forEach(function(c,i){if(c.ok&&first<0) first=i});
        gState.p=first>=0?first:0;
        renderGal(); return;
      }
      var pose=e.target.closest('[data-pose]');
      if(pose){gState.p=+pose.dataset.pose;renderGal();return}
      var arr=e.target.closest('[data-step]');
      if(arr){step(list,+arr.dataset.step);return}
      var frame=e.target.closest('.galFrame');
      if(frame && frame.dataset.open==='1' && !e.target.closest('.galArr')){openView(list);return}
    };
    var stage=box.querySelector('.galStage');
    if(stage && !stage.dataset.sw){
      stage.dataset.sw='1';
      var x0=0,y0=0,on=false;
      stage.addEventListener('pointerdown',function(e){if(e.target.closest('.galArr'))return;on=true;x0=e.clientX;y0=e.clientY},{passive:true});
      stage.addEventListener('pointerup',function(e){
        if(!on)return;on=false;
        var dx=e.clientX-x0, dy=e.clientY-y0;
        if(Math.abs(dx)>48 && Math.abs(dx)>Math.abs(dy)*1.2){step(galList(), dx<0?1:-1)}
      });
      stage.addEventListener('pointercancel',function(){on=false});
    }
  }

  function fsEl(){return D.fullscreenElement||D.webkitFullscreenElement||null}
  function enterFs(el){
    var req=el.requestFullscreen||el.webkitRequestFullscreen||el.webkitRequestFullScreen;
    if(!req)return;
    try{var p=req.call(el); if(p&&p.catch)p.catch(function(){})}catch(e){}
  }
  function exitFs(){
    if(!fsEl())return;
    var ex=D.exitFullscreen||D.webkitExitFullscreen||D.webkitCancelFullScreen;
    try{var p=ex&&ex.call(D); if(p&&p.catch)p.catch(function(){})}catch(e){}
  }
  function openView(list){
    list=list||galList();
    var m=list[gState.h], c=m.cells[gState.p];
    if(!c||!c.ok)return;
    var ep=epithet(m.id,m.name);
    var el=$('galView');
    if(!el){el=D.createElement('div');el.id='galView';el.setAttribute('role','button');D.body.appendChild(el)}
    el.hidden=false;
    el.setAttribute('aria-label',ep[0]+'　'+c.name+'，點一下返回');
    el.innerHTML='<div class="gvArt"><img src="'+c.src+'" alt="'+ep[0]+'　'+c.name+'"></div>'+
      '<div class="gvHint">點一下返回</div>';
    el.onclick=function(){closeView()};
    if(!gState.viewOpen){
      gState.viewOpen=1;
      if(!gState.pushed){
        try{history.pushState({dfpGal:1},'');gState.pushed=1}catch(e){}
      }
      enterFs(el);
    }
  }
  function closeView(fromPop){
    if(!gState.viewOpen)return;
    gState.viewOpen=0;
    var el=$('galView');
    if(el){el.hidden=true;el.innerHTML='';el.onclick=null}
    exitFs();
    if(gState.pushed && !fromPop){
      gState.pushed=0;
      try{history.back()}catch(e){}
    }else{
      gState.pushed=0;
    }
  }
  if(!gState.histBound){
    gState.histBound=1;
    window.addEventListener('popstate',function(){
      if(gState.viewOpen) closeView(true);
      else gState.pushed=0;
    });
    D.addEventListener('fullscreenchange',function(){});
    D.addEventListener('webkitfullscreenchange',function(){});
  }

  function act(kind,id){
    var api=shop();
    if(typeof api.act==='function'){api.act(kind,id);paint();return}
  }

  function bind(){
    if(bind.ok)return; bind.ok=1;
    D.addEventListener('click',function(e){
      var b=e.target.closest('[data-act]');
      if(!b||!D.getElementById('shop')||!b.closest('#shop'))return;
      if(b.closest('#shGal')||b.closest('#galView'))return;
      var kind=b.dataset.act, id=b.dataset.id;
      if(kind==='ask'){
        var k=catalog().find(function(x){return x.id===id});
        if(!k)return;
        if(chips()<k.price){msg('虛擬籌碼不足，還差 '+fmt(k.price-chips())+'（可透過遊戲、每日簽到或免費領取取得）','err');return}
        b.dataset.act='buy';
        b.classList.add('confirm');
        b.innerHTML=coin()+'<span>確認兌換 '+fmt(k.price)+'</span>';
        msg('再按一次確認，以 '+fmt(k.price)+' 虛擬籌碼兌換「'+k.name+'」');
        return;
      }
      if(kind==='theme-use'){
        if(!window.DFPtheme)return;
        var mach=b.getAttribute('data-mach')||'sakura';
        DFPtheme.setEq(mach, id);
        msg('已改用「'+(b.closest('[data-id]')&&id? (DFPtheme.catalog().filter(function(x){return x.id===id})[0]||{}).name||id : id)+'」','ok');
        paint();
        return;
      }
      act(kind,id);
    });
  }

  function paint(){
    bal();
    renderFrames();
    renderThemes();
    renderOwned();
    renderGal();
  }

  function hookBack(){
    window.dfpBack=function(){
      if(gState.viewOpen){closeView();return true}
      try{if(D.querySelector('dialog[open]')){D.querySelector('dialog[open]').close();return true}}catch(e){}
      return true;
    };
  }

  function fitNav(){
    var bb=D.querySelector('.lxBot'), page=$('page');
    if(!bb||!page)return;
    var h=Math.ceil(bb.getBoundingClientRect().height);
    page.style.paddingBottom=h+'px';
    page.style.setProperty('--botH',h+'px');
  }
  function bindNav(){
    var nav=$('lxNav'); if(!nav||nav.dataset.bound)return;
    nav.dataset.bound='1';
    nav.addEventListener('click',function(e){
      var a=e.target.closest('a[data-tab]'); if(!a)return;
      var t=a.getAttribute('data-tab');
      if(t==='shop'){e.preventDefault();return}
      if(/^(home|games|events|me)$/.test(t)){
        try{sessionStorage.setItem('lxTab',t)}catch(err){}
      }
    });
  }
  foot();
  showTab(tabOf());
  bind();
  bindNav();
  hookBack();
  if(window.CZ&&CZ.on)CZ.on(function(){bal();});
  paint();
  fitNav();
  addEventListener('resize',fitNav);
})();
