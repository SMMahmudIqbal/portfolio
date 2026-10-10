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

document.addEventListener("DOMContentLoaded", () => {
  initMobileDrawer();
  initSmoothScroll();
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
  }

  function closeDrawer() {
    drawer.classList.remove("active");
    drawer.setAttribute("aria-hidden", "true");
    toggleBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
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
   3. TACTILE CARD HOVER & TOUCH FEEDBACK
   ========================================================= */
function initTactileInteractions() {
  const posters = document.querySelectorAll(".work-poster");

  posters.forEach((poster) => {
    poster.addEventListener("mouseenter", () => {
      poster.classList.add("is-hovered");
    });

    poster.addEventListener("mouseleave", () => {
      poster.classList.remove("is-hovered");
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

