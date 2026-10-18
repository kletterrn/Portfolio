(() => {
  const work=document.querySelector('[data-work-handoff]');
  const heading=work?.querySelector('.section-heading');
  const panel=work?.querySelector('.project-ignis');
  if(!work||!heading||!panel)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const mobile=matchMedia('(max-width: 760px)');
  const clamp=value=>Math.max(0,Math.min(1,value));
  const ease=value=>value*value*(3-2*value);
  let frame=0,focused=false;
  function render(){
    frame=0;
    const still=reduced.matches||focused;
    const viewport=innerHeight;
    const h=heading.getBoundingClientRect(),p=panel.getBoundingClientRect();
    const headline=still?1:clamp((viewport*.92-h.top)/(viewport*(mobile.matches ? .2 : .32)));
    const reveal=still?1:clamp((viewport*(mobile.matches ? .96 : .92)-p.top)/(viewport*(mobile.matches ? .22 : .6)));
    const opened=ease(reveal);
    work.style.setProperty('--heading-first',ease(clamp(headline*1.35)).toFixed(4));
    work.style.setProperty('--heading-second',ease(clamp((headline-.14)/.86)).toFixed(4));
    work.style.setProperty('--work-reveal',opened.toFixed(4));
    work.style.setProperty('--seam-y',Math.max(0,p.height*opened-1.5).toFixed(2)+'px');
    work.classList.toggle('handoff-opening',reveal>0&&reveal<1);
    work.classList.toggle('handoff-open',reveal>=1);
    work.dataset.workReveal=opened.toFixed(3);
  }
  function schedule(){
    if(!frame&&!document.hidden)frame=requestAnimationFrame(render);
  }
  panel.addEventListener('focusin',()=>{focused=true;render();});
  panel.addEventListener('focusout',event=>{
    focused=panel.contains(event.relatedTarget);
    schedule();
  });
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule,{passive:true});
  addEventListener('pageshow',schedule);
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){cancelAnimationFrame(frame);frame=0;}else schedule();
  });
  reduced.addEventListener('change',schedule);
  mobile.addEventListener('change',schedule);
  if('ResizeObserver' in window)new ResizeObserver(schedule).observe(panel);
  render();
  work.classList.add('handoff-ready');
})();
