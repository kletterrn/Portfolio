/* Native-scroll depth, aligned mouse exclusion, and pointer-responsive light. */
(() => {
 const hero=document.querySelector('.code-hero'),stage=hero?.querySelector('.hero-scene'),art=hero?.querySelector('.hero-art'),field=hero?.querySelector('.code-field'),work=document.querySelector('#work');
 if(!hero||!stage||!art||!field)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),compact=matchMedia('(max-width: 1100px), (max-width: 1366px) and (pointer: coarse)'),fine=matchMedia('(hover: hover) and (pointer: fine)');
 let frame=0,visible=true,workVisible=false,pointer=null,lastMaskKey='';
 hero.classList.add('hero-scroll-ready');
 const outline='M1191 17 L1179 49 L1104 176 L988 333 L884 441 L1134 644 L1138 654 L1107 665 L809 739 L547 866 L323 998 L331 981 L699 422 L668 386 L513 235 L513 230 L540 225 L824 194 L890 157 Z';
 function measure(){
  if(!visible||!fine.matches||reduced.matches)return;
  const box=art.getBoundingClientRect(),scene=stage.getBoundingClientRect(),fit=box.width/1536,x=box.left-scene.left,y=box.top-scene.top;
  if(!scene.width||!scene.height||!fit)return;
  const key=[x,y,box.width,scene.width,scene.height].map(value=>Math.round(value*10)/10).join(',');if(key===lastMaskKey)return;lastMaskKey=key;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${scene.width} ${scene.height}"><defs><mask id="glass" maskUnits="userSpaceOnUse" x="0" y="0" width="${scene.width}" height="${scene.height}"><rect width="100%" height="100%" fill="white"/><path d="${outline}" transform="translate(${x} ${y}) scale(${fit})" fill="black" stroke="black" stroke-width="6" stroke-linejoin="round"/></mask></defs><rect width="100%" height="100%" fill="white" mask="url(#glass)"/></svg>`;
  field.style.setProperty('--crystal-mask',`url("data:image/svg+xml,${encodeURIComponent(svg)}")`);hero.classList.add('hero-mask-ready');
 }

 function render(){
  frame=0;
  const top=document.querySelector('.header')?.getBoundingClientRect().bottom||0,rect=hero.getBoundingClientRect();
  const progress=reduced.matches||compact.matches?0:Math.max(0,Math.min(1,(top-rect.top)/Math.max(1,rect.height-stage.offsetHeight)));
  hero.style.setProperty('--hero-progress',progress.toFixed(4));
  const eased=progress*progress*(3-2*progress);
  hero.style.setProperty('--crystal-scroll-y',`${(-eased*28).toFixed(2)}px`);
  hero.style.setProperty('--crystal-scroll-scale',(1-eased*.1).toFixed(4));
  /* Work remains in normal flow; the animation is contained in the hero. */
  if(work){const start=(innerHeight-work.getBoundingClientRect().top)/Math.max(1,innerHeight*.65),entry=reduced.matches||compact.matches?1:Math.max(0,Math.min(1,start));work.style.setProperty('--work-entry',(entry*entry*(3-2*entry)).toFixed(4));}
  measure();
  if(pointer&&fine.matches&&!reduced.matches&&!compact.matches){
   const x=Math.max(0,Math.min(1,pointer.x/Math.max(1,rect.width))),y=Math.max(0,Math.min(1,(pointer.y-stage.getBoundingClientRect().top)/Math.max(1,stage.offsetHeight)));
   art.style.setProperty('--crystal-light-x',`${(47+x*18).toFixed(2)}%`);art.style.setProperty('--crystal-light-y',`${(31+y*27).toFixed(2)}%`);
  }
 }
 function schedule(){if(!frame&&(visible||workVisible)&&!document.hidden)frame=requestAnimationFrame(render);}
 function resetLight(){pointer=null;art.style.removeProperty('--crystal-light-x');art.style.removeProperty('--crystal-light-y');}
 hero.addEventListener('pointermove',event=>{if(!visible||document.hidden||!fine.matches||reduced.matches||compact.matches||event.isPrimary===false)return;pointer={x:event.clientX,y:event.clientY};schedule();},{passive:true});
 hero.addEventListener('pointerleave',resetLight);
 function resize(){if(reduced.matches||compact.matches||!fine.matches)resetLight();schedule();}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',resize,{passive:true});addEventListener('pageshow',resize);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else resize();});
 [reduced,compact,fine].forEach(query=>query.addEventListener('change',resize));
 if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.target===hero)visible=entry.isIntersecting;else if(entry.target===work)workVisible=entry.isIntersecting;}if(visible||workVisible)resize();else{cancelAnimationFrame(frame);frame=0;}});
  observer.observe(hero);if(work)observer.observe(work);
 }
 if('ResizeObserver' in window&&stage)new ResizeObserver(resize).observe(stage);
 art?.querySelector('img')?.addEventListener('load',resize);document.fonts?.ready.then(resize);resize();
})();
