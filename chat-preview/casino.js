/* 龍運金殿 v28.84 大廳/選單金殿圖示； shared layer — PLAY MONEY ONLY (僅供娛樂・虛擬籌碼・純虛擬・無兌現) */
(()=>{
const LS=localStorage,J=(k,d)=>{try{const v=JSON.parse(LS.getItem(k));return v==null?d:v}catch(e){return d}},S=(k,v)=>{try{LS.setItem(k,JSON.stringify(v))}catch(e){}};
const IN_M=!!window.CZM,RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const JP={seed:[500,5000,500000],name:['小獎','大獎','頭獎'],c:0.008,split:[.3,.3,.4],w:[.745,.25,.005],d:200000};/* v28.31 頭獎底注×10、輪盤頭獎權重×0.1；jp_rtp≈2.86% */
const VIP=[[1,'一般會員','#c9c3d6'],[5,'銅卡會員','#e0915a'],[10,'銀卡會員','#dfe6f2'],[20,'金卡會員','#ffd27a'],[35,'白金會員','#bff4ff'],[50,'鑽石會員','#ff9de0']];
const MACH={love:'夜色戀曲♡',matsuri:'夏祭花火',caishen:'財神降臨'};
const need=l=>Math.round(400*Math.pow(l,1.45));
const today=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
const MISS=[{id:'spin',t:'今日旋轉 50 次',g:50,r:300},{id:'won',t:'今日累積贏得 2,000 籌碼',g:2000,r:400},{id:'fs',t:'觸發 1 次免費旋轉',g:1,r:500},{id:'mach',t:'今日玩過 2 台不同機台',g:2,r:300},{id:'big',t:'達成 1 次大獎以上',g:1,r:600}];
const MIDS=['matsuri','samurai','neko','sakura'];
const ACH=[
['s10','初轉金殿','累計旋轉 10 次',80,'spin',1,10,'spins'],
['s100','常客','累計旋轉 100 次',300,'spin',2,100,'spins'],
['s1000','千轉金殿','累計旋轉 1,000 次',500,'spin',2,1000,'spins'],
['s10k','萬轉金殿','累計旋轉 10,000 次',800,'spin',3,10000,'spins'],
['s100k','十萬金輪','累計旋轉 100,000 次',1500,'spin',3,100000,'spins'],
['s1m','百萬金轉','累計旋轉 1,000,000 次',2800,'spin',4,1000000,'spins','百萬金轉'],
['first','初次中獎','第一次贏得籌碼',100,'win',1,1,'first'],
['w100k','累積十萬','累計贏得 100,000 籌碼',350,'win',2,100000,'won'],
['big','大獎！','首次大獎',450,'win',2,1,'big'],
['xr30','三十倍風光','單次贏得總押注 30 倍以上',550,'win',2,30,'xr'],
['jp','彩金得主','首次抽中彩金',900,'win',3,1,'jp'],
['w1m','累積百萬','累計贏得 1,000,000 籌碼',1100,'win',3,1000000,'won'],
['epic','傳說','單次贏得總押注 80 倍以上',1600,'win',3,80,'xr'],
['w10m','累積千萬','累計贏得 10,000,000 籌碼',1900,'win',3,10000000,'won'],
['xr5k','五千倍金輝','單次贏得總押注 5,000 倍以上',2800,'win',4,5000,'xr','五千倍金輝'],
['all','三館都到','玩過其中三台機台',200,'mach',1,3,'mach'],
['all4','四館都到','四台機台都玩過',350,'mach',2,4,'mach'],
['mmats','花火百轉','在夏祭花火累計旋轉 100 次',400,'mach',2,100,'ms_matsuri'],
['msamu','布武百轉','在天下布武累計旋轉 100 次',400,'mach',2,100,'ms_samurai'],
['mneko','招財百轉','在招財大作戰累計旋轉 100 次',400,'mach',2,100,'ms_neko'],
['msaku','櫻斬百轉','在櫻花斬累計旋轉 100 次',400,'mach',2,100,'ms_sakura'],
['mall1k','四館千轉','四台機台各累計旋轉 1,000 次',1300,'mach',3,4,'ms1k'],
['fs1','免費初開','觸發 1 次免費旋轉',120,'feat',1,1,'fs'],
['buy','直通免費次數','首次購買免費旋轉',180,'feat',1,1,'buy'],
['hs1','寶珠初遇','觸發 1 次寶珠對碰',200,'feat',1,1,'hs'],
['tw1','旋風初起','觸發 1 次旋風聚寶',200,'feat',1,1,'tw'],
['pl1','彈珠初試','觸發 1 次幸運彈珠',200,'feat',1,1,'pl'],
['mx1','狂熱初現','觸發 1 次狂熱倍數',200,'feat',1,1,'mx'],
['fs10','免費十連','觸發 10 次免費旋轉',450,'feat',2,10,'fs'],
['feat4','特色齊全','寶珠對碰、旋風聚寶、幸運彈珠、狂熱倍數都觸發過',900,'feat',3,4,'feat4'],
['fs100','免費百開','觸發 100 次免費旋轉',1300,'feat',3,100,'fs'],
['g1','初開圖鑑','解鎖 1 張圖鑑',100,'gal',1,1,'gal'],
['g6','圖鑑六張','解鎖 6 張圖鑑',350,'gal',2,6,'gal'],
['g12','圖鑑十二','解鎖 12 張圖鑑',800,'gal',3,12,'gal'],
['g24','圖鑑全收','解鎖全部 24 張圖鑑',2500,'gal',4,24,'gal','圖鑑全收'],
['d1','初來簽到','簽到 1 天',80,'sign',1,1,'dstreak'],
['d7','七日連續','連續簽到 7 天',350,'sign',2,7,'dstreak'],
['d30','三十日連續','連續簽到 30 天',800,'sign',3,30,'dstreak'],
['d100','百日連續','連續簽到 100 天',1500,'sign',3,100,'dstreak'],
['d365','全年連續','連續簽到 365 天',2800,'sign',4,365,'dstreak','全年連續'],
['f2','換上新框','擁有 2 款外框',150,'frame',1,2,'frame'],
['f6','六框在手','擁有 6 款外框',800,'frame',3,6,'frame'],
['f12','十二框全','集齊全部 12 款外框',2800,'frame',4,12,'frame','十二框全'],
['gf1','收到紅包','收到好友紅包 1 次',100,'social',1,1,'gf'],
['rd1','初試掠奪','成功掠奪 1 次',150,'social',1,1,'rd'],
['rv1','初次回擊','成功回擊 1 次',180,'social',1,1,'rv'],
['gd1','公會立功','領取公會任務獎勵 1 次',200,'social',1,1,'gd'],
['gf10','回送十份','回送好友紅包 10 次',400,'social',2,10,'gs'],
['rv10','十次回擊','成功回擊 10 次',550,'social',2,10,'rv'],
['iv1','邀請一位','真實邀請 1 位新玩家',650,'social',2,1,'iv'],
['iv5','邀請五位','真實邀請 5 位新玩家',1100,'social',3,5,'iv'],
['iv20','邀請二十','真實邀請 20 位新玩家',2500,'social',4,20,'iv','邀請二十'],
['lv5','銅卡在身','達到 Lv.5',150,'lv',1,5,'lv'],
['lv10','銀卡晉升','達到 Lv.10',450,'lv',2,10,'lv'],
['lv20','金卡加身','達到 Lv.20',1000,'lv',3,20,'lv'],
['lv50','鑽石殿主','達到 Lv.50',2500,'lv',4,50,'lv','鑽石殿主'],
['wk1','主題日初領','領取 1 次主題日紅包',80,'week',1,1,'wk'],
['wk7','主題七日','累計領取 7 次主題日紅包',350,'week',2,7,'wk'],
['wkAll','主題日全領','七種主題日紅包都領過',900,'week',3,7,'wkd'],
['wk365','主題全年','累計領取 365 次主題日紅包',2500,'week',4,365,'wk','主題全年']
].map(function(x){return {id:x[0],t:x[1],d:x[2],r:x[3],c:x[4],tier:x[5],g:x[6],k:x[7],bd:x[8]||''}});
let st=J('cz_st',null);if(!st||typeof st!=='object')st={xp:0,lv:1,spins:0,won:0,ach:{},mach:{},free:0,feed:[]};
st.ach=st.ach||{};st.mach=st.mach||{};st.feed=st.feed||[];st.acl=st.acl||{};st.ax=st.ax||{};if(!st._achM){Object.keys(st.ach).forEach(function(k){if(st.ach[k]&&!st.acl[k])st.acl[k]=st.ach[k]});st._achM=1}
function day(){if(!st.d||st.d.date!==today())st.d={date:today(),spin:0,won:0,fs:0,mach:[],big:0,cl:{}};return st.d}
let svT=0;const save=()=>{if(svT)return;svT=setTimeout(()=>{svT=0;S('cz_st',st)},400)};addEventListener('pagehide',()=>S('cz_st',st));
function pools(){let p=J('cz_jp',null);if(!Array.isArray(p)||p.length!==3)p=JP.seed.slice();for(let i=0;i<3;i++)if(!(p[i]>=JP.seed[i]))p[i]=JP.seed[i];return p}
let P=pools(),pT=0;const saveP=()=>{if(pT)return;pT=setTimeout(()=>{pT=0;S('cz_jp',P)},500)};addEventListener('pagehide',()=>S('cz_jp',P));
const getBal=()=>typeof bal==='number'?bal:(+(LS.getItem('fs_bal')??1000)||0);
function addChips(v){if(typeof bal==='number'){bal+=v;ui()}else S('fs_bal',getBal()+v);emit()}
const vipOf=l=>{let r=VIP[0];for(const v of VIP)if(l>=v[0])r=v;return r};
const ls=new Set();function emit(){ls.forEach(f=>{try{f()}catch(e){}})}
const vib=p=>{try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}};
function stripMoji(s){try{return String(s||'').replace(/[\u2600-\u27BF\u2B00-\u2BFF\uFE0E\uFE0F\u200D\u{1F000}-\u{1FAFF}]/gu,'').replace(/\s+/g,' ').trim()}catch(e){return String(s||'').replace(/[\u2600-\u27BF\u2B00-\u2BFF\uFE0F]|[\uD83C-\uDBFF][\uDC00-\uDFFF]/g,'').replace(/\s+/g,' ').trim()}}
const TOAST_ICO={task:'assets/lx/i_task.webp?v=2848',trophy:'assets/lx/i_trophy.webp?v=2848',cal:'assets/lx/i_cal.webp?v=2848',gift:'assets/lx/i_gift.webp?v=2848',scroll:'assets/lx/scroll.webp?v=2848',guild:'assets/lx/i_guild.webp?v=2848',evGift:'assets/lx/ev_gift.webp?v=2848',evPacket:'assets/lx/ev_packet.webp?v=2848',evFriends:'assets/lx/ev_friends.webp?v=2848',evCastle:'assets/lx/ev_castle.webp?v=2848',evRaid:'assets/lx/ev_raid.webp?v=2848',evCounter:'assets/lx/ev_counter.webp?v=2848',dragon:'assets/lx/dragon.webp?v=2848'};
function toastIco(title,ic){if(typeof ic==='string'&&ic&&ic.indexOf('.')>=0)return ic;const t=title||'';if(/圖鑑/.test(t))return TOAST_ICO.scroll;if(/任務/.test(t))return TOAST_ICO.task;if(/成就/.test(t))return TOAST_ICO.trophy;if(/簽到/.test(t))return TOAST_ICO.cal;if(/升級/.test(t))return TOAST_ICO.dragon;if(/免費/.test(t))return TOAST_ICO.gift;if(/邀請|加入獎勵|階梯/.test(t))return TOAST_ICO.evGift;if(/回擊/.test(t))return TOAST_ICO.evCounter;if(/掠奪/.test(t))return TOAST_ICO.evRaid;if(/公會/.test(t))return TOAST_ICO.evCastle;if(/好友|回送/.test(t))return TOAST_ICO.evFriends;if(/紅包|禮物/.test(t))return TOAST_ICO.evPacket;return TOAST_ICO.gift}
function toastHost(){let w=document.getElementById('czToast');if(!w){w=document.createElement('div');w.id='czToast';w.setAttribute('role','status');w.setAttribute('aria-live','polite')}const dlg=document.querySelector('dialog[open]'),dest=dlg||document.body;if(w.parentNode!==dest)dest.appendChild(w);return w}
const toastQ=[];
function toastMore(){const host=toastHost();let more=host.querySelector('.cztMore');const n=toastQ.length;if(n<=0){if(more)more.remove();return}if(!more){more=document.createElement('div');more.className='czt cztMore';more.setAttribute('role','status');host.appendChild(more)}more.textContent='另有 '+n+' 則'}
function toastShow(e){const host=toastHost();host.appendChild(e);setTimeout(function(){if(e.parentNode)e.remove();const n=toastQ.shift();if(n)toastShow(n);else toastMore()},3200);toastMore()}
function toast(t,ic,opt){if(ic&&typeof ic==='object'&&!Array.isArray(ic)){opt=ic;ic=''}opt=opt||{};let raw=stripMoji(t);let title=opt.title?stripMoji(opt.title):'';let detail=opt.detail?stripMoji(opt.detail):'';let amt=opt.amt!=null&&opt.amt!==''?String(opt.amt):'';if(!amt){const m=raw.match(/[＋+](\d[\d,]*)\s*(籌碼)?/);if(m){amt='＋'+m[1];raw=raw.replace(m[0],'').trim()}}if(!detail){const q=raw.match(/「([^」]+)」/);if(q){detail=q[1];raw=raw.replace(q[0],'').trim()}}raw=raw.replace(/^[！!]+/,'').replace(/[！!]+$/,'').trim();if(!title){if(/^任務完成/.test(raw)){title='任務完成';raw=raw.replace(/^任務完成/,'').trim()}else if(/^成就達成/.test(raw)){title='成就達成';raw=raw.replace(/^成就達成/,'').trim()}else if(/^升級/.test(raw)){title='升級';raw=raw.replace(/^升級/,'').trim()}else if(/^簽到成功/.test(raw)){title='簽到成功';raw=raw.replace(/^簽到成功/,'').trim()}else if(/^免費籌碼/.test(raw)){title='免費籌碼';raw=raw.replace(/^免費籌碼/,'').trim()}else if(/^圖鑑/.test(raw)){title='圖鑑解鎖';raw=raw.replace(/^圖鑑解鎖|^圖鑑/,'').trim()}else{title=raw;raw=''}}raw=raw.replace(/^[！!、，。\s]+/,'').replace(/[！!]+$/,'').trim();if(!detail&&raw)detail=raw;title=stripMoji(title)||'金殿';detail=stripMoji(detail).replace(/^[！!、，。\s]+/,'').replace(/[！!]+$/,'');const src=toastIco(title+(detail?' '+detail:''),ic);const e=document.createElement('div');e.className='czt';const shine=document.createElement('span');shine.className='cztShine';shine.setAttribute('aria-hidden','true');e.appendChild(shine);const seal=document.createElement('span');seal.className='cztSeal';const im=document.createElement('img');im.src=src;im.alt='';im.width=32;im.height=32;im.onerror=function(){this.onerror=null;this.src=TOAST_ICO.gift};seal.appendChild(im);e.appendChild(seal);const tx=document.createElement('span');tx.className='cztTxt';const tb=document.createElement('b');tb.className='cztT';tb.textContent=title;tx.appendChild(tb);if(detail){const sm=document.createElement('small');sm.className='cztD';sm.textContent=detail;tx.appendChild(sm)}if(opt.progress&&opt.progress.length>=2){const a=+opt.progress[0]||0,n=+opt.progress[1]||1;const bar=document.createElement('span');bar.className='cztBar';const iel=document.createElement('i');iel.style.width='0';bar.appendChild(iel);tx.appendChild(bar);requestAnimationFrame(function(){setTimeout(function(){iel.style.width=Math.max(0,Math.min(100,a/n*100))+'%'},40)});if(!amt)amt=a+' / '+n}e.appendChild(tx);if(amt){const em=document.createElement('em');em.className='cztAmt';em.textContent=amt;e.appendChild(em)}const vis=toastHost().querySelectorAll('.czt:not(.cztMore)').length;if(vis>=2){toastQ.push(e);toastMore()}else toastShow(e)}
/* v28.117 chat preview: structured big-win log for the lobby marquee (local; lobby uploads with rate limit) */
function bwLog(r){try{const q=J('dfp_bw',[]);r.ts=Date.now();q.unshift(r);q.length=Math.min(q.length,6);S('dfp_bw',q)}catch(e){}}
function feed(t){st.feed.unshift({t,ts:Date.now()});st.feed.length=Math.min(st.feed.length,12);save()}
function ax(){return st.ax||(st.ax={})}
function frameN(){try{const s=J('fs_skin',{});const o=Array.isArray(s.own)?s.own.slice():[];if(o.indexOf('gold')<0)o.push('gold');return o.length}catch(e){return 1}}
function galN(){try{return (window.CZGAL&&CZGAL.count())||0}catch(e){return 0}}
function msN(id){const m=ax().ms||{};return m[id]||0}
function progOf(a){const x=ax(),k=a.k;if(k==='spins')return st.spins||0;if(k==='won')return Math.floor(st.won||0);if(k==='xr')return x.xr||0;if(k==='first')return ((st.won||0)>0||st.ach.first)?1:0;if(k==='big')return x.big||0;if(k==='jp')return x.jp||0;if(k==='mach')return MIDS.filter(id=>st.mach&&st.mach[id]).length;if(k==='ms_matsuri')return msN('matsuri');if(k==='ms_samurai')return msN('samurai');if(k==='ms_neko')return msN('neko');if(k==='ms_sakura')return msN('sakura');if(k==='ms1k')return MIDS.filter(id=>msN(id)>=1000).length;if(k==='buy')return x.buy||(st.ach.buy?1:0);if(k==='fs')return x.fs||0;if(k==='hs')return x.hs||0;if(k==='tw')return x.tw||0;if(k==='pl')return x.pl||0;if(k==='mx')return x.mx||0;if(k==='feat4')return [x.hs,x.tw,x.pl,x.mx].filter(v=>v>0).length;if(k==='gal')return galN();if(k==='dstreak')return Math.max(x.dstreak||0,(function(){try{return J('fs_daily',{}).life||0}catch(e){return 0}})());if(k==='frame')return frameN();if(k==='gf')return x.gf||0;if(k==='gs')return x.gs||0;if(k==='gd')return x.gd||0;if(k==='rd')return x.rd||0;if(k==='rv')return x.rv||0;if(k==='iv')return x.iv||0;if(k==='lv')return st.lv||1;if(k==='wk')return x.wk||0;if(k==='wkd')return Object.keys(x.wkd||{}).length;return x[k]||0}
function scanAch(quiet){ACH.forEach(a=>{if(!st.ach[a.id]&&progOf(a)>=a.g)ach(a.id,quiet)})}
function track(k,n){if(n==null)n=1;const x=ax();if(k==='wkd'){x.wkd=x.wkd||{};x.wkd[String(n)]=1;save();scanAch();emit();return}x[k]=(x[k]||0)+(+n||0);save();scanAch();emit()}
function trackSign(life,total){const x=ax();x.dstreak=Math.max(x.dstreak||0,life||0);x.dsign=Math.max(x.dsign||0,total||0);save();scanAch();emit()}
function trackFeat(name){if(name==='旋風聚寶')track('tw');else if(name==='幸運彈珠')track('pl');else if(name==='狂熱倍數')track('mx')}
function bootSign(){try{const s=J('fs_daily',{});const life=s.life||s.streak||0;if(life)ax().dstreak=Math.max(ax().dstreak||0,life)}catch(e){}}
function ach(id,quiet){if(st.ach[id])return;const a=ACH.find(x=>x.id===id);if(!a)return;st.ach[id]=Date.now();if(!quiet)toast('成就達成「'+a.t+'」','assets/lx/i_trophy.webp?v=2848');feed('成就「'+a.t+'」');save();emit()}
function claimAch(id,quiet){const a=ACH.find(x=>x.id===id);if(!a||!st.ach[id]||st.acl[id])return false;st.acl[id]=Date.now();addChips(a.r);if(!quiet)toast('成就獎勵「'+a.t+'」＋'+a.r,'assets/lx/i_trophy.webp?v=2848');if(a.bd)ax().title=a.bd;save();emit();return true}
function unclaimed(){return ACH.filter(a=>st.ach[a.id]&&!st.acl[a.id]).length}
function claimAllAchs(){const list=ACH.filter(a=>st.ach[a.id]&&!st.acl[a.id]);if(!list.length)return {n:0,total:0};let total=0;list.forEach(a=>{if(st.acl[a.id])return;st.acl[a.id]=Date.now();addChips(a.r);total+=a.r;if(a.bd)ax().title=a.bd});if(total){toast('成就獎勵','assets/lx/i_trophy.webp?v=2848',{title:'成就獎勵',detail:'一次領取 '+list.length+' 項',amt:'＋'+total});save();emit()}return {n:list.length,total}}
function addXP(x){st.xp+=x;let up=0;while(st.xp>=need(st.lv)){st.xp-=need(st.lv);st.lv++;up++;const r=100*st.lv;addChips(r);toast(`升級！Lv.${st.lv}（${vipOf(st.lv)[1]}）＋${r} 籌碼`);vib([20,40,20])}
 if(up){feed(`升級到 Lv.${st.lv}`);scanAch()}save();emit()}
const FREE_MS=3*3600e3,freeAmt=()=>300+50*VIP.indexOf(vipOf(st.lv));
const freeLeft=()=>Math.max(0,(st.free||0)+FREE_MS-Date.now());
function claimFree(){if(freeLeft()>0)return false;st.free=Date.now();const v=freeAmt();addChips(v);toast(`免費籌碼 ＋${v}`);vib(15);save();return true}
function claimMission(id,quiet){const d=day(),m=MISS.find(x=>x.id===id);if(!m||d.cl[id])return false;const v=id==='mach'?d.mach.length:d[id];if(v<m.g)return false;d.cl[id]=1;addChips(m.r);if(!quiet)toast(`任務完成「${m.t}」＋${m.r}`);save();emit();return true}
function missReady(){const d=day();return MISS.filter(m=>{if(d.cl[m.id])return false;const v=m.id==='mach'?d.mach.length:d[m.id];return v>=m.g})}
function claimAllMissions(){const list=missReady();if(!list.length)return {n:0,total:0};const d=day();let total=0;list.forEach(m=>{if(d.cl[m.id])return;const v=m.id==='mach'?d.mach.length:d[m.id];if(v<m.g)return;d.cl[m.id]=1;addChips(m.r);total+=m.r});if(total){toast('任務獎勵','assets/lx/i_task.webp?v=2848',{title:'任務獎勵',detail:'一次領取 '+list.length+' 項',amt:'＋'+total});save();emit()}return {n:list.length,total}}
// sample leaderboard — fake players, clearly labelled
const SAMPLE=[['夜櫻美香',2860400],['Kaito★',1980300],['財神使者',1544800],['最愛煙火',1203000],['LuckyNeko',986500],['賞月兔',742000],['紅包王',530900],['Yuki_88',401200]];
window.CZ={st,JP,VIP,MISS,ACH,MACH,need,vipOf,pools:()=>P,getBal,addChips,claimFree,freeLeft,freeAmt,claimMission,claimAllMissions,missReady,day,on:f=>ls.add(f),sample:SAMPLE,toast,vib,feed,save,ach,claimAch,claimAllAchs,scanAch,track,trackSign,trackFeat,prog:progOf,unclaimed,
 onBet(total){for(let i=0;i<3;i++)P[i]+=total*JP.c*JP.split[i];saveP();if(Math.random()<total/JP.d)pend=total},
 onSettle(o){if(window.CZAUTO&&CZAUTO.on&&(o.sc>=3||o.xr>=10||(pend&&!o.free)))CZAUTO.stop();const d=day();st.spins++;d.spin++;const x=ax();
  if(o.won>0){st.won+=o.won;d.won+=o.won}
  if(o.sc>=3){d.fs++;x.fs=(x.fs||0)+1}
  if(o.big){d.big++;x.big=(x.big||0)+1}
  if((o.xr||0)>0)x.xr=Math.max(x.xr||0,o.xr);
  if(IN_M){st.mach[CZM.id]=1;if(!d.mach.includes(CZM.id))d.mach.push(CZM.id);x.ms=x.ms||{};x.ms[CZM.id]=(x.ms[CZM.id]||0)+1}
  scanAch();
  if(o.xr>=10)feed(`${IN_M?CZM.name:''} ${o.xr>=80?'傳說大獎':o.xr>=30?'超級大獎':'大獎'} ${Math.round(o.won).toLocaleString()}`);
  if(o.xr>=30&&IN_M)bwLog({m:CZM.id,w:Math.round(o.won),x:Math.round(o.xr*10)/10});
  if(!o.free)addXP(Math.max(1,Math.round(o.total/4)));else save();
  if(pend&&!o.free){const t=pend;pend=0;waitIdle(()=>CZ.wheel(t))}emit()}};bootSign();scanAch(true);
let pend=0;
function idle(){return typeof spinning!=='undefined'&&!spinning&&!bwState&&!FS&&!document.querySelector('dialog[open]')}
function waitIdle(f){const k=()=>{if(idle())f();else setTimeout(k,300)};setTimeout(k,600)}
// ===== jackpot wheel =====
const SEG=[0,1,0,0,1,0,0,2,0,0,1,0,0,1,0,0,1,0,0,0];// 14 MINI, 5 MAJOR, 1 GRAND (visual; actual odds JP.w ≈74.5/25/0.5)
function wheelEl(){let w=document.getElementById('czWheel');if(w)return w;w=document.createElement('div');w.id='czWheel';w.setAttribute('role','dialog');w.setAttribute('aria-label','彩金轉盤');
 const cols=['#3a0a2c','#8a1a5c','#d9a441'];const g=SEG.map((s,i)=>`${cols[s]} ${i*18}deg ${(i+1)*18}deg`).join(',');
 w.innerHTML=`<img class="czframe" src="assets/lobby/frame_s.webp?v=239" alt=""><div class="czwbox"><div class="czwt">彩金機會!!</div><div class="czwsub">彩金轉盤</div><div class="czwheel"><div class="czwd" style="background:conic-gradient(${g})">${SEG.map((s,i)=>`<span style="transform:rotate(${i*18+9}deg)"><b class="s${s}">${JP.name[s]}</b></span>`).join('')}</div><div class="czwhub">彩金</div><div class="czwptr"></div></div><div class="czwres" aria-live="assertive"></div><button class="czwgo">旋轉轉盤</button></div>`;
 document.body.appendChild(w);return w}
function wheel(total){window.__hold=true;const w=wheelEl(),d=w.querySelector('.czwd'),btn=w.querySelector('.czwgo'),res=w.querySelector('.czwres');
 res.textContent='';d.style.transition='none';d.style.transform='rotate(0deg)';w.classList.add('on');btn.disabled=false;btn.textContent='旋轉轉盤';vib([30,40,30]);
 try{sfx.chime&&sfx.chime()}catch(e){}
 btn.onclick=()=>{btn.disabled=true;const r=Math.random();const k=r<JP.w[0]?0:r<JP.w[0]+JP.w[1]?1:2;
  const idx=SEG.map((s,i)=>s===k?i:-1).filter(i=>i>=0);const i=idx[Math.random()*idx.length|0];
  const rot=(RM?360:360*6)+(360-(i*18+9))+(Math.random()*10-5);
  requestAnimationFrame(()=>{d.style.transition=`transform ${RM?.6:4.6}s cubic-bezier(.12,.7,.1,1)`;d.style.transform=`rotate(${rot}deg)`});
  setTimeout(()=>{const amt=Math.floor(P[k]);P[k]=JP.seed[k];S('cz_jp',P);res.innerHTML=`<b>${JP.name[k]}彩金</b> ＋${amt.toLocaleString()}`;vib([80,50,80,50,200]);
   ax().jp=(ax().jp||0)+1;scanAch();feed(`${JP.name[k]}彩金 ${amt.toLocaleString()}`);if(k>=1&&IN_M)bwLog({m:CZM.id,w:amt,x:0,jp:k});
   setTimeout(()=>{w.classList.remove('on');bal+=amt;ui();$('win').textContent=amt;window.__hold=false;
    bigWin(amt,total,{tier:['epic',JP.name[k]+'彩金','彩金大獎!! 恭喜'],lbl:'彩金池・虛擬籌碼',noStamp:1});emit()},1400)},RM?700:4800)}}
window.CZ.wheel=wheel;
// ===== machine-only UI =====
function machineUI(){const $=id=>document.getElementById(id),mach=$('machine');
 // 大獎 cutscene (user art) before big wins / bonus / jackpot
 const at=document.createElement('div');at.id='czAtari';at.setAttribute('role','dialog');at.setAttribute('aria-label','大獎');
 at.innerHTML='<div class="ab"></div><div class="ai"></div><div class="asw"></div><div class="apt"></div><img class="afr" src="assets/lobby/frame_s.webp?v=239" alt=""><div class="atx"><b></b><i></i></div><div class="askip">點擊略過</div>';
 document.body.appendChild(at);const pt=at.querySelector('.apt');for(let i=0;i<16;i++){const e=document.createElement('u');e.style.left=(Math.random()*100)+'%';e.style.animationDelay=(-Math.random()*2.4)+'s';e.style.animationDuration=(2+Math.random()*1.6)+'s';e.style.setProperty('--dx',(Math.random()*120-60)+'px');pt.appendChild(e)}
 function sting(){try{if(typeof ac==='undefined'||!ac)return;if(window.DFPvol&&!DFPvol.sfxOn())return;const t=ac.currentTime,g=ac.createGain();const dest=(typeof AM!=='undefined'&&AM&&AM.sfxG)||ac.destination;g.gain.value=.5*(dest===ac.destination&&window.DFPvol?DFPvol.sfx():1);g.connect(dest);
  [[523,0],[659,.08],[784,.16],[1047,.24],[1568,.36]].forEach(([f,d])=>{const o=ac.createOscillator(),e=ac.createGain();o.type='triangle';o.frequency.value=f;e.gain.setValueAtTime(0,t+d);e.gain.linearRampToValueAtTime(.18,t+d+.02);e.gain.exponentialRampToValueAtTime(.001,t+d+.9);o.connect(e).connect(g);o.start(t+d);o.stop(t+d+1)});
  const n=ac.createBufferSource(),b=ac.createBuffer(1,ac.sampleRate*.6,ac.sampleRate),c=b.getChannelData(0);for(let i=0;i<c.length;i++)c[i]=(Math.random()*2-1)*Math.pow(1-i/c.length,3);n.buffer=b;const ng=ac.createGain();ng.gain.value=.25;n.connect(ng).connect(g);n.start(t)}catch(e){}}
 let atCb=null,atT=0;
 function atari(txt,sub,cb){window.__hold=true;atCb=cb;at.querySelector('.atx b').textContent=txt;at.querySelector('.atx i').textContent=sub||'';
  at.className='';void at.offsetWidth;at.className='on'+(RM?' rm':'');vib([40,40,80]);sting();clearTimeout(atT);atT=setTimeout(atEnd,RM?900:1700)}
 function atEnd(){if(!at.classList.contains('on')||at.classList.contains('out'))return;clearTimeout(atT);window.__hold=false;const f=atCb;atCb=null;f&&f();setTimeout(()=>{at.classList.add('out');setTimeout(()=>{at.className=''},280)},420)}
 at.addEventListener('pointerdown',atEnd);addEventListener('keydown',e=>{if(at.classList.contains('on')&&(e.key===' '||e.key==='Enter'||e.key==='Escape')){e.preventDefault();e.stopPropagation();atEnd()}},true);
 CZ.atari=atari;
 (window.requestIdleCallback||setTimeout)(()=>{['assets/'+CZM.id+'/p_bigwin.webp?v=281','assets/'+CZM.id+'/p_bigwin_bl.webp?v=281','assets/lobby/frame_s.webp?v=239',`assets/${CZM.id}/hero.webp?v=239`,`assets/${CZM.id}/cutin.webp?v=239`].forEach(u=>{const i=new Image();i.src=u;i.decode&&i.decode().catch(()=>{})})},{timeout:2500});
 const _bw=window.bigWin;window.bigWin=function(won,total,o={}){if(o.noStamp)return _bw(won,total,o);const x=won/total;
  atari(o.tier?o.tier[1]:x>=50?'傳說大獎':x>=25?'超級大獎':'大獎',o.tier?o.tier[2]:x>=50?'龍運降臨!!':x>=25?'金殿狂歡!!':'好運降臨!!',()=>_bw(won,total,o))};
 const _fi=window.fsIntro;window.fsIntro=function(re){if(re)return _fi(re);atari('免費次數!!','免費次數 開始',()=>_fi(re))};
 const _wh=CZ.wheel;CZ.wheel=function(t){atari('彩金','大獎機會!!',()=>_wh(t))};
 // gold-sakura frame on win tiers
 const bwEl=$('bw');if(bwEl){const f=document.createElement('img');f.className='czframe';f.src='assets/lobby/frame_s.webp?v=239';f.alt='';bwEl.appendChild(f)}
 const sp=$('spinBtn');sp.addEventListener('pointerdown',()=>vib(12),{passive:true});
 // control bar: move existing controls into one flex bar
 const bar=document.createElement('div');bar.className='czbar';
 const L=document.createElement('div');L.className='czL';L.innerHTML=`<a class="czbtn" id="czLobby" href="index.html" aria-label="回到大廳"><i class="czIco czIco-home" aria-hidden="true"></i><span>大廳</span></a><div class="czlv" id="czLv"><b></b><i><u></u></i></div>`;
 const C=document.createElement('div');C.className='czC';
 const Rr=document.createElement('div');Rr.className='czR';
 const mC=document.createElement('div');mC.className='czm czmC';mC.innerHTML='<small>CREDIT</small><b id="czCred">0</b>';
 const mW=document.createElement('div');mW.className='czm czmW';mW.innerHTML='<small>WIN</small><b id="czWin">0</b>';
 const ob=document.querySelector('.info .box:nth-child(2)');ob.style.visibility='hidden';const betBox=document.createElement('div');betBox.className='box czbet';betBox.innerHTML='<small>BET ×20</small><b id="czBet">0</b>';
 C.append(mC,betBox,document.querySelector('.controls'),mW);
 Rr.append($('max16'),$('menuBtn'));bar.append(L,C,Rr);
 const note=document.querySelector('.sub');const nb=document.createElement('div');nb.className='cznote';nb.textContent=note?note.textContent:'僅供娛樂・虛擬籌碼・純虛擬・無兌現';if(note)note.remove();
 mach.append(bar,nb);
 {// v18.1 AUTO spin (play-money)
 const ab=document.createElement('button');ab.id='czAuto';ab.className='czauto';ab.type='button';ab.setAttribute('aria-label','自動旋轉');ab.innerHTML='<b>自動</b><i></i>';
 document.querySelector('.czbar .controls').appendChild(ab);
 const pk=document.createElement('div');pk.id='czAutoPk';pk.hidden=true;pk.innerHTML='<p>自動旋轉次數</p>'+[10,25,50,100,'∞'].map(n=>`<button type="button" data-n="${n}">${n}</button>`).join('');document.body.appendChild(pk);
 const AU=window.CZAUTO={n:0,on:false,stop(){AU.on=false;AU.n=0;document.body.classList.remove('czau');ab.classList.remove('run');ab.lastChild.textContent=''},
  start(n){AU.on=true;AU.n=n;document.body.classList.add('czau');ab.classList.add('run');lab();tick()}};
 const lab=()=>{ab.lastChild.textContent=AU.n===Infinity?'∞':AU.n};
 ab.addEventListener('click',e=>{e.stopPropagation();vib(10);if(AU.on){AU.stop();return}pk.hidden=!pk.hidden;if(!pk.hidden){const r=ab.getBoundingClientRect();pk.style.left=Math.max(6,Math.min(innerWidth-pk.offsetWidth-6,r.right-pk.offsetWidth))+'px';pk.style.top=Math.max(6,r.top-pk.offsetHeight-8)+'px'}});
 pk.addEventListener('click',e=>{const n=e.target.dataset&&e.target.dataset.n;if(!n)return;pk.hidden=true;AU.start(n==='∞'?Infinity:+n)});
 addEventListener('pointerdown',e=>{if(!pk.hidden&&!pk.contains(e.target)&&e.target!==ab)pk.hidden=true},true);
 const cv=document.createElement('div');cv.id='czAuStop';cv.setAttribute('aria-label','停止自動旋轉');document.body.appendChild(cv);const pos=()=>{const r=sp.getBoundingClientRect();Object.assign(cv.style,{left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px'})};addEventListener('resize',pos);cv.addEventListener('click',e=>{e.stopPropagation();vib(10);AU.stop()});
 const ovl=()=>['czWheel','czAtari','czMG','bw'].some(i=>{const e=document.getElementById(i);return e&&getComputedStyle(e).display!=='none'&&getComputedStyle(e).visibility!=='hidden'&&(e.classList.contains('on')||e.classList.contains('show')||e.open||e.style.display==='flex'||e.style.display==='block')});
 function tick(){if(!AU.on)return;pos();if(spinning||bwState||window.__hold||(typeof FS!=='undefined'&&FS&&FS.left>0)||ovl()){setTimeout(tick,300);return}
  if(bal<BETS[betIdx]*NL){AU.stop();toast&&toast('籌碼不足，自動旋轉已停止');window.czChipDlg&&czChipDlg(bal<BETS[0]*NL?'low':'short');return}
  if(AU.n<=0){AU.stop();return}AU.n--;lab();spin();setTimeout(tick,500)}
 AU.tick=tick}
 const mir=(a,b)=>{const A=$(a),B=$(b);const f=()=>{B.textContent=A.textContent};f();new MutationObserver(f).observe(A,{childList:true,characterData:true,subtree:true})};mir('bal','czCred');mir('bet','czBet');mir('win','czWin');
 const lvR=()=>{const v=vipOf(st.lv);const e=$('czLv');e.querySelector('b').textContent=`Lv.${st.lv} ${v[1]}`;e.querySelector('b').style.color=v[2];e.querySelector('u').style.width=Math.min(100,st.xp/need(st.lv)*100)+'%'};lvR();CZ.on(lvR);
 /* buy-FS menu entry removed in v28.80; natural scatter FS untouched */
 // loading screen
 let ld=document.getElementById('czLoad');if(!ld){ld=document.createElement('div');ld.id='czLoad';ld.innerHTML=`<div class="czlt">${CZM.name}</div><div class="czlbar"><i></i></div><div class="czls">載入中…</div><div class="cznote2">僅供娛樂・虛擬籌碼・純虛擬・無兌現</div>`;document.body.appendChild(ld)}
 const imgs=[...document.images];let n=0;const tot=Math.max(1,imgs.length);const prog=()=>{n=imgs.filter(i=>i.complete).length;ld.querySelector('i').style.width=(20+80*n/tot)+'%'};
 const t0=performance.now();const iv=setInterval(prog,120);
 const done=()=>{clearInterval(iv);ld.querySelector('i').style.width='100%';setTimeout(()=>{ld.classList.add('out');setTimeout(()=>ld.remove(),500)},Math.max(0,450-(performance.now()-t0)))};
 if(document.readyState==='complete')done();else addEventListener('load',done,{once:true});
}
function czPreSym(){try{const pre=document.querySelector('.cell img.sym');if(!pre)return;const base=pre.getAttribute('src').replace(/t_[^/]*$/,'');const ids=new Set();(typeof SYM!=='undefined'?SYM:[]).forEach(s=>ids.add(s.id));if(typeof VAR!=='undefined')Object.values(VAR).flat().forEach(v=>ids.add(v));window.__symImg=[...ids].map(v=>{const i=new Image();i.src=base+'t_'+v+'.webp';i.decode&&i.decode().catch(()=>{});return i})}catch(e){}}
if(IN_M)addEventListener('load',czPreSym);
function czMenuFix(){document.documentElement.classList.add('czMach');const m=document.getElementById('menu16');if(m&&m.parentNode!==document.body)document.body.appendChild(m);const b=document.querySelector('.czbar');const set=()=>b&&document.documentElement.style.setProperty('--czbarH',Math.round(b.getBoundingClientRect().height)+'px');requestAnimationFrame(set);addEventListener('resize',set);document.getElementById('menuBtn')?.addEventListener('click',set);
 /* v28.61: keep page scroll put when 選單 opens; start the panel at its own top */
 let y=0,x=0,on=false;
 const pin=()=>{const cy=window.scrollY||document.documentElement.scrollTop||0,cx=window.scrollX||0;if(cy!==y||cx!==x)window.scrollTo(x,y)};
 const apply=()=>{const now=document.body.classList.contains('menu16');if(now===on)return;on=now;if(now){y=window.scrollY||document.documentElement.scrollTop||0;x=window.scrollX||0;set();if(m)m.scrollTop=0;pin();requestAnimationFrame(()=>{if(m)m.scrollTop=0;pin();requestAnimationFrame(pin)});setTimeout(pin,50);setTimeout(pin,200)}else{pin();requestAnimationFrame(pin)}};
 new MutationObserver(apply).observe(document.body,{attributes:true,attributeFilter:['class']})}
if(IN_M)addEventListener('load',czMenuFix);
function czHero(){const mach=document.getElementById('machine'),inn=mach&&mach.querySelector('.inner');if(!inn||document.getElementById('czHero'))return;
 const id=(location.pathname.split('/').pop()||'').replace('.html','');const V='?v=239';document.documentElement.style.setProperty('--czhero',`url(assets/${id}/hero.webp${V})`);document.documentElement.style.setProperty('--czbw',`url(assets/${id}/p_bigwin.webp?v=281)`);document.documentElement.style.setProperty('--czbwbl',`url(assets/${id}/p_bigwin_bl.webp?v=281)`);
 const h=document.createElement('div');h.id='czHero';h.setAttribute('aria-hidden','true');
 h.innerHTML=`<div class="czhi" style="background-image:url(assets/${id}/hero.webp${V})"></div><div class="czhs"></div><i class="czhp"></i><i class="czhp b"></i><img class="czhl" src="assets/${id}/logo.webp${V}" alt=""><div class="czhf"></div>`;
 mach.insertBefore(h,inn);
 /* v28.38 shared cabinet frame: crown / side rails / message band / base. Skins only swap art. */
 const stage=document.createElement('div');stage.id='cabStage';
 const well=document.createElement('div');well.id='cabWell';
 const frame=document.createElement('div');frame.id='cabFrame';frame.setAttribute('aria-hidden','true');
 frame.innerHTML='<i class="crown"></i><i class="rail l"></i><i class="rail r"></i><i class="base"></i><b class="lip"></b><i class="orn dragon"></i><i class="orn gem"></i><i class="orn crest"></i><i class="orn fanl"></i><i class="orn fanr"></i><i class="orn fanc"></i><i class="orn ll"></i><i class="orn lr"></i><i class="orn torii"></i><i class="orn wave"></i><i class="orn cld l"></i><i class="orn cld r"></i><i class="orn sk a"></i><i class="orn sk b"></i><i class="orn sk c"></i>';
 const band=document.createElement('div');band.id='cabBand';
 inn.parentNode.insertBefore(stage,inn);well.appendChild(inn);stage.append(well,band,frame);
 const msg=document.getElementById('msg'),msgHome=msg&&msg.parentNode;
 let F=null;const mq=matchMedia('(max-width:620px) and (orientation:portrait)');
 const probe=document.createElement('i');probe.setAttribute('aria-hidden','true');probe.style.cssText='position:absolute;left:0;top:0;height:0;visibility:hidden;pointer-events:none';document.documentElement.appendChild(probe);
 const px=n=>{probe.style.width='var('+n+')';return probe.offsetWidth||0};
 function unwrapMsg(){if(msg&&msgHome&&msg.parentNode!==msgHome)msgHome.appendChild(msg)}
 function parkMsg(){if(!msg)return;if(msg.classList.contains('czmq')){const t=msg.textContent;msg.classList.remove('czmq');msg.textContent=t;msg.style.cssText=''}if(msg.parentNode!==band)band.appendChild(msg)}
 /* v28.44: the message now rides on the base rail, so the reels take back the old message-row height (cells closer to their natural aspect) */
 function grow(on){const bd=document.getElementById('board');if(!bd)return;const rs=[...bd.querySelectorAll('.reel')];bd.style.removeProperty('height');rs.forEach(r=>r.style.removeProperty('--c'));if(!on||!rs.length)return;
  const i0=inn.getBoundingClientRect(),b0=bd.getBoundingClientRect(),c=rs[0].querySelector('.cell');if(!i0.width||!b0.height||!c)return;
  const ch0=c.getBoundingClientRect().height,rows=Math.max(1,Math.round(b0.height/ch0)),ex=px('--frame-msg')*b0.width/Math.max(140,innerWidth-2*(px('--frame-rail')||26));
  const cw=b0.width/rs.length,ch1=Math.min(cw*.96,ch0+ex/rows);if(!(ch1>ch0+.5))return;const k=i0.width/100;
  bd.style.setProperty('height',(b0.height*ch1/ch0/k).toFixed(3)+'cqw','important');rs.forEach(r=>r.style.setProperty('--c',(ch1/k).toFixed(3)+'cqw','important'))}
 const fit=()=>{const R=document.documentElement.style;
  if(!mq.matches){document.body.classList.remove('cab-on');unwrapMsg();R.removeProperty('--W');inn.style.cssText='';well.style.height='';grow(0);return}
  document.body.classList.add('cab-on');parkMsg();
  if(!F){grow(1);const i=inn.getBoundingClientRect(),b=document.getElementById('board').getBoundingClientRect();if(!i.width||!b.width)return;F={l:(b.left-i.left)/i.width,w:b.width/i.width,t:(b.top-i.top)/i.height,h:b.height/i.height,ar:i.height/i.width}}
  const rail=px('--frame-rail')||26,lip=1,vw=innerWidth,boardW=Math.max(140,vw-2*rail);
  const W=boardW/F.w,H=W*F.ar,boardTop=F.t*H,boardH=F.h*H,top=Math.max(0,boardTop-lip);
  const vis=Math.max(1,Math.round(boardTop+boardH+lip-top)),ml=Math.round(rail-F.l*W);
  R.setProperty('--W',Math.round(W)+'px');well.style.height=vis+'px';
  inn.style.cssText=`margin-left:${ml}px!important;margin-top:${-Math.round(top)}px!important;margin-bottom:0!important;clip-path:none!important`};
 if(msg){let mt=0;const mchk=()=>{msg.classList.remove('cbmq');if(!document.body.classList.contains('cab-on'))return;const d=msg.scrollWidth-msg.clientWidth;if(d>1){msg.style.setProperty('--mqd',(-(d+10))+'px');msg.style.setProperty('--mqt',Math.max(3,(d+10)/26).toFixed(1)+'s');msg.classList.add('cbmq')}};new MutationObserver(()=>{cancelAnimationFrame(mt);mt=requestAnimationFrame(mchk)}).observe(msg,{childList:true,characterData:true,subtree:true});addEventListener('resize',()=>requestAnimationFrame(mchk));setTimeout(mchk,600)}
 requestAnimationFrame(()=>requestAnimationFrame(fit));addEventListener('resize',()=>{fit()});addEventListener('load',()=>{F=null;fit()});mq.addEventListener&&mq.addEventListener('change',()=>{F=null;fit()})}
if(IN_M){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',czHero);else czHero()}
if(IN_M){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',machineUI);else machineUI()}
})();
/* v18.0 cross-tab / cross-page credit sync (play-money balance in fs_bal) */
(function(){const sync=()=>{try{const r=localStorage.getItem('fs_bal');if(r===null||r==='')return;const v=+r;if(!isFinite(v)||v<0)return;
 if(typeof bal==='number'&&typeof spinning!=='undefined'){if(spinning||(typeof FS!=='undefined'&&FS)||(typeof bwState!=='undefined'&&bwState))return;if(v!==bal){bal=v;typeof ui==='function'&&ui()}}
 else if(typeof refresh==='function')refresh()}catch(e){}};
 addEventListener('storage',e=>{if(e.key==='fs_bal'||e.key==='cz_st')sync()});document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync()});addEventListener('pageshow',sync)})();
