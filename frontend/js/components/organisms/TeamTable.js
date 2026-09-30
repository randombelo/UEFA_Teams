import { Badge } from "../atoms/Badge.js";
import { Btn } from "../atoms/Btn.js";
import { Spinner } from "../atoms/Spinner.js";
import { formatDate } from "../../utils/format.js";

const DIVISION_VARIANT = { first: "success", second: "accent", third: "" };

const competitionCells = (t) => {
  const comps = t.competitions || [];
  if (comps.length === 0) return "—";
  return comps.map((c) => Badge({ label: c.name, variant: "accent" })).join(" ");
};

export function TeamTable({ teams = null, loading = false }) {
  if (loading) return `<div class="table-wrap" aria-busy="true">${Spinner()}</div>`;
  if (!teams || teams.length === 0)
    return `<p class="empty-state">No hay equipos todavía.</p>`;

  const rows = teams.map(
    (t) => `
    <tr>
      <td data-label="Nombre">${t.name}</td>
      <td data-label="País">${t.country}</td>
      <td data-label="División">${Badge({ label: t.division, variant: DIVISION_VARIANT[t.division] || "" })}</td>
      <td data-label="Fundación">${formatDate(t.founded_date)}</td>
      <td data-label="Competiciones">${competitionCells(t)}</td>
      <td data-label="Acciones" class="table-actions">
        ${Btn({ label: "Editar", variant: "ghost", size: "sm", id: `edit-${t.id}`, "data-action": "edit", "data-id": `${t.id}` })}
        ${Btn({ label: "Eliminar", variant: "danger", size: "sm", id: `del-${t.id}`, "data-action": "delete", "data-id": `${t.id}` })}
      </td>
    </tr>`
  ).join("");

  return `
    <div class="table-wrap">
      <table class="data-table">
        <thead><tr><th>Nombre</th><th>País</th><th>División</th><th>Fundación</th><th>Competiciones</th><th>Acciones</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

export function mountTeamTable(element, { onEdit, onDelete }) {
  element.addEventListener("click", (e) => {
    const cell = e.target.closest("[data-action]");
    if (!cell) return;
    const id = Number(cell.dataset.id);
    if (cell.dataset.action === "edit") onEdit(id);
    if (cell.dataset.action === "delete") onDelete(id);
  });
}