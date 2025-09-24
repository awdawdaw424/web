
(() => {
  const LOADING_MS = 6200;
  const END_SCREEN_MS = 2500;
  const loadingEl = document.getElementById('loading');
  const progressBar = document.querySelector('.progress .bar');
  const terminal = document.getElementById('terminal');
  const endScreen = document.getElementById('end-screen');
  const soundToggle = null;
  const particlesCanvas = document.getElementById('particles');

  if(!loadingEl || !progressBar){ return; }
  loadingEl.classList.add('prestart');

  const AudioEngine = (() => {
    const stdout = document.getElementById('aud-stdout');
    const granted = document.getElementById('aud-granted');
    const theme = document.getElementById('aud-theme');
    const music = document.getElementById('aud-music');

    const play = (el) => { if(!el) return; try { el.currentTime = 0; el.play(); } catch(_){} };
    const playCloned = (el) => { if(!el) return; try { const c = el.cloneNode(true); c.volume = el.volume || 0.4; c.play().catch(()=>{}); } catch(_){} };
    const fadeVolume = async (el, toVolume, durationMs = 1200) => {
      if(!el) return; const from = el.volume ?? 0; const steps = 30; const stepMs = durationMs/steps; const delta = (toVolume - from)/steps;
      for(let i=0;i<steps;i++){ el.volume = Math.max(0, Math.min(1, el.volume + delta)); await new Promise(r=>setTimeout(r, stepMs)); }
      el.volume = Math.max(0, Math.min(1, toVolume));
    };

    return {
      stdout: () => playCloned(stdout),
      granted: () => play(granted),
      theme: () => play(theme),
      musicStartQuiet: () => {
        if(!music) return; try {
          music.volume = 0.02;
          music.muted = true;
          music.loop = true;
          music.play().catch(()=>{});
        } catch(_){}
      },
      musicFadeTo: (toVol = 0.8) => fadeVolume(music, toVol, 1600),
      musicUnmute: () => { if(music){ music.muted = false; music.play().catch(()=>{}); } },
      ensureOnInteract: () => {
        const resume = () => { try { if(music){ music.muted = false; music.play().catch(()=>{}); } } catch(_){}; window.removeEventListener('pointerdown', resume); window.removeEventListener('keydown', resume); };
        window.addEventListener('pointerdown', resume, { once:true });
        window.addEventListener('keydown', resume, { once:true });
      }
    };
  })();

  const ParticleFX = (() => {
    if(!particlesCanvas) return { start:()=>{}, stop:()=>{} };
    const ctx = particlesCanvas.getContext('2d');
    let width = particlesCanvas.width = window.innerWidth;
    let height = particlesCanvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
      width = particlesCanvas.width = window.innerWidth;
      height = particlesCanvas.height = window.innerHeight;
    });

    const particles = [];
    const maxParticles = 220;
    const spawn = (x, y) => {
      for(let i=0;i<3;i++){
        if(particles.length > maxParticles) particles.shift();
        const angle = Math.random()*Math.PI*2;
        const speed = 0.5 + Math.random()*0.9;
        particles.push({
          x, y,
          vx: Math.cos(angle)*speed,
          vy: Math.sin(angle)*speed,
          life: 1,
          size: 3 + Math.random()*3
        });
      }
    };

    let lastX = width/2, lastY = height/2;
    window.addEventListener('pointermove', (e) => {
      lastX = e.clientX; lastY = e.clientY;
      spawn(lastX, lastY);
    });

    let rafId;
    const tick = () => {
      rafId = requestAnimationFrame(tick);
      ctx.clearRect(0,0,width,height);
      for(let i=0;i<particles.length;i++){
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.life -= 0.045;
        if(p.life <= 0){ particles.splice(i,1); i--; continue; }
        ctx.beginPath();
        const alpha = Math.min(0.24, Math.max(0, p.life*0.24));
        ctx.fillStyle = `rgba(255,255,255, ${alpha})`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
        ctx.fill();
      }
    };

    return {
      start(){ if(!rafId){ ctx.fillStyle = 'rgba(0,0,0,0)'; ctx.clearRect(0,0,width,height); tick(); } },
      stop(){ if(rafId){ cancelAnimationFrame(rafId); rafId = null; } }
    };
  })();

  const start = performance.now();
  const baseLines = [
    'NASA FELTÖRÉSE',
    'RIVALSOSOK DDOSOLÁSA',
    'ROCKET LEAGUE RUBIRL 1v1',
    'WH INJECTÁLÁSA',
    'CS2 DONK ALÁZÁSA',
    'AMD PROCIMON GRILLEZÉS ELKEZDÉSE',
    'WARZONE SZERVEREK RUGDOSÁSA',
    'SYSTEM STARTING'
  ];
  const lines = baseLines.map((text, i) => {
    const tag = String((i*0.12).toFixed(1)).padStart(5,' ');
    return `[${tag}] ${text}`;
  });

  const perCharMs = 10;
  const betweenLineMs = 26;
  let finished = false;

  const typeMany = async () => {
    const frag = document.createDocumentFragment();
    for(let i=0;i<lines.length;i++){
      const div = document.createElement('div');
      div.className = 'line';
      frag.appendChild(div);
    }
    terminal.appendChild(frag);

    for(let i=0;i<lines.length;i++){
      const div = terminal.children[i];
      const text = lines[i];
      for(let c=0;c<=text.length;c++){
        div.textContent = text.slice(0,c);
        await new Promise(r=>setTimeout(r, perCharMs + Math.random()*8));
      }
      if(!finished){ AudioEngine.stdout(); }
      await new Promise(r=>setTimeout(r, betweenLineMs));
      terminal.scrollTop = terminal.scrollHeight;
    }
  };

  const wait = (ms) => new Promise(r=>setTimeout(r, ms));

  const startExperience = () => {
    const bgVideo = document.getElementById('bg-video');
    try { if(bgVideo){ bgVideo.muted = true; bgVideo.play().catch(()=>{}); } } catch(_){}
    AudioEngine.musicStartQuiet();
    AudioEngine.ensureOnInteract();
    AudioEngine.musicUnmute();
    AudioEngine.musicFadeTo(0.08);
    setTimeout(() => { AudioEngine.musicFadeTo(0.25); }, 900);

    typeMany().then(async () => {
    let finished = true;
    AudioEngine.granted();
    await wait(160);
    loadingEl.style.animation = 'glitchFlash 180ms ease 0s 1';
    await wait(220);
    loadingEl.style.animation = '';

    if(endScreen){
      const inner = loadingEl.querySelector('.loading-inner');
      if(inner){ inner.classList.add('final'); }
      endScreen.classList.add('show');
      endScreen.setAttribute('aria-hidden','false');
    }
      AudioEngine.theme();

      await wait(END_SCREEN_MS); // keep the end screen visible longer
      loadingEl.classList.add('hidden');

      await wait(20);
      AudioEngine.musicFadeTo(0.8);


    });
  };

  // Wait for user click anywhere on loading screen
  const begin = (ev) => {
    loadingEl.classList.remove('prestart');
    const hint = loadingEl.querySelector('.click-hint');
    if(hint){
      hint.classList.add('hidden');

      setTimeout(() => { try { hint.remove(); } catch(_){} }, 320);
    }
    const inner = loadingEl.querySelector('.loading-inner');
    if(inner){ inner.style.filter = 'none'; }
    startExperience();
    ParticleFX.start();
    // Update spotlight position immediately on first click
    const shade = document.querySelector('.bg-shade');
    if(shade && ev){ const x = (ev.clientX/window.innerWidth)*100; const y = (ev.clientY/window.innerHeight)*100; shade.style.setProperty('--mx', x+'%'); shade.style.setProperty('--my', y+'%'); }
    window.removeEventListener('pointerdown', begin);
    window.removeEventListener('keydown', onKey);
  };
  const onKey = (e) => { if(e.key === 'Enter' || e.key === ' '){ begin(); } };
  window.addEventListener('pointerdown', begin, { once:true });
  window.addEventListener('keydown', onKey, { once:true });

  // Navbar: Discord dropdown toggle
  (function(){
    const item = document.getElementById('nav-discord');
    if(!item) return;
    const btn = item.querySelector('.dropdown-toggle');
    const menu = item.querySelector('.dropdown-menu');
    const setOpen = (open) => {
      if(open){ item.classList.add('open'); btn?.setAttribute('aria-expanded','true'); menu?.setAttribute('aria-hidden','false'); }
      else { item.classList.remove('open'); btn?.setAttribute('aria-expanded','false'); menu?.setAttribute('aria-hidden','true'); }
    };
    btn?.addEventListener('click', (e) => { e.stopPropagation(); setOpen(!item.classList.contains('open')); });
    document.addEventListener('click', (e) => { if(!item.contains(e.target)){ setOpen(false); } });
    document.addEventListener('keydown', (e) => { if(e.key === 'Escape'){ setOpen(false); } });
  })();


  
})();


