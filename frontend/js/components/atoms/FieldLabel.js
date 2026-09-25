export function FieldLabel({ for: htmlFor, text, required = false }) {
  const req = required ? ' <span class="field-label__req" aria-hidden="true">*</span>' : "";
  return `<label class="field-label" for="${htmlFor}">${text}${req}</label>`;
}