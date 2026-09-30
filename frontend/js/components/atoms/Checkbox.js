export function Checkbox({ id, name, value, label = "", checked = false }) {
  return `
    <label class="checkbox" for="${id}">
      <input type="checkbox" id="${id}" name="${name}" value="${value}" ${checked ? "checked" : ""} />
      <span class="checkbox__text">${label}</span>
    </label>
  `;
}