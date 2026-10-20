/* Six-second rotation pauses for reading, manual selection, reduced motion and hidden views. */
(() => {
 const browser=document.querySelector('[data-security-browser]');
 if(!browser)return;
 const list=browser.querySelector('.security-project-index'),choices=[...browser.querySelectorAll('[data-security-target]')],status=browser.querySelector('[data-security-status]'),toggle=browser.querySelector('[data-security-rotation]'),stage=browser.querySelector('.security-project-stage');
 const panels=choices.map(choice=>document.getElementById(choice.dataset.securityTarget));
 if(!list||!choices.length||!stage||panels.some(panel=>!panel))return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),intervalMs=6000;
 let selected=-1,paused=reduced.matches,hovered=false,visible=false,timer=null,due=0,remaining=intervalMs;
 list.setAttribute('role','tablist');list.setAttribute('aria-orientation','horizontal');
 choices.forEach((choice,index)=>{
  choice.setAttribute('role','tab');choice.setAttribute('aria-controls',panels[index].id);
  panels[index].setAttribute('role','tabpanel');panels[index].setAttribute('aria-labelledby',choice.id);
 });
 function paintControl(){
  if(!toggle)return;
  toggle.hidden=false;
  toggle.setAttribute('aria-label',paused?'Start automatic project rotation':'Pause automatic project rotation');
  toggle.querySelector('span').textContent=paused?'Play':'Pause';
  toggle.querySelector('path').setAttribute('d',paused?'M6 3l9 7-9 7V3Z':'M6 4v12M13 4v12');
  toggle.dataset.paused=String(paused);
 }
 function stop(){
  if(timer!==null){clearTimeout(timer);timer=null;remaining=Math.max(0,due-performance.now());}
  browser.dataset.rotationRunning='false';
 }
 function sync(){
  if(paused||hovered||!visible||document.hidden){stop();return;}
  if(timer!==null)return;
  due=performance.now()+remaining;browser.dataset.rotationRunning='true';
  timer=setTimeout(()=>{timer=null;remaining=intervalMs;select((selected+1)%choices.length,false,'auto');},remaining);
 }
 function select(index,focus=false,origin='manual'){
  if(index<0||index>=choices.length)return;
  if(origin==='manual')paused=true;
  if(index!==selected){stop();remaining=intervalMs;}
  selected=index;
  choices.forEach((choice,i)=>{
   const active=i===index;
   choice.setAttribute('aria-selected',String(active));choice.tabIndex=active?0:-1;panels[i].hidden=!active;
   panels[i].querySelector('.project-panel')?.classList.remove('pointer-active');
  });
  if(status){status.setAttribute('aria-live',origin==='manual'?'polite':'off');status.textContent=`${String(index+1).padStart(2,'0')} / ${String(choices.length).padStart(2,'0')}`;}
  if(focus)choices[index].focus({preventScroll:true});
  paintControl();sync();
 }
 choices.forEach((choice,index)=>{
  choice.addEventListener('click',event=>{
   if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
   event.preventDefault();select(index);
  });
  choice.addEventListener('keydown',event=>{
   if(event.key===' '){event.preventDefault();select(index);return;}
   let next;
   if(event.key==='ArrowRight'||event.key==='ArrowDown')next=(selected+1)%choices.length;
   else if(event.key==='ArrowLeft'||event.key==='ArrowUp')next=(selected-1+choices.length)%choices.length;
   else if(event.key==='Home')next=0;
   else if(event.key==='End')next=choices.length-1;
   else return;
   event.preventDefault();select(next,true);
  });
 });
 function followHash(initial=false){
  const index=panels.findIndex(panel=>`#${panel.id}`===location.hash);
  if(index<0){
   const collectionOnly=['#project-syn-flood','#project-website-compromise','#project-network-hardening','#project-icmp-response'];
   if(browser.hasAttribute('data-security-featured')&&collectionOnly.includes(location.hash)){location.replace('/cybersecurity/'+location.hash);return;}
   if(initial)select(0,false,'initial');return;
  }
  select(index);
  requestAnimationFrame(()=>panels[index].scrollIntoView({block:'start',behavior:'instant'}));
 }
 toggle?.addEventListener('click',()=>{paused=!paused;paintControl();sync();});
 browser.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'){hovered=true;sync();}});
 browser.addEventListener('pointerleave',event=>{if(event.pointerType==='mouse'){hovered=false;sync();}});
 browser.addEventListener('pointerdown',event=>{if(event.pointerType==='touch'){paused=true;paintControl();sync();}},{passive:true});
 browser.addEventListener('focusin',event=>{if(toggle?.contains(event.target))return;paused=true;paintControl();sync();});
 document.addEventListener('visibilitychange',sync);
 addEventListener('pagehide',stop);addEventListener('pageshow',sync);
 reduced.addEventListener('change',()=>{if(reduced.matches)paused=true;paintControl();sync();});
 followHash(true);browser.classList.add('is-ready');addEventListener('hashchange',()=>followHash());
 if('IntersectionObserver' in window){new IntersectionObserver(entries=>{visible=entries[0].isIntersecting&&entries[0].intersectionRatio>=.25;sync();},{threshold:.25}).observe(stage);}
 else{visible=true;sync();}
})();

