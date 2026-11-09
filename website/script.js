/**
 * Abdurrauf Sakenov - Markdown Portfolio Reader
 * Pure Vanilla JavaScript (Zero Emojis)
 */

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initImageModal();
  initScrollSpy();
});

/**
 * Theme toggle conforming to Modern Web Guidance:
 * - Cycles Auto -> Dark -> Light -> Auto
 * - Synchronizes with <meta name="color-scheme">
 * - Handles cross-tab synchronization and system preference changes
 */
function initThemeToggle() {
  const metaScheme = document.querySelector('meta[name="color-scheme"]');
  const toggleBtn = document.getElementById("theme-toggle");
  if (!toggleBtn || !metaScheme) return;

  const mql = window.matchMedia("(prefers-color-scheme: dark)");

  toggleBtn.addEventListener("click", () => {
    const currentOverride = localStorage.getItem("color-scheme");
    let nextScheme;

    if (!currentOverride) {
      // From auto to opposite of system
      nextScheme = mql.matches ? "light" : "dark";
    } else if (currentOverride === "dark") {
      nextScheme = "light";
    } else {
      // Revert to auto (system)
      nextScheme = null;
    }

    if (nextScheme) {
      try {
        localStorage.setItem("color-scheme", nextScheme);
      } catch (e) {}
      metaScheme.content = nextScheme;
    } else {
      try {
        localStorage.removeItem("color-scheme");
      } catch (e) {}
      metaScheme.content = "light dark";
    }
  });

  // Cross-tab sync
  window.addEventListener("storage", (event) => {
    if (event.key === "color-scheme") {
      metaScheme.content = event.newValue ?? "light dark";
    }
  });

  // System preference change
  mql.addEventListener("change", () => {
    const currentOverride = localStorage.getItem("color-scheme");
    if (!currentOverride) {
      metaScheme.content = "light dark";
    }
  });
}

/**
 * Image preview modal using native <dialog>
 */
function initImageModal() {
  const dialog = document.getElementById("media-modal");
  const modalImg = document.getElementById("modal-image");
  const modalCaption = document.getElementById("modal-caption");
  if (!dialog || !modalImg || !modalCaption) return;

  function showImage(src, title) {
    modalImg.src = src;
    modalImg.alt = title || "image preview";
    modalCaption.textContent = title ? `preview: ${title}` : "preview";
    dialog.showModal();
  }

  // Handle clickable certificate previews
  document.querySelectorAll(".img-preview").forEach((el) => {
    el.addEventListener("click", (e) => {
      const src = el.dataset.src;
      const title = el.dataset.title;
      if (src) {
        e.preventDefault();
        showImage(src, title);
      }
    });
  });

  // Handle zoomable images
  document.querySelectorAll(".zoomable").forEach((img) => {
    img.addEventListener("click", () => {
      showImage(img.getAttribute("src"), img.getAttribute("alt"));
    });
  });

  // Fallback for browsers without native closedby support
  if (!("closedBy" in HTMLDialogElement.prototype)) {
    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const isDialogContent =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;

      if (!isDialogContent) {
        dialog.close();
      }
    });
  }
}

/**
 * ScrollSpy for Left Sidebar Navigation Links
 */
function initScrollSpy() {
  const sidebarLinks = Array.from(
    document.querySelectorAll(".sidebar-link, .sidebar-sublink")
  );
  const targets = [];

  sidebarLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href && href.startsWith("#")) {
      const el = document.getElementById(href.substring(1));
      if (el) {
        targets.push({ link, el, id: href.substring(1) });
      }
    }
  });

  if (!targets.length) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const scrollBehavior = prefersReducedMotion ? "auto" : "smooth";

  let isClickScrolling = false;
  let clickTimeout = null;

  function setActive(activeLink) {
    sidebarLinks.forEach((l) => l.classList.remove("active"));
    if (activeLink) {
      activeLink.classList.add("active");
      const sidebarNav = document.querySelector(".sidebar-nav");
      if (sidebarNav && sidebarNav.scrollHeight > sidebarNav.clientHeight) {
        const linkRect = activeLink.getBoundingClientRect();
        const navRect = sidebarNav.getBoundingClientRect();
        if (linkRect.top < navRect.top || linkRect.bottom > navRect.bottom) {
          activeLink.scrollIntoView({ block: "nearest" });
        }
      }
    }
  }

  function updateActiveSection() {
    if (isClickScrolling) return;

    const scrollY = window.scrollY || window.pageYOffset;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    // 1. If at or near the top of the page, first item (#intro) is always active
    if (scrollY <= 80) {
      setActive(targets[0].link);
      return;
    }

    // 2. If at the bottom of the page, last item is active
    if (scrollY + clientHeight >= scrollHeight - 30) {
      setActive(targets[targets.length - 1].link);
      return;
    }

    // 3. Find current section by scanning which heading passed the activation line
    const threshold = 120;
    let current = targets[0];

    for (let i = 0; i < targets.length; i++) {
      const rect = targets[i].el.getBoundingClientRect();
      if (rect.top <= threshold) {
        current = targets[i];
      } else {
        break;
      }
    }

    setActive(current.link);
  }

  // Intercept click on sidebar links to provide smooth scroll and lock active state
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      const targetId = href.substring(1);
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      e.preventDefault();
      setActive(link);

      isClickScrolling = true;
      if (clickTimeout) clearTimeout(clickTimeout);

      if (targetId === "intro") {
        window.scrollTo({ top: 0, behavior: scrollBehavior });
      } else {
        targetEl.scrollIntoView({ behavior: scrollBehavior, block: "start" });
      }

      if (history.pushState) {
        history.pushState(null, "", href);
      } else {
        location.hash = href;
      }

      // Allow smooth scrolling animation to complete before re-enabling scroll updates
      clickTimeout = setTimeout(() => {
        isClickScrolling = false;
        updateActiveSection();
      }, 700);
    });
  });

  // Cancel click lock early if the user manually wheels or touches
  const cancelClickLock = () => {
    if (isClickScrolling) {
      isClickScrolling = false;
      if (clickTimeout) clearTimeout(clickTimeout);
      updateActiveSection();
    }
  };

  window.addEventListener("wheel", cancelClickLock, { passive: true });
  window.addEventListener("touchmove", cancelClickLock, { passive: true });

  // Throttled scroll listener
  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );

  window.addEventListener("resize", () => {
    updateActiveSection();
  }, { passive: true });

  // Initial check on load
  updateActiveSection();
}
