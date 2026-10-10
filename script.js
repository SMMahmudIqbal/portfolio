/**
 * ==========================================================================
 * GRUNGE COLLAGE MOTION GRAPHICS CONTROLLER
 * Developed by S. M. Mahmud Iqbal
 * 
 * Spec:
 * - High-Frequency Stop-Motion Jitter (Low-Frame-Rate Steps)
 * - Opposite Scroll Marquee Direction
 * - Raw Physical Media Tactility
 * ==========================================================================
 */

console.log(
  "%c[RAW COLLAGE MOTION / 2026] Stop-Motion Physical Media Engine Active.\n%cDEVELOPED BY S. M. MAHMUD IQBAL\nhttps://github.com/SMMahmudIqbal/portfolio",
  "background: #1A1A1A; color: #DC143C; font-size: 14px; font-weight: 900; padding: 4px; border: 2px solid #DC143C;",
  "background: #C5A945; color: #1A1A1A; font-size: 11px; font-weight: bold; padding: 2px;"
);

document.addEventListener("DOMContentLoaded", () => {
  initStopMotionJitter();
  initZineDrawerNavigation();
  initTactileCardInteractions();
});

/* =========================================================
   1. STOP-MOTION LOW-FRAME-RATE JITTER SIMULATOR
   ========================================================= */
function initStopMotionJitter() {
  const jitterElements = document.querySelectorAll(".jitter-element");

  // Every 240ms, simulate a frame of a 4fps physical stop-motion cut
  setInterval(() => {
    jitterElements.forEach((el) => {
      // 35% chance per frame to apply a physical print offset
      if (Math.random() < 0.35) {
        const rot = (Math.random() * 1.8 - 0.9).toFixed(1);
        const shiftX = (Math.random() * 3 - 1.5).toFixed(1);
        const shiftY = (Math.random() * 3 - 1.5).toFixed(1);
        el.style.transform = `translate(${shiftX}px, ${shiftY}px) rotate(${rot}deg)`;
      } else {
        el.style.transform = "none";
      }
    });
  }, 240);
}

/* =========================================================
   2. MOBILE ZINE DRAWER NAVIGATION
   ========================================================= */
function initZineDrawerNavigation() {
  const toggleBtn = document.getElementById("zine-drawer-toggle");
  const closeBtn = document.getElementById("zine-drawer-close");
  const drawer = document.getElementById("zine-drawer");
  const links = document.querySelectorAll(".drawer-link");

  if (!toggleBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.add("active");
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    drawer.classList.remove("active");
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  toggleBtn.addEventListener("click", openDrawer);
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);

  links.forEach((l) => {
    l.addEventListener("click", closeDrawer);
  });
}

/* =========================================================
   3. TACTILE CARD CUT INTERACTIONS
   ========================================================= */
function initTactileCardInteractions() {
  const posters = document.querySelectorAll(".work-poster");

  posters.forEach((poster) => {
    poster.addEventListener("mouseenter", () => {
      poster.style.filter = "contrast(1.12) brightness(0.97)";
    });

    poster.addEventListener("mouseleave", () => {
      poster.style.filter = "none";
    });
  });
}
