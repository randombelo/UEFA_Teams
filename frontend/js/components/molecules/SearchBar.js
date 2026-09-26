import { Input } from "../atoms/Input.js";
import { Btn } from "../atoms/Btn.js";

export function SearchBar({ id = "search", placeholder = "Search..." }) {
  return `
    <form class="search-bar" id="${id}" role="search" aria-label="${placeholder}">
      ${Input({ type: "search", id: `${id}-input`, name: "q", placeholder })}
      ${Btn({ label: "Search", type: "submit", variant: "primary" })}
    </form>
  `;
}

export function mountSearchBar(element, onSearch) {
  element.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = element.querySelector("input[name='q']").value.trim();
    onSearch(value);
  });
}
