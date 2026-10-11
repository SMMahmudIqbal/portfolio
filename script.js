/**
 * ==========================================================================
 * GRUNGE COLLAGE PORTFOLIO CONTROLLER
 * Developed by S. M. Mahmud Iqbal
 * 
 * Clean, stable, accessible interaction engine:
 * - Zero automatic jitter/movement (calm & readable by default)
 * - Smooth scroll navigation with sticky header offset
 * - Mobile zine drawer with Escape key and backdrop dismissal
 * - Tactile hover/touch feedback without layout shifts
 * ==========================================================================
 */

console.log(
  "%c[RAW COLLAGE / 2026] Stability & Accessibility Engine Active.\n%cDEVELOPED BY S. M. MAHMUD IQBAL\nhttps://github.com/SMMahmudIqbal/portfolio",
  "background: #1A1A1A; color: #DC143C; font-size: 14px; font-weight: 900; padding: 4px; border: 2px solid #DC143C;",
  "background: #C5A945; color: #1A1A1A; font-size: 11px; font-weight: bold; padding: 2px;"
);

let soundEngine = null;

document.addEventListener("DOMContentLoaded", () => {
  soundEngine = initAnalogSoundEngine();
  initMobileDrawer();
  initSmoothScroll();
  initProjectFilters();
  initTactileInteractions();
  initGitHubRepoStats();
});

/* =========================================================
   1. MOBILE DRAWER NAVIGATION
   ========================================================= */
function initMobileDrawer() {
  const toggleBtn = document.getElementById("zine-drawer-toggle");
  const closeBtn = document.getElementById("zine-drawer-close");
  const drawer = document.getElementById("zine-drawer");
  const links = document.querySelectorAll(".drawer-link");

  if (!toggleBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.add("active");
    drawer.setAttribute("aria-hidden", "false");
    toggleBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    if (soundEngine) soundEngine.playRelayLatch(true);
  }

  function closeDrawer() {
    drawer.classList.remove("active");
    drawer.setAttribute("aria-hidden", "true");
    toggleBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    if (soundEngine) soundEngine.playRelayLatch(false);
  }

  toggleBtn.addEventListener("click", openDrawer);
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);

  // Close on link click
  links.forEach((l) => {
    l.addEventListener("click", closeDrawer);
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.classList.contains("active")) {
      closeDrawer();
    }
  });

  // Close when clicking outside drawer
  document.addEventListener("click", (e) => {
    if (
      drawer.classList.contains("active") &&
      !drawer.contains(e.target) &&
      !toggleBtn.contains(e.target)
    ) {
      closeDrawer();
    }
  });
}

/* =========================================================
   2. SMOOTH SCROLL WITH STICKY HEADER OFFSET
   ========================================================= */
function initSmoothScroll() {
  const navAnchors = document.querySelectorAll('a[href^="#"]');
  const header = document.querySelector(".zine-masthead");
  const headerHeight = header ? header.offsetHeight : 70;

  navAnchors.forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (targetId === "#") return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 16;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });

        // Update URL hash without jumping
        history.pushState(null, null, targetId);
      }
    });
  });
}

/* =========================================================
   2.5. PROJECT CATEGORY FILTERS (PUNK ARCHIVE TABS)
   ========================================================= */
function initProjectFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectPosters = document.querySelectorAll(".work-poster");
  if (!filterButtons.length || !projectPosters.length) return;

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const selectedCategory = btn.getAttribute("data-filter");
      filterButtons.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      if (soundEngine) soundEngine.playMechanicalClick();

      projectPosters.forEach((poster) => {
        const categories = (poster.getAttribute("data-category") || "").split(" ");
        if (selectedCategory === "all" || categories.includes(selectedCategory)) {
          poster.classList.remove("filter-hidden");
        } else {
          poster.classList.add("filter-hidden");
        }
      });
    });
  });
}

/* =========================================================
   3. TACTILE CARD HOVER & TOUCH FEEDBACK
   ========================================================= */
function initTactileInteractions() {
  const cards = document.querySelectorAll(".work-poster, .postit-card, .dossier-folder, .central-collage-box");

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.classList.add("is-hovered");
      if (soundEngine) soundEngine.playPaperRustle();
    });

    card.addEventListener("mouseleave", () => {
      card.classList.remove("is-hovered");
    });
  });

  // Mechanical typewriter key click on buttons and navigation links
  const clickables = document.querySelectorAll(
    ".punk-btn, .poster-btn, .footer-top-btn, .zine-nav-link, .drawer-link, .specs-pill, .frag-pill"
  );

  clickables.forEach((el) => {
    el.addEventListener("click", () => {
      if (soundEngine) soundEngine.playMechanicalClick();
    });
  });
}

/* =========================================================
   4. LIVE GITHUB REPOSITORY METRICS (PUNK TELEMETRY)
   Developed by S. M. Mahmud Iqbal
   Connects to GitHub API for live stars, branches, and tags.
   ========================================================= */
