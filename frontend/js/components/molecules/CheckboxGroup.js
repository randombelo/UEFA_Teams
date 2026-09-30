import { Checkbox } from "../atoms/Checkbox.js";

export function CheckboxGroup({ name, legend = "Opciones", items = [] }) {
  if (items.length === 0) return "";
  return `
    <fieldset class="checkbox-group">
      <legend class="checkbox-group__legend">${legend}</legend>
      ${items.map((item) => Checkbox({
        id: `${name}-${item.value}`,
        name,
        value: item.value,
        label: item.label,
        checked: item.checked,
      })).join("")}
    </fieldset>
  `;
}