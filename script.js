// ---- PAGE ROUTING ----
let activePageId = 'page-home';

function showPage(id) {
  const currentPage = document.getElementById(activePageId);
  const nextPage = document.getElementById(id);
  if (!nextPage || activePageId === id) return;

  if (currentPage && !currentPage.classList.contains('hidden')) {
    currentPage.classList.add('page-leaving');
    setTimeout(() => {
      currentPage.classList.add('hidden');
      currentPage.classList.remove('page-leaving', 'page-entering');
    }, 260);
  }

  nextPage.classList.remove('hidden');
  nextPage.classList.add('page-entering');
  activePageId = id;
  window.scrollTo({ top: 0, behavior: 'smooth' });

  setTimeout(() => {
    nextPage.classList.remove('page-entering');
  }, 520);
}

// ---- PAGE 1: HOME ----
document.getElementById('btnNo').addEventListener('click', () => {
  showPage('page-decline');
});

document.getElementById('btnYes').addEventListener('click', () => {
  triggerConfetti();
  showPage('page-letter');
});

// ---- PAGE 2: DECLINE ----
document.getElementById('btnBack').addEventListener('click', () => {
  showPage('page-home');
});

// ---- PAGE 4: LETTER ----
document.getElementById('btnBackFlowers').addEventListener('click', () => {
  showPage('page-home');
});

// Also reveal gift page after letter — add button dynamically
const letterCard = document.getElementById('letterCard');
const giftBtn = document.createElement('button');
giftBtn.className = 'btn-primary';
giftBtn.textContent = '🎁 Find your surprise!';
giftBtn.style.marginTop = '18px';
giftBtn.addEventListener('click', () => {
  triggerConfetti();
  showPage('page-gift');
});
document.querySelector('.paper-letter').appendChild(giftBtn);

// ---- GIFT SELECTION LOGIC ----
const giftOptions = document.querySelectorAll('.gift-card[data-gift]');
const backToLetter = document.getElementById('backToLetter');
const flowerBack = document.getElementById('flowerBack');
const messageBack = document.getElementById('messageBack');
const mediaBack = document.getElementById('mediaBack');
const mazeBack = document.getElementById('mazeBack');
const memoryBack = document.getElementById('memoryBack');

// Catcher elements
const catcherBack = document.getElementById('catcherBack');
const catcherReset = document.getElementById('catcherReset');

// Scratchcard elements
const scratchcardBack = document.getElementById('scratchcardBack');

// Jigsaw elements
const jigsawBack = document.getElementById('jigsawBack');
const jigsawReset = document.getElementById('jigsawReset');

// Word Guess elements
const wordguessBack = document.getElementById('wordguessBack');
const wgNextBtn = document.getElementById('wgNext');

// Love Spin elements
const lovespinBack = document.getElementById('lovespinBack');

const mazeStatus = document.getElementById('mazeStatus');
let mazeActive = false;
let mazePlayer = { x: 0, y: 0 };
let mazeComplete = false;
let memoryDeck = [];
let memoryState = { first: null, lock: false, matches: 0 };

if (giftOptions.length) {
  giftOptions.forEach(card => {
    card.addEventListener('click', () => {
      const gift = card.dataset.gift;
      showPage(`page-gift-${gift}`);
      
      // Stop the catcher loop if navigating away
      stopCatcherGame();
      
      if (gift === 'flowers') {
        renderFlowerGarden();
      }
      if (gift === 'media') {
        renderMediaGallery();
      }
      if (gift === 'maze') {
        resetMaze();
        mazeActive = true;
        mazeStatus.textContent = 'Find Aniela!';
      } else {
        mazeActive = false;
      }
      if (gift === 'memory') {
        renderMemoryGame();
      }
      if (gift === 'catcher') {
        startCatcherGame();
      }
      if (gift === 'scratchcard') {
        initScratchCard();
      }
      if (gift === 'jigsaw') {
        initJigsawPuzzle();
      }
      if (gift === 'wordguess') {
        initWordGuess();
      }
      if (gift === 'lovespin') {
        initLoveSpin();
      }
    });
  });
}

if (backToLetter) backToLetter.addEventListener('click', () => showPage('page-letter'));
if (memoryBack) memoryBack.addEventListener('click', () => showPage('page-gift'));
if (flowerBack) flowerBack.addEventListener('click', () => showPage('page-gift'));
if (messageBack) messageBack.addEventListener('click', () => showPage('page-gift'));
if (mediaBack) mediaBack.addEventListener('click', () => showPage('page-gift'));
if (mazeBack) mazeBack.addEventListener('click', () => {
  showPage('page-gift');
  mazeActive = false;
});
if (catcherBack) catcherBack.addEventListener('click', () => {
  showPage('page-gift');
  stopCatcherGame();
});
if (scratchcardBack) scratchcardBack.addEventListener('click', () => showPage('page-gift'));
if (jigsawBack) jigsawBack.addEventListener('click', () => showPage('page-gift'));
if (wordguessBack) wordguessBack.addEventListener('click', () => showPage('page-gift'));
if (lovespinBack) lovespinBack.addEventListener('click', () => showPage('page-gift'));

