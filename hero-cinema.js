/* A small native-scroll offset keeps the editorial statement connected to the page. */
(() => {
 const hero=document.querySelector('.code-hero');
 if(!hero)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),mobile=matchMedia('(max-width: 760px)');
 let frame=0,visible=true;
 function render(){
  frame=0;
  const top=document.querySelector('.header')?.getBoundingClientRect().bottom||0,rect=hero.getBoundingClientRect();
  const progress=reduced.matches||mobile.matches?0:Math.max(0,Math.min(1,(top-rect.top)/Math.max(1,rect.height)));
  hero.style.setProperty('--hero-progress',progress.toFixed(4));
 }
 function schedule(){if(!frame&&visible&&!document.hidden)frame=requestAnimationFrame(render);}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});addEventListener('pageshow',schedule);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else schedule();});
 [reduced,mobile].forEach(query=>query.addEventListener('change',schedule));
 if('IntersectionObserver' in window)new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)schedule();else{cancelAnimationFrame(frame);frame=0;}}).observe(hero);
 document.fonts?.ready.then(schedule);schedule();
})();
