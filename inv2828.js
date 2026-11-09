/* 龍運金殿 v28.30: 邀請階梯紅包加大（每日分享邀請 1／3／5 次階梯；純虛擬・無兌現） */
(function(){if(!window.CZ)return;var LS=localStorage,K='dfp_iv',$=function(i){return document.getElementById(i)};
var AL='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',TI=[{n:1,r:150},{n:3,r:300},{n:5,r:500}],CD=15000;
function dk(){var d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()}
function code(){var s;try{s=JSON.parse(LS.getItem('fs_inv')||'{}')}catch(e){s={}}if(!/^FS-[A-Z2-9]{6}$/.test(s.code||'')){var c='',r=new Uint32Array(6);try{crypto.getRandomValues(r)}catch(e){for(var i=0;i<6;i++)r[i]=Math.random()*1e9}for(var j=0;j<6;j++)c+=AL[r[j]%AL.length];s.code='FS-'+c;try{LS.setItem('fs_inv',JSON.stringify(s))}catch(e){}}return s.code}
function st(){var s;try{s=JSON.parse(LS.getItem(K)||'{}')}catch(e){s={}}if(!s||s.d!==dk())s={d:dk(),n:0,c:[],t:0};if(!Array.isArray(s.c))s.c=[];return s}
function sv(s){try{LS.setItem(K,JSON.stringify(s))}catch(e){}}
function snd(n){try{window.sfx&&window.sfx(n)}catch(e){}}
var wk=document.querySelector('.wk'),top=document.querySelector('.top');if(!wk&&!top)return;
var bn=document.createElement('button');bn.className='ivb';bn.id='ivB';bn.innerHTML='<span class="ive" aria-hidden="true"><img src="assets/lx/ev_gift.webp?v=2848" alt="" width="128" height="128"></span><span class="ivt"><b>邀請階梯</b><small id="ivBs"></small></span><span class="ivg">前往</span>';
if(wk)wk.parentNode.insertBefore(bn,wk.nextSibling);else top.parentNode.insertBefore(bn,top.nextSibling);
var d=document.createElement('dialog');d.id='dIv';d.setAttribute('aria-labelledby','ivT');
d.innerHTML='<h3 id="ivT">邀請階梯</h3><div class="ivc"><small>我的邀請碼</small><b id="ivCode"></b><div class="iva"><button class="btn hot" id="ivShare">分享邀請</button><button class="btn" id="ivCopy">複製邀請碼</button></div><p class="ivm" id="ivM" role="status"></p></div>'+
'<div class="ivp"><i><u id="ivBar"></u></i><span id="ivN"></span></div><div class="ivl" id="ivL"></div>'+
'<p class="note">每日分享邀請達 1／3／5 次可領階梯紅包（每次分享間隔 15 秒才計入），0 點重置<br>好友輸入你的邀請碼可在機台內「邀請好友」領 300<br>虛擬籌碼僅供娛樂・純虛擬・無兌現・不可轉讓或交易</p><div class="frs"><button class="btn close" id="ivX">關閉</button></div>';
document.body.appendChild(d);
function render(){var s=st(),mx=TI[TI.length-1].n,ready=0;$('ivCode').textContent=code();
 $('ivL').innerHTML=TI.map(function(t,i){var got=s.c.indexOf(i)>=0,ok=s.n>=t.n;if(ok&&!got)ready++;return '<div class="ivi'+(got?' got':ok?' ok':'')+'"><span class="ivs">'+t.n+' 次</span><b>＋'+t.r+'</b><button class="btn'+(ok&&!got?' hot':'')+'" data-iv="'+i+'"'+(ok&&!got?'':' disabled')+'>'+(got?'已領取':ok?'領取':'未達成')+'</button></div>'}).join('');
 $('ivN').textContent='今日已分享 '+Math.min(s.n,mx)+' / '+mx+' 次';$('ivBar').style.width=(Math.min(s.n,mx)/mx*100)+'%';
 $('ivBs').textContent=ready?('有 '+ready+' 個紅包可領'):(s.c.length>=TI.length?'今日階梯已全部領完':'分享 1／3／5 次領紅包');
 bn.classList.toggle('has',ready>0||s.n<mx)}
function msg(t){$('ivM').textContent=t}
function count(){var s=st(),now=Date.now();if(now-(s.t||0)<CD){msg('已分享！再過幾秒的分享才會計入次數');return}s.t=now;s.n++;sv(s);msg('已計入今日分享 '+s.n+' 次');render()}
$('ivShare').onclick=async function(){snd(1);var t='來玩龍運金殿！輸入我的邀請碼 '+code()+' 可領 300 虛擬籌碼（僅供娛樂・18+・純虛擬・無兌現）https://fso870109.github.io/dragon-fortune-palace/';
 if(navigator.share){try{await navigator.share({title:'龍運金殿',text:t});count();return}catch(e){if(e.name==='AbortError')return}}
 try{await navigator.clipboard.writeText(t);msg('已複製分享文字，貼給好友吧');count()}catch(e){msg('目前裝置不支援分享，請複製邀請碼')}};
$('ivCopy').onclick=async function(){snd(1);try{await navigator.clipboard.writeText(code());msg('已複製邀請碼 '+code())}catch(e){msg('請長按邀請碼手動複製')}};
$('ivL').onclick=function(e){var b=e.target.closest('[data-iv]');if(!b||b.disabled)return;var i=+b.getAttribute('data-iv'),s=st(),t=TI[i];if(s.c.indexOf(i)>=0||s.n<t.n)return;s.c.push(i);sv(s);CZ.addChips(t.r);CZ.vib(20);CZ.toast('邀請階梯紅包 ＋'+t.r,'assets/lx/ev_gift.webp?v=2848');snd(2);render()};
bn.onclick=function(){snd(1);CZ.vib(8);render();d.showModal()};$('ivX').onclick=function(){snd(1);d.close()};
render();window.DFPiv={render:render}})();