if (catcherReset) catcherReset.addEventListener('click', startCatcherGame);
if (jigsawReset) jigsawReset.addEventListener('click', initJigsawPuzzle);
if (wgNextBtn) wgNextBtn.addEventListener('click', initWordGuess);

document.addEventListener('keydown', e => {
  if (!mazeActive) return;
  const key = e.key.toLowerCase();
  if (['w', 'a', 's', 'd'].includes(key)) {
    e.preventDefault();
    const moves = { w: [0, -1], a: [-1, 0], s: [0, 1], d: [1, 0] };
    const [dx, dy] = moves[key];
    moveMazePlayer(dx, dy);
  }
});

document.querySelectorAll('.maze-btn[data-move]').forEach(button => {
  button.addEventListener('click', () => {
    if (!mazeActive) return;
    const moves = {
      up: [0, -1],
      left: [-1, 0],
      down: [0, 1],
      right: [1, 0]
    };
    const [dx, dy] = moves[button.dataset.move];
    moveMazePlayer(dx, dy);
  });
});

function renderMediaGallery() {
  const gallery = document.getElementById('mediaGallery');
  if (!gallery) return;

  const items = [
    { type: 'video', src: 'v1.mp4', caption: 'holy..' },
    { type: 'video', src: 'v2.mp4', caption: 'the recall' },
    { type: 'video', src: 'v3.mp4', caption: 'what are you gonna do now' },
    { type: 'video', src: 'v4.mp4', caption: 'i think you are' },
    { type: 'video', src: 'v5.mp4', caption: 'walking around' },
    { type: 'video', src: 'v6.mp4', caption: 'kurwa' },
    { type: 'video', src: 'v7.mp4', caption: 'ye whatever u say' },
    { type: 'video', src: 'v8.mp4', caption: 'scariest lulu alive' },
    { type: 'video', src: 'v9.mp4', caption: 'never in my life' }
  ];

  gallery.innerHTML = items.map((item) => `
    <div class="media-item media-video">
      <div class="media-video-wrapper">
        <video
          src="${item.src}"
          controls
          preload="metadata"
          playsinline
          muted
        ></video>
      </div>
      <div class="media-caption-bar">
        <span class="media-caption">${item.caption}</span>
      </div>
    </div>
  `).join('');

  gallery.querySelectorAll('video').forEach(video => {
    video.addEventListener('play', () => { video.muted = false; });
  });
}

function renderFlowerGarden() {
  const featured = document.getElementById('flowersFeatured');
  const stage = document.getElementById('flowersStage');
  if (!stage) return;

  const featuredFlowers = [
    {
      src: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=900&q=80',
      label: 'Rose',
      note: 'As pretty as you are'
    },
    {
      src: 'https://images.unsplash.com/photo-1734311649481-efa9e13b57e4?auto=format&fit=crop&w=900&q=80',
      label: 'Schlumbergera',
      note: 'I think u like this one '
    }
  ];

  if (featured) {
    featured.innerHTML = `
      <p class="flower-featured-caption">Those are your favorites, aren't they? 💕</p>
      <div class="flower-featured-grid">
        ${featuredFlowers.map(item => `
          <div class="flower-bloom flower-bloom-featured">
            <img src="${item.src}" alt="${item.label}" class="flower-photo" />
            <div class="flower-info">
              <h3>${item.label}</h3>
              <p>${item.note}</p>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  stage.innerHTML = '';
  const flowerPhotos = [
    {
      src: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=900&q=80',
      label: 'Tulip',
      note: 'Soft spring color and clean elegance.'
    },
    {
      src: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=900&q=80',
      label: 'Peony',
      note: 'Full, delicate petals like a little cloud.'
    },
    {
      src: 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?auto=format&fit=crop&w=900&q=80',
      label: 'Orchid',
      note: 'Elegant, rare and beautifully dramatic.'
    },
    {
      src: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=900&q=80',
      label: 'Sunflower',
      note: 'Warm, bright and impossible not to smile at.'
    },
    {
      src: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=900&q=80',
      label: 'Hydrangea',
      note: 'Soft clusters in dreamy pastel shades.'
    },
    {
      src: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=900&q=80',
      label: 'Cherry Blossom',
      note: 'Gentle, airy and quietly magical.'
    },
    {
      src: 'https://images.unsplash.com/photo-1499002238440-d264edd596ec?auto=format&fit=crop&w=900&q=80',
      label: 'Lavender',
      note: 'Calm purple fields and a peaceful feeling.'
    },
    {
      src: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=900&q=80',
      label: 'Dahlia',
      note: 'Layered petals with bold, perfect geometry.'
    },
    {
      src: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80',
      label: 'Lotus',
      note: 'Graceful, serene and beautifully pure.'
    },
    {
      src: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=80',
      label: 'Wildflowers',
      note: 'A happy mix of color, light and freedom.'
    },
    {
      src: 'https://images.unsplash.com/photo-1468327768560-75b778cbb551?auto=format&fit=crop&w=900&q=80',
      label: 'Ranunculus',
      note: 'Tiny layers, soft colors and sweet charm.'
    }
  ];

  flowerPhotos.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'flower-bloom';
    card.style.animationDelay = `${index * 0.18}s`;
    card.innerHTML = `
      <img src="${item.src}" alt="${item.label}" class="flower-photo" />
      <div class="flower-info">
        <h3>${item.label}</h3>
        <p>${item.note}</p>
      </div>
    `;
    stage.appendChild(card);
  });
}

