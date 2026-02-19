import { deleteTask } from "../../api/storage.js";
export function createTaskCard({ id, title, createdAt, deadline, priority }, boardId) {
  const card = document.createElement("div");
  card.className = "task-card";
  card.dataset.taskId = id;

  const header = document.createElement("div");
  header.className = "task-card__header";

  const titleText = document.createElement("h3");
  titleText.className = "task-card__title";
  titleText.textContent = title;

  // --- ACTIONS WRAPPER (NEW) ---
  const actions = document.createElement("div");
  actions.className = "task-card__actions";

  // --- MOVE BUTTON ---
  const moveButton = document.createElement("button");
  moveButton.className = "task-card__move-button";
  moveButton.title = "Move to next status";
  moveButton.innerHTML = `<i data-lucide="circle-check"></i>`;

  moveButton.onclick = () => {
    const board = document.getElementById("app");
    const columns = Array.from(board.querySelectorAll(".kanban-column"));
    const currentColumn = card.closest(".kanban-column");
    if (!currentColumn) return;

    const currentIndex = columns.indexOf(currentColumn);
    if (currentIndex === -1 || currentIndex === columns.length - 1) return;

    const nextColumn = columns[currentIndex + 1];
    const nextTasksContainer = nextColumn.querySelector(
      ".kanban-column__tasks-container"
    );
    if (!nextTasksContainer) return;

    nextTasksContainer.appendChild(card);
  };
  
  // --- DELETE BUTTON ---
  const deleteButton = document.createElement("button");
  deleteButton.className = "task-card__delete-button"; // FIXED
  deleteButton.title = "Delete task";
  deleteButton.innerHTML = `<i data-lucide="trash"></i>`;

  deleteButton.onclick = () => { 
    deleteTask(boardId, id);
    document.dispatchEvent(new CustomEvent("refresh-board"));
  };

  // Add buttons to wrapper
  actions.appendChild(moveButton);
  actions.appendChild(deleteButton);

  // Add title + actions to header
  header.appendChild(titleText);
  header.appendChild(actions);

  // --- INFO SECTION ---
  const info = document.createElement("div");
  info.className = "task-card__info";

  const dateMade = document.createElement("div");
  dateMade.className = "task-card__date";
  dateMade.innerHTML = `<i data-lucide="calendar"></i> <span>${createdAt}</span>`;
  info.appendChild(dateMade);

  if (deadline) {
    const deadlineEl = document.createElement("div");
    deadlineEl.className = "task-card__deadline";
    deadlineEl.innerHTML = `<i data-lucide="clock"></i> <span>${deadline}</span>`;
    info.appendChild(deadlineEl);
  }

  // --- FOOTER ---
  const footer = document.createElement("div");
  footer.className = "task-card__footer";

  if (priority) {
    const priorityBadge = document.createElement("span");
    priorityBadge.className = `task-card__priority task-card__priority--${priority.toLowerCase()}`;
    priorityBadge.textContent = priority;
    footer.appendChild(priorityBadge);
  }

  card.appendChild(header);
  card.appendChild(info);
  card.appendChild(footer);

  return card;
}

