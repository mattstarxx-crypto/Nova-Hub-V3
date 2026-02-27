/* ═══════════════════════════════════════════
   NOVA HUB — main.js
   All interactivity for the unblocked games hub
═══════════════════════════════════════════ */

/* ─── STAR CANVAS ─── */
(function () {
  const canvas = document.getElementById('star-canvas');
  const ctx = canvas.getContext('2d');
  let stars = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function init() {
    stars = [];
    for (let i = 0; i < 250; i++) {
      stars.push({
        x:    Math.random() * canvas.width,
        y:    Math.random() * canvas.height,
        r:    Math.random() * 1.4 + 0.2,
        a:    Math.random(),
        da:   (Math.random() * 0.006 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
        blue: Math.random() > 0.6
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const s of stars) {
      s.a += s.da;
      if (s.a <= 0 || s.a >= 1) s.da *= -1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.blue
        ? `rgba(100,200,255,${s.a})`
        : `rgba(255,255,255,${s.a})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  resize();
  init();
  draw();
  window.addEventListener('resize', () => { resize(); init(); });
})();


/* ─── SHOOTING STARS ─── */
function spawnShoot() {
  const el = document.createElement('div');
  el.className = 'shoot';
  el.style.cssText = `top:${Math.random() * 65}%; left:0; --sd:${(Math.random() * 1.5 + 0.7).toFixed(2)}s`;
  document.body.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}
setInterval(spawnShoot, 3200);
setTimeout(spawnShoot, 900);


/* ─── HUD CLOCK ─── */
setInterval(() => {
  const el = document.getElementById('hud-time');
  if (el) el.textContent = new Date().toLocaleTimeString('en-US', { hour12: false });
}, 1000);


/* ═══════════════════════════════════════════
   GAMES DATA
   Loaded from games.json; falls back to
   inline data if running from file://
═══════════════════════════════════════════ */
let GAMES = [];
let activeCategory = 'all';

// Inline fallback — mirrors games.json exactly
const GAMES_FALLBACK = [
  { id:"1v1lol",     title:"1v1.LOL",          desc:"Build & battle shooter",  icon:"🎯", badge:"HOT",  url:"https://1v1.lol",                        category:"shooter"   },
  { id:"krunker",    title:"Krunker.io",        desc:"Fast browser FPS",        icon:"🔫", badge:"HOT",  url:"https://krunker.io",                     category:"shooter"   },
  { id:"slither",    title:"Slither.io",        desc:"Multiplayer snake",       icon:"🐍", badge:"",     url:"https://slither.io",                     category:"arcade"    },
  { id:"agar",       title:"Agar.io",           desc:"Cell-eating chaos",       icon:"🟣", badge:"",     url:"https://agar.io",                        category:"arcade"    },
  { id:"retrobowl",  title:"Retro Bowl",        desc:"Pixel football sim",      icon:"🏈", badge:"NEW",  url:"https://retrobowl.me",                   category:"sports"    },
  { id:"2048",       title:"2048",              desc:"Slide tiles. Reach 2048.",icon:"🧩", badge:"",     url:"https://2048game.com",                   category:"puzzle"    },
  { id:"chess",      title:"Chess (Lichess)",   desc:"Open-source chess",       icon:"♟️", badge:"FAST", url:"https://lichess.org",                    category:"strategy"  },
  { id:"skribbl",    title:"Skribbl.io",        desc:"Draw & guess",            icon:"🎨", badge:"",     url:"https://skribbl.io",                     category:"social"    },
  { id:"diep",       title:"Diep.io",           desc:"Tank battle arena",       icon:"🔵", badge:"",     url:"https://diep.io",                        category:"arcade"    },
  { id:"minesweeper",title:"Minesweeper",       desc:"Classic puzzle",          icon:"💣", badge:"",     url:"https://minesweeper.online",             category:"puzzle"    },
  { id:"coolmath",   title:"Cool Math Games",   desc:"100s of games",           icon:"🧮", badge:"FAST", url:"https://www.coolmathgames.com",           category:"puzzle"    },
  { id:"poki",       title:"Poki",              desc:"Massive game library",    icon:"🚀", badge:"NEW",  url:"https://www.poki.com",                   category:"arcade"    },
  { id:"wordle",     title:"Wordle",            desc:"Daily word puzzle",       icon:"🟩", badge:"NEW",  url:"https://wordleunlimited.org",             category:"puzzle"    },
  { id:"paperio",    title:"Paper.io 2",        desc:"Claim territory",         icon:"🗺️", badge:"HOT",  url:"https://paper-io.com",                   category:"arcade"    },
  { id:"tetris",     title:"Tetris",            desc:"Classic block stacker",   icon:"🟦", badge:"",     url:"https://tetris.com/play-tetris",          category:"puzzle"    },
  { id:"geodash",    title:"Geometry Dash",     desc:"Rhythm platformer",       icon:"🔷", badge:"HOT",  url:"https://geometrydash.io",                category:"platformer" },
  { id:"subway",     title:"Subway Surfers",    desc:"Endless runner",          icon:"🏃", badge:"",     url:"https://poki.com/en/g/subway-surfers",   category:"arcade"    },
  { id:"shellshock", title:"Shell Shockers",    desc:"Egg battle shooter",      icon:"🥚", badge:"HOT",  url:"https://shellshock.io",                  category:"shooter"   },
  { id:"slope",      title:"Slope",             desc:"Infinite ball runner",    icon:"⚡", badge:"FAST", url:"https://slope-game.github.io",           category:"arcade"    },
  { id:"drift",      title:"Drift Hunters",     desc:"Car drifting game",       icon:"🏎️", badge:"NEW",  url:"https://drifthunters.io",                category:"racing"    }
];

async function loadGames() {
  try {
    const res = await fetch('games.json');
    if (!res.ok) throw new Error('fetch failed');
    GAMES = await res.json();
  } catch (e) {
    console.warn('[Nova] Could not load games.json — using fallback data.');
    GAMES = GAMES_FALLBACK;
  }
  initUI();
}


/* ═══════════════════════════════════════════
   UI INIT — runs after games are loaded
═══════════════════════════════════════════ */
function initUI() {
  // HUD game count
  const hudCount = document.getElementById('hud-count');
  if (hudCount) hudCount.textContent = GAMES.length;

  // Home chips — first 7 HOT or NEW games
  const featured = GAMES.filter(g => g.badge === 'HOT' || g.badge === 'NEW').slice(0, 7);
  const chipsEl  = document.getElementById('home-chips');
  featured.forEach(g => {
    const d = document.createElement('div');
    d.className = 'h-chip';
    d.textContent = g.title;
    d.onclick = () => { enterApp('games'); openSite(g.url, g.title); };
    chipsEl.appendChild(d);
  });

  // Category filter buttons
  const cats = [...new Set(GAMES.map(g => g.category))].sort();
  const fb   = document.getElementById('filter-bar');
  cats.forEach(cat => {
    const d = document.createElement('div');
    d.className  = 'fcat';
    d.dataset.cat = cat;
    d.textContent = cat.toUpperCase();
    d.onclick = () => setCat(cat, d);
    fb.appendChild(d);
  });

  // Render all cards
  renderCards('all', '');
}


/* ═══════════════════════════════════════════
   CARD RENDERING
═══════════════════════════════════════════ */
function renderCards(cat, query) {
  const container = document.getElementById('game-cards');
  container.innerHTML = '';

  const q        = query.toLowerCase().trim();
  const filtered = GAMES.filter(g => {
    const matchCat = cat === 'all' || g.category === cat;
    const matchQ   = !q
      || g.title.toLowerCase().includes(q)
      || g.desc.toLowerCase().includes(q)
      || g.category.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  if (filtered.length === 0) {
    container.innerHTML = '<div class="no-results">// NO GAMES FOUND — TRY A DIFFERENT SEARCH</div>';
  } else {
    filtered.forEach(g => {
      const card = document.createElement('div');
      card.className    = 'card';
      card.dataset.cat  = g.category;
      card.innerHTML    = `
        <div class="sweep"></div>
        <span class="c-bl"></span><span class="c-br"></span>
        <span class="card-icon">${g.icon}</span>
        ${g.badge ? `<div class="card-badge badge-${g.badge.toLowerCase()}">${g.badge}</div>` : ''}
        <div class="card-title">${g.title}</div>
        <div class="card-desc">${g.desc}</div>
        <div class="card-cat">${g.category}</div>
      `;
      card.onclick = () => openSite(g.url, g.title);
      container.appendChild(card);
    });
  }

  // Update visible count label
  const vc = document.getElementById('visible-count');
  if (vc) vc.textContent = `[${filtered.length}/${GAMES.length}]`;
}

function setCat(cat, el) {
  activeCategory = cat;
  document.querySelectorAll('.fcat').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  filterCards();
}

function filterCards() {
  const q = document.getElementById('game-search').value;
  renderCards(activeCategory, q);
}


/* ═══════════════════════════════════════════
   HOME SEARCH
═══════════════════════════════════════════ */
function homeSearch() {
  const q = document.getElementById('home-search-input').value.trim();
  enterApp('games');
  setTimeout(() => {
    document.getElementById('game-search').value = q;
    renderCards('all', q);
  }, 60);
}

document.getElementById('home-search-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') homeSearch();
});


/* ═══════════════════════════════════════════
   PAGE / TAB STATE
═══════════════════════════════════════════ */
const homePage = document.getElementById('home-page');
const innerApp = document.getElementById('inner-app');

function enterApp() {
  homePage.style.display = 'none';
  innerApp.classList.add('open');
  document.getElementById('tab-games').classList.add('active');
  document.getElementById('games').classList.add('active');
  renderCards('all', '');
}

function enterAppFiltered(cat) {
  homePage.style.display = 'none';
  innerApp.classList.add('open');

  document.querySelectorAll('.btab').forEach(b => b.classList.remove('active'));

  const tabMap = { shooter:'shooters', arcade:'arcade', puzzle:'puzzle', strategy:'strategy', racing:'racing', sports:'sports' };
  const tabEl  = document.getElementById('tab-' + (tabMap[cat] || 'games'));
  if (tabEl) tabEl.classList.add('active');

  activeCategory = cat;
  document.querySelectorAll('.fcat').forEach(b => {
    b.classList.toggle('active', b.dataset.cat === cat);
  });

  document.getElementById('games').classList.add('active');
  renderCards(cat, '');
}

function goHome() {
  closeBrowser();
  innerApp.classList.remove('open');
  homePage.style.display = '';
}

function switchTab(id, btn) {
  closeBrowser();
  document.querySelectorAll('.btab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeCategory = 'all';
  document.querySelectorAll('.fcat').forEach(b => b.classList.toggle('active', b.dataset.cat === 'all'));
  document.getElementById('game-search').value = '';
  renderCards('all', '');
}

function switchTabFilter(tabId, cat, btn) {
  closeBrowser();
  document.querySelectorAll('.btab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeCategory = cat;
  document.querySelectorAll('.fcat').forEach(b => b.classList.toggle('active', b.dataset.cat === cat));
  document.getElementById('game-search').value = '';
  renderCards(cat, '');
}


/* ═══════════════════════════════════════════
   BROWSER / IFRAME
═══════════════════════════════════════════ */
const browserView  = document.getElementById('browser-view');
const cardsArea    = document.getElementById('cards-area');
const siteFrame    = document.getElementById('site-frame');
const urlBar       = document.getElementById('browser-url-bar');
const frameLoading = document.getElementById('frame-loading');
const blockedNote  = document.getElementById('blocked-notice');

let currentUrl  = '';
let blockTimer  = null;

function openSite(url, label) {
  currentUrl = url;
  urlBar.textContent = label + '  —  ' + url;
  document.getElementById('loading-sub').textContent = url;

  browserView.classList.add('open');
  cardsArea.style.display = 'none';
  frameLoading.classList.add('show');
  blockedNote.classList.remove('show');
  siteFrame.style.visibility = 'hidden';
  siteFrame.src = '';
  clearTimeout(blockTimer);

  requestAnimationFrame(() => { siteFrame.src = url; });

  siteFrame.onload = () => {
    clearTimeout(blockTimer);
    frameLoading.classList.remove('show');
    siteFrame.style.visibility = 'visible';
    // Detect blank document (some blocked sites load but are empty)
    try {
      const doc = siteFrame.contentDocument;
      if (doc && doc.body && doc.body.innerHTML.trim() === '') showBlocked();
    } catch (e) {
      // Cross-origin — frame loaded fine, just can't read its content
    }
  };

  siteFrame.onerror = () => {
    clearTimeout(blockTimer);
    showBlocked();
  };

  // If still loading after 7s, assume it loaded cross-origin and just show it
  blockTimer = setTimeout(() => {
    if (frameLoading.classList.contains('show')) {
      frameLoading.classList.remove('show');
      siteFrame.style.visibility = 'visible';
    }
  }, 7000);
}

function showBlocked() {
  frameLoading.classList.remove('show');
  siteFrame.style.visibility = 'hidden';
  blockedNote.classList.add('show');
}

function closeBrowser() {
  clearTimeout(blockTimer);
  browserView.classList.remove('open');
  cardsArea.style.display = '';
  siteFrame.src = 'about:blank';
  siteFrame.style.visibility = 'visible';
  frameLoading.classList.remove('show');
  blockedNote.classList.remove('show');
  currentUrl = '';
  urlBar.textContent = 'about:blank';
}

function openNewWin() {
  if (currentUrl) window.open(currentUrl, '_blank');
}

function reloadFrame() {
  if (currentUrl) {
    frameLoading.classList.add('show');
    siteFrame.style.visibility = 'hidden';
    blockedNote.classList.remove('show');
    siteFrame.src = '';
    requestAnimationFrame(() => { siteFrame.src = currentUrl; });
  }
}


/* ─── KICK IT OFF ─── */
loadGames();
