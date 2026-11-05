/* v266: gold scroll unfurl / roll-up for #czGal (no doors) */
(function(){function rm(){return document.documentElement.classList.contains('dfpRM')||matchMedia('(prefers-reduced-motion: reduce)').matches}
function hook(d){if(d.__g266)return;d.__g266=1;var rc=d.close.bind(d),busy=0;
 if(!d.querySelector('.galrod')){var r=document.createElement('i');r.className='galrod t';d.prepend(r)}
 d.close=function(v){if(busy||!d.open)return;busy=1;d.style.animation='';d.classList.add('out');setTimeout(function(){d.classList.remove('out');busy=0;rc(v)},rm()?120:260)};
 d.addEventListener('animationend',function(e){if(e.target===d&&!d.classList.contains('out'))d.style.animation='none'});d.style.animation='';var H=document.documentElement;H.style.overflow='hidden';d.addEventListener('close',function(){H.style.overflow=''});
 d.addEventListener('cancel',function(e){e.preventDefault();d.close()})}
new MutationObserver(function(ms){var d=document.getElementById('czGal');if(d)hook(d)}).observe(document.body,{childList:true})})();
