export function createTaskCard(
  { id, title, createdAt, deadline, priority },
  boardId,
) {
  const card = document.createElement("div");
  card.className = "task-card";
  card.dataset.taskId = id;

  const header = document.createElement("div");
  header.className = "task-card__header";

  const titleText = document.createElement("h3");
  titleText.className = "task-card__title";
  titleText.textContent = title;

  const moveButton = document.createElement("button");
  moveButton.className = "task-card__move-button";
  moveButton.title = "Move to next status";
  moveButton.innerHTML = `<i data-lucide="circle-check"></i>`;

  moveButton.onclick = () => {
    const currentColumn = card.closest(".kanban-column");
    if (!currentColumn) return;

    const columns = Array.from(
      document.querySelectorAll(".kanban-column")
    );
    const index = columns.indexOf(currentColumn);

    if (index === -1 || index === columns.length - 1) return;

    const nextColumnId = columns[index + 1].dataset.columnId;
    moveTask(boardId, id, nextColumnId);

    document.dispatchEvent(new CustomEvent("refresh-board"));
  };

  moveButton.onclick = () => {
    document.dispatchEvent(
      new CustomEvent("move-task", {
        detail: { taskId: id }
      })
    );
  };

  // --- DELETE BUTTON ---
  const deleteButton = document.createElement("button");
  deleteButton.className = "task-card__delete-button"; // FIXED
  deleteButton.title = "Delete task";
  deleteButton.innerHTML = `<i data-lucide="trash"></i>`;

  deleteButton.onclick = () => {
    document.dispatchEvent(
      new CustomEvent("delete-task", {
        detail: { taskId: id }
      })
    );
  };

  // Add buttons to wrapper
  const actions = document.createElement("div");
  actions.className = "task-card__actions";

  actions.appendChild(moveButton);
  actions.appendChild(deleteButton);

  // Add title + actions to header
  header.appendChild(titleText);
  header.appendChild(actions);

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