const cardValues = ['💗','🌟','🎀','✨','💌','🥰','🍃','🎉'];

function shuffleItems(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function renderMemoryGame() {
  const board = document.getElementById('memoryBoard');
  const status = document.getElementById('memoryStatus');
  if (!board || !status) return;
  memoryDeck = shuffleItems([...cardValues, ...cardValues]);
  memoryState = { first: null, lock: false, matches: 0 };
  board.innerHTML = '';
  status.textContent = 'Tap a card to begin.';

  memoryDeck.forEach((value, index) => {
    const card = document.createElement('button');
    card.className = 'memory-card';
    card.type = 'button';
    card.dataset.value = value;
    card.dataset.index = index;
    card.textContent = '?';
    card.addEventListener('click', () => flipMemoryCard(card));
    board.appendChild(card);
  });
}

function flipMemoryCard(card) {
  if (memoryState.lock || card.classList.contains('matched') || card === memoryState.first) return;
  const status = document.getElementById('memoryStatus');
  card.textContent = card.dataset.value;
  card.classList.add('flipped');

  if (!memoryState.first) {
    memoryState.first = card;
    if (status) status.textContent = 'Now pick another card.';
    return;
  }

  const secondCard = card;
  if (memoryState.first.dataset.value === secondCard.dataset.value) {
    memoryState.first.classList.add('matched');
    secondCard.classList.add('matched');
    memoryState.matches += 1;
    if (status) status.textContent = `Nice! ${memoryState.matches} / ${cardValues.length} pairs matched.`;
    memoryState.first = null;
    if (memoryState.matches === cardValues.length) {
      if (status) status.textContent = 'You found all the pairs! 💖';
      triggerConfetti();
    }
    return;
  }

  memoryState.lock = true;
  if (status) status.textContent = 'Not a match. Try again.';
  setTimeout(() => {
    if (memoryState.first) {
      memoryState.first.textContent = '?';
      memoryState.first.classList.remove('flipped');
    }
    secondCard.textContent = '?';
    secondCard.classList.remove('flipped');
    memoryState.first = null;
    memoryState.lock = false;
    if (status) status.textContent = 'Keep going — you can do it!';
  }, 900);
}

// ==========================================
// ---- SURPRISE 6: HEART CATCHER GAME ----
// ==========================================
let catcherActive = false;
let catcherScore = 0;
let catcherLives = 3;
let catcherPlayer = { x: 150, y: 360, width: 70, height: 30 };
let catcherItems = [];
let catcherKeys = { left: false, right: false };
let catcherAnimationId = null;
let catcherCanvas = null;
let catcherCtx = null;
let catcherLastSpawn = 0;

function startCatcherGame() {
  catcherCanvas = document.getElementById('catcherCanvas');
  if (!catcherCanvas) return;
  catcherCtx = catcherCanvas.getContext('2d');
  
  catcherActive = true;
  catcherScore = 0;
  catcherLives = 3;
  catcherPlayer.x = (catcherCanvas.width - catcherPlayer.width) / 2;
  catcherItems = [];
  catcherLastSpawn = 0;
  catcherKeys.left = false;
  catcherKeys.right = false;
  
  const resetBtn = document.getElementById('catcherReset');
  if (resetBtn) resetBtn.classList.add('hidden');
  
  updateCatcherHud();
  
  if (catcherAnimationId) {
    cancelAnimationFrame(catcherAnimationId);
  }
  catcherAnimationId = requestAnimationFrame(catcherGameLoop);
}

function stopCatcherGame() {
  catcherActive = false;
  if (catcherAnimationId) {
    cancelAnimationFrame(catcherAnimationId);
    catcherAnimationId = null;
  }
}

function updateCatcherHud() {
  const scoreEl = document.getElementById('catcherScore');
  const livesEl = document.getElementById('catcherLives');
  
  if (scoreEl) scoreEl.textContent = catcherScore;
  if (livesEl) {
    livesEl.textContent = '❤'.repeat(Math.max(0, catcherLives));
  }
}

function spawnCatcherItem() {
  const types = ['heart', 'heart', 'star', 'cloud']; // 50% heart, 25% star, 25% cloud
  const type = types[Math.floor(Math.random() * types.length)];
  const x = Math.random() * (catcherCanvas.width - 20) + 10;
  const speed = 2 + Math.random() * 2.5;
  catcherItems.push({ x, y: -20, type, speed });
}

function drawCatcherHeart(ctx, x, y) {
  ctx.fillStyle = '#e8567a';
  ctx.beginPath();
  ctx.moveTo(x, y + 4);
  ctx.bezierCurveTo(x, y, x - 7, y, x - 7, y + 7);
  ctx.bezierCurveTo(x - 7, y + 13, x, y + 19, x, y + 21);
  ctx.bezierCurveTo(x, y + 19, x + 7, y + 13, x + 7, y + 7);
  ctx.bezierCurveTo(x + 7, y, x, y, x, y + 4);
  ctx.fill();
}

function drawCatcherStar(ctx, x, y) {
  ctx.fillStyle = '#ffcc70';
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    ctx.lineTo(Math.cos((18 + i * 72) * Math.PI / 180) * 10 + x, Math.sin((18 + i * 72) * Math.PI / 180) * 10 + y);
    ctx.lineTo(Math.cos((54 + i * 72) * Math.PI / 180) * 5 + x, Math.sin((54 + i * 72) * Math.PI / 180) * 5 + y);
  }
  ctx.closePath();
  ctx.fill();
}

