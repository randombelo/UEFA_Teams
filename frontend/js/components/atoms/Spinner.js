export function Spinner({ label = "Loading..." }={}) {
  return `<span class="spinner" role="status" aria-label="${label}"></span>`;
}