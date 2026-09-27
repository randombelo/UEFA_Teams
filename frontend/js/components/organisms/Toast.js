export function mountToast() {
  if (document.querySelector("#toast-root")) return;
  const root = document.createElement("div");
  root.id = "toast-root";
  root.setAttribute("aria-live", "polite");
  document.body.appendChild(root);
}

export function showToast({ type = "success", message }) {
  const root = document.querySelector("#toast-root");
  if (!root) return;
  const el = document.createElement("div");
  el.className = `toast toast--${type}`;
  el.setAttribute("role", type === "danger" ? "alert" : "status");
  el.innerHTML = `<span class="toast__msg"></span><button class="toast__close" aria-label="Cerrar">×</button>`;
  el.querySelector(".toast__msg").textContent = message;   // textContent: el mensaje de usuario no es HTML (XSS-safe)
  root.appendChild(el);
  const remove = () => el.remove();
  el.querySelector(".toast__close").addEventListener("click", remove);
  setTimeout(remove, 4000);
  while (root.children.length > 3) root.firstElementChild.remove();
}