const PixelBat = (() => {
  const bat = document.getElementById('pixel-bat');
  if (!bat) return { init: () => {} };

  let mouseX = 0, mouseY = 0;
  let batX = 0, batY = 0;
  let batZ = 0; // Z-axis for 3D movement
  let verticalOffset = 0; // Vertical floating offset
  let isMoving = false;
  let lastMoveTime = Date.now();
  let animationId = null;
  let floatTime = 0; // For vertical floating animation

  const FOLLOW_SPEED = 0.06; // Slower, smoother following
  const FOLLOW_DISTANCE = 40; // Distance to keep from cursor
  const IDLE_DELAY = 1200;
  const VERTICAL_RANGE = 15; // How much to float up/down
  const DEPTH_VARIATION = 20; // Scale variation for depth

  // Update bat position with smooth following at distance in 3D space
  const updatePosition = () => {
    floatTime += 0.02; // Increment time for floating animation
    
    const dx = mouseX - batX;
    const dy = mouseY - batY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Only follow if we're too far or too close
    if (distance > FOLLOW_DISTANCE + 10 || distance < FOLLOW_DISTANCE - 10) {
      // Calculate target position at desired distance
      const angle = Math.atan2(dy, dx);
      const targetX = mouseX - Math.cos(angle) * FOLLOW_DISTANCE;
      const targetY = mouseY - Math.sin(angle) * FOLLOW_DISTANCE;
      
      // Move towards target position
      const targetDx = targetX - batX;
      const targetDy = targetY - batY;
      
      batX += targetDx * FOLLOW_SPEED;
      batY += targetDy * FOLLOW_SPEED;
      
      // Add vertical floating motion
      verticalOffset = Math.sin(floatTime) * VERTICAL_RANGE;
      
      // Add depth variation (Z-axis simulation)
      batZ = Math.cos(floatTime * 0.7) * DEPTH_VARIATION;
      const scale = 1 + (batZ / 100); // Scale based on depth
      
      bat.style.left = batX + 'px';
      bat.style.top = (batY + verticalOffset) + 'px';
      
      // Rotate bat based on movement direction and add banking
      const rotationAngle = Math.atan2(targetDy, targetDx) * (180 / Math.PI);
      const banking = Math.sin(floatTime * 1.2) * 15; // Banking rotation
      
      bat.style.transform = `translate(-50%, -50%) 
        rotate(${rotationAngle * 0.1}deg) 
        rotateY(${banking}deg) 
        scale(${scale})`;
      
      lastMoveTime = Date.now();
      
      if (!isMoving) {
        isMoving = true;
        bat.classList.add('moving');
        bat.classList.remove('idle');
      }
    } else {
      // Still do floating animation even when not moving horizontally
      verticalOffset = Math.sin(floatTime) * (VERTICAL_RANGE * 0.5);
      batZ = Math.cos(floatTime * 0.5) * (DEPTH_VARIATION * 0.5);
      const scale = 1 + (batZ / 150);
      
      bat.style.top = (batY + verticalOffset) + 'px';
      
      const banking = Math.sin(floatTime * 0.8) * 8;
      bat.style.transform = `translate(-50%, -50%) 
        rotateY(${banking}deg) 
        scale(${scale})`;
    }

    // Check if bat should go idle
    if (isMoving && Date.now() - lastMoveTime > IDLE_DELAY) {
      isMoving = false;
      bat.classList.remove('moving');
      bat.classList.add('idle');
    }

    animationId = requestAnimationFrame(updatePosition);
  };

  // Handle mouse movement
  const onMouseMove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    if (!bat.classList.contains('active')) {
      bat.classList.add('active');
      batX = mouseX;
      batY = mouseY;
      bat.style.left = batX + 'px';
      bat.style.top = batY + 'px';
    }
  };

  // Hide bat when mouse leaves
  const onMouseLeave = () => {
    bat.classList.remove('active', 'moving', 'idle');
  };

  // Show bat when mouse enters
  const onMouseEnter = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    batX = mouseX;
    batY = mouseY;
    bat.style.left = batX + 'px';
    bat.style.top = batY + 'px';
    bat.classList.add('active');
  };

  const init = () => {
    if (!window.matchMedia('(hover: hover)').matches) {
      return;
    }
    const loadingEl = document.getElementById('loading');
    const checkLoading = () => {
      if (!loadingEl || loadingEl.classList.contains('hidden')) {
        // Activate bat
        document.addEventListener('mousemove', onMouseMove, { passive: true });
        document.addEventListener('mouseleave', onMouseLeave, { passive: true });
        document.addEventListener('mouseenter', onMouseEnter, { passive: true });
        
        updatePosition();
      } else {
        setTimeout(checkLoading, 500);
      }
    };
    checkLoading();
  };

  const destroy = () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseleave', onMouseLeave);
    document.removeEventListener('mouseenter', onMouseEnter);
    bat.classList.remove('active', 'moving', 'idle');
  };

  return { init, destroy };
})();


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    PixelBat.init();
  });
} else {
  PixelBat.init();
}

// Copy to clipboard functionality
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    // Visual feedback - show tooltip or brief animation
    const copyBtn = document.querySelector('.copy-btn');
    if (copyBtn) {
      const originalTitle = copyBtn.title;
      copyBtn.title = 'Másolva!';
      copyBtn.style.color = 'var(--accent)';
      setTimeout(() => {
        copyBtn.title = originalTitle;
        copyBtn.style.color = '';
      }, 1200);
    }
  }).catch(() => {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      const copyBtn = document.querySelector('.copy-btn');
      if (copyBtn) {
        const originalTitle = copyBtn.title;
        copyBtn.title = 'Másolva!';
        copyBtn.style.color = 'var(--accent)';
        setTimeout(() => {
          copyBtn.title = originalTitle;
          copyBtn.style.color = '';
        }, 1200);
      }
    } catch (err) {
      console.error('Copy failed:', err);
    }
    document.body.removeChild(textArea);
  });
}


