import { Btn } from "../atoms/Btn.js";

export function ConfirmDialog({
  title = "¿Estás seguro?",
  message = "",
  confirmLabel = "Sí, continuar",
  cancelLabel = "Cancelar",
}) {
  return `
    <dialog class="dialog dialog--sm" aria-labelledby="confirm-dialog-title">
      <div class="dialog__body">
        <h2 id="confirm-dialog-title" class="dialog__title">${title}</h2>
        <p class="dialog__message">${message}</p>
        <div class="dialog__actions">
          ${Btn({ label: cancelLabel, variant: "ghost", type: "button", id: "confirm-cancel" })}
          ${Btn({ label: confirmLabel, variant: "danger", type: "button", id: "confirm-ok" })}
        </div>
      </div>
    </dialog>
  `;
}

export function mountConfirmDialog({ onConfirm }) {
  const host = document.createElement("div");
  document.body.appendChild(host);

  const open = (message) => {
    host.innerHTML = ConfirmDialog({ message });
    const dialog = host.querySelector("dialog");
    host.querySelector("#confirm-cancel").addEventListener("click", () => dialog.close());
    host.querySelector("#confirm-ok").addEventListener("click", () => {
      dialog.close();
      onConfirm();
    });
    dialog.showModal();
  };

  return { open };
}