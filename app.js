import "./www/app.js";

(() => {
  "use strict";

  const css = `
    .apple-menu-button {
      width: 42px;
      height: 42px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--line);
      border-radius: 12px;
      background: var(--card);
      color: inherit;
      font-size: 23px;
      cursor: pointer;
      flex-shrink: 0;
    }

    .apple-menu-overlay {
      position: fixed;
      inset: 0;
      z-index: 999;
      background: rgba(0,0,0,.48);
      opacity: 0;
      visibility: hidden;
      transition: opacity .2s, visibility .2s;
    }

    .apple-menu-overlay.visible {
      opacity: 1;
      visibility: visible;
    }

    .sidebar {
      transition: transform .25s ease;
    }

    .sidebar.apple-menu-open {
      transform: translateX(0) !important;
      z-index: 1000;
    }

    .apple-new-page {
      display: none;
    }

    .apple-new-page:not(.hidden) {
      display: block;
    }

    .apple-new-page .panel {
      margin-bottom: 16px;
    }

    .apple-section-heading {
      display: flex;
      align-items: center;
      gap: 13px;
      margin-bottom: 18px;
    }

    .apple-section-icon {
      width: 48px;
      height: 48px;
      display: grid;
      place-items: center;
      border-radius: 14px;
      background: rgba(100,27,43,.12);
      font-size: 25px;
    }

    .apple-section-heading h1 {
      margin: 0;
    }

    .apple-section-heading p {
      margin: 4px 0 0;
    }

    .apple-new-page .apple-feature-card {
      padding: 17px;
      border: 1px solid var(--line);
      border-radius: 14px;
      margin-top: 12px;
    }

    @media(max-width: 850px) {
      .sidebar {
        position: fixed !important;
        top: 0;
        left: 0;
        bottom: 0;
        width: min(310px, 86vw);
        max-width: 310px;
        overflow-y: auto;
        transform: translateX(-110%);
        z-index: 1000;
      }

      .sidebar.apple-menu-open {
        transform: translateX(0) !important;
      }

      .messages-layout {
        grid-template-columns: minmax(0, 1fr) !important;
      }

      .messages-contacts,
      .chat-panel {
        min-width: 0;
        width: 100%;
      }
    }
  `;

  function initializeNavigation() {
    if (document.getElementById("appleNavigationStyle")) return;

    const topbar = document.querySelector(".topbar");
    const sidebar = document.querySelector(".sidebar");
    const appView = document.getElementById("appView");
    const maincol = document.querySelector(".maincol");
    const navigation = sidebar?.querySelector(".nav");

    if (!topbar || !sidebar || !appView || !maincol || !navigation) {
      return;
    }

    const style = document.createElement("style");
    style.id = "appleNavigationStyle";
    style.textContent = css;
    document.head.appendChild(style);

    // Кнопка гамбургер
    const menuButton = document.createElement("button");
    menuButton.type = "button";
    menuButton.className = "apple-menu-button";
    menuButton.textContent = "☰";
    menuButton.setAttribute("aria-label", "Открыть меню");

    topbar.prepend(menuButton);

    // Затемнение экрана
    const overlay = document.createElement("div");
    overlay.className = "apple-menu-overlay";
    document.body.appendChild(overlay);

    function closeMenu() {
      sidebar.classList.remove("apple-menu-open");
      overlay.classList.remove("visible");
      menuButton.textContent = "☰";
      document.body.style.overflow = "";
    }

    function openMenu() {
      sidebar.classList.add("apple-menu-open");
      overlay.classList.add("visible");
      menuButton.textContent = "✕";
      document.body.style.overflow = "hidden";
    }

    menuButton.addEventListener("click", () => {
      sidebar.classList.contains("apple-menu-open")
        ? closeMenu()
        : openMenu();
    });

    overlay.addEventListener("click", closeMenu);

    // Дополнительные разделы
    const sections = [
      {
        id: "groups",
        icon: "👥",
        title: "Группы",
        description: "Общение с несколькими участниками."
      },
      {
        id: "channels",
        icon: "📢",
        title: "Каналы",
        description: "Публичные и приватные сообщества."
      },
      {
        id: "calls",
        icon: "📞",
        title: "Звонки",
        description: "Раздел голосовой и видеосвязи."
      }
    ];

    const profileButton = navigation.querySelector(
      '[data-page="profile"]'
    );

    sections.forEach(section => {
      const page = document.createElement("section");

      page.id = `page-${section.id}`;
      page.className = "page hidden apple-new-page";

      page.innerHTML = `
        <div class="panel pad">
          <div class="apple-section-heading">
            <div class="apple-section-icon">${section.icon}</div>
            <div>
              <h1>${section.title}</h1>
              <p class="muted">${section.description}</p>
            </div>
          </div>

          <div class="apple-feature-card">
            <h3>${section.title}</h3>
            <p class="muted">
              Раздел подготовлен для подключения функциональности.
              Реальные группы, каналы и звонки требуют отдельной
              интеграции с базой данных и серверной частью.
            </p>
          </div>
        </div>
      `;

      maincol.appendChild(page);

      const button = document.createElement("button");
      button.type = "button";
      button.className = "nav-btn";
      button.dataset.page = section.id;
      button.textContent = `${section.icon} ${section.title}`;

      navigation.insertBefore(button, profileButton);

      button.addEventListener("click", () => {
        document.querySelectorAll(".page").forEach(item => {
          item.classList.add("hidden");
        });

        document.querySelectorAll(".nav-btn[data-page]").forEach(item => {
          item.classList.toggle(
            "active",
            item.dataset.page === section.id
          );
        });

        page.classList.remove("hidden");
        closeMenu();
      });
    });

    // Закрытие меню после выбора существующего раздела
    navigation.querySelectorAll(".nav-btn[data-page]").forEach(button => {
      if (["groups", "channels", "calls"].includes(button.dataset.page)) {
        return;
      }

      button.addEventListener("click", closeMenu);
    });

    // Стартовая страница — сообщения
    let initialPageOpened = false;

    function openInitialChatPage() {
      if (initialPageOpened || appView.classList.contains("hidden")) {
        return;
      }

      initialPageOpened = true;

      const messagesButton = navigation.querySelector(
        '[data-page="messages"]'
      );

      messagesButton?.click();
    }

    const observer = new MutationObserver(() => {
      if (appView.classList.contains("hidden")) {
        initialPageOpened = false;
        closeMenu();
      } else {
        openInitialChatPage();
      }
    });

    observer.observe(appView, {
      attributes: true,
      attributeFilter: ["class"]
    });

    if (!appView.classList.contains("hidden")) {
      openInitialChatPage();
    }

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeNavigation,
      { once: true }
    );
  } else {
    initializeNavigation();
  }
})();
