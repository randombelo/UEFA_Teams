import { FormField } from "../molecules/FormField.js";
import { CheckboxGroup } from "../molecules/CheckboxGroup.js";
import { Input } from "../atoms/Input.js";
import { Select } from "../atoms/Select.js";
import { Btn } from "../atoms/Btn.js";
import { showToast } from "./Toast.js";

const DIVISIONS = [
  { value: "first", label: "Primera División" },
  { value: "second", label: "Segunda División" },
  { value: "third", label: "Tercera División" },
];

const REQUIRED = ["name", "country", "founded_date", "uefa_ranking", "division", "head_coach", "president"];

export function TeamFormDialog({ title = "Nuevo equipo", values = {}, errors = {}, competitions = [] }) {
  const v = (k, f = "") => values[k] ?? f;
  const err = (k) => errors[k] ?? "";
  const editing = Boolean(values.id);
  const selectedIds = (values.competitions || []).map((c) => c.id);
  const competitionItems = competitions.map((c) => ({ value: c.id, label: c.name, checked: selectedIds.includes(c.id) }));
  const field = (id, label, types, required = false) => ({
    FormField: (children, name) => FormField({ id, label, required, error: err(name),
      children: Input({ type: types, id, name, value: v(name), required }) }),
  });
  return `
    <dialog class="dialog" aria-labelledby="team-dialog-title">
      <form id="team-form" class="dialog__body" novalidate>
        <h2 id="team-dialog-title" class="dialog__title">${title}</h2>
        ${editing ? `<input type="hidden" name="id" value="${values.id}">` : ""}
        ${FormField({ id: "tf-name", label: "Nombre del equipo", required: true, error: err("name"),
          children: Input({ type: "text", id: "tf-name", name: "name", value: v("name"), required: true }) })}
        ${FormField({ id: "tf-country", label: "País", required: true, error: err("country"),
          children: Input({ type: "text", id: "tf-country", name: "country", value: v("country"), required: true }) })}
        ${FormField({ id: "tf-founded", label: "Fecha de fundación", required: true, error: err("founded_date"),
          children: Input({ type: "date", id: "tf-founded", name: "founded_date", value: v("founded_date"), required: true }) })}
        ${FormField({ id: "tf-titles", label: "Títulos ganados", error: err("titles_won"),
          children: Input({ type: "number", id: "tf-titles", name: "titles_won", value: v("titles_won", 0), min: 0 }) })}
        ${FormField({ id: "tf-rank", label: "Ranking UEFA", required: true, error: err("uefa_ranking"),
          children: Input({ type: "number", id: "tf-rank", name: "uefa_ranking", value: v("uefa_ranking"), required: true, min: 1 }) })}
        ${FormField({ id: "tf-division", label: "División", required: true, error: err("division"),
          children: Select({ id: "tf-division", name: "division", options: DIVISIONS, selected: v("division", "first") }) })}
        ${FormField({ id: "tf-coach", label: "Entrenador", required: true, error: err("head_coach"),
          children: Input({ type: "text", id: "tf-coach", name: "head_coach", value: v("head_coach"), required: true }) })}
        ${FormField({ id: "tf-president", label: "Presidente", required: true, error: err("president"),
          children: Input({ type: "text", id: "tf-president", name: "president", value: v("president"), required: true }) })}
        ${CheckboxGroup({ name: "competition_ids", legend: "Competiciones", items: competitionItems })}
        <div class="dialog__actions">
          ${Btn({ label: "Cancelar", variant: "ghost", type: "button", id: "team-form-cancel" })}
          ${Btn({ label: "Guardar", type: "submit" })}
        </div>
      </form>
    </dialog>`;
}

export function mountTeamFormDialog({ onCreate, onUpdate }) {
  const host = document.createElement("div");
  document.body.appendChild(host);
  let current = null;                                   // null = crear; {id,…} = editar
  let competitions = [];

  const mapFields = (err) => Array.isArray(err.fields)
    ? Object.fromEntries(err.fields.map((f) => [f.field.replace(/^body\./, ""), f.message]))
    : {};

  const validate = (payload) => {
    const errors = {};
    for (const k of REQUIRED) if (!payload[k]) errors[k] = "Campo obligatorio";
    if (payload.uefa_ranking < 1) errors.uefa_ranking = "Debe ser 1 o más";
    if (payload.titles_won < 0) errors.titles_won = "No puede ser negativo";
    return errors;
  };

  const readForm = (form) => {
    const d = new FormData(form);
    return {
      id: d.get("id"), name: d.get("name"), country: d.get("country"),
      founded_date: d.get("founded_date"),
      titles_won: Number(d.get("titles_won")), uefa_ranking: Number(d.get("uefa_ranking")),
      division: d.get("division"), head_coach: d.get("head_coach"), president: d.get("president"),
      competition_ids: d.getAll("competition_ids").map(Number)
    };
  };

  const title = () => (current ? "Editar equipo" : "Nuevo equipo");

  const render = (values, errors = {}) => {
    host.innerHTML = TeamFormDialog({ title: title(), values, errors, competitions });
    const dialog = host.querySelector("dialog");
    host.querySelector("#team-form-cancel").addEventListener("click", () => dialog.close());
    host.querySelector("#team-form").addEventListener("submit", onFormSubmit);
    dialog.showModal();
  };

  const open = (team, comps = []) => { current = team; competitions = comps; render(team ?? {}); };

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