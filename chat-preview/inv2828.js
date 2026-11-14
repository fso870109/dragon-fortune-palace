/* 龍運金殿 v28.91: 邀請階梯紅包（每日分享 1／3 次領 ＋1000／＋2000；連線後新玩家用好友碼加入再領 ＋5000；純虛擬・無兌現；＋金額不斷行） */
(function(){if(!window.CZ)return;var LS=localStorage,K='dfp_iv',RK='dfp_ref',$=function(i){return document.getElementById(i)};
var AL='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',TI=[{n:1,r:1000},{n:3,r:2000}],CD=15000,RR=5000,RCAP=5;
function dk(){var d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()}
function normRef(s){s=String(s||'').toUpperCase().replace(/\s+/g,'');if(/^DF[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$/.test(s))s='DF-'+s.slice(2);return /^DF-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$/.test(s)?s:''}
function captureRef(){try{var q=normRef(new URLSearchParams(location.search).get('ref'));if(q){LS.setItem(RK,JSON.stringify({code:q,t:Date.now()}));return q}}catch(e){}try{var s=JSON.parse(LS.getItem(RK)||'{}');return normRef(s.code)}catch(e){}return ''}
var REF=captureRef();
function code(){var s;try{s=JSON.parse(LS.getItem('fs_inv')||'{}')}catch(e){s={}}if(!/^FS-[A-Z2-9]{6}$/.test(s.code||'')){var c='',r=new Uint32Array(6);try{crypto.getRandomValues(r)}catch(e){for(var i=0;i<6;i++)r[i]=Math.random()*1e9}for(var j=0;j<6;j++)c+=AL[r[j]%AL.length];s.code='FS-'+c;try{LS.setItem('fs_inv',JSON.stringify(s))}catch(e){}}return s.code}
function st(){var s;try{s=JSON.parse(LS.getItem(K)||'{}')}catch(e){s={}}if(!s||s.d!==dk())s={d:dk(),n:0,c:[],t:0};if(!Array.isArray(s.c))s.c=[];return s}
function sv(s){try{LS.setItem(K,JSON.stringify(s))}catch(e){}}
function snd(n){try{window.sfx&&window.sfx(n)}catch(e){}}
function liveOn(){return !!(window.DFPfb&&DFPfb.live&&DFPfb.invitesOk&&DFPfb.profile)}
function friendCode(){return (window.DFPfb&&DFPfb.profile&&DFPfb.profile.friendCode)||''}
function shareUrl(){var u='https://fso870109.github.io/dragon-fortune-palace/',fc=friendCode();return fc?(u+(u.indexOf('?')>=0?'&':'?')+'ref='+encodeURIComponent(fc)):u}
var wk=document.querySelector('.wk'),top=document.querySelector('.top');if(!wk&&!top)return;
var bn=document.createElement('button');bn.className='ivb';bn.id='ivB';bn.innerHTML='<span class="ive" aria-hidden="true"><img src="assets/lx/ev_gift.webp?v=2848" alt="" width="128" height="128"></span><span class="ivt"><b>邀請階梯</b><small id="ivBs"></small></span><span class="ivg">前往</span>';
if(wk)wk.parentNode.insertBefore(bn,wk.nextSibling);else top.parentNode.insertBefore(bn,top.nextSibling);
var d=document.createElement('dialog');d.id='dIv';d.setAttribute('aria-labelledby','ivT');
d.innerHTML='<h3 id="ivT">邀請階梯</h3><div class="ivc"><small>我的邀請碼</small><b id="ivCode"></b><small id="ivFc" class="ivfc" hidden></small><div class="iva"><button class="btn hot" id="ivShare">分享邀請</button><button class="btn" id="ivCopy">複製邀請碼</button></div><p class="ivm" id="ivM" role="status"></p></div>'+
'<div class="ivp"><i><u id="ivBar"></u></i><span id="ivN"></span></div><div class="ivl" id="ivL"></div>'+
'<div class="ivreal"><h4>好友加入 <span class="ivamt">＋'+RR+'</span></h4><p class="note" id="ivRealN"></p><div class="ivrl" id="ivRealL"></div></div>'+
'<p class="note">每日分享邀請達 1／3 次可領階梯紅包 <span class="ivamt">＋1000／＋2000</span>（每次分享間隔 15 秒才計入），0 點重置<br>新玩家點你分享的邀請並用好友碼加入，<span class="ivamt">你可再領 ＋'+RR+'</span>（每日最多 '+RCAP+' 位，連線後開放）<br>好友輸入你的邀請碼可在機台內「邀請好友」領 300<br>虛擬籌碼僅供娛樂・純虛擬・無兌現・不可轉讓或交易</p><div class="frs"><button class="btn close" id="ivX">關閉</button></div>';
document.body.appendChild(d);
var liveInv={ok:false,rows:[],claimedToday:0,cap:RCAP,reward:RR};
function face(av,n){if(window.DFPface)return DFPface(av,n);return String(n||'?').slice(0,1)}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function paintReal(){var box=$('ivRealL'),note=$('ivRealN');if(!box||!note)return;
 if(!liveInv.ok){note.innerHTML='新玩家用你的好友碼加入，<span class="ivamt">你可領 ＋'+RR+'</span>（每日最多 '+RCAP+' 位）。連線好友準備中，此獎勵先不開放。';box.innerHTML='<div class="ivi"><span class="ivs">好友加入</span><b>＋'+RR+'</b><button class="btn" disabled>未開放</button></div>';return}
 note.innerHTML='新玩家點你分享的邀請並用好友碼加入，<span class="ivamt">你可領 ＋'+RR+'</span>。今日已領 '+liveInv.claimedToday+' / '+liveInv.cap+'。';
 if(!liveInv.rows.length){box.innerHTML='<p class="ivm">還沒有新玩家用你的好友碼加入。</p>';return}
 var full=liveInv.claimedToday>=liveInv.cap;
 box.innerHTML=liveInv.rows.map(function(r){var got=!!r.claimed,dis=got||full;return '<div class="ivri'+(got?' got':'')+'"><span class="fav" aria-hidden="true">'+face(r.avatar,r.displayName)+'</span><div class="n"><b>'+esc(r.displayName||'新好友')+'</b><small>＋'+liveInv.reward+'</small></div><button class="btn'+(dis?'':' hot')+'" data-ivr="'+esc(r.id)+'"'+(dis?' disabled':'')+'>'+(got?'已領取':full?'今日已滿':'領取')+'</button></div>'}).join('')}
function render(){var s=st(),mx=TI[TI.length-1].n,ready=0;$('ivCode').textContent=code();
 var fc=friendCode(),el=$('ivFc');if(el){if(fc){el.hidden=false;el.textContent='好友碼 '+fc+'（邀請會帶上這個碼）'}else{el.hidden=true;el.textContent=''}}
 $('ivL').innerHTML=TI.map(function(t,i){var got=s.c.indexOf(i)>=0,ok=s.n>=t.n;if(ok&&!got)ready++;return '<div class="ivi'+(got?' got':ok?' ok':'')+'"><span class="ivs">'+t.n+' 次</span><b>＋'+t.r+'</b><button class="btn'+(ok&&!got?' hot':'')+'" data-iv="'+i+'"'+(ok&&!got?'':' disabled')+'>'+(got?'已領取':ok?'領取':'未達成')+'</button></div>'}).join('');
 $('ivN').textContent='今日已分享 '+Math.min(s.n,mx)+' / '+mx+' 次';$('ivBar').style.width=(Math.min(s.n,mx)/mx*100)+'%';
 var pend=liveInv.ok?liveInv.rows.filter(function(r){return !r.claimed}).length:0;
 var card=ready?('有 '+ready+' 個紅包可領'):(pend?('有 '+pend+' 位好友加入可領 ＋\u2060'+RR):(s.c.length>=TI.length?'今日分享階梯已領完':'分享 1／3 次領 ＋\u20601000／＋\u20602000'));
 $('ivBs').textContent=card;
 bn.classList.toggle('has',ready>0||pend>0||s.n<mx);
 paintReal()}
function msg(t){$('ivM').textContent=t||''}
function count(){var s=st(),now=Date.now();if(now-(s.t||0)<CD){msg('已分享！再過幾秒的分享才會計入次數');return}s.t=now;s.n++;sv(s);msg('已計入今日分享 '+s.n+' 次');render()}
function refreshLive(){if(!liveOn()||!window.DFPfb.listInviteRewards){liveInv={ok:false,rows:[],claimedToday:0,cap:RCAP,reward:RR};render();return Promise.resolve()}
 return DFPfb.listInviteRewards().then(function(x){liveInv={ok:true,rows:(x&&x.rows)||[],claimedToday:(x&&x.claimedToday)|0,cap:(x&&x.cap)||RCAP,reward:(x&&x.reward)||RR};render()}).catch(function(){liveInv={ok:false,rows:[],claimedToday:0,cap:RCAP,reward:RR};render()})}
$('ivShare').onclick=async function(){snd(1);var t='來玩龍運金殿！輸入我的邀請碼 '+code()+' 可領 300 虛擬籌碼（僅供娛樂・18+・純虛擬・無兌現）'+shareUrl();
 if(navigator.share){try{await navigator.share({title:'龍運金殿',text:t});count();return}catch(e){if(e.name==='AbortError')return}}
 try{await navigator.clipboard.writeText(t);msg('已複製分享文字，貼給好友吧');count()}catch(e){msg('目前裝置不支援分享，請複製邀請碼')}};
$('ivCopy').onclick=async function(){snd(1);try{await navigator.clipboard.writeText(code());msg('已複製邀請碼 '+code())}catch(e){msg('請長按邀請碼手動複製')}};
$('ivL').onclick=function(e){var b=e.target.closest('[data-iv]');if(!b||b.disabled)return;var i=+b.getAttribute('data-iv'),s=st(),t=TI[i];if(s.c.indexOf(i)>=0||s.n<t.n)return;s.c.push(i);sv(s);CZ.addChips(t.r);CZ.vib(20);CZ.toast('邀請階梯紅包 ＋'+t.r,'assets/lx/ev_gift.webp?v=2848');snd(2);render()};
$('ivRealL').onclick=function(e){var b=e.target.closest('[data-ivr]');if(!b||b.disabled||!liveOn()||!DFPfb.claimInviteReward)return;var id=b.getAttribute('data-ivr');b.disabled=true;
 DFPfb.claimInviteReward(id).then(function(r){var v=(r&&r.reward)|0||RR;CZ.addChips(v);CZ.vib(20);CZ.toast('好友加入獎勵 ＋'+v,'assets/lx/ev_gift.webp?v=2848');try{CZ.track&&CZ.track('iv')}catch(e){}snd(2);msg('已領取好友加入獎勵 ＋'+v);refreshLive()}).catch(function(err){var k=err&&err.message;msg(k==='limit'?'今日邀請獎勵已達上限':k==='claimed'?'已經領過了':'領取沒有成功，請稍後再試');refreshLive()})};
bn.onclick=function(){snd(1);CZ.vib(8);render();d.showModal();if(liveOn())refreshLive()};$('ivX').onclick=function(){snd(1);d.close()};
if(REF){var inp=$('frIn');if(inp&&!inp.value)inp.value=REF}
render();
function goLive(){if(!window.DFPfb||!DFPfb.ready)return false;DFPfb.ready.then(function(ok){if(!ok||!DFPfb.live||!DFPfb.invitesOk)return;refreshLive()}).catch(function(){});return true}
if(!goLive()){var n=0,iv=setInterval(function(){if(goLive()||++n>80)clearInterval(iv)},50)}
window.DFPiv={render:render,refresh:refreshLive}})();
