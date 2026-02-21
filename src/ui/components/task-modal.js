export function createTaskModal(columnId) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-labelledby", "task-modal-title");

  const modal = document.createElement("div");
  modal.className = "task-modal";

  modal.innerHTML = `
    <h2 id="task-modal-title">Create Task</h2>

    <label>
      Task Name
      <input
        type="text"
        id="task-title"
        placeholder="Enter task name"
        aria-label="Task name"
        aria-required="true"
      />
    </label>

    <label>
      Priority
      <div class="priority-buttons" role="group" aria-label="Select task priority">
        <button data-priority="Low" aria-pressed="false" aria-label="Set priority to Low">Low</button>
        <button data-priority="Medium" class="active" aria-pressed="true" aria-label="Set priority to Medium">Medium</button>
        <button data-priority="High" aria-pressed="false" aria-label="Set priority to High">High</button>
      </div>
    </label>

    <label>
      Deadline
      <div class="deadline-selects">
        <select id="deadline-month" aria-label="Deadline month"></select>
        <select id="deadline-day" aria-label="Deadline day"></select>
        <select id="deadline-year" aria-label="Deadline year"></select>
      </div>
    </label>

    <div class="modal-actions">
      <button id="cancel-task" aria-label="Cancel and close modal">Cancel</button>
      <button id="create-task" aria-label="Create task">Create</button>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  setupDeadlineOptions();
  setupPriorityButtons();

  // ── Auto-focus the Task Name input when modal opens ──
  const titleInput = modal.querySelector("#task-title");
  requestAnimationFrame(() => titleInput.focus());

  // ── Close helpers ──
  const closeModal = () => {
    overlay.remove();
    // Return focus to the element that opened the modal, if tracked
    if (document._lastFocusedBeforeModal) {
      document._lastFocusedBeforeModal.focus();
      document._lastFocusedBeforeModal = null;
    }
  };

  // ── Escape key closes modal ──
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closeModal();
    }

    // ── Tab key: trap focus inside modal ──
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
  };

  overlay.addEventListener("keydown", handleKeyDown);

  // ── Cancel button ──
  modal.querySelector("#cancel-task").addEventListener("click", closeModal);

  // ── Create button ──
  modal.querySelector("#create-task").addEventListener("click", () => {
    const title = modal.querySelector("#task-title").value.trim();
    if (!title) {
      titleInput.focus();
      titleInput.setAttribute("aria-invalid", "true");
      return alert("Task name is required");
    }

    const priority =
      modal.querySelector(".priority-buttons .active")?.dataset.priority;

    const month = modal.querySelector("#deadline-month").value;
    const day = modal.querySelector("#deadline-day").value;
    const year = modal.querySelector("#deadline-year").value;

    const deadline =
      month && day && year ? `${year}-${month}-${day}` : null;

    document.dispatchEvent(
      new CustomEvent("create-task", {
        detail: { title, priority, deadline, columnId },
      })
    );

    closeModal();
  });
}

// ── Returns all keyboard-focusable elements inside a container ──
function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ).filter((el) => !el.disabled && el.offsetParent !== null);
}

function setupPriorityButtons() {
  document.querySelectorAll(".priority-buttons button").forEach((btn) => {
    // Click handler
    btn.addEventListener("click", () => activatePriority(btn));

    // ── Enter / Space already trigger click on buttons natively,
    //    but we add keydown for explicit Space handling on some browsers ──
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activatePriority(btn);
      }
    });
  });
}

function activatePriority(activeBtn) {
  activeBtn.parentElement.querySelectorAll("button").forEach((b) => {
    b.classList.remove("active");
    b.setAttribute("aria-pressed", "false");
  });
  activeBtn.classList.add("active");
  activeBtn.setAttribute("aria-pressed", "true");
}

function setupDeadlineOptions() {
  const month = document.getElementById("deadline-month");
  const day = document.getElementById("deadline-day");
  const year = document.getElementById("deadline-year");

  ["", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
    .forEach((m) => month.add(new Option(m || "Month", m)));

  day.add(new Option("Day", ""));
  for (let d = 1; d <= 31; d++)
    day.add(new Option(d, String(d).padStart(2, "0")));

  const currentYear = new Date().getFullYear();
  year.add(new Option("Year", ""));
  for (let y = currentYear; y <= currentYear + 5; y++)
    year.add(new Option(y, y));
}