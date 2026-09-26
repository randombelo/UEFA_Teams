import { Btn } from "../atoms/Btn.js";

export function PaginationBar({ id = "pagination", page = 1, hasPrev = false, hasNext = false }) {
  return `
    <nav class="pagination" id="${id}" aria-label="Pagination">
      ${Btn({ id: `${id}-prev`, label: "Previous", variant: "ghost", size: "sm", disabled: !hasPrev })}
      <span class="pagination__page" aria-current="true">Page ${page}</span>
      ${Btn({ id: `${id}-next`, label: "Next", variant: "ghost", size: "sm", disabled: !hasNext })}
    </nav>
  `;
}

export function mountPaginationBar(element, { onPrev, onNext }) {
  element.querySelector(`#${element.id}-prev`).addEventListener("click", onPrev);
  element.querySelector(`#${element.id}-next`).addEventListener("click", onNext);
}