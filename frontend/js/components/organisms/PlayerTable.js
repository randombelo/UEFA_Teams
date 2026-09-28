import { Badge } from "../atoms/Badge.js";
import { Btn } from "../atoms/Btn.js";
import { Spinner } from "../atoms/Spinner.js";
import { formatCurrency, formatDate } from "../../utils/format.js";

const POSITION_LABEL = {
  goalkeeper: "Portero",
  defender: "Defensa",
  midfielder: "Centrocampista",
  forward: "Delantero",
};
const POSITION_VARIANT = {
  goalkeeper: "accent",
  defender: "danger",
  midfielder: "success",
  forward: "neutral",
};

export function PlayerTable({ players = null, loading = false }) {
  if (loading) return `<div class="table-wrap" aria-busy="true">${Spinner()}</div>`;
  if (!players || players.length === 0)
    return `<p class="empty-state">No hay jugadores todavía.</p>`;

  const rows = players.map(
    (p) => `
    <tr>
      <td data-label="Nombre">${p.name}</td>
      <td data-label="País">${p.country}</td>
      <td data-label="Posición">${Badge({ label: POSITION_LABEL[p.field_position] || p.field_position, variant: POSITION_VARIANT[p.field_position] || "neutral" })}</td>
      <td data-label="Rendimiento">
        <span class="perf" aria-label="Rendimiento ${p.performance}">
          <span class="perf__fill" style="width: ${p.performance}%"></span>
        </span>
        <span class="perf__value">${p.performance}</span>
      </td>
      <td data-label="Valor">${formatCurrency(p.market_value)}</td>
      <td data-label="Salario">${formatCurrency(p.salary)}</td>
      <td data-label="Nacimiento">${formatDate(p.birth_date)}</td>
      <td data-label="Club">${p.club ? p.club.name : "—"}</td>
      <td data-label="Acciones" class="table-actions">
        ${Btn({ label: "Editar", variant: "ghost", size: "sm", id: `edit-${p.id}`, "data-action": "edit", "data-id": `${p.id}` })}
        ${Btn({ label: "Eliminar", variant: "danger", size: "sm", id: `del-${p.id}`, "data-action": "delete", "data-id": `${p.id}` })}
      </td>
    </tr>`
  ).join("");

  return `
    <div class="table-wrap">
      <table class="data-table">
        <thead><tr><th>Nombre</th><th>País</th><th>Posición</th><th>Rendimiento</th><th>Valor</th><th>Salario</th><th>Nacimiento</th><th>Club</th><th>Acciones</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

export function mountPlayerTable(element, { onEdit, onDelete }) {
  element.addEventListener("click", (e) => {
    const cell = e.target.closest("[data-action]");
    if (!cell) return;
    const id = Number(cell.dataset.id);
    if (cell.dataset.action === "edit") onEdit(id);
    if (cell.dataset.action === "delete") onDelete(id);
  });
}