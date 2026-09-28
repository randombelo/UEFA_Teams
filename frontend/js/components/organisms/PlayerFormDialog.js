import { FormField } from "../molecules/FormField.js";
import { Input } from "../atoms/Input.js";
import { Select } from "../atoms/Select.js";
import { Btn } from "../atoms/Btn.js";
import { showToast } from "./Toast.js";

const POSITIONS = [
  { value: "goalkeeper", label: "Portero" },
  { value: "defender", label: "Defensa" },
  { value: "midfielder", label: "Centrocampista" },
  { value: "forward", label: "Delantero" },
];

const REQUIRED = ["name", "country", "performance", "birth_date", "market_value", "salary", "club_id"];

export function PlayerFormDialog({ title = "Nuevo jugador", clubs = [], values = {}, errors = {} }) {
  const v = (k, f = "") => values[k] ?? f;
  const err = (k) => errors[k] ?? "";
  const editing = Boolean(values.id);
  const selectedClub = String(v("club_id", clubs[0]?.id ?? ""));
  return `
    <dialog class="dialog" aria-labelledby="player-dialog-title">
      <form id="player-form" class="dialog__body" novalidate>
        <h2 id="player-dialog-title" class="dialog__title">${title}</h2>
        ${editing ? `<input type="hidden" name="id" value="${values.id}">` : ""}
        ${FormField({ id: "pf-name", label: "Nombre del jugador", required: true, error: err("name"),
          children: Input({ type: "text", id: "pf-name", name: "name", value: v("name"), required: true }) })}
        ${FormField({ id: "pf-country", label: "País", required: true, error: err("country"),
          children: Input({ type: "text", id: "pf-country", name: "country", value: v("country"), required: true }) })}
        ${FormField({ id: "pf-performance", label: "Rendimiento (0-100)", required: true, error: err("performance"),
          children: Input({ type: "number", id: "pf-performance", name: "performance", value: v("performance"), required: true, min: 0, max: 100 }) })}
        ${FormField({ id: "pf-position", label: "Posición", required: true, error: err("field_position"),
          children: Select({ id: "pf-position", name: "field_position", options: POSITIONS, selected: v("field_position", "forward") }) })}
        ${FormField({ id: "pf-birth", label: "Fecha de nacimiento", required: true, error: err("birth_date"),
          children: Input({ type: "date", id: "pf-birth", name: "birth_date", value: v("birth_date"), required: true }) })}
        ${FormField({ id: "pf-value", label: "Valor de mercado (€)", required: true, error: err("market_value"),
          children: Input({ type: "number", id: "pf-value", name: "market_value", value: v("market_value"), required: true, min: 0.01, step: "0.01" }) })}
        ${FormField({ id: "pf-salary", label: "Salario anual (€)", required: true, error: err("salary"),
          children: Input({ type: "number", id: "pf-salary", name: "salary", value: v("salary"), required: true, min: 0.01, step: "0.01" }) })}
        ${FormField({ id: "pf-club", label: "Club", required: true, error: err("club_id"),
          children: Select({ id: "pf-club", name: "club_id", options: clubs.map((c) => ({ value: String(c.id), label: c.name })), selected: selectedClub }) })}
        <div class="dialog__actions">
          ${Btn({ label: "Cancelar", variant: "ghost", type: "button", id: "player-form-cancel" })}
          ${Btn({ label: "Guardar", type: "submit" })}
        </div>
      </form>
    </dialog>`;
}

export function mountPlayerFormDialog({ onCreate, onUpdate }) {
  const host = document.createElement("div");
  document.body.appendChild(host);
  let current = null;                            // null = crear; {id,…} = editar
  let currentClubs = [];                         // los clubes se leen al abrir (nunca quedan viejos)

  const mapFields = (err) => Array.isArray(err.fields)
    ? Object.fromEntries(err.fields.map((f) => [f.field.replace(/^body\./, ""), f.message]))
    : {};

  const validate = (payload) => {
    const errors = {};
    for (const k of REQUIRED) if (!payload[k]) errors[k] = "Campo obligatorio";
    if (payload.performance < 0 || payload.performance > 100) errors.performance = "Debe estar entre 0 y 100";
    if (!(payload.market_value > 0)) errors.market_value = "Debe ser mayor que 0";
    if (!(payload.salary > 0)) errors.salary = "Debe ser mayor que 0";
    return errors;
  };

  const readForm = (form) => {
    const d = new FormData(form);
    return {
      id: d.get("id"),
      name: d.get("name"),
      country: d.get("country"),
      performance: Number(d.get("performance")),
      field_position: d.get("field_position"),
      birth_date: d.get("birth_date"),
      market_value: Number(d.get("market_value")),
      salary: Number(d.get("salary")),
      club_id: Number(d.get("club_id")),
    };
  };

  const title = () => (current ? "Editar jugador" : "Nuevo jugador");

  const render = (values, errors = {}) => {
    host.innerHTML = PlayerFormDialog({ title: title(), clubs: currentClubs, values, errors });
    const dialog = host.querySelector("dialog");
    host.querySelector("#player-form-cancel").addEventListener("click", () => dialog.close());
    host.querySelector("#player-form").addEventListener("submit", onFormSubmit);
    dialog.showModal();
  };

  const open = (player, clubs) => { current = player; currentClubs = clubs; render(player ?? {}); };

  const onFormSubmit = async (e) => {
    e.preventDefault();
    const payload = readForm(e.currentTarget);
    const errors = validate(payload);
    if (Object.keys(errors).length) return render(payload, errors);
    try {
      if (current) await onUpdate(current.id, payload); else await onCreate(payload);
      host.querySelector("dialog").close();
    } catch (err) {
      if (err.type === "validation" && err.fields) render(payload, mapFields(err));
      else showToast({ type: "danger", message: err.message || "Error al guardar" });
    }
  };
  return { open };
}