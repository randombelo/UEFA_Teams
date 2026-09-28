import { SearchBar, mountSearchBar } from "../components/molecules/SearchBar.js";
import { PaginationBar, mountPaginationBar } from "../components/molecules/PaginationBar.js";
import { Select } from "../components/atoms/Select.js";
import { Btn } from "../components/atoms/Btn.js";
import { PlayerTable, mountPlayerTable } from "../components/organisms/PlayerTable.js";
import { PlayerFormDialog, mountPlayerFormDialog } from "../components/organisms/PlayerFormDialog.js";
import { teamService } from "../services/teamService.js";
import { playerService } from "../services/playerService.js";
import { showToast } from "../components/organisms/Toast.js";
import { mountConfirmDialog } from "../components/organisms/ConfirmDialog.js";

const state = { page: 1, limit: 10, players: [], clubs: [], loading: false, search: "", clubId: "", hasNext: false };
let pendingPlayerId = null;
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
  const { open: openPlayerForm } = mountPlayerFormDialog({
    onCreate: async (p) => { await playerService.create(p); showToast({ type: "success", message: "Jugador creado correctamente" }); loadPlayers(); },
    onUpdate: async (id, p) => { await playerService.update(id, p); showToast({ type: "success", message: "Jugador actualizado correctamente" }); loadPlayers(); },
  });

  const { open: openConfirm } = mountConfirmDialog({
    onConfirm: async () => {
      const id = pendingPlayerId;
      pendingPlayerId = null;
      try {
        await playerService.remove(id);
        showToast({
          type: "success",
          message: "Jugador eliminado correctamente",
        });
        if (state.players.length === 1 && state.page > 1) state.page--;
        loadPlayers();
      } catch (err) {
        showToast({
          type: "danger",
          message: err.message || "Error al eliminar",
        });
      }
    },
  });
  toolbar.addEventListener("change", (e) => {
    if (e.target.id === "club-filter") { state.clubId = e.target.value; state.page = 1; loadPlayers(); }
  });
  toolbar.addEventListener("click", (e) => {
    if (!e.target.closest("#add-player")) return;
    if (state.clubs.length === 0) return showToast({ type: "warning", message: "Primero crea un equipo antes de añadir jugadores" });
    openPlayerForm(null, state.clubs);
  });
  mountPlayerTable(root, {
    onEdit: (id) => {
      const player = state.players.find((p) => p.id === id);
      if (player) openPlayerForm(player, state.clubs);
    },
    onDelete: (id) => {
      const player = state.players.find((p) => p.id === id);
      if (!player) return;
      pendingPlayerId = id;
      openConfirm(
        `¿Eliminar a "${player.name}"? Esta acción no se puede deshacer.`,
      );
    },
  });
  loadClubs(); loadPlayers();
}