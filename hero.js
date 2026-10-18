(() => {
  const hero = document.querySelector('[data-code-hero]');
  const canvas = hero?.querySelector('canvas');
  const ctx = canvas?.getContext('2d', { alpha: true });
  if (!hero || !ctx) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const lifetime = 1.8;
  const cellWidth = 9, cellHeight = 12;
  let width = 0, height = 0, columns = 0, rows = 0, field;
  let stamps = [], previous = null, frame = 0, lastPaint = 0, visible = true;
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  function clear() {
    ctx.clearRect(0, 0, width, height);
    stamps = []; previous = null;
    cancelAnimationFrame(frame); frame = 0;
  }
  function allowed() {
    return visible && !document.hidden && fine.matches && !reduced.matches;
  }
  function resize() {
    const box = hero.getBoundingClientRect();
    width = box.width; height = box.height;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = '10px "DM Mono", monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    columns = Math.ceil(width / cellWidth); rows = Math.ceil(height / cellHeight);
    field = new Float32Array(columns * rows);
    clear();
  }
  function wake() {
    if (!frame && allowed() && stamps.length) frame = requestAnimationFrame(draw);
  }
  function paint(now) {
    ctx.clearRect(0, 0, width, height);
    field.fill(0);
    stamps = stamps.filter(stamp => now - stamp.time < lifetime * 1000);
    for (const stamp of stamps) {
      const age = Math.max(0, (now - stamp.time) / 1000);
      const fade = Math.pow(1 - age / lifetime, 2.1);
      const radius = stamp.radius * (1 + age * .27);
      const bound = radius * 1.9;
      const left = Math.max(0, Math.floor((stamp.x-bound)/cellWidth));
      const right = Math.min(columns-1, Math.ceil((stamp.x+bound)/cellWidth));
      const top = Math.max(0, Math.floor((stamp.y-bound)/cellHeight));
      const bottom = Math.min(rows-1, Math.ceil((stamp.y+bound)/cellHeight));
      for (let row=top; row<=bottom; row++) {
        const dy=((row+.5)*cellHeight-stamp.y)/radius;
        for (let col=left; col<=right; col++) {
          const dx=((col+.5)*cellWidth-stamp.x)/radius;
          const distance=dx*dx+dy*dy;
          if (distance>3.6) continue;
          field[row*columns+col] += Math.exp(-distance*2.1)*fade*stamp.strength;
        }
      }
    }
    for (let row=0; row<rows; row++) for (let col=0; col<columns; col++) {
      const value=field[row*columns+col];
      if (value<.075) continue;
      const glyph=value<.17?'_':value<.4?'-':value<1.1?'>':'o';
      const alpha=clamp(value*.29,0,.58);
      ctx.fillStyle=`rgba(228,234,255,${alpha.toFixed(3)})`;
      ctx.fillText(glyph,(col+.5)*cellWidth,(row+.5)*cellHeight);
    }
  }
  function draw(now) {
    frame = 0;
    if (!allowed()) { clear(); return; }
    if (now-lastPaint>=1000/60) { paint(now); lastPaint=now; }
    wake();
  }
  hero.addEventListener('pointermove',event=>{
    if (!allowed() || event.pointerType==='touch') return;
    const box=hero.getBoundingClientRect();
    const now=performance.now();
    const point={x:event.clientX-box.left,y:event.clientY-box.top,time:now};
    const distance=previous?Math.hypot(point.x-previous.x,point.y-previous.y):0;
    const elapsed=previous?Math.max(8,now-previous.time):16;
    if (previous && distance<1.5) return;
    const speed=distance/elapsed*1000;
    const radius=38+55*Math.exp(-speed/310);
    if (previous && elapsed<100) {
      const count=Math.min(32,Math.max(1,Math.ceil(distance/8)));
      for(let i=1;i<=count;i++){
        const t=i/count;
        stamps.push({x:previous.x+(point.x-previous.x)*t,y:previous.y+(point.y-previous.y)*t,time:now,radius,strength:.24});
      }
    } else {
      stamps.push({...point,radius:52,strength:.8});
    }
    if (stamps.length>200) stamps.splice(0,stamps.length-200);
    previous=point;
    wake();
  },{passive:true});
  hero.addEventListener('pointerleave',()=>{previous=null;});
  hero.addEventListener('pointercancel',clear);
  fine.addEventListener('change',clear);
  reduced.addEventListener('change',clear);
  window.addEventListener('blur',()=>{previous=null;});
  new ResizeObserver(resize).observe(hero);
  if ('IntersectionObserver' in window) new IntersectionObserver(([entry])=>{
    visible=entry.isIntersecting;
    hero.classList.toggle('hero-offscreen',!visible);
    if(!visible)clear();
  }).observe(hero);
  document.addEventListener('visibilitychange',()=>{
    hero.classList.toggle('hero-page-hidden',document.hidden);
    if(document.hidden)clear();
  });
  resize();
})();