function drawCatcherCloud(ctx, x, y) {
  ctx.fillStyle = '#b0c4de';
  ctx.beginPath();
  ctx.arc(x - 4, y, 7, 0, Math.PI * 2);
  ctx.arc(x + 4, y - 4, 9, 0, Math.PI * 2);
  ctx.arc(x + 12, y, 7, 0, Math.PI * 2);
  ctx.fill();
  
  // Raindrops
  ctx.fillStyle = '#6495ed';
  ctx.fillRect(x - 3, y + 9, 2, 4);
  ctx.fillRect(x + 5, y + 9, 2, 4);
  ctx.fillRect(x + 11, y + 9, 2, 4);
}

function drawCatcherCat(ctx, player) {
  // Ears
  ctx.fillStyle = '#f8d7e3';
  ctx.strokeStyle = '#e8567a';
  ctx.lineWidth = 3;
  
  ctx.beginPath();
  ctx.moveTo(player.x + 8, player.y);
  ctx.lineTo(player.x + 16, player.y - 12);
  ctx.lineTo(player.x + 24, player.y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(player.x + player.width - 24, player.y);
  ctx.lineTo(player.x + player.width - 16, player.y - 12);
  ctx.lineTo(player.x + player.width - 8, player.y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Bowl Body
  ctx.beginPath();
  ctx.roundRect(player.x, player.y, player.width, player.height, [0, 0, 16, 16]);
  ctx.fill();
  ctx.stroke();

  // Face
  ctx.fillStyle = '#5a2d4c';
  ctx.beginPath();
  ctx.arc(player.x + 22, player.y + 12, 2.5, 0, Math.PI * 2);
  ctx.arc(player.x + player.width - 22, player.y + 12, 2.5, 0, Math.PI * 2);
  ctx.fill();
  
  // Nose
  ctx.fillStyle = '#e8567a';
  ctx.beginPath();
  ctx.moveTo(player.x + player.width/2 - 3, player.y + 14);
  ctx.lineTo(player.x + player.width/2 + 3, player.y + 14);
  ctx.lineTo(player.x + player.width/2, player.y + 17);
  ctx.closePath();
  ctx.fill();
}

function catcherGameLoop(timestamp) {
  if (!catcherActive) return;
  
  catcherCtx.clearRect(0, 0, catcherCanvas.width, catcherCanvas.height);
  
  // Update Player Position
  if (catcherKeys.left) {
    catcherPlayer.x = Math.max(0, catcherPlayer.x - 5);
  }
  if (catcherKeys.right) {
    catcherPlayer.x = Math.min(catcherCanvas.width - catcherPlayer.width, catcherPlayer.x + 5);
  }
  
  // Draw Player
  drawCatcherCat(catcherCtx, catcherPlayer);
  
  // Spawn Items
  if (timestamp - catcherLastSpawn > 1100) {
    spawnCatcherItem();
    catcherLastSpawn = timestamp;
  }
  
  // Update & Draw Items
  for (let i = catcherItems.length - 1; i >= 0; i--) {
    let item = catcherItems[i];
    item.y += item.speed;
    
    // Draw
    if (item.type === 'heart') {
      drawCatcherHeart(catcherCtx, item.x, item.y);
    } else if (item.type === 'star') {
      drawCatcherStar(catcherCtx, item.x, item.y);
    } else if (item.type === 'cloud') {
      drawCatcherCloud(catcherCtx, item.x, item.y);
    }
    
    // Collision detection
    if (item.y + 10 >= catcherPlayer.y && item.y <= catcherPlayer.y + catcherPlayer.height &&
        item.x + 8 >= catcherPlayer.x && item.x - 8 <= catcherPlayer.x + catcherPlayer.width) {
      
      // Collision!
      if (item.type === 'heart') {
        catcherScore += 1;
      } else if (item.type === 'star') {
        catcherScore += 2;
      } else if (item.type === 'cloud') {
        catcherLives -= 1;
      }
      
      catcherItems.splice(i, 1);
      updateCatcherHud();
      
      // Check game state
      if (catcherScore >= 15) {
        winCatcherGame();
        return;
      }
      if (catcherLives <= 0) {
        loseCatcherGame();
        return;
      }
      continue;
    }
    
    // Out of bounds
    if (item.y > catcherCanvas.height + 20) {
      catcherItems.splice(i, 1);
    }
  }
  
  catcherAnimationId = requestAnimationFrame(catcherGameLoop);
}

function winCatcherGame() {
  stopCatcherGame();
  triggerConfetti();
  
  const statusEl = document.getElementById('catcherStatus');
  if (statusEl) {
    statusEl.innerHTML = '<strong>Ti Amo! </strong> You caught my heart!<br>';
  }
  
  const resetBtn = document.getElementById('catcherReset');
  if (resetBtn) resetBtn.classList.remove('hidden');
}

function loseCatcherGame() {
  stopCatcherGame();
  const statusEl = document.getElementById('catcherStatus');
  if (statusEl) {
    statusEl.innerHTML = '<strong>Game Over! </strong> But do not worry, Peppe\'s love for you is infinite. Try again!';
  }
  
  const resetBtn = document.getElementById('catcherReset');
  if (resetBtn) resetBtn.classList.remove('hidden');
}

// Keyboard controls
window.addEventListener('keydown', e => {
  if (!catcherActive) return;
  const key = e.key.toLowerCase();
  if (['arrowleft', 'a'].includes(key)) {
    catcherKeys.left = true;
  }
  if (['arrowright', 'd'].includes(key)) {
    catcherKeys.right = true;
  }
});
window.addEventListener('keyup', e => {
  if (!catcherActive) return;
  const key = e.key.toLowerCase();
  if (['arrowleft', 'a'].includes(key)) {
    catcherKeys.left = false;
  }
  if (['arrowright', 'd'].includes(key)) {
    catcherKeys.right = false;
  }
});

// Mobile button control helpers
const leftBtn = document.getElementById('catcherLeftBtn');
const rightBtn = document.getElementById('catcherRightBtn');
if (leftBtn) {
  leftBtn.addEventListener('mousedown', () => { catcherKeys.left = true; });
  leftBtn.addEventListener('mouseup', () => { catcherKeys.left = false; });
  leftBtn.addEventListener('touchstart', (e) => { e.preventDefault(); catcherKeys.left = true; });
  leftBtn.addEventListener('touchend', (e) => { e.preventDefault(); catcherKeys.left = false; });
}
if (rightBtn) {
  rightBtn.addEventListener('mousedown', () => { catcherKeys.right = true; });
  rightBtn.addEventListener('mouseup', () => { catcherKeys.right = false; });
  rightBtn.addEventListener('touchstart', (e) => { e.preventDefault(); catcherKeys.right = true; });
  rightBtn.addEventListener('touchend', (e) => { e.preventDefault(); catcherKeys.right = false; });
}


// ==========================================
// ---- SURPRISE 7: LOVE SCRATCH CARD ----
// ==========================================
let scratchCanvas = null;
let scratchCtx = null;
let scratchIsDrawing = false;
let scratchRevealed = false;

function initScratchCard() {
  scratchCanvas = document.getElementById('scratchCanvas');
  if (!scratchCanvas) return;
  scratchCtx = scratchCanvas.getContext('2d');
  
  scratchRevealed = false;
  scratchCanvas.style.opacity = '1';
  scratchCanvas.style.pointerEvents = 'auto';
  
  const statusEl = document.getElementById('scratchStatus');
  if (statusEl) statusEl.textContent = 'Scratch to reveal your gift! (0% scratched)';
  
  // Paint silver coating
  const grad = scratchCtx.createLinearGradient(0, 0, scratchCanvas.width, scratchCanvas.height);
  grad.addColorStop(0, '#e8cbd8');
  grad.addColorStop(0.5, '#f5e2eb');
  grad.addColorStop(1, '#c5acba');
  scratchCtx.fillStyle = grad;
  scratchCtx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);
  
  // Outer border lines for canvas
  scratchCtx.strokeStyle = '#e8567a';
  scratchCtx.lineWidth = 4;
  scratchCtx.strokeRect(0, 0, scratchCanvas.width, scratchCanvas.height);
  
  // Text inside scratch card
  scratchCtx.fillStyle = '#9f2d42';
  scratchCtx.font = 'bold 16px Nunito';
  scratchCtx.textAlign = 'center';
  scratchCtx.fillText('★ SCRATCH ME! ★', scratchCanvas.width / 2, scratchCanvas.height / 2 - 8);
  scratchCtx.fillStyle = '#6b4761';
  scratchCtx.font = '12px Nunito';
  scratchCtx.fillText('Reveal your special birthday gift coupon', scratchCanvas.width / 2, scratchCanvas.height / 2 + 16);
  
  // Scratch events
  scratchCanvas.addEventListener('mousedown', scratchStart);
  scratchCanvas.addEventListener('mousemove', scratchMove);
  window.addEventListener('mouseup', scratchEnd);
  
  scratchCanvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    scratchStart(e.touches[0]);
  });
  scratchCanvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    scratchMove(e.touches[0]);
  });
  scratchCanvas.addEventListener('touchend', scratchEnd);
}

