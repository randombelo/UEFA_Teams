export function Btn({ label, type = "button", variant = "primary", size = "", disabled = false, id = "", ...rest }) {
  const classes = [`btn`, `btn--${variant}`, size ? `btn--${size}` : ""].filter(Boolean).join(" ");
  const attrs = [
    id ? `id="${id}"` : "",
    disabled ? "disabled" : "",
    ...Object.entries(rest).filter(([k]) => k.startsWith("data-")).map(([k, v]) => `${k}="${v}"`),
  ].filter(Boolean).join(" ");
  return `<button class="${classes}" type="${type}" ${attrs}>${label}</button>`;
}
