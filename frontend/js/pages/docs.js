import { ENDPOINTS } from "../config/endpointsConfig.js";
import { api } from "../api/axiosClient.js";
import { mountApiStatus } from "../components/molecules/ApiStatus.js";
import { EndpointCard } from "../components/organisms/EndpointCard.js";

const GROUP = [
  { title: "Equipos", key: "teams" },
  { title: "Jugadores", key: "players" },
  { title: "Competiciones", key: "competitions" },
  { title: "Sistema", key: "system" },
];

const root = document.querySelector("#docs-root");
const groupOf = (ep) =>
  ep.url.startsWith("/teams") ? "teams" : ep.url.startsWith("/players") ? "players" : ep.url.startsWith("/competitions") ? "competitions" : "system";

function render() {
  root.innerHTML = GROUP.map((g) => {
    const items = ENDPOINTS.filter((ep) => groupOf(ep) === g.key);
    if (!items.length) return "";
    return `
      <h2 class="docs-section">${g.title}</h2>
      <div class="docs-grid">${items.map((ep) => EndpointCard({ ep })).join("")}</div>`;
  }).join("");
}

async function probe(url, pre, btn) {
  btn.disabled = true;
  pre.hidden = false;
  pre.classList.remove("is-error");
  pre.textContent = "Cargando…";
  try {
    const data = await api.get(url);
    pre.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    pre.classList.add("is-error");
    pre.textContent = `Error ${err.type} — ${err.message}`;
  } finally {
    btn.disabled = false;
  }
}

export function mountDocs() {
  mountApiStatus(document.querySelector("#api-status"));
  render();
  root.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-probe]");
    if (!btn || btn.disabled) return;
    probe(btn.dataset.probe, btn.closest(".endpoint-card").querySelector(".endpoint-card__response"), btn);
  });
}