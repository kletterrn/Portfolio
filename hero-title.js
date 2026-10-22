/* A time-driven title. The hidden original reserves space, and screen readers receive one stable heading. */
(() => {
 const section=document.querySelector('[data-timed-hero]'),firstLine=section?.querySelector('.hero-type-first-line'),secondLine=section?.querySelector('[data-type-second-line]'),first=section?.querySelector('[data-type-first]'),prefix=section?.querySelector('[data-type-prefix]'),second=section?.querySelector('[data-type-second]'),caret=section?.querySelector('[data-type-caret]');
 if(!section||!firstLine||!secondLine||!first||!prefix||!second||!caret)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),phrases=['A designer’s eye.\nA developer’s curiosity.','David\nKhaliqi.'],introPrefix='A developer’s ';
 const holdMs=4500,deleteMs=32,typeMs=85,blankMs=260;
 let phrase=0,length=phrases[0].length,phase='hold',timer=null,due=0,remaining=holdMs;
 const rect=section.getBoundingClientRect();let visible=rect.bottom>0&&rect.top<innerHeight;
 function paint(){
  const text=phrases[phrase].slice(0,length),parts=text.split('\n'),line=parts[1]||'';
  first.textContent=parts[0];prefix.textContent=phrase===0?line.slice(0,introPrefix.length):'';second.textContent=phrase===0?line.slice(introPrefix.length):line;
  (parts.length>1?(phrase===0&&line.length<=introPrefix.length?prefix:second):first).append(caret);
  section.classList.toggle('is-editing',phase==='deleting'||phase==='typing'||phase==='blank');section.classList.toggle('is-name',phrase===1);
  section.dataset.heroText=text.replace('\n',' ');section.dataset.heroPhase=phase;
 }
 function pause(){if(timer===null)return;clearTimeout(timer);timer=null;remaining=Math.max(0,due-performance.now());}
 function sync(){if(!visible||document.hidden||reduced.matches){pause();return;}if(timer!==null)return;due=performance.now()+remaining;timer=setTimeout(step,remaining);}
 function step(){
  timer=null;if(phase==='hold')phase='deleting';
  if(phase==='deleting'){length--;if(length===0)phase='blank';}
  else if(phase==='blank'){phrase=(phrase+1)%phrases.length;length=1;phase='typing';}
  else if(phase==='typing'){length++;if(length===phrases[phrase].length)phase='hold';}
  remaining=phase==='hold'?holdMs:phase==='blank'?blankMs:phase==='deleting'?deleteMs:typeMs;paint();sync();
 }
 function reset(){pause();phrase=reduced.matches?1:0;length=phrases[phrase].length;phase='hold';remaining=holdMs;paint();sync();}
 document.addEventListener('visibilitychange',sync);addEventListener('pageshow',sync);reduced.addEventListener('change',reset);
 if('IntersectionObserver' in window)new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();}).observe(section);
 reset();
})();
