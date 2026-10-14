(()=>{
  const canvas=document.querySelector('.about-particles');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  if(!ctx)return;
  const hero=canvas.closest('.hero');
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  let width=0,height=0,frame=0,visible=true;
  function resize(){const r=hero.getBoundingClientRect();width=r.width;height=r.height;const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)}
  const particles=Array.from({length:26},(_,i)=>({phase:i*2.399,speed:.07+(i%5)*.009,size:i%4===0?2:1.1}));
  function draw(ms){frame=0;if(!visible||document.hidden||motion.matches)return;ctx.clearRect(0,0,width,height);const t=ms*.001;
    particles.forEach((p,i)=>{const angle=p.phase+t*p.speed;const rx=width*(.15+(i%3)*.035),ry=height*(.17+(i%3)*.038);const x=width*.765+Math.cos(angle)*rx;const y=height*.48+Math.sin(angle)*ry+Math.cos(angle)*height*.075;const alpha=.25+.4*(.5+.5*Math.sin(angle));const glow=ctx.createRadialGradient(x,y,0,x,y,11);glow.addColorStop(0,`rgba(166,222,255,${alpha})`);glow.addColorStop(.23,`rgba(73,166,255,${alpha*.45})`);glow.addColorStop(1,'rgba(73,166,255,0)');ctx.fillStyle=glow;ctx.beginPath();ctx.arc(x,y,11,0,Math.PI*2);ctx.fill();ctx.fillStyle=`rgba(215,241,255,${alpha})`;ctx.beginPath();ctx.arc(x,y,p.size,0,Math.PI*2);ctx.fill();});
    frame=requestAnimationFrame(draw);
  }
  function sync(){if(frame)cancelAnimationFrame(frame);frame=0;hero.style.animationPlayState=visible&&!document.hidden?'running':'paused';hero.querySelector('.hero-image').style.animationPlayState=visible&&!document.hidden?'running':'paused';if(visible&&!document.hidden&&!motion.matches)frame=requestAnimationFrame(draw);else ctx.clearRect(0,0,width,height)}
  new ResizeObserver(resize).observe(hero);
  if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()},{threshold:0}).observe(hero);
  document.addEventListener('visibilitychange',sync);motion.addEventListener('change',sync);resize();sync();
})();
