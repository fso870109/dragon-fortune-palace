/* v28.80 in-house 贊助影片 (AdMob IDs reserved; SDK flag OFF until app 2.60) */
(function(){
if(window.DFPad)return;
var REWARD=200,DURATION=18;
var ADMOB={
  appId:'ca-app-pub-8660950914804865~4933470237',
  rewardedUnitId:'ca-app-pub-8660950914804865/6354363115'
};
var timer=null,playing=false,granted=false,onReward=null,rewardAmt=REWARD,dur=DURATION;

function sec(){
  var n=window.__adSec;
  if(n!=null&&isFinite(+n)&&+n>0)return +n;
  return DURATION;
}
function $(id){return document.getElementById(id)}
function build(){
  if($('dfpAd'))return;
  var el=document.createElement('div');
  el.id='dfpAd';el.hidden=true;
  el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-labelledby','dfpAdT');
  el.innerHTML='<div class="dfpAdBox" id="dfpAdPlay">'+
    '<div class="dfpAdHd" id="dfpAdT">贊助影片</div>'+
    '<div class="dfpAdVid" aria-hidden="true"><div class="dfpAdGlow"></div><div class="dfpAdOrn"></div>'+
    '<p class="dfpAdBrand">龍運金殿</p><p class="dfpAdTag">本片由金殿贊助</p>'+
    '<div class="dfpAdRing"><b id="dfpAdN">18</b><small>秒</small></div></div>'+
    '<div class="dfpAdProg"><i id="dfpAdBar"></i></div>'+
    '<p class="dfpAdHint" id="dfpAdHint">請看完贊助影片</p>'+
    '<button type="button" class="dfpAdBtn" id="dfpAdGo" disabled>請看完贊助影片</button></div>'+
    '<div class="dfpAdBox dfpAdRw" id="dfpAdRw" hidden>'+
    '<h2>獎勵到帳</h2>'+
    '<p class="dfpAdAmt">獲得 <b id="dfpAdAmt">200</b> 籌碼</p>'+
    '<p class="dfpAdNote">僅供娛樂・虛擬籌碼・純虛擬・無兌現</p>'+
    '<button type="button" class="dfpAdBtn" id="dfpAdOk">收下</button></div>';
  document.body.appendChild(el);
  $('dfpAdGo').onclick=function(){if(!playing||playing==='play')return;showReward()};
  $('dfpAdOk').onclick=function(){finish(true)};
}
function paint(left){
  var n=$('dfpAdN'),bar=$('dfpAdBar'),hint=$('dfpAdHint'),go=$('dfpAdGo');
  if(n)n.textContent=String(Math.max(0,Math.ceil(left)));
  if(bar)bar.style.width=Math.min(100,((dur-left)/dur)*100)+'%';
  if(left>0){
    if(hint)hint.textContent='請看完贊助影片';
    if(go){go.disabled=true;go.textContent='請看完贊助影片'}
  }else{
    if(hint)hint.textContent='觀看完成，可領取獎勵';
    if(go){go.disabled=false;go.textContent='領取獎勵'}
  }
}
function stopTick(){if(timer){clearInterval(timer);timer=null}}
function showReward(){
  stopTick();
  playing='done';
  var play=$('dfpAdPlay'),rw=$('dfpAdRw'),amt=$('dfpAdAmt');
  if(play)play.hidden=true;
  if(rw)rw.hidden=false;
  if(amt)amt.textContent=String(rewardAmt);
  try{$('dfpAdOk').focus()}catch(e){}
}
function close(){
  stopTick();playing=false;
  var el=$('dfpAd');if(el)el.hidden=true;
  document.documentElement.classList.remove('dfpAdOn');
}
function finish(ok){
  if(ok&&!granted){
    granted=true;
    try{onReward&&onReward(rewardAmt)}catch(e){}
  }
  close();
}
function startInHouse(){
  build();
  dur=sec();granted=false;playing='play';
  var play=$('dfpAdPlay'),rw=$('dfpAdRw'),el=$('dfpAd');
  if(play)play.hidden=false;if(rw)rw.hidden=true;if(el)el.hidden=false;
  document.documentElement.classList.add('dfpAdOn');
  var bar=$('dfpAdBar');if(bar)bar.style.width='0%';
  paint(dur);
  var t0=performance.now();
  stopTick();
  timer=setInterval(function(){
    var left=Math.max(0,dur-(performance.now()-t0)/1000);
    paint(left);
    if(left<=0){stopTick();playing='ready';paint(0)}
  },80);
  try{$('dfpAdGo').focus()}catch(e){}
}
function watch(opts){
  if(playing)return;
  if(typeof opts==='function')opts={onReward:opts};
  opts=opts||{};
  rewardAmt=opts.reward!=null?+opts.reward:REWARD;
  if(!isFinite(rewardAmt)||rewardAmt<=0)rewardAmt=REWARD;
  onReward=typeof opts.onReward==='function'?opts.onReward:null;
  /* Future AdMob rewarded hook — keep OFF until app 2.60 (account approved, SDK added). */
  if(api.USE_SDK&&window.DFP_AD_SDK&&typeof window.DFP_AD_SDK.showRewarded==='function'){
    window.DFP_AD_SDK.showRewarded({
      appId:ADMOB.appId,
      unitId:ADMOB.rewardedUnitId,
      onReward:function(){try{onReward&&onReward(rewardAmt)}catch(e){}},
      onCancel:opts.onCancel||null
    });
    return;
  }
  startInHouse();
}
function complete(){
  if(!playing)return;
  paint(0);showReward();
}
var api=window.DFPad={
  REWARD:REWARD,
  DURATION:DURATION,
  USE_SDK:false,
  ADMOB:ADMOB,
  watch:watch,
  canWatch:function(){return true},
  _complete:complete
};
})();
