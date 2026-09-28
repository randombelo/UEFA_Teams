import { SearchBar, mountSearchBar } from "../components/molecules/SearchBar.js";
import { PaginationBar, mountPaginationBar } from "../components/molecules/PaginationBar.js";
import { Select } from "../components/atoms/Select.js";
import { Btn } from "../components/atoms/Btn.js";
import { PlayerTable, mountPlayerTable } from "../components/organisms/PlayerTable.js";
import { teamService } from "../services/teamService.js";
import { playerService } from "../services/playerService.js";
import { showToast } from "../components/organisms/Toast.js";

const state = { page: 1, limit: 10, players: [], clubs: [], loading: false, search: "", clubId: "", hasNext: false };
const toolbar = document.querySelector("#players-toolbar");
const root = document.querySelector("#players-root");

async function loadClubs() {
  try { state.clubs = await teamService.list({ limit: 100 }); } catch {}
  render();
}

async function loadPlayers() {
  state.loading = true; render();
  try {
    const list = await playerService.list({ clubId: state.clubId || null, skip: (state.page - 1) * state.limit, limit: state.limit });
    state.players = list;
    state.hasNext = list.length === state.limit;
    state.loading = false;
  } catch (err) {
    state.loading = false;
    showToast({ type: "danger", message: err.message || "Error al cargar jugadores" });
  }
  render();
}

function render() {
  if (toolbar) {
    toolbar.innerHTML = `${SearchBar({ placeholder: "Buscar en esta página..." })}
      ${Select({ id: "club-filter", name: "club_id",
        options: [{ value: "", label: "Todos los clubes" }, ...state.clubs.map((c) => ({ value: String(c.id), label: c.name }))],
        selected: state.clubId })}
      ${Btn({ label: "Nuevo jugador", id: "add-player" })}`;
    mountSearchBar(toolbar.querySelector(".search-bar"), (v) => { state.search = v; render(); });
  }
  const filtered = state.search ? state.players.filter((p) => p.name.toLowerCase().includes(state.search.toLowerCase())) : state.players;
  if (root) {
    root.innerHTML = `${PlayerTable({ players: filtered, loading: state.loading })} ${PaginationBar({ page: state.page, hasPrev: state.page > 1, hasNext: state.hasNext })}`;
    mountPaginationBar(root.querySelector(".pagination"), {
      onPrev: () => { if (state.page > 1) { state.page--; loadPlayers(); } },
      onNext: () => { if (state.hasNext) { state.page++; loadPlayers(); } },
    });
  }
}

export function mountPlayers() {
  render();
  toolbar.addEventListener("change", (e) => { if (e.target.id === "club-filter") { state.clubId = e.target.value; state.page = 1; loadPlayers(); } });
  toolbar.addEventListener("click", (e) => { if (e.target.closest("#add-player")) console.log("Paso 11: nuevo jugador"); });
  mountPlayerTable(root, { onEdit: (id) => console.log("Paso 11: editar", id), onDelete: (id) => console.log("Paso 12: eliminar", id) });
  loadClubs(); loadPlayers();
}