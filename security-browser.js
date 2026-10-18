/* Progressive enhancement: without JavaScript, the index opens each full case study. */
(() => {
 const browser=document.querySelector('[data-security-browser]');
 if(!browser)return;
 const list=browser.querySelector('.security-project-index'),choices=[...browser.querySelectorAll('[data-security-target]')],status=browser.querySelector('[data-security-status]');
 const panels=choices.map(choice=>document.getElementById(choice.dataset.securityTarget));
 if(!list||!choices.length||panels.some(panel=>!panel))return;
 let selected=0;
 list.setAttribute('role','tablist');
 list.setAttribute('aria-orientation','horizontal');
 choices.forEach((choice,index)=>{
  choice.setAttribute('role','tab');choice.setAttribute('aria-controls',panels[index].id);
  panels[index].setAttribute('role','tabpanel');panels[index].setAttribute('aria-labelledby',choice.id);
 });
 function select(index,focus=false){
  if(index<0||index>=choices.length)return;
  selected=index;
  choices.forEach((choice,i)=>{
   const active=i===index;
   choice.setAttribute('aria-selected',String(active));choice.tabIndex=active?0:-1;panels[i].hidden=!active;
   panels[i].querySelector('.project-panel')?.classList.remove('pointer-active');
  });
  if(status)status.textContent=`${String(index+1).padStart(2,'0')} / ${String(choices.length).padStart(2,'0')}`;
  if(focus)choices[index].focus({preventScroll:true});
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
  if(index<0){if(initial)select(0);return;}
  select(index);
  requestAnimationFrame(()=>panels[index].scrollIntoView({block:'start',behavior:'instant'}));
 }
 followHash(true);browser.classList.add('is-ready');
 addEventListener('hashchange',()=>followHash());
})();
