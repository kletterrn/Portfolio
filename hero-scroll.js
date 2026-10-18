(() => {
  const section=document.querySelector('[data-scroll-hero]');
  const pane=section?.querySelector('.hero-sticky');
  if(!section||!pane)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const clamp=value=>Math.max(0,Math.min(1,value));
  const smooth=(from,to,value)=>{const t=clamp((value-from)/(to-from));return t*t*(3-2*t);};
  let frame=0;
  function render(){
    frame=0;
    const rect=section.getBoundingClientRect();
    const top=parseFloat(getComputedStyle(section).getPropertyValue('--header-height'))||0;
    const range=Math.max(1,section.offsetHeight-pane.offsetHeight);
    const progress=reduced.matches?1:clamp((top-rect.top)/range);
    const outgoing=smooth(.07,.58,progress);
    const incoming=smooth(.38,.87,progress);
    section.style.setProperty('--hero-progress',progress.toFixed(4));
    section.style.setProperty('--idea-opacity',(1-outgoing).toFixed(4));
    section.style.setProperty('--idea-shift',(-outgoing*65).toFixed(2)+'px');
    section.style.setProperty('--name-opacity',incoming.toFixed(4));
    section.style.setProperty('--name-shift',((1-incoming)*75).toFixed(2)+'px');
    section.dataset.heroPhase=progress<.2?'curiosity':progress>.87?'name':'transition';
    section.dataset.heroProgress=progress.toFixed(3);
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(render);}
  section.classList.add('scroll-ready');
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule,{passive:true});
  addEventListener('pageshow',schedule);
  reduced.addEventListener('change',schedule);
  if('ResizeObserver' in window)new ResizeObserver(schedule).observe(pane);
  render();
})();
