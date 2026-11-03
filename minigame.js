/* v17.8 bonus pick mini-game. RTP-neutral: replaces the fixed scatter pay (6/25/125x total) with
   3 picks drawn without replacement from 9 values whose 3-pick mean equals the same pay exactly. */
(function(){
if(!window.CZM)return;
const VAL={3:[1,1,1,2,2,2,3,3,3],4:[4,4,4,8,8,8,13,13,13],5:[20,20,20,40,40,40,65,65,65]};
const TH={love:['戀愛禮物','選三份禮物吧♡','letter'],matsuri:['撈金魚','撈三隻金魚吧！','goldfish'],caishen:['搶紅包','選 3 個紅包！','hongbao'],
 samurai:['軍功獎賞','選三枚家紋！','kamon'],pirate:['寶箱開啟','打開三個寶箱！','chest'],neko:['福袋大作戰','選 3 個福袋喵！','bag'],sakura:['花吹雪','選三朵櫻花','sakura'],queen:['女王的珠寶盒','選三顆寶石吧','diamond'],school:['學園祭攤位抽獎','抽三張抽獎券！','star'],jungle:['遺跡寶箱','打開三個遺跡寶箱！','chest']};
const id=CZM.id,t=TH[id]||['BONUS PICK','選三個吧','scatter'];
let pend=null;
window.CZMG={draw(sc){const k=Math.min(sc,5),v=VAL[k].slice();for(let i=v.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[v[i],v[j]]=[v[j],v[i]]}
  const sum=v[0]+v[1]+v[2];pend={k,v,sum};return{sum}},
 play(total,cb){const p=pend;pend=null;if(!p){cb();return}
  const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;const o=document.createElement('div');o.id='czMG';
  o.innerHTML=`<div class="mgbox"><div class="mgt">${t[0]}</div><div class="mgs">${t[1]}</div><div class="mgg">${Array.from({length:9},(_,i)=>`<button class="mgc" data-i="${i}" aria-label="選擇 ${i+1}"><img src="assets/${id}/t_${t[2]}.webp?v=191" alt=""><b></b></button>`).join('')}</div><div class="mgr">已選 <b id="mgN">0</b>/3　合計 <b id="mgS">×0</b></div><button class="mgok" hidden>進入免費旋轉</button><div class="mgn">僅供娛樂・虛擬籌碼</div></div>`;
  document.body.appendChild(o);let n=0,s=0,done=false;const cards=[...o.querySelectorAll('.mgc')],order=[];
  const fin=()=>{if(done)return;done=true;let r=3;cards.forEach(c=>{if(!c.classList.contains('open')){c.classList.add('open','rest');c.querySelector('b').textContent='×'+p.v[r++]}});
   o.querySelector('.mgr').innerHTML=`獲得 <b>×${p.sum}</b> ＝ <b>${(p.sum*total).toLocaleString()}</b> 虛擬籌碼`;const ok=o.querySelector('.mgok');ok.hidden=false;ok.onclick=close;auto=setTimeout(close,4000)};
  const close=()=>{clearTimeout(auto);o.classList.add('out');setTimeout(()=>{o.remove();cb()},RM?0:300)};
  const pickC=c=>{if(done||c.classList.contains('open'))return;const val=p.v[n];n++;s+=val;c.classList.add('open');c.querySelector('b').textContent='×'+val;
   window.sfx&&sfx.win&&sfx.win(1);CZ.vib&&CZ.vib(25);o.querySelector('#mgN').textContent=n;o.querySelector('#mgS').textContent='×'+s;if(n>=3)setTimeout(fin,RM?0:600)};
  cards.forEach(c=>c.onclick=()=>{clearTimeout(auto);auto=setTimeout(autoPick,7000);pickC(c)});
  const autoPick=()=>{const c=cards.find(c=>!c.classList.contains('open'));if(c&&!done){pickC(c);auto=setTimeout(autoPick,700)}};
  let auto=setTimeout(autoPick,9000);}
};
const _fi=window.fsIntro;
window.fsIntro=function(re){if(re||!pend)return _fi.apply(this,arguments);const tb=((typeof FS!=='undefined'&&FS&&FS.bet)||1)*(typeof NL!=='undefined'?NL:20);CZMG.play(tb,()=>_fi.call(this,re))};
})();
