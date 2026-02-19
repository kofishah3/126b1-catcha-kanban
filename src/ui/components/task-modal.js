export function createTaskModal(columnId, boardId) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  const modal = document.createElement("div");
  modal.className = "task-modal";

  modal.innerHTML = `
    <h2>Create Task</h2>

    <label>
      Task Name
      <input type="text" id="task-title" placeholder="Enter task name" />
    </label>

    <label>
      Priority
      <div class="priority-buttons">
        <button data-priority="Low">Low</button>
        <button data-priority="Medium" class="active">Medium</button>
        <button data-priority="High">High</button>
      </div>
    </label>

    <label>
      Deadline
      <div class="deadline-selects">
        <select id="deadline-month"></select>
        <select id="deadline-day"></select>
        <select id="deadline-year"></select>
      </div>
    </label>

    <div class="modal-actions">
      <button id="cancel-task">Cancel</button>
      <button id="create-task">Create</button>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  setupDeadlineOptions();
  setupPriorityButtons();

  // Cancel creating task
  modal.querySelector("#cancel-task").onclick = () => overlay.remove();

  // Create task
  modal.querySelector("#create-task").onclick = () => {
    const title = modal.querySelector("#task-title").value.trim();
    if (!title) return alert("Task name is required");

    const priority =
      modal.querySelector(".priority-buttons .active")?.dataset.priority;

    const month = modal.querySelector("#deadline-month").value;
    const day = modal.querySelector("#deadline-day").value;
    const year = modal.querySelector("#deadline-year").value;
    
    const deadline = 
      month && day && year ? `${year}-${month}-${day}` : null;

    document.dispatchEvent(
      new CustomEvent("create-task", {
        detail: {
          title,
          priority,
          deadline,
          columnId,
          boardId,
        },
      })
    );

    overlay.remove();
  }
}



function setupPriorityButtons() {
  document.querySelectorAll(".priority-buttons button").forEach((btn) => {
    btn.onclick = () => {
      btn.parentElement
        .querySelectorAll("button")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    };
  });
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
  for (let y = currentYear; y <= currentYear + 5; y++)
    year.add(new Option(y, y));
}