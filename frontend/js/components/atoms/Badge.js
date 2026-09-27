export function Badge({ label, variant = "neutral" }) {
  return `<span class="badge badge--${variant}">${label}</span>`;
}