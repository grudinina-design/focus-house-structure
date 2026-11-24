(() => {
 'use strict';
 const reduced=window.matchMedia?window.matchMedia('(prefers-reduced-motion: reduce)'):{matches:true};
 const header=document.querySelector('.header'),nav=document.querySelector('#navigation'),toggle=document.querySelector('.menu-toggle');
 const hero=document.querySelector('.bw-hero'),camera=document.querySelector('.bw-hero-camera');
 const progress=document.createElement('div');progress.className='read-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
 let frame=null;
 function paint(){
  frame=null;const y=window.scrollY||0;
  header?.classList.toggle('is-scrolled',y>(hero?hero.offsetHeight-80:180));
  const limit=document.documentElement.scrollHeight-window.innerHeight;
  progress.style.transform='scaleX('+(limit>0?Math.min(1,Math.max(0,y/limit)):0)+')';
  if(hero&&camera){const moving=!reduced.matches&&window.innerWidth>=768;const offset=Math.min(window.innerHeight,Math.max(0,-hero.getBoundingClientRect().top));camera.style.setProperty('--camera-y',moving?Math.min(8,offset*.015).toFixed(2)+'px':'0px');}
 }
 function schedule(){if(frame===null)frame=window.requestAnimationFrame(paint);}
 window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});reduced.addEventListener?.('change',schedule);
 toggle?.addEventListener('click',()=>{if(toggle.getAttribute('aria-expanded')==='true')nav?.querySelector('a')?.focus();});
 document.addEventListener('click',e=>{if(toggle?.getAttribute('aria-expanded')==='true'&&!nav?.contains(e.target)&&!toggle.contains(e.target))toggle.click();});
 document.addEventListener('focusin',e=>{if(toggle?.getAttribute('aria-expanded')==='true'&&!nav?.contains(e.target)&&!toggle.contains(e.target))toggle.click();});
 paint();
})();
