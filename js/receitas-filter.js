/* ═══════════════════════════════════════════════════════════
   receitas-filter.js — Filtro de receitas | Cozinha Globo
═══════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  const FILTER_KEYS = ["tipo-produto", "tipo-receita", "ocasiao"];
  const activeFilters = { "tipo-produto": null, "tipo-receita": null, ocasiao: null };

  let searchQuery = "";
  let debounceTimer = null;

  function init() {
    const cards = document.querySelectorAll(".receita-card");
    const emptyState = document.querySelector(".cg-empty-state");
    const searchInput = document.querySelector(".cg-search-input-wrap input[type='text']");
    const searchBtn = document.querySelector(".cg-search-input-wrap .btn1");

    if (!cards.length) return;

    /* ── Dropdowns ── */
    document.querySelectorAll(".cg-filter").forEach(function (filter) {
      const btn = filter.querySelector(".cg-filter-btn");
      const dropdown = filter.querySelector(".cg-filter-dropdown");
      const label = filter.querySelector(".cg-filter-label");

      if (!btn || !dropdown) return;

      /* Determine which filter key this dropdown controls based on its label */
      const originalLabel = label ? label.textContent.trim() : "";
      let filterKey = null;
      if (originalLabel.toLowerCase().includes("produto")) filterKey = "tipo-produto";
      else if (originalLabel.toLowerCase().includes("receita")) filterKey = "tipo-receita";
      else if (originalLabel.toLowerCase().includes("ocasi")) filterKey = "ocasiao";

      /* Toggle open/close */
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        const isOpen = btn.getAttribute("aria-expanded") === "true";
        closeAllDropdowns();
        if (!isOpen) {
          btn.setAttribute("aria-expanded", "true");
          dropdown.setAttribute("aria-hidden", "false");
          dropdown.style.display = "block";
        }
      });

      /* Select option */
      dropdown.querySelectorAll("li").forEach(function (li) {
        li.addEventListener("click", function () {
          if (!filterKey) return;

          if (li.hasAttribute("data-reset")) {
            activeFilters[filterKey] = null;
            if (label) label.textContent = originalLabel;
          } else {
            const val = li.getAttribute("data-value");
            activeFilters[filterKey] = val;
            if (label) label.textContent = li.textContent.trim();
          }

          closeAllDropdowns();
          applyFilters(cards, emptyState);
        });
      });
    });

    /* Close dropdowns when clicking outside */
    document.addEventListener("click", closeAllDropdowns);

    /* ── Search ── */
    function triggerSearch() {
      searchQuery = searchInput ? searchInput.value.trim().toLowerCase() : "";
      applyFilters(cards, emptyState);
    }

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(triggerSearch, 250);
      });
      searchInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          clearTimeout(debounceTimer);
          triggerSearch();
        }
      });
    }

    if (searchBtn) {
      searchBtn.addEventListener("click", function (e) {
        e.preventDefault();
        clearTimeout(debounceTimer);
        triggerSearch();
      });
    }
  }

  function closeAllDropdowns() {
    document.querySelectorAll(".cg-filter-btn").forEach(function (btn) {
      btn.setAttribute("aria-expanded", "false");
    });
    document.querySelectorAll(".cg-filter-dropdown").forEach(function (dd) {
      dd.setAttribute("aria-hidden", "true");
      dd.style.display = "";
    });
  }

  function applyFilters(cards, emptyState) {
    var visible = 0;

    cards.forEach(function (card) {
      var match = true;

      /* Check each active filter */
      FILTER_KEYS.forEach(function (key) {
        if (activeFilters[key]) {
          var cardVal = card.getAttribute("data-" + key);
          if (cardVal !== activeFilters[key]) match = false;
        }
      });

      /* Check search text */
      if (searchQuery) {
        var title = card.querySelector("h3");
        var desc = card.querySelector("p");
        var text = ((title ? title.textContent : "") + " " + (desc ? desc.textContent : "")).toLowerCase();
        if (text.indexOf(searchQuery) === -1) match = false;
      }

      card.style.display = match ? "" : "none";
      if (match) visible++;
    });

    if (emptyState) {
      emptyState.style.display = visible === 0 ? "block" : "none";
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
