export function Btn({ label, type = "button", variant = "primary", size = "", disabled = false, id = "" }) {
  const classes = [`btn`, `btn--${variant}`, size ? `btn--${size}` : ""].filter(Boolean).join(" ");
  const attrs = [id ? `id="${id}"` : "", disabled ? "disabled" : ""].filter(Boolean).join(" ");
  return `<button class="${classes}" type="${type}" ${attrs}>${label}</button>`;
}
