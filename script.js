/* ===== TEXTOS DOS POP-UPS (as imagens do carrossel ficam no index.html) ===== */
const SPECS = {
  foto:  {t:"Fotografia", p:"Cada clique é uma memória guardada. Fotografamos com luz natural e olhar autoral, para você reviver o momento como ele foi sentido.", l:["Ensaios","Eventos","Retratos","Vídeo e reels","Fotografia de produto"]},
  design:{t:"Design e propaganda", p:"Da ideia ao feed. Criamos campanhas e peças gráficas com clareza e impacto, pensadas para chamar atenção e gerar resultado.", l:["Posts e stories","Campanhas","Banners","Materiais impressos","Conteúdo para redes"]},
  ident: {t:"Identidade visual", p:"Sua marca merece ser reconhecida antes mesmo de ser lida. Desenhamos a linguagem completa: forma, cor e voz.", l:["Logotipo","Paleta de cores","Tipografia","Manual da marca","Papelaria"]}
};

/* ===== INTRO ===== */
const intro=document.getElementById('intro'),
      scenes=['s1','s2','s3'].map(i=>document.getElementById(i)),
      hint=document.getElementById('hint'),
      bgvideo=document.getElementById('bgvideo');
let timers=[],finished=false;
function show(n){scenes.forEach((s,i)=>s.classList.toggle('on',i===n))}
function finish(){
  if(finished)return;finished=true;timers.forEach(clearTimeout);
  intro.classList.add('done');
  document.body.classList.remove('locked');
  window.scrollTo(0,0);
  if(bgvideo)setTimeout(()=>bgvideo.pause(),500); // poupa bateria depois que a intro some
}
show(0);
/* Velocidade da intro (em milissegundos) — menor = mais rápido */
const T_CENA2=800, T_LOGO=1600, T_BOTAO=2200;
timers.push(
  setTimeout(()=>show(1),T_CENA2),
  setTimeout(()=>show(2),T_LOGO),
  setTimeout(()=>{hint.classList.add('on');hint.tabIndex=0},T_BOTAO)
);
/* A ação do visitante só é aceita quando a logo já apareceu */
function tryScroll(){if(hint.classList.contains('on'))finish()}
addEventListener('wheel',tryScroll,{passive:true});
let ty=0;
intro.addEventListener('touchstart',e=>{ty=e.touches[0].clientY},{passive:true});
intro.addEventListener('touchmove',e=>{if(ty-e.touches[0].clientY>25)tryScroll()},{passive:true});
hint.addEventListener('click',finish);
addEventListener('keydown',e=>{if(hint.classList.contains('on')&&['Enter',' ','ArrowDown'].includes(e.key))finish()});

/* ===== CARROSSEL (loop) — lê as <img> que estão dentro de cada .car no HTML ===== */
document.querySelectorAll('.car').forEach(car=>{
  const imgs=[...car.querySelectorAll('img')];
  const data=imgs.length?imgs.map(i=>({src:i.getAttribute('src'),alt:i.alt})):[{},{},{},{}];
  car.innerHTML='';
  const n=data.length;
  const els=data.map(d=>{
    const s=document.createElement('div');s.className='slide';
    if(d.src){const im=new Image();im.src=d.src;im.alt=d.alt||'';im.onerror=()=>im.remove();s.appendChild(im)}
    car.appendChild(s);return s;
  });
  let cur=0,timer;
  function render(){
    const far=matchMedia("(min-width:900px)").matches?2:1;
    els.forEach((el,i)=>{
      let o=((i-cur)%n+n)%n; if(o>n/2)o-=n;
      const a=Math.abs(o), hide=a>far;
      const x=o*108, s=a===0?1:a===1?.85:.72;
      el.style.transform='translateX('+x+'%) scale('+s+')';
      el.style.opacity=hide?0:(a===0?1:a===1?.9:.7);
      el.style.zIndex=o===0?2:1;
    });
  }
  function go(d){cur=((cur+d)%n+n)%n;render();restart()}
  function restart(){clearInterval(timer);timer=setInterval(()=>go(1),3200)}
  let sx=null;
  car.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});
  car.addEventListener('touchend',e=>{
    if(sx===null)return;
    const dx=e.changedTouches[0].clientX-sx;
    if(Math.abs(dx)>30)go(dx<0?1:-1);
    sx=null;
  });
  addEventListener('resize',render);
  render();restart();
});

/* ===== POP-UP ESPECIALIDADES ===== */
const modal=document.getElementById('modal'),pill=document.getElementById('pill');
let lastBtn=null;
document.querySelectorAll('.ico').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.ico').forEach(x=>x.setAttribute('aria-pressed',x===b));
  const s=SPECS[b.dataset.k];
  pill.textContent=s.t.toUpperCase();
  document.getElementById('mt').textContent=s.t;
  document.getElementById('mp').textContent=s.p;
  document.getElementById('ml').innerHTML=s.l.map(x=>'<li>'+x+'</li>').join('');
  lastBtn=b;modal.classList.add('open');document.getElementById('close').focus();
}));
function closeModal(){modal.classList.remove('open');lastBtn&&lastBtn.focus()}
document.getElementById('close').onclick=closeModal;
modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});

