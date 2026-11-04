/* v257 marquee burst: soft BIG WIN flash every ~16-26s, paused when hidden / reduced motion */
(function(){var f=document.querySelector('.mqf');if(!f)return;var tg=f.querySelector('.mqtag'),t=0;
function rm(){return document.documentElement.classList.contains('dfpRM')||(matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)}
function burst(txt){if(rm()||document.hidden)return;tg.textContent=txt||(Math.random()<.5?'BIG WIN':'JACKPOT');f.classList.remove('burst');void f.offsetWidth;f.classList.add('burst');clearTimeout(t);t=setTimeout(function(){f.classList.remove('burst')},2400)}
(function loop(){setTimeout(function(){burst();loop()},16000+Math.random()*10000)})();
setTimeout(function(){burst('WELCOME')},2600);
window.DFPmq={burst:burst};})();
