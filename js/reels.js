/* ════════════════════════════════════════════════════════
   reels.js — Instagram Reels interativos | Cozinha Globo
════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  var section, cards, track, dotsWrap;
  var prevBtn, nextBtn;
  var currentCard = null;
  var index = 0;
  var touchStartX = 0;

  function getVisible() {
    if (window.innerWidth >= 1200) return 4;
    if (window.innerWidth >= 800) return 2;
    return 1;
  }

  function maxIndex() {
    return Math.max(0, cards.length - getVisible());
  }

  function cardStep() {
    var gap = parseInt(getComputedStyle(track).gap, 10) || 16;
    return cards[0].offsetWidth + gap;
  }

  function goTo(nextIndex) {
    index = Math.max(0, Math.min(nextIndex, maxIndex()));
    track.style.transform = "translateX(-" + index * cardStep() + "px)";
    updateDots();
    updateButtons();
  }

  function buildDots() {
    dotsWrap.innerHTML = "";
    for (var i = 0; i <= maxIndex(); i++) {
      var button = document.createElement("button");
      button.className = "cg-dot" + (i === index ? " active" : "");
      button.setAttribute("aria-label", "Slide " + (i + 1));
      button.setAttribute("role", "tab");
      button.addEventListener("click", function (event) {
        var targetIndex = Array.prototype.indexOf.call(dotsWrap.children, event.currentTarget);
        goTo(targetIndex);
      });
      dotsWrap.appendChild(button);
    }
  }

  function updateDots() {
    Array.from(dotsWrap.children).forEach(function (dot, dotIndex) {
      dot.classList.toggle("active", dotIndex === index);
    });
  }

  function updateButtons() {
    prevBtn.style.opacity = index === 0 ? "0.35" : "1";
    nextBtn.style.opacity = index >= maxIndex() ? "0.35" : "1";
  }

  function buildSrc(card) {
    var src = card.getAttribute("data-src");
    var separator = src.indexOf("?") === -1 ? "?" : "&";
    return src + separator + "hidecaption=true&autoplay=1";
  }

  function loadReel(card) {
    if (card.querySelector("iframe")) return;
    if (currentCard && currentCard !== card) {
      unloadReel(currentCard);
    }
    var iframe = document.createElement("iframe");
    iframe.src = buildSrc(card);
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("scrolling", "no");
    iframe.setAttribute("allowfullscreen", "");
    iframe.setAttribute(
      "allow",
      "autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
    );
    iframe.addEventListener("load", function () {
      card.classList.remove("reel-loading");
      card.classList.add("reel-active");
    });
    card.classList.add("reel-loading");
    card.appendChild(iframe);
    currentCard = card;
  }

  function unloadReel(card) {
    var iframe = card.querySelector("iframe");
    if (iframe) {
      iframe.src = "";
      card.removeChild(iframe);
    }
    card.classList.remove("reel-loading");
    card.classList.remove("reel-active");
    if (currentCard === card) currentCard = null;
  }

  function initCards() {
    cards.forEach(function (card) {
      card.addEventListener("click", function () {
        loadReel(card);
      });
      card.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          loadReel(card);
        }
      });
    });

    prevBtn.addEventListener("click", function () {
      goTo(index - 1);
    });
    nextBtn.addEventListener("click", function () {
      goTo(index + 1);
    });
    track.addEventListener("touchstart", function (event) {
      touchStartX = event.touches[0].clientX;
    }, { passive: true });
    track.addEventListener("touchend", function (event) {
      var diff = touchStartX - event.changedTouches[0].clientX;
      if (Math.abs(diff) > 44) goTo(index + (diff > 0 ? 1 : -1));
    });
    window.addEventListener("resize", function () {
      index = Math.min(index, maxIndex());
      buildDots();
      goTo(index);
    });
  }

  function init() {
    section = document.querySelector(".cg-historia");
    if (!section) return;
    track = section.querySelector(".cg-reels-grid");
    dotsWrap = section.querySelector(".cg-reels-dots");
    prevBtn = section.querySelector(".cg-reels-prev");
    nextBtn = section.querySelector(".cg-reels-next");
    if (!track || !dotsWrap || !prevBtn || !nextBtn) return;
    cards = Array.from(track.querySelectorAll(".cg-reel-card"));
    if (!cards.length) return;

    initCards();
    buildDots();
    goTo(0);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
