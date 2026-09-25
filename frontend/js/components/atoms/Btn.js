export function Btn({ label, type = "button", variant = "primary", size = "", disabled = false }) {
  const classes = [`btn`, `btn--${variant}`, size ? `btn--${size}` : ""].filter(Boolean).join(" ");
  return `<button class="${classes}" type="${type}" ${disabled ? "disabled" : ""}>${label}</button>`;
}
