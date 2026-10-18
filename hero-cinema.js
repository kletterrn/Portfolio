(() => {
  const hero=document.querySelector('[data-timed-hero]');
  const stage=hero?.querySelector('.hero-sticky');
  const art=hero?.querySelector('.hero-art');
  const field=hero?.querySelector('.code-field');
  const footer=hero?.querySelector('.hero-footer');
  const slot=hero?.querySelector('[data-work-slot]');
  const work=document.querySelector('#work');
  const heading=work?.querySelector('.section-heading');
  if(!hero||!stage||!art||!field||!footer||!slot||!work||!heading)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const mobile=matchMedia('(max-width: 760px)');
  const fine=matchMedia('(hover: hover) and (pointer: fine)');
  const marker=document.createComment('Selected Work heading, static position');
  heading.before(marker);
  const clamp=value=>Math.max(0,Math.min(1,value));
  const ease=(a,b,value)=>{const t=clamp((value-a)/(b-a));return t*t*(3-2*t);};
  // Outline in the original 1536 × 1024 image, including the concave waist.
  const outline='M1191 17 L1179 49 L1104 176 L988 333 L884 441 L1134 644 L1138 654 L1107 665 L809 739 L547 866 L323 998 L331 981 L699 422 L668 386 L513 235 L513 230 L540 225 L824 194 L890 157 Z';
  let frame=0,box=null,lastMask='';

  function measure(){
    const width=art.offsetWidth,height=art.offsetHeight;
    const fit=Math.min(width/1536,height/1024);
    box={width:stage.clientWidth,height:stage.clientHeight,left:art.offsetLeft,top:art.offsetTop,
      fit,x:(width-1536*fit)/2,y:(height-1024*fit)/2,originX:width*.525,originY:height*.5};
  }
  function maskCrystal(scale){
    if(!box||!box.width||!box.height||!fine.matches)return;
    const x=box.left+box.originX+scale*(box.x-box.originX);
    const y=box.top+box.originY+scale*(box.y-box.originY);
    const fit=box.fit*scale;
    const key=[box.width,box.height,x.toFixed(2),y.toFixed(2),fit.toFixed(5)].join(',');
    if(key===lastMask)return;
    lastMask=key;
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${box.width}" height="${box.height}" viewBox="0 0 ${box.width} ${box.height}"><defs><mask id="glass" maskUnits="userSpaceOnUse" x="0" y="0" width="${box.width}" height="${box.height}"><rect width="100%" height="100%" fill="white"/><path d="${outline}" transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${fit.toFixed(5)})" fill="black" stroke="black" stroke-width="10" stroke-linejoin="round"/></mask></defs><rect width="100%" height="100%" fill="white" mask="url(#glass)"/></svg>`;
    field.style.setProperty('--crystal-mask',`url("data:image/svg+xml,${encodeURIComponent(svg)}")`);
    hero.classList.add('hero-mask-ready');
  }
  function render(){
    frame=0;
    if(!box)measure();
    const range=Math.max(1,hero.offsetHeight-stage.clientHeight);
    const top=parseFloat(getComputedStyle(hero).getPropertyValue('--header-height'))||0;
    const p=reduced.matches?0:clamp((top-hero.getBoundingClientRect().top)/range);
    const push=ease(.18,.7,p);
    const scale=1+push*(mobile.matches ? .25 : .85);
    const intro=1-ease(.15,.34,p);
    const story=ease(.32,.45,p)*(1-ease(.6,.73,p));
    const outro=ease(.7,.85,p);
    hero.style.setProperty('--glass-scale',scale.toFixed(5));
    hero.style.setProperty('--glass-opacity',(1-ease(.63,.84,p)*.78).toFixed(4));
    hero.style.setProperty('--intro-opacity',intro.toFixed(4));
    hero.style.setProperty('--story-opacity',story.toFixed(4));
    hero.style.setProperty('--story-y',((1-ease(.32,.45,p))*22-ease(.6,.73,p)*16).toFixed(2)+'px');
    hero.style.setProperty('--outro-opacity',outro.toFixed(4));
    hero.style.setProperty('--outro-y',((1-outro)*18).toFixed(2)+'px');
    hero.classList.toggle('hero-intro-gone',intro<.01&&!reduced.matches);
    footer.inert=intro<.01&&!reduced.matches;
    hero.dataset.cinemaProgress=p.toFixed(3);
    hero.dataset.cinemaShot=p<.32?'identity':p<.7?'detail':'work';
    maskCrystal(scale);
  }
  function schedule(){
    if(!frame&&!document.hidden)frame=requestAnimationFrame(render);
  }
  function resize(){box=null;lastMask='';schedule();}
  function reset(){
    if(reduced.matches){
      marker.after(heading);
      hero.classList.remove('cinema-ready','hero-intro-gone');
      work.classList.remove('hero-heading-docked');
      footer.inert=false;
    }else{
      slot.append(heading);
      hero.classList.add('cinema-ready');
      work.classList.add('hero-heading-docked');
    }
    box=null;lastMask='';
    render();
  }
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',resize,{passive:true});
  addEventListener('pageshow',resize);
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){cancelAnimationFrame(frame);frame=0;}else resize();
  });
  addEventListener('beforeprint',()=>marker.after(heading));
  addEventListener('afterprint',reset);
  reduced.addEventListener('change',reset);
  mobile.addEventListener('change',resize);
  fine.addEventListener('change',resize);
  if('ResizeObserver' in window)new ResizeObserver(resize).observe(stage);
  reset();
})();
