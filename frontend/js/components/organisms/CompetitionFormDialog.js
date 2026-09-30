import { FormField } from "../molecules/FormField.js";
import { Input } from "../atoms/Input.js";
import { Btn } from "../atoms/Btn.js";
import { showToast } from "./Toast.js";

const REQUIRED = ["name"];

export function CompetitionFormDialog({ title = "Nueva competición", values = {}, errors = {} }) {
  const v = (k, f = "") => values[k] ?? f;
  const err = (k) => errors[k] ?? "";
  const editing = Boolean(values.id);
  return `
    <dialog class="dialog" aria-labelledby="competition-dialog-title">
      <form id="competition-form" class="dialog__body" novalidate>
        <h2 id="competition-dialog-title" class="dialog__title">${title}</h2>
        ${editing ? `<input type="hidden" name="id" value="${values.id}">` : ""}
        ${FormField({ id: "cf-name", label: "Nombre", required: true, error: err("name"),
          children: Input({ type: "text", id: "cf-name", name: "name", value: v("name"), required: true }) })}
        ${FormField({ id: "cf-country", label: "País", error: err("country"),
          children: Input({ type: "text", id: "cf-country", name: "country", value: v("country") }) })}
        <div class="dialog__actions">
          ${Btn({ label: "Cancelar", variant: "ghost", type: "button", id: "competition-form-cancel" })}
          ${Btn({ label: "Guardar", type: "submit" })}
        </div>
      </form>
    </dialog>`;
}

export function mountCompetitionFormDialog({ onCreate, onUpdate }) {
  const host = document.createElement("div");
  document.body.appendChild(host);
  let current = null;                                   // null = crear; {id,…} = editar

  const mapFields = (err) => Array.isArray(err.fields)
    ? Object.fromEntries(err.fields.map((f) => [f.field.replace(/^body\./, ""), f.message]))
    : {};

  const validate = (payload) => {
    const errors = {};
    for (const k of REQUIRED) if (!payload[k]) errors[k] = "Campo obligatorio";
    return errors;
  };

  const readForm = (form) => {
    const d = new FormData(form);
    return { id: d.get("id"), name: d.get("name"), country: d.get("country") || null };
  };

  const title = () => (current ? "Editar competición" : "Nueva competición");

  const render = (values, errors = {}) => {
    host.innerHTML = CompetitionFormDialog({ title: title(), values, errors });
    const dialog = host.querySelector("dialog");
    host.querySelector("#competition-form-cancel").addEventListener("click", () => dialog.close());
    host.querySelector("#competition-form").addEventListener("submit", onFormSubmit);
    dialog.showModal();
  };

  const open = (competition) => { current = competition; render(competition ?? {}); };

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