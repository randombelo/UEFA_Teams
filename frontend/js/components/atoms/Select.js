export function Select({ id, name, options = [], selected = "" }) {
  const opts = options
    .map((o) => `<option value="${o.value}" ${String(o.value) === String(selected) ? "selected" : ""}>${o.label}</option>`)
    .join("");
  return `<select class="select" id="${id}" name="${name}">${opts}</select>`;
}