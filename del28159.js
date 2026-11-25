/* 龍運金殿 v28.159 刪除帳號對話框（大廳）：呼叫 DFPfb.deleteAccount()；其他頁面會導到 index.html?del=1 */
(function(){
var CSS='#dfpDel{border:0;padding:0;background:transparent;max-width:none;color:#ffeccb}#dfpDel::backdrop{background:rgba(6,2,2,.78)}'+
'#dfpDel .dC{width:min(92vw,360px);box-sizing:border-box;max-height:88vh;overflow:auto;padding:18px 16px 14px;border-radius:18px;background:linear-gradient(180deg,#3a0a0a,#1a0404);border:2px solid #e2b34f;box-shadow:0 0 0 1px #6b4410 inset,0 16px 44px rgba(0,0,0,.75);font-family:"Noto Sans TC","PingFang TC","Microsoft JhengHei","Heiti TC",sans-serif;line-height:1.55}'+
'#dfpDel h3{margin:0 0 8px;text-align:center;font-size:18px;letter-spacing:.08em;color:#ffd77a;font-family:inherit}'+
'#dfpDel p{margin:6px 0;font-size:14px}#dfpDel ul{margin:6px 0;padding-left:1.2em;font-size:13.5px;color:#e8cfa4}#dfpDel li{margin:2px 0}'+
'#dfpDel .dW{color:#ff9d7a;font-weight:700}#dfpDel .dS{font-size:12.5px;color:#cdb08a}#dfpDel .dS a{color:#ffd27a}'+
'#dfpDel label{display:flex;gap:8px;align-items:flex-start;margin:10px 0 4px;font-size:14px;cursor:pointer}#dfpDel label input{margin-top:4px;width:18px;height:18px;flex:none;accent-color:#e2b34f}'+
'#dfpDel .dB{display:flex;gap:10px;margin-top:12px}#dfpDel .dB button{flex:1;min-width:0;padding:10px 4px;border-radius:22px;font:inherit;font-weight:800;font-size:15px;cursor:pointer}'+
'#dfpDelNo{background:#2a0d0d;border:1px solid #c99a3a;color:#ffe9b0}#dfpDelYes{border:0;color:#2a0505;background:linear-gradient(180deg,#ffb4a0,#e0553a 55%,#9a2412);box-shadow:0 3px 0 #5a1208}'+
'#dfpDelYes:disabled{opacity:.45;cursor:not-allowed}#dfpDelMsg{min-height:1.4em;margin:10px 0 0;text-align:center;font-size:14px;color:#ffd77a;overflow-wrap:anywhere}#dfpDelMsg.err{color:#ff9d7a}';
var STEP={guild:'正在退出公會…',profile:'正在刪除個人檔案…',friends:'正在刪除好友資料…',gifts:'正在刪除送禮紀錄…',raids:'正在刪除掠奪紀錄…',invites:'正在刪除邀請紀錄…',boards:'正在刪除排行榜與聊天紀錄…',auth:'正在刪除帳號…'};
var MAIL='fso870109@gmail.com';
var d=null,busy=false;
function $(i){return document.getElementById(i)}
function build(){
 if(d)return d;
 var st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
 d=document.createElement('dialog');d.id='dfpDel';d.setAttribute('aria-labelledby','dfpDelT');
 d.innerHTML='<div class="dC"><h3 id="dfpDelT">刪除帳號與雲端資料</h3>'+
 '<p>確定要永久刪除你的帳號嗎？將會刪除：</p><ul>'+
 '<li>暱稱、大頭貼、好友碼與好友名單</li>'+
 '<li>公會成員資料、排行榜、聊天、大獎播報</li>'+
 '<li>送禮、掠奪、回擊與邀請紀錄</li>'+
 '<li>遊戲帳號（含已連結的 Google 登入）</li>'+
 '<li>本裝置上的遊戲進度與虛擬籌碼</li></ul>'+
 '<p class="dW">此動作無法復原，虛擬籌碼與收藏也無法找回。</p>'+
 '<p class="dS">網頁版的使用統計（Google Analytics）不含你的名稱，依設定保存 2 個月後自動刪除。無法在這裡刪除時，可改用 <a href="deletion.html">Email 申請刪除</a>。</p>'+
 '<label><input type="checkbox" id="dfpDelOk"><span>我了解刪除後無法復原</span></label>'+
 '<div class="dB"><button type="button" id="dfpDelNo">取消</button><button type="button" id="dfpDelYes" disabled>確定刪除</button></div>'+
 '<p id="dfpDelMsg" role="status" aria-live="polite"></p></div>';
 document.body.appendChild(d);
 $('dfpDelOk').onchange=function(){if(!busy)$('dfpDelYes').disabled=!this.checked};
 $('dfpDelNo').onclick=function(){if(busy)return;if($('dfpDelNo').dataset.done){location.replace('index.html');return}d.close()};
 d.addEventListener('cancel',function(e){if(busy)e.preventDefault()});
 $('dfpDelYes').onclick=run;
 return d;
}
function msg(t,err){var m=$('dfpDelMsg');m.textContent=t;m.className=err?'err':''}
function done(html){var m=$('dfpDelMsg');m.innerHTML=html;var y=$('dfpDelYes');y.hidden=true;var n=$('dfpDelNo');n.textContent='返回大廳';n.dataset.done='1';n.disabled=false;$('dfpDelOk').disabled=true}
function run(){
 if(busy||!$('dfpDelOk').checked)return;
 if(!window.DFPfb||!DFPfb.deleteAccount){msg('目前無法連線，請稍後再試，或改用 Email 申請刪除。',1);return}
 busy=true;$('dfpDelYes').disabled=true;$('dfpDelNo').disabled=true;$('dfpDelOk').disabled=true;msg('正在刪除…');
 DFPfb.deleteAccount(function(k){msg(STEP[k]||'正在刪除…')}).then(function(r){
  busy=false;
  if(r&&r.ok){done('帳號與雲端資料已刪除，本裝置的遊戲資料也已清除。');return}
  var id=(r&&r.uid)?String(r.uid):'';
  done('大部分資料已刪除，但仍有部分無法自動刪除。請來信 <a href="mailto:'+MAIL+'?subject='+encodeURIComponent('刪除帳號')+'" style="color:#ffd27a">'+MAIL+'</a>，附上這組編號：'+id.replace(/[^A-Za-z0-9]/g,'')+'，我們會在 30 日內處理。');
 }).catch(function(e){
  busy=false;$('dfpDelNo').disabled=false;$('dfpDelOk').disabled=false;$('dfpDelYes').disabled=!$('dfpDelOk').checked;
  var c=String((e&&(e.code||e.message))||'');
  if(/popup|cancel/i.test(c))msg('需要重新登入 Google 才能刪除，已取消。',1);
  else msg('刪除未完成，請確認網路後再試一次，或改用 Email 申請刪除。',1);
 });
}
window.DFPdel={open:function(){build();busy=false;$('dfpDelOk').checked=false;$('dfpDelYes').disabled=true;$('dfpDelYes').hidden=false;msg('');var n=$('dfpDelNo');n.textContent='取消';delete n.dataset.done;n.disabled=false;$('dfpDelOk').disabled=false;try{d.showModal()}catch(e){d.setAttribute('open','')}}};
try{if(/[?&]del=1\b/.test(location.search)&&window.DFP_DEL){var go=function(){setTimeout(function(){window.DFPdel.open()},400)};if(document.readyState==='complete')go();else addEventListener('load',go)}}catch(e){}
})();
