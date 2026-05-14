/* ═══════════════════════════════════════════════════════════
   menu.js — Menu hamburguer mobile | Cozinha Globo
═══════════════════════════════════════════════════════════ */

(function () {
  const overlay = document.createElement("div");
  overlay.id = "menu-overlay";
  overlay.innerHTML = `
    <div id="menu-overlay-bg"></div>
    <div id="menu-overlay-inner">

      <div id="menu-logo-wrap">
        <img id="menu-logo"
          src="/svg/logotipo-globo-header.svg"
          alt="Cozinha Globo"
        />
      </div>

      <nav id="menu-overlay-nav">
        <a href="/"                  class="mob-link">Início</a>
        <a href="/index.html#produtos"          class="mob-link">Produtos</a>
        <a href="/receitas.html"          class="mob-link">Receitas</a>
        <a href="/onde-comprar.html"      class="mob-link">Onde Comprar</a>
        <a href="/contato.html"           class="mob-link">Contato</a>
        <a href="/clube.html"             class="mob-link">Clube</a>
        <a href="/livros.html"            class="mob-link">Livros</a>
        <a href="/trabalhe-conosco.html"  class="mob-link">Trabalhe Conosco</a>
      </nav>

      <div id="menu-social">
        <a href="https://www.facebook.com/cozinhaglobo"   target="_blank" aria-label="Facebook">
          <i class="ri-facebook-fill"></i>
        </a>
        <a href="https://www.instagram.com/cozinhaglobo/" target="_blank" aria-label="Instagram">
          <i class="ri-instagram-line"></i>
        </a>
        <a href="https://www.youtube.com/@cozinha_globo"  target="_blank" aria-label="YouTube">
          <i class="ri-youtube-fill"></i>
        </a>
        <a href="https://www.tiktok.com/@cozinhaglobo"    target="_blank" aria-label="TikTok">
          <i class="ri-tiktok-fill"></i>
        </a>
      </div>

      <button id="menu-close" aria-label="Fechar menu">
        <span></span>
        <span></span>
      </button>
    </div>
  `;
  document.body.appendChild(overlay);

  const style = document.createElement("style");
  style.textContent = `
    #menu-overlay {
      position: fixed;
      inset: 0;
      z-index: 9999;
      pointer-events: none;
      overflow: hidden;
    }

    #menu-overlay-bg {
      position: absolute;
      inset: 0;
      background: #F07A25;
      transform: translateY(-100%);
      will-change: transform;
    }

    #menu-overlay-bg::after {
      content: '';
      position: absolute;
      bottom: -20%;
      right: -15%;
      width: 60vw;
      height: 60vw;
      border-radius: 50%;
      background: radial-gradient(circle,
        rgba(0, 110, 182, 0.15) 0%,
        transparent 70%);
      pointer-events: none;
    }

    /* UMA coluna, dividida em três áreas verticais:
       logo (50% do espaço), nav (50% do espaço), social (fixo no rodapé) */
    #menu-overlay-inner {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      padding: 0 6vw 0;
      opacity: 0;
      pointer-events: none;
      overflow-y: auto;
    }

    /* ── Logo: metade superior, centralizado ── */
    #menu-logo-wrap {
      flex: 1;                      /* ocupa metade do espaço disponível */
      display: flex;
      justify-content: center;      /* centralizado horizontalmente */
      align-items: center;          /* centralizado verticalmente */
    }
    #menu-logo {
      width: clamp(180px, 40vw, 300px);
      will-change: transform;
      display: block;
      opacity: 0;
    }

    /* ── Nav: metade inferior, alinhado à direita ── */
    #menu-overlay-nav {
      flex: 1;                      /* ocupa a outra metade do espaço */
      display: flex;
      flex-direction: column;
      align-items: flex-end;        /* links alinhados à direita */
      justify-content: center;      /* centralizado verticalmente na sua metade */
      gap: 0.1rem;
      padding-bottom: 1rem;
    }

    #menu-overlay-nav::before {
      content: '';
      display: block;
      width: 38%;
      height: 2px;
      background: linear-gradient(to left, rgba(255,255,255,0.5), transparent);
      margin-bottom: 1rem;
      align-self: flex-end;
    }

    .mob-link {
      font-family: 'Montserrat', sans-serif;
      font-size: clamp(1rem, 2.2vw, 1.4rem);
      font-weight: 700;
      color: #ffffff;
      text-decoration: none;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      text-align: right;
      min-height: 40px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      width: 100%;
      opacity: 0;
      transform: translateY(14px);
      transition: color 0.2s ease, letter-spacing 0.2s ease;
    }
    .mob-link:hover {
      color: #006EB6;
      letter-spacing: 0.11em;
    }

    /* ── Social: rodapé fixo, não compete com o flex ── */
    #menu-social {
      display: flex;
      gap: 1.25rem;
      justify-content: flex-end;
      width: 100%;
      padding: 1.25rem 0;
      opacity: 0;
      border-top: 1px solid rgba(255,255,255,0.25);
      flex-shrink: 0;               /* não encolhe — sempre visível no rodapé */
    }
    #menu-social a {
      color: rgba(255,255,255,0.75);
      font-size: 1.5rem;
      text-decoration: none;
      line-height: 1;
      transition: color 0.2s;
    }
    #menu-social a:hover { color: #006EB6; }

    /* Botão fechar */
    #menu-close {
      all: unset;
      position: absolute;
      top: 1.4rem;
      right: 1.5rem;
      width: 52px;
      height: 52px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
    }
    #menu-close span {
      display: block;
      width: 28px;
      height: 2px;
      background: #ffffff;
      border-radius: 2px;
      position: absolute;
      transition: background 0.2s;
    }
    #menu-close span:first-child { transform: rotate(45deg); }
    #menu-close span:last-child  { transform: rotate(-45deg); }
    #menu-close:hover span       { background: #006EB6; }

    #menu-overlay.is-open               { pointer-events: all; }
    #menu-overlay.is-open #menu-overlay-inner,
    #menu-overlay.is-open #menu-close   { pointer-events: all; }
    body.menu-open                      { overflow: hidden; }

    @media (min-width: 1024px) {
      #menu-overlay { display: none !important; }
    }

    @media (max-width: 600px) {
      #menu-overlay-inner { padding: 0 7vw 0; }
    }
  `;
  document.head.appendChild(style);

  /* ── Referências DOM ── */
  const ham = document.querySelector(".ham");
  const overlayBg = document.getElementById("menu-overlay-bg");
  const overlayIn = document.getElementById("menu-overlay-inner");
  const menuLogo = document.getElementById("menu-logo");
  const closeBtn = document.getElementById("menu-close");
  const menuSocial = document.getElementById("menu-social");
  const mobItems = document.querySelectorAll("#menu-overlay-nav .mob-link");

  let logoAnim = null;
  let isOpen = false;

  /* ── Estado inicial GSAP ── */
  gsap.set(overlayBg, { translateY: "-100%" });
  gsap.set(overlayIn, { opacity: 0 });
  gsap.set(menuLogo, { opacity: 0, scale: 0.88 });
  gsap.set(mobItems, { opacity: 0, y: 16 });
  gsap.set(closeBtn, { opacity: 0 });
  gsap.set(menuSocial, { opacity: 0, y: 10 });

  /* ── Abrir ── */
  function openMenu() {
    if (isOpen) return;
    isOpen = true;
    overlay.classList.add("is-open");
    document.body.classList.add("menu-open");
    if (ham) ham.setAttribute("aria-expanded", "true");

    const tl = gsap.timeline();

    tl.to(overlayBg, {
      translateY: "0%",
      duration: 0.58,
      ease: "power3.inOut",
    });
    tl.to(overlayIn, { opacity: 1, duration: 0.01 }, "-=0.1");
    tl.to(
      menuLogo,
      { opacity: 1, scale: 1, duration: 0.7, ease: "power2.out" },
      "-=0.05",
    );

    tl.call(() => {
      logoAnim = gsap.to(menuLogo, {
        scale: 1.05,
        duration: 3.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    });

    tl.to(
      mobItems,
      { opacity: 1, y: 0, duration: 0.48, ease: "power2.out", stagger: 0.06 },
      "-=0.4",
    );
    tl.to(
      [menuSocial, closeBtn],
      {
        opacity: 1,
        y: 0,
        duration: 0.32,
        ease: "power2.out",
        stagger: 0.08,
        pointerEvents: "all",
      },
      "-=0.2",
    );
  }

  /* ── Fechar ── */
  function closeMenu() {
    if (!isOpen) return;
    isOpen = false;
    if (ham) ham.setAttribute("aria-expanded", "false");

    if (logoAnim) {
      logoAnim.kill();
      logoAnim = null;
    }

    const tl = gsap.timeline({
      onComplete() {
        overlay.classList.remove("is-open");
        document.body.classList.remove("menu-open");
        gsap.set(overlayBg, { translateY: "-100%" });
        gsap.set(overlayIn, { opacity: 0 });
        gsap.set(menuLogo, { opacity: 0, scale: 0.88 });
        gsap.set(mobItems, { opacity: 0, y: 16 });
        gsap.set(closeBtn, { opacity: 0 });
        gsap.set(menuSocial, { opacity: 0, y: 10 });
      },
    });

    tl.to([menuSocial, closeBtn, mobItems, menuLogo], {
      opacity: 0,
      duration: 0.18,
      ease: "power2.in",
      stagger: 0.02,
    });
    tl.to(overlayIn, { opacity: 0, duration: 0.08 }, "-=0.05");
    tl.to(overlayBg, {
      translateY: "-100%",
      duration: 0.52,
      ease: "power3.inOut",
    });
  }

  /* ── Eventos ── */
  if (ham) ham.addEventListener("click", openMenu);
  if (closeBtn) closeBtn.addEventListener("click", closeMenu);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) closeMenu();
  });
  document
    .querySelectorAll("#menu-overlay-nav a")
    .forEach((l) => l.addEventListener("click", closeMenu));
})();
