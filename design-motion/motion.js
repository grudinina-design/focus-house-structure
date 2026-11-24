(() => {
  'use strict';
  const reduced=window.matchMedia?window.matchMedia('(prefers-reduced-motion: reduce)'):{matches:true};
  const hero=document.querySelector('.motion-hero');
  const heroImage=document.querySelector('.motion-hero-image');
  const stages=[...document.querySelectorAll('.story-step')];
  const visual=document.querySelector('.story-visual');
  const header=document.querySelector('.header');
  const progress=document.createElement('div');progress.className='read-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
  let frame=null,active=-1;
  function paint(){frame=null;const narrow=window.innerWidth<768;
    header?.classList.toggle('is-scrolled',window.scrollY>180);
    const limit=document.documentElement.scrollHeight-window.innerHeight;
    progress.style.transform='scaleX('+(limit>0?Math.min(1,Math.max(0,window.scrollY/limit)):0)+')';
    if(hero&&heroImage){if(reduced.matches||narrow){heroImage.style.removeProperty('transform');}else{const y=Math.max(0,Math.min(window.innerHeight,-hero.getBoundingClientRect().top));heroImage.style.transform='translate3d(0,'+(y*.065).toFixed(2)+'px,0) scale(1.035)';}}
    if(visual&&stages.length){let next=0,distance=Infinity;stages.forEach((s,i)=>{const r=s.getBoundingClientRect();const d=Math.abs(r.top+r.height*.42-window.innerHeight*.45);if(d<distance){next=i;distance=d;}});if(next!==active){active=next;visual.dataset.current=String(next);stages.forEach((s,i)=>s.classList.toggle('is-current',i===next));visual.querySelectorAll('[data-caption]').forEach(c=>c.hidden=Number(c.dataset.caption)!==next);visual.querySelectorAll('.story-layer').forEach((img,i)=>img.setAttribute('aria-hidden',String(i!==next)));}}
  }
  function schedule(){if(frame===null)frame=window.requestAnimationFrame(paint);}
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});
  reduced.addEventListener?.('change',schedule);
  paint();
})();
