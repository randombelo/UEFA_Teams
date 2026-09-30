import { SearchBar, mountSearchBar } from "../components/molecules/SearchBar.js";
import { PaginationBar, mountPaginationBar } from "../components/molecules/PaginationBar.js";
import { Btn } from "../components/atoms/Btn.js";
import { CompetitionTable, mountCompetitionTable } from "../components/organisms/CompetitionTable.js";
import { mountCompetitionFormDialog } from "../components/organisms/CompetitionFormDialog.js";
import { competitionService } from "../services/competitionService.js";
import { showToast } from "../components/organisms/Toast.js";
import { mountConfirmDialog } from "../components/organisms/ConfirmDialog.js";

const state = { page: 1, limit: 10, competitions: [], loading: false, search: "", hasNext: false };
let pendingCompetitionId = null;
const toolbar = document.querySelector("#competitions-toolbar");
const root = document.querySelector("#competitions-root");

async function loadCompetitions() {
  state.loading = true;
  render();
  try {
    const list = await competitionService.list({ skip: (state.page - 1) * state.limit, limit: state.limit });
    state.competitions = list;
    state.hasNext = list.length === state.limit;   // heurística didáctica del paginado
    state.loading = false;
  } catch (err) {
    state.loading = false;
    showToast({ type: "danger", message: err.message || "Error al cargar competiciones" });
  }
  render();
}

function render() {
  if (toolbar) {
    toolbar.innerHTML = `${SearchBar({ placeholder: "Buscar en esta página..." })} ${Btn({ label: "Nueva competición", id: "add-competition" })}`;
    mountSearchBar(toolbar.querySelector(".search-bar"), (value) => { state.search = value; render(); });
  }
  const filtered = state.search
    ? state.competitions.filter((c) => c.name.toLowerCase().includes(state.search.toLowerCase()))
    : state.competitions;
  if (root) {
    root.innerHTML = `${CompetitionTable({ competitions: filtered, loading: state.loading })} ${PaginationBar({ page: state.page, hasPrev: state.page > 1, hasNext: state.hasNext })}`;
    mountPaginationBar(root.querySelector(".pagination"), {
      onPrev: () => { if (state.page > 1) { state.page--; loadCompetitions(); } },
      onNext: () => { if (state.hasNext) { state.page++; loadCompetitions(); } },
    });
  }
}

export function mountCompetitions() {
  render();
  const { open: openForm } = mountCompetitionFormDialog({
    onCreate: async (p) => { await competitionService.create(p); showToast({ type: "success", message: "Competición creada correctamente" }); loadCompetitions(); },
    onUpdate: async (id, p) => { await competitionService.update(id, p); showToast({ type: "success", message: "Competición actualizada correctamente" }); loadCompetitions(); },
  });
  const { open: openConfirm } = mountConfirmDialog({
    onConfirm: async () => {
      const id = pendingCompetitionId;
      pendingCompetitionId = null;
      try {
        await competitionService.remove(id);
        showToast({ type: "success", message: "Competición eliminada correctamente" });
        if (state.competitions.length === 1 && state.page > 1) state.page--;   // página que queda vacía → retroceder
        loadCompetitions();
      } catch (err) {
        showToast({ type: "danger", message: err.message || "Error al eliminar" });
      }
    },
  });
  toolbar.addEventListener("click", (e) => { if (e.target.closest("#add-competition")) openForm(null); });
  mountCompetitionTable(root, {
    onEdit: (id) => { const c = state.competitions.find((x) => x.id === id); if (c) openForm(c); },
    onDelete: (id) => {
      const c = state.competitions.find((x) => x.id === id);
      if (!c) return;
      pendingCompetitionId = id;                          // (1) guardar qué se va a borrar
      openConfirm(`¿Eliminar "${c.name}"? Esta acción no se puede deshacer.`);   // (2) abrir diálogo
    },
  });
  loadCompetitions();
}