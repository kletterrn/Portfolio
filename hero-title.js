(() => {
  const section=document.querySelector('[data-timed-hero]');
  const firstLine=section?.querySelector('[data-type-first-line]');
  const secondLine=section?.querySelector('[data-type-second-line]');
  const first=section?.querySelector('[data-type-first]');
  const secondPrefix=section?.querySelector('[data-type-second-prefix]');
  const second=section?.querySelector('[data-type-second]');
  const caret=section?.querySelector('[data-type-caret]');
  if(!section||!firstLine||!secondLine||!first||!secondPrefix||!second||!caret)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const phrases=[{text:'Curiosity,\nmade real.',mode:'intro'},{text:'David\nKhaliqi.',mode:'name'}];
  const holdMs=4000,deleteMs=45,typeMs=90,blankMs=300;
  let phrase=0,length=phrases[0].text.length,phase='hold';
  let timer=null,due=0,remaining=holdMs;
  const rect=section.getBoundingClientRect();
  let visible=rect.bottom>0&&rect.top<innerHeight;

  function paint(){
    const current=phrases[phrase],text=current.text.slice(0,length);
    const parts=text.split('\n'),hasSecond=parts.length>1,line=parts[1]||'';
    first.textContent=parts[0];
    secondPrefix.textContent=current.mode==='intro'?line.slice(0,5):'';
    second.textContent=current.mode==='intro'?line.slice(5):line;
    secondLine.hidden=!hasSecond;
    (hasSecond?secondLine:firstLine).append(caret);
    section.classList.toggle('is-editing',phase==='deleting'||phase==='typing');
    section.dataset.heroText=text.replace('\n',' ');
    section.dataset.heroPhase=phase;
  }
  function pause(){
    if(timer===null)return;
    clearTimeout(timer);
    timer=null;
    remaining=Math.max(0,due-performance.now());
  }
  function sync(){
    const active=visible&&!document.hidden&&!reduced.matches;
    section.classList.toggle('title-paused',!active);
    if(!active){pause();return;}
    if(timer!==null)return;
    due=performance.now()+remaining;
    timer=setTimeout(step,remaining);
  }
  function step(){
    timer=null;
    if(phase==='hold')phase='deleting';
    if(phase==='deleting'){
      length--;
      if(length===0)phase='blank';
    }else if(phase==='blank'){
      phrase=(phrase+1)%phrases.length;
      length=1;
      phase='typing';
    }else if(phase==='typing'){
      length++;
      if(length===phrases[phrase].text.length)phase='hold';
    }
    remaining=phase==='hold'?holdMs:phase==='blank'?blankMs:phase==='deleting'?deleteMs:typeMs;
    paint();
    sync();
  }
  function reset(){
    pause();
    phrase=reduced.matches?1:0;
    length=phrases[phrase].text.length;
    phase='hold';
    remaining=holdMs;
    paint();
    sync();
  }
  section.classList.add('title-ready');
  document.addEventListener('visibilitychange',sync);
  addEventListener('pageshow',sync);
  reduced.addEventListener('change',reset);
  if('IntersectionObserver' in window)new IntersectionObserver(entries=>{
    visible=entries[0].isIntersecting;
    sync();
  }).observe(section);
  reset();
})();
