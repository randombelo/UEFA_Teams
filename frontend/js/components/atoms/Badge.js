export function Badge({ text, variant = "neutral" }) {
  return `<span class="badge badge--${variant}">${text}</span>`;
}