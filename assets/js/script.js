document.addEventListener("DOMContentLoaded", function () {
  try {
    window.tailwind ||= {};
    tailwind.config = tailwind.config || {
      theme: {
        extend: {
          fontFamily: { sans: ["Poppins", "sans-serif"] },
          colors: { brand: { DEFAULT: "#1b1b1b" } },
        },
      },
    };
  } catch (e) {}

  (function () {
    const mobileSidebar = document.getElementById("mobile-sidebar");
    const mobileOverlay = document.getElementById("mobile-overlay");
    const mobileOpenBtn =
      document.getElementById("mobile-open") ||
      document.getElementById("mobile-menu-btn") ||
      document.querySelector(".mobile-open");
    const mobileCloseBtn =
      document.getElementById("mobile-close") ||
      document.getElementById("mobile-close-btn") ||
      document.querySelector(".mobile-close");

    if (!mobileSidebar || !mobileOverlay) {
      console.warn("mobile-sidebar or mobile-overlay not found in DOM.");
      return;
    }

    const SIDEBAR_HIDDEN_CLASS = "-translate-x-full";
    const OVERLAY_HIDDEN_CLASS = "hidden";

    function openSidebar() {
      mobileOverlay.classList.remove(OVERLAY_HIDDEN_CLASS);

      mobileSidebar.classList.remove(SIDEBAR_HIDDEN_CLASS);

      mobileSidebar.setAttribute("aria-hidden", "false");
      if (mobileOpenBtn) mobileOpenBtn.setAttribute("aria-expanded", "true");

      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";

      if (mobileCloseBtn) {
        mobileCloseBtn.focus();
      } else {
        mobileSidebar.focus && mobileSidebar.focus();
      }
    }

    function closeSidebar() {
      mobileSidebar.classList.add(SIDEBAR_HIDDEN_CLASS);

      mobileOverlay.classList.add(OVERLAY_HIDDEN_CLASS);

      mobileSidebar.setAttribute("aria-hidden", "true");
      if (mobileOpenBtn) mobileOpenBtn.setAttribute("aria-expanded", "false");

      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";

      if (mobileOpenBtn) mobileOpenBtn.focus();
    }

    mobileSidebar.addEventListener("transitionend", (e) => {
      if (e.propertyName !== "transform") return;

      if (mobileSidebar.classList.contains(SIDEBAR_HIDDEN_CLASS)) {
        mobileSidebar.setAttribute("aria-hidden", "true");
      } else {
        mobileSidebar.setAttribute("aria-hidden", "false");
      }
    });

    if (mobileOpenBtn) {
      mobileOpenBtn.addEventListener("click", (e) => {
        e.preventDefault && e.preventDefault();
        openSidebar();
      });
    } else {
      console.warn(
        "Mobile open button not found (expected id 'mobile-open' or 'mobile-menu-btn')."
      );
    }

    if (mobileCloseBtn) {
      mobileCloseBtn.addEventListener("click", (e) => {
        e.preventDefault && e.preventDefault();
        closeSidebar();
      });
    }

    mobileOverlay.addEventListener("click", (e) => {
      closeSidebar();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" || e.key === "Esc") {
        if (!mobileSidebar.classList.contains(SIDEBAR_HIDDEN_CLASS)) {
          closeSidebar();
        }
      }
    });
  })();

  (function () {
    const collToggle = document.getElementById("mobile-collections-toggle");
    const collPanel = document.getElementById("mobile-collections-panel");

    if (!collToggle || !collPanel) {
      return;
    }

    collToggle.setAttribute("aria-expanded", "false");
    collPanel.setAttribute("aria-hidden", "true");
    collPanel.style.maxHeight = "0px";

    function openCollections() {
      collPanel.style.maxHeight = collPanel.scrollHeight + "px";
      collToggle.setAttribute("aria-expanded", "true");
      collPanel.setAttribute("aria-hidden", "false");

      collToggle.classList.add("!font-semibold");
    }

    function closeCollections() {
      collPanel.style.maxHeight = "0px";
      collToggle.setAttribute("aria-expanded", "false");
      collPanel.setAttribute("aria-hidden", "true");
      collToggle.classList.remove("!font-semibold");
    }

    collToggle.addEventListener("click", (e) => {
      e.preventDefault && e.preventDefault();
      const isOpen = collToggle.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closeCollections();
      } else {
        openCollections();
      }
    });

    window.addEventListener("resize", () => {
      if (collToggle.getAttribute("aria-expanded") === "true") {
        collPanel.style.maxHeight = collPanel.scrollHeight + "px";
      }
    });

    collPanel.addEventListener("transitionend", (ev) => {
      if (ev.propertyName !== "max-height") return;
      if (collPanel.style.maxHeight === "0px") {
      } else {
        collPanel.style.maxHeight = collPanel.scrollHeight + "px";
      }
    });
  })();

  (function () {
    const cards = Array.from(
      document.querySelectorAll("#reviews-container .review-card")
    );
    const prevBtn = document.getElementById("reviews-prev");
    const nextBtn = document.getElementById("reviews-next");
    if (!cards.length) return;
    let current = 1;
    const count = cards.length;

    function setRoles() {
      if (window.innerWidth < 1024) {
        cards.forEach((c) => {
          c.classList.remove(
            "center",
            "back-left",
            "back-right",
            "hidden-card"
          );
          c.setAttribute("aria-hidden", "false");
        });
        return;
      }

      cards.forEach((c) =>
        c.classList.remove("center", "back-left", "back-right", "hidden-card")
      );

      const leftIndex = (current - 1 + count) % count;
      const rightIndex = (current + 1) % count;

      cards[current].classList.add("center");
      cards[leftIndex].classList.add("back-left");
      cards[rightIndex].classList.add("back-right");

      cards.forEach((c, i) => {
        if (i !== current && i !== leftIndex && i !== rightIndex) {
          c.classList.add("hidden-card");
        }

        c.setAttribute("aria-hidden", i === current ? "false" : "true");
      });
    }

    function goNext() {
      current = (current + 1) % count;
      setRoles();
    }
    function goPrev() {
      current = (current - 1 + count) % count;
      setRoles();
    }
    nextBtn && nextBtn.addEventListener("click", goNext);
    prevBtn && prevBtn.addEventListener("click", goPrev);
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    });

    cards.forEach((c) =>
      c.addEventListener("click", () => {
        const idx = Number(c.dataset.index);
        if (!isNaN(idx)) {
          current = idx;
          setRoles();
        }
      })
    );

    setRoles();
    window.addEventListener("resize", setRoles);
  })();

  (function initHeroCarousel() {
    const slides = Array.from(document.querySelectorAll(".hero-slide"));
    if (!slides || !slides.length) return;
    const prev = document.getElementById("prev-slide");
    const next = document.getElementById("next-slide");
    const dots = Array.from(document.querySelectorAll(".dot"));
    let idx = 0;
    let auto = null;

    function show(i) {
      i = ((i % slides.length) + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle("active", k === i));
      if (dots && dots.length) {
        dots.forEach((d, k) => d.classList.toggle("active", k === i));
      }
      idx = i;
    }

    if (prev)
      prev.addEventListener("click", () => {
        show(idx - 1);
        restart();
      });
    if (next)
      next.addEventListener("click", () => {
        show(idx + 1);
        restart();
      });
    if (dots && dots.length) {
      dots.forEach((d) => {
        const di =
          d.dataset && d.dataset.index ? parseInt(d.dataset.index, 10) : null;
        d.addEventListener("click", () => {
          if (di === null) return;
          show(di);
          restart();
        });
      });
    }

    function start() {
      stop();
      auto = setInterval(() => show(idx + 1), 6000);
    }
    function stop() {
      if (auto) {
        clearInterval(auto);
        auto = null;
      }
    }
    function restart() {
      stop();
      start();
    }

    show(0);
    start();

    const heroCard = document.querySelector(".hero-card");
    if (heroCard) {
      heroCard.addEventListener("mouseenter", stop);
      heroCard.addEventListener("mouseleave", start);
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        show(idx - 1);
        restart();
      }
      if (e.key === "ArrowRight") {
        show(idx + 1);
        restart();
      }
    });
  })();

  (function initNewArrivalsScroll() {
    const leftBtn = document.getElementById("arr-left");
    const rightBtn = document.getElementById("arr-right");
    const track = document.getElementById("new-arrivals");
    if (!track || !leftBtn || !rightBtn) return;

    function getScrollStep() {
      const first = track.querySelector(".snap-start");
      if (!first) return Math.round(track.clientWidth * 0.8);
      const style = window.getComputedStyle(track);
      const gap = parseFloat(style.gap || style.columnGap || 0) || 0;
      return Math.round(first.offsetWidth + gap);
    }

    function scrollByStep(dir = 1) {
      const step = getScrollStep();
      track.scrollBy({ left: step * dir, behavior: "smooth" });
    }

    function updateArrows() {
      const maxScrollLeft = track.scrollWidth - track.clientWidth;
      const eps = 2;
      leftBtn.disabled = track.scrollLeft <= eps;
      rightBtn.disabled = track.scrollLeft + eps >= maxScrollLeft;
      leftBtn.classList.toggle("opacity-40", leftBtn.disabled);
      rightBtn.classList.toggle("opacity-40", rightBtn.disabled);
      leftBtn.classList.toggle("pointer-events-none", leftBtn.disabled);
      rightBtn.classList.toggle("pointer-events-none", rightBtn.disabled);
    }

    leftBtn.addEventListener("click", () => scrollByStep(-1));
    rightBtn.addEventListener("click", () => scrollByStep(1));

    let rafId = null;
    function onScroll() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateArrows);
    }
    track.addEventListener("scroll", onScroll, { passive: true });

    window.addEventListener("load", updateArrows);
    window.addEventListener("resize", () => {
      clearTimeout(window._arr_resize);
      window._arr_resize = setTimeout(updateArrows, 120);
    });

    track.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollByStep(-1);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollByStep(1);
      }
    });

    updateArrows();
  })();
});

const container = document.getElementById("new-arrivals");
const leftBtn = document.getElementById("arr-left");
const rightBtn = document.getElementById("arr-right");

if (window.innerWidth < 1536) {
  leftBtn.classList.remove("hidden");
  rightBtn.classList.remove("hidden");
}

leftBtn.addEventListener("click", () => {
  container.scrollBy({ left: -350, behavior: "smooth" });
});

rightBtn.addEventListener("click", () => {
  container.scrollBy({ left: 350, behavior: "smooth" });
});

container.addEventListener("scroll", () => {
  leftBtn.style.opacity = container.scrollLeft <= 50 ? "0.3" : "1";
  rightBtn.style.opacity =
    container.scrollLeft >= container.scrollWidth - container.clientWidth - 50
      ? "0.3"
      : "1";
});
