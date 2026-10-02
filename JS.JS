/* ===== CONFIGURAÇÃO — troque pelos seus arquivos ===== */
const VIDEO_URL = "";        // ex.: "video/fundo.mp4"
const AVATAR_URL = "";       // foto do CEO
// Mínimo de 4 imagens por carrossel (loop infinito). Vazio = quadro amarelo.
const IMAGES = {
  foto:   ["","","",""],
  design: ["","","",""],
  ident:  ["","","",""]
};
const SPECS = {
  foto:  {t:"Fotografia", p:"Cada clique é uma memória guardada. Fotografamos com luz natural e olhar autoral, para você reviver o momento como ele foi sentido.", l:["Ensaios","Eventos","Retratos","Vídeo e reels","Fotografia de produto"]},
  design:{t:"Design e propaganda", p:"Da ideia ao feed. Criamos campanhas e peças gráficas com clareza e impacto, pensadas para chamar atenção e gerar resultado.", l:["Posts e stories","Campanhas","Banners","Materiais impressos","Conteúdo para redes"]},
  ident: {t:"Identidade visual", p:"Sua marca merece ser reconhecida antes mesmo de ser lida. Desenhamos a linguagem completa: forma, cor e voz.", l:["Logotipo","Paleta de cores","Tipografia","Manual da marca","Papelaria"]}
};

/* ===== INTRO ===== */
const intro=document.getElementById('intro'), scenes=['s1','s2','s3'].map(i=>document.getElementById(i)), hint=document.getElementById('hint');
const vid=document.getElementById('bgvideo');
if(VIDEO_URL){vid.src=VIDEO_URL;vid.hidden=false;vid.play().catch(()=>{})}
let step=0,timers=[],finished=false;
function show(n){scenes.forEach((s,i)=>s.classList.toggle('on',i===n))}
function finish(){
  if(finished)return;finished=true;timers.forEach(clearTimeout);
  intro.classList.add('done');document.body.classList.remove('locked');window.scrollTo(0,0);
}
show(0);
timers.push(setTimeout(()=>show(1),2200),setTimeout(()=>show(2),4400),setTimeout(()=>{hint.classList.add('on');hint.tabIndex=0},5800));
/* Após a logo, o scroll/toque libera o site */
function tryScroll(){if(step===0&&hint.classList.contains('on'))finish()}
addEventListener('wheel',tryScroll,{passive:true});
let ty=0;
intro.addEventListener('touchstart',e=>ty=e.touches[0].clientY,{passive:true});
intro.addEventListener('touchmove',e=>{if(ty-e.touches[0].clientY>25)tryScroll()},{passive:true});
hint.addEventListener('click',finish);
addEventListener('keydown',e=>{if(hint.classList.contains('on')&&['Enter',' ','ArrowDown'].includes(e.key))finish()});

/* ===== AVATAR ===== */
if(AVATAR_URL)document.getElementById('avatar').innerHTML='<img alt="Davi Gabriel" src="'+AVATAR_URL+'">';

/* ===== CARROSSEL (loop) ===== */
document.querySelectorAll('.car').forEach(car=>{
  const list=IMAGES[car.dataset.k], n=list.length;
  const els=list.map(src=>{const d=document.createElement('div');d.className='slide';if(src)d.innerHTML='<img alt="" src="'+src+'">';car.appendChild(d);return d});
  let cur=0,timer;
  function render(){
    els.forEach((el,i)=>{
      let o=((i-cur)%n+n)%n; if(o>n/2)o-=n;
      const hide=Math.abs(o)>1;
      const x=o*108, s=o===0?1:.82;
      el.style.transform='translateX('+x+'%) scale('+s+')';
      el.style.opacity=hide?0:(o===0?1:.9);
      el.style.zIndex=o===0?2:1;
    });
  }
  function go(d){cur=((cur+d)%n+n)%n;render();restart()}
  function restart(){clearInterval(timer);timer=setInterval(()=>go(1),3200)}
  let sx=null;
  car.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});
  car.addEventListener('touchend',e=>{if(sx===null)return;const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>30)go(dx<0?1:-1);sx=null});
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