function scratchStart(e) {
  scratchIsDrawing = true;
  scratchDraw(e);
}

function scratchMove(e) {
  if (!scratchIsDrawing || scratchRevealed) return;
  scratchDraw(e);
}

function scratchEnd() {
  if (!scratchIsDrawing) return;
  scratchIsDrawing = false;
  checkScratchPercentage();
}

function scratchDraw(e) {
  const rect = scratchCanvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (scratchCanvas.width / rect.width);
  const y = (e.clientY - rect.top) * (scratchCanvas.height / rect.height);
  
  scratchCtx.globalCompositeOperation = 'destination-out';
  scratchCtx.beginPath();
  scratchCtx.arc(x, y, 22, 0, Math.PI * 2);
  scratchCtx.fill();
}

function checkScratchPercentage() {
  if (scratchRevealed) return;
  
  const imgData = scratchCtx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height);
  const pixels = imgData.data;
  let cleared = 0;
  
  // Check alpha channels (index i*4 + 3)
  for (let i = 3; i < pixels.length; i += 4) {
    if (pixels[i] === 0) {
      cleared++;
    }
  }
  
  const percentage = (cleared / (pixels.length / 4)) * 100;
  const statusEl = document.getElementById('scratchStatus');
  if (statusEl) {
    statusEl.textContent = `Scratch to reveal your gift! (${Math.round(percentage)}% scratched)`;
  }
  
  if (percentage >= 55) {
    scratchRevealed = true;
    scratchCanvas.style.transition = 'opacity 0.6s ease';
    scratchCanvas.style.opacity = '0';
    scratchCanvas.style.pointerEvents = 'none';
    
    triggerConfetti();
    
    if (statusEl) {
      statusEl.innerHTML = '<strong>Congratulations! </strong> Coupon unlocked. Screenshot to save and redeem with Peppe!';
    }
  }
}


