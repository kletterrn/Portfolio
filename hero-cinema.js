/* The typography parts on native scroll. The sculpture keeps its position. */
(() => {
 const hero=document.querySelector('.code-hero'),stage=hero?.querySelector('.hero-scene'),art=hero?.querySelector('.hero-art'),field=hero?.querySelector('.code-field');
 if(!hero||!stage||!art||!field)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover: hover) and (pointer: fine)'),mobile=matchMedia('(max-width: 760px)');
 const outline='M1191 17 L1179 49 L1104 176 L988 333 L884 441 L1134 644 L1138 654 L1107 665 L809 739 L547 866 L323 998 L331 981 L699 422 L668 386 L513 235 L513 230 L540 225 L824 194 L890 157 Z';
 let frame=0,visible=true;
 function measure(){
  if(!fine.matches||reduced.matches)return;
  const box=art.getBoundingClientRect(),scene=stage.getBoundingClientRect(),fit=box.width/1536,x=box.left-scene.left,y=box.top-scene.top;
  if(!scene.width||!scene.height||!fit)return;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${scene.width} ${scene.height}"><defs><mask id="glass" maskUnits="userSpaceOnUse" x="0" y="0" width="${scene.width}" height="${scene.height}"><rect width="100%" height="100%" fill="white"/><path d="${outline}" transform="translate(${x} ${y}) scale(${fit})" fill="black" stroke="black" stroke-width="6" stroke-linejoin="round"/></mask></defs><rect width="100%" height="100%" fill="white" mask="url(#glass)"/></svg>`;
  field.style.setProperty('--crystal-mask',`url("data:image/svg+xml,${encodeURIComponent(svg)}")`);hero.classList.add('hero-mask-ready');
 }
 function render(){
  frame=0;
  const top=document.querySelector('.header')?.getBoundingClientRect().bottom||0,rect=hero.getBoundingClientRect();
  const p=reduced.matches||mobile.matches?0:Math.max(0,Math.min(1,(top-rect.top)/Math.max(1,rect.height*.9)));
  hero.style.setProperty('--hero-progress',p.toFixed(4));
 }
 function schedule(){if(!frame&&visible&&!document.hidden)frame=requestAnimationFrame(render);}
 function resize(){measure();schedule();}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',resize,{passive:true});addEventListener('pageshow',resize);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else resize();});
 [reduced,fine,mobile].forEach(query=>query.addEventListener('change',resize));
 if('ResizeObserver' in window)new ResizeObserver(resize).observe(stage);
 if('IntersectionObserver' in window)new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)resize();else{cancelAnimationFrame(frame);frame=0;}}).observe(hero);
 art.querySelector('img')?.addEventListener('load',resize);document.fonts?.ready.then(resize);resize();
})();
