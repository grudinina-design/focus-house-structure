(() => {
 'use strict';
 const reduced=window.matchMedia?window.matchMedia('(prefers-reduced-motion: reduce)'):{matches:true};
 const header=document.querySelector('.header'),nav=document.querySelector('#navigation'),toggle=document.querySelector('.menu-toggle');
 const hero=document.querySelector('.bw-hero'),camera=document.querySelector('.bw-hero-camera');
 const progress=document.createElement('div');progress.className='read-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
 let frame=null,lastY=window.scrollY||0;
 function paint(){
  frame=null;const y=window.scrollY||0;
  const scrolled=y>(hero?hero.offsetHeight-80:180);
  header?.classList.toggle('is-scrolled',scrolled);
  if(!scrolled)header?.classList.remove('is-visible');
  else if(Math.abs(y-lastY)>4)header?.classList.toggle('is-visible',y<lastY);
  lastY=y;
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

// The reference's word masks are progressive enhancement: full text is the fallback.
(() => {
 'use strict';
 const reduce=window.matchMedia?.('(prefers-reduced-motion: reduce)');
 const headings=[...document.querySelectorAll('[data-heading-reveal]')];
 let observer;
 function revealAll(){document.documentElement.classList.remove('heading-motion');headings.forEach(h=>h.classList.add('is-revealed'));observer?.disconnect();}
 if(reduce?.matches||!('IntersectionObserver' in window)){revealAll();return;}
 try {
  headings.forEach(heading=>{
   let index=0;
   heading.querySelectorAll('.heading-lead,.heading-tone').forEach(part=>{
    const fragment=document.createDocumentFragment();
    part.textContent.split(/(\s+)/).forEach(token=>{
     if(!token)return;
     if(/^\s+$/.test(token)){fragment.append(document.createTextNode(token));return;}
     const mask=document.createElement('span'),word=document.createElement('span');
     mask.className='word-clip';word.className='heading-word';word.textContent=token;
     word.style.setProperty('--word-delay',Math.min(index++*42,630)+'ms');mask.append(word);fragment.append(mask);
    });
    part.replaceChildren(fragment);
   });
  });
  observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-revealed');observer.unobserve(entry.target);}});},{threshold:.15,rootMargin:'0px 0px -5% 0px'});
  document.documentElement.classList.add('heading-motion');headings.forEach(h=>observer.observe(h));
  reduce?.addEventListener?.('change',e=>{if(e.matches)revealAll();});
 } catch {revealAll();}
})();

(() => {
 'use strict';
 document.querySelectorAll('[data-showcase]').forEach(showcase=>{
  const track=showcase.querySelector('.bw-projects'),cards=[...track.children];
  const controls=showcase.querySelector('.showcase-controls'),prev=controls.querySelector('[data-showcase-prev]'),next=controls.querySelector('[data-showcase-next]'),counter=controls.querySelector('.showcase-count');
  if(!track.scrollBy)return;
  controls.hidden=false;
  function measure(){const width=cards[0].getBoundingClientRect().width||track.clientWidth;const gap=parseFloat(getComputedStyle(track).columnGap)||24;const visible=Math.max(1,Math.round(track.clientWidth/(width||1)));return {step:width+gap,visible};}
  function update(){const {step,visible}=measure();const first=Math.max(0,Math.min(cards.length-1,Math.round(track.scrollLeft/(step||1))));const last=Math.min(cards.length,first+visible);counter.textContent=(last===first+1?String(last):`${first+1}–${last}`)+' / '+cards.length;prev.disabled=track.scrollLeft<=2;next.disabled=track.scrollLeft>=track.scrollWidth-track.clientWidth-2;}
  function move(dir){const {step,visible}=measure();const reduce=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;track.scrollBy({left:dir*step*visible,behavior:reduce?'instant':'smooth'});}
  prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
  track.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update,{passive:true});update();
 });
})();

// Built objects: no coordinates are invented while the real map is pending.
(() => {
 'use strict';
 const panels=[...document.querySelectorAll('[data-built-panel]')];if(!panels.length)return;
 function render(view){const active=view==='map'?'map':'photos';panels.forEach(p=>p.hidden=p.dataset.builtPanel!==active);document.querySelectorAll('.built-view-controls [data-built-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.builtView===active)));}
 document.querySelectorAll('[data-built-view]').forEach(button=>button.addEventListener('click',()=>{const url=new URL(window.location.href);url.searchParams.set('view',button.dataset.builtView);history.pushState(null,'',url);render(button.dataset.builtView);if(button.closest('[data-built-panel]'))document.querySelector('.built-view-controls [data-built-view="photos"]')?.focus();}));
 window.addEventListener('popstate',()=>render(new URL(window.location.href).searchParams.get('view')));
 render(new URL(window.location.href).searchParams.get('view'));
})();
