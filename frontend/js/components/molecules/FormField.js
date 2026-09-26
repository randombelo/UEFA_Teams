import { FieldLabel } from "../atoms/FieldLabel.js";

export function FormField({ id, label, required = false, error = "", children = "" }) {
  const errorBlock = error
    ? `<p class="form-field__error" id="${id}-error" role="alert">${error}</p>`
    : "";
  return `
    <div class="form-field">
      ${FieldLabel({ for: id, text: label, required })}
      ${children}
      ${errorBlock}
    </div>
  `;
}