// ==========================================
// ---- SURPRISE 8: JIGSAW PUZZLE GAME ----
// ==========================================
let jigsawTiles = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let jigsawSelectedTile = null;
let jigsawComplete = false;

function initJigsawPuzzle() {
  jigsawTiles = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  jigsawSelectedTile = null;
  jigsawComplete = false;
  
  // Shuffle until it's not solved
  let solved = true;
  while (solved) {
    for (let i = jigsawTiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [jigsawTiles[i], jigsawTiles[j]] = [jigsawTiles[j], jigsawTiles[i]];
    }
    for (let i = 0; i < 9; i++) {
      if (jigsawTiles[i] !== i) {
        solved = false;
        break;
      }
    }
  }
  
  const statusEl = document.getElementById('jigsawStatus');
  if (statusEl) statusEl.textContent = 'Click tiles to swap and solve!';
  
  renderJigsawBoard();
}

function renderJigsawBoard() {
  const board = document.getElementById('jigsawBoard');
  if (!board) return;
  board.innerHTML = '';
  
  jigsawTiles.forEach((tileValue, currentIndex) => {
    const tile = document.createElement('div');
    tile.className = 'jigsaw-tile';
    
    // Position within the 3x3 background slicing
    const originalCol = tileValue % 3;
    const originalRow = Math.floor(tileValue / 3);
    tile.style.backgroundPosition = `${originalCol * 50}% ${originalRow * 50}%`;
    
    if (jigsawSelectedTile === currentIndex) {
      tile.classList.add('selected');
    }
    
    if (!jigsawComplete) {
      tile.addEventListener('click', () => handleJigsawClick(currentIndex));
    }
    
    board.appendChild(tile);
  });
}

