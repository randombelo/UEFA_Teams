const LINKS = [
  { label: "Home",    href: "/index.html",        page: "home" },
  { label: "Teams",   href: "/pages/teams.html",  page: "teams" },
  { label: "Players", href: "/pages/players.html", page: "players" },
  { label: "Docs",    href: "/pages/docs.html",   page: "docs" },
];

export function Header({ active = "" } = {}) {
  const items = LINKS
    .map(
      (l) =>
        `<li><a href="${l.href}" ${l.page === active ? 'aria-current="page"' : ""}>${l.label}</a></li>`
    )
    .join("");
    const current = LINKS.find((l) => l.page === active);
  return `
    <header class="app-header">
  <div class="app-header__inner">
    <div class="app-header__bar">
      <a class="app-header__brand" href="/index.html">UEFA</a>
      <span class="app-header__title">${current ? current.label : ""}</span>
      <button type="button" class="app-header__toggle"
              aria-controls="site-nav" aria-expanded="false" aria-label="Abrir menú">
        <span class="app-header__toggle-bar" aria-hidden="true"></span>
        <span class="app-header__toggle-bar" aria-hidden="true"></span>
        <span class="app-header__toggle-bar" aria-hidden="true"></span>
      </button>
    </div>
    <nav id="site-nav" aria-label="Main navigation">
      <ul>${items}</ul>
    </nav>
  </div>
</header>
  `;
}

export function mountHeader(headerEl) {
  if (!headerEl) return;                      // defensa: si no hay header, salir
  const toggle = headerEl.querySelector(".app-header__toggle");
  const nav    = headerEl.querySelector("#site-nav");
  if (!toggle || !nav) return;

  const close = () => {
    headerEl.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menú");
  };
  toggle.addEventListener("click", () => {
    const open = headerEl.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));   // "true"/"false" a aria
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  });
  nav.addEventListener("click", (e) => {      // cerrar al pulsar un enlace
    if (e.target.closest("a")) close();
  });
}