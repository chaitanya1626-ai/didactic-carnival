/* ==========================================================================
   For My Dearest Sister - Interactive Experience
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Element References ---
  const canvas = document.getElementById('ambient-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  const yesBtn = document.getElementById('yes-btn');
  const noBtn = document.getElementById('no-btn');
  const noBtnText = document.getElementById('no-btn-text');
  const promptBox = document.getElementById('prompt-box');
  const successCard = document.getElementById('success-card');
  const bearAvatar = document.getElementById('bear-avatar');
  const sadEyes = document.getElementById('sad-eyes');
  const happyEyes = document.getElementById('happy-eyes');
  const sadMouth = document.getElementById('sad-mouth');
  const happyMouth = document.getElementById('happy-mouth');
  const characterCaption = document.getElementById('character-caption');
  const replayBtn = document.getElementById('replay-celebration');
  const audioToggle = document.getElementById('audio-toggle');
  const audioIcon = document.getElementById('audio-icon');

  // State variables
  let dodgeCount = 0;
  let yesScale = 1;
  let isForgiven = false;

  // Playful evasion messages for the "No" button
  const noMessages = [
    "Are you sure? 🥺",
    "Try again! 😜",
    "Still mad? 😢",
    "You have to forgive me! 💕",
    "Bhai promises ice cream! 🍨",
    "Pretty please? 🥹",
    "You can't click me! 🏃‍♂️💨",
    "Just click Yes! 💖",
    "Best Bhai loves you! 🧸",
    "Don't be angry na! 🌸",
    "I'll give you chocolates! 🍫",
    "Okay, last chance to click Yes! ✨"
  ];

  /* ==========================================================================
     1. Dynamic Background: Floating Hearts & Sparkles Canvas
     ========================================================================== */
  let width, height;
  let hearts = [];
  const heartCount = 38;

  function resizeCanvas() {
    if (!canvas) return;
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('orientationchange', () => {
    setTimeout(resizeCanvas, 200);
  });
  resizeCanvas();

  class FloatingHeart {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 30;
      this.size = Math.random() * 18 + 10;
      this.speedY = Math.random() * 0.7 + 0.35;
      this.speedX = Math.random() * 0.4 - 0.2;
      this.opacity = Math.random() * 0.45 + 0.2;
      this.hue = Math.random() > 0.4 ? (Math.random() * 30 + 330) : (Math.random() * 40 + 260); // pink to lavender
      this.swaySpeed = Math.random() * 0.02 + 0.01;
      this.swayOffset = Math.random() * Math.PI * 2;
    }

    update() {
      this.y -= this.speedY;
      this.swayOffset += this.swaySpeed;
      this.x += Math.sin(this.swayOffset) * 0.6 + this.speedX;

      if (this.y < -40 || this.x < -40 || this.x > width + 40) {
        this.reset();
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.scale(this.size / 20, this.size / 20);
      ctx.fillStyle = `hsla(${this.hue}, 80%, 75%, ${this.opacity})`;
      ctx.beginPath();
      // Draw Heart Path
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-10, -10, -20, 5, 0, 20);
      ctx.bezierCurveTo(20, 5, 10, -10, 0, 0);
      ctx.fill();
      ctx.restore();
    }
  }

  // Initialize hearts
  if (ctx) {
    for (let i = 0; i < heartCount; i++) {
      hearts.push(new FloatingHeart());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      hearts.forEach(heart => {
        heart.update();
        heart.draw(ctx);
      });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  /* ==========================================================================
     2. The "No" Button Evasion Trick (Desktop & Mobile Optimized)
     ========================================================================== */
  function dodgeNoButton(e) {
    if (isForgiven) return;
    if (e && e.cancelable) {
      e.preventDefault();
      e.stopPropagation();
    }

    dodgeCount++;

    // Haptic vibration feedback on mobile
    if (navigator.vibrate) {
      try { navigator.vibrate(35); } catch (err) {}
    }

    // Calculate safe screen bounds (accounting for mobile address bar & notches)
    const btnRect = noBtn.getBoundingClientRect();
    const btnWidth = btnRect.width || 110;
    const btnHeight = btnRect.height || 48;
    
    const safeLeft = 16;
    const safeRight = 16;
    const safeTop = 72;    // keep clear of audio button & notch
    const safeBottom = 80; // keep clear of mobile browser navigation bar

    const minX = safeLeft;
    const maxX = Math.max(minX + 20, window.innerWidth - btnWidth - safeRight);
    const minY = safeTop;
    const maxY = Math.max(minY + 20, window.innerHeight - btnHeight - safeBottom);

    // Pick a random position far enough from current position
    const currentX = btnRect.left;
    const currentY = btnRect.top;
    let randomX, randomY, distance;
    let attempts = 0;

    do {
      randomX = Math.floor(Math.random() * (maxX - minX)) + minX;
      randomY = Math.floor(Math.random() * (maxY - minY)) + minY;
      distance = Math.hypot(randomX - currentX, randomY - currentY);
      attempts++;
    } while (distance < 110 && attempts < 12);

    // Apply fixed coordinates and styling
    noBtn.classList.add('dodging');
    noBtn.style.left = `${randomX}px`;
    noBtn.style.top = `${randomY}px`;

    // Change message playfully
    const messageIndex = (dodgeCount - 1) % noMessages.length;
    noBtnText.textContent = noMessages[messageIndex];

    // Grow "Yes" button slightly each time
    if (yesScale < 1.45) {
      yesScale += 0.05;
      yesBtn.style.transform = `scale(${yesScale})`;
    }

    // Playful caption reaction
    if (dodgeCount === 2) {
      characterCaption.textContent = "Hey! The button is running away! 😂";
    } else if (dodgeCount === 4) {
      characterCaption.textContent = "See? Even the universe says forgive Bhai! 🥺✨";
    } else if (dodgeCount >= 7) {
      characterCaption.textContent = "Aww please, your Bhai is waiting for a YES! 🍦❤️";
    }
  }

  // Mouse distance detection
  function checkProximity(e) {
    if (isForgiven) return;
    const rect = noBtn.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;

    const dist = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);
    const triggerDistance = window.innerWidth < 768 ? 70 : 95;

    if (dist < triggerDistance) {
      dodgeNoButton(e);
    }
  }

  // Mobile Touch distance detection (dodges before finger even touches the button!)
  function checkTouchProximity(e) {
    if (isForgiven || !e.touches || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = noBtn.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;

    const dist = Math.hypot(touch.clientX - btnCenterX, touch.clientY - btnCenterY);
    if (dist < 80) {
      dodgeNoButton(e);
    }
  }

  // Desktop & Mobile listeners for evasion
  window.addEventListener('mousemove', checkProximity);
  window.addEventListener('touchmove', checkTouchProximity, { passive: true });
  window.addEventListener('touchstart', checkTouchProximity, { passive: true });

  noBtn.addEventListener('mouseenter', dodgeNoButton);
  noBtn.addEventListener('mouseover', dodgeNoButton);
  noBtn.addEventListener('focus', dodgeNoButton);
  noBtn.addEventListener('touchstart', dodgeNoButton, { passive: false });
  noBtn.addEventListener('pointerdown', dodgeNoButton);
  noBtn.addEventListener('click', dodgeNoButton);

  /* ==========================================================================
     3. The "Yes" Button Celebration
     ========================================================================== */
  function triggerCelebration() {
    if (isForgiven) return;
    isForgiven = true;

    // Remove window proximity listeners
    window.removeEventListener('mousemove', checkProximity);
    window.removeEventListener('touchmove', checkTouchProximity);
    window.removeEventListener('touchstart', checkTouchProximity);

    // Haptic celebration vibration on mobile
    if (navigator.vibrate) {
      try { navigator.vibrate([60, 40, 90, 40, 140]); } catch (err) {}
    }

    // Play joyful celebration sound
    playCelebrationTune();

    // 1. Bear Transforms to Happy Mode
    bearAvatar.classList.remove('sad-mode');
    bearAvatar.classList.add('happy-mode');
    if (sadEyes) sadEyes.style.display = 'none';
    if (happyEyes) happyEyes.style.display = 'block';
    if (sadMouth) sadMouth.style.display = 'none';
    if (happyMouth) happyMouth.style.display = 'block';
    characterCaption.textContent = "YAAAY! Best Sister ever! Bhai loves you! 🥰💖";

    // 2. Hide "No" button and smoothly switch prompt to success state
    noBtn.style.display = 'none';
    promptBox.style.opacity = '0';
    promptBox.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      promptBox.style.display = 'none';
      successCard.style.display = 'block';
    }, 400);

    // 3. Fire Massive Screen-Wide Confetti & Falling Hearts
    fireConfettiShower();
  }

  yesBtn.addEventListener('click', triggerCelebration);
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      fireConfettiShower();
      playSparkleChime();
    });
  }

  /* ==========================================================================
     4. Confetti & Hearts Burst Engine (With Full Offline Fallback)
     ========================================================================== */
  function fireConfettiShower() {
    if (typeof confetti === 'function') {
      // Wave 1: Confetti Cannon from Left and Right
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { x: 0.1, y: 0.6 },
        colors: ['#ff758c', '#ff7eb3', '#b8ebd0', '#ffd166', '#c8b6ff']
      });
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { x: 0.9, y: 0.6 },
        colors: ['#ff758c', '#ff7eb3', '#b8ebd0', '#ffd166', '#c8b6ff']
      });

      // Wave 2: Massive Center Burst
      setTimeout(() => {
        confetti({
          particleCount: 120,
          spread: 100,
          origin: { x: 0.5, y: 0.5 },
          shapes: ['circle', 'square'],
          colors: ['#ff85a2', '#ffafcc', '#ffe5ec', '#c8b6ff', '#fde2e4']
        });
      }, 300);

      // Wave 3: Continuous Falling Star & Heart rain for 3.5 seconds
      const end = Date.now() + 3500;
      const interval = setInterval(() => {
        if (Date.now() > end) {
          return clearInterval(interval);
        }
        confetti({
          startVelocity: 25,
          spread: 360,
          ticks: 60,
          origin: { x: Math.random(), y: Math.random() - 0.2 },
          colors: ['#ff758c', '#ffafcc', '#c8b6ff', '#ffd166', '#ffffff']
        });
      }, 250);
    } else {
      // Built-in DOM fallback celebration if CDN is not available
      createDOMConfettiShower();
    }
  }

  function createDOMConfettiShower() {
    const colors = ['#ff758c', '#ffafcc', '#b8ebd0', '#ffd166', '#c8b6ff'];
    const emojis = ['💖', '✨', '🌸', '🎉', '💕'];
    for (let i = 0; i < 60; i++) {
      const piece = document.createElement('div');
      piece.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      piece.style.position = 'fixed';
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.top = '-20px';
      piece.style.fontSize = `${Math.random() * 20 + 16}px`;
      piece.style.zIndex = '99999';
      piece.style.pointerEvents = 'none';
      piece.style.transition = `all ${Math.random() * 2 + 2}s cubic-bezier(0.25, 1, 0.5, 1)`;
      document.body.appendChild(piece);

      setTimeout(() => {
        piece.style.transform = `translateY(${window.innerHeight + 50}px) rotate(${Math.random() * 360}deg)`;
        piece.style.opacity = '0';
      }, 50);

      setTimeout(() => {
        piece.remove();
      }, 4500);
    }
  }

  /* ==========================================================================
     5. Soothing Web Audio API Synthesizer (Music Box & Chimes)
     ========================================================================== */
  let audioCtx = null;
  let isPlayingMusic = false;
  let musicInterval = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Play a soft bell / music-box chime note
  function playNote(freq, delay = 0, duration = 1.2, gainValue = 0.12) {
    if (!audioCtx) return;
    const now = audioCtx.currentTime + delay;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Envelope
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(gainValue, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  // Sweet music box melody notes (C Major pentatonic lullaby)
  const lullabyNotes = [
    523.25, // C5
    659.25, // E5
    783.99, // G5
    880.00, // A5
    1046.50,// C6
    880.00, // A5
    783.99, // G5
    659.25  // E5
  ];
  let noteIdx = 0;

  function startLullaby() {
    initAudio();
    isPlayingMusic = true;
    audioToggle.classList.add('playing');
    audioIcon.textContent = '💖';

    // Play notes in gentle looping arpeggio
    musicInterval = setInterval(() => {
      const note = lullabyNotes[noteIdx % lullabyNotes.length];
      playNote(note, 0, 1.4, 0.08);
      // Gentle harmony note
      if (noteIdx % 2 === 0) {
        playNote(note / 2, 0.05, 1.8, 0.05);
      }
      noteIdx++;
    }, 450);
  }

  function stopLullaby() {
    isPlayingMusic = false;
    audioToggle.classList.remove('playing');
    audioIcon.textContent = '🎵';
    if (musicInterval) {
      clearInterval(musicInterval);
      musicInterval = null;
    }
  }

  if (audioToggle) {
    audioToggle.addEventListener('click', () => {
      if (isPlayingMusic) {
        stopLullaby();
      } else {
        startLullaby();
      }
    });
  }

  // Triumphant cheerful chime chord on "Yes"
  function playCelebrationTune() {
    initAudio();
    const chord = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C E G C E
    chord.forEach((freq, index) => {
      playNote(freq, index * 0.12, 1.8, 0.15);
    });
    // Extra sparkle notes after 0.7s
    setTimeout(() => {
      playNote(1567.98, 0, 1.2, 0.1);
      playNote(2093.00, 0.15, 1.5, 0.12);
    }, 700);
  }

  function playSparkleChime() {
    initAudio();
    playNote(1046.50, 0, 0.8, 0.08);
    playNote(1318.51, 0.1, 0.8, 0.08);
    playNote(1567.98, 0.2, 1.0, 0.1);
  }

  /* ==========================================================================
     6. Magical Sparkle Mouse & Touch Trail
     ========================================================================== */
  let lastSparkleTime = 0;

  function spawnSparkle(x, y) {
    const now = Date.now();
    if (now - lastSparkleTime < 65) return; // throttle sparkles
    lastSparkleTime = now;

    const sparkle = document.createElement('div');
    const symbols = ['✦', '✨', '💖', '🌸', '•'];
    sparkle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    sparkle.style.position = 'fixed';
    sparkle.style.left = `${x - 8}px`;
    sparkle.style.top = `${y - 8}px`;
    sparkle.style.fontSize = `${Math.random() * 10 + 12}px`;
    sparkle.style.color = Math.random() > 0.5 ? '#ff85a2' : '#c8b6ff';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '9998';
    sparkle.style.transition = 'all 0.75s ease-out';
    sparkle.style.transform = 'translate(0, 0) scale(1)';
    sparkle.style.opacity = '0.9';
    document.body.appendChild(sparkle);

    requestAnimationFrame(() => {
      sparkle.style.transform = `translate(${(Math.random() - 0.5) * 32}px, ${(Math.random() - 0.5) * 32 - 16}px) scale(0)`;
      sparkle.style.opacity = '0';
    });

    setTimeout(() => {
      sparkle.remove();
    }, 750);
  }

  // Desktop mouse trail
  window.addEventListener('mousemove', (e) => {
    spawnSparkle(e.clientX, e.clientY);
  });

  // Mobile touch trail
  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      spawnSparkle(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  window.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) {
      spawnSparkle(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });
});
