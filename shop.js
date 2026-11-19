/* 龍運金殿 standalone 商城 (v28.145) — chip exchange for frames + 收藏/圖鑑. IAP flag off. */
(function(){
  var D=document;
  var TIER={n:'普通',r:'稀有',l:'傳說',m:'神話'};
  var FOOT='<b>虛擬籌碼無法以真實金錢購買，亦不可兌現、轉讓或提領。</b>'+
    '<p>籌碼可經遊玩、每日簽到、免費領取或邀請好友取得。外框可用免費取得的虛擬籌碼兌換，純裝飾，不影響中獎機率與 RTP。</p>'+
    '<p>僅供娛樂・不提供真錢博彩。</p>';

  function $(id){return D.getElementById(id)}
  function shop(){return window.DFPshop||{}}
  function fmt(n){return shop().fmtN?shop().fmtN(n):Math.floor(+n||0).toLocaleString('zh-TW')}
  function state(){return (shop().state&&shop().state())||{own:['gold'],eq:'gold'}}
  function catalog(){return (shop().catalog&&shop().catalog())||[]}
  function chips(){return shop().chips?shop().chips():(window.CZ&&CZ.getBal?CZ.getBal():0)}
  function pv(id){return shop().pvUrl?shop().pvUrl(id):''}
  function iapOn(){return !!(window.DFPiap&&DFPiap.enabled())}
  function msg(t,k){var m=$('shMsg');if(!m)return;m.textContent=t||'';m.className='shmsg'+(k?' '+k:'')}
  function foot(){
    ['shFootFrames','shFootThemes','shFootNoads','shFootOwned'].forEach(function(id){
      var e=$(id); if(e) e.innerHTML=FOOT;
    });
  }
  function bal(){
    var b=$('shBal'); if(b) b.textContent=fmt(chips());
  }
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

  function frameCard(k, st){
    var own=st.own&&st.own.indexOf(k.id)>=0;
    var eq=st.eq===k.id;
    var cls='skin t-'+(k.tier||'n')+(eq?' eq':'');
    var badge=eq?'<span class="badgeEq">使用中</span>':own?'<span class="badgeEq">已擁有</span>':'';
    var body;
    if(k.price===0){
      body=eq
        ?'<div class="pr eq">使用中</div><div class="free">預設・免費</div>'
        :'<div class="free">預設・免費</div><div class="buyRow chipOnly"><button type="button" class="buyChip" data-act="use" data-id="'+k.id+'">使用</button></div>';
    }else if(own){
      body='<div class="pr own">已用虛擬籌碼兌換</div><div class="free">'+(eq?'使用中':'已擁有')+'</div>'+
        (eq?'':'<div class="buyRow chipOnly"><button type="button" class="buyChip" data-act="use" data-id="'+k.id+'">使用</button></div>');
    }else{
      body='<div class="pr">'+fmt(k.price)+' 籌碼</div>'+
        '<div class="buyRow chipOnly">'+
          '<button type="button" class="buyChip" data-act="ask" data-id="'+k.id+'" '+(chips()<k.price?'disabled':'')+'>'+fmt(k.price)+'</button>'+
        '</div>';
    }
    return '<article class="'+cls+'" data-id="'+k.id+'">'+badge+
      '<span class="tier">'+(TIER[k.tier]||'')+'</span>'+
      '<div class="pv" style="background-image:url('+pv(k.id)+')"></div>'+
      '<div class="meta"><div class="name gt">'+(k.name||'')+'</div>'+body+'</div></article>';
  }

  function renderFrames(){
    var box=$('shSkins'); if(!box)return;
    var st=state();
    box.innerHTML=catalog().map(function(k){return frameCard(k,st)}).join('');
  }

  function renderOwned(){
    var box=$('shOwn'); if(!box)return;
    var st=state();
    var rows=catalog().filter(function(k){return st.own&&st.own.indexOf(k.id)>=0}).map(function(k){
      var eq=st.eq===k.id;
      var how=k.price===0?'機台外框・預設免費':'機台外框・以 '+fmt(k.price)+' 虛擬籌碼兌換';
      var act=eq?'<span class="st">使用中</span>':'<button type="button" class="st" data-act="use" data-id="'+k.id+'">使用</button>';
      return '<div class="ownRow" data-id="'+k.id+'"><div class="th" style="background-image:url('+pv(k.id)+')"></div><div class="tx"><b class="gt">'+k.name+'</b><small>'+how+'</small></div>'+act+'</div>';
    });
    box.innerHTML=rows.join('')||'<p class="skSec">尚無已擁有外框</p>';
    renderGal();
  }

  function renderGal(){
    var box=$('shGal'); if(!box)return;
    var G=window.CZGAL;
    if(!G){box.innerHTML='';return}
    var n=G.count(), T=G.total, rows='';
    var list=typeof G.inspect==='function'?G.inspect():[];
    list.forEach(function(m){
      var cells=m.cells.map(function(c){
        if(c.ok) return '<div><span><img src="'+c.src+'" alt=""></span><em>'+c.name+'</em></div>';
        return '<div><span class="lk">？</span><em>'+c.name+'</em></div>';
      }).join('');
      rows+='<div class="galRow"><b>'+m.name+'</b><div class="cells">'+cells+'</div></div>';
    });
    box.innerHTML='<div class="galH">'+
      '<img class="sc" src="assets/lx/scroll.webp" alt="">'+
      '<div class="tx"><b class="gt">角色圖鑑</b><small>由遊玩各機台解鎖插圖。機台頁的圖鑑入口仍可使用。</small></div>'+
      '<div class="n">'+n+' / '+T+'</div></div>'+
      '<div class="galRows">'+rows+'</div>';
    box.onclick=function(){if(G.open)G.open()};
  }

  function act(kind,id){
    var api=shop();
    if(kind==='ask'||kind==='buy'||kind==='use'){
      if(typeof api.act==='function'){
        api.act(kind,id);
        // skinshop msg() looks for #shMsg or machine shMsg — we have #shMsg
        paint();
        return;
      }
    }
  }

  function bind(){
    D.addEventListener('click',function(e){
      var b=e.target.closest('[data-act]');
      if(!b||!D.getElementById('shop')||!b.closest('#shop'))return;
      var kind=b.dataset.act, id=b.dataset.id;
      if(kind==='ask'){
        var k=catalog().find(function(x){return x.id===id});
        if(!k)return;
        if(chips()<k.price){msg('虛擬籌碼不足，還差 '+fmt(k.price-chips())+'（可透過遊戲、每日簽到或免費領取取得）','err');return}
        b.dataset.act='buy';
        b.textContent='確認兌換 '+fmt(k.price)+'？';
        msg('再按一次確認，以 '+fmt(k.price)+' 虛擬籌碼兌換「'+k.name+'」');
        return;
      }
      act(kind,id);
      paint();
    });
  }

  function paint(){
    bal();
    renderFrames();
    renderOwned();
    // restore confirm buttons are rebuilt; message kept
  }

  function hookBack(){
    var prev=window.dfpBack;
    window.dfpBack=function(){
      try{if(D.querySelector('dialog[open]')){var d=D.querySelector('dialog[open]');d.close();return true}}catch(e){}
      location.href='index.html';
      return true;
    };
    if(typeof prev==='function'){/* shop page always returns to lobby */}
  }

  foot();
  showTab(tabOf());
  bind();
  hookBack();
  if(window.CZ&&CZ.on)CZ.on(function(){bal();});
  paint();
})();