function handleJigsawClick(index) {
  if (jigsawComplete) return;
  
  if (jigsawSelectedTile === null) {
    jigsawSelectedTile = index;
    renderJigsawBoard();
  } else if (jigsawSelectedTile === index) {
    jigsawSelectedTile = null;
    renderJigsawBoard();
  } else {
    // Swap tiles
    const temp = jigsawTiles[jigsawSelectedTile];
    jigsawTiles[jigsawSelectedTile] = jigsawTiles[index];
    jigsawTiles[index] = temp;
    
    jigsawSelectedTile = null;
    
    // Check solved
    let solved = true;
    for (let i = 0; i < 9; i++) {
      if (jigsawTiles[i] !== i) {
        solved = false;
        break;
      }
    }
    
    if (solved) {
      jigsawComplete = true;
      triggerConfetti();
      const statusEl = document.getElementById('jigsawStatus');
      if (statusEl) {
        statusEl.innerHTML = '<strong>Perfect Match! </strong> Peppe and Aniela are always meant to be together!';
      }
    }
    
    renderJigsawBoard();
  }
}

const mazeSize = 21;
let mazePath = buildMaze(mazeSize);

function buildMaze(size) {
  const maze = Array.from({ length: size }, () => Array(size).fill(0));
  maze[0][0] = 1;
  const stack = [{ x: 0, y: 0 }];

  while (stack.length) {
    const current = stack[stack.length - 1];
    const { x, y } = current;
    const directions = [
      { dx: 0, dy: -2 },
      { dx: 2, dy: 0 },
      { dx: 0, dy: 2 },
      { dx: -2, dy: 0 }
    ];
    const neighbors = [];

    directions.forEach(({ dx, dy }) => {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < size && ny >= 0 && ny < size && maze[ny][nx] === 0) {
        neighbors.push({ x: nx, y: ny, wallX: x + dx / 2, wallY: y + dy / 2 });
      }
    });

    if (neighbors.length) {
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      maze[next.y][next.x] = 1;
      maze[next.wallY][next.wallX] = 1;
      stack.push({ x: next.x, y: next.y });
    } else {
      stack.pop();
    }
  }

  maze[size - 1][size - 1] = 1;
  return maze;
}

function resetMaze() {
  mazePath = buildMaze(mazeSize);
  mazePlayer = { x: 0, y: 0 };
  mazeComplete = false;
  renderMaze();
}

function renderMaze() {
  const board = document.getElementById('mazeBoard');
  if (!board) return;
  board.innerHTML = '';
  const size = mazePath.length;
  board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  board.style.gridTemplateRows = `repeat(${size}, 1fr)`;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cell = document.createElement('div');
      cell.className = `maze-cell ${mazePath[y][x] === 0 ? 'maze-wall' : 'maze-open'}`;

      const isPlayer = mazePlayer.x === x && mazePlayer.y === y;
      const isGoal = x === size - 1 && y === size - 1;

      if (mazeComplete && isPlayer && isGoal) {
        cell.appendChild(createCatSprite('gif/cat1.gif', 'Peppe and Aniela together', 'cat-joined'));
      } else {
        if (isGoal) {
          cell.appendChild(createCatSprite('gif/cat4.gif', 'Aniela waiting', 'cat-goal'));
        }
        if (isPlayer) {
          cell.appendChild(createCatSprite('gif/cat3.gif', 'Peppe moving', 'cat-player'));
        }
      }

      board.appendChild(cell);
    }
  }

  if (mazePlayer.x === size - 1 && mazePlayer.y === size - 1 && !mazeComplete) {
    mazeComplete = true;
    mazeStatus.textContent = 'Peppe found Aniela. Now they are together!';
    if (mazeActive) triggerConfetti();
    mazeActive = false;
    renderMaze();
  }
}

function moveMazePlayer(dx, dy) {
  if (mazeComplete) return;
  const nx = mazePlayer.x + dx;
  const ny = mazePlayer.y + dy;
  const size = mazePath.length;
  if (nx >= 0 && nx < size && ny >= 0 && ny < size && mazePath[ny][nx] === 1) {
    mazePlayer = { x: nx, y: ny };
    renderMaze();
  }
}

function createCatSprite(src, alt, className) {
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt;
  img.className = `maze-cat ${className}`;
  return img;
}

function triggerConfetti() {
  const el = document.getElementById('confetti');
  el.classList.remove('hidden');
  el.innerHTML = '';
  const cols = ['#e8567a','#ff9ec4','#ffcc70','#ffd6e8','#ff7fbf','#ffb3d1','#c0392b'];
  for (let i = 0; i < 50; i++) {
    const d = document.createElement('div');
    const sz = 6 + Math.random() * 10;
    d.className = 'confetti-dot';
    d.style.cssText = `left:${Math.random()*100}%;top:-10px;width:${sz}px;height:${sz}px;background:${cols[~~(Math.random()*cols.length)]};border-radius:${Math.random()>.5?'50%':'3px'};animation-duration:${1.8+Math.random()*1.4}s;animation-delay:${Math.random()*.6}s;`;
    el.appendChild(d);
  }
  setTimeout(() => { el.classList.add('hidden'); el.innerHTML = ''; }, 3500);
}

function rand5() { return Math.floor(Math.random() * 5) + 1; }

