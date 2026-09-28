export function Input({ type = "text", id, name, value = "", placeholder = "", required = false, min, max, step }) {
  const attrs = [
    `type="${type}"`,
    `class="input"`,
    `id="${id}"`,
    `name="${name}"`,
    `value="${value}"`,
    placeholder ? `placeholder="${placeholder}"` : "",
    required ? "required" : "",
    min !== undefined ? `min="${min}"` : "",
    max !== undefined ? `max="${max}"` : "",
    step !== undefined ? `step="${step}"` : "",
  ].filter(Boolean).join(" ");
  return `<input ${attrs} />`;
}