(() => {
  const hero=document.querySelector('.studio-intro');
  const stage=hero?.querySelector('.intro-stage');
  const pane=hero?.querySelector('[data-project-window]');
  const identity=hero?.querySelector('.intro-identity');
  const bio=hero?.querySelector('.intro-bio');
  if(!hero||!stage||!pane||!identity||!bio)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const wide=matchMedia('(min-width: 1000px)');
  const clamp=value=>Math.max(0,Math.min(1,value));
  const ease=(a,b,value)=>{const t=clamp((value-a)/(b-a));return t*t*(3-2*t);};
  const mix=(a,b,t)=>a+(b-a)*t;
  let frame=0,geometry=null;
  const projects={
    ignis:{category:'01 / Web application',href:'/work/ignis/',caption:'Satellite data.',detail:'A clearer perspective.'},
    orion:{category:'02 / Modelling & game systems',href:'/work/orion/',caption:'Original geometry.',detail:'Interactive exploration.'},
    botium:{category:'03 / Internal security audit',href:'/work/botium-audit/',caption:'Find the gaps.',detail:'Understand the risk.'}
  };
  const buttons=[...hero.querySelectorAll('[data-project-choice]')];
  const previews=[...hero.querySelectorAll('[data-preview]')];
  function select(name){
    const project=projects[name];if(!project)return;
    previews.forEach(preview=>preview.hidden=preview.dataset.preview!==name);
    buttons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.projectChoice===name)));
    hero.querySelector('[data-window-category]').textContent=project.category;
    hero.querySelector('[data-window-link]').href=project.href;
    const caption=hero.querySelector('[data-window-caption]');
    const detail=document.createElement('span');detail.textContent=project.detail;
    caption.replaceChildren(document.createTextNode(project.caption),document.createElement('br'),detail);
    pane.dataset.activeProject=name;
  }
  buttons.forEach(button=>button.addEventListener('click',()=>select(button.dataset.projectChoice)));
  function measure(){
    const w=stage.clientWidth,h=stage.clientHeight;
    const gutter=parseFloat(getComputedStyle(identity).paddingLeft)||32;
    const initialWidth=w*.42,initialHeight=Math.min(h*.78,initialWidth/1.4+124);
    geometry={w,h,gutter,x:w*.54,y:(h-initialHeight)/2,width:initialWidth,height:initialHeight};
  }
  function render(){
    frame=0;
    if(!geometry)measure();
    const motion=wide.matches&&!reduced.matches;
    if(!wide.matches){
      ['left','top','width','height'].forEach(name=>pane.style.removeProperty(name));
      hero.style.setProperty('--identity-opacity','1');hero.style.setProperty('--identity-y','0px');
      hero.classList.remove('intro-past');bio.inert=false;return;
    }
    const top=parseFloat(getComputedStyle(hero).getPropertyValue('--header-height'))||85;
    const range=Math.max(1,hero.offsetHeight-stage.clientHeight);
    const progress=motion?clamp((top-hero.getBoundingClientRect().top)/range):0;
    const open=ease(.08,.9,progress),exit=ease(.1,.6,progress);
    const g=geometry;
    pane.style.left=mix(g.x,g.gutter,open).toFixed(2)+'px';
    pane.style.top=mix(g.y,g.h*.07,open).toFixed(2)+'px';
    pane.style.width=mix(g.width,g.w-g.gutter*2,open).toFixed(2)+'px';
    pane.style.height=mix(g.height,g.h*.84,open).toFixed(2)+'px';
    hero.style.setProperty('--identity-opacity',(1-exit).toFixed(4));
    hero.style.setProperty('--identity-y',(-exit*32).toFixed(2)+'px');
    hero.classList.toggle('intro-past',exit>.99);
    bio.inert=exit>.99;
    hero.dataset.windowProgress=progress.toFixed(3);
  }
  function schedule(){if(!frame&&!document.hidden)frame=requestAnimationFrame(render);}
  function resize(){
    hero.classList.toggle('studio-motion',wide.matches&&!reduced.matches);
    geometry=null;schedule();
  }
  hero.classList.add('studio-ready');
  select('ignis');hero.classList.toggle('studio-motion',wide.matches&&!reduced.matches);render();
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',resize,{passive:true});
  addEventListener('pageshow',resize);
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){cancelAnimationFrame(frame);frame=0;}else resize();
  });
  reduced.addEventListener('change',resize);wide.addEventListener('change',resize);
  if('ResizeObserver' in window)new ResizeObserver(()=>{geometry=null;schedule();}).observe(stage);
})();