// ==========================================
// ---- SURPRISE 9: LOVE WORDS (HANGMAN) ----
// ==========================================

const wgWords = [
    { word: 'BABY',      hint: 'hint: The sweetest name i call you' },
    { word: 'HONEY',     hint: 'hint: Sweet, warm and always comforting' },
  { word: 'MY LOVE',     hint: 'hint: Two words that mean everything' },
  { word: 'FOREVER',     hint: 'hint: How long Peppe will love you' },
  { word: 'I LOVE YOU',  hint: 'hint: The three most important words' },
];

let wgCurrent = null;
let wgGuessed = [];
let wgLivesLeft = 0;
const WG_MAX_LIVES = 6;
const HEARTS = ['❤️','❤️','❤️','❤️','❤️','❤️'];

function initWordGuess() {
  // Pick a random word (avoid repeating last)
  let pool = wgWords;
  if (wgCurrent) pool = wgWords.filter(w => w.word !== wgCurrent.word);
  wgCurrent = pool[Math.floor(Math.random() * pool.length)];
  wgGuessed = [];
  wgLivesLeft = WG_MAX_LIVES;

  const nextBtn = document.getElementById('wgNext');
  if (nextBtn) nextBtn.classList.add('hidden');

  renderWgLives();
  renderWgDisplay();
  renderWgKeyboard();

  const status = document.getElementById('wgStatus');
  if (status) status.textContent = 'Tap a letter to guess!';

  const hint = document.getElementById('wgHint');
  if (hint) hint.textContent = wgCurrent.hint;
}

function renderWgLives() {
  const el = document.getElementById('wgLives');
  if (!el) return;
  el.innerHTML = HEARTS.map((h, i) =>
    `<span class="${i >= wgLivesLeft ? 'lost' : ''}">${h}</span>`
  ).join('');
}

function renderWgDisplay() {
  const el = document.getElementById('wgDisplay');
  if (!el || !wgCurrent) return;
  // Render letters and spaces separately
  el.innerHTML = wgCurrent.word.split('').map(ch => {
    if (ch === ' ') return `<div class="wg-letter wg-space"></div>`;
    return `<div class="wg-letter ${wgGuessed.includes(ch) ? 'revealed' : ''}">
      ${wgGuessed.includes(ch) ? ch : ''}
    </div>`;
  }).join('');
}

function renderWgKeyboard() {
  const el = document.getElementById('wgKeyboard');
  if (!el) return;
  const rows = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];
  el.innerHTML = rows.map(row =>
    `<div class="wg-row">${row.split('').map(ch => {
      const state = wgGuessed.includes(ch)
        ? (wgCurrent.word.includes(ch) ? 'used-right' : 'used-wrong')
        : '';
      return `<button class="wg-key ${state}" data-ch="${ch}" ${state ? 'disabled' : ''}>${ch}</button>`;
    }).join('')}</div>`
  ).join('');

  el.querySelectorAll('.wg-key:not([disabled])').forEach(btn => {
    btn.addEventListener('click', () => handleWgGuess(btn.dataset.ch));
  });
}

function handleWgGuess(ch) {
  if (wgGuessed.includes(ch)) return;
  wgGuessed.push(ch);

  const inWord = wgCurrent.word.includes(ch);
  if (!inWord) wgLivesLeft--;

  renderWgLives();
  renderWgDisplay();
  renderWgKeyboard();

  const status = document.getElementById('wgStatus');
  const nextBtn = document.getElementById('wgNext');

  const won = wgCurrent.word.split('').every(c => c === ' ' || wgGuessed.includes(c));
  if (won) {
    if (status) status.innerHTML = `<strong>You got it!</strong> "${wgCurrent.word}" good girl`;
    if (nextBtn) nextBtn.classList.remove('hidden');
    triggerConfetti();
    return;
  }

  if (wgLivesLeft <= 0) {
    // Reveal remaining letters
    wgGuessed = [...new Set([...wgGuessed, ...wgCurrent.word.split('').filter(c => c !== ' ')])];
    renderWgDisplay();
    if (status) status.innerHTML = `<strong>Out of hearts! </strong> The word was "${wgCurrent.word}". Try another!`;
    if (nextBtn) nextBtn.classList.remove('hidden');
    return;
  }

  if (status) {
    status.textContent = inWord
      ? `Nice! "${ch}" is in the word!`
      : `No "${ch}" this time… ${wgLivesLeft} heart${wgLivesLeft !== 1 ? 's' : ''} left.`;
  }
}

// Keyboard support for word guess
document.addEventListener('keydown', e => {
  const page = document.getElementById('page-gift-wordguess');
  if (!page || page.classList.contains('hidden')) return;
  if (!wgCurrent || wgLivesLeft <= 0) return;
  const ch = e.key.toUpperCase();
  if (/^[A-Z]$/.test(ch) && !wgGuessed.includes(ch)) {
    handleWgGuess(ch);
  }
});