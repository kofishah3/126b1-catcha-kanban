export async function createKanbanBoardModal() {
  const $overlay = document.createElement("div");
  $overlay.className = "modal-overlay";
  $overlay.setAttribute("role", "dialog");
  $overlay.setAttribute("aria-modal", "true");
  $overlay.setAttribute("aria-labelledby", "board-modal-title");

  const $modal = document.createElement("div");
  $modal.className = "task-modal";

  if (!createKanbanBoardModal.template) {
    const response = await fetch(
      "./src/components/kanban-board-modal/kanban-board-modal.html",
    );
    createKanbanBoardModal.template = await response.text();
  }

  $modal.innerHTML = createKanbanBoardModal.template;

  $overlay.appendChild($modal);
  document.body.appendChild($overlay);

  const NAME_INPUT = $modal.querySelector("#board-name");
  requestAnimationFrame(() => NAME_INPUT.focus());

  const closeModal = () => {
    $overlay.remove();
    if (document._lastFocusedBeforeModal) {
      document._lastFocusedBeforeModal.focus();
      document._lastFocusedBeforeModal = null;
    }
  };

  $overlay.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closeModal();
      return;
    }

    if (e.key === "Tab") {
      const focusable = getFocusableElements(modal);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  });

  $modal.querySelector("#cancel-board").addEventListener("click", closeModal);

  $modal.querySelector("#create-board").addEventListener("click", () => {
    const name = NAME_INPUT.value.trim();
    if (!name) {
      NAME_INPUT.focus();
      NAME_INPUT.setAttribute("aria-invalid", "true");
      return alert("Board name is required");
    }

    document.dispatchEvent(
      new CustomEvent("create-board", { detail: { name } }),
    );

    closeModal();
  });

  NAME_INPUT.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      modal.querySelector("#create-board").click();
    }
  });
}

function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((el) => !el.disabled && el.offsetParent !== null);
}
