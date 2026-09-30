import { Btn } from "../atoms/Btn.js";
import { Spinner } from "../atoms/Spinner.js";

export function CompetitionTable({ competitions = null, loading = false }) {
  if (loading) return `<div class="table-wrap" aria-busy="true">${Spinner()}</div>`;
  if (!competitions || competitions.length === 0)
    return `<p class="empty-state">No hay competiciones todavía.</p>`;

  const rows = competitions.map(
    (c) => `
    <tr>
      <td data-label="Nombre">${c.name}</td>
      <td data-label="País">${c.country || "—"}</td>
      <td data-label="Acciones" class="table-actions">
        ${Btn({ label: "Editar", variant: "ghost", size: "sm", id: `edit-${c.id}`, "data-action": "edit", "data-id": `${c.id}` })}
        ${Btn({ label: "Eliminar", variant: "danger", size: "sm", id: `del-${c.id}`, "data-action": "delete", "data-id": `${c.id}` })}
      </td>
    </tr>`
  ).join("");

  return `
    <div class="table-wrap">
      <table class="data-table">
        <thead><tr><th>Nombre</th><th>País</th><th>Acciones</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

export function mountCompetitionTable(element, { onEdit, onDelete }) {
  element.addEventListener("click", (e) => {
    const cell = e.target.closest("[data-action]");
    if (!cell) return;
    const id = Number(cell.dataset.id);
    if (cell.dataset.action === "edit") onEdit(id);
    if (cell.dataset.action === "delete") onDelete(id);
  });
}