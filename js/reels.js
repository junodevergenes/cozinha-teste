/* ════════════════════════════════════════════════════════
   reels.js — Instagram Reels interativos | Cozinha Globo
════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  var section, cards;
  var mobileIndex = 0;
  var mobileTimer = null;
  var mobileObserver = null;
  var isDesktop = false;
  var currentCard = null; /* tracks the reel currently playing on desktop */

  function checkDevice() {
    isDesktop = window.matchMedia("(pointer: fine) and (min-width: 1024px)").matches;
  }

  function buildSrc(card) {
    var src = card.getAttribute("data-src");
    return src + (src.indexOf("?") === -1 ? "?hidecaption=true" : "&hidecaption=true");
  }

  function loadReel(card) {
    if (card.querySelector("iframe")) return;
    /* Unload the previous card only when switching to a new one */
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
    card.appendChild(iframe);
    card.classList.add("reel-active");
    currentCard = card;
  }

  function unloadReel(card) {
    var iframe = card.querySelector("iframe");
    if (iframe) {
      iframe.src = "";
      card.removeChild(iframe);
    }
    card.classList.remove("reel-active");
    if (currentCard === card) currentCard = null;
  }

  function initDesktop() {
    cards.forEach(function (card) {
      /* Hover loads the reel. Mouseleave does NOT unload it — reel keeps
         playing until the user hovers over a different card. */
      card.addEventListener("mouseenter", function () {
        if (isDesktop) loadReel(card);
      });
    });
  }

  function startMobileSequence() {
    if (!cards || cards.length === 0) return;
    if (mobileIndex >= cards.length) mobileIndex = 0;
    var card = cards[mobileIndex];
    loadReel(card);
    mobileTimer = setTimeout(function () {
      unloadReel(card);
      mobileIndex++;
      startMobileSequence();
    }, 5000);
  }

  function initMobileScroll() {
    if (!("IntersectionObserver" in window)) return;
    mobileObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            mobileObserver.disconnect();
            mobileObserver = null;
            startMobileSequence();
          }
        });
      },
      { threshold: 0.3 }
    );
    mobileObserver.observe(section);
  }

  function init() {
    section = document.querySelector(".cg-historia");
    if (!section) return;
    cards = Array.from(section.querySelectorAll(".cg-reel-card"));
    if (!cards.length) return;

    checkDevice();

    if (isDesktop) {
      initDesktop();
    } else {
      initMobileScroll();
    }

    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        var wasDesktop = isDesktop;
        checkDevice();
        if (isDesktop && !wasDesktop) {
          if (mobileObserver) {
            mobileObserver.disconnect();
            mobileObserver = null;
          }
          clearTimeout(mobileTimer);
          cards.forEach(unloadReel);
          mobileIndex = 0;
          currentCard = null;
          initDesktop();
        }
      }, 200);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
