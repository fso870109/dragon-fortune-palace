/* 龍運金殿 v255: saved-data guard. Must load first. Repairs corrupted/out-of-range localStorage
   values (truncated writes, old versions, manual edits) before any game script reads them, so a bad
   value can never crash a page, show NaN/Infinity chips, or break audio. Valid data is never touched. */
(function(){var LS;try{LS=window.localStorage;LS.getItem('x')}catch(e){return}
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
window.DFPstore={fixed:fixed};})();
