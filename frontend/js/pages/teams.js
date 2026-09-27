import { SearchBar, mountSearchBar } from "../components/molecules/SearchBar.js";
import { PaginationBar, mountPaginationBar } from "../components/molecules/PaginationBar.js";
import { Btn } from "../components/atoms/Btn.js";
import { TeamTable, mountTeamTable } from "../components/organisms/TeamTable.js";
import { teamService } from "../services/teamService.js";
import { showToast } from "../components/organisms/Toast.js";
import { mountTeamFormDialog } from "../components/organisms/TeamFormDialog.js";
import { mountConfirmDialog } from "../components/organisms/ConfirmDialog.js";

const state = { page: 1, limit: 10, teams: [], loading: false, search: "", hasNext: false };
const toolbar = document.querySelector("#teams-toolbar");
const root = document.querySelector("#teams-root");

async function loadTeams() {
  state.loading = true;
  render();
  try {
    const list = await teamService.list({ skip: (state.page - 1) * state.limit, limit: state.limit });
    state.teams = list;
    state.hasNext = list.length === state.limit;   // heurística didáctica del paginado
    state.loading = false;
  } catch (err) {
    state.loading = false;
    showToast({ type: "danger", message: err.message || "Error al cargar equipos" });
  }
  render();
}

function render() {
  if (toolbar) {
    toolbar.innerHTML = `${SearchBar({ placeholder: "Buscar en esta página..." })} ${Btn({ label: "Nuevo equipo", id: "add-team" })}`;
    mountSearchBar(toolbar.querySelector(".search-bar"), (value) => { state.search = value; render(); });
  }
  const filtered = state.search
    ? state.teams.filter((t) => t.name.toLowerCase().includes(state.search.toLowerCase()))
    : state.teams;
  if (root) {
    root.innerHTML = `${TeamTable({ teams: filtered, loading: state.loading })} ${PaginationBar({ page: state.page, hasPrev: state.page > 1, hasNext: state.hasNext })}`;
    mountPaginationBar(root.querySelector(".pagination"), {
      onPrev: () => { if (state.page > 1) { state.page--; loadTeams(); } },
      onNext: () => { if (state.hasNext) { state.page++; loadTeams(); } },
    });
  }
}

export function mountTeams() {
  render();
  const { open: openTeamForm } = mountTeamFormDialog({
    onCreate: async (p) => { await teamService.create(p); showToast({ type: "success", message: "Equipo creado correctamente" }); loadTeams(); },
    onUpdate: async (id, p) => { await teamService.update(id, p); showToast({ type: "success", message: "Equipo actualizado correctamente" }); loadTeams(); },
  });
  mountConfirmDialog({ onConfirm: () => {} });
  toolbar.addEventListener("click", (e) => { if (e.target.closest("#add-team")) openTeamForm(null); });
  mountTeamTable(root, {
    onEdit: (id) => { const team = state.teams.find((t) => t.id === id); if (team) openTeamForm(team); },
    onDelete: (id) => console.log("Paso 9: eliminar", id),
  });
  loadTeams();
}