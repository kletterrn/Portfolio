(() => {
  const hero = document.querySelector('[data-code-hero]');
  const canvas = hero?.querySelector('canvas');
  const ctx = canvas?.getContext('2d', { alpha: true });
  if (!hero || !ctx) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const glyphs = '.:-=+*#%@';
  let width = 0, height = 0, stepX = 12, stepY = 15, columns = 0, rows = 0;
  let frame = 0, last = 0, visible = true, time = 0;
  let trail = [], pointer = null, cells = [];
  const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
  function resize() {
    const box = hero.getBoundingClientRect();
    width = box.width; height = box.height;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    stepX = width < 760 ? 13 : Math.max(11, width / 145);
    stepY = stepX * 1.25;
    columns = Math.ceil(width / stepX); rows = Math.ceil(height / stepY);
    ctx.font = `${Math.floor(stepX)}px "DM Mono", monospace`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    cells = [];
    for (let row = 0; row < rows; row++) for (let col = 0; col < columns; col++) {
      cells.push({x:(col+.5)*stepX,y:(row+.5)*stepY,seed:(Math.sin(col*127.1+row*311.7)*43758.5453)%1});
    }
    trail = []; pointer = null; render(0);
    wake();
  }
  function render(dt) {
    time += dt;
    ctx.clearRect(0, 0, width, height);
    trail = trail.filter(point => (point.age += dt) < 1.65);
    const aspect = width / Math.max(height, 1);
    const phase = time * .16;
    for (const cell of cells) {
      const u = cell.x / width, v = cell.y / height;
      let bend = 0, energy = 0;
      for (const point of trail) {
        const dx = (cell.x-point.x) / 145, dy = (cell.y-point.y) / 145;
        const dist = Math.sqrt(dx*dx+dy*dy);
        if (dist > 2.6) continue;
        const fade = 1 - point.age/1.65;
        const force = Math.exp(-dist*dist*1.6)*fade;
        energy += force * .65;
        bend += Math.sin(dist*8-point.age*7)*force*.08;
      }
      if (pointer) {
        const dx=(cell.x-pointer.x)/155,dy=(cell.y-pointer.y)/155;
        energy += Math.exp(-(dx*dx+dy*dy)*1.5)*.28;
      }
      const x = (u-.5)*aspect;
      const yy = v + bend;
      const waveA = .5+.19*Math.sin(x*2.7+phase)+.07*Math.sin(x*5.4-phase*.8);
      const waveB = .5-.24*Math.sin(x*2.3-phase*.65+1.5);
      const ribbonA = Math.exp(-Math.pow((yy-waveA)/.095,2));
      const ribbonB = Math.exp(-Math.pow((yy-waveB)/.075,2));
      const folds = .48+.52*Math.pow(Math.sin(x*8+yy*9+phase),2);
      const shape = Math.max(ribbonA*.75,ribbonB*.48)*folds;
      const center = Math.exp(-Math.pow((u-.5)/.29,4)-Math.pow((v-.47)/.25,4));
      const readability = 1-center*.88;
      const edge = clamp(Math.min(v/.11,(1-v)/.16),0,1);
      const level = clamp(shape*readability+energy*.8,0,1)*edge;
      if (level < .055) continue;
      const index = clamp(Math.floor(level*8+(cell.seed>.55?1:0)),0,glyphs.length-1);
      const alpha = clamp(level*.85,0,.85);
      const hot = clamp(energy,0,1);
      ctx.fillStyle = `rgba(${Math.round(66+hot*95)},${Math.round(94+hot*82)},255,${alpha.toFixed(2)})`;
      ctx.fillText(glyphs[index],cell.x,cell.y);
    }
  }
  function tick(now) {
    frame = 0;
    if (!visible || document.hidden || reduced.matches) return;
    const elapsed = now-last;
    if (elapsed >= 1000/30) {
      render(Math.min(elapsed/1000,.05)); last=now;
    }
    wake();
  }
  function wake() {
    if (!frame && visible && !document.hidden && !reduced.matches) frame=requestAnimationFrame(tick);
  }
  hero.addEventListener('pointermove', event => {
    if (!fine.matches || reduced.matches || event.pointerType==='touch') return;
    const box=hero.getBoundingClientRect();
    const next={x:event.clientX-box.left,y:event.clientY-box.top};
    if (!pointer || Math.hypot(next.x-pointer.x,next.y-pointer.y)>9) {
      trail.push({...next,age:0});
      if (trail.length>18) trail.shift();
    }
    pointer=next; wake();
  },{passive:true});
  function reset(){pointer=null;trail=[];if(reduced.matches)render(0);}
  hero.addEventListener('pointerleave',()=>{pointer=null;});
  hero.addEventListener('pointercancel',reset);
  fine.addEventListener('change',reset);
  reduced.addEventListener('change',()=>{cancelAnimationFrame(frame);frame=0;reset();render(0);last=performance.now();wake();});
  new ResizeObserver(resize).observe(hero);
  if ('IntersectionObserver' in window) new IntersectionObserver(([entry])=>{
    visible=entry.isIntersecting;hero.classList.toggle('hero-offscreen',!visible);
    if(visible){last=performance.now();wake();}else{cancelAnimationFrame(frame);frame=0;reset();}
  }).observe(hero);
  document.addEventListener('visibilitychange',()=>{
    hero.classList.toggle('hero-page-hidden',document.hidden);
    if(document.hidden){cancelAnimationFrame(frame);frame=0;reset();}else{last=performance.now();wake();}
  });
  window.addEventListener('blur',()=>{pointer=null;});
  resize();
})();
