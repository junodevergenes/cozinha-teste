/* ===================================================
   MAIN.JS — Cozinha Globo
   Dependências: GSAP + ScrollTrigger (CDN)
   =================================================== */

(function () {
  "use strict";

  /* ─── NAV: Hamburger ─────────────────────────────── */
  const ham = document.querySelector(".ham");
  const nav = document.querySelector("nav");

  if (ham && nav) {
    ham.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("show");
      ham.setAttribute("aria-expanded", String(isOpen));
    });
  }

  /* ─── NAV: Dropdowns ─────────────────────────────── */
  const dropdowns = document.querySelectorAll("[data-dropdown]");

  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector(".nav-dropdown-toggle");
    if (!toggle) return;

    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const willOpen = !dropdown.classList.contains("is-open");
      // Close all others
      dropdowns.forEach((d) => {
        d.classList.remove("is-open");
        const t = d.querySelector(".nav-dropdown-toggle");
        if (t) t.setAttribute("aria-expanded", "false");
      });
      if (willOpen) {
        dropdown.classList.add("is-open");
        toggle.setAttribute("aria-expanded", "true");
      }
    });
  });

  document.addEventListener("click", () => {
    dropdowns.forEach((d) => {
      d.classList.remove("is-open");
      const t = d.querySelector(".nav-dropdown-toggle");
      if (t) t.setAttribute("aria-expanded", "false");
    });
  });

  /* ─── CAROUSEL: Produtos ─────────────────────────── */
  const track = document.getElementById("produtosTrack");
  const dotsWrap = document.getElementById("carouselDots");
  const prevBtn = document.querySelector(".carousel-prev");
  const nextBtn = document.querySelector(".carousel-next");

  if (track) {
    const cards = Array.from(track.querySelectorAll(".produto-card"));
    const total = cards.length;
    let index = 0;
    let touchStartX = 0;
    let isDragging = false;

    /* Returns how many cards are visible at current breakpoint */
    function getVisible() {
      const w = window.innerWidth;
      if (w < 560) return 1;
      if (w < 900) return 2;
      return 4;
    }

    function maxIndex() {
      return Math.max(0, total - getVisible());
    }

    /* ── Build dots ── */
    function buildDots() {
      dotsWrap.innerHTML = "";
      const count = maxIndex() + 1;
      for (let i = 0; i < count; i++) {
        const btn = document.createElement("button");
        btn.className = "dot" + (i === index ? " active" : "");
        btn.setAttribute("aria-label", `Ir para slide ${i + 1}`);
        btn.setAttribute("role", "tab");
        btn.addEventListener("click", () => goTo(i));
        dotsWrap.appendChild(btn);
      }
    }

    function updateDots() {
      dotsWrap.querySelectorAll(".dot").forEach((d, i) => {
        d.classList.toggle("active", i === index);
        d.setAttribute("aria-selected", String(i === index));
      });
    }

    /* ── Move track ── */
    function goTo(i) {
      index = Math.max(0, Math.min(i, maxIndex()));
      const gap = parseInt(getComputedStyle(track).gap) || 16;
      const cardW = cards[0].offsetWidth;
      track.style.transform = `translateX(-${index * (cardW + gap)}px)`;
      updateDots();
    }

    prevBtn?.addEventListener("click", () => goTo(index - 1));
    nextBtn?.addEventListener("click", () => goTo(index + 1));

    /* ── Keyboard navigation ── */
    track.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") goTo(index - 1);
      if (e.key === "ArrowRight") goTo(index + 1);
    });

    /* ── Touch / drag ── */
    track.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.touches[0].clientX;
        isDragging = true;
      },
      { passive: true },
    );

    track.addEventListener("touchend", (e) => {
      if (!isDragging) return;
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 48) goTo(diff > 0 ? index + 1 : index - 1);
      isDragging = false;
    });

    /* ── Mouse drag ── */
    let mouseStartX = 0;
    track.addEventListener("mousedown", (e) => {
      mouseStartX = e.clientX;
      isDragging = true;
    });
    track.addEventListener("mouseup", (e) => {
      if (!isDragging) return;
      const diff = mouseStartX - e.clientX;
      if (Math.abs(diff) > 48) goTo(diff > 0 ? index + 1 : index - 1);
      isDragging = false;
    });
    track.addEventListener("mouseleave", () => {
      isDragging = false;
    });

    /* ── Auto-advance (8 s) ── */
    let autoTimer = setInterval(
      () => goTo(index + 1 <= maxIndex() ? index + 1 : 0),
      8000,
    );
    const resetTimer = () => {
      clearInterval(autoTimer);
      autoTimer = setInterval(
        () => goTo(index + 1 <= maxIndex() ? index + 1 : 0),
        8000,
      );
    };
    prevBtn?.addEventListener("click", resetTimer);
    nextBtn?.addEventListener("click", resetTimer);

    /* ── Resize ── */
    window.addEventListener("resize", () => {
      index = Math.min(index, maxIndex());
      buildDots();
      goTo(index);
    });

    buildDots();
    goTo(0);
  }

  /* ─── FOOTER: Dropdowns ──────────────────────────── */
  document.querySelectorAll(".footer-dropdown").forEach((fd) => {
    const btn = fd.querySelector(".footer-dropdown-btn");
    const list = fd.querySelector(".footer-dropdown-list");
    if (!btn || !list) return;

    btn.addEventListener("click", () => {
      const isOpen = fd.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(isOpen));
      // Animate height
      if (isOpen) {
        list.style.height = list.scrollHeight + "px";
      } else {
        list.style.height = "0";
      }
    });
  });

  /* ─── GSAP: Parallax + Scroll reveals ───────────── */
  function initGSAP() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined")
      return;
    gsap.registerPlugin(ScrollTrigger);

    /* Hero image — sutil drift para baixo */
    gsap.to(".parallax-hero", {
      yPercent: 22,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });

    /* 70 anos image — drift para cima ao rolar */
    gsap.to(".parallax-70", {
      yPercent: 18,
      ease: "none",
      scrollTrigger: {
        trigger: ".setenta-anos",
        start: "top bottom",
        end: "bottom top",
        scrub: 1.2,
      },
    });

    /* Memórias — drift leve */
    gsap.to(".parallax-mem", {
      yPercent: 12,
      ease: "none",
      scrollTrigger: {
        trigger: ".receitas-intro",
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    /* Fade-in stagger: recipe cards */
    gsap.utils.toArray(".recipe-card").forEach((card, i) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 44 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions: "play none none none",
          },
          delay: i * 0.12,
        },
      );
    });

    /* Fade-in stagger: produto cards */
    gsap.utils.toArray(".produto-card").forEach((card, i) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".produtos",
            start: "top 80%",
            toggleActions: "play none none none",
          },
          delay: i * 0.08,
        },
      );
    });

    /* Poem section — fade + rise */
    gsap.fromTo(
      ".poem-inner",
      { opacity: 0, y: 36 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".poem",
          start: "top 78%",
          toggleActions: "play none none none",
        },
      },
    );

    /* Hero card slide up on load */
    gsap.fromTo(
      ".hero-card",
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 0.2 },
    );

    /* Setenta anos content */
    gsap.fromTo(
      ".setenta-anos-content",
      { opacity: 0, x: 50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".setenta-anos",
          start: "top 75%",
          toggleActions: "play none none none",
        },
      },
    );

    /* Clube */
    gsap.fromTo(
      ".clube-text",
      { opacity: 0, x: -40 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".clube",
          start: "top 78%",
          toggleActions: "play none none none",
        },
      },
    );
  }

  /* Aguarda GSAP carregar via CDN */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGSAP);
  } else {
    // Scripts async: espera tick
    requestAnimationFrame(initGSAP);
  }
})();
