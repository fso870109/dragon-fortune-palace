/* 龍運金殿 v245: in-app 減少動態效果 override (key fs_rm=1). Must load first. Forces every
   (prefers-reduced-motion: reduce) check — JS matchMedia and CSS @media — to match. */
(function(){var on=false;try{on=localStorage.getItem('fs_rm')==='1'}catch(e){}
var mm=window.matchMedia&&window.matchMedia.bind(window),RX=/\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)/gi;
var SYS=!!(mm&&mm('(prefers-reduced-motion: reduce)').matches);
function fake(q){return{matches:true,media:q,onchange:null,addListener:function(){},removeListener:function(){},addEventListener:function(){},removeEventListener:function(){},dispatchEvent:function(){return false}}}
if(mm)window.matchMedia=function(q){q=String(q);if(on&&/prefers-reduced-motion\s*:\s*reduce/i.test(q)){var r=mm(q.replace(RX,'(min-width:0px)'));return r.matches?fake(q):r}return mm(q)};
var done=[];
function walk(rules){for(var i=0;rules&&i<rules.length;i++){var r=rules[i];
 if(r.media&&r.cssRules){var t=r.media.mediaText;if(RX.test(t)){RX.lastIndex=0;done.push([r,t]);r.media.mediaText=t.replace(RX,'(min-width:0px)')}RX.lastIndex=0;walk(r.cssRules)}
 else if(r.cssRules)walk(r.cssRules)}}
function scan(){if(!on)return;for(var i=0;i<document.styleSheets.length;i++){var s=document.styleSheets[i];if(s.__rm)continue;try{var c=s.cssRules}catch(e){continue}s.__rm=1;walk(c)}}
function apply(v){on=!!v;var h=document.documentElement;h.classList.toggle('dfpRM',on);
 if(on)scan();else{done.forEach(function(x){try{x[0].media.mediaText=x[1]}catch(e){}});done=[];for(var i=0;i<document.styleSheets.length;i++)try{delete document.styleSheets[i].__rm}catch(e){}}}
window.DFPrm={get on(){return on},sys:SYS,set:function(v){try{localStorage.setItem('fs_rm',v?'1':'0')}catch(e){}apply(v)}};
if(on){document.documentElement.classList.add('dfpRM');
 document.addEventListener('DOMContentLoaded',scan);addEventListener('load',scan);
 var mo=new MutationObserver(function(ms){var n=0;ms.forEach(function(m){m.addedNodes.forEach(function(x){if(x.nodeName==='STYLE')n=1;else if(x.nodeName==='LINK')x.addEventListener('load',scan)})});if(n)scan()});
 document.addEventListener('DOMContentLoaded',function(){mo.observe(document.head,{childList:true})});
 document.querySelectorAll&&setTimeout(scan,0)}
})();
