(() => {
  const exhibit=document.querySelector('[data-packet-exhibit]');
  if(!exhibit)return;
  const de=document.documentElement.lang==='de';
  const attempts=[
    ['13:24:32.192571','13:24:36.098564','254'],
    ['13:26:32.192571','13:27:15.934126','320'],
    ['13:28:32.192571','13:28:50.022967','150']
  ];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const buttons=[...exhibit.querySelectorAll('[data-attempt]')];
  const status=exhibit.querySelector('[data-packet-status]');
  const replay=exhibit.querySelector('[data-replay]');
  let active=0,timer=0,frame=0;
  function stop(){
    clearTimeout(timer);cancelAnimationFrame(frame);
    exhibit.classList.remove('is-replaying');
    replay.textContent=de?'Austausch abspielen ↗':'Replay exchange ↗';
  }
  function select(index){
    stop();active=index;
    buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(index===i)));
    exhibit.querySelector('[data-request-time]').textContent=attempts[index][0];
    exhibit.querySelector('[data-response-time]').textContent=attempts[index][1];
    exhibit.querySelector('[data-response-length]').textContent=attempts[index][2];
    status.textContent=de?'Versuch '+(index+1)+': Auf eine DNS-Anfrage über UDP folgt die ICMP-Meldung „Port unreachable“. Eine DNS-Antwort ist nicht zu sehen.':'Attempt '+(index+1)+': a DNS query over UDP is followed by an ICMP port-unreachable message. No DNS answer is shown.';
  }
  buttons.forEach((button,index)=>button.addEventListener('click',()=>select(index)));
  replay.addEventListener('click',()=>{
    stop();
    if(reduced.matches){status.textContent=de?'Versuch '+(active+1)+': DNS-Anfrage → Server; ICMP „Port unreachable“ → Client. Animationen sind laut Geräteeinstellung deaktiviert.':'Attempt '+(active+1)+': DNS request → server; ICMP port-unreachable → client. Motion is disabled by your device preference.';return;}
    replay.textContent=de?'Austausch läuft …':'Playing exchange…';
    frame=requestAnimationFrame(()=>{frame=requestAnimationFrame(()=>{
      exhibit.classList.add('is-replaying');
      status.textContent=de?'Veranschaulichter Austausch: DNS-Anfrage an UDP-Port 53, danach eine ICMP-Fehlermeldung zurück an den Client. Das Timing ist schematisch.':'Illustrated exchange: DNS query to UDP port 53, followed by an ICMP error returning to the client. Playback timing is illustrative.';
      timer=setTimeout(()=>{stop();select(active);},2900);
    });});
  });
  reduced.addEventListener('change',stop);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
  if('IntersectionObserver' in window)new IntersectionObserver(([entry])=>{if(!entry.isIntersecting)stop();}).observe(exhibit);
})();