async function initGitHubRepoStats() {
  const statContainers = document.querySelectorAll(".poster-github-stats[data-repo]");
  if (!statContainers.length) return;

  try {
    const res = await fetch("https://api.github.com/users/SMMahmudIqbal/repos?per_page=100", {
      headers: { Accept: "application/vnd.github.v3+json" }
    });

    if (res.ok) {
      const repos = await res.json();
      const repoMap = new Map();
      repos.forEach((repo) => repoMap.set(repo.name.toLowerCase(), repo));

      statContainers.forEach((container) => {
        const repoName = container.getAttribute("data-repo");
        if (!repoName) return;
        const data = repoMap.get(repoName.toLowerCase());
        if (data) {
          const starEl = container.querySelector(".stars-count");
          if (starEl && typeof data.stargazers_count === "number") {
            starEl.textContent = data.stargazers_count;
          }
          const branchEl = container.querySelector(".branch-name");
          if (branchEl && data.default_branch) {
            branchEl.textContent = data.default_branch;
          }
        }
      });
    }

    // Fetch FileBodlai latest release tag if possible
    try {
      const relRes = await fetch("https://api.github.com/repos/SMMahmudIqbal/FileBodlai/releases/latest", {
        headers: { Accept: "application/vnd.github.v3+json" }
      });
      if (relRes.ok) {
        const relData = await relRes.json();
        const fileBodlaiCard = document.querySelector('.poster-github-stats[data-repo="FileBodlai"]');
        if (fileBodlaiCard && relData.tag_name) {
          const releaseEl = fileBodlaiCard.querySelector(".release-tag");
          if (releaseEl) releaseEl.textContent = relData.tag_name;
        }
      }
    } catch (_) {
      // Retain graceful static fallback
    }
  } catch (err) {
    console.info("[GitHub Stats] Kept static fallback metrics:", err.message);
  }
}

/* ==========================================================================
   5. ANALOG & MECHANICAL SOUND ENGINE (WEB AUDIO API SYNTHESIS)
   Developed by S. M. Mahmud Iqbal
   Zero external audio files & 100% offline air-gapped audio synthesis.
   Muted by default to respect visitor preference and browser autoplay policies.
   ========================================================================== */
class AnalogSoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = false;
    this.lastRustleTime = 0;
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    try {
      localStorage.setItem("smmi_sound_fx", this.enabled ? "true" : "false");
    } catch (_) {}

    if (this.enabled) {
      this.ensureContext();
      this.playStampThud(); // tactile feedback on activation
    }
    return this.enabled;
  }

  // 1. Sharp mechanical keyboard key / relay snap (15-30ms)
  playMechanicalClick() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(1400, t);
      osc.frequency.exponentialRampToValueAtTime(180, t + 0.03);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.035);

      // Micro sub-click for physical mechanical feel
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = "square";
      osc2.frequency.setValueAtTime(600, t);
      osc2.frequency.exponentialRampToValueAtTime(90, t + 0.015);

      gain2.gain.setValueAtTime(0.1, t);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.015);

      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);

      osc2.start(t);
      osc2.stop(t + 0.02);
    } catch (_) {}
  }

  // 2. Heavy rubber stamp / punch thud (50-70ms)
  playStampThud() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(180, t);
      osc.frequency.exponentialRampToValueAtTime(35, t + 0.07);

      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.075);

      // Filtered tactile noise burst
      this.playNoiseBurst(0.025, 650, 0.15);
    } catch (_) {}
  }

  // 3. Tactile paper rustle on card hover (throttled to avoid rapid firing)
  playPaperRustle() {
    if (!this.enabled) return;
    const now = Date.now();
    if (now - this.lastRustleTime < 140) return;
    this.lastRustleTime = now;

    this.ensureContext();
    if (!this.ctx) return;

    try {
      this.playNoiseBurst(0.035, 1100, 0.07);
    } catch (_) {}
  }

  // 4. White noise burst utility with bandpass filter
  playNoiseBurst(duration, freq, volume) {
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(freq, t);
      filter.Q.setValueAtTime(1.8, t);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(volume, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(t);
      noise.stop(t + duration);
    } catch (_) {}
  }

  // 5. Drawer open / tape pull relay latch
  playRelayLatch(isOpen) {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      const startFreq = isOpen ? 340 : 680;
      const endFreq = isOpen ? 680 : 340;

      osc.frequency.setValueAtTime(startFreq, t);
      osc.frequency.exponentialRampToValueAtTime(endFreq, t + 0.05);

      gain.gain.setValueAtTime(0.16, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.055);
    } catch (_) {}
  }
}

function initAnalogSoundEngine() {
  const engine = new AnalogSoundEngine();
  const toggleBtns = document.querySelectorAll(".sound-toggle-btn");

  function updateButtonUI(isActive) {
    toggleBtns.forEach((btn) => {
      const label = btn.querySelector(".sound-status-text");
      if (isActive) {
        btn.classList.add("is-active");
        if (label) label.textContent = "[AUDIO: ON ♫]";
        btn.setAttribute("aria-pressed", "true");
      } else {
        btn.classList.remove("is-active");
        if (label) label.textContent = "[AUDIO: OFF]";
        btn.setAttribute("aria-pressed", "false");
      }
    });
  }

  // Check saved preference
  try {
    const saved = localStorage.getItem("smmi_sound_fx");
    if (saved === "true") {
      engine.enabled = true;
      updateButtonUI(true);
      // Resume context on first document touch/click per browser security
      const unlockAudio = () => {
        engine.ensureContext();
        document.removeEventListener("click", unlockAudio);
        document.removeEventListener("keydown", unlockAudio);
      };
      document.addEventListener("click", unlockAudio, { once: true });
      document.addEventListener("keydown", unlockAudio, { once: true });
    } else {
      updateButtonUI(false);
    }
  } catch (_) {
    updateButtonUI(false);
  }

  toggleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const state = engine.toggle();
      updateButtonUI(state);
    });
  });

  return engine;
}


