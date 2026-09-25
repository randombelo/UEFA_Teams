export function Input({ type = "text", id, name, value = "", placeholder = "", required = false }) {
  const attrs = [
    `type="${type}"`,
    `class="input"`,
    `id="${id}"`,
    `name="${name}"`,
    `value="${value}"`,
    placeholder ? `placeholder="${placeholder}"` : "",
    required ? "required" : "",
  ].filter(Boolean).join(" ");
  return `<input ${attrs} />`;
}