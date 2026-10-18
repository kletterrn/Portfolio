(() => {
  const section=document.querySelector('[data-scroll-hero]');
  const pane=section?.querySelector('.hero-sticky');
  const firstLine=section?.querySelector('[data-type-first-line]');
  const secondLine=section?.querySelector('[data-type-second-line]');
  const first=section?.querySelector('[data-type-first]');
  const secondPrefix=section?.querySelector('[data-type-second-prefix]');
  const second=section?.querySelector('[data-type-second]');
  const caret=section?.querySelector('[data-type-caret]');
  if(!section||!pane||!firstLine||!secondLine||!first||!secondPrefix||!second||!caret)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const intro='Curiosity,\nmade real.';
  const identity='David\nKhaliqi.';
  const clamp=value=>Math.max(0,Math.min(1,value));
  const smooth=(from,to,value)=>{const t=clamp((value-from)/(to-from));return t*t*(3-2*t);};
  let frame=0,lastText=null,lastMode=null;
  function paintText(text,mode){
    if(text===lastText&&mode===lastMode)return;
    const parts=text.split('\n'),hasSecond=parts.length>1;
    first.textContent=parts[0];
    const line=parts[1]||'';
    secondPrefix.textContent=mode==='intro'?line.slice(0,5):'';
    second.textContent=mode==='intro'?line.slice(5):line;
    secondLine.hidden=!hasSecond;
    (hasSecond?secondLine:firstLine).append(caret);
    section.dataset.heroText=text.replace('\n',' ');
    lastText=text;lastMode=mode;
  }
  function render(){
    frame=0;
    const rect=section.getBoundingClientRect();
    const top=parseFloat(getComputedStyle(section).getPropertyValue('--header-height'))||0;
    const range=Math.max(1,section.offsetHeight-pane.offsetHeight);
    const progress=reduced.matches?1:clamp((top-rect.top)/range);
    let text=intro,mode='intro',phase='intro';
    if(reduced.matches||progress>=.84){text=identity;mode='name';phase='identity';}
    else if(progress>=.5){text=identity.slice(0,Math.floor(clamp((progress-.5)/.34)*identity.length));mode='name';phase='typing';}
    else if(progress>=.43){text='';phase='caret';}
    else if(progress>=.1){text=intro.slice(0,intro.length-Math.floor(clamp((progress-.1)/.33)*intro.length));phase='deleting';}
    paintText(text,mode);
    const zoom=smooth(.05,.36,progress),turn=smooth(.22,.68,progress),settle=smooth(.6,.84,progress);
    const fold=reduced.matches?0:smooth(.8,1,progress);
    section.style.setProperty('--cover-fold',fold.toFixed(4));
    section.style.setProperty('--fluid-opacity',(reduced.matches?0:1-smooth(.7,.8,progress)).toFixed(4));
    section.style.setProperty('--art-x',(-turn*11).toFixed(3)+'%');
    section.style.setProperty('--art-y',(settle*5).toFixed(3)+'%');
    section.style.setProperty('--art-turn',(-turn*13).toFixed(3)+'deg');
    section.style.setProperty('--art-tilt',(-turn*12).toFixed(3)+'deg');
    section.style.setProperty('--art-scale',(1+zoom*.12-settle*.22).toFixed(4));
    section.classList.toggle('is-editing',phase==='deleting'||phase==='typing');
    section.dataset.heroPhase=phase;
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
