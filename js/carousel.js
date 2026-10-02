/* ═══════════════════════════════════════════════════
   carousel.js — Carrossel de Produtos | Cozinha Globo
═══════════════════════════════════════════════════ */

(function () {
  const track = document.getElementById("cgTrack");
  const dotsWrap = document.getElementById("cgDots");
  const prevBtn = document.querySelector(".cg-carousel-prev");
  const nextBtn = document.querySelector(".cg-carousel-next");

  if (!track) return;

  const cards = Array.from(track.querySelectorAll(".cg-produto-card"));
  const total = cards.length;
  let index = 0;
  let touchStartX = 0;
  let autoTimer = null;

  /* ── Quantos cards visíveis por breakpoint ── */
  function getVisible() {
    if (window.innerWidth >= 1200) return 4;
    if (window.innerWidth >= 800) return 2;
    return 1;
  }

  /* ── Índice máximo navegável ── */
  function maxIndex() {
    return Math.max(0, total - getVisible());
  }

  /* ── Calcular largura de um card + gap ── */
  function cardStep() {
    const gap = parseInt(getComputedStyle(track).gap) || 16;
    return cards[0].offsetWidth + gap;
  }

  /* ── Mover track ── */
  function goTo(i) {
    index = Math.max(0, Math.min(i, maxIndex()));
    track.style.transform = `translateX(-${index * cardStep()}px)`;
    updateDots();
    updateButtons();
  }

  /* ── Dots ── */
  function buildDots() {
    dotsWrap.innerHTML = "";
    const count = maxIndex() + 1;
    for (let i = 0; i < count; i++) {
      const btn = document.createElement("button");
      btn.className = "cg-dot" + (i === index ? " active" : "");
      btn.setAttribute("aria-label", `Slide ${i + 1}`);
      btn.setAttribute("role", "tab");
      btn.addEventListener("click", () => {
        goTo(i);
        resetAuto();
      });
      dotsWrap.appendChild(btn);
    }
  }

  function updateDots() {
    dotsWrap.querySelectorAll(".cg-dot").forEach((d, i) => {
      d.classList.toggle("active", i === index);
    });
  }

  /* ── Visibilidade dos botões ── */
  function updateButtons() {
    if (prevBtn) prevBtn.style.opacity = index === 0 ? "0.35" : "1";
    if (nextBtn) nextBtn.style.opacity = index >= maxIndex() ? "0.35" : "1";
  }

  /* ── Auto-play (6 s) ── */
  function startAuto() {
    autoTimer = setInterval(() => {
      goTo(index < maxIndex() ? index + 1 : 0);
    }, 6000);
  }

  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  /* ── Eventos de navegação ── */
  prevBtn?.addEventListener("click", () => {
    goTo(index - 1);
    resetAuto();
  });
  nextBtn?.addEventListener("click", () => {
    goTo(index + 1);
    resetAuto();
  });

  /* ── Touch / swipe ── */
  track.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.touches[0].clientX;
    },
    { passive: true },
  );

  track.addEventListener("touchend", (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 44) {
      goTo(diff > 0 ? index + 1 : index - 1);
      resetAuto();
    }
  });

  /* ── Teclado ── */
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      goTo(index - 1);
      resetAuto();
    }
    if (e.key === "ArrowRight") {
      goTo(index + 1);
      resetAuto();
    }
  });

  /* ── Resize: recalcula posição e dots ── */
  window.addEventListener("resize", () => {
    index = Math.min(index, maxIndex());
    buildDots();
    goTo(index);
  });

  /* ── Init ── */
  buildDots();
  goTo(0);
  startAuto();
})();
