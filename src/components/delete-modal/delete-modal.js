export async function createDeleteModal({
  title = "Confirm Deletion",
  message,
  onConfirm,
}) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay flex justify-center items-center";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-labelledby", "delete-modal-title");

  const modal = document.createElement("div");
  modal.className = "task-modal bg-white p-lg rounded-lg flex flex-col gap-md";

  if (!createDeleteModal.template) {
    const response = await fetch(
      "./src/components/delete-modal/delete-modal.html",
    );
    createDeleteModal.template = await response.text();
  }

  modal.innerHTML = createDeleteModal.template;
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  modal.querySelector("#delete-modal-title").textContent = title;
  modal.querySelector("#delete-modal-message").textContent = message;

  const closeModal = () => {
    overlay.remove();
    document._lastFocusedBeforeModal?.focus();
    document._lastFocusedBeforeModal = null;
  };

  modal.querySelector("#cancel-delete").addEventListener("click", closeModal);

  modal.querySelector("#confirm-delete").addEventListener("click", () => {
    onConfirm();
    closeModal();
  });

  overlay.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closeModal();
    }
  });

  requestAnimationFrame(() =>
    modal.querySelector("#confirm-delete").focus(),
  );
}