/* 龍運金殿 v255: saved-data guard. Must load first. Repairs corrupted/out-of-range localStorage
   values (truncated writes, old versions, manual edits) before any game script reads them, so a bad
   value can never crash a page, show NaN/Infinity chips, or break audio. Valid data is never touched.
   v28.160: Google 帳號雲端存檔（本機部分）。進度白名單、待套用的雲端存檔（重新整理前寫入 sessionStorage，
   在任何遊戲程式讀取前套用）、localStorage 寫入攔截（白名單鍵值改變時標記待上傳）。雲端讀寫在 cs28160.js。 */
(function(){var LS;try{LS=window.localStorage;LS.getItem('x')}catch(e){return}
var CS_KEYS=['fs_stats','fs_inv','fs_daily','fs_skin','fs_ad','cz_st','cz_gal','cz_jp','dfp_bw','dfp_bw_best','dfp_fr','dfp_fr_live','dfp_gd','dfp_gd_live','dfp_rd','dfp_rd_live','dfp_iv','dfp_theme','dfp_stk_own','dfp_r139','dfp_name'];
var CS_RE=/^cz(TW|TK|HS|HC)_(matsuri|samurai|neko|sakura)$/,META='dfp_cs_meta',DIRTY='dfp_cs_dirty',DEF_BAL=1000,MAXV=32768,MAXT=480000;
function csKey(k){return k==='fs_bal'||CS_KEYS.indexOf(k)>=0||CS_RE.test(k)}
var SP=Storage.prototype,oGet=SP.getItem,oSet=SP.setItem,oRem=SP.removeItem,oClr=SP.clear,oKey=SP.key,mute=0;
function lsKeys(){var a=[];for(var i=0;i<LS.length;i++){var k=oKey.call(LS,i);if(k!=null)a.push(k)}return a}
function readMeta(){try{var m=JSON.parse(oGet.call(LS,META)||'null');return m&&typeof m==='object'&&typeof m.uid==='string'?m:null}catch(e){return null}}
/* 套用雲端存檔：先移除本機所有白名單鍵，再寫入雲端內容（雲端沒有的鍵就回到預設） */
function applySnap(P){if(!P||typeof P!=='object'||!P.data||typeof P.data!=='object')return false;mute++;
 try{lsKeys().forEach(function(k){if(csKey(k))oRem.call(LS,k)});
  var b=Math.floor(+P.bal);oSet.call(LS,'fs_bal',String(isFinite(b)&&b>=0?Math.min(b,1e12):DEF_BAL));
  Object.keys(P.data).forEach(function(k){var v=P.data[k];if(k!=='fs_bal'&&csKey(k)&&typeof v==='string'&&v.length<=MAXV)oSet.call(LS,k,v)});
  if(P.uid)oSet.call(LS,META,JSON.stringify({uid:String(P.uid),rev:P.rev|0,at:Date.now()}));
  oRem.call(LS,DIRTY);return true}catch(e){return false}finally{mute--}}
try{var pend=sessionStorage.getItem('dfp_cs_apply');if(pend){sessionStorage.removeItem('dfp_cs_apply');applySnap(JSON.parse(pend))}}catch(e){}
var fixed=[];function del(k){try{LS.removeItem(k);fixed.push(k)}catch(e){}}function put(k,v){try{LS.setItem(k,v);fixed.push(k)}catch(e){}}
function num(k,min,max,def,int){var r=LS.getItem(k);if(r===null)return;var v=r.trim()===''?NaN:+r;
 if(!isFinite(v)){def===null?del(k):put(k,String(def));return}
 var c=Math.min(max,Math.max(min,int?Math.floor(v):v));if(c!==v)put(k,String(c))}
function flag(k){var r=LS.getItem(k);if(r!==null&&r!=='0'&&r!=='1')del(k)}
function obj(k){var r=LS.getItem(k);if(r===null)return;var v;try{v=JSON.parse(r)}catch(e){v=null}
 if(!v||typeof v!=='object'||Array.isArray(v))del(k)}
try{
 num('fs_bal',0,1e12,1000,true);
 num('fs_bet',0,5,0,true);
 num('fs_mv',0,1,.5,false);num('fs_sv',0,1,.8,false);
 ['fs_sound','fs_music','fs_vib','fs_rm','cz_bgm','dfp_age18','czHelp21'].forEach(flag);
 ['fs_inv','fs_stats','fs_daily','fs_ad','fs_skin','cz_gal','cz_jp','cz_st','dfp_vol'].forEach(obj);
 for(var i=LS.length-1;i>=0;i--){var k=LS.key(i);if(!k)continue;
  if(/^cz(TW|TK)_/.test(k))obj(k);
  else if(/^czH[SC]_/.test(k))num(k,0,1e9,null,false)}
}catch(e){}
window.DFPstore={fixed:fixed};
function mark(){try{oSet.call(LS,DIRTY,String(Date.now()))}catch(e){}try{dispatchEvent(new Event('dfpcsdirty'))}catch(e){}}
SP.setItem=function(k,v){if(this===LS&&!mute){var key=String(k);if(csKey(key)){var old=oGet.call(LS,key);oSet.call(LS,key,v);if(old!==String(v))mark();return}}return oSet.apply(this,arguments)};
SP.removeItem=function(k){if(this===LS&&!mute){var key=String(k);if(csKey(key)){var had=oGet.call(LS,key)!==null;oRem.call(LS,key);if(had)mark();return}}return oRem.apply(this,arguments)};
function num(o,k){var v;try{v=JSON.parse(oGet.call(LS,k)||'null')}catch(e){v=null}return v&&typeof v==='object'?(+v[o]||0):0}
function snapshot(){var d={},tot=0,b=+oGet.call(LS,'fs_bal');lsKeys().sort().forEach(function(k){if(k==='fs_bal'||!csKey(k))return;var v=oGet.call(LS,k);if(typeof v!=='string'||v.length>MAXV||tot+v.length>MAXT)return;tot+=v.length;d[k]=v});
 var r=oGet.call(LS,'fs_bal');b=(r===null||r==='')?DEF_BAL:Math.floor(+r);if(!isFinite(b)||b<0)b=0;if(b>1e12)b=1e12;return {bal:b,data:d}}
/* 全新預設狀態：籌碼 1,000（或尚未建立）且從未轉動 */
function isFresh(){var r=oGet.call(LS,'fs_bal');var b=(r===null||r==='')?DEF_BAL:+r;return b===DEF_BAL&&num('spins','fs_stats')===0&&num('spins','cz_st')===0}
window.DFPcsLocal={keys:CS_KEYS.slice(),re:CS_RE,isKey:csKey,snapshot:snapshot,isFresh:isFresh,meta:readMeta,
 setMeta:function(m){try{oSet.call(LS,META,JSON.stringify(m))}catch(e){}},
 dirty:function(){return +(oGet.call(LS,DIRTY)||0)||0},
 clearDirty:function(at){try{var d=+(oGet.call(LS,DIRTY)||0)||0;if(!at||d<=at)oRem.call(LS,DIRTY)}catch(e){}},
 apply:applySnap,
 /* 給 cs28160.js：寫入 sessionStorage 後重新整理，由下一次載入的 store.js 在遊戲程式之前套用 */
 applyAndReload:function(P){try{sessionStorage.setItem('dfp_cs_apply',JSON.stringify(P));sessionStorage.setItem('dfp_cs_msg','restored');mute++;location.reload();return true}catch(e){mute=0;return applySnap(P)}},
 forget:function(){mute++;try{lsKeys().forEach(function(k){if(csKey(k)||k===META||k===DIRTY||k==='dfp_profile')oRem.call(LS,k)})}catch(e){}finally{mute--}}};
})();
