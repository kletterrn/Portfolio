/* Only the sculpture silhouette occludes the pointer field. No scroll pinning. */
(() => {
 const hero=document.querySelector('.code-hero'),art=hero?.querySelector('.hero-art'),field=hero?.querySelector('.code-field');
 if(!hero||!art||!field)return;
 const fine=matchMedia('(hover: hover) and (pointer: fine)'),reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const outline='M1191 17 L1179 49 L1104 176 L988 333 L884 441 L1134 644 L1138 654 L1107 665 L809 739 L547 866 L323 998 L331 981 L699 422 L668 386 L513 235 L513 230 L540 225 L824 194 L890 157 Z';
 function measure(){
  if(!fine.matches||reduce.matches)return;
  const stage=hero.querySelector('.hero-scene');
  const w=stage.clientWidth,h=stage.clientHeight,aw=art.offsetWidth,ah=art.offsetHeight;
  if(!w||!h||!aw||!ah)return;
  const fit=Math.min(aw/1536,ah/1024),x=art.offsetLeft+(aw-1536*fit)/2,y=art.offsetTop+(ah-1024*fit)/2;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><defs><mask id="glass" maskUnits="userSpaceOnUse" x="0" y="0" width="${w}" height="${h}"><rect width="100%" height="100%" fill="white"/><path d="${outline}" transform="translate(${x} ${y}) scale(${fit})" fill="black" stroke="black" stroke-width="10" stroke-linejoin="round"/></mask></defs><rect width="100%" height="100%" fill="white" mask="url(#glass)"/></svg>`;
  field.style.setProperty('--crystal-mask',`url("data:image/svg+xml,${encodeURIComponent(svg)}")`);
  hero.classList.add('hero-mask-ready');
 }
 if('ResizeObserver' in window)new ResizeObserver(measure).observe(hero);
 addEventListener('resize',measure,{passive:true});fine.addEventListener('change',measure);reduce.addEventListener('change',measure);measure();
})();
