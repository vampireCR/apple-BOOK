import "./www/app.js";

(() => {
  "use strict";

  const STYLE = `
    .apple-menu-button {
      width: 44px;
      height: 44px;
      border: 1px solid var(--line, #ddd);
      border-radius: 12px;
      background: var(--card, #fff);
      color: inherit;
      font-size: 23px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .apple-menu-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,.48);
      z-index: 900;
      opacity: 0;
      visibility: hidden;
      transition: .2s;
    }

    .apple-menu-overlay.visible {
      opacity: 1;
      visibility: visible;
    }

    .sidebar {
      transition: transform .25s ease;
    }

    .sidebar.apple-menu-open {
      transform: translateX(0);
      z-index: 1000;
    }

    .apple-extra-page {
      display: none;
    }

    .apple-extra-page.active {
      display: block;
    }

    .apple-extra-page .panel {
      margin-bottom: 16px;
    }

    .apple-extra-icon {
      width: 48px;
      height: 48px;
      display: grid;
      place-items: center;
      border-radius: 14px;
      background: rgba(100,27,43,.1);
      font-size: 24px;
    }

    .apple-extra-card {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 16px;
      border: 1px solid var(--line, #ddd);
      border-radius: 14px;
      margin-top: 12px;
    }

    .apple-extra-card h3 {
      margin: 0 0 5px;
    }

    .apple-extra-card p {
      margin: 0;
    }

    .apple-back-button {
      display: none;
    }

    @media(max-width: 850px) {
      .apple-menu-button {
        display: flex;
      }

      .sidebar {
        position: fixed !important;
        top: 0;
        left: 0;
        bottom: 0;
        width: min(310px, 85vw);
        max-width: 310px;
        overflow-y: auto;
        transform: translateX(-110%);
        z-index: 1000;
        background: var(--bg, #fff);
        padding: 15px;
        box-shadow: 12px 0 35px rgba(0,0,0,.16);
      }

      .sidebar.apple-menu-open {
        transform: translateX(0);
      }

      .apple-back-button.visible {
        display: inline-flex;
      }

      .messages-layout {
        grid-template-columns: 1fr !important;
      }

      .messages-contacts {
        width: 100%;
      }

      .chat-panel {
        min-width: 0;
      }
    }

    @media(min-width: 851px) {
      .apple-menu-button {
        display: flex;
      }

      .sidebar.apple-menu-collapsed {
        display: none;
      }
    }
  `;

  function init() {
    if (document.getElementById("appleNavigationStyle")) return;

    const style = document.createElement("style");
    style.id = "appleNavigationStyle";
    style.textContent = STYLE;
    document.head.appendChild(style);

    const topbar = document.querySelector(".topbar");
    const sidebar = document.querySelector(".sidebar");
    const appView = document.getElementById("appView");
    const maincol = document.querySelector(".maincol");

    if (!topbar || !sidebar || !maincol) return;

    // Кнопка меню
    const menuButton = document.createElement("button");
    menuButton.type = "button";
    menuButton.className = "apple-menu-button";
    menuButton.innerHTML = "☰";
    menuButton.setAttribute("aria-label", "Открыть меню");

    topbar.prepend(menuButton);

    // Затемнение фона
    const overlay = document.createElement("div");
    overlay.className = "apple-menu-overlay";
    document.body.appendChild(overlay);

    function closeMenu() {
      sidebar.classList.remove("apple-menu-open");
      overlay.classList.remove("visible");
      menuButton.innerHTML = "☰";
    }

    function toggleMenu() {
      const opened = sidebar.classList.toggle("apple-menu-open");
      overlay.classList.toggle("visible", opened);
      menuButton.innerHTML = opened ? "✕" : "☰";
    }

    menuButton.addEventListener("click", toggleMenu);
    overlay.addEventListener("click", closeMenu);

    // Дополнительные страницы
    const extraPages = [
      {
        id: "groups",
        icon: "👥",
        title: "Группы",
        description: "Общение с несколькими участниками в одном пространстве."
      },
      {
        id: "channels",
        icon: "📢",
        title: "Каналы",
        description: "Публичные и приватные сообщества и публикации."
      },
      {
        id: "calls",
        icon: "📞",
        title: "Звонки",
        description: "Раздел голосовой и видеосвязи."
      }
    ];

    for (const item of extraPages) {
      const page = document.createElement("section");
      page.id = "page-" + item.id;
      page.className = "page apple-extra-page";

      page.innerHTML = `
        <div class="panel pad">
          <div class="apple-extra-icon">${item.icon}</div>
          <h1>${item.title}</h1>
          <p class="muted">${item.description}</p>
          <div class="apple-extra-card">
            <div>
              <h3>${item.title}</h3>
              <p class="muted">
                Интерфейс раздела подготовлен.
                Для подключения полноценной работы необходима
                интеграция с соответствующими таблицами Supabase.
              </p>
            </div>
          </div>
        </div>
      `;

      maincol.appendChild(page);

      const button = document.createElement("button");
      button.type = "button";
      button.className = "nav-btn";
      button.dataset.page = item.id;
      button.innerHTML = `${item.icon} ${item.title}`;

      sidebar.querySelector(".nav")?.insertBefore(
        button,
        sidebar.querySelector('[data-page="profile"]')
      );

      button.addEventListener("click", () => {
        showExtraPage(item.id);
        closeMenu();
      });
    }

    function showExtraPage(id) {
      document.querySelectorAll(".page").forEach(page => {
        page.classList.add("hidden");
      });

      document.querySelectorAll(".nav-btn[data-page]").forEach(button => {
        button.classList.toggle("active", button.dataset.page === id);
      });

      document.getElementById("page-" + id)?.classList.remove("hidden");
    }

    // Закрываем мобильное меню после перехода
    sidebar.querySelectorAll(".nav-btn[data-page]").forEach(button => {
      if (["groups", "channels", "calls"].includes(button.dataset.page)) return;

      button.addEventListener("click", closeMenu);
    });

    // Стартовая страница — чаты
    let chatsOpened = false;

    if (appView) {
      const observer = new MutationObserver(() => {
        if (
          !chatsOpened &&
          !appView.classList.contains("hidden")
        ) {
          chatsOpened = true;

          setTimeout(() => {
            const messagesButton = sidebar.querySelector(
              '[data-page="messages"]'
            );

            if (messagesButton) messagesButton.click();
          }, 500);
        }

        if (appView.classList.contains("hidden")) {
          chatsOpened = false;
          closeMenu();
        }
      });

      observer.observe(appView, {
        attributes: true,
        attributeFilter: ["class"]
      });
    }

    // Если пользователь уже авторизован
    if (appView && !appView.classList.contains("hidden")) {
      setTimeout(() => {
        sidebar.querySelector('[data-page="messages"]')?.click();
      }, 500);
    }

    // ESC закрывает меню
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
