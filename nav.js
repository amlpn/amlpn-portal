/**********************************************************************
 * AMLPN — SHARED NAVIGATION
 * ==================================================================
 * Injected into every page. Provides:
 *   - Header with logo + hamburger menu
 *   - Slide-out navigation panel
 *   - Automatic active-page highlighting
 *
 * USAGE IN ANY PAGE:
 *   <script src="/nav.js" defer></script>
 *
 * Optional: set the page title shown in the header bar:
 *   <body data-page="Track Application">
 **********************************************************************/

(function () {

  // ---------- Navigation links ----------

  const NAV_LINKS = [
    { label: "Home", href: "/index.html", icon: "🏠" },
    { label: "Apply for Membership", href: "/apply.html", icon: "📝" },
    { label: "Track Application", href: "/track.html", icon: "🔍" },
    { label: "Member Login", href: "/index.html", icon: "🔐" },
    { label: "About Us", href: "/about.html", icon: "ℹ️" },
    { label: "Meet the Team", href: "/team.html", icon: "👥" },
    { label: "News & Updates", href: "/news.html", icon: "📰" },
    { label: "Contact", href: "/contact.html", icon: "📞" }
  ];

  // Links only shown after login (checked at runtime via localStorage)
  const AUTH_LINKS = [
    { label: "My CPD", href: "/cpd.html", icon: "🎓" }
  ];

  // ---------- Build the header + drawer ----------

  function buildNav() {

    const currentPath = window.location.pathname || "/";
    const pageTitle = document.body.dataset.page || "AMLPN";

    // --- Header bar ---
    const header = document.createElement("div");
    header.className = "amlpn-topbar";

    header.innerHTML =
      '<div class="amlpn-topbar-inner">' +
        '<a href="/index.html" class="amlpn-topbar-brand">AMLPN</a>' +
        '<div class="amlpn-topbar-page">' + escapeHtml(pageTitle) + '</div>' +
        '<button class="amlpn-menu-btn" aria-label="Menu" type="button">' +
          '<span></span><span></span><span></span>' +
        '</button>' +
      '</div>';

    document.body.insertBefore(header, document.body.firstChild);

    // --- Drawer ---
    const overlay = document.createElement("div");
    overlay.className = "amlpn-drawer-overlay";

    const drawer = document.createElement("div");
    drawer.className = "amlpn-drawer";

    let linksHtml = "";

    NAV_LINKS.forEach(link => {
      const isActive = link.href === currentPath;
      linksHtml +=
        '<a class="amlpn-drawer-link' + (isActive ? " active" : "") + '" href="' + link.href + '">' +
          '<span class="amlpn-drawer-icon">' + link.icon + '</span>' +
          '<span class="amlpn-drawer-label">' + escapeHtml(link.label) + '</span>' +
        '</a>';
    });

    // Add auth links if logged in
    const hasSession = localStorage.getItem("amlpn_logged_in") === "yes";

    if (hasSession) {
      linksHtml += '<div class="amlpn-drawer-sep"></div>';
      AUTH_LINKS.forEach(link => {
        const isActive = link.href === currentPath;
        linksHtml +=
          '<a class="amlpn-drawer-link' + (isActive ? " active" : "") + '" href="' + link.href + '">' +
            '<span class="amlpn-drawer-icon">' + link.icon + '</span>' +
            '<span class="amlpn-drawer-label">' + escapeHtml(link.label) + '</span>' +
          '</a>';
      });
    }

    drawer.innerHTML =
      '<div class="amlpn-drawer-head">' +
        '<div class="amlpn-drawer-brand">AMLPN</div>' +
        '<div class="amlpn-drawer-sub">Member Portal</div>' +
      '</div>' +
      '<nav class="amlpn-drawer-nav">' + linksHtml + '</nav>' +
      '<div class="amlpn-drawer-foot">' +
        '<div style="font-size:11px;color:#94A3B8;text-align:center;">Together We Can</div>' +
      '</div>';

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);

    // --- Interaction ---

    const menuBtn = header.querySelector(".amlpn-menu-btn");

    function openDrawer() {
      overlay.classList.add("visible");
      drawer.classList.add("visible");
      document.body.style.overflow = "hidden";
    }

    function closeDrawer() {
      overlay.classList.remove("visible");
      drawer.classList.remove("visible");
      document.body.style.overflow = "";
    }

    menuBtn.addEventListener("click", () => {
      if (drawer.classList.contains("visible")) closeDrawer();
      else openDrawer();
    });

    overlay.addEventListener("click", closeDrawer);

    // Close on Escape
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") closeDrawer();
    });

    // Close on any nav link click
    drawer.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", closeDrawer);
    });
  }

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // ---------- Inject CSS ----------

  function injectStyles() {

    if (document.getElementById("amlpn-nav-styles")) return;

    const style = document.createElement("style");
    style.id = "amlpn-nav-styles";
    style.textContent = `
      /* Top bar */
      .amlpn-topbar {
        background: #17365D;
        color: #fff;
        position: sticky;
        top: 0;
        z-index: 999;
        box-shadow: 0 2px 8px rgba(0,0,0,.15);
      }
      .amlpn-topbar-inner {
        max-width: 1100px;
        margin: 0 auto;
        padding: 10px 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }
      .amlpn-topbar-brand {
        color: #fff;
        text-decoration: none;
        font-size: 20px;
        font-weight: bold;
        letter-spacing: 2px;
        flex-shrink: 0;
      }
      .amlpn-topbar-page {
        color: #E5C453;
        font-size: 12px;
        font-weight: bold;
        letter-spacing: 1px;
        text-transform: uppercase;
        flex: 1;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .amlpn-menu-btn {
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 6px;
        display: flex;
        flex-direction: column;
        gap: 4px;
        flex-shrink: 0;
      }
      .amlpn-menu-btn span {
        display: block;
        width: 24px;
        height: 2px;
        background: #fff;
        border-radius: 2px;
        transition: all .2s;
      }
      .amlpn-menu-btn:hover span { background: #E5C453; }

      /* Drawer overlay */
      .amlpn-drawer-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,.5);
        opacity: 0;
        pointer-events: none;
        transition: opacity .25s;
        z-index: 1000;
      }
      .amlpn-drawer-overlay.visible {
        opacity: 1;
        pointer-events: auto;
      }

      /* Drawer */
      .amlpn-drawer {
        position: fixed;
        top: 0;
        right: 0;
        width: 300px;
        max-width: 85vw;
        height: 100vh;
        background: #0F2A47;
        color: #fff;
        transform: translateX(100%);
        transition: transform .25s ease-out;
        z-index: 1001;
        display: flex;
        flex-direction: column;
        box-shadow: -4px 0 20px rgba(0,0,0,.3);
      }
      .amlpn-drawer.visible { transform: translateX(0); }

      .amlpn-drawer-head {
        padding: 22px 22px 18px;
        border-bottom: 1px solid rgba(255,255,255,.1);
      }
      .amlpn-drawer-brand {
        font-size: 22px;
        font-weight: bold;
        letter-spacing: 3px;
        color: #fff;
      }
      .amlpn-drawer-sub {
        font-size: 11px;
        color: #E5C453;
        margin-top: 4px;
        letter-spacing: .5px;
        text-transform: uppercase;
      }

      .amlpn-drawer-nav {
        flex: 1;
        overflow-y: auto;
        padding: 12px 0;
      }
      .amlpn-drawer-link {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 14px 22px;
        color: #D1D5DB;
        text-decoration: none;
        font-size: 15px;
        transition: all .15s;
        border-left: 3px solid transparent;
      }
      .amlpn-drawer-link:hover {
        background: rgba(255,255,255,.06);
        color: #fff;
      }
      .amlpn-drawer-link.active {
        background: rgba(229,196,83,.12);
        color: #E5C453;
        border-left-color: #E5C453;
        font-weight: bold;
      }
      .amlpn-drawer-icon {
        font-size: 18px;
        width: 24px;
        text-align: center;
        flex-shrink: 0;
      }
      .amlpn-drawer-label {
        flex: 1;
      }
      .amlpn-drawer-sep {
        height: 1px;
        background: rgba(255,255,255,.1);
        margin: 10px 22px;
      }
      .amlpn-drawer-foot {
        padding: 16px;
        border-top: 1px solid rgba(255,255,255,.1);
      }
    `;

    document.head.appendChild(style);
  }

  // ---------- Run ----------

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      injectStyles();
      buildNav();
    });
  } else {
    injectStyles();
    buildNav();
  }

